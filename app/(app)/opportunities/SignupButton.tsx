"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { signUp, cancelSignup } from "./actions";
import { IconCheck, IconX } from "@/components/Icons";

type Props = {
  opportunityId: string;
  joined: boolean;
  signupStatus?: "pending" | "approved" | "no_show";
  full: boolean;
  ended: boolean;
};

export function SignupButton({ opportunityId, joined, signupStatus, full, ended }: Props) {
  const [pending, start] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  function run(fn: () => Promise<{ ok: boolean; error?: string }>) {
    setError(null);
    start(async () => {
      const res = await fn();
      if (!res.ok) setError(res.error ?? "Something went wrong.");
      else router.refresh();
    });
  }

  if (joined) {
    if (signupStatus === "approved")
      return <div className="alert alert-success mb-0"><IconCheck width={16} height={16} style={{ verticalAlign: "-3px" }} /> Your attendance is approved — thank you for your seva!</div>;
    if (signupStatus === "no_show")
      return <div className="alert alert-error mb-0">This was marked as a no-show. Please reach out if that&apos;s a mistake.</div>;
    return (
      <div className="stack gap-sm">
        <div className="alert alert-info mb-0">You&apos;re signed up. We&apos;ll see you there!</div>
        <button className="btn btn-danger" disabled={pending} onClick={() => run(() => cancelSignup(opportunityId))}>
          {pending ? <span className="spinner" style={{ borderTopColor: "var(--danger)", borderColor: "var(--line-strong)" }} /> : <IconX width={16} height={16} />}
          Cancel my sign-up
        </button>
        {error && <div className="alert alert-error mb-0">{error}</div>}
      </div>
    );
  }

  if (ended) return <button className="btn btn-ghost" disabled aria-disabled>This opportunity has ended</button>;
  if (full) return <button className="btn btn-ghost" disabled aria-disabled>All spots are filled</button>;

  return (
    <div className="stack gap-sm">
      <button className="btn btn-primary btn-lg" disabled={pending} onClick={() => run(() => signUp(opportunityId))}>
        {pending ? <span className="spinner" /> : null}
        Sign up to volunteer
      </button>
      {error && <div className="alert alert-error mb-0">{error}</div>}
    </div>
  );
}
