-- Fix RLS policies for admin_permissions table
-- Drop the problematic recursive policy
DROP POLICY IF EXISTS "Super admins can manage all permissions" ON admin_permissions;

-- Create a simpler, more reliable policy for viewing own permissions
DROP POLICY IF EXISTS "Users can view their own permissions" ON admin_permissions;
CREATE POLICY "Users can view their own permissions" 
ON admin_permissions 
FOR SELECT 
USING (auth.uid() = user_id);

-- Ensure super admin access via email check (non-recursive)
DROP POLICY IF EXISTS "Super admins can manage all admin permissions" ON admin_permissions;
CREATE POLICY "Super admins can manage all admin permissions" 
ON admin_permissions 
FOR ALL 
USING (
  EXISTS (
    SELECT 1 FROM auth.users 
    WHERE users.id = auth.uid() 
    AND users.email = 'admin@pendlerapp.com'
  )
);