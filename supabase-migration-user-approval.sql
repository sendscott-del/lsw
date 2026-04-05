-- User approval system
create table steward_user_profiles (
  id uuid references auth.users primary key,
  full_name text,
  email text,
  status text not null default 'pending' check (status in ('pending', 'approved', 'rejected')),
  selected_template_id uuid references steward_templates(id),
  selected_template_name text,
  approved_at timestamptz,
  approved_by uuid,
  created_at timestamptz default now()
);

alter table steward_user_profiles enable row level security;

-- Everyone can read (needed for admin to see pending users)
create policy "user_profiles_select" on steward_user_profiles for select using (true);
-- Users can insert their own profile
create policy "user_profiles_insert" on steward_user_profiles for insert with check (id = auth.uid());
-- Users can update their own, admins can update any
create policy "user_profiles_update" on steward_user_profiles for update using (true);
