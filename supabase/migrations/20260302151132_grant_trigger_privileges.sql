-- Ensure trigger functions can insert into the tables
-- Grant necessary permissions to the trigger functions' owner

-- Allow the trigger to bypass RLS by setting the function to bypass RLS
ALTER FUNCTION handle_new_user() SET search_path = public;
ALTER FUNCTION assign_user_role() SET search_path = public;

-- Grant execute permissions
GRANT EXECUTE ON FUNCTION handle_new_user() TO postgres, service_role;
GRANT EXECUTE ON FUNCTION assign_user_role() TO postgres, service_role;

-- Grant insert permissions on the tables for triggers
GRANT INSERT ON profiles TO postgres, service_role;
GRANT INSERT ON user_roles TO postgres, service_role;
