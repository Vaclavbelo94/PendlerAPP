-- Fix infinite recursion in admin_permissions RLS policies
-- Drop all existing RLS policies on admin_permissions table
DROP POLICY IF EXISTS "Super admins can view all admin permissions" ON public.admin_permissions;
DROP POLICY IF EXISTS "System can insert admin permissions" ON public.admin_permissions;
DROP POLICY IF EXISTS "Admins can manage admin permissions" ON public.admin_permissions;

-- Create simple, non-recursive policies using only legacy admin check
CREATE POLICY "Admins can view all admin permissions" 
ON public.admin_permissions 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE profiles.id = auth.uid() 
    AND profiles.is_admin = true
  )
);

CREATE POLICY "Admins can insert admin permissions" 
ON public.admin_permissions 
FOR INSERT 
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE profiles.id = auth.uid() 
    AND profiles.is_admin = true
  )
);

CREATE POLICY "Admins can update admin permissions" 
ON public.admin_permissions 
FOR UPDATE 
USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE profiles.id = auth.uid() 
    AND profiles.is_admin = true
  )
);

CREATE POLICY "Admins can delete admin permissions" 
ON public.admin_permissions 
FOR DELETE 
USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE profiles.id = auth.uid() 
    AND profiles.is_admin = true
  )
);

-- Also fix company_menu_items policies to avoid recursion
DROP POLICY IF EXISTS "Admins can manage company menu items" ON public.company_menu_items;
DROP POLICY IF EXISTS "Users can view their company menu items" ON public.company_menu_items;

CREATE POLICY "Admins can manage company menu items" 
ON public.company_menu_items 
FOR ALL 
USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE profiles.id = auth.uid() 
    AND profiles.is_admin = true
  )
);

CREATE POLICY "Users can view their company menu items" 
ON public.company_menu_items 
FOR SELECT 
USING (
  (company = get_current_user_company() AND is_enabled = true)
  OR
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE profiles.id = auth.uid() 
    AND profiles.is_admin = true
  )
);

-- Fix system_config policies too
DROP POLICY IF EXISTS "Admins can manage system config" ON public.system_config;
DROP POLICY IF EXISTS "Public can view public system config" ON public.system_config;

CREATE POLICY "Admins can manage system config" 
ON public.system_config 
FOR ALL 
USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE profiles.id = auth.uid() 
    AND profiles.is_admin = true
  )
);

CREATE POLICY "Public can view public system config" 
ON public.system_config 
FOR SELECT 
USING (is_public = true);