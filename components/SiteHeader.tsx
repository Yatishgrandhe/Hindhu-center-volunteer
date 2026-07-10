"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Logo } from "./Logo";
import { IconMenu, IconPin } from "./Icons";
import { createClient } from "@/lib/supabase/client";
import { initials } from "@/lib/utils";

type Props = {
  authed: boolean;
  role?: "member" | "admin";
  name?: string | null;
};

export function SiteHeader({ authed, role, name }: Props) {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);

  const links = !authed
    ? [{ href: "/opportunities", label: "Opportunities" }]
    : role === "admin"
      ? [
          { href: "/admin", label: "Dashboard" },
          { href: "/admin/volunteers", label: "Volunteers" },
        ]
      : [
          { href: "/opportunities", label: "Opportunities" },
          { href: "/dashboard", label: "My Hours" },
        ];

  const homeHref = authed ? (role === "admin" ? "/admin" : "/dashboard") : "/";

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    if (href === "/admin") return pathname === "/admin";
    return pathname === href || pathname.startsWith(href + "/");
  };

  async function signOut() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  }

  return (
    <>
      <div className="topbar">
        <div className="container">
          <span className="tb-contact">
            <span><IconPin width={14} height={14} /> 7400 City View Dr, Charlotte, NC 28212</span>
            <span className="hide-sm"><a href="tel:+17045353440">(704) 535-3440</a></span>
          </span>
          <a href="https://www.hcclt.org" target="_blank" rel="noreferrer">hcclt.org ↗</a>
        </div>
      </div>

      <header className="siteheader">
        <div className="container">
          <Link href={homeHref} className="brand" aria-label="Hindu Center of Charlotte — Home">
            <Logo height={40} />
            <span className="brand-text">
              <span className="brand-name">Hindu Center of Charlotte</span>
              <span className="brand-sub">Seva Volunteer Portal</span>
            </span>
          </Link>

          <nav className="nav nav-links" aria-label="Primary">
            {links.map((l) => (
              <Link key={l.href} href={l.href} className={isActive(l.href) ? "active" : ""}>
                {l.label}
              </Link>
            ))}
            {authed ? (
              <div className="row gap-sm" style={{ marginLeft: "0.4rem" }}>
                <span className="avatar" title={name ?? ""}>{initials(name).toUpperCase()}</span>
                <button className="btn btn-ghost btn-sm" onClick={signOut}>Sign out</button>
              </div>
            ) : (
              <Link href="/login" className="btn btn-primary btn-sm" style={{ marginLeft: "0.4rem" }}>
                Sign in
              </Link>
            )}
          </nav>

          <button
            className="menu-toggle"
            aria-label="Toggle menu"
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
          >
            <IconMenu />
          </button>

          {open && (
            <nav className="nav nav-links open" aria-label="Mobile">
              {links.map((l) => (
                <Link key={l.href} href={l.href} className={isActive(l.href) ? "active" : ""} onClick={() => setOpen(false)}>
                  {l.label}
                </Link>
              ))}
              {authed ? (
                <button className="btn btn-ghost btn-sm" onClick={signOut}>Sign out</button>
              ) : (
                <Link href="/login" className="btn btn-primary btn-sm" onClick={() => setOpen(false)}>Sign in</Link>
              )}
            </nav>
          )}
        </div>
      </header>
    </>
  );
}
