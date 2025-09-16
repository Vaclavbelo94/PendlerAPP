-- First, let's see exactly what we have
SELECT status, COUNT(*) FROM public.rideshare_contacts GROUP BY status;

-- Update 'accepted' to 'approved' to match our code
UPDATE public.rideshare_contacts SET status = 'approved' WHERE status = 'accepted';

-- Now add the constraint that matches our code logic  
ALTER TABLE public.rideshare_contacts 
ADD CONSTRAINT rideshare_contacts_status_check 
CHECK (status IN ('pending', 'approved', 'rejected', 'cancelled'));