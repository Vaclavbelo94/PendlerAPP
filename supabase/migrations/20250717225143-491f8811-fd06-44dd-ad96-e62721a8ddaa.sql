-- Fix security issues: Add search_path to all functions for security
-- This prevents potential SQL injection through search path manipulation

-- Fix function: get_current_user_admin_status
DROP FUNCTION IF EXISTS public.get_current_user_admin_status();
CREATE OR REPLACE FUNCTION public.get_current_user_admin_status()
 RETURNS boolean
 LANGUAGE sql
 STABLE SECURITY DEFINER
 SET search_path = public
AS $function$
  SELECT COALESCE(is_admin, false) FROM public.profiles WHERE id = auth.uid();
$function$;

-- Fix function: handle_new_user_notification_preferences
DROP FUNCTION IF EXISTS public.handle_new_user_notification_preferences();
CREATE OR REPLACE FUNCTION public.handle_new_user_notification_preferences()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path = public
AS $function$
BEGIN
  INSERT INTO public.user_notification_preferences (user_id)
  VALUES (NEW.id)
  ON CONFLICT (user_id) DO NOTHING;
  RETURN NEW;
END;
$function$;

-- Fix function: create_notification
DROP FUNCTION IF EXISTS public.create_notification(uuid, text, text, text, jsonb);
CREATE OR REPLACE FUNCTION public.create_notification(p_user_id uuid, p_title text, p_message text, p_type text DEFAULT 'info'::text, p_related_to jsonb DEFAULT NULL::jsonb)
 RETURNS uuid
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path = public
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

-- Fix function: update_user_work_data_updated_at
DROP FUNCTION IF EXISTS public.update_user_work_data_updated_at();
CREATE OR REPLACE FUNCTION public.update_user_work_data_updated_at()
 RETURNS trigger
 LANGUAGE plpgsql
 SET search_path = public
AS $function$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$function$;

-- Fix function: update_updated_at_column
DROP FUNCTION IF EXISTS public.update_updated_at_column();
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
 RETURNS trigger
 LANGUAGE plpgsql
 SET search_path = public
AS $function$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$function$;

-- Fix function: update_dhl_shift_schedules_updated_at
DROP FUNCTION IF EXISTS public.update_dhl_shift_schedules_updated_at();
CREATE OR REPLACE FUNCTION public.update_dhl_shift_schedules_updated_at()
 RETURNS trigger
 LANGUAGE plpgsql
 SET search_path = public
AS $function$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$function$;

-- Fix function: notify_shift_changes
DROP FUNCTION IF EXISTS public.notify_shift_changes();
CREATE OR REPLACE FUNCTION public.notify_shift_changes()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path = public
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

-- Fix function: is_admin
DROP FUNCTION IF EXISTS public.is_admin(uuid);
CREATE OR REPLACE FUNCTION public.is_admin(user_id uuid)
 RETURNS boolean
 LANGUAGE sql
 SECURITY DEFINER
 SET search_path = public
AS $function$
  SELECT is_admin FROM profiles WHERE id = user_id
$function$;

-- Fix function: handle_new_user
DROP FUNCTION IF EXISTS public.handle_new_user();
CREATE OR REPLACE FUNCTION public.handle_new_user()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path = public
AS $function$
DECLARE
  promo_code_input TEXT;
  promo_code_record RECORD;
  is_dhl_code BOOLEAN := FALSE;
  premium_expiry_date TIMESTAMP WITH TIME ZONE;
BEGIN
  -- Extract promo code from user metadata
  promo_code_input := NEW.raw_user_meta_data ->> 'promo_code';
  
  -- Create the profile first
  INSERT INTO public.profiles (id, email, username, is_admin, is_premium, is_dhl_employee)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data ->> 'username', split_part(NEW.email, '@', 1)),
    CASE WHEN NEW.email = 'vaclavbelo94@gmail.com' THEN TRUE ELSE FALSE END,
    CASE WHEN NEW.email = 'vaclavbelo94@gmail.com' THEN TRUE ELSE FALSE END,
    FALSE -- Will be updated if DHL promo code is found
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

      -- NEW: Activate premium for 100% discount codes (like PREMIUM2025)
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