
-- Add phone_number column to profiles table
ALTER TABLE public.profiles ADD COLUMN phone_number text;

-- Create index for phone number lookups
CREATE INDEX idx_profiles_phone_number ON public.profiles(phone_number);
