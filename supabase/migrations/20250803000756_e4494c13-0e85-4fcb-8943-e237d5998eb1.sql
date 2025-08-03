-- Create RPC function to get user admin permission
CREATE OR REPLACE FUNCTION public.get_user_admin_permission(user_id_param UUID)
RETURNS TABLE (
  id UUID,
  user_id UUID,
  permission_level admin_permission_level,
  granted_by UUID,
  granted_at TIMESTAMPTZ,
  expires_at TIMESTAMPTZ,
  is_active BOOLEAN,
  created_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ
)
LANGUAGE SQL
SECURITY DEFINER
SET search_path = 'public'
AS $$
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
  FROM admin_permissions ap
  WHERE ap.user_id = user_id_param 
  AND ap.is_active = true
  ORDER BY ap.granted_at DESC
  LIMIT 1;
$$;