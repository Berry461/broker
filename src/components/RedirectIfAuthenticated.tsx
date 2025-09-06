"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "../../src/utils/supabase/client";
import { SupabaseClient } from '@supabase/supabase-js';
import { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime';

export default function RedirectIfAuthenticated({
  children,
}: {
  children: React.ReactNode;
}) {
  const [checking, setChecking] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const checkSession = async () => {
      const supabase = createClient();

      // Try twice with short delay in between
      const { data: initial } = await supabase.auth.getSession();

      if (initial.session) {
        await redirectByRole(supabase, router);
        return;
      }

      // Delay and try again (to allow cookie hydration)
      setTimeout(async () => {
        const { data: retry } = await supabase.auth.getSession();
        if (retry.session) {
          await redirectByRole(supabase, router);
        } else {
          setChecking(false); // No session, show login/signup
        }
      }, 300); // 300ms delay
    };

    const redirectByRole = async (supabase: SupabaseClient, router: AppRouterInstance) => {
      const { data: userData } = await supabase.auth.getUser();
      const userId = userData?.user?.id;

      if (!userId) return router.replace("/dashboard/tenant");

      const { data: profile } = await supabase
        .from("user_profiles")
        .select("role")
        .eq("id", userId)
        .single();

      const path =
        profile?.role === "landlord"
          ? "/dashboard/landlord"
          : "/dashboard/tenant";

      router.replace(path);
    };

    checkSession();
  }, [router]);

  if (checking) return <div className="text-center py-4">Checking session...</div>;

  return <>{children}</>;
}
