"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import type { SignupStatus, OpportunityStatus } from "@/lib/database.types";

export type FormState = { error: string | null };

async function requireAdmin() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { supabase, user: null, isAdmin: false };
  const { data } = await supabase.rpc("is_admin");
  return { supabase, user, isAdmin: data === true };
}

type OpportunityValues = {
  title: string;
  description: string | null;
  location: string | null;
  start_datetime: string;
  end_datetime: string;
  estimated_hours: number;
  slots: number;
  status: OpportunityStatus;
};

type ParseResult =
  | { error: string; values?: undefined }
  | { error?: undefined; values: OpportunityValues };

function parseOpportunity(formData: FormData): ParseResult {
  const get = (k: string) => (formData.get(k)?.toString() ?? "").trim();
  const title = get("title");
  const description = get("description");
  const location = get("location");
  const start = get("start_datetime");
  const end = get("end_datetime");
  const estimated_hours = parseFloat(get("estimated_hours") || "0");
  const slots = parseInt(get("slots") || "1", 10);
  const status = (get("status") || "open") as OpportunityStatus;

  if (!title) return { error: "Please give the opportunity a title." };
  if (!start || !end) return { error: "Start and end date-time are required." };
  if (new Date(end) <= new Date(start)) return { error: "The end time must be after the start time." };
  if (Number.isNaN(estimated_hours) || estimated_hours < 0) return { error: "Estimated hours must be zero or more." };
  if (Number.isNaN(slots) || slots < 1) return { error: "There must be at least one slot." };

  return {
    values: {
      title,
      description: description || null,
      location: location || null,
      start_datetime: new Date(start).toISOString(),
      end_datetime: new Date(end).toISOString(),
      estimated_hours,
      slots,
      status,
    },
  };
}

export async function createOpportunity(_prev: FormState, formData: FormData): Promise<FormState> {
  const { supabase, user, isAdmin } = await requireAdmin();
  if (!user || !isAdmin) return { error: "You do not have permission to do that." };

  const parsed = parseOpportunity(formData);
  if (!parsed.values) return { error: parsed.error ?? "Invalid input." };

  const { error } = await supabase
    .from("opportunities")
    .insert({ ...parsed.values, created_by: user.id });
  if (error) return { error: error.message };

  revalidatePath("/admin");
  revalidatePath("/opportunities");
  redirect("/admin");
}

export async function updateOpportunity(id: string, _prev: FormState, formData: FormData): Promise<FormState> {
  const { supabase, user, isAdmin } = await requireAdmin();
  if (!user || !isAdmin) return { error: "You do not have permission to do that." };

  const parsed = parseOpportunity(formData);
  if (!parsed.values) return { error: parsed.error ?? "Invalid input." };

  const { error } = await supabase.from("opportunities").update(parsed.values).eq("id", id);
  if (error) return { error: error.message };

  revalidatePath("/admin");
  revalidatePath("/opportunities");
  revalidatePath(`/opportunities/${id}`);
  redirect(`/admin/opportunities/${id}/review`);
}

export async function deleteOpportunity(id: string): Promise<{ ok: boolean; error?: string }> {
  const { supabase, user, isAdmin } = await requireAdmin();
  if (!user || !isAdmin) return { ok: false, error: "Not authorized." };
  const { error } = await supabase.from("opportunities").delete().eq("id", id);
  if (error) return { ok: false, error: error.message };
  revalidatePath("/admin");
  revalidatePath("/opportunities");
  return { ok: true };
}

export async function setOpportunityStatus(id: string, status: OpportunityStatus): Promise<{ ok: boolean; error?: string }> {
  const { supabase, user, isAdmin } = await requireAdmin();
  if (!user || !isAdmin) return { ok: false, error: "Not authorized." };
  const { error } = await supabase.from("opportunities").update({ status }).eq("id", id);
  if (error) return { ok: false, error: error.message };
  revalidatePath("/admin");
  revalidatePath(`/admin/opportunities/${id}/review`);
  revalidatePath("/opportunities");
  return { ok: true };
}

export async function reviewSignup(
  signupId: string,
  opportunityId: string,
  status: SignupStatus,
  hours?: number
): Promise<{ ok: boolean; error?: string }> {
  const { supabase, user, isAdmin } = await requireAdmin();
  if (!user || !isAdmin) return { ok: false, error: "Not authorized." };

  const { error } = await supabase.rpc("review_signup", {
    p_signup_id: signupId,
    p_status: status,
    p_hours: status === "approved" ? hours ?? undefined : 0,
  });
  if (error) return { ok: false, error: error.message };

  revalidatePath(`/admin/opportunities/${opportunityId}/review`);
  revalidatePath("/admin");
  revalidatePath("/dashboard");
  return { ok: true };
}

export async function createInvite(): Promise<{ ok: boolean; token?: string; error?: string }> {
  const { supabase, user, isAdmin } = await requireAdmin();
  if (!user || !isAdmin) return { ok: false, error: "Not authorized." };

  const { data, error } = await supabase
    .from("admin_invites")
    .insert({ created_by: user.id })
    .select("token")
    .single();

  if (error) return { ok: false, error: error.message };
  revalidatePath("/admin/invites");
  return { ok: true, token: data.token };
}
