-- First, let's check the current constraint
SELECT conname, pg_get_constraintdef(oid) as definition
FROM pg_constraint
WHERE conname LIKE '%rideshare_contacts%' AND contype = 'c';

-- Drop the existing constraint if it exists
ALTER TABLE public.rideshare_contacts DROP CONSTRAINT IF EXISTS rideshare_contacts_status_check;

-- Add the correct constraint that allows all status values we need
ALTER TABLE public.rideshare_contacts 
ADD CONSTRAINT rideshare_contacts_status_check 
CHECK (status IN ('pending', 'approved', 'rejected'));