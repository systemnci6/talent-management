import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { AuthLoginForm } from "@/components/auth-login-form";

const errorMessages: Record<string, string> = {
  missing: "メールアドレスとパスワードを入力してください。",
  invalid: "メールアドレスまたはパスワードが正しくありません。",
};

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const supabase = createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    redirect("/dashboard");
  }

  const params = await searchParams;
  const rawError = params.error;
  const errorKey = Array.isArray(rawError) ? rawError[0] : rawError;
  const errorMessage = errorKey ? errorMessages[errorKey] ?? null : null;

  return (
    <main className="relative flex min-h-dvh items-center justify-center overflow-hidden bg-slate-950 px-4 py-12">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_15%_20%,rgba(99,102,241,0.35),transparent_40%),radial-gradient(circle_at_80%_0%,rgba(56,189,248,0.3),transparent_35%),radial-gradient(circle_at_80%_70%,rgba(168,85,247,0.3),transparent_45%)]" />
      <section className="relative w-full max-w-md rounded-3xl border border-white/20 bg-white/10 p-8 shadow-2xl shadow-black/40 backdrop-blur-xl">
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-indigo-200">Welcome back</p>
        <h1 className="mt-3 text-3xl font-bold text-white">Talent Management</h1>
        <p className="mt-2 text-sm text-slate-200">アカウント情報を入力してログインしてください。</p>
        <AuthLoginForm errorMessage={errorMessage} />
      </section>
    </main>
  );
}