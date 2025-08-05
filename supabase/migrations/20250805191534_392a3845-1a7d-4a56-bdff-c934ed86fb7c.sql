-- Přidání RLS politiky pro ověření promo kódů během registrace
-- Umožňuje anonymním uživatelům číst active promo kódy pro validaci
CREATE POLICY "Anonymous users can validate active promo codes during registration" 
ON public.company_premium_codes 
FOR SELECT 
TO anon
USING (
  is_active = true 
  AND valid_from <= now() 
  AND valid_until > now()
);