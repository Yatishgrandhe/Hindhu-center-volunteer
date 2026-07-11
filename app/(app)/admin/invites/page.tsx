import Link from "next/link";
import { headers } from "next/headers";
import { createClient } from "@/lib/supabase/server";
import { InviteManager } from "./InviteManager";
import { RevokeButton, RevokeAllButton } from "./RevokeControls";
import { IconArrow } from "@/components/Icons";
import { formatDateTime } from "@/lib/utils";

export const metadata = { title: "Admin invites — Seva Portal" };

export default async function InvitesPage() {
  const supabase = await createClient();
  const h = await headers();
  const host = h.get("host") ?? "localhost:3000";
  const proto = h.get("x-forwarded-proto") ?? (host.startsWith("localhost") ? "http" : "https");
  const origin = `${proto}://${host}`;

  const { data: invites } = await supabase
    .from("admin_invites")
    .select("id, token, created_at, expires_at, used_at, revoked_at")
    .order("created_at", { ascending: false });

  const now = Date.now();
  const activeCount = (invites ?? []).filter(
    (inv) => !inv.used_at && !inv.revoked_at && new Date(inv.expires_at).getTime() >= now
  ).length;

  return (
    <div className="page">
      <div className="container" style={{ maxWidth: 880 }}>
        <Link href="/admin" className="muted" style={{ fontSize: "0.9rem", display: "inline-flex", alignItems: "center", gap: 4 }}>
          <IconArrow width={16} height={16} style={{ transform: "rotate(180deg)" }} /> Back to admin
        </Link>
        <span className="eyebrow" style={{ marginTop: "1rem", display: "inline-flex" }}>Access</span>
        <h1 style={{ margin: "0.4rem 0 1.4rem" }}>Admin invites</h1>

        <InviteManager origin={origin} />

        <div className="section-head" style={{ marginTop: "2.2rem" }}>
          <div><span className="eyebrow">History</span><h2>Invite links</h2></div>
          <RevokeAllButton activeCount={activeCount} />
        </div>

        {!invites || invites.length === 0 ? (
          <div className="empty"><p className="mb-0">No invite links have been created yet.</p></div>
        ) : (
          <div className="table-wrap">
            <table className="data">
              <thead>
                <tr><th>Created</th><th>Expires</th><th>Status</th><th>Link</th><th style={{ textAlign: "right" }}></th></tr>
              </thead>
              <tbody>
                {invites.map((inv) => {
                  const used = !!inv.used_at;
                  const revoked = !used && !!inv.revoked_at;
                  const expired = !used && !revoked && new Date(inv.expires_at).getTime() < now;
                  const active = !used && !revoked && !expired;
                  return (
                    <tr key={inv.id}>
                      <td className="soft">{formatDateTime(inv.created_at)}</td>
                      <td className="soft">{formatDateTime(inv.expires_at)}</td>
                      <td>
                        {/* Green only when the link still works; used / disabled / expired are all red. */}
                        <span className={`badge ${active ? "badge-open" : "badge-no_show"}`}>
                          {used ? "Used" : revoked ? "Disabled" : expired ? "Expired" : "Active"}
                        </span>
                      </td>
                      <td className="soft" style={{ fontFamily: "monospace", fontSize: "0.78rem" }}>
                        {active ? `${origin}/join/${inv.token}` : `…${inv.token.slice(-8)}`}
                      </td>
                      <td style={{ textAlign: "right" }}>
                        {active && <RevokeButton id={inv.id} />}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
