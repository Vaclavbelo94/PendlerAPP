-- Fix remaining function search_path issues
CREATE OR REPLACE FUNCTION public.update_company_modules_updated_at()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$function$;

CREATE OR REPLACE FUNCTION public.update_admin_permissions_updated_at()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$function$;

CREATE OR REPLACE FUNCTION public.update_company_settings_updated_at()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$function$;

CREATE OR REPLACE FUNCTION public.handle_new_user_notification_preferences()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
BEGIN
  INSERT INTO public.user_notification_preferences (user_id)
  VALUES (NEW.id)
  ON CONFLICT (user_id) DO NOTHING;
  RETURN NEW;
END;
$function$;

CREATE OR REPLACE FUNCTION public.update_system_config_updated_at()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$function$;

CREATE OR REPLACE FUNCTION public.update_company_menu_items_updated_at()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$function$;

CREATE OR REPLACE FUNCTION public.create_notification(p_user_id uuid, p_title text, p_message text, p_type text DEFAULT 'info'::text, p_related_to jsonb DEFAULT NULL::jsonb)
 RETURNS uuid
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
DECLARE
  notification_id UUID;
BEGIN
  INSERT INTO public.notifications (user_id, title, message, type, related_to)
  VALUES (p_user_id, p_title, p_message, p_type, p_related_to)
  RETURNING id INTO notification_id;
  
  RETURN notification_id;
END;
$function$;

CREATE OR REPLACE FUNCTION public.update_user_work_data_updated_at()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$function$;

CREATE OR REPLACE FUNCTION public.update_updated_at_column()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$function$;

CREATE OR REPLACE FUNCTION public.update_dhl_shift_schedules_updated_at()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$function$;

CREATE OR REPLACE FUNCTION public.notify_shift_changes()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
DECLARE
  old_time text;
  new_time text;
  change_type text;
BEGIN
  -- Pouze pro UPDATE operace
  IF TG_OP = 'UPDATE' THEN
    old_time := OLD.start_time::text;
    new_time := NEW.start_time::text;
    
    -- Kontrola změny času
    IF old_time != new_time THEN
      change_type := 'time_change';
      
      -- Vytvoření okamžité notifikace
      INSERT INTO public.notifications (user_id, title, message, type, related_to)
      VALUES (
        NEW.user_id,
        'Změna směny',
        '🔄 ZMĚNA: Směna ' || NEW.date || ' přesunuta z ' || old_time || ' na ' || new_time,
        'warning',
        jsonb_build_object('type', 'shift_change', 'shift_id', NEW.id, 'old_time', old_time, 'new_time', new_time)
      );
      
      -- Vložení do fronty pro okamžité zpracování
      INSERT INTO public.notification_queue (user_id, notification_type, message_data)
      VALUES (
        NEW.user_id,
        'shift_change',
        jsonb_build_object(
          'shift_id', NEW.id,
          'old_time', old_time,
          'new_time', new_time,
          'date', NEW.date,
          'shift_type', NEW.type,
          'notes', NEW.notes
        )
      );
    END IF;
  END IF;
  
  RETURN COALESCE(NEW, OLD);
END;
$function$;

CREATE OR REPLACE FUNCTION public.handle_new_user()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
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

CREATE OR REPLACE FUNCTION public.get_user_admin_permission(user_id_param uuid)
 RETURNS TABLE(id uuid, user_id uuid, permission_level admin_permission_level, granted_by uuid, granted_at timestamp with time zone, expires_at timestamp with time zone, is_active boolean, created_at timestamp with time zone, updated_at timestamp with time zone)
 LANGUAGE sql
 SECURITY DEFINER
 SET search_path TO 'public'
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