-- Fix assign_user_role function with proper enum cast and exception handling
CREATE OR REPLACE FUNCTION assign_user_role()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO user_roles (user_id, user_role)
    VALUES (NEW.id, 'user'::app_role)
    ON CONFLICT (user_id) DO NOTHING;
    RETURN NEW;
EXCEPTION WHEN OTHERS THEN
    -- Log error but don't fail user creation
    RAISE WARNING 'Error in assign_user_role: %', SQLERRM;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Ensure handle_new_user also has proper error handling
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (user_id, name, phone_number, diabetes_type, glucose_unit, insulin_user, email)
    VALUES (
        NEW.id, 
        COALESCE(NEW.raw_user_meta_data->>'name', ''),
        NEW.raw_user_meta_data->>'phone_number',
        COALESCE(NEW.raw_user_meta_data->>'diabetes_type', ''),
        COALESCE(NEW.raw_user_meta_data->>'glucose_unit', ''),
        COALESCE(NEW.raw_user_meta_data->>'insulin_user', ''),
        NEW.email
    )
    ON CONFLICT (user_id) DO UPDATE SET
        name = COALESCE(EXCLUDED.name, profiles.name),
        phone_number = COALESCE(EXCLUDED.phone_number, profiles.phone_number),
        diabetes_type = COALESCE(EXCLUDED.diabetes_type, profiles.diabetes_type),
        glucose_unit = COALESCE(EXCLUDED.glucose_unit, profiles.glucose_unit),
        insulin_user = COALESCE(EXCLUDED.insulin_user, profiles.insulin_user),
        email = COALESCE(EXCLUDED.email, profiles.email);
    RETURN NEW;
EXCEPTION WHEN OTHERS THEN
    -- Log error but don't fail user creation
    RAISE WARNING 'Error in handle_new_user: %', SQLERRM;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
