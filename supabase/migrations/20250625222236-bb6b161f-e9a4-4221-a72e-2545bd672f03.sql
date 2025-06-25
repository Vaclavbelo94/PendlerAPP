
-- Create table for storing imported shift schedules (JSON data)
CREATE TABLE public.dhl_shift_schedules (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  position_id UUID REFERENCES public.dhl_positions(id) ON DELETE CASCADE,
  work_group_id UUID REFERENCES public.dhl_work_groups(id) ON DELETE CASCADE,
  schedule_name TEXT NOT NULL,
  schedule_data JSONB NOT NULL,
  base_date DATE NOT NULL,
  base_woche INTEGER NOT NULL CHECK (base_woche >= 1 AND base_woche <= 15),
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create table for tracking import history and metadata
CREATE TABLE public.dhl_schedule_imports (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  admin_user_id UUID NOT NULL,
  imported_schedule_id UUID REFERENCES public.dhl_shift_schedules(id) ON DELETE CASCADE,
  file_name TEXT NOT NULL,
  import_status TEXT NOT NULL DEFAULT 'success',
  records_processed INTEGER NOT NULL DEFAULT 0,
  error_message TEXT,
  metadata JSONB,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add reference date and woche to user assignments for individual tracking
ALTER TABLE public.user_dhl_assignments 
ADD COLUMN reference_date DATE,
ADD COLUMN reference_woche INTEGER CHECK (reference_woche >= 1 AND reference_woche <= 15);

-- Create indexes for efficient querying
CREATE INDEX idx_dhl_shift_schedules_position_woche ON public.dhl_shift_schedules(position_id, base_woche);
CREATE INDEX idx_dhl_shift_schedules_active ON public.dhl_shift_schedules(is_active) WHERE is_active = true;
CREATE INDEX idx_dhl_schedule_imports_admin ON public.dhl_schedule_imports(admin_user_id);
CREATE INDEX idx_user_dhl_assignments_reference ON public.user_dhl_assignments(reference_date, reference_woche);

-- Enable RLS on new tables
ALTER TABLE public.dhl_shift_schedules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.dhl_schedule_imports ENABLE ROW LEVEL SECURITY;

-- RLS policies for dhl_shift_schedules - authenticated users can read active schedules
CREATE POLICY "Authenticated users can view active shift schedules" 
  ON public.dhl_shift_schedules 
  FOR SELECT 
  USING (auth.uid() IS NOT NULL AND is_active = true);

-- Only admins can manage shift schedules
CREATE POLICY "Admins can manage shift schedules" 
  ON public.dhl_shift_schedules 
  FOR ALL 
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND is_admin = true
    )
  );

-- RLS policies for dhl_schedule_imports - only admins can view import history
CREATE POLICY "Admins can view import history" 
  ON public.dhl_schedule_imports 
  FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND is_admin = true
    )
  );

CREATE POLICY "Admins can create import records" 
  ON public.dhl_schedule_imports 
  FOR INSERT 
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND is_admin = true
    )
  );

-- Update trigger for dhl_shift_schedules
CREATE OR REPLACE FUNCTION public.update_dhl_shift_schedules_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_dhl_shift_schedules_updated_at
  BEFORE UPDATE ON public.dhl_shift_schedules
  FOR EACH ROW
  EXECUTE FUNCTION public.update_dhl_shift_schedules_updated_at();
