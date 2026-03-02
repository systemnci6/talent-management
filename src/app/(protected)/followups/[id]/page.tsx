// src/app/(protected)/followups/page.tsx
import { requireAuth } from "@/lib/auth/require-auth";
import { getFollowups } from "@/lib/queries/followups";
import { FollowupsTable } from "@/components/tables/followups-table";
import { FollowupFilters } from "@/components/filters/followup-filters";

export default async function FollowupsPage({
  searchParams,
}: {
  searchParams: Record<string, string | undefined>;
}) {
  const me = await requireAuth();

  const result = await getFollowups({
    me,
    fiscalYear: Number(searchParams.fiscalYear ?? new Date().getFullYear()),
    quarter: searchParams.quarter ? Number(searchParams.quarter) : undefined,
    status: searchParams.status,
    assigneeEmployeeId: searchParams.assigneeEmployeeId,
    branchId: searchParams.branchId,
    page: Number(searchParams.page ?? 1),
    limit: Number(searchParams.limit ?? 20),
  });

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-semibold">フォロー面談管理</h1>
      <FollowupFilters me={me} initial={searchParams} />
      <FollowupsTable me={me} data={result.items} pagination={result.pagination} />
    </div>
  );
}