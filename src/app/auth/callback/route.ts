// app/auth/callback/route.ts
import { NextResponse } from "next/server";
import { createClient } from "../../../../src/utils/supabase/server";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");

  if (!code) {
    return NextResponse.redirect(`${origin}/auth/auth-code-error`);
  }

  const supabase = createClient();

  try {
    // 1. Exchange the code for a session
    const { error: sessionError } = await supabase.auth.exchangeCodeForSession(code);
    if (sessionError) {
      console.error("Session error:", sessionError.message);
      return NextResponse.redirect(`${origin}/auth/auth-code-error`);
    }

    // 2. Get authenticated user
    const { data: userData, error: userError } = await supabase.auth.getUser();
    const user = userData?.user;

    if (userError || !user) {
      return NextResponse.redirect(`${origin}/auth/auth-code-error`);
    }

    const userId = user.id;

    // 3. Check if user_profiles already exists
    const { data: existingProfile } = await supabase
      .from("user_profiles")
      .select("id")
      .eq("id", userId)
      .maybeSingle();

    // 4. If not, insert it using metadata
    if (!existingProfile) {
      const role = user.user_metadata?.role || "tenant";
      const username = user.user_metadata?.username || user.email?.split("@")[0];

      const { error: insertError } = await supabase.from("user_profiles").insert([
        {
          id: userId,
          email: user.email,
          username,
          role,
        },
      ]);

      if (insertError) {
        console.error("Insert profile error:", insertError.message);
        return NextResponse.redirect(`${origin}/auth/auth-code-error`);
      }
    }

    // 5. Get the role from profile and redirect to the right dashboard
    const { data: profile } = await supabase
      .from("user_profiles")
      .select("role")
      .eq("id", userId)
      .single();

    const redirectPath = profile?.role === "landlord"
      ? "/dashboard/landlord"
      : "/dashboard/tenant";

    return NextResponse.redirect(`${origin}${redirectPath}`);
  } catch (err) {
    console.error("Callback route error:", err);
    return NextResponse.redirect(`${origin}/auth/auth-code-error`);
  }
}
