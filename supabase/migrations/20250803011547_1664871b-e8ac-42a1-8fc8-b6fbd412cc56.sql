-- Phase 1: Critical Database Security Fixes (Fixed)

-- 1. Fix search_path for all database functions to prevent SQL injection
CREATE OR REPLACE FUNCTION public.get_current_user_company()
 RETURNS company_type
 LANGUAGE sql
 STABLE SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
  SELECT company FROM public.profiles WHERE id = auth.uid();
$function$;

CREATE OR REPLACE FUNCTION public.get_current_user_admin_status()
 RETURNS boolean
 LANGUAGE sql
 STABLE SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
  SELECT COALESCE(is_admin, false) FROM public.profiles WHERE id = auth.uid();
$function$;

CREATE OR REPLACE FUNCTION public.has_admin_permission(user_id uuid, required_level admin_permission_level)
 RETURNS boolean
 LANGUAGE sql
 STABLE SECURITY DEFINER
 SET search_path TO 'public'
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

CREATE OR REPLACE FUNCTION public.is_admin(user_id uuid)
 RETURNS boolean
 LANGUAGE sql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
  SELECT is_admin FROM public.profiles WHERE id = user_id;
$function$;

-- 2. Strengthen profiles table RLS policies
-- Drop existing potentially problematic policies
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;

-- Create separate policies for different types of updates
CREATE POLICY "Users can update non-security profile fields"
ON public.profiles
FOR UPDATE
USING (auth.uid() = id)
WITH CHECK (
  auth.uid() = id AND
  -- Prevent users from modifying security-critical fields
  (profiles.is_admin IS NOT DISTINCT FROM profiles.is_admin) AND
  (profiles.is_premium IS NOT DISTINCT FROM profiles.is_premium) AND 
  (profiles.is_dhl_employee IS NOT DISTINCT FROM profiles.is_dhl_employee) AND
  (profiles.premium_expiry IS NOT DISTINCT FROM profiles.premium_expiry)
);

-- Only system/admin functions can modify security fields
CREATE POLICY "System can update security profile fields"
ON public.profiles
FOR UPDATE
USING (
  -- Only allow system functions or super admins
  current_setting('role') = 'service_role' OR
  EXISTS (
    SELECT 1 FROM public.admin_permissions ap
    WHERE ap.user_id = auth.uid()
    AND ap.permission_level = 'super_admin'
    AND ap.is_active = true
  )
);

-- 3. Add input validation trigger for profiles
CREATE OR REPLACE FUNCTION public.validate_profile_update()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
BEGIN
  -- Validate email format if provided
  IF NEW.email IS NOT NULL AND NEW.email !~ '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$' THEN
    RAISE EXCEPTION 'Invalid email format';
  END IF;
  
  -- Validate username length and characters
  IF NEW.username IS NOT NULL AND (LENGTH(NEW.username) > 50 OR NEW.username ~ '[<>&"'']') THEN
    RAISE EXCEPTION 'Invalid username format';
  END IF;
  
  -- Validate bio length
  IF NEW.bio IS NOT NULL AND LENGTH(NEW.bio) > 1000 THEN
    RAISE EXCEPTION 'Bio too long (max 1000 characters)';
  END IF;
  
  -- Validate website URL format
  IF NEW.website IS NOT NULL AND NEW.website !~ '^https?://[^\s/$.?#].[^\s]*$' THEN
    RAISE EXCEPTION 'Invalid website URL format';
  END IF;
  
  RETURN NEW;
END;
$function$;

-- Apply validation trigger
DROP TRIGGER IF EXISTS validate_profile_update_trigger ON public.profiles;
CREATE TRIGGER validate_profile_update_trigger
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.validate_profile_update();