import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

const INVITE_COOKIE = "hcclt_admin_invite";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ token: string }> }
) {
  const { token } = await params;
  const { origin } = new URL(request.url);

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Not signed in yet: stash the token and send them to Google sign-in.
  // The /auth/callback route redeems it once the session exists.
  if (!user) {
    const res = NextResponse.redirect(`${origin}/login?invite=1`);
    res.cookies.set(INVITE_COOKIE, token, {
      httpOnly: true,
      sameSite: "lax",
      maxAge: 60 * 30,
      path: "/",
    });
    return res;
  }

  // Already signed in: redeem right away.
  const { data, error } = await supabase.rpc("redeem_admin_invite", {
    p_token: token,
  });

  const { data: profile } = await supabase
    .from("profiles")
    .select("onboarded")
    .eq("id", user.id)
    .maybeSingle();

  const res = NextResponse.redirect(
    `${origin}${!profile?.onboarded ? "/onboarding" : data === true ? "/admin" : "/dashboard?invite=failed"}`
  );
  if (error) {
    res.headers.set("x-invite-error", error.message);
  }
  res.cookies.set(INVITE_COOKIE, "", { maxAge: 0, path: "/" });
  return res;
}
