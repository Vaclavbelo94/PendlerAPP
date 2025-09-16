-- Drop the existing constraint
ALTER TABLE public.rideshare_contacts DROP CONSTRAINT rideshare_contacts_status_check;

-- Add the new constraint with 'approved' instead of 'accepted'
ALTER TABLE public.rideshare_contacts 
ADD CONSTRAINT rideshare_contacts_status_check 
CHECK (status IN ('pending', 'approved', 'rejected', 'cancelled'));