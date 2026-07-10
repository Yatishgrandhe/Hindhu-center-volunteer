import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

const INVITE_COOKIE = "hcclt_admin_invite";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/dashboard";

  if (!code) {
    return NextResponse.redirect(`${origin}/login?error=missing_code`);
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.exchangeCodeForSession(code);
  if (error) {
    return NextResponse.redirect(`${origin}/login?error=${encodeURIComponent(error.message)}`);
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Redeem a pending admin invite, if one is present (set by /join/[token]).
  const inviteToken = request.headers
    .get("cookie")
    ?.split(";")
    .map((c) => c.trim())
    .find((c) => c.startsWith(`${INVITE_COOKIE}=`))
    ?.split("=")[1];

  let promoted = false;
  if (inviteToken) {
    const { data, error: redeemError } = await supabase.rpc("redeem_admin_invite", {
      p_token: decodeURIComponent(inviteToken),
    });
    promoted = !redeemError && data === true;
  }

  // Only honor an internal, non-privileged `next` (never /admin, no open redirects).
  const safeNext =
    next.startsWith("/") && !next.startsWith("//") && !next.startsWith("/admin")
      ? next
      : "/dashboard";

  // Destination is decided by role — a non-admin can never be routed into /admin.
  let destination = "/dashboard";
  if (user) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("onboarded, role")
      .eq("id", user.id)
      .maybeSingle();
    if (!profile?.onboarded) destination = "/onboarding";
    else if (promoted || profile.role === "admin") destination = "/admin";
    else destination = safeNext;
  }

  const res = NextResponse.redirect(`${origin}${destination}`);
  res.cookies.set(INVITE_COOKIE, "", { maxAge: 0, path: "/" });
  return res;
}
