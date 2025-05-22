"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { createClient } from "../../src/utils/supabase/client";

export default function ProtectedRouteWithRole({
  children,
}: {
  children: React.ReactNode;
}) {
  const [checking, setChecking] = useState(true);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    const verify = async () => {
      const supabase = createClient();

      // 1. Try initial session read
      const { data: initial } = await supabase.auth.getSession();
      if (!initial.session) {
        return retryCheck();
      }

      return validateRole(supabase);
    };

    const retryCheck = async () => {
      setTimeout(async () => {
        const supabase = createClient();
        const { data: retry } = await supabase.auth.getSession();

        if (!retry.session) {
          return router.replace("/login");
        }

        return validateRole(supabase);
      }, 300);
    };

    const validateRole = async (supabase: any) => {
      const { data: userData } = await supabase.auth.getUser();
      const userId = userData?.user?.id;

      if (!userId) {
        return router.replace("/login");
      }

      const { data: profile, error } = await supabase
        .from("user_profiles")
        .select("role")
        .eq("id", userId)
        .single();

      if (error || !profile) {
        return router.replace("/login");
      }

      const role = profile.role;

      // Match role to path
      if (
        (pathname.startsWith("/dashboard/landlord") && role !== "landlord") ||
        (pathname.startsWith("/dashboard/tenant") && role !== "tenant")
      ) {
        return router.replace("/login");
      }

      setChecking(false);
    };

    verify();
  }, [pathname, router]);

  if (checking) {
    return <div className="text-center py-4">Checking access...</div>;
  }

  return <>{children}</>;
}
