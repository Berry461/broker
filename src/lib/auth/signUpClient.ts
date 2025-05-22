// lib/auth/signUpClient.ts
import { createClient } from "../../../src/utils/supabase/client";

export async function signUpClient(
  email: string,
  password: string,
  username: string,
  role: "tenant" | "landlord"
) {
  const supabase = createClient();

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        username,
        role,
      },
      emailRedirectTo: `${window.location.origin}/auth/callback`, // ensure it hits route.ts
    },
  });

  if (error || !data.user) {
    return { error: error?.message || "Signup failed" };
  }

  return { user: data.user };
}
