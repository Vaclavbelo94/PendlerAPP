-- Update RLS policies for DHL shift schedules with new structure
DROP POLICY IF EXISTS "Authenticated users can view active shift schedules" ON public.dhl_shift_schedules;
DROP POLICY IF EXISTS "DHL admins can manage shift schedules" ON public.dhl_shift_schedules;
DROP POLICY IF EXISTS "General admins can manage DHL schedules" ON public.dhl_shift_schedules;

-- Create updated RLS policies for dhl_shift_schedules
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

CREATE POLICY "Admins can manage all shift schedules" 
ON public.dhl_shift_schedules 
FOR ALL 
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM profiles 
    WHERE profiles.id = auth.uid() AND profiles.is_admin = true
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM profiles 
    WHERE profiles.id = auth.uid() AND profiles.is_admin = true
  )
);

-- Enable RLS on user_dhl_assignments if not already enabled
ALTER TABLE public.user_dhl_assignments ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for user_dhl_assignments
CREATE POLICY "Users can view their own DHL assignments" 
ON public.user_dhl_assignments 
FOR SELECT 
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own DHL assignments" 
ON public.user_dhl_assignments 
FOR INSERT 
TO authenticated
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own DHL assignments" 
ON public.user_dhl_assignments 
FOR UPDATE 
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can manage all DHL assignments" 
ON public.user_dhl_assignments 
FOR ALL 
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM profiles 
    WHERE profiles.id = auth.uid() AND profiles.is_admin = true
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM profiles 
    WHERE profiles.id = auth.uid() AND profiles.is_admin = true
  )
);

-- Update RLS policies for dhl_positions (ensure DHL employees can view them)
DROP POLICY IF EXISTS "DHL employees can view positions" ON public.dhl_positions;

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

-- Update DHL schedule imports policies
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