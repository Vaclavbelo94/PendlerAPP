-- Oprava RLS politik pro DHL systém

-- 1. Vyčištění duplicitních politik pro profiles
DROP POLICY IF EXISTS "Users can insert own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
DROP POLICY IF EXISTS "Uživatelé mohou upravovat vlastní profil" ON public.profiles;
DROP POLICY IF EXISTS "Uživatelé mohou číst vlastní profil" ON public.profiles;

-- 2. Vyčištění duplicitních politik pro shifts
DROP POLICY IF EXISTS "Users can delete own shifts" ON public.shifts;
DROP POLICY IF EXISTS "Users can insert own shifts" ON public.shifts;
DROP POLICY IF EXISTS "Users can update own shifts" ON public.shifts;
DROP POLICY IF EXISTS "Users can view own shifts" ON public.shifts;
DROP POLICY IF EXISTS "Uživatelé mohou mazat jen své směny" ON public.shifts;
DROP POLICY IF EXISTS "Uživatelé mohou upravovat jen své směny" ON public.shifts;
DROP POLICY IF EXISTS "Uživatelé mohou vkládat jen své směny" ON public.shifts;
DROP POLICY IF EXISTS "Uživatelé mohou číst jen své směny" ON public.shifts;
DROP POLICY IF EXISTS "shifts_delete_policy" ON public.shifts;
DROP POLICY IF EXISTS "shifts_insert_policy" ON public.shifts;
DROP POLICY IF EXISTS "shifts_select_policy" ON public.shifts;
DROP POLICY IF EXISTS "shifts_update_policy" ON public.shifts;

-- 3. Vyčištění duplicitních politik pro promo_codes
DROP POLICY IF EXISTS "Allow authenticated users to manage their promo codes" ON public.promo_codes;
DROP POLICY IF EXISTS "Allow public read access to promo codes" ON public.promo_codes;
DROP POLICY IF EXISTS "Authenticated users can update promo code usage" ON public.promo_codes;
DROP POLICY IF EXISTS "Authenticated users can view promo codes" ON public.promo_codes;
DROP POLICY IF EXISTS "Users can view promo codes" ON public.promo_codes;

-- 4. Vyčištění duplicitních politik pro dhl_shift_schedules
DROP POLICY IF EXISTS "DHL admins can manage shift schedules" ON public.dhl_shift_schedules;
DROP POLICY IF EXISTS "General admins can manage DHL schedules" ON public.dhl_shift_schedules;

-- 5. Vyčištění duplicitních politik pro dhl_schedule_imports
DROP POLICY IF EXISTS "DHL admins can log imports" ON public.dhl_schedule_imports;
DROP POLICY IF EXISTS "General admins can manage DHL imports" ON public.dhl_schedule_imports;

-- 6. Vyčištění duplicitních politik pro dhl_shift_templates
DROP POLICY IF EXISTS "Anyone can view shift templates" ON public.dhl_shift_templates;
DROP POLICY IF EXISTS "Authenticated users can view DHL shift templates" ON public.dhl_shift_templates;

-- 7. Vyčištění duplicitních politik pro dhl_work_groups
DROP POLICY IF EXISTS "Anyone can view active work groups" ON public.dhl_work_groups;
DROP POLICY IF EXISTS "Authenticated users can view active DHL work groups" ON public.dhl_work_groups;

-- 8. Vyčištění duplicitních politik pro promo_code_redemptions
DROP POLICY IF EXISTS "Users can see their own redemptions" ON public.promo_code_redemptions;

-- 9. Aktualizace RLS politiky pro DHL pozice - DHL zaměstnanci mohou vidět aktivní pozice pro své přiřazení
DROP POLICY IF EXISTS "Authenticated users can view active DHL positions" ON public.dhl_positions;

CREATE POLICY "DHL employees can view active positions" 
ON public.dhl_positions 
FOR SELECT 
TO authenticated
USING (
  is_active = true 
  AND (
    -- Admins can see all
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() AND profiles.is_admin = true
    )
    OR
    -- DHL employees can see active positions
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() AND profiles.is_dhl_employee = true
    )
  )
);

-- 10. Přidání politik pro DHL schedule imports pro DHL zaměstnance
CREATE POLICY "DHL employees can view import history for their data" 
ON public.dhl_schedule_imports 
FOR SELECT 
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM profiles 
    WHERE profiles.id = auth.uid() 
    AND (profiles.is_admin = true OR profiles.is_dhl_employee = true)
  )
);

-- 11. Aktualizace RLS politik pro dhl_shift_schedules s novou strukturou
DROP POLICY IF EXISTS "Authenticated users can view active shift schedules" ON public.dhl_shift_schedules;

CREATE POLICY "DHL employees can view active schedules by position" 
ON public.dhl_shift_schedules 
FOR SELECT 
TO authenticated
USING (
  is_active = true 
  AND (
    -- Admins can see all
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() AND profiles.is_admin = true
    )
    OR
    -- DHL employees can see schedules for their position
    (
      EXISTS (
        SELECT 1 FROM profiles 
        WHERE profiles.id = auth.uid() AND profiles.is_dhl_employee = true
      )
      AND (
        position_id IS NULL 
        OR position_id IN (
          SELECT dhl_position_id FROM user_dhl_assignments 
          WHERE user_id = auth.uid() AND is_active = true
        )
      )
    )
  )
);