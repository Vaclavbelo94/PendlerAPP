-- First check all constraints on the table
SELECT conname, pg_get_constraintdef(oid) as definition
FROM pg_constraint
WHERE conrelid = 'public.rideshare_contacts'::regclass;

-- Drop ALL check constraints on this table to start fresh
DO $$
DECLARE
    constraint_record RECORD;
BEGIN
    FOR constraint_record IN 
        SELECT conname 
        FROM pg_constraint 
        WHERE conrelid = 'public.rideshare_contacts'::regclass 
        AND contype = 'c'
    LOOP
        EXECUTE 'ALTER TABLE public.rideshare_contacts DROP CONSTRAINT ' || constraint_record.conname;
    END LOOP;
END $$;

-- Add the correct constraint
ALTER TABLE public.rideshare_contacts 
ADD CONSTRAINT rideshare_contacts_status_check 
CHECK (status IN ('pending', 'approved', 'rejected'));