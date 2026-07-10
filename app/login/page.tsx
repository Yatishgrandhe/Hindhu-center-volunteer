"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Logo } from "@/components/Logo";
import { IconGoogle, IconShield } from "@/components/Icons";

function LoginInner() {
  const params = useSearchParams();
  const next = params.get("next") || "/dashboard";
  const invited = params.get("invite") === "1";
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function signIn() {
    setLoading(true);
    setError(null);
    const supabase = createClient();
    const origin = window.location.origin;
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${origin}/auth/callback?next=${encodeURIComponent(next)}`,
        queryParams: { prompt: "select_account" },
      },
    });
    if (error) {
      setError(error.message);
      setLoading(false);
    }
  }

  return (
    <div className="auth-wrap">
      <div className="auth-card">
        <div style={{ display: "grid", placeItems: "center", marginBottom: "1.2rem" }}>
          <Logo height={56} />
        </div>

        {invited && (
          <div className="alert alert-info" style={{ display: "flex", gap: "0.5rem", alignItems: "center", textAlign: "left" }}>
            <IconShield width={18} height={18} /> You&apos;ve been invited as an administrator. Sign in to accept.
          </div>
        )}

        <span className="eyebrow" style={{ justifyContent: "center" }}>Seva Portal</span>
        <h1 style={{ fontSize: "1.9rem", marginTop: "0.6rem" }}>Welcome back</h1>
        <p className="soft">Sign in to browse opportunities and track your volunteer hours.</p>

        {error && <div className="alert alert-error">{error}</div>}

        <button className="btn btn-google btn-block btn-lg" onClick={signIn} disabled={loading} style={{ marginTop: "0.5rem" }}>
          {loading ? <span className="spinner" style={{ borderTopColor: "var(--saffron)", borderColor: "var(--line-strong)" }} /> : <IconGoogle />}
          Continue with Google
        </button>

        <p className="muted" style={{ fontSize: "0.8rem", marginTop: "1.2rem", marginBottom: 0 }}>
          Google is the only sign-in method — no passwords to remember. By
          continuing you agree to serve in accordance with the Hindu Center of
          Charlotte&apos;s community guidelines.
        </p>
        <hr className="divider" />
        <Link href="/" className="muted" style={{ fontSize: "0.85rem" }}>← Back to home</Link>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginInner />
    </Suspense>
  );
}
