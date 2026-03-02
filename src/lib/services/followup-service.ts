// src/lib/services/followup-service.ts
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { Me } from "@/types/api";

export async function completeFollowup(input: { me: Me; followupId: string; interviewRecordId?: string }) {
  const supabase = createSupabaseServerClient();

  // 対象の割当を取得して権限確認（担当者 or HR/admin）
  const { data, error } = await supabase
    .from("followup_assignments")
    .select("id, assignee_employee_id, status")
    .eq("id", input.followupId)
    .maybeSingle();

  if (error) throw error;
  if (!data) throw new Error("NOT_FOUND");

  const isAssignee = input.me.employeeId === data.assignee_employee_id;
  const isHrAdmin = input.me.role === "admin" || input.me.role === "hr";
  if (!isAssignee && !isHrAdmin) throw new Error("FORBIDDEN");

  // 面談記録の紐づけ必須にしたいならここでチェック
  // if (!input.interviewRecordId) throw new Error("INTERVIEW_REQUIRED");

  const { error: updErr } = await supabase
    .from("followup_assignments")
    .update({ status: "done" })
    .eq("id", input.followupId);

  if (updErr) throw updErr;

  return { ok: true };
}