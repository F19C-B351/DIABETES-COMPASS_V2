-- Add health goals columns to profiles table
ALTER TABLE profiles
ADD COLUMN IF NOT EXISTS calories_intake NUMERIC,
ADD COLUMN IF NOT EXISTS current_bmi NUMERIC,
ADD COLUMN IF NOT EXISTS current_weight NUMERIC,
ADD COLUMN IF NOT EXISTS desired_weight NUMERIC,
ADD COLUMN IF NOT EXISTS due_date DATE,
ADD COLUMN IF NOT EXISTS start_weight NUMERIC;
