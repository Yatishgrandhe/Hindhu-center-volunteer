import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getUserAndProfile } from "@/lib/auth";
import { IconCalendar, IconPin, IconHours, IconArrow } from "@/components/Icons";
import { formatTimeRange, formatHours, isPast } from "@/lib/utils";
import type { Opportunity, Signup } from "@/lib/database.types";

export const metadata = { title: "My Hours — Seva Portal" };

type Row = Signup & { opportunities: Opportunity | null };

const MILESTONE = 50; // hours goal used only to fill the progress dial

export default async function DashboardPage() {
  const supabase = await createClient();
  const { user, profile } = await getUserAndProfile();

  // Admins are organizers, not volunteers — send them to the admin dashboard.
  if (profile?.role === "admin") redirect("/admin");

  const { data } = await supabase
    .from("signups")
    .select("*, opportunities(*)")
    .eq("user_id", user!.id)
    .order("created_at", { ascending: false });

  const rows = (data ?? []) as unknown as Row[];

  const upcoming = rows
    .filter((r) => r.opportunities && !isPast(r.opportunities.end_datetime) && r.status !== "no_show")
    .sort((a, b) => new Date(a.opportunities!.start_datetime).getTime() - new Date(b.opportunities!.start_datetime).getTime());

  const history = rows.filter((r) => !r.opportunities || isPast(r.opportunities.end_datetime) || r.status !== "pending");

  const totalHours = Number(profile?.total_hours ?? 0);
  const pendingCount = rows.filter((r) => r.status === "pending").length;
  const approvedCount = rows.filter((r) => r.status === "approved").length;
  const noShowCount = Number(profile?.no_show_count ?? 0);
  const dialPct = Math.min(100, Math.round((totalHours / MILESTONE) * 100));

  const firstName = (profile?.full_name ?? "").split(" ")[0] || "friend";

  return (
    <div className="page">
      <div className="container">
        <span className="eyebrow">Your seva</span>
        <h1 style={{ margin: "0.3rem 0 1.4rem" }}>Namaste, {firstName}</h1>

        <div className="grid" style={{ gridTemplateColumns: "1.3fr 1fr", alignItems: "stretch" }}>
          <div className="hours-hero">
            <div className="hours-dial" style={{ ["--v" as string]: dialPct }}>
              <b>
                {formatHours(totalHours)}
                <small>hours</small>
              </b>
            </div>
            <div>
              <h3 style={{ margin: 0 }}>Verified volunteer hours</h3>
              <p className="soft mb-0" style={{ marginTop: "0.35rem" }}>
                {totalHours > 0
                  ? `Thank you for your service. That's ${dialPct}% toward a ${MILESTONE}-hour milestone.`
                  : "Your approved hours will appear here once you complete your first seva."}
              </p>
            </div>
          </div>

          <div className="grid grid-stats" style={{ gridTemplateColumns: "1fr 1fr" }}>
            <div className="stat"><div className="stat-label">Approved</div><div className="stat-value">{approvedCount}</div></div>
            <div className="stat"><div className="stat-label">Pending</div><div className="stat-value">{pendingCount}</div></div>
            <div className="stat"><div className="stat-label">Upcoming</div><div className="stat-value">{upcoming.length}</div></div>
            <div className="stat"><div className="stat-label">No-shows</div><div className="stat-value" style={{ color: noShowCount ? "var(--danger)" : undefined }}>{noShowCount}</div></div>
          </div>
        </div>

        {/* Upcoming commitments */}
        <div className="section-head" style={{ marginTop: "2.6rem" }}>
          <div><span className="eyebrow">Committed</span><h2>Upcoming events</h2></div>
          <Link href="/opportunities" className="btn btn-ghost btn-sm">Find more <IconArrow width={16} height={16} /></Link>
        </div>

        {upcoming.length === 0 ? (
          <div className="empty">
            <div className="empty-om">ॐ</div>
            <h3 style={{ color: "var(--ink)" }}>No upcoming commitments</h3>
            <p>Browse opportunities and sign up for your next seva.</p>
            <Link href="/opportunities" className="btn btn-primary">Browse opportunities</Link>
          </div>
        ) : (
          <div className="grid grid-cards">
            {upcoming.map((r) => (
              <Link key={r.id} href={`/opportunities/${r.opportunity_id}`} className="card card-hover opp-card" style={{ textDecoration: "none", color: "inherit" }}>
                <span className={`badge badge-${r.status}`}>{r.status === "pending" ? "Pending review" : "Approved"}</span>
                <h3 className="opp-title">{r.opportunities!.title}</h3>
                <div className="meta" style={{ flexDirection: "column", gap: "0.4rem", alignItems: "flex-start" }}>
                  <span className="meta-item"><IconCalendar /> {formatTimeRange(r.opportunities!.start_datetime, r.opportunities!.end_datetime)}</span>
                  {r.opportunities!.location && <span className="meta-item"><IconPin /> {r.opportunities!.location}</span>}
                  <span className="meta-item"><IconHours /> {formatHours(r.opportunities!.estimated_hours)} hrs est.</span>
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* History */}
        <div className="section-head" style={{ marginTop: "2.6rem" }}>
          <div><span className="eyebrow">Record</span><h2>Service history</h2></div>
        </div>
        {history.length === 0 ? (
          <div className="empty"><p className="mb-0">Your completed and reviewed seva will be listed here.</p></div>
        ) : (
          <div className="table-wrap">
            <table className="data">
              <thead>
                <tr><th>Opportunity</th><th>Date</th><th>Status</th><th style={{ textAlign: "right" }}>Hours</th></tr>
              </thead>
              <tbody>
                {history.map((r) => (
                  <tr key={r.id}>
                    <td style={{ fontWeight: 600 }}>{r.opportunities?.title ?? "—"}</td>
                    <td className="soft">{r.opportunities ? formatTimeRange(r.opportunities.start_datetime, r.opportunities.end_datetime) : "—"}</td>
                    <td><span className={`badge badge-${r.status}`}>{r.status === "no_show" ? "No-show" : r.status}</span></td>
                    <td style={{ textAlign: "right", fontWeight: 700, color: r.status === "approved" ? "var(--ok)" : "var(--ink-mute)" }}>
                      {r.status === "approved" ? formatHours(r.hours_awarded) : "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
