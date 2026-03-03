-- Allow public read/write access to the profiles table (unsafe, for demo only)
-- 1. Enable RLS if not already enabled
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
-- 2. Create a policy to allow all access
CREATE POLICY "Allow all access" ON public.profiles
  FOR ALL
  USING (true)
  WITH CHECK (true);
