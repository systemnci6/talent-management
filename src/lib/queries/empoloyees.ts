// src/lib/queries/employees.ts
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { Me } from "@/types/api";
import { canViewEmployee } from "@/lib/permissions/can";

type GetEmployeesInput = {
  me: Me;
  branchId?: string;
  departmentId?: string;
  positionId?: string;
  gradeId?: string;
  keyword?: string;
  page: number;
  limit: number;
  sort?: string;
  order?: "asc" | "desc";
};

export async function getEmployees(input: GetEmployeesInput) {
  const supabase = createSupabaseServerClient();

  const page = Math.max(1, input.page);
  const limit = Math.min(Math.max(1, input.limit), 100);
  const from = (page - 1) * limit;
  const to = from + limit - 1;

  // ▼ join（参照）をまとめて取得
  // ※FKが貼られている前提だとselectが楽です
  let q = supabase
    .from("employees")
    .select(
      `
      id,
      employee_code,
      name,
      status,
      branch_id,
      department_id,
      position_id,
      grade_id,
      manager_employee_id,
      branches:branch_id ( name ),
      departments:department_id ( name ),
      positions:position_id ( name ),
      grades:grade_id ( name )
    `,
      { count: "exact" }
    );

  // ▼ フィルタ
  if (input.branchId) q = q.eq("branch_id", input.branchId);
  if (input.departmentId) q = q.eq("department_id", input.departmentId);
  if (input.positionId) q = q.eq("position_id", input.positionId);
  if (input.gradeId) q = q.eq("grade_id", input.gradeId);

  if (input.keyword) {
    // name or employee_code の部分一致
    q = q.or(`name.ilike.%${input.keyword}%,employee_code.ilike.%${input.keyword}%`);
  }

  // ▼ ソート
  const sortColumn = (input.sort ?? "name") as "name" | "employee_code" | "status";
  q = q.order(sortColumn, { ascending: (input.order ?? "asc") === "asc" });

  // ▼ ページング
  q = q.range(from, to);

  const { data, error, count } = await q;
  if (error) throw error;

  // ▼ 権限（scope）に応じてサーバー側で落とす（最初は簡易）
  const filtered = (data ?? []).filter((row: any) =>
    canViewEmployee(input.me, row.id, row.department_id ?? undefined, row.branch_id ?? undefined)
  );

  return {
    items: filtered.map((row: any) => ({
      id: row.id,
      employeeCode: row.employee_code,
      name: row.name,
      branchName: row.branches?.name ?? "",
      departmentName: row.departments?.name ?? "",
      positionName: row.positions?.name ?? "",
      gradeName: row.grades?.name ?? "",
      managerName: "", // ここは別途joinするか、後でviewにするのが綺麗
      nextInterviewDate: null, // 将来：annual_eventsやfollowupsから算出
      followupStatus: "normal",
      qualificationDueOn: null,
      status: row.status ?? "active",
    })),
    pagination: {
      page,
      limit,
      total: count ?? filtered.length,
      totalPages: Math.max(1, Math.ceil((count ?? filtered.length) / limit)),
    },
  };
}

export async function getEmployeeById(input: { me: Me; employeeId: string }) {
  const supabase = createSupabaseServerClient();

  const { data, error } = await supabase
    .from("employees")
    .select(
      `
      id,
      employee_code,
      name,
      status,
      hire_date,
      branch_id,
      department_id,
      position_id,
      grade_id,
      manager_employee_id,
      mentor_employee_id,
      branches:branch_id ( name ),
      departments:department_id ( name ),
      positions:position_id ( name ),
      grades:grade_id ( name )
    `
    )
    .eq("id", input.employeeId)
    .maybeSingle();

  if (error) throw error;
  if (!data) return null;

  // 権限チェック
  const ok = canViewEmployee(input.me, data.id, data.department_id ?? undefined, data.branch_id ?? undefined);
  if (!ok) return null;

  return {
    summary: {
      id: data.id,
      employeeCode: data.employee_code,
      name: data.name,
      branchName: data.branches?.name ?? "",
      departmentName: data.departments?.name ?? "",
      positionName: data.positions?.name ?? "",
      gradeName: data.grades?.name ?? "",
      hireDate: data.hire_date ?? null,
      managerEmployeeId: data.manager_employee_id ?? null,
      mentorEmployeeId: data.mentor_employee_id ?? null,
      nextInterviewDate: null,
      qualificationDueOn: null,
      alerts: [],
    },
  };
}