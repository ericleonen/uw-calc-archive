import "server-only"
import { cache } from "react"
import { createClient } from "@/utils/supabase/server"

/**
 * If a user is logged in, returns the User, otherwise, returns null. Caches the User as well.
 */
export const getCurrentUser = cache(async () => {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  return user;
});
