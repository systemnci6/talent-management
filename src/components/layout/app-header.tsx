import { Me } from "@/types/api";

export function AppHeader({ me }: { me: Me }) {
  return (
    <header className="sticky top-0 z-20 border-b border-white/40 bg-white/75 px-6 py-4 backdrop-blur-xl">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-indigo-500">Talent Management</p>
          <h1 className="mt-1 text-lg font-semibold text-slate-900">人材マネジメントポータル</h1>
        </div>
        <div className="rounded-full border border-indigo-100 bg-indigo-50 px-4 py-1.5 text-sm font-medium text-indigo-700 shadow-sm">
          {me.role}
        </div>
      </div>
    </header>
  );
}