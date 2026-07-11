"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { isMinor } from "@/lib/utils";
import type { TshirtSize } from "@/lib/database.types";

export type OnboardingState = { error: string | null };

const SIZES = ["XS", "S", "M", "L", "XL", "XXL", "XXXL"];

export async function completeOnboarding(
  _prev: OnboardingState,
  formData: FormData
): Promise<OnboardingState> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Your session expired. Please sign in again." };

  // Role is the source of truth for which fields we require (never trust the form).
  const { data: current } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .maybeSingle();
  const isAdmin = current?.role === "admin";

  const get = (k: string) => (formData.get(k)?.toString() ?? "").trim();

  const full_name = get("full_name");
  const phone = get("phone");

  if (!full_name) return { error: "Please enter your full name." };
  if (!phone) return { error: "Please enter a phone number." };

  // Admins only provide name + phone — volunteer safety fields are cleared.
  if (isAdmin) {
    const { error } = await supabase
      .from("profiles")
      .update({
        full_name,
        phone,
        email: user.email ?? null,
        emergency_contact_name: null,
        emergency_contact_phone: null,
        date_of_birth: null,
        guardian_name: null,
        guardian_phone: null,
        tshirt_size: null,
        onboarded: true,
      })
      .eq("id", user.id);

    if (error) return { error: error.message };
    redirect("/admin");
  }

  // Volunteer onboarding — full safety details required.
  const emergency_contact_name = get("emergency_contact_name");
  const emergency_contact_phone = get("emergency_contact_phone");
  const date_of_birth = get("date_of_birth");
  const guardian_name = get("guardian_name");
  const guardian_phone = get("guardian_phone");
  const tshirt_raw = get("tshirt_size");

  if (!emergency_contact_name || !emergency_contact_phone)
    return { error: "Please provide an emergency contact name and phone." };
  if (!date_of_birth) return { error: "Please enter your date of birth." };

  const dob = new Date(date_of_birth);
  if (Number.isNaN(dob.getTime()) || dob > new Date())
    return { error: "Please enter a valid date of birth." };

  const minor = isMinor(date_of_birth);
  if (minor && (!guardian_name || !guardian_phone))
    return {
      error:
        "Volunteers under 18 must provide a parent or guardian name and phone number.",
    };

  const tshirt_size: TshirtSize | null = SIZES.includes(tshirt_raw)
    ? (tshirt_raw as TshirtSize)
    : null;

  const { error } = await supabase
    .from("profiles")
    .update({
      full_name,
      phone,
      email: user.email ?? null,
      emergency_contact_name,
      emergency_contact_phone,
      date_of_birth,
      guardian_name: minor ? guardian_name : null,
      guardian_phone: minor ? guardian_phone : null,
      tshirt_size,
      onboarded: true,
    })
    .eq("id", user.id);

  if (error) return { error: error.message };

  redirect("/dashboard");
}
