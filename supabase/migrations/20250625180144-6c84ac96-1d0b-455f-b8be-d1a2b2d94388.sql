
-- Add missing RLS policies for user_dhl_assignments
CREATE POLICY "Users can create their own DHL assignments" 
  ON public.user_dhl_assignments 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own DHL assignments" 
  ON public.user_dhl_assignments 
  FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own DHL assignments" 
  ON public.user_dhl_assignments 
  FOR DELETE 
  USING (auth.uid() = user_id);

-- Ensure all authenticated users can read DHL positions and work groups for setup
DROP POLICY IF EXISTS "Anyone can view active DHL positions" ON public.dhl_positions;
CREATE POLICY "Authenticated users can view active DHL positions" 
  ON public.dhl_positions 
  FOR SELECT 
  USING (auth.uid() IS NOT NULL AND is_active = true);

DROP POLICY IF EXISTS "Anyone can view active DHL work groups" ON public.dhl_work_groups;
CREATE POLICY "Authenticated users can view active DHL work groups" 
  ON public.dhl_work_groups 
  FOR SELECT 
  USING (auth.uid() IS NOT NULL AND is_active = true);

-- Ensure shift templates are readable for all authenticated users
DROP POLICY IF EXISTS "Anyone can view DHL shift templates" ON public.dhl_shift_templates;
CREATE POLICY "Authenticated users can view DHL shift templates" 
  ON public.dhl_shift_templates 
  FOR SELECT 
  USING (auth.uid() IS NOT NULL);
