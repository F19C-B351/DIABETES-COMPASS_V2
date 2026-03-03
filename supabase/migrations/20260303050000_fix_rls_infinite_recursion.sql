-- Fix infinite recursion in RLS policies
-- The policies were querying user_roles inline to check admin status,
-- which triggered the user_roles policy again, causing infinite recursion.
-- Solution: Use the is_admin() function which is SECURITY DEFINER and bypasses RLS.

-- Fix user_roles SELECT policy
DROP POLICY IF EXISTS "Users view own role or admins view all" ON public.user_roles;
CREATE POLICY "Users view own role or admins view all"
ON public.user_roles
FOR SELECT
USING (
    auth.uid() = user_id OR is_admin()
);

-- Fix profiles SELECT policy
DROP POLICY IF EXISTS "Users view own or admins view all" ON public.profiles;
CREATE POLICY "Users view own or admins view all"
ON public.profiles
FOR SELECT
USING (
    auth.uid() = user_id OR is_admin()
);
