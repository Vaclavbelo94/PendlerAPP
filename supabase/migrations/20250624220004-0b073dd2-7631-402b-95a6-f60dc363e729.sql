
-- Přidat index na sloupec date pro rychlejší vyhledávání
CREATE INDEX IF NOT EXISTS idx_shifts_date ON shifts(date);

-- Přidat index na kombinaci user_id a date pro optimální výkon
CREATE INDEX IF NOT EXISTS idx_shifts_user_date ON shifts(user_id, date);

-- Přidat constraint pro validaci typu směny
ALTER TABLE shifts 
ADD CONSTRAINT check_shift_type 
CHECK (type IN ('morning', 'afternoon', 'night'));

-- Přidat constraint pro validaci data (nesmí být v budoucnosti více než 1 rok)
ALTER TABLE shifts 
ADD CONSTRAINT check_shift_date 
CHECK (date >= '2020-01-01' AND date <= CURRENT_DATE + INTERVAL '1 year');

-- Povolit RLS na tabulce shifts
ALTER TABLE shifts ENABLE ROW LEVEL SECURITY;

-- Nejdříve smazat existující policies pokud existují
DROP POLICY IF EXISTS "Users can view own shifts" ON shifts;
DROP POLICY IF EXISTS "Users can insert own shifts" ON shifts;
DROP POLICY IF EXISTS "Users can update own shifts" ON shifts;
DROP POLICY IF EXISTS "Users can delete own shifts" ON shifts;

-- Policy pro čtení vlastních směn
CREATE POLICY "Users can view own shifts" ON shifts
FOR SELECT USING (auth.uid() = user_id);

-- Policy pro vkládání vlastních směn
CREATE POLICY "Users can insert own shifts" ON shifts
FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Policy pro aktualizaci vlastních směn
CREATE POLICY "Users can update own shifts" ON shifts
FOR UPDATE USING (auth.uid() = user_id);

-- Policy pro mazání vlastních směn
CREATE POLICY "Users can delete own shifts" ON shifts
FOR DELETE USING (auth.uid() = user_id);
