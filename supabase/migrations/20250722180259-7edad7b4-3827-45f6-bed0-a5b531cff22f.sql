-- Create company enum
CREATE TYPE public.company_type AS ENUM ('adecco', 'randstad', 'dhl');

-- Add company column to profiles table
ALTER TABLE public.profiles 
ADD COLUMN company public.company_type;

-- Create index for company filtering
CREATE INDEX IF NOT EXISTS idx_profiles_company ON public.profiles(company);

-- Update handle_new_user function to handle company assignment
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
DECLARE
  promo_code_input TEXT;
  promo_code_record RECORD;
  is_dhl_code BOOLEAN := FALSE;
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
  
  -- Process promo code if provided
  IF promo_code_input IS NOT NULL AND promo_code_input != '' THEN
    -- Find the promo code in the database
    SELECT * INTO promo_code_record 
    FROM public.promo_codes 
    WHERE UPPER(code) = UPPER(promo_code_input)
    AND valid_until > NOW()
    AND (max_uses IS NULL OR used_count < max_uses);
    
    -- If valid promo code found, create redemption record
    IF FOUND THEN
      -- Create promo code redemption
      INSERT INTO public.promo_code_redemptions (user_id, promo_code_id, redeemed_at)
      VALUES (NEW.id, promo_code_record.id, NOW());
      
      -- Update promo code usage count
      UPDATE public.promo_codes 
      SET used_count = used_count + 1, updated_at = NOW()
      WHERE id = promo_code_record.id;
      
      -- Check if it's a DHL promo code
      IF UPPER(promo_code_record.code) IN ('DHL2026', 'DHL2025', 'DHLSPECIAL') THEN
        is_dhl_code := TRUE;
        
        -- Update profile to mark as DHL employee
        UPDATE public.profiles 
        SET is_dhl_employee = TRUE, updated_at = NOW()
        WHERE id = NEW.id;
      END IF;

      -- Activate premium for 100% discount codes (like PREMIUM2025)
      IF promo_code_record.discount = 100 AND promo_code_record.duration IS NOT NULL THEN
        -- Calculate premium expiry date
        premium_expiry_date := NOW() + (promo_code_record.duration || ' months')::INTERVAL;
        
        -- Update profile with premium status
        UPDATE public.profiles 
        SET 
          is_premium = TRUE,
          premium_expiry = premium_expiry_date,
          updated_at = NOW()
        WHERE id = NEW.id;
      END IF;

    END IF;
  END IF;
  
  RETURN NEW;
END;
$function$;