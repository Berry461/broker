"use server";

import { createClient } from "../../../src/utils/supabase/server";
import { redirect } from "next/navigation";
import { headers } from "next/headers";

export async function signInWithGoogle() {
    const origin = ((await headers()).get("origin"))
    const supabase = await createClient();
    const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
            redirectTo: `${origin}/auth/callback`,
        },
    })

    if (error) {
        redirect("/error")
    } else if (data.url) {
        return redirect(data.url)
    }
}