-- Add policy to allow service role to access company_premium_codes
CREATE POLICY "Service role can access all promo codes" ON public.company_premium_codes
FOR ALL USING (current_setting('role') = 'service_role');

-- Also grant explicit permissions to service role
GRANT ALL ON public.company_premium_codes TO service_role;