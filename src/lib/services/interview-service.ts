// src/lib/services/interview-service.ts
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { Me } from "@/types/api";
import { canCreateInterview } from "@/lib/permissions/can";

export async function createInterview(input: { me: Me; input: any }) {
  if (!canCreateInterview(input.me)) {
    throw new Error("FORBIDDEN");
  }

  const supabase = createSupabaseServerClient();

  // 1) 面談記録の作成
  const { data: created, error: createErr } = await supabase
    .from("interview_records")
    .insert({
      employee_id: input.input.employeeId,
      interviewer_employee_id: input.input.interviewerEmployeeId,
      interview_date: input.input.interviewDate,
      interview_type: input.input.interviewType,
      assignment_id: input.input.assignmentId ?? null,
      facts_observed: input.input.factsObserved ?? null,
      employee_voice: input.input.employeeVoice ?? null,
      positive_points: input.input.positivePoints ?? null,
      issues: input.input.issues ?? null,
      response_policy: input.input.responsePolicy ?? null,
      action_employee: input.input.actionEmployee ?? null,
      action_company: input.input.actionCompany ?? null,
      next_interview_date: input.input.nextInterviewDate ?? null,
      visibility: input.input.visibility,
    })
    .select("id, employee_id, assignment_id")
    .single();

  if (createErr) throw createErr;

  // 2) assignment（フォロー割当）の完了化（任意）
  if (created.assignment_id && input.input.autoCompleteAssignment) {
    const { error: updErr } = await supabase
      .from("followup_assignments")
      .update({ status: "done" })
      .eq("id", created.assignment_id);

    if (updErr) throw updErr;
  }

  // 3) 通知生成（任意：最小なら省略でもOK）
  // 例：対象社員に「面談記録が作成されました（本人公開の場合）」通知
  // 例：HRに「フォロー完了」通知
  // ここは運用に合わせてON/OFFできるようにするのが理想
  // await createNotification(...)

  return { id: created.id };
}