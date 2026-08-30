import "react-native-url-polyfill/auto";
import { createClient } from "@supabase/supabase-js";

// Reads your keys from .env (never hardcode them directly here).
// EXPO_PUBLIC_ prefix is required for Expo to expose these to app code.
const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn(
    "Missing Supabase config — check that .env has EXPO_PUBLIC_SUPABASE_URL and EXPO_PUBLIC_SUPABASE_ANON_KEY set."
  );
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    // No session persistence storage configured yet — added when we
    // build real login/logout flows. For now, sessions reset on reload.
    autoRefreshToken: true,
    persistSession: false,
    detectSessionInUrl: false,
  },
});
