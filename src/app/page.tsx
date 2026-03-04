import Link from "next/link";

const quickLinks = [
  { href: "/login", label: "ログイン", description: "セキュアにサインイン" },
  { href: "/dashboard", label: "ダッシュボード", description: "全体状況を俯瞰" },
  { href: "/employees", label: "社員一覧", description: "人材データを管理" },
  { href: "/annual-events", label: "年間イベント", description: "重要日程を把握" },
  { href: "/notifications", label: "通知", description: "最新アラートを確認" },
];

export default function HomePage() {
  return (
    <main className="min-h-dvh bg-[radial-gradient(circle_at_top_right,_#6366f1_0%,_#f8fafc_42%,_#e2e8f0_100%)] px-6 py-16">
      <div className="mx-auto max-w-5xl">
        <section className="rounded-3xl border border-white/60 bg-white/75 p-10 shadow-2xl shadow-indigo-900/10 backdrop-blur-lg">
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-indigo-600">Smart HR Workspace</p>
          <h1 className="mt-4 text-4xl font-bold tracking-tight text-slate-900">Talent Management</h1>
          <p className="mt-4 max-w-2xl text-slate-600">
            人材情報・面談・フォローアップを横断して管理できる、洗練されたワークスペースです。
            KPIや通知を直感的に確認し、次のアクションへスムーズに進めます。
          </p>

          <section className="mt-10">
            <h2 className="text-lg font-semibold text-slate-900">クイックアクセス</h2>
            <ul className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="group block rounded-2xl border border-slate-200/70 bg-white/80 px-5 py-4 shadow-sm transition hover:-translate-y-0.5 hover:border-indigo-200 hover:shadow-lg"
                  >
                    <div className="text-sm font-semibold text-slate-900 transition group-hover:text-indigo-700">
                      {link.label}
                    </div>
                    <div className="mt-1 text-xs text-slate-500">{link.description}</div>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        </section>
      </div>
    </main>
  );
}