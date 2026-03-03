import { notFound, redirect } from "next/navigation";
import { requireAuth } from "@/lib/auth/require-auth";
import { getTemplateById } from "@/lib/queries/templates";
import { TemplateForm } from "@/components/forms/template-form";

export default async function TemplateEditPage({
  params,
}: {
  params: { id: string };
}) {
  const me = await requireAuth();

  if (me.role !== "admin" && me.role !== "hr") {
    redirect("/unauthorized");
  }

  const template = await getTemplateById({ me, id: params.id });
  if (!template) return notFound();

  return (
    <div className="space-y-4 max-w-4xl">
      <h1 className="text-xl font-semibold">テンプレート編集</h1>
      <TemplateForm mode="edit" initialData={template} />
    </div>
  );
}