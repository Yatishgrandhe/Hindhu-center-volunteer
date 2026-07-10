import Link from "next/link";
import { OpportunityForm } from "../../OpportunityForm";
import { createOpportunity } from "../../actions";
import { IconArrow } from "@/components/Icons";

export const metadata = { title: "New opportunity — Seva Portal" };

export default function NewOpportunityPage() {
  return (
    <div className="page">
      <div className="container" style={{ maxWidth: 760 }}>
        <Link href="/admin" className="muted" style={{ fontSize: "0.9rem", display: "inline-flex", alignItems: "center", gap: 4 }}>
          <IconArrow width={16} height={16} style={{ transform: "rotate(180deg)" }} /> Back to admin
        </Link>
        <span className="eyebrow" style={{ marginTop: "1rem", display: "inline-flex" }}>Create</span>
        <h1 style={{ margin: "0.4rem 0 1.4rem" }}>New volunteer opportunity</h1>
        <div className="card">
          <OpportunityForm action={createOpportunity} submitLabel="Create opportunity" />
        </div>
      </div>
    </div>
  );
}
