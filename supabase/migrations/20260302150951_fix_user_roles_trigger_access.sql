-- Drop existing insert policy and create one that allows the trigger
DROP POLICY IF EXISTS "Admins can insert user_roles" ON user_roles;

-- Allow admins to insert OR allow the trigger (via SECURITY DEFINER) to insert
-- The trigger function runs as SECURITY DEFINER so it bypasses RLS
-- But we need to ensure new users can have their role assigned

-- Create policy that allows inserts from the trigger (when user_id matches the new user)
CREATE POLICY "Allow role assignment on registration" ON user_roles
    FOR INSERT WITH CHECK (
        is_admin() OR user_id = auth.uid()
    );

-- Also check profiles table policies
DROP POLICY IF EXISTS "Users can insert own profile" ON profiles;
CREATE POLICY "Users can insert own profile" ON profiles
    FOR INSERT WITH CHECK (auth.uid() = user_id);
