-- Update any 'accepted' status to 'approved'
UPDATE public.rideshare_contacts 
SET status = 'approved' 
WHERE status = 'accepted';

-- Now add the correct constraint
ALTER TABLE public.rideshare_contacts 
ADD CONSTRAINT rideshare_contacts_status_check 
CHECK (status IN ('pending', 'approved', 'rejected'));