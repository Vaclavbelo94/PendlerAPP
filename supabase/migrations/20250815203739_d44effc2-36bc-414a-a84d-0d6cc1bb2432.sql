-- Fix RLS policy for anonymous promo code validation
-- Change from timestamp comparison to date comparison to handle edge cases

DROP POLICY IF EXISTS "Anonymous users can validate active promo codes during registra" ON public.company_premium_codes;

CREATE POLICY "Anonymous users can validate active promo codes during registra" 
ON public.company_premium_codes 
FOR SELECT 
USING (
  is_active = true 
  AND valid_from <= now() 
  AND valid_until >= date_trunc('day', now())
);