"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { createInvite } from "../actions";
import { IconLink, IconCopy, IconCheck } from "@/components/Icons";

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      className="btn btn-ghost btn-sm"
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(text);
          setCopied(true);
          setTimeout(() => setCopied(false), 1800);
        } catch {
          /* clipboard unavailable */
        }
      }}
    >
      {copied ? <IconCheck width={15} height={15} /> : <IconCopy width={15} height={15} />}
      {copied ? "Copied" : "Copy"}
    </button>
  );
}

export function InviteManager({ origin }: { origin: string }) {
  const [pending, start] = useTransition();
  const [link, setLink] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  function generate() {
    setError(null);
    setLink(null);
    start(async () => {
      const res = await createInvite();
      if (!res.ok || !res.token) {
        setError(res.error ?? "Could not create invite.");
        return;
      }
      setLink(`${origin}/join/${res.token}`);
      router.refresh();
    });
  }

  return (
    <div className="card">
      <div className="row between wrap gap">
        <div style={{ maxWidth: "48ch" }}>
          <h3 style={{ margin: 0 }}>Invite a new administrator</h3>
          <p className="soft mb-0" style={{ marginTop: "0.35rem" }}>
            Generate a single-use link that expires in 7 days. Whoever signs in
            through it becomes an admin. Share it only with people you trust.
          </p>
        </div>
        <button className="btn btn-primary" disabled={pending} onClick={generate}>
          {pending ? <span className="spinner" /> : <IconLink width={16} height={16} />}
          Generate invite link
        </button>
      </div>

      {error && <div className="alert alert-error" style={{ marginTop: "1rem", marginBottom: 0 }}>{error}</div>}

      {link && (
        <div className="alert alert-success" style={{ marginTop: "1rem", marginBottom: 0, textAlign: "left" }}>
          <strong>New invite ready.</strong> Copy it now — for security the full
          link is shown only once here.
          <div className="row gap-sm wrap" style={{ marginTop: "0.6rem" }}>
            <input className="input" readOnly value={link} onFocus={(e) => e.currentTarget.select()} style={{ flex: 1, minWidth: 220, fontFamily: "monospace", fontSize: "0.82rem" }} />
            <CopyButton text={link} />
          </div>
        </div>
      )}
    </div>
  );
}
