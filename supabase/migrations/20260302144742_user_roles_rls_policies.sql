-- Enable RLS on user_roles
ALTER TABLE user_roles ENABLE ROW LEVEL SECURITY;

-- Everyone can read user_roles
CREATE POLICY "Anyone can read user_roles" ON user_roles
    FOR SELECT USING (true);

-- Only admins can insert user_roles
CREATE POLICY "Admins can insert user_roles" ON user_roles
    FOR INSERT WITH CHECK (is_admin());

-- Only admins can update user_roles
CREATE POLICY "Admins can update user_roles" ON user_roles
    FOR UPDATE USING (is_admin());

-- Only admins can delete user_roles
CREATE POLICY "Admins can delete user_roles" ON user_roles
    FOR DELETE USING (is_admin());

-- Create trigger to auto-assign 'user' role on registration
CREATE OR REPLACE FUNCTION assign_user_role()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO user_roles (user_id, user_role)
    VALUES (NEW.id, 'user')
    ON CONFLICT (user_id) DO NOTHING;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Drop existing trigger if exists and recreate
DROP TRIGGER IF EXISTS on_auth_user_created_assign_role ON auth.users;
CREATE TRIGGER on_auth_user_created_assign_role
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION assign_user_role();
