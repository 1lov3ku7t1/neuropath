-- Create profiles table
create table public.profiles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null unique,
  full_name text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Create test type enum
create type public.test_type as enum ('spiral_drawing', 'voice_analysis', 'symptom_questionnaire', 'finger_tapping');

-- Create risk level enum
create type public.risk_level as enum ('low', 'moderate', 'high');

-- Create test_results table
create table public.test_results (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  test_type public.test_type not null,
  score numeric not null,
  risk_level public.risk_level not null,
  details jsonb default '{}'::jsonb,
  created_at timestamptz default now()
);

-- Enable RLS
alter table public.profiles enable row level security;
alter table public.test_results enable row level security;

-- Profiles RLS
create policy "Users can view own profile" on public.profiles for select to authenticated using (user_id = auth.uid());
create policy "Users can insert own profile" on public.profiles for insert to authenticated with check (user_id = auth.uid());
create policy "Users can update own profile" on public.profiles for update to authenticated using (user_id = auth.uid());

-- Test results RLS
create policy "Users can view own results" on public.test_results for select to authenticated using (user_id = auth.uid());
create policy "Users can insert own results" on public.test_results for insert to authenticated with check (user_id = auth.uid());
create policy "Users can delete own results" on public.test_results for delete to authenticated using (user_id = auth.uid());

-- Auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (user_id, full_name)
  values (new.id, new.raw_user_meta_data ->> 'full_name');
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();
