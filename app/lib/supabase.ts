import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(
  supabaseUrl,
  supabaseAnonKey,
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
    },
  }
);

export async function getSessionUser() {
  if (typeof window === "undefined") {
    // Return null or check headers if on server
    try {
      const { data: { user } } = await supabase.auth.getUser();
      return user;
    } catch {
      return null;
    }
  }

  try {
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    if (sessionError || !session) {
      return null;
    }
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError) {
      if (
        userError.message.includes("Refresh Token Not Found") ||
        userError.message.includes("refresh_token_not_found") ||
        userError.status === 400
      ) {
        await supabase.auth.signOut();
      }
      return null;
    }
    return user;
  } catch (err) {
    return null;
  }
}