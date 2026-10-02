# Setting up sign-in (Google, Facebook, email code) and the users list

Breaking Point is a static site, so accounts run on **Supabase**, a hosted
backend with authentication and a database. It's free to start. Supabase gives you:

- Google, Facebook and email one-time-code sign-in
- a dashboard listing every user (**Authentication → Users**)
- the in-site admin page at `#admin`, which shows sign-ups, sign-in methods
  and last sign-in, with CSV export

Until you finish step 2, the site runs in **preview mode**: the sign-in page
shows, and visitors can continue as a guest.

Your live site URL is `https://chamanasa.github.io/Breaking-Point-/`. It's used
below as **SITE_URL**.

---

## 1. Create the Supabase project (5 minutes)

1. Go to <https://supabase.com>, sign up, and click **New project**.
   Pick a region close to your users (for example Mumbai, `ap-south-1`).
2. When it's ready, open **Project Settings → API** and copy:
   - **Project URL** (looks like `https://abcdxyz.supabase.co`)
   - **anon public** key (a long string starting `eyJ…`)

## 2. Connect the site

Open `js/config.js` and paste both values:

```js
window.BP_CONFIG = {
  supabaseUrl: "https://abcdxyz.supabase.co",
  supabaseAnonKey: "eyJhbGciOi…",
  providers: { google: true, facebook: true },
  otpLength: 6,
  allowGuest: null
};
```

The anon key is designed to be public. Never paste the **service_role** key
anywhere in this repo.

Commit and push. The site now requires sign-in.

## 3. Create the users table

In Supabase, open **SQL Editor → New query**, paste the whole of
`supabase/schema.sql`, and click **Run**. Then make yourself an admin (use
the email you'll sign in with):

```sql
insert into public.admins (email) values ('you@example.com');
```

## 4. Allow your site's address

**Authentication → URL Configuration**

- **Site URL:** `https://chamanasa.github.io/Breaking-Point-/`
- **Redirect URLs:** add `https://chamanasa.github.io/Breaking-Point-/index.html`
  and `https://chamanasa.github.io/Breaking-Point-/**`

## 5. Email sign-in with a 6-digit code

1. **Authentication → Providers → Email**: make sure it's enabled.
   **Confirm email** can stay on; the code itself confirms the address.
   Check that **Email OTP Length** is 6 (it must match `otpLength`).
2. **Authentication → Email Templates**: edit both **Magic Link** and
   **Confirm signup** so they send the code rather than only a link. For example:

   ```html
   <h2>Your Breaking Point code</h2>
   <p>Enter this code to sign in:</p>
   <p style="font-size:28px;font-weight:700;letter-spacing:6px">{{ .Token }}</p>
   <p>It expires in 1 hour. If you didn't ask for it, ignore this email.</p>
   ```

3. **For real users, set up your own email sender.** Supabase's built-in
   sender allows only a handful of emails per hour and is meant for testing.
   Under **Project Settings → Authentication → SMTP Settings**, connect a provider
   such as Resend, Postmark, Brevo or Amazon SES. Resend has a free tier: verify
   your domain, then copy its SMTP host, user and password here.

## 6. Google sign-in

1. Go to <https://console.cloud.google.com>, create a project, and open
   **APIs & Services → OAuth consent screen**. Choose **External** and fill in
   the app name (Breaking Point), support email and logo. Add the scopes
   `email`, `profile` and `openid`. Publish the app when you're ready for
   anyone to sign in.
2. **APIs & Services → Credentials → Create credentials → OAuth client ID**
   - Application type: **Web application**
   - Authorised JavaScript origins: `https://chamanasa.github.io`
   - Authorised redirect URIs: `https://<your-project>.supabase.co/auth/v1/callback`
     (Supabase shows this exact URL on the Google provider page)
3. Copy the **Client ID** and **Client secret** into Supabase
   **Authentication → Providers → Google**, and enable it.

## 7. Facebook sign-in

1. Go to <https://developers.facebook.com> → **My Apps → Create app**, and pick
   the use case **Authenticate and request data from users with Facebook Login**.
2. In **Facebook Login → Settings**, add the **Valid OAuth Redirect URI**
   `https://<your-project>.supabase.co/auth/v1/callback`.
3. In **App settings → Basic**, copy the **App ID** and **App Secret**. Also add a
   privacy-policy URL and an app icon, which Meta requires before going live.
4. Under **Use cases → Permissions**, make sure `email` and `public_profile` are added.
5. Paste the App ID and Secret into Supabase **Authentication → Providers →
   Facebook**, and enable it.
6. Switch the Meta app from **Development** to **Live**. Until then, only
   people you add as testers can sign in with Facebook.

To hide a button you haven't set up yet, set it to `false` in `js/config.js`
under `providers`.

## 8. See your users

- **In the site:** sign in with your admin email, open the account menu (top
  right) and choose **Admin: users**, or go to `SITE_URL#admin`. You'll see
  totals, new and active users this week, the split by sign-in method, a
  searchable list and **Export CSV**.
- **In Supabase:** **Authentication → Users** for accounts, or
  **Table Editor → profiles** for the same data as a table.

---

### Notes

- **What sign-in protects:** the app opens only after sign-in, and the user list
  is protected by database rules, so only emails in `admins` can read it.
  Because the site's files are public on GitHub Pages, sign-in is a front door
  for the app experience, not a lock on the guide content itself.
- **Progress data:** progress (mock scores, drills, plans) is still stored in
  each browser. Syncing it to the account so it follows users across devices
  is a natural next step, using a `progress` table with the same rules as
  `profiles`.
- **Skipping sign-in while testing:** set `allowGuest: true` in `js/config.js`.
