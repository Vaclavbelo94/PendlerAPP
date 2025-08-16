-- Create a function to validate promo codes that bypasses RLS
CREATE OR REPLACE FUNCTION public.validate_promo_code_raw(promo_code_input TEXT)
RETURNS TABLE(
  id UUID,
  code TEXT,
  name TEXT,
  description TEXT,
  company company_type,
  premium_duration_months INTEGER,
  max_users INTEGER,
  used_count INTEGER
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    cpc.id,
    cpc.code,
    cpc.name,
    cpc.description,
    cpc.company,
    cpc.premium_duration_months,
    cpc.max_users,
    cpc.used_count
  FROM public.company_premium_codes cpc
  WHERE UPPER(cpc.code) = UPPER(promo_code_input)
    AND cpc.is_active = true
    AND cpc.valid_from <= NOW()
    AND cpc.valid_until >= NOW()
  LIMIT 1;
END;
$$;