-- Drop the triggers that are causing issues during registration
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP TRIGGER IF EXISTS on_auth_user_created_assign_role ON auth.users;

-- Keep the functions but don't auto-trigger them
-- The frontend will handle profile and role creation after sign-up
