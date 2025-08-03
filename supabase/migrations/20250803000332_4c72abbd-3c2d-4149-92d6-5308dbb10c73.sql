-- Update admin_dhl@pendlerapp.com to have dhl_admin permission instead of super_admin
UPDATE admin_permissions 
SET permission_level = 'dhl_admin'
WHERE user_id = (SELECT id FROM profiles WHERE email = 'admin_dhl@pendlerapp.com')
AND permission_level = 'super_admin';

-- Ensure admin_dhl@pendlerapp.com has DHL company set
UPDATE profiles 
SET company = 'dhl'
WHERE email = 'admin_dhl@pendlerapp.com';

-- Update RLS policy for admin permissions to handle dhl_admin level
DROP POLICY IF EXISTS "Admins can manage company settings" ON company_settings;
CREATE POLICY "Admins can manage company settings" 
ON company_settings 
FOR ALL 
USING (
  EXISTS (
    SELECT 1 FROM admin_permissions ap
    WHERE ap.user_id = auth.uid() 
    AND ap.is_active = true
    AND (
      ap.permission_level = 'super_admin' OR
      (ap.permission_level = 'dhl_admin' AND company = 'dhl')
    )
  )
);