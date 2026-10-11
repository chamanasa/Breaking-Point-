/* Site configuration. See AUTH_SETUP.md for where each value comes from.
 *
 * supabaseUrl / supabaseAnonKey: Supabase → Project Settings → API Keys.
 *   Use the "publishable" key (sb_publishable_…) or the legacy "anon public"
 *   key. Either is meant to be public; access is enforced by the database
 *   rules in supabase/schema.sql. Never put a secret or service_role key here.
 * trackVisits: record page views for the admin Visitors tab (default on).
 * providers: social sign-in buttons to show once connected. Switch each to
 *   true only after setting it up in Supabase (AUTH_SETUP.md steps 6 and 7).
 * otpLength: digits in the email code (Supabase → Auth → Providers → Email).
 * allowGuest: let visitors skip sign-in. Defaults to true until Supabase is
 *   connected, then false.
 */
window.BP_CONFIG = {
  supabaseUrl: "",
  supabaseAnonKey: "",
  providers: { google: false, facebook: false },
  otpLength: 6,
  allowGuest: null,
  trackVisits: true
};
