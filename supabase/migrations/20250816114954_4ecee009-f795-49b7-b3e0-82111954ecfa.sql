-- Update handle_new_user trigger to better handle company premium codes
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public 
AS $$
DECLARE
  promo_code_input TEXT;
  company_premium_code_record RECORD;
  premium_expiry_date TIMESTAMP WITH TIME ZONE;
  user_company company_type;
BEGIN
  -- Extract promo code and company from user metadata
  promo_code_input := NEW.raw_user_meta_data ->> 'promo_code';
  user_company := (NEW.raw_user_meta_data ->> 'company')::company_type;
  
  -- Create the profile first with enhanced logic
  INSERT INTO public.profiles (id, email, username, is_admin, is_premium, is_dhl_employee, is_adecco_employee, is_randstad_employee, company)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data ->> 'username', split_part(NEW.email, '@', 1)),
    CASE WHEN NEW.email = 'vaclavbelo94@gmail.com' THEN TRUE ELSE FALSE END,
    CASE 
      WHEN NEW.email = 'vaclavbelo94@gmail.com' THEN TRUE 
      WHEN user_company IS NOT NULL THEN TRUE  -- If company is set, assume premium
      ELSE FALSE 
    END,
    CASE 
      WHEN user_company = 'dhl' THEN TRUE 
      WHEN NEW.email = 'vaclavbelo94@gmail.com' THEN TRUE  -- Special admin
      ELSE FALSE 
    END,
    CASE WHEN user_company = 'adecco' THEN TRUE ELSE FALSE END,
    CASE WHEN user_company = 'randstad' THEN TRUE ELSE FALSE END,
    user_company
  );
  
  -- Process promo code if provided
  IF promo_code_input IS NOT NULL AND promo_code_input != '' THEN
    
    -- Look for company premium code
    SELECT * INTO company_premium_code_record 
    FROM public.company_premium_codes 
    WHERE UPPER(code) = UPPER(promo_code_input)
    AND is_active = true
    AND valid_from <= NOW()
    AND valid_until > NOW()
    AND (max_users IS NULL OR used_count < max_users);
    
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
      
      -- Update profile with premium status and company info
      UPDATE public.profiles 
      SET 
        is_premium = TRUE,
        premium_expiry = premium_expiry_date,
        company = COALESCE(company_premium_code_record.company, company),
        is_dhl_employee = CASE 
          WHEN company_premium_code_record.company = 'dhl' OR company = 'dhl' THEN TRUE 
          ELSE is_dhl_employee 
        END,
        is_adecco_employee = CASE 
          WHEN company_premium_code_record.company = 'adecco' OR company = 'adecco' THEN TRUE 
          ELSE is_adecco_employee 
        END,
        is_randstad_employee = CASE 
          WHEN company_premium_code_record.company = 'randstad' OR company = 'randstad' THEN TRUE 
          ELSE is_randstad_employee 
        END,
        updated_at = NOW()
      WHERE id = NEW.id;
      
      -- Create subscriber record for premium tracking
      INSERT INTO public.subscribers (
        user_id,
        email,
        subscribed,
        subscription_end,
        subscription_tier,
        created_at,
        updated_at
      ) VALUES (
        NEW.id,
        NEW.email,
        TRUE,
        premium_expiry_date,
        CASE 
          WHEN company_premium_code_record.company IS NOT NULL THEN 'company'
          ELSE 'premium'
        END,
        NOW(),
        NOW()
      ) ON CONFLICT (user_id) DO UPDATE SET
        subscribed = TRUE,
        subscription_end = premium_expiry_date,
        subscription_tier = CASE 
          WHEN company_premium_code_record.company IS NOT NULL THEN 'company'
          ELSE 'premium'
        END,
        updated_at = NOW();
        
    END IF;
  END IF;
  
  RETURN NEW;
END;
$$;