import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { ReviewRow } from "./ReviewRow";
import { OppControls } from "./OppControls";
import { IconArrow, IconCalendar, IconPin, IconHours, IconUsers } from "@/components/Icons";
import { formatTimeRange, formatHours, isMinor } from "@/lib/utils";

export const metadata = { title: "Review sign-ups — Seva Portal" };

type SignupWithProfile = {
  id: string;
  status: "pending" | "approved" | "no_show";
  hours_awarded: number;
  created_at: string;
  profiles: {
    full_name: string | null;
    phone: string | null;
    email: string | null;
    date_of_birth: string | null;
  } | null;
};

export default async function ReviewPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: opp } = await supabase.from("opportunities").select("*").eq("id", id).maybeSingle();
  if (!opp) notFound();

  const { data: signupsRaw } = await supabase
    .from("signups")
    .select("id, status, hours_awarded, created_at, profiles!signups_user_id_fkey(full_name, phone, email, date_of_birth)")
    .eq("opportunity_id", id)
    .order("created_at", { ascending: true });

  const signups = (signupsRaw ?? []) as unknown as SignupWithProfile[];

  const pending = signups.filter((s) => s.status === "pending").length;
  const approved = signups.filter((s) => s.status === "approved").length;
  const noShow = signups.filter((s) => s.status === "no_show").length;
  const hoursAwarded = signups.filter((s) => s.status === "approved").reduce((sum, s) => sum + Number(s.hours_awarded), 0);
  const taken = signups.filter((s) => s.status !== "no_show").length;

  return (
    <div className="page">
      <div className="container">
        <Link href="/admin" className="muted" style={{ fontSize: "0.9rem", display: "inline-flex", alignItems: "center", gap: 4 }}>
          <IconArrow width={16} height={16} style={{ transform: "rotate(180deg)" }} /> Back to admin
        </Link>

        <div className="section-head" style={{ marginTop: "1rem", alignItems: "flex-start" }}>
          <div>
            <div className="row gap-sm wrap">
              <span className={`badge badge-${opp.status}`}>{opp.status}</span>
            </div>
            <h1 style={{ margin: "0.5rem 0 0.6rem" }}>{opp.title}</h1>
            <div className="meta">
              <span className="meta-item"><IconCalendar /> {formatTimeRange(opp.start_datetime, opp.end_datetime)}</span>
              {opp.location && <span className="meta-item"><IconPin /> {opp.location}</span>}
              <span className="meta-item"><IconHours /> {formatHours(opp.estimated_hours)} hrs est.</span>
              <span className="meta-item"><IconUsers /> {taken}/{opp.slots} filled</span>
            </div>
          </div>
          <div className="stack gap-sm" style={{ alignItems: "flex-end" }}>
            <Link href={`/admin/opportunities/${id}/edit`} className="btn btn-ghost btn-sm">Edit details</Link>
            <OppControls id={id} status={opp.status} />
          </div>
        </div>

        <div className="grid grid-stats" style={{ marginTop: "1.4rem" }}>
          <div className="stat"><div className="stat-label">Pending</div><div className="stat-value" style={{ color: pending ? "var(--warn)" : undefined }}>{pending}</div></div>
          <div className="stat"><div className="stat-label">Approved</div><div className="stat-value">{approved}</div></div>
          <div className="stat"><div className="stat-label">No-shows</div><div className="stat-value" style={{ color: noShow ? "var(--danger)" : undefined }}>{noShow}</div></div>
          <div className="stat"><div className="stat-label">Hours awarded</div><div className="stat-value">{formatHours(hoursAwarded)}</div></div>
        </div>

        <div className="section-head" style={{ marginTop: "2.2rem" }}>
          <div><span className="eyebrow">Attendance</span><h2>Sign-ups</h2></div>
        </div>

        {signups.length === 0 ? (
          <div className="empty"><p className="mb-0">No one has signed up yet.</p></div>
        ) : (
          <div className="table-wrap">
            <table className="data">
              <thead>
                <tr><th>Volunteer</th><th>Status</th><th style={{ textAlign: "right" }}>Review</th></tr>
              </thead>
              <tbody>
                {signups.map((s) => (
                  <ReviewRow
                    key={s.id}
                    signupId={s.id}
                    opportunityId={id}
                    status={s.status}
                    hoursAwarded={Number(s.hours_awarded)}
                    estimatedHours={Number(opp.estimated_hours)}
                    memberName={s.profiles?.full_name ?? "Unknown volunteer"}
                    memberPhone={s.profiles?.phone ?? null}
                    memberEmail={s.profiles?.email ?? null}
                    isMinor={isMinor(s.profiles?.date_of_birth ?? null)}
                  />
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
