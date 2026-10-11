# Turning on accounts, the users list and visitor stats

**Why it isn't working yet.** The site is hosted on GitHub Pages, which can
only serve files. It can't send sign-in emails, remember accounts or store
visitor stats. Those need a backend, and this site uses **Supabase**, which is
free to start. Until you connect one, the sign-in page runs in *preview mode*:
it shows, but visitors can only continue as a guest.

Once connected, you get:

| What | Where you see it |
| --- | --- |
| Everyone who signed up: name, email, Google/Facebook/email, join date, last active | Site: account menu → **Admin: users & visitors** (`#admin`). Also Supabase → Authentication → Users |
| Every visitor, signed in or not: visitors per day, page views, top pages, where they came from (LinkedIn, Google, WhatsApp…), device, and which visitors went on to sign up | Site: `#admin/visitors` |
| CSV export of both lists | Buttons on each tab |

Your site address (**SITE_URL**) is `https://chamanasa.github.io/Breaking-Point-/`

---

## Part A: email sign-in, users list and visitor stats (about 15 minutes)

### 1. Create a Supabase project
1. Go to **supabase.com**, sign up (signing in with GitHub is easiest) and
   click **New project**.
2. Name it `breaking-point`, set a database password (save it somewhere), and
   choose the region **South Asia (Mumbai)**. Click **Create**. It takes about
   a minute.

### 2. Create the tables
1. In the left sidebar, open **SQL Editor** and click **New query**.
2. Open [`supabase/schema.sql`](supabase/schema.sql) in this repo, copy
   **all** of it, paste it in, and click **Run**. You should see "Success. No
   rows returned".
3. Make yourself an admin. In a new query, run this with your own email
   address (the one you'll sign in with):
   ```sql
   insert into public.admins (email) values ('you@example.com');   -- your email here
   ```

### 3. Tell Supabase where your site lives
**Authentication → URL Configuration**
- **Site URL:** `https://chamanasa.github.io/Breaking-Point-/`
- **Redirect URLs:** add `https://chamanasa.github.io/Breaking-Point-/**`

### 4. Make the email send a 6-digit code
1. **Authentication → Sign In / Providers → Email**: check it's **enabled**,
   and that **Email OTP length** is **6**.
2. **Authentication → Emails → Templates**: open **Magic Link**, replace the
   body with the text below and save. Do the same for **Confirm signup**.
   ```html
   <h2>Your Breaking Point code</h2>
   <p>Enter this code to sign in:</p>
   <p style="font-size:28px;font-weight:700;letter-spacing:6px">{{ .Token }}</p>
   <p>It expires in 1 hour. If you didn't ask for it, you can ignore this email.</p>
   ```

### 5. Connect the site
1. **Project Settings → API Keys**: copy the **Publishable key**
   (`sb_publishable_…`). Older projects call it the **anon public** key.
   Then open **Project Settings → Data API** and copy the **Project URL**
   (`https://xxxx.supabase.co`).
2. In this repo, open `js/config.js` and fill in the two values:
   ```js
   supabaseUrl: "https://xxxx.supabase.co",
   supabaseAnonKey: "sb_publishable_xxxxxxxx",
   ```
   This key is designed to be public. Never paste a **secret** or
   **service_role** key anywhere in the repo.
3. Commit and push, or send both values to Claude to do it for you.

**Check it works.** Open SITE_URL in a private window, click
**Create an account**, enter your name and email, and type in the code from
your inbox. Then open the account menu (your initials, top right) and choose
**Admin: users & visitors**. You'll see yourself under **Users**, and your
visit under **Visitors**. To keep your own visits out of the numbers, tick
**Don't count my visits from this browser** on that page.

### 6. Before you share the site: set up an email sender
Supabase's built-in sender is for testing only. It sends just a few emails
an hour, so with real traffic people wouldn't get their codes. Connect your
own sender:
1. Create a free account at **resend.com**, add and verify a domain you own
   (or buy a cheap one), and create an SMTP password.
2. In Supabase, open **Authentication → Emails → SMTP Settings** and turn on
   **Custom SMTP**. Enter Host `smtp.resend.com`, Port `465`, Username
   `resend`, the password from Resend, and a sender like
   `no-reply@yourdomain.com`.
3. Then raise the email rate limit under **Authentication → Rate Limits**.

---

## Part B: "Continue with Google" (about 10 minutes)

1. Go to **console.cloud.google.com** and create a project called
   `Breaking Point`.
2. **APIs & Services → OAuth consent screen** (Google Auth Platform): choose
   **External**, set the app name to Breaking Point, and add your email as
   support email. Under **Audience**, click **Publish app** so anyone can
   sign in, not just test users.
3. **Clients → Create client**, type **Web application**:
   - Authorised JavaScript origins: `https://chamanasa.github.io`
   - Authorised redirect URIs: the **Callback URL** shown in Supabase under
     **Authentication → Sign In / Providers → Google**. It looks like
     `https://xxxx.supabase.co/auth/v1/callback`.
4. Copy the **Client ID** and **Client secret** into that Supabase Google
   page, switch it **on** and save.
5. In `js/config.js`, set `providers: { google: true, facebook: false }` and push.

## Part C: "Continue with Facebook" (about 15 minutes)

1. Go to **developers.facebook.com → My Apps → Create app**. Choose the use
   case **Authenticate and request data from users with Facebook Login**.
2. **Use cases → Customise → Settings**: under **Valid OAuth Redirect URIs**,
   add the same `https://xxxx.supabase.co/auth/v1/callback`. Under
   **Permissions**, make sure `email` is added.
3. **App settings → Basic**: copy the **App ID** and **App secret**. Fill in
   a **Privacy Policy URL** and an app icon, which Meta requires before going live.
4. Paste the ID and secret into Supabase **Authentication → Sign In /
   Providers → Facebook**, switch it on and save.
5. Back in Meta, switch the app from **Development** to **Live**. Until you
   do, only people listed as app testers can use Facebook sign-in.
6. In `js/config.js`, set `facebook: true` and push.

---

## If something goes wrong

| What you see | Fix |
| --- | --- |
| Sign-in page says *Preview mode* | `js/config.js` still has empty keys, or the push hasn't deployed yet (wait a minute, then reload). |
| The email has a link but no code | Step 4.2: the template needs `{{ .Token }}`. |
| "Too many attempts" | The built-in email sender's limit (step 6). |
| Google says `redirect_uri_mismatch` | The redirect URI in Google must be exactly Supabase's callback URL (Part B, step 3). |
| After Google/Facebook you land on the wrong page or localhost | Step 3: Site URL and Redirect URLs. |
| Admin page says "You don't have access" | Your email isn't in the admins table (step 2.3), or you signed in with a different email. |
| Admin page says "Couldn't load the data" | Run the latest `supabase/schema.sql` again. It's safe to re-run, and updates on top of an earlier version. |
| Visitors tab stays at zero | Check that `trackVisits` isn't `false` in `js/config.js`, and that you aren't opted out on that browser. Visitors with *Do Not Track* switched on in their browser aren't counted. |

## Good to know
- **Privacy:** visitor stats use a random id stored in the visitor's browser,
  with no IP addresses and no cookies. People who sign up are linked to their
  earlier anonymous visits, so you can see where your sign-ups came from.
- **Who can read the data:** the users list and visitor stats are protected by
  database rules, so only emails in the `admins` table can read them, even if
  someone calls the API directly. Anyone can *add* a page view, which is how
  the tracking works.
- **What sign-in protects:** it controls who can use the app. The site's files
  themselves are still public on GitHub Pages.
- **Progress data** (mock scores, drills, plans) is still stored per browser.
  Syncing it to accounts across devices is the next step whenever you want it.
