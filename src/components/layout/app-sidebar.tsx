"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Me } from "@/types/api";

const navItems = [
  { href: "/dashboard", label: "ダッシュボード", icon: "◈" },
  { href: "/employees", label: "社員", icon: "👥" },
  { href: "/annual-events", label: "年次イベント", icon: "🗓" },
  { href: "/notifications", label: "通知", icon: "🔔" },
];

export function AppSidebar({ me }: { me: Me }) {
  const pathname = usePathname();

  return (
    <aside className="w-72 border-r border-white/40 bg-slate-950/95 p-6 text-slate-100 shadow-2xl shadow-slate-950/30">
      <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
        <p className="text-xs uppercase tracking-[0.22em] text-slate-400">Signed in as</p>
        <p className="mt-2 text-sm font-medium text-white">{me.employeeId}</p>
      </div>

      <nav className="mt-6 space-y-2 text-sm">
        {navItems.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`group flex items-center gap-3 rounded-xl px-4 py-3 transition ${
                isActive
                  ? "bg-gradient-to-r from-indigo-500 to-sky-500 text-white shadow-lg shadow-indigo-900/30"
                  : "text-slate-200 hover:bg-white/10 hover:text-white"
              }`}
            >
              <span className="text-base">{item.icon}</span>
              <span className="font-medium">{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}