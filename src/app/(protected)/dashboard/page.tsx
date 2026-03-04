// src/app/(protected)/dashboard/page.tsx
import Link from "next/link";
import { requireAuth } from "@/lib/auth/require-auth";
import { getDashboardData } from "@/lib/queries/dashboard";

export default async function DashboardPage() {
  const me = await requireAuth();
  const data = await getDashboardData({ me });

  return (
    <div className="space-y-6">
      <div className="rounded-3xl border border-white/60 bg-white/80 p-6 shadow-lg shadow-indigo-900/10 backdrop-blur">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-indigo-500">Dashboard Overview</p>
        <h1 className="mt-2 text-2xl font-semibold text-slate-900">ダッシュボード</h1>
      </div>

      <section className="grid grid-cols-1 gap-4 md:grid-cols-4">
        <KpiCard label="今月の面談件数" value={data.kpis.interviewCount} />
        <KpiCard label="未実施フォロー" value={data.kpis.pendingFollowupCount} />
        <KpiCard label="期限超過" value={data.kpis.overdueFollowupCount} />
        <KpiCard label="今週イベント" value={data.kpis.weekEventCount} />
      </section>

      <section className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <KpiCard label="資格期限 30日以内" value={data.kpis.qualification30Count} />
        <KpiCard label="資格期限 90日以内" value={data.kpis.qualification90Count} />
        <KpiCard label="資格失効" value={data.kpis.qualificationExpiredCount} />
      </section>

      <section className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Box title="直近期限のフォロー">
          <ul className="space-y-2 text-sm">
            {data.dueFollowups.length === 0 ? (
              <li className="text-slate-500">対象なし</li>
            ) : (
              data.dueFollowups.map((item) => (
                <li key={item.id} className="rounded-xl border border-slate-200 bg-slate-50/80 p-3">
                  <div className="font-medium text-slate-900">{item.employeeName}</div>
                  <div>種別：{item.followupType}</div>
                  <div>担当：{item.assigneeName}</div>
                  <div>期限：{item.dueDate}</div>
                  <Link className="mt-1 inline-block text-xs font-medium text-indigo-600 hover:text-indigo-800" href={`/followups/${item.id}`}>
                    詳細を見る
                  </Link>
                </li>
              ))
            )}
          </ul>
        </Box>

        <Box title="期限超過フォロー">
          <ul className="space-y-2 text-sm">
            {data.overdueFollowups.length === 0 ? (
              <li className="text-slate-500">期限超過なし</li>
            ) : (
              data.overdueFollowups.map((item) => (
                <li key={item.id} className="rounded-xl border border-red-100 bg-red-50/80 p-3">
                  <div className="font-medium text-red-700">{item.employeeName}</div>
                  <div>種別：{item.followupType}</div>
                  <div>担当：{item.assigneeName}</div>
                  <div>期限：{item.dueDate}</div>
                  <Link className="mt-1 inline-block text-xs font-medium text-red-600 hover:text-red-700" href={`/followups/${item.id}`}>
                    詳細を見る
                  </Link>
                </li>
              ))
            )}
          </ul>
        </Box>
      </section>

      <section className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Box title="資格期限アラート">
          <ul className="space-y-2 text-sm">
            {data.qualificationAlerts.length === 0 ? (
              <li className="text-slate-500">対象なし</li>
            ) : (
              data.qualificationAlerts.map((item) => (
                <li key={item.id} className="rounded-xl border border-slate-200 bg-slate-50/80 p-3">
                  <div className="font-medium text-slate-900">{item.employeeName}</div>
                  <div>資格：{item.qualificationName}</div>
                  <div className="font-medium text-red-600">期限：{item.expiresOn}</div>
                  <div>状態：{item.status}</div>
                </li>
              ))
            )}
          </ul>
        </Box>

        <Box title="新着通知">
          <ul className="space-y-2 text-sm">
            {data.notifications.length === 0 ? (
              <li className="text-slate-500">通知なし</li>
            ) : (
              data.notifications.map((item) => (
                <li key={item.id} className="rounded-xl border border-slate-200 bg-slate-50/80 p-3">
                  <div className="font-medium text-slate-900">{item.title}</div>
                  <div className="text-slate-600">{item.body}</div>
                  <div className="mt-1 text-xs text-slate-500">{new Date(item.createdAt).toLocaleString()}</div>
                </li>
              ))
            )}
          </ul>
        </Box>
      </section>
    </div>
  );
}

function KpiCard({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-2xl border border-white/60 bg-white/85 p-4 shadow-md shadow-indigo-900/5 backdrop-blur">
      <div className="text-sm text-slate-500">{label}</div>
      <div className="mt-2 text-3xl font-semibold text-slate-900">{value}</div>
    </div>
  );
}

function Box({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-white/60 bg-white/85 p-4 shadow-md shadow-indigo-900/5 backdrop-blur">
      <div className="mb-3 font-semibold text-slate-900">{title}</div>
      {children}
    </div>
  );
}