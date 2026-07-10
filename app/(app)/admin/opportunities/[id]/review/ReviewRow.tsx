"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { reviewSignup } from "../../../actions";
import { IconCheck, IconX } from "@/components/Icons";
import { formatHours } from "@/lib/utils";

type Props = {
  signupId: string;
  opportunityId: string;
  status: "pending" | "approved" | "no_show";
  hoursAwarded: number;
  estimatedHours: number;
  memberName: string;
  memberPhone: string | null;
  memberEmail: string | null;
  isMinor: boolean;
};

export function ReviewRow({
  signupId,
  opportunityId,
  status,
  hoursAwarded,
  estimatedHours,
  memberName,
  memberPhone,
  memberEmail,
  isMinor,
}: Props) {
  const [pending, start] = useTransition();
  const [hours, setHours] = useState<number>(
    status === "approved" ? hoursAwarded : estimatedHours
  );
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  function act(next: "approved" | "no_show" | "pending", h?: number) {
    setError(null);
    start(async () => {
      const res = await reviewSignup(signupId, opportunityId, next, h);
      if (!res.ok) setError(res.error ?? "Something went wrong.");
      else router.refresh();
    });
  }

  return (
    <tr>
      <td>
        <div style={{ fontWeight: 600 }}>
          {memberName}
          {isMinor && <span className="badge badge-pending" style={{ marginLeft: 8 }}>Minor</span>}
        </div>
        <div className="muted" style={{ fontSize: "0.82rem" }}>
          {memberPhone ?? "—"}{memberEmail ? ` · ${memberEmail}` : ""}
        </div>
      </td>
      <td>
        <span className={`badge badge-${status}`}>{status === "no_show" ? "No-show" : status}</span>
        {status === "approved" && (
          <div className="muted" style={{ fontSize: "0.8rem", marginTop: 4 }}>{formatHours(hoursAwarded)} hrs credited</div>
        )}
        {error && <div className="alert alert-error mb-0" style={{ marginTop: 6, padding: "0.4rem 0.6rem" }}>{error}</div>}
      </td>
      <td style={{ textAlign: "right" }}>
        <div className="row gap-sm wrap" style={{ justifyContent: "flex-end" }}>
          {status !== "approved" && (
            <div className="row gap-sm" style={{ background: "var(--cream-deep)", borderRadius: 999, padding: "0.2rem 0.2rem 0.2rem 0.7rem" }}>
              <label className="muted" style={{ fontSize: "0.78rem", fontWeight: 600 }}>hrs</label>
              <input
                type="number"
                step="0.5"
                min="0"
                value={hours}
                onChange={(e) => setHours(parseFloat(e.target.value) || 0)}
                className="input"
                style={{ width: 62, padding: "0.35rem 0.5rem", height: 34 }}
                aria-label={`Hours for ${memberName}`}
              />
              <button className="btn btn-primary btn-sm" disabled={pending} onClick={() => act("approved", hours)}>
                <IconCheck width={15} height={15} /> Approve
              </button>
            </div>
          )}
          {status !== "no_show" && (
            <button className="btn btn-danger btn-sm" disabled={pending} onClick={() => act("no_show")}>
              <IconX width={15} height={15} /> No-show
            </button>
          )}
          {status !== "pending" && (
            <button className="btn btn-ghost btn-sm" disabled={pending} onClick={() => act("pending")}>
              Reset
            </button>
          )}
        </div>
      </td>
    </tr>
  );
}
