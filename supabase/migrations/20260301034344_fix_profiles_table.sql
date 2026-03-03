-- Remove email and password columns from profiles table
ALTER TABLE profiles DROP COLUMN IF EXISTS email;
ALTER TABLE profiles DROP COLUMN IF EXISTS password;

-- Add default values for non-nullable columns that might be missing
ALTER TABLE profiles ALTER COLUMN user_id SET NOT NULL;
ALTER TABLE profiles ALTER COLUMN name SET DEFAULT '';
ALTER TABLE profiles ALTER COLUMN diabetes_type SET DEFAULT '';
ALTER TABLE profiles ALTER COLUMN glucose_unit SET DEFAULT '';
ALTER TABLE profiles ALTER COLUMN insulin_user SET DEFAULT '';
