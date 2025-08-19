-- Add missing employee columns to profiles table
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS is_adecco_employee BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS is_randstad_employee BOOLEAN DEFAULT FALSE;