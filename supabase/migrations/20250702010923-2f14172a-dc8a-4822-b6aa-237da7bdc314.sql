
-- Přidat sloupce pro čas začátku a konce směny
ALTER TABLE shifts 
ADD COLUMN start_time time,
ADD COLUMN end_time time;

-- Aktualizovat existující záznamy s výchozími časy podle typu směny
UPDATE shifts 
SET 
  start_time = CASE 
    WHEN type = 'morning' THEN '06:00:00'::time
    WHEN type = 'afternoon' THEN '14:00:00'::time  
    WHEN type = 'night' THEN '22:00:00'::time
    ELSE '08:00:00'::time
  END,
  end_time = CASE
    WHEN type = 'morning' THEN '14:00:00'::time
    WHEN type = 'afternoon' THEN '22:00:00'::time
    WHEN type = 'night' THEN '06:00:00'::time
    ELSE '16:00:00'::time
  END
WHERE start_time IS NULL OR end_time IS NULL;

-- Přidat constraint aby časy nebyly null pro nové záznamy
ALTER TABLE shifts 
ALTER COLUMN start_time SET NOT NULL,
ALTER COLUMN end_time SET NOT NULL;
