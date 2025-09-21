-- FÁZE 2: POKRAČOVÁNÍ KRITICKÝCH OPRAV

-- 1. Aktualizace všech funkcí aby měly správný search_path
-- Aktualizujeme handle_new_user funkci
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $function$
DECLARE
  promo_code_input TEXT;
  company_premium_code_record RECORD;
  premium_expiry_date TIMESTAMP WITH TIME ZONE;
  user_company company_type;
  company_string TEXT;
BEGIN
  -- Extract promo code and company from user metadata
  promo_code_input := NEW.raw_user_meta_data ->> 'promo_code';
  company_string := NEW.raw_user_meta_data ->> 'company';
  
  -- Safely cast company string to enum
  BEGIN
    IF company_string IS NOT NULL AND company_string != '' THEN
      user_company := company_string::company_type;
    ELSE
      user_company := NULL;
    END IF;
  EXCEPTION WHEN invalid_text_representation THEN
    -- If company string is not a valid enum value, set to NULL
    user_company := NULL;
    RAISE WARNING 'Invalid company type provided: %', company_string;
  END;
  
  -- Create the profile first with enhanced logic
  BEGIN
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
  EXCEPTION WHEN OTHERS THEN
    RAISE EXCEPTION 'Failed to create user profile: %', SQLERRM;
  END;
  
  -- Process promo code if provided
  IF promo_code_input IS NOT NULL AND promo_code_input != '' THEN
    BEGIN
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
    EXCEPTION WHEN OTHERS THEN
      RAISE WARNING 'Error processing promo code: %', SQLERRM;
      -- Continue execution instead of failing completely
    END;
  END IF;
  
  RETURN NEW;
EXCEPTION WHEN OTHERS THEN
  RAISE EXCEPTION 'handle_new_user failed: %', SQLERRM;
END;
$function$;

-- 2. Aktualizace validate_profile_update funkce
CREATE OR REPLACE FUNCTION public.validate_profile_update()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $function$
BEGIN
  -- Validate email format if provided
  IF NEW.email IS NOT NULL AND NEW.email !~ '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$' THEN
    RAISE EXCEPTION 'Invalid email format';
  END IF;
  
  -- Use enhanced validation function
  IF NEW.username IS NOT NULL AND NOT public.validate_text_input(NEW.username, 50) THEN
    RAISE EXCEPTION 'Invalid username format or potential security threat detected';
  END IF;
  
  IF NEW.bio IS NOT NULL AND NOT public.validate_text_input(NEW.bio, 1000) THEN
    RAISE EXCEPTION 'Invalid bio format or potential security threat detected';
  END IF;
  
  -- Validate website URL format
  IF NEW.website IS NOT NULL AND NEW.website !~ '^https?://[^\s/$.?#].[^\s]*$' THEN
    RAISE EXCEPTION 'Invalid website URL format';
  END IF;
  
  RETURN NEW;
END;
$function$;

-- 3. Aktualizace všech ostatních funkcí
CREATE OR REPLACE FUNCTION public.is_admin(user_id uuid)
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $function$
  SELECT is_admin FROM public.profiles WHERE id = user_id;
$function$;

CREATE OR REPLACE FUNCTION public.has_admin_permission(user_id uuid, required_level admin_permission_level)
RETURNS boolean
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path = public
AS $function$
  SELECT EXISTS (
    SELECT 1 FROM public.admin_permissions
    WHERE admin_permissions.user_id = $1
    AND is_active = true
    AND (expires_at IS NULL OR expires_at > now())
    AND CASE 
      WHEN $2 = 'viewer' THEN permission_level IN ('viewer', 'moderator', 'admin', 'super_admin')
      WHEN $2 = 'moderator' THEN permission_level IN ('moderator', 'admin', 'super_admin')
      WHEN $2 = 'admin' THEN permission_level IN ('admin', 'super_admin')
      WHEN $2 = 'super_admin' THEN permission_level = 'super_admin'
    END
  );
$function$;

-- 4. Aktualizace get_user_admin_permission funkce
CREATE OR REPLACE FUNCTION public.get_user_admin_permission(user_id_param uuid)
RETURNS TABLE(id uuid, user_id uuid, permission_level admin_permission_level, granted_by uuid, granted_at timestamp with time zone, expires_at timestamp with time zone, is_active boolean, created_at timestamp with time zone, updated_at timestamp with time zone)
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $function$
  SELECT 
    ap.id,
    ap.user_id,
    ap.permission_level,
    ap.granted_by,
    ap.granted_at,
    ap.expires_at,
    ap.is_active,
    ap.created_at,
    ap.updated_at
  FROM public.admin_permissions ap
  WHERE ap.user_id = user_id_param 
  AND ap.is_active = true
  ORDER BY ap.granted_at DESC
  LIMIT 1;
$function$;

-- 5. Aktualizace get_current_user_company funkce
CREATE OR REPLACE FUNCTION public.get_current_user_company()
RETURNS company_type
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path = public
AS $function$
  SELECT company FROM public.profiles WHERE id = auth.uid();
$function$;

-- 6. Aktualizace get_current_user_admin_status funkce
CREATE OR REPLACE FUNCTION public.get_current_user_admin_status()
RETURNS boolean
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path = public
AS $function$
  SELECT COALESCE(is_admin, false) FROM public.profiles WHERE id = auth.uid();
$function$;