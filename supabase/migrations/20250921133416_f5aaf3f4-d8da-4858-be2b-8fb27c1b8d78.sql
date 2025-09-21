-- FÁZE 1: KRITICKÉ OPRAVY RLS POLITIK A BEZPEČNOSTI (OPRAVENO)

-- 1. Oprava search_path pro existující security definer funkce
CREATE OR REPLACE FUNCTION public.validate_text_input(input_text text, max_length integer DEFAULT 1000)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $function$
BEGIN
  -- Check length
  IF LENGTH(input_text) > max_length THEN
    RETURN false;
  END IF;
  
  -- Check for malicious patterns
  IF input_text ~* '(<script|javascript:|on\w+\s*=|data:text/html|eval\s*\(|document\.cookie|window\.location)' THEN
    -- Log security incident
    PERFORM public.log_security_event(
      'MALICIOUS_INPUT_DETECTED',
      auth.uid(),
      jsonb_build_object('input', left(input_text, 100), 'pattern_detected', true),
      'high'
    );
    RETURN false;
  END IF;
  
  RETURN true;
END;
$function$;

CREATE OR REPLACE FUNCTION public.log_security_event(p_event_type text, p_user_id uuid DEFAULT NULL::uuid, p_details jsonb DEFAULT '{}'::jsonb, p_risk_level text DEFAULT 'low'::text)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $function$
DECLARE
  event_id uuid;
BEGIN
  INSERT INTO public.security_audit_log (
    event_type,
    user_id,
    details,
    risk_level
  ) VALUES (
    p_event_type,
    COALESCE(p_user_id, auth.uid()),
    p_details,
    p_risk_level
  ) RETURNING id INTO event_id;
  
  RETURN event_id;
END;
$function$;

-- 2. Vytvoření security definer funkcí pro admin statistiky (řeší RLS rekurzi)
CREATE OR REPLACE FUNCTION public.get_admin_statistics()
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $function$
DECLARE
  stats jsonb;
BEGIN
  -- Ověř admin oprávnění
  IF NOT EXISTS (
    SELECT 1 FROM admin_permissions ap
    WHERE ap.user_id = auth.uid() 
    AND ap.permission_level IN ('admin', 'super_admin')
    AND ap.is_active = true
  ) THEN
    RAISE EXCEPTION 'Insufficient permissions';
  END IF;

  SELECT jsonb_build_object(
    'total_users', (SELECT COUNT(*) FROM profiles),
    'premium_users', (SELECT COUNT(*) FROM profiles WHERE is_premium = true),
    'dhl_employees', (SELECT COUNT(*) FROM profiles WHERE is_dhl_employee = true),
    'active_shifts', (SELECT COUNT(*) FROM shifts WHERE date >= CURRENT_DATE - INTERVAL '7 days'),
    'rideshare_offers', (SELECT COUNT(*) FROM rideshare_offers WHERE is_active = true),
    'rideshare_contacts', (SELECT COUNT(*) FROM rideshare_contacts WHERE created_at >= CURRENT_DATE - INTERVAL '30 days')
  ) INTO stats;
  
  RETURN stats;
END;
$function$;

-- 3. Vytvoření funkce pro company statistiky (řeší RLS rekurzi v AdminV2)
CREATE OR REPLACE FUNCTION public.get_company_stats(target_company company_type DEFAULT NULL)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER  
SET search_path = public
AS $function$
DECLARE
  stats jsonb;
  user_company company_type;
BEGIN
  -- Získat company uživatele
  SELECT company INTO user_company FROM profiles WHERE id = auth.uid();
  
  -- Ověř oprávnění - admin nebo stejná company
  IF NOT (
    EXISTS (
      SELECT 1 FROM admin_permissions ap
      WHERE ap.user_id = auth.uid() 
      AND ap.permission_level IN ('admin', 'super_admin')
      AND ap.is_active = true
    ) OR user_company = COALESCE(target_company, user_company)
  ) THEN
    RAISE EXCEPTION 'Insufficient permissions';
  END IF;

  SELECT jsonb_build_object(
    'users', (SELECT COUNT(*) FROM profiles WHERE company = COALESCE(target_company, user_company)),
    'premium_users', (SELECT COUNT(*) FROM profiles WHERE company = COALESCE(target_company, user_company) AND is_premium = true),
    'shifts_this_month', (SELECT COUNT(*) FROM shifts s JOIN profiles p ON s.user_id = p.id WHERE p.company = COALESCE(target_company, user_company) AND s.date >= date_trunc('month', CURRENT_DATE))
  ) INTO stats;
  
  RETURN stats;
END;
$function$;

-- 4. Vytvoření security definer funkce pro komplexní permission kontroly
CREATE OR REPLACE FUNCTION public.get_user_permission_level(check_user_id uuid DEFAULT NULL)
RETURNS text
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $function$
  SELECT 
    CASE 
      WHEN EXISTS (
        SELECT 1 FROM admin_permissions ap
        WHERE ap.user_id = COALESCE(check_user_id, auth.uid())
        AND ap.permission_level = 'super_admin'
        AND ap.is_active = true
      ) THEN 'super_admin'
      WHEN EXISTS (
        SELECT 1 FROM admin_permissions ap
        WHERE ap.user_id = COALESCE(check_user_id, auth.uid())
        AND ap.permission_level = 'admin'
        AND ap.is_active = true
      ) THEN 'admin'
      WHEN EXISTS (
        SELECT 1 FROM admin_permissions ap
        WHERE ap.user_id = COALESCE(check_user_id, auth.uid())
        AND ap.permission_level = 'moderator'
        AND ap.is_active = true
      ) THEN 'moderator'
      WHEN EXISTS (
        SELECT 1 FROM admin_permissions ap
        WHERE ap.user_id = COALESCE(check_user_id, auth.uid())
        AND ap.permission_level = 'viewer'
        AND ap.is_active = true
      ) THEN 'viewer'
      ELSE 'user'
    END;
$function$;