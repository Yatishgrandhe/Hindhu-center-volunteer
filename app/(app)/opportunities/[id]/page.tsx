import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getUserAndProfile } from "@/lib/auth";
import { SignupButton } from "../SignupButton";
import { IconCalendar, IconClock, IconPin, IconHours, IconUsers, IconArrow } from "@/components/Icons";
import { formatDate, formatTime, formatHours, isPast } from "@/lib/utils";

export default async function OpportunityDetail({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();
  const { user, profile } = await getUserAndProfile();
  const isAdmin = profile?.role === "admin";

  const { data: opp } = await supabase
    .from("opportunities")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (!opp) notFound();

  const [{ count: takenCount }, { data: mine }] = await Promise.all([
    supabase.from("signups").select("id", { count: "exact", head: true }).eq("opportunity_id", id).neq("status", "no_show"),
    supabase.from("signups").select("status").eq("opportunity_id", id).eq("user_id", user!.id).maybeSingle(),
  ]);

  const taken = takenCount ?? 0;
  const remaining = Math.max(0, opp.slots - taken);
  const joined = !!mine;
  const ended = isPast(opp.end_datetime) || opp.status !== "open";
  const full = remaining === 0;

  return (
    <div className="page">
      <div className="container" style={{ maxWidth: 900 }}>
        <Link href="/opportunities" className="muted" style={{ fontSize: "0.9rem", display: "inline-flex", alignItems: "center", gap: 4 }}>
          <IconArrow width={16} height={16} style={{ transform: "rotate(180deg)" }} /> All opportunities
        </Link>

        <div className="row gap-sm" style={{ marginTop: "1rem", flexWrap: "wrap" }}>
          <span className={`badge badge-${opp.status}`}>{opp.status}</span>
          {ended && opp.status === "open" && <span className="badge badge-closed">Ended</span>}
        </div>

        <h1 style={{ margin: "0.5rem 0 0.8rem", fontSize: "clamp(2rem, 5vw, 2.8rem)" }}>{opp.title}</h1>

        <div className="grid" style={{ gridTemplateColumns: "1.6fr 1fr", alignItems: "start", marginTop: "1.4rem" }}>
          <div>
            <div className="card">
              <h3 style={{ marginTop: 0 }}>What you&apos;ll do</h3>
              {opp.description ? (
                <div className="soft" style={{ whiteSpace: "pre-wrap", lineHeight: 1.7 }}>{opp.description}</div>
              ) : (
                <p className="muted mb-0">Details will be shared with volunteers before the event.</p>
              )}
            </div>
          </div>

          <aside className="card" style={{ position: "sticky", top: "88px" }}>
            <div className="stack gap" style={{ marginBottom: "1.2rem" }}>
              <div className="meta-item"><IconCalendar /> <span><strong>{formatDate(opp.start_datetime)}</strong></span></div>
              <div className="meta-item"><IconClock /> {formatTime(opp.start_datetime)} – {formatTime(opp.end_datetime)}</div>
              {opp.location && <div className="meta-item"><IconPin /> {opp.location}</div>}
              <div className="meta-item"><IconHours /> {formatHours(opp.estimated_hours)} estimated hours</div>
              <div className="meta-item"><IconUsers /> {full ? "All spots filled" : `${remaining} of ${opp.slots} spots left`}</div>
            </div>

            {isAdmin ? (
              <div className="stack gap-sm">
                <Link href={`/admin/opportunities/${opp.id}/review`} className="btn btn-primary btn-block">Review sign-ups</Link>
                <Link href={`/admin/opportunities/${opp.id}/edit`} className="btn btn-ghost btn-block">Edit opportunity</Link>
              </div>
            ) : (
              <SignupButton
                opportunityId={opp.id}
                joined={joined}
                signupStatus={mine?.status as "pending" | "approved" | "no_show" | undefined}
                full={full}
                ended={ended}
              />
            )}
          </aside>
        </div>
      </div>
    </div>
  );
}
