"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { revokeInvite, revokeAllInvites } from "../actions";
import { IconX } from "@/components/Icons";

export function RevokeButton({ id }: { id: string }) {
  const [pending, start] = useTransition();
  const router = useRouter();
  return (
    <button
      className="btn btn-danger btn-sm"
      disabled={pending}
      onClick={() => {
        if (!confirm("Disable this admin invite link? It will stop working immediately.")) return;
        start(async () => {
          await revokeInvite(id);
          router.refresh();
        });
      }}
    >
      {pending ? <span className="spinner" style={{ borderTopColor: "var(--danger)", borderColor: "var(--line-strong)" }} /> : <IconX width={14} height={14} />}
      Disable
    </button>
  );
}

export function RevokeAllButton({ activeCount }: { activeCount: number }) {
  const [pending, start] = useTransition();
  const router = useRouter();
  if (activeCount === 0) return null;
  return (
    <button
      className="btn btn-danger btn-sm"
      disabled={pending}
      onClick={() => {
        if (!confirm(`Disable all ${activeCount} active admin invite link${activeCount === 1 ? "" : "s"}? They will stop working immediately.`)) return;
        start(async () => {
          await revokeAllInvites();
          router.refresh();
        });
      }}
    >
      {pending ? <span className="spinner" style={{ borderTopColor: "var(--danger)", borderColor: "var(--line-strong)" }} /> : <IconX width={14} height={14} />}
      Disable all active ({activeCount})
    </button>
  );
}
