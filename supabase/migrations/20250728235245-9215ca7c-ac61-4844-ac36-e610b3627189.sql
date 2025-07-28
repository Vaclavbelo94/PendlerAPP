-- Create company modules table for managing company-specific features
CREATE TABLE public.company_modules (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  company company_type NOT NULL,
  module_key TEXT NOT NULL,
  is_enabled BOOLEAN NOT NULL DEFAULT true,
  config JSONB DEFAULT '{}',
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(company, module_key)
);

-- Enable RLS
ALTER TABLE public.company_modules ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Admins can manage company modules" 
ON public.company_modules 
FOR ALL 
USING (EXISTS (
  SELECT 1 FROM profiles 
  WHERE profiles.id = auth.uid() AND profiles.is_admin = true
));

CREATE POLICY "Users can view their company modules" 
ON public.company_modules 
FOR SELECT 
USING (
  company = get_current_user_company() OR 
  EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.is_admin = true)
);

-- Create company widgets table
CREATE TABLE public.company_widgets (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  company company_type NOT NULL,
  widget_key TEXT NOT NULL,
  is_enabled BOOLEAN NOT NULL DEFAULT true,
  config JSONB DEFAULT '{}',
  display_order INTEGER DEFAULT 0,
  category TEXT DEFAULT 'company',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(company, widget_key)
);

-- Enable RLS for company widgets
ALTER TABLE public.company_widgets ENABLE ROW LEVEL SECURITY;

-- Create policies for company widgets
CREATE POLICY "Admins can manage company widgets" 
ON public.company_widgets 
FOR ALL 
USING (EXISTS (
  SELECT 1 FROM profiles 
  WHERE profiles.id = auth.uid() AND profiles.is_admin = true
));

CREATE POLICY "Users can view their company widgets" 
ON public.company_widgets 
FOR SELECT 
USING (
  company = get_current_user_company() OR 
  EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.is_admin = true)
);

-- Insert default company modules
INSERT INTO public.company_modules (company, module_key, is_enabled, config, display_order) VALUES
  ('dhl', 'shifts_overview', true, '{"title": "DHL Směny", "description": "Přehled směn pro DHL zaměstnance"}', 1),
  ('dhl', 'wechselschicht', true, '{"title": "Wechselschicht", "description": "Střídavé směny podle DHL standardů"}', 2),
  ('dhl', 'overtime_tracking', true, '{"title": "Přesčasy", "description": "Sledování přesčasů (ranní/odpolední/noční)"}', 3),
  ('dhl', 'dhl_documents', true, '{"title": "DHL Dokumenty", "description": "Firemní dokumenty a formuláře"}', 4),
  ('adecco', 'shifts_overview', true, '{"title": "Adecco Směny", "description": "Přehled směn pro Adecco zaměstnance"}', 1),
  ('adecco', 'agency_tools', true, '{"title": "Agenturní nástroje", "description": "Specializované nástroje pro agenturní práci"}', 2),
  ('randstad', 'shifts_overview', true, '{"title": "Randstad Směny", "description": "Přehled směn pro Randstad zaměstnance"}', 1),
  ('randstad', 'flexible_work', true, '{"title": "Flexibilní práce", "description": "Nástroje pro flexibilní pracovní rozvrhy"}', 2);

-- Insert default company widgets
INSERT INTO public.company_widgets (company, widget_key, is_enabled, config, display_order, category) VALUES
  ('dhl', 'dhl_shifts', true, '{"size": "large", "priority": "high"}', 1, 'shifts'),
  ('dhl', 'dhl_overtime', true, '{"size": "medium", "priority": "medium"}', 2, 'analytics'),
  ('dhl', 'dhl_wechselschicht', true, '{"size": "medium", "priority": "medium"}', 3, 'schedule'),
  ('dhl', 'dhl_notifications', true, '{"size": "small", "priority": "low"}', 4, 'communication'),
  ('adecco', 'adecco_shifts', true, '{"size": "large", "priority": "high"}', 1, 'shifts'),
  ('adecco', 'adecco_placements', true, '{"size": "medium", "priority": "medium"}', 2, 'work'),
  ('randstad', 'randstad_shifts', true, '{"size": "large", "priority": "high"}', 1, 'shifts'),
  ('randstad', 'randstad_opportunities', true, '{"size": "medium", "priority": "medium"}', 2, 'work');

-- Create trigger for updating updated_at timestamps
CREATE OR REPLACE FUNCTION public.update_company_modules_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_company_modules_updated_at
  BEFORE UPDATE ON public.company_modules
  FOR EACH ROW
  EXECUTE FUNCTION public.update_company_modules_updated_at();

CREATE TRIGGER update_company_widgets_updated_at
  BEFORE UPDATE ON public.company_widgets
  FOR EACH ROW
  EXECUTE FUNCTION public.update_company_modules_updated_at();