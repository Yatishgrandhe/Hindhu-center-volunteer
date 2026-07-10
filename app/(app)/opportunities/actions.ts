"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export type ActionResult = { ok: boolean; error?: string };

export async function signUp(opportunityId: string): Promise<ActionResult> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { ok: false, error: "Please sign in first." };

  const { data: opp } = await supabase
    .from("opportunities")
    .select("id, slots, status, end_datetime")
    .eq("id", opportunityId)
    .maybeSingle();

  if (!opp) return { ok: false, error: "This opportunity no longer exists." };
  if (opp.status !== "open") return { ok: false, error: "Sign-ups for this opportunity are closed." };
  if (new Date(opp.end_datetime).getTime() < Date.now())
    return { ok: false, error: "This opportunity has already ended." };

  const { count } = await supabase
    .from("signups")
    .select("id", { count: "exact", head: true })
    .eq("opportunity_id", opportunityId)
    .neq("status", "no_show");

  if ((count ?? 0) >= opp.slots)
    return { ok: false, error: "Sorry, this opportunity is now full." };

  const { error } = await supabase
    .from("signups")
    .insert({ opportunity_id: opportunityId, user_id: user.id, status: "pending" });

  if (error) {
    if (error.code === "23505") return { ok: false, error: "You are already signed up." };
    return { ok: false, error: error.message };
  }

  revalidatePath(`/opportunities/${opportunityId}`);
  revalidatePath("/opportunities");
  revalidatePath("/dashboard");
  return { ok: true };
}

export async function cancelSignup(opportunityId: string): Promise<ActionResult> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { ok: false, error: "Please sign in first." };

  // Members may only withdraw a sign-up that hasn't been reviewed yet.
  const { data: existing } = await supabase
    .from("signups")
    .select("id, status")
    .eq("opportunity_id", opportunityId)
    .eq("user_id", user.id)
    .maybeSingle();

  if (!existing) return { ok: false, error: "You are not signed up for this." };
  if (existing.status !== "pending")
    return { ok: false, error: "This sign-up has already been reviewed and cannot be cancelled." };

  const { error } = await supabase.from("signups").delete().eq("id", existing.id);
  if (error) return { ok: false, error: error.message };

  revalidatePath(`/opportunities/${opportunityId}`);
  revalidatePath("/opportunities");
  revalidatePath("/dashboard");
  return { ok: true };
}
