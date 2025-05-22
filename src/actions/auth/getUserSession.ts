import { createClient } from "../../../src/utils/supabase/server";

export async function getUserSession() {
  const supabase = createClient();
  const { data, error } = await supabase.auth.getUser();

  if (error || !data?.user) {
    return null;
  }

  return data.user;
}
