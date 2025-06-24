
-- Enable Row Level Security on shifts table if not already enabled
ALTER TABLE shifts ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist to avoid conflicts
DROP POLICY IF EXISTS "Users can view own shifts" ON shifts;
DROP POLICY IF EXISTS "Users can insert own shifts" ON shifts;
DROP POLICY IF EXISTS "Users can update own shifts" ON shifts;
DROP POLICY IF EXISTS "Users can delete own shifts" ON shifts;

-- Policy for viewing own shifts
CREATE POLICY "Users can view own shifts" ON shifts
FOR SELECT USING (auth.uid() = user_id);

-- Policy for inserting own shifts
CREATE POLICY "Users can insert own shifts" ON shifts
FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Policy for updating own shifts
CREATE POLICY "Users can update own shifts" ON shifts
FOR UPDATE USING (auth.uid() = user_id);

-- Policy for deleting own shifts
CREATE POLICY "Users can delete own shifts" ON shifts
FOR DELETE USING (auth.uid() = user_id);
