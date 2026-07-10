import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { OpportunityForm } from "../../../OpportunityForm";
import { updateOpportunity } from "../../../actions";
import { toDatetimeLocal } from "@/lib/utils";
import { IconArrow } from "@/components/Icons";

export const metadata = { title: "Edit opportunity — Seva Portal" };

export default async function EditOpportunityPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: opp } = await supabase.from("opportunities").select("*").eq("id", id).maybeSingle();
  if (!opp) notFound();

  const action = updateOpportunity.bind(null, id);

  return (
    <div className="page">
      <div className="container" style={{ maxWidth: 760 }}>
        <Link href={`/admin/opportunities/${id}/review`} className="muted" style={{ fontSize: "0.9rem", display: "inline-flex", alignItems: "center", gap: 4 }}>
          <IconArrow width={16} height={16} style={{ transform: "rotate(180deg)" }} /> Back to review
        </Link>
        <span className="eyebrow" style={{ marginTop: "1rem", display: "inline-flex" }}>Edit</span>
        <h1 style={{ margin: "0.4rem 0 1.4rem" }}>{opp.title}</h1>
        <div className="card">
          <OpportunityForm
            action={action}
            submitLabel="Save changes"
            showStatus
            defaults={{
              title: opp.title,
              description: opp.description ?? "",
              location: opp.location ?? "",
              start_datetime: toDatetimeLocal(opp.start_datetime),
              end_datetime: toDatetimeLocal(opp.end_datetime),
              estimated_hours: Number(opp.estimated_hours),
              slots: opp.slots,
              status: opp.status,
            }}
          />
        </div>
      </div>
    </div>
  );
}
