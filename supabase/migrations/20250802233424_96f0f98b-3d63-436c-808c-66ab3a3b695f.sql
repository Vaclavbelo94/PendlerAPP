-- Fix infinite recursion in admin_permissions RLS policy
-- Create security definer function for admin permissions check
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