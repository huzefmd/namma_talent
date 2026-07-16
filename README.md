# Namma Talent · ನಮ್ಮ ಟ್ಯಾಲೆಂಟ್

A two-sided marketplace for discovering and hiring local talent in Bengaluru — photographers, designers, tutors, musicians and freelancers.

Built with Next.js (App Router), Supabase (auth + Postgres + storage), Razorpay (subscriptions), and Tailwind CSS.

## What's built

1. **Landing page** (`app/page.tsx`) — hero with bilingual branding, category preview grid, "Join as Talent" / "Find Talent" CTAs.
2. **Auth** (`app/signup`, `app/login`) — role selection at signup, Supabase email/password, role-based redirect on login.
3. **Lister profile creation** (`app/lister/profile-edit`) — form with category/area pickers and multi-image upload to Supabase Storage.
4. **Buyer browse/search** (`app/buyer/dashboard`) — filter by category + area, text search, card grid, expired profiles rank lower and show "Inactive."
5. **Subscriptions** (`app/lister/subscribe`, `app/api/razorpay/*`) — Razorpay Checkout for subscriptions, webhook keeps status in sync, trial countdown shown while on trial.

Plus: `app/lister/dashboard` (stats + status), `app/talent/[id]` (public profile with gated contact button), full RLS-protected schema in `supabase/schema.sql`.

## 1. Set up Supabase

1. Create a project at [supabase.com](https://supabase.com).
2. In the SQL editor, run the entire contents of `supabase/schema.sql`. This creates:
   - `users`, `talents`, `subscriptions`, `contacts` tables with row-level security
   - a trigger that creates a `public.users` row (with `role` from signup metadata) whenever someone signs up
   - a trigger that increments `contacts_count` when a buyer contacts a talent
   - the `portfolio-images` storage bucket with public read / owner-only write policies
   - `expire_lapsed_trials()`, a function to flip `trial` → `expired` once `trial_end_date` passes
3. Schedule `expire_lapsed_trials()` to run hourly via **Database → Cron Jobs** (pg_cron), or call it from an external cron hitting a small API route — see note in the SQL file.
4. Copy your Project URL, anon key, and service role key into `.env.local` (see `.env.example`).

## 2. Set up Razorpay

1. In the Razorpay dashboard, create two **Plans** under Subscriptions (e.g. monthly ₹299, annual ₹2,999) and copy their plan IDs.
2. Copy your Key ID / Key Secret into `.env.local`.
3. Add a webhook pointing at `https://your-domain.com/api/razorpay/webhook`, subscribed to `subscription.activated`, `subscription.charged`, `subscription.halted`, `subscription.cancelled`, `subscription.completed`. Copy the webhook secret into `.env.local`.
4. In test mode, use Razorpay's [test cards](https://razorpay.com/docs/payments/payments/test-card-upi-details/) to run through checkout end to end.

## 3. Run locally

```bash
npm install
cp .env.example .env.local   # then fill in real values
npm run dev
```

Visit `http://localhost:3000`.

## How the trial/subscription logic works

- On lister signup, a `talents` row is created immediately with `subscription_status = 'trial'` and `trial_end_date = now() + 60 days` (schema default — see `supabase/schema.sql`).
- The contact button on a public profile only renders (`lib/constants.ts` → `canBeContacted`) when status is `active`, or `trial` with `trial_end_date` still in the future.
- Once `trial_end_date` passes, the scheduled `expire_lapsed_trials()` job flips status to `expired`. The profile stays live but is deprioritized in `buyer/dashboard` search and the contact button disappears — nothing is deleted.
- Successful Razorpay payments hit the webhook, which sets `talents.subscription_status = 'active'` and updates the matching `subscriptions` row — buyers are never charged or gated at any point.

## Notes / next steps

- Image uploads go straight to the `portfolio-images` bucket under `{user_id}/...`, matching the storage RLS policies in the schema.
- Views are incremented via the service-role client so anonymous visitors can trigger it without needing write RLS on `talents`.
- For production, swap the client-side Razorpay Checkout flow for server-verified payment signatures if you add one-time payments alongside subscriptions.
