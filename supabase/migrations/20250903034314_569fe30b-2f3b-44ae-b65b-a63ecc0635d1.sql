-- Fix search_path security warnings for the functions I created
CREATE OR REPLACE FUNCTION public.cleanup_expired_notifications()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $function$
BEGIN
  DELETE FROM public.notifications 
  WHERE expires_at IS NOT NULL AND expires_at < now();
END;
$function$;

CREATE OR REPLACE FUNCTION public.create_enhanced_notification(
  p_user_id uuid,
  p_title text,
  p_message text,
  p_type text DEFAULT 'info',
  p_category text DEFAULT 'system',
  p_action_url text DEFAULT NULL,
  p_priority text DEFAULT 'medium',
  p_expires_at timestamp with time zone DEFAULT NULL,
  p_metadata jsonb DEFAULT '{}'::jsonb,
  p_language text DEFAULT 'cs',
  p_related_to jsonb DEFAULT NULL
)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
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