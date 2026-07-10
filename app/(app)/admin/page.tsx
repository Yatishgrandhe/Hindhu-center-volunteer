import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { IconPlus, IconLink, IconCalendar, IconUsers, IconHours, IconArrow } from "@/components/Icons";
import { formatTimeRange, formatHours, isPast } from "@/lib/utils";

export const metadata = { title: "Admin — Seva Portal" };

export default async function AdminDashboard() {
  const supabase = await createClient();

  const [{ data: opps }, { data: profiles }, { data: signups }] = await Promise.all([
    supabase.from("opportunities").select("*").order("start_datetime", { ascending: false }),
    supabase.from("profiles").select("id, total_hours, no_show_count, role"),
    supabase.from("signups").select("opportunity_id, status"),
  ]);

  const totalVolunteers = (profiles ?? []).length;
  const totalHours = (profiles ?? []).reduce((s, p) => s + Number(p.total_hours ?? 0), 0);
  const totalNoShows = (profiles ?? []).reduce((s, p) => s + Number(p.no_show_count ?? 0), 0);
  const upcomingCount = (opps ?? []).filter((o) => !isPast(o.end_datetime) && o.status === "open").length;

  const countsByOpp = new Map<string, { taken: number; pending: number }>();
  for (const s of signups ?? []) {
    const c = countsByOpp.get(s.opportunity_id) ?? { taken: 0, pending: 0 };
    if (s.status !== "no_show") c.taken++;
    if (s.status === "pending") c.pending++;
    countsByOpp.set(s.opportunity_id, c);
  }

  return (
    <div className="page">
      <div className="container">
        <div className="section-head">
          <div>
            <span className="eyebrow">Administration</span>
            <h1 style={{ margin: "0.3rem 0 0" }}>Admin dashboard</h1>
          </div>
          <div className="row gap-sm wrap">
            <Link href="/admin/volunteers" className="btn btn-ghost"><IconUsers width={16} height={16} /> Volunteers</Link>
            <Link href="/admin/invites" className="btn btn-ghost"><IconLink width={16} height={16} /> Invite admin</Link>
            <Link href="/admin/opportunities/new" className="btn btn-primary"><IconPlus width={16} height={16} /> New opportunity</Link>
          </div>
        </div>

        <div className="grid grid-stats">
          <div className="stat"><div className="stat-label">Volunteers</div><div className="stat-value">{totalVolunteers}</div></div>
          <div className="stat"><div className="stat-label">Hours logged</div><div className="stat-value">{formatHours(totalHours)}</div></div>
          <div className="stat"><div className="stat-label">Upcoming events</div><div className="stat-value">{upcomingCount}</div></div>
          <div className="stat"><div className="stat-label">No-shows</div><div className="stat-value" style={{ color: totalNoShows ? "var(--danger)" : undefined }}>{totalNoShows}</div></div>
        </div>

        <div className="section-head" style={{ marginTop: "2.6rem" }}>
          <div><span className="eyebrow">Manage</span><h2>Opportunities</h2></div>
        </div>

        {!opps || opps.length === 0 ? (
          <div className="empty">
            <div className="empty-om">ॐ</div>
            <h3 style={{ color: "var(--ink)" }}>No opportunities yet</h3>
            <p>Create your first volunteer opportunity to get started.</p>
            <Link href="/admin/opportunities/new" className="btn btn-primary"><IconPlus width={16} height={16} /> New opportunity</Link>
          </div>
        ) : (
          <div className="table-wrap">
            <table className="data">
              <thead>
                <tr><th>Opportunity</th><th>When</th><th>Status</th><th>Signups</th><th>Pending</th><th></th></tr>
              </thead>
              <tbody>
                {opps.map((o) => {
                  const c = countsByOpp.get(o.id) ?? { taken: 0, pending: 0 };
                  return (
                    <tr key={o.id}>
                      <td style={{ fontWeight: 600 }}>{o.title}</td>
                      <td className="soft" style={{ whiteSpace: "nowrap" }}>{formatTimeRange(o.start_datetime, o.end_datetime)}</td>
                      <td><span className={`badge badge-${o.status}`}>{o.status}</span></td>
                      <td><span className="chip"><IconUsers width={14} height={14} /> {c.taken}/{o.slots}</span></td>
                      <td>{c.pending > 0 ? <span className="badge badge-pending">{c.pending}</span> : <span className="muted">0</span>}</td>
                      <td style={{ textAlign: "right", whiteSpace: "nowrap" }}>
                        <Link href={`/admin/opportunities/${o.id}/edit`} className="btn btn-ghost btn-sm" style={{ marginRight: 6 }}>Edit</Link>
                        <Link href={`/admin/opportunities/${o.id}/review`} className="btn btn-ghost btn-sm">Review <IconArrow width={15} height={15} /></Link>
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
