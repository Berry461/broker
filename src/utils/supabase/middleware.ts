// utils/supabase/middleware.ts
import { createServerClient } from "@supabase/ssr";
import type { NextRequest } from "next/server";

export function createMiddlewareClient(request: NextRequest) {
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name) {
          return request.cookies.get(name)?.value;
        },
        set() {
          // Supabase will try to set cookies here but Next.js middleware can’t set them directly
        },
        remove() {},
      },
    }
  );
}
