-- First ensure all users with old promo code redemptions have proper status
-- Update profiles for users who redeemed DHL codes but might not have DHL status
UPDATE profiles 
SET is_dhl_employee = true, updated_at = now()
WHERE id IN (
  SELECT DISTINCT pcr.user_id 
  FROM promo_code_redemptions pcr
  JOIN promo_codes pc ON pcr.promo_code_id = pc.id
  WHERE UPPER(pc.code) IN ('DHL2026', 'DHL2025', 'DHLSPECIAL')
) AND (is_dhl_employee IS NULL OR is_dhl_employee = false);

-- Update profiles for users who redeemed 100% discount codes but might not have premium
UPDATE profiles 
SET 
  is_premium = true, 
  premium_expiry = CASE 
    WHEN premium_expiry IS NULL OR premium_expiry < now() THEN now() + interval '3 months'
    ELSE premium_expiry 
  END,
  updated_at = now()
WHERE id IN (
  SELECT DISTINCT pcr.user_id 
  FROM promo_code_redemptions pcr
  JOIN promo_codes pc ON pcr.promo_code_id = pc.id
  WHERE pc.discount = 100 AND pc.duration IS NOT NULL
) AND (is_premium IS NULL OR is_premium = false OR premium_expiry IS NULL OR premium_expiry < now());

-- Drop old tables in correct order (foreign keys first)
DROP TABLE IF EXISTS promo_code_redemptions CASCADE;
DROP TABLE IF EXISTS promo_codes CASCADE;

-- Update handle_new_user function to remove references to old promo_codes table
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $function$
DECLARE
  promo_code_input TEXT;
  company_premium_code_record RECORD;
  premium_expiry_date TIMESTAMP WITH TIME ZONE;
  user_company company_type;
BEGIN
  -- Extract promo code and company from user metadata
  promo_code_input := NEW.raw_user_meta_data ->> 'promo_code';
  user_company := (NEW.raw_user_meta_data ->> 'company')::company_type;
  
  -- Create the profile first
  INSERT INTO public.profiles (id, email, username, is_admin, is_premium, is_dhl_employee, company)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data ->> 'username', split_part(NEW.email, '@', 1)),
    CASE WHEN NEW.email = 'vaclavbelo94@gmail.com' THEN TRUE ELSE FALSE END,
    CASE WHEN NEW.email = 'vaclavbelo94@gmail.com' THEN TRUE ELSE FALSE END,
    CASE WHEN user_company = 'dhl' THEN TRUE ELSE FALSE END,
    user_company
  );
  
  -- Process promo code if provided (only company premium codes now)
  IF promo_code_input IS NOT NULL AND promo_code_input != '' THEN
    
    -- Look for company premium code
    SELECT * INTO company_premium_code_record 
    FROM public.company_premium_codes 
    WHERE UPPER(code) = UPPER(promo_code_input)
    AND is_active = true
    AND valid_from <= NOW()
    AND valid_until > NOW()
    AND (max_users IS NULL OR used_count < max_users)
    AND (company = user_company OR company IS NULL); -- Allow company-specific or general codes
    
    -- If company premium code found, process it
    IF FOUND THEN
      -- Calculate premium expiry date
      premium_expiry_date := NOW() + (company_premium_code_record.premium_duration_months || ' months')::INTERVAL;
      
      -- Create company premium code redemption
      INSERT INTO public.company_premium_code_redemptions (
        user_id, 
        company_premium_code_id, 
        redeemed_at, 
        premium_expires_at
      )
      VALUES (NEW.id, company_premium_code_record.id, NOW(), premium_expiry_date);
      
      -- Update company premium code usage count
      UPDATE public.company_premium_codes 
      SET used_count = used_count + 1, updated_at = NOW()
      WHERE id = company_premium_code_record.id;
      
      -- Update profile with premium status
      UPDATE public.profiles 
      SET 
        is_premium = TRUE,
        premium_expiry = premium_expiry_date,
        updated_at = NOW()
      WHERE id = NEW.id;
      
      -- If it's a DHL code, mark as DHL employee
      IF user_company = 'dhl' OR company_premium_code_record.company = 'dhl' THEN
        UPDATE public.profiles 
        SET is_dhl_employee = TRUE, updated_at = NOW()
        WHERE id = NEW.id;
      END IF;
    END IF;
  END IF;
  
  RETURN NEW;
END;
$function$;