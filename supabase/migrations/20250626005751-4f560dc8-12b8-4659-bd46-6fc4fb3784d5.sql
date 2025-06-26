
-- Add cycle_weeks field to dhl_positions table
ALTER TABLE public.dhl_positions 
ADD COLUMN cycle_weeks INTEGER[] DEFAULT '{}';

-- Add comment for clarity
COMMENT ON COLUMN public.dhl_positions.cycle_weeks IS 'Array of week numbers (1-15) that this position has in its cycle';

-- Update existing positions with default cycle weeks (example: all 15 weeks)
UPDATE public.dhl_positions 
SET cycle_weeks = ARRAY[1,2,3,4,5,6,7,8,9,10,11,12,13,14,15] 
WHERE cycle_weeks = '{}' OR cycle_weeks IS NULL;
