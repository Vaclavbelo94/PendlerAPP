-- Add column to track Wechselschicht generated shifts
ALTER TABLE public.shifts 
ADD COLUMN is_wechselschicht_generated boolean DEFAULT false;

-- Add index for better performance when filtering generated shifts
CREATE INDEX idx_shifts_wechselschicht_generated 
ON public.shifts(user_id, is_wechselschicht_generated) 
WHERE is_wechselschicht_generated = true;