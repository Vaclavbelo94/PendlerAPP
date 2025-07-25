-- Add phone number and country code to rideshare_contacts table
ALTER TABLE public.rideshare_contacts 
ADD COLUMN phone_number TEXT,
ADD COLUMN country_code TEXT DEFAULT '+420';

-- Add email column for better contact management
ALTER TABLE public.rideshare_contacts 
ADD COLUMN requester_email TEXT;