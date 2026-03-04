// src/app/(protected)/layout.tsx
import { ReactNode } from "react";
import { requireAuth } from "@/lib/auth/require-auth";
import { AppSidebar } from "@/components/layout/app-sidebar";
import { AppHeader } from "@/components/layout/app-header";

export default async function ProtectedLayout({ children }: { children: ReactNode }) {
  const me = await requireAuth(); // { userId, employeeId, role, scopes... }

  return (
    <div className="flex min-h-dvh bg-gradient-to-br from-slate-100 via-white to-indigo-100">
      <AppSidebar me={me} />
      <div className="flex flex-1 flex-col">
        <AppHeader me={me} />
        <main className="flex-1 p-6 lg:p-8">
          <div className="mx-auto w-full max-w-7xl">{children}</div>
        </main>
      </div>
    </div>
  );
}