/*import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

export function createClient() {
  const cookieStore = cookies();

  const adapter = {
    get(name: string) {
      return cookieStore.get(name)?.value;
    },
    set() {
    },
    remove() {
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
  */



import { CookieOptions, createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

export function createClient() {
  const cookieStorePromise = cookies();

  const adapter = {
    async get(name: string) {
      const cookieStore = await cookieStorePromise;
      return cookieStore.get(name)?.value;
    },
    async set(name: string, value: string, options: CookieOptions) {
      // Implementation for set if needed
      const cookieStore = await cookieStorePromise;
      try {
        cookieStore.set({ name, value, ...options });
      } catch {
        // Silent fail for server components
      }
    },
    async remove(name: string, options: CookieOptions) {
      // Implementation for remove if needed
      const cookieStore = await cookieStorePromise;
      try {
        cookieStore.set({ name, value: '', ...options });
      } catch {
        // Silent fail for server components
      }
    },
  };

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: adapter,
    }
  );
}