-- Create table for DHL position shift templates
CREATE TABLE public.dhl_position_shift_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  position_id UUID REFERENCES public.dhl_positions(id) ON DELETE CASCADE NOT NULL,
  woche_number INTEGER NOT NULL CHECK (woche_number >= 1 AND woche_number <= 15),
  calendar_week INTEGER NOT NULL CHECK (calendar_week >= 1 AND calendar_week <= 53),
  monday_shift TEXT CHECK (monday_shift IN ('R', 'O', 'N', 'OFF')),
  tuesday_shift TEXT CHECK (tuesday_shift IN ('R', 'O', 'N', 'OFF')),
  wednesday_shift TEXT CHECK (wednesday_shift IN ('R', 'O', 'N', 'OFF')),
  thursday_shift TEXT CHECK (thursday_shift IN ('R', 'O', 'N', 'OFF')),
  friday_shift TEXT CHECK (friday_shift IN ('R', 'O', 'N', 'OFF')),
  saturday_shift TEXT CHECK (saturday_shift IN ('R', 'O', 'N', 'OFF')),
  sunday_shift TEXT CHECK (sunday_shift IN ('R', 'O', 'N', 'OFF')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(position_id, woche_number, calendar_week)
);

-- Enable RLS
ALTER TABLE public.dhl_position_shift_templates ENABLE ROW LEVEL SECURITY;

-- Create policies for admins
CREATE POLICY "Admins can manage shift templates" 
ON public.dhl_position_shift_templates 
FOR ALL 
USING (EXISTS (
  SELECT 1 FROM public.profiles 
  WHERE id = auth.uid() AND is_admin = true
));

-- Create trigger for updating timestamps
CREATE TRIGGER update_dhl_position_shift_templates_updated_at
  BEFORE UPDATE ON public.dhl_position_shift_templates
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();