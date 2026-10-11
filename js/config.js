/* Site configuration. See AUTH_SETUP.md for where each value comes from.
 *
 * supabaseUrl / supabaseAnonKey: Supabase → Project Settings → API Keys.
 *   Use the "publishable" key (sb_publishable_…) or the legacy "anon public"
 *   key. Either is meant to be public; access is enforced by the database
 *   rules in supabase/schema.sql. Never put a secret or service_role key here.
 * trackVisits: record page views for the admin Visitors tab (default on).
 * providers: social sign-in buttons to show once connected. Switch each to
 *   true only after setting it up in Supabase (AUTH_SETUP.md parts B and C).
 * emailSignIn: false = Google-only sign-in page (no email form, no codes).
 * otpLength: digits in the email code, when emailSignIn is on.
 * allowGuest: let visitors skip sign-in. Defaults to true until Supabase is
 *   connected, then false.
 */
window.BP_CONFIG = {
  supabaseUrl: "https://vbeitzvmzjhpwkbrbdtv.supabase.co",
  supabaseAnonKey: "sb_publishable_WswSPoGP-1u6xUpdH6RHWg_jwpMpbmK",
  providers: { google: true, facebook: false },
  emailSignIn: false,
  otpLength: 6,
  // Temporarily true while Google sign-in is being set up in Supabase;
  // set to null (sign-in required) once it works.
  allowGuest: true,
  trackVisits: true
};
