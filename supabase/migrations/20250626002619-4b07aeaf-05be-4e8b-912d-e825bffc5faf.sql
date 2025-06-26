
-- Update admin_dhl@pendlerapp.com profile to have admin privileges
UPDATE public.profiles 
SET is_admin = true 
WHERE email = 'admin_dhl@pendlerapp.com';

-- Create specific RLS policies for DHL admin functionality
-- Allow DHL admins to manage shift schedules
CREATE POLICY "DHL admins can manage shift schedules" ON public.dhl_shift_schedules
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() 
      AND is_admin = true 
      AND email = 'admin_dhl@pendlerapp.com'
    )
  );

-- Allow DHL admins to log imports
CREATE POLICY "DHL admins can log imports" ON public.dhl_schedule_imports
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() 
      AND is_admin = true 
      AND email = 'admin_dhl@pendlerapp.com'
    )
  );

-- Also allow general admins to manage DHL data (if needed)
CREATE POLICY "General admins can manage DHL schedules" ON public.dhl_shift_schedules
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND is_admin = true)
  );

CREATE POLICY "General admins can manage DHL imports" ON public.dhl_schedule_imports
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND is_admin = true)
  );
