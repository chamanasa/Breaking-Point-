/* Site configuration. See AUTH_SETUP.md for where each value comes from.
 *
 * supabaseUrl / supabaseAnonKey: Supabase → Project Settings → API.
 *   The anon key is meant to be public; access is enforced by the database
 *   rules in supabase/schema.sql. Never put the service_role key here.
 * providers: social sign-in buttons to show (enable each one in Supabase first).
 * otpLength: digits in the email code (Supabase → Auth → Providers → Email).
 * allowGuest: let visitors skip sign-in. Defaults to true until Supabase is
 *   connected, then false.
 */
window.BP_CONFIG = {
  supabaseUrl: "",
  supabaseAnonKey: "",
  providers: { google: true, facebook: true },
  otpLength: 6,
  allowGuest: null
};
