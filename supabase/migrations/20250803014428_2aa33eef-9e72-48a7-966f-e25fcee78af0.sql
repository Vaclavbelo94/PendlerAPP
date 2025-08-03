-- Add language support to notifications table
ALTER TABLE public.notifications 
ADD COLUMN language text DEFAULT 'cs' CHECK (language IN ('cs', 'de', 'pl'));

-- Create admin_notifications table for tracking admin-sent notifications
CREATE TABLE public.admin_notifications (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  admin_user_id uuid NOT NULL,
  title text NOT NULL,
  message text NOT NULL,
  notification_type text NOT NULL DEFAULT 'info' CHECK (notification_type IN ('info', 'warning', 'success', 'error')),
  target_type text NOT NULL CHECK (target_type IN ('user', 'company', 'all')),
  target_companies text[], -- array of company names if target_type is 'company'
  target_user_ids uuid[], -- array of user ids if target_type is 'user'
  language text NOT NULL DEFAULT 'cs' CHECK (language IN ('cs', 'de', 'pl')),
  sent_count integer DEFAULT 0,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS on admin_notifications
ALTER TABLE public.admin_notifications ENABLE ROW LEVEL SECURITY;

-- Create policies for admin_notifications
CREATE POLICY "Super admins can manage admin notifications" 
ON public.admin_notifications 
FOR ALL 
USING (
  EXISTS (
    SELECT 1 FROM admin_permissions ap
    WHERE ap.user_id = auth.uid()
    AND ap.permission_level = 'super_admin'::admin_permission_level
    AND ap.is_active = true
  )
);

CREATE POLICY "Admins can view admin notifications" 
ON public.admin_notifications 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM admin_permissions ap
    WHERE ap.user_id = auth.uid()
    AND ap.permission_level IN ('admin', 'super_admin')::admin_permission_level[]
    AND ap.is_active = true
  )
);

-- Add trigger for updated_at
CREATE TRIGGER update_admin_notifications_updated_at
  BEFORE UPDATE ON public.admin_notifications
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Create function to send notifications to multiple users
CREATE OR REPLACE FUNCTION public.send_admin_notification(
  p_admin_user_id uuid,
  p_title text,
  p_message text,
  p_notification_type text,
  p_target_type text,
  p_target_companies text[] DEFAULT NULL,
  p_target_user_ids uuid[] DEFAULT NULL,
  p_language text DEFAULT 'cs'
)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
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
    AND ap.permission_level IN ('admin', 'super_admin')::admin_permission_level[]
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
$$;