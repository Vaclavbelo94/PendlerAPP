-- Add current_woche column to user_dhl_assignments table
ALTER TABLE public.user_dhl_assignments 
ADD COLUMN current_woche INTEGER CHECK (current_woche >= 1 AND current_woche <= 15);

-- Update existing records to use reference_woche as current_woche if available
UPDATE public.user_dhl_assignments 
SET current_woche = reference_woche 
WHERE reference_woche IS NOT NULL;

-- For records without reference_woche, set a default based on work group
UPDATE public.user_dhl_assignments 
SET current_woche = COALESCE(
  (SELECT week_number FROM public.dhl_work_groups WHERE id = dhl_work_group_id), 
  1
) 
WHERE current_woche IS NULL;