-- Add foreign key constraint to connect profiles.user_id with auth.users.id
ALTER TABLE public.profiles
ADD CONSTRAINT profiles_user_id_fkey 
FOREIGN KEY (user_id) 
REFERENCES auth.users(id) 
ON DELETE CASCADE;

-- Add email column to profiles for easier querying
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS email TEXT;

-- Populate email from auth.users
UPDATE public.profiles p
SET email = u.email
FROM auth.users u
WHERE p.user_id = u.id AND p.email IS NULL;

-- Create trigger to auto-populate email on profile creation
CREATE OR REPLACE FUNCTION public.populate_profile_email()
RETURNS TRIGGER AS $$
BEGIN
    SELECT email INTO NEW.email FROM auth.users WHERE id = NEW.user_id;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS populate_email_trigger ON public.profiles;
CREATE TRIGGER populate_email_trigger
    BEFORE INSERT ON public.profiles
    FOR EACH ROW
    WHEN (NEW.email IS NULL)
    EXECUTE FUNCTION populate_profile_email();
