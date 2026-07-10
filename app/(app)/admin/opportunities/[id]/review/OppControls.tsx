"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { setOpportunityStatus, deleteOpportunity } from "../../../actions";
import type { OpportunityStatus } from "@/lib/database.types";

export function OppControls({
  id,
  status,
}: {
  id: string;
  status: OpportunityStatus;
}) {
  const [pending, start] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  function changeStatus(next: OpportunityStatus) {
    setError(null);
    start(async () => {
      const res = await setOpportunityStatus(id, next);
      if (!res.ok) setError(res.error ?? "Failed to update.");
      else router.refresh();
    });
  }

  function remove() {
    if (!confirm("Delete this opportunity and all of its sign-ups? This cannot be undone.")) return;
    setError(null);
    start(async () => {
      const res = await deleteOpportunity(id);
      if (!res.ok) setError(res.error ?? "Failed to delete.");
      else router.push("/admin");
    });
  }

  return (
    <div className="stack gap-sm" style={{ alignItems: "flex-end" }}>
      <div className="row gap-sm wrap" style={{ justifyContent: "flex-end" }}>
        {status === "open" ? (
          <button className="btn btn-ghost btn-sm" disabled={pending} onClick={() => changeStatus("closed")}>Close sign-ups</button>
        ) : (
          <button className="btn btn-ghost btn-sm" disabled={pending} onClick={() => changeStatus("open")}>Reopen</button>
        )}
        {status !== "completed" && (
          <button className="btn btn-ghost btn-sm" disabled={pending} onClick={() => changeStatus("completed")}>Mark completed</button>
        )}
        <button className="btn btn-danger btn-sm" disabled={pending} onClick={remove}>Delete</button>
      </div>
      {error && <div className="alert alert-error mb-0" style={{ padding: "0.4rem 0.7rem" }}>{error}</div>}
    </div>
  );
}
