create table if not exists profiles (
  user_id uuid primary key references auth.users(id) on delete cascade,
  name text not null,
  diabetes_type text,
  glucose_unit text,
  insulin_user text,
  created_at timestamp with time zone default timezone('utc'::text, now())
);
