-- FÁZE 2B: DOKONČENÍ SEARCH_PATH OPRAV PRO VŠECHNY FUNKCE

-- Aktualizace zbývajících funkcí pro search_path
CREATE OR REPLACE FUNCTION public.validate_promo_code_raw(promo_code_input text)
RETURNS TABLE(id uuid, code text, name text, description text, company company_type, premium_duration_months integer, max_users integer, used_count integer)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $function$
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
$function$;

CREATE OR REPLACE FUNCTION public.create_default_user_settings()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $function$
BEGIN
  INSERT INTO public.user_settings (user_id, display_name)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data ->> 'display_name', split_part(NEW.email, '@', 1)))
  ON CONFLICT (user_id) DO NOTHING;
  RETURN NEW;
END;
$function$;

CREATE OR REPLACE FUNCTION public.handle_dhl_assignment_insert()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $function$
BEGIN
  -- If inserting an active assignment, deactivate all other active assignments for this user
  IF NEW.is_active = true THEN
    UPDATE user_dhl_assignments 
    SET is_active = false, updated_at = now()
    WHERE user_id = NEW.user_id 
    AND is_active = true 
    AND id != NEW.id;
  END IF;
  
  RETURN NEW;
END;
$function$;

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

CREATE OR REPLACE FUNCTION public.create_enhanced_notification(p_user_id uuid, p_title text, p_message text, p_type text DEFAULT 'info'::text, p_category text DEFAULT 'system'::text, p_action_url text DEFAULT NULL::text, p_priority text DEFAULT 'medium'::text, p_expires_at timestamp with time zone DEFAULT NULL::timestamp with time zone, p_metadata jsonb DEFAULT '{}'::jsonb, p_language text DEFAULT 'cs'::text, p_related_to jsonb DEFAULT NULL::jsonb)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $function$
DECLARE
  notification_id uuid;
BEGIN
  INSERT INTO public.notifications (
    user_id, title, message, type, category, action_url, 
    priority, expires_at, metadata, language, related_to
  )
  VALUES (
    p_user_id, p_title, p_message, p_type, p_category, p_action_url,
    p_priority, p_expires_at, p_metadata, p_language, p_related_to
  )
  RETURNING id INTO notification_id;
  
  RETURN notification_id;
END;
$function$;

CREATE OR REPLACE FUNCTION public.cleanup_expired_notifications()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $function$
BEGIN
  DELETE FROM public.notifications 
  WHERE expires_at IS NOT NULL AND expires_at < now();
END;
$function$;

CREATE OR REPLACE FUNCTION public.cleanup_rate_limit_logs()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $function$
BEGIN
  DELETE FROM public.rate_limit_log 
  WHERE created_at < now() - interval '24 hours';
END;
$function$;

CREATE OR REPLACE FUNCTION public.send_admin_notification(p_admin_user_id uuid, p_title text, p_message text, p_notification_type text, p_target_type text, p_target_companies text[] DEFAULT NULL::text[], p_target_user_ids uuid[] DEFAULT NULL::uuid[], p_language text DEFAULT 'cs'::text)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $function$
DECLARE
  notification_id uuid;
  target_users uuid[];
  user_record RECORD;
  sent_count integer := 0;
BEGIN
  -- Validate admin permissions
  IF NOT EXISTS (
    SELECT 1 FROM admin_permissions ap
    WHERE ap.user_id = p_admin_user_id
    AND ap.permission_level IN ('admin'::admin_permission_level, 'super_admin'::admin_permission_level)
    AND ap.is_active = true
  ) THEN
    RAISE EXCEPTION 'Insufficient permissions to send admin notifications';
  END IF;

  -- Create admin notification record
  INSERT INTO public.admin_notifications (
    admin_user_id, title, message, notification_type, target_type,
    target_companies, target_user_ids, language
  ) VALUES (
    p_admin_user_id, p_title, p_message, p_notification_type, p_target_type,
    p_target_companies, p_target_user_ids, p_language
  ) RETURNING id INTO notification_id;

  -- Determine target users based on target_type
  IF p_target_type = 'all' THEN
    SELECT array_agg(id) INTO target_users
    FROM profiles
    WHERE id IS NOT NULL;
    
  ELSIF p_target_type = 'company' AND p_target_companies IS NOT NULL THEN
    SELECT array_agg(id) INTO target_users
    FROM profiles
    WHERE company = ANY(p_target_companies::company_type[]);
    
  ELSIF p_target_type = 'user' AND p_target_user_ids IS NOT NULL THEN
    target_users := p_target_user_ids;
  ELSE
    RAISE EXCEPTION 'Invalid target configuration';
  END IF;

  -- Send notifications to target users
  IF target_users IS NOT NULL THEN
    FOR user_record IN
      SELECT unnest(target_users) as user_id
    LOOP
      INSERT INTO public.notifications (user_id, title, message, type, language, related_to)
      VALUES (
        user_record.user_id,
        p_title,
        p_message,
        p_notification_type,
        p_language,
        jsonb_build_object('type', 'admin_notification', 'admin_notification_id', notification_id)
      );
      sent_count := sent_count + 1;
    END LOOP;
  END IF;

  -- Update sent count
  UPDATE public.admin_notifications
  SET sent_count = sent_count, updated_at = now()
  WHERE id = notification_id;

  RETURN notification_id;
END;
$function$;