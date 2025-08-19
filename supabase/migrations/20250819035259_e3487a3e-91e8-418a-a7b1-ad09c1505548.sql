-- Add unique constraint on user_id in user_extended_profiles table
-- This will fix the "ON CONFLICT specification" error

ALTER TABLE public.user_extended_profiles 
ADD CONSTRAINT user_extended_profiles_user_id_unique 
UNIQUE (user_id);