import Link from "next/link";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { OpportunityCard } from "@/components/OpportunityCard";
import { getUserAndProfile } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { IconArrow } from "@/components/Icons";

export default async function HomePage() {
  const { user, profile } = await getUserAndProfile();
  const supabase = await createClient();
  const authed = !!user && !!profile?.onboarded;
  const nowIso = new Date().toISOString();

  const { data: opps } = await supabase
    .from("opportunities")
    .select("id, title, description, location, start_datetime, end_datetime, estimated_hours, slots, status")
    .eq("status", "open")
    .gte("end_datetime", nowIso)
    .order("start_datetime", { ascending: true })
    .limit(3);

  const featured = opps ?? [];
  const oppIds = featured.map((o) => o.id);

  const [{ data: allSignups }, { data: mine }] = await Promise.all([
    oppIds.length
      ? supabase.from("signups").select("opportunity_id, status").in("opportunity_id", oppIds)
      : Promise.resolve({ data: [] as { opportunity_id: string; status: string }[] }),
    user
      ? supabase.from("signups").select("opportunity_id").eq("user_id", user.id)
      : Promise.resolve({ data: [] as { opportunity_id: string }[] }),
  ]);

  const taken = new Map<string, number>();
  for (const s of allSignups ?? []) {
    if (s.status !== "no_show") taken.set(s.opportunity_id, (taken.get(s.opportunity_id) ?? 0) + 1);
  }
  const mySet = new Set((mine ?? []).map((s) => s.opportunity_id));

  const primaryHref = authed ? "/opportunities" : "/login";

  return (
    <>
      <SiteHeader authed={authed} role={profile?.role} name={profile?.full_name} />

      {/* Hero */}
      <section className="hero">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img className="hero-photo" src="/images/hero-temple.jpg" alt="Hindu temple gopuram against an evening sky" />
        <div className="hero-scrim" />
        <div className="container">
          <div className="hero-inner">
            <span className="eyebrow">Seva · Selfless Service</span>
            <h1>
              Serve your temple.
              <br />
              <span className="accent">Grow your community.</span>
            </h1>
            <p className="hero-lede">
              Volunteer with the Hindu Center of Charlotte. Browse upcoming seva
              opportunities, sign up in seconds, and track every verified hour of
              service you give.
            </p>
            <div className="hero-cta">
              <Link href={primaryHref} className="btn btn-primary btn-lg">
                {authed ? "Browse opportunities" : "Get started"} <IconArrow />
              </Link>
              <Link href="/opportunities" className="btn btn-ghost btn-lg">See what&apos;s open</Link>
            </div>
            <div className="hero-stats">
              <div><b>{featured.length ? `${featured.length}+` : "New"}</b><span>Opportunities open now</span></div>
              <div><b>One tap</b><span>Sign in with Google</span></div>
              <div><b>Verified</b><span>Every hour counted</span></div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured opportunities */}
      {featured.length > 0 && (
        <section className="band">
          <div className="container">
            <div className="section-head">
              <div>
                <span className="eyebrow">Get involved</span>
                <h2>Ways to serve right now</h2>
              </div>
              <Link href="/opportunities" className="btn btn-ghost">View all <IconArrow width={16} height={16} /></Link>
            </div>
            <div className="grid grid-cards">
              {featured.map((o) => (
                <OpportunityCard
                  key={o.id}
                  o={o}
                  href={authed ? `/opportunities/${o.id}` : "/login"}
                  joined={mySet.has(o.id)}
                  remaining={Math.max(0, o.slots - (taken.get(o.id) ?? 0))}
                />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* How it works */}
      <section className="band band-cream">
        <div className="container">
          <div className="section-head">
            <div>
              <span className="eyebrow">How it works</span>
              <h2>Three steps to seva</h2>
            </div>
          </div>
          <div className="steps">
            <div className="step">
              <span className="step-n">1</span>
              <h3>Sign in with Google</h3>
              <p>One tap to join. On your first visit we collect a few details for safety and communication.</p>
            </div>
            <div className="step">
              <span className="step-n">2</span>
              <h3>Find &amp; commit</h3>
              <p>Browse open opportunities, read exactly what to do, and sign up for the ones that fit your schedule.</p>
            </div>
            <div className="step">
              <span className="step-n">3</span>
              <h3>Earn verified hours</h3>
              <p>Show up and serve. An admin confirms your attendance and your hours are credited to your record.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Closing CTA */}
      <section className="band" style={{ paddingTop: featured.length ? undefined : 0 }}>
        <div className="container">
          <div className="cta-band">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/images/seva-greeter.jpg" alt="" />
            <span className="eyebrow">Join us</span>
            <h2>Your time makes the difference</h2>
            <p>
              From the kitchen to the festival grounds, every helping hand keeps
              our community thriving. Give a few hours — it all counts.
            </p>
            <Link href={primaryHref} className="btn btn-primary btn-lg">
              {authed ? "Find an opportunity" : "Get started"} <IconArrow />
            </Link>
          </div>
        </div>
      </section>

      <SiteFooter />
    </>
  );
}
