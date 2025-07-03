
-- Aktualizovat check constraint pro typ směny, aby zahrnoval i 'custom'
ALTER TABLE shifts 
DROP CONSTRAINT IF EXISTS check_shift_type;

-- Přidat nový constraint s 'custom' typem
ALTER TABLE shifts 
ADD CONSTRAINT check_shift_type 
CHECK (type IN ('morning', 'afternoon', 'night', 'custom'));
