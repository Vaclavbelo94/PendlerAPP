-- Add RLS policies for admin access to rideshare tables

-- Allow admins to view all rideshare offers
CREATE POLICY "Admins can view all rideshare offers" ON public.rideshare_offers
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.admin_permissions ap
    WHERE ap.user_id = auth.uid() 
    AND ap.permission_level IN ('admin', 'super_admin')
    AND ap.is_active = true
  )
);

-- Allow admins to update rideshare offers
CREATE POLICY "Admins can update rideshare offers" ON public.rideshare_offers
FOR UPDATE 
USING (
  EXISTS (
    SELECT 1 FROM public.admin_permissions ap
    WHERE ap.user_id = auth.uid() 
    AND ap.permission_level IN ('admin', 'super_admin')
    AND ap.is_active = true
  )
);

-- Allow admins to delete rideshare offers
CREATE POLICY "Admins can delete rideshare offers" ON public.rideshare_offers
FOR DELETE 
USING (
  EXISTS (
    SELECT 1 FROM public.admin_permissions ap
    WHERE ap.user_id = auth.uid() 
    AND ap.permission_level IN ('admin', 'super_admin')
    AND ap.is_active = true
  )
);

-- Allow admins to view all rideshare contacts
CREATE POLICY "Admins can view all rideshare contacts" ON public.rideshare_contacts
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.admin_permissions ap
    WHERE ap.user_id = auth.uid() 
    AND ap.permission_level IN ('admin', 'super_admin')
    AND ap.is_active = true
  )
);

-- Allow admins to update rideshare contacts
CREATE POLICY "Admins can update rideshare contacts" ON public.rideshare_contacts
FOR UPDATE 
USING (
  EXISTS (
    SELECT 1 FROM public.admin_permissions ap
    WHERE ap.user_id = auth.uid() 
    AND ap.permission_level IN ('admin', 'super_admin')
    AND ap.is_active = true
  )
);

-- Allow admins to delete rideshare contacts
CREATE POLICY "Admins can delete rideshare contacts" ON public.rideshare_contacts
FOR DELETE 
USING (
  EXISTS (
    SELECT 1 FROM public.admin_permissions ap
    WHERE ap.user_id = auth.uid() 
    AND ap.permission_level IN ('admin', 'super_admin')
    AND ap.is_active = true
  )
);