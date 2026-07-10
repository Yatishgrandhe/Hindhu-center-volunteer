import { redirect } from "next/navigation";
import { getUserAndProfile } from "@/lib/auth";
import { Logo } from "@/components/Logo";
import { OnboardingForm } from "./OnboardingForm";

export const metadata = { title: "Complete your profile — Seva Portal" };

export default async function OnboardingPage() {
  const { user, profile } = await getUserAndProfile();
  if (!user) redirect("/login");
  if (profile?.onboarded) redirect("/dashboard");

  return (
    <div className="page">
      <div className="container" style={{ maxWidth: 640 }}>
        <div style={{ textAlign: "center", marginBottom: "1.6rem" }}>
          <div style={{ display: "grid", placeItems: "center" }}><Logo height={48} /></div>
          <span className="eyebrow" style={{ justifyContent: "center", marginTop: "1rem" }}>Welcome to Seva</span>
          <h1 style={{ marginTop: "0.6rem" }}>Let&apos;s set up your profile</h1>
          <p className="soft" style={{ maxWidth: "44ch", margin: "0 auto" }}>
            We ask for this once, so we can keep you informed and safe while you
            volunteer. It only takes a minute.
          </p>
        </div>

        <div className="card">
          <OnboardingForm email={user.email ?? ""} defaultName={profile?.full_name ?? ""} />
        </div>
      </div>
    </div>
  );
}
