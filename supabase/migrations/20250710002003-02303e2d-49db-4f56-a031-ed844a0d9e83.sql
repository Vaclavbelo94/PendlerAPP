-- Update existing user assignment with proper reference data
-- Set reference_date to Monday of current week and reference_woche to 12
UPDATE user_dhl_assignments 
SET 
  reference_date = '2025-01-06'::date,  -- Monday of current week (assuming today is in week starting Jan 6, 2025)
  reference_woche = 12,
  updated_at = now()
WHERE reference_date IS NULL OR reference_woche IS NULL;