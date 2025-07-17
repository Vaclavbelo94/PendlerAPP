-- Fix security issues: Add search_path to all functions for security
-- This prevents potential SQL injection through search path manipulation
-- Using CASCADE to handle dependencies

-- Fix function: get_current_user_admin_status (with CASCADE for policies)
DROP FUNCTION IF EXISTS public.get_current_user_admin_status() CASCADE;
CREATE OR REPLACE FUNCTION public.get_current_user_admin_status()
 RETURNS boolean
 LANGUAGE sql
 STABLE SECURITY DEFINER
 SET search_path = public
AS $function$
  SELECT COALESCE(is_admin, false) FROM public.profiles WHERE id = auth.uid();
$function$;

-- Recreate the policies that were dropped with CASCADE
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.profiles;
CREATE POLICY "Admins can view all profiles" ON public.profiles
FOR SELECT USING (public.get_current_user_admin_status() = true);

DROP POLICY IF EXISTS "Admins can update all profiles" ON public.profiles;
CREATE POLICY "Admins can update all profiles" ON public.profiles
FOR UPDATE USING (public.get_current_user_admin_status() = true);

-- Fix function: handle_new_user_notification_preferences
DROP FUNCTION IF EXISTS public.handle_new_user_notification_preferences() CASCADE;
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
DROP FUNCTION IF EXISTS public.create_notification(uuid, text, text, text, jsonb) CASCADE;
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
DROP FUNCTION IF EXISTS public.update_user_work_data_updated_at() CASCADE;
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
DROP FUNCTION IF EXISTS public.update_updated_at_column() CASCADE;
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