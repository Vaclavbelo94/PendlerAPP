-- Fix infinite recursion in admin_permissions policies by dropping and recreating them properly

-- First, drop all existing policies on admin_permissions to break the recursion
DROP POLICY IF EXISTS "Admin permissions are viewable by users with admin role" ON admin_permissions;
DROP POLICY IF EXISTS "Admin permissions are manageable by super admins" ON admin_permissions;
DROP POLICY IF EXISTS "Users can view admin permissions" ON admin_permissions;
DROP POLICY IF EXISTS "Admins can manage admin permissions" ON admin_permissions;

-- Create simple, non-recursive policies for admin_permissions
CREATE POLICY "Super admins can manage all admin permissions"
ON admin_permissions
FOR ALL
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM auth.users 
    WHERE auth.users.id = auth.uid() 
    AND auth.users.email = 'admin@pendlerapp.com'
  )
);

-- Allow authenticated users to view admin permissions (needed for permission checks)
CREATE POLICY "Authenticated users can view admin permissions"
ON admin_permissions
FOR SELECT
TO authenticated
USING (true);