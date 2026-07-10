import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getUserAndProfile } from "@/lib/auth";
import { formatHours, formatDate, ageFromDob } from "@/lib/utils";
import { IconUsers, IconMail, IconPhone } from "@/components/Icons";

export const metadata = { title: "Volunteers — Seva Portal" };

export default async function VolunteersPage() {
  const { profile } = await getUserAndProfile();
  if (profile?.role !== "admin") redirect("/dashboard");

  const supabase = await createClient();

  const [{ data: people }, { data: signups }] = await Promise.all([
    supabase
      .from("profiles")
      .select("id, full_name, email, phone, role, total_hours, no_show_count, date_of_birth, created_at")
      .order("total_hours", { ascending: false }),
    supabase.from("signups").select("user_id, status"),
  ]);

  const approvedByUser = new Map<string, number>();
  const pendingByUser = new Map<string, number>();
  for (const s of signups ?? []) {
    if (s.status === "approved") approvedByUser.set(s.user_id, (approvedByUser.get(s.user_id) ?? 0) + 1);
    if (s.status === "pending") pendingByUser.set(s.user_id, (pendingByUser.get(s.user_id) ?? 0) + 1);
  }

  const rows = people ?? [];
  const totalVolunteers = rows.length;
  const totalHours = rows.reduce((s, p) => s + Number(p.total_hours ?? 0), 0);
  const totalNoShows = rows.reduce((s, p) => s + Number(p.no_show_count ?? 0), 0);
  const admins = rows.filter((p) => p.role === "admin").length;

  return (
    <div className="page">
      <div className="container">
        <div className="section-head">
          <div>
            <span className="eyebrow">Administration</span>
            <h1 style={{ margin: "0.3rem 0 0" }}>Volunteers &amp; hours</h1>
            <p className="soft mb-0" style={{ marginTop: "0.4rem" }}>
              Everyone in the portal and their verified service hours.
            </p>
          </div>
        </div>

        <div className="grid grid-stats">
          <div className="stat"><div className="stat-label">People</div><div className="stat-value">{totalVolunteers}</div></div>
          <div className="stat"><div className="stat-label">Verified hours</div><div className="stat-value">{formatHours(totalHours)}</div></div>
          <div className="stat"><div className="stat-label">Admins</div><div className="stat-value">{admins}</div></div>
          <div className="stat"><div className="stat-label">No-shows</div><div className="stat-value" style={{ color: totalNoShows ? "var(--danger)" : undefined }}>{totalNoShows}</div></div>
        </div>

        <div className="section-head" style={{ marginTop: "2.4rem" }}>
          <div><span className="eyebrow">Directory</span><h2>Everyone</h2></div>
        </div>

        {rows.length === 0 ? (
          <div className="empty"><p className="mb-0">No volunteers have joined yet.</p></div>
        ) : (
          <div className="table-wrap">
            <table className="data">
              <thead>
                <tr>
                  <th>Volunteer</th>
                  <th>Contact</th>
                  <th>Role</th>
                  <th style={{ textAlign: "center" }}>Events</th>
                  <th style={{ textAlign: "center" }}>No-shows</th>
                  <th style={{ textAlign: "right" }}>Hours</th>
                  <th>Joined</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((p) => {
                  const age = ageFromDob(p.date_of_birth);
                  const pendingN = pendingByUser.get(p.id) ?? 0;
                  return (
                    <tr key={p.id}>
                      <td>
                        <div style={{ fontWeight: 600 }}>
                          {p.full_name ?? "—"}
                          {age !== null && age < 18 && (
                            <span className="badge badge-pending" style={{ marginLeft: 8 }}>Minor</span>
                          )}
                        </div>
                        {pendingN > 0 && <span className="muted" style={{ fontSize: "0.8rem" }}>{pendingN} pending review</span>}
                      </td>
                      <td className="soft" style={{ fontSize: "0.85rem" }}>
                        {p.email && <div className="row gap-sm"><IconMail width={14} height={14} /> <a href={`mailto:${p.email}`}>{p.email}</a></div>}
                        {p.phone && <div className="row gap-sm"><IconPhone width={14} height={14} /> <a href={`tel:${p.phone}`}>{p.phone}</a></div>}
                      </td>
                      <td>
                        <span className={`badge ${p.role === "admin" ? "badge-completed" : "badge-closed"}`}>{p.role}</span>
                      </td>
                      <td style={{ textAlign: "center" }}>
                        <span className="chip"><IconUsers width={14} height={14} /> {approvedByUser.get(p.id) ?? 0}</span>
                      </td>
                      <td style={{ textAlign: "center", color: p.no_show_count ? "var(--danger)" : "var(--ink-mute)", fontWeight: p.no_show_count ? 700 : 400 }}>
                        {p.no_show_count}
                      </td>
                      <td style={{ textAlign: "right" }}>
                        <span style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "1.05rem", color: Number(p.total_hours) > 0 ? "var(--saffron-deep)" : "var(--ink-mute)" }}>
                          {formatHours(Number(p.total_hours ?? 0))}
                        </span>
                      </td>
                      <td className="soft" style={{ whiteSpace: "nowrap", fontSize: "0.85rem" }}>{formatDate(p.created_at)}</td>
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
