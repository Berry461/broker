import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

export function createClient() {
  const cookieStore = cookies();

  const adapter = {
    get(name: string) {
      return cookieStore.get(name)?.value;
    },
    set() {
      /* noop */
    },
    remove() {
      /* noop */
    },
  };

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: adapter as any, // ✅ prevent TypeScript error here
    }
  );
}
