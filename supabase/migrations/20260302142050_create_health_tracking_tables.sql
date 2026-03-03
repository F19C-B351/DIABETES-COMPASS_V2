-- Add photo_url column to profiles
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS photo_url TEXT;

-- Create glucose_entries table for tracking glucose levels
CREATE TABLE IF NOT EXISTS glucose_entries (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    entry_date DATE NOT NULL,
    entry_time TIME,
    glucose_level NUMERIC NOT NULL,
    measurement_type TEXT, -- fasting, before_meal, after_meal, bedtime
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create insulin_entries table for tracking insulin intake
CREATE TABLE IF NOT EXISTS insulin_entries (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    entry_date DATE NOT NULL,
    entry_time TIME,
    insulin_units NUMERIC NOT NULL,
    insulin_type TEXT, -- rapid, short, intermediate, long
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create activity_entries table for tracking physical activities
CREATE TABLE IF NOT EXISTS activity_entries (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    entry_date DATE NOT NULL,
    activity_type TEXT NOT NULL, -- walking, running, cycling, swimming, yoga, gym, other
    duration_minutes INTEGER NOT NULL,
    calories_burned INTEGER,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for faster queries
CREATE INDEX IF NOT EXISTS idx_glucose_entries_user_date ON glucose_entries(user_id, entry_date DESC);
CREATE INDEX IF NOT EXISTS idx_insulin_entries_user_date ON insulin_entries(user_id, entry_date DESC);
CREATE INDEX IF NOT EXISTS idx_activity_entries_user_date ON activity_entries(user_id, entry_date DESC);
