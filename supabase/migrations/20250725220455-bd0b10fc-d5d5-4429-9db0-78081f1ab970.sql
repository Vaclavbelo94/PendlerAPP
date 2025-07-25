-- Add phone number and country code to rideshare contacts
ALTER TABLE public.rideshare_contacts 
ADD COLUMN phone_number TEXT,
ADD COLUMN country_code TEXT DEFAULT '+420',
ADD COLUMN requester_email TEXT;