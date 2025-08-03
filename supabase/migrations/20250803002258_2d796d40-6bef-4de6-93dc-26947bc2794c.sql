-- Allow NULL company for classic premium codes
ALTER TABLE public.company_premium_codes 
ALTER COLUMN company DROP NOT NULL;