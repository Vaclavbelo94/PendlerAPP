-- First update all non-standard status values
UPDATE public.rideshare_contacts 
SET status = CASE 
    WHEN status = 'accepted' THEN 'approved'
    WHEN status NOT IN ('pending', 'approved', 'rejected') THEN 'pending'
    ELSE status
END;