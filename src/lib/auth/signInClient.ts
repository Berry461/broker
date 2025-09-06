// lib/auth/signInClient.ts
import { createClient } from "../../../src/utils/supabase/client";

export async function signInClient(email: string, password: string) {
  const supabase = createClient();

  // 1. Sign in
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error || !data.user) {
    return { error: error?.message || "Login failed" };
  }

  const user = data.user;

  // 2. Check if profile exists
  let { data: profile } = await supabase
    .from("user_profiles")
    .select("role")
    .eq("id", user.id)
    .maybeSingle();

  // 3. Insert if missing (RLS-safe: id = auth.uid())
  if (!profile) {
    const role = user.user_metadata?.role || "tenant";
    const username = user.user_metadata?.username || user.email?.split("@")[0];

    const { error: insertError } = await supabase.from("user_profiles").insert([
      {
        id: user.id, // ✅ must match auth.uid()
        email: user.email,
        username,
        role,
      },
    ]);

    if (insertError) {
      return { error: insertError.message };
    }

    profile = { role };
  }

  return { user, role: profile.role };
}
