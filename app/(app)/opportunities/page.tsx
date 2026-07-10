import { createClient } from "@/lib/supabase/server";
import { getUserAndProfile } from "@/lib/auth";
import { OpportunityCard } from "@/components/OpportunityCard";

export const metadata = { title: "Opportunities — Seva Portal" };

export default async function OpportunitiesPage() {
  const supabase = await createClient();
  const { user } = await getUserAndProfile();

  const nowIso = new Date().toISOString();

  const { data: opps } = await supabase
    .from("opportunities")
    .select("*")
    .in("status", ["open"])
    .gte("end_datetime", nowIso)
    .order("start_datetime", { ascending: true });

  const oppIds = (opps ?? []).map((o) => o.id);

  // Signup counts (pending + approved fill a slot) and the current user's signups.
  const [{ data: allSignups }, { data: mine }] = await Promise.all([
    oppIds.length
      ? supabase.from("signups").select("opportunity_id, status").in("opportunity_id", oppIds)
      : Promise.resolve({ data: [] as { opportunity_id: string; status: string }[] }),
    user
      ? supabase.from("signups").select("opportunity_id").eq("user_id", user.id)
      : Promise.resolve({ data: [] as { opportunity_id: string }[] }),
  ]);

  const takenByOpp = new Map<string, number>();
  for (const s of allSignups ?? []) {
    if (s.status !== "no_show") {
      takenByOpp.set(s.opportunity_id, (takenByOpp.get(s.opportunity_id) ?? 0) + 1);
    }
  }
  const mySet = new Set((mine ?? []).map((s) => s.opportunity_id));

  return (
    <div className="page">
      <div className="container">
        <div className="section-head">
          <div>
            <span className="eyebrow">Volunteer</span>
            <h1 style={{ margin: "0.3rem 0 0" }}>Open opportunities</h1>
            <p className="soft mb-0" style={{ marginTop: "0.4rem" }}>
              Find a way to serve. Sign up in one click — an admin confirms your
              hours after the event.
            </p>
          </div>
        </div>

        {!opps || opps.length === 0 ? (
          <div className="empty">
            <div className="empty-om">ॐ</div>
            <h3 style={{ color: "var(--ink)" }}>No open opportunities right now</h3>
            <p className="mb-0">Please check back soon — new seva is added regularly.</p>
          </div>
        ) : (
          <div className="grid grid-cards">
            {opps.map((o) => (
              <OpportunityCard
                key={o.id}
                o={o}
                href={`/opportunities/${o.id}`}
                joined={mySet.has(o.id)}
                remaining={Math.max(0, o.slots - (takenByOpp.get(o.id) ?? 0))}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
