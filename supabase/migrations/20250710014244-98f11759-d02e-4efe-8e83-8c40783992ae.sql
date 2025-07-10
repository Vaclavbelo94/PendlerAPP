-- Oprava reference_woche pro uživatele s Woche 3 work group
-- reference_woche by měla odpovídat week_number z work group
-- reference_date by měl být pondělí

UPDATE user_dhl_assignments 
SET 
    reference_woche = 3,  -- Odpovídá week_number z work group
    reference_date = '2025-07-07',  -- Pondělí tento týden
    updated_at = now()
WHERE user_id = 'e754b831-b3a9-4edd-ae73-eca0a4ac4c29' 
    AND is_active = true;