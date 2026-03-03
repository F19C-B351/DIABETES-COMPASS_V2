-- Create function to sync profile data to auth.users raw_user_meta_data
CREATE OR REPLACE FUNCTION sync_profile_to_auth()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE auth.users
    SET raw_user_meta_data = jsonb_build_object(
        'name', NEW.name,
        'phone_number', NEW.phone_number,
        'diabetes_type', NEW.diabetes_type,
        'glucose_unit', NEW.glucose_unit,
        'insulin_user', NEW.insulin_user
    )
    WHERE id = NEW.user_id;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger to run on profile insert/update
DROP TRIGGER IF EXISTS sync_profile_trigger ON profiles;
CREATE TRIGGER sync_profile_trigger
    AFTER INSERT OR UPDATE ON profiles
    FOR EACH ROW
    EXECUTE FUNCTION sync_profile_to_auth();
