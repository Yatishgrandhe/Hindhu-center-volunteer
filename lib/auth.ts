import { createClient } from "@/lib/supabase/server";
import type { Profile } from "@/lib/database.types";

/**
 * Returns the current authenticated user and their profile row (server-side).
 * Returns nulls when there is no session.
 */
export async function getUserAndProfile(): Promise<{
  user: { id: string; email?: string } | null;
  profile: Profile | null;
}> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { user: null, profile: null };

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .maybeSingle();

  return { user: { id: user.id, email: user.email }, profile };
}
