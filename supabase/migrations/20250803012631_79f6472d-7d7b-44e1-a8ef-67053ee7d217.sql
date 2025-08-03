-- Final security hardening and cleanup

-- Create audit table for security events if not exists
CREATE TABLE IF NOT EXISTS public.security_audit_log (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  event_type text NOT NULL,
  user_id uuid,
  ip_address inet,
  user_agent text,
  details jsonb DEFAULT '{}',
  risk_level text DEFAULT 'low' CHECK (risk_level IN ('low', 'medium', 'high', 'critical')),
  created_at timestamp with time zone DEFAULT now()
);

-- Enable RLS on security audit log
ALTER TABLE public.security_audit_log ENABLE ROW LEVEL SECURITY;

-- Only super admins can view security audit logs
CREATE POLICY "Super admins can view security audit logs"
ON public.security_audit_log
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.admin_permissions ap
    WHERE ap.user_id = auth.uid()
    AND ap.permission_level = 'super_admin'
    AND ap.is_active = true
  )
);

-- System can insert security audit logs
CREATE POLICY "System can insert security audit logs"
ON public.security_audit_log
FOR INSERT
WITH CHECK (true);

-- Create function to log security events
CREATE OR REPLACE FUNCTION public.log_security_event(
  p_event_type text,
  p_user_id uuid DEFAULT NULL,
  p_details jsonb DEFAULT '{}',
  p_risk_level text DEFAULT 'low'
)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
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

-- Add enhanced input validation for all text fields
CREATE OR REPLACE FUNCTION public.validate_text_input(input_text text, max_length integer DEFAULT 1000)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
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

-- Update existing validation trigger to use new function
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

-- Add rate limiting table for API requests
CREATE TABLE IF NOT EXISTS public.rate_limit_log (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  identifier text NOT NULL,
  request_count integer DEFAULT 1,
  window_start timestamp with time zone DEFAULT now(),
  created_at timestamp with time zone DEFAULT now()
);

-- Enable RLS on rate limit log
ALTER TABLE public.rate_limit_log ENABLE ROW LEVEL SECURITY;

-- Only system can manage rate limit logs
CREATE POLICY "System can manage rate limit logs"
ON public.rate_limit_log
FOR ALL
USING (current_setting('role') = 'service_role');

-- Create index for efficient rate limiting queries
CREATE INDEX IF NOT EXISTS idx_rate_limit_identifier_window 
ON public.rate_limit_log (identifier, window_start);

-- Clean up old rate limit logs (keep only last 24 hours)
CREATE OR REPLACE FUNCTION public.cleanup_rate_limit_logs()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
BEGIN
  DELETE FROM public.rate_limit_log 
  WHERE created_at < now() - interval '24 hours';
END;
$function$;