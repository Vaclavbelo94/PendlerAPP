-- Create security definer function for checking user company
CREATE OR REPLACE FUNCTION public.get_current_user_company()
RETURNS public.company_type
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path TO 'public'
AS $function$
  SELECT company FROM public.profiles WHERE id = auth.uid();
$function$;

-- Create RLS policies for company-specific access
-- Allow users to see their own company data in profiles
CREATE POLICY "Users can view profiles from same company" 
ON public.profiles 
FOR SELECT 
USING (
  company = get_current_user_company() OR 
  auth.uid() = id OR
  get_current_user_admin_status() = true
);

-- Company-specific shift access
CREATE POLICY "Company employees can view company shifts" 
ON public.shifts 
FOR SELECT 
USING (
  auth.uid() = user_id OR
  (SELECT company FROM public.profiles WHERE id = user_id) = get_current_user_company() OR
  get_current_user_admin_status() = true
);

-- DHL-specific policies for Wechselschicht data
CREATE POLICY "DHL employees can view wechselschicht patterns" 
ON public.dhl_wechselschicht_patterns 
FOR SELECT 
USING (
  is_active = true AND (
    get_current_user_company() = 'dhl' OR
    get_current_user_admin_status() = true
  )
);

CREATE POLICY "DHL employees can view shift time changes" 
ON public.dhl_shift_time_changes 
FOR SELECT 
USING (
  get_current_user_company() = 'dhl' OR
  get_current_user_admin_status() = true
);

-- Company-specific reports access
CREATE POLICY "Users can view company reports" 
ON public.reports 
FOR SELECT 
USING (
  auth.uid() = user_id OR
  (SELECT company FROM public.profiles WHERE id = user_id) = get_current_user_company() OR
  get_current_user_admin_status() = true
);