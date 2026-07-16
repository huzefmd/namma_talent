-- =========================================================
-- Namma Talent — Supabase schema
-- Run this in the Supabase SQL editor (or via `supabase db push`)
-- =========================================================

-- ---------- Extensions ----------
create extension if not exists "uuid-ossp";

-- ---------- users ----------
-- Mirrors auth.users with the app-specific role field.
-- A row is created automatically by the trigger below whenever
-- someone signs up through Supabase Auth.
create table if not exists public.users (
  id uuid primary key references auth.users (id) on delete cascade,
  email text not null,
  role text not null check (role in ('buyer', 'lister')),
  created_at timestamptz not null default now()
);

alter table public.users enable row level security;

create policy "Users can view all profiles"
  on public.users for select
  using (true);

create policy "Users can update their own row"
  on public.users for update
  using (auth.uid() = id);

-- ---------- talents ----------
create table if not exists public.talents (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references public.users (id) on delete cascade,
  name text not null,
  category text not null,
  location text not null,
  bio text default '',
  price_range text default '',
  portfolio_images text[] default '{}',
  contact_phone text default '',
  subscription_status text not null default 'trial'
    check (subscription_status in ('trial', 'active', 'expired')),
  trial_end_date timestamptz not null default (now() + interval '60 days'),
  views_count integer not null default 0,
  contacts_count integer not null default 0,
  created_at timestamptz not null default now(),
  unique (user_id)
);

alter table public.talents enable row level security;

create policy "Anyone can view talent profiles"
  on public.talents for select
  using (true);

create policy "Listers can insert their own talent profile"
  on public.talents for insert
  with check (auth.uid() = user_id);

create policy "Listers can update their own talent profile"
  on public.talents for update
  using (auth.uid() = user_id);

-- ---------- subscriptions ----------
create table if not exists public.subscriptions (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references public.users (id) on delete cascade,
  plan_type text not null default 'monthly' check (plan_type in ('monthly', 'annual')),
  razorpay_subscription_id text,
  status text not null default 'created'
    check (status in ('created', 'active', 'pending', 'halted', 'cancelled', 'completed')),
  start_date timestamptz,
  end_date timestamptz,
  created_at timestamptz not null default now()
);

alter table public.subscriptions enable row level security;

create policy "Users can view their own subscriptions"
  on public.subscriptions for select
  using (auth.uid() = user_id);

create policy "Users can insert their own subscription record"
  on public.subscriptions for insert
  with check (auth.uid() = user_id);

-- ---------- contacts ----------
-- Logs every time a buyer reveals/taps "contact" on a talent profile.
create table if not exists public.contacts (
  id uuid primary key default uuid_generate_v4(),
  buyer_id uuid not null references public.users (id) on delete cascade,
  talent_id uuid not null references public.talents (id) on delete cascade,
  created_at timestamptz not null default now()
);

alter table public.contacts enable row level security;

create policy "Buyers can view their own contact log"
  on public.contacts for select
  using (auth.uid() = buyer_id);

create policy "Buyers can log a contact"
  on public.contacts for insert
  with check (auth.uid() = buyer_id);

-- keep talents.contacts_count in sync
create or replace function public.increment_contacts_count()
returns trigger as $$
begin
  update public.talents
    set contacts_count = contacts_count + 1
    where id = new.talent_id;
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_contact_created on public.contacts;
create trigger on_contact_created
  after insert on public.contacts
  for each row execute function public.increment_contacts_count();

-- ---------- auto-create public.users row on signup ----------
-- role is passed in raw_user_meta_data at signup time, e.g. { role: 'lister' }
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.users (id, email, role)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'role', 'buyer')
  );
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ---------- daily job: expire trials that have lapsed ----------
-- Schedule this with pg_cron (Supabase: Database > Cron Jobs), e.g. every hour:
--   select cron.schedule('expire-trials', '0 * * * *', 'select public.expire_lapsed_trials();');
create or replace function public.expire_lapsed_trials()
returns void as $$
begin
  update public.talents
    set subscription_status = 'expired'
    where subscription_status = 'trial'
      and trial_end_date < now();
end;
$$ language plpgsql security definer;

-- ---------- storage bucket for portfolio images ----------
insert into storage.buckets (id, name, public)
values ('portfolio-images', 'portfolio-images', true)
on conflict (id) do nothing;

create policy "Portfolio images are publicly viewable"
  on storage.objects for select
  using (bucket_id = 'portfolio-images');

create policy "Listers can upload their own portfolio images"
  on storage.objects for insert
  with check (
    bucket_id = 'portfolio-images'
    and auth.uid()::text = (storage.foldername(name))[1]
  );

create policy "Listers can update/delete their own portfolio images"
  on storage.objects for update using (
    bucket_id = 'portfolio-images'
    and auth.uid()::text = (storage.foldername(name))[1]
  );

create policy "Listers can delete their own portfolio images"
  on storage.objects for delete using (
    bucket_id = 'portfolio-images'
    and auth.uid()::text = (storage.foldername(name))[1]
  );
