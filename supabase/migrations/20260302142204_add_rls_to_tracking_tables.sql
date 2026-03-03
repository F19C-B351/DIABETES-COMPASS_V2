-- Enable RLS on glucose_entries
ALTER TABLE glucose_entries ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own glucose entries" ON glucose_entries FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own glucose entries" ON glucose_entries FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own glucose entries" ON glucose_entries FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own glucose entries" ON glucose_entries FOR DELETE USING (auth.uid() = user_id);

-- Enable RLS on insulin_entries
ALTER TABLE insulin_entries ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own insulin entries" ON insulin_entries FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own insulin entries" ON insulin_entries FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own insulin entries" ON insulin_entries FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own insulin entries" ON insulin_entries FOR DELETE USING (auth.uid() = user_id);

-- Enable RLS on activity_entries
ALTER TABLE activity_entries ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own activity entries" ON activity_entries FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own activity entries" ON activity_entries FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own activity entries" ON activity_entries FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own activity entries" ON activity_entries FOR DELETE USING (auth.uid() = user_id);
