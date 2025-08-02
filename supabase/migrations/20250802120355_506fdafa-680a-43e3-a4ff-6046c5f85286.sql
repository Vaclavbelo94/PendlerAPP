-- Create admin management tables
CREATE TYPE admin_permission_level AS ENUM ('super_admin', 'admin', 'moderator', 'viewer');

-- Admin permissions table
CREATE TABLE public.admin_permissions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  permission_level admin_permission_level NOT NULL DEFAULT 'viewer',
  granted_by UUID REFERENCES auth.users(id),
  granted_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  expires_at TIMESTAMP WITH TIME ZONE,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Company settings table
CREATE TABLE public.company_settings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  company company_type NOT NULL,
  setting_key TEXT NOT NULL,
  setting_value JSONB NOT NULL DEFAULT '{}',
  is_enabled BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(company, setting_key)
);

-- Admin audit log
CREATE TABLE public.admin_audit_log (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  admin_user_id UUID NOT NULL REFERENCES auth.users(id),
  action TEXT NOT NULL,
  target_table TEXT,
  target_id UUID,
  old_values JSONB,
  new_values JSONB,
  metadata JSONB DEFAULT '{}',
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- System configuration table
CREATE TABLE public.system_config (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  config_key TEXT NOT NULL UNIQUE,
  config_value JSONB NOT NULL,
  description TEXT,
  is_public BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Company menu items table (for dynamic company-specific menus)
CREATE TABLE public.company_menu_items (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  company company_type NOT NULL,
  menu_key TEXT NOT NULL,
  title_cs TEXT NOT NULL,
  title_de TEXT,
  title_pl TEXT,
  description_cs TEXT,
  description_de TEXT,
  description_pl TEXT,
  icon TEXT NOT NULL,
  route TEXT NOT NULL,
  is_enabled BOOLEAN NOT NULL DEFAULT true,
  display_order INTEGER DEFAULT 0,
  required_permission TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(company, menu_key)
);

-- Enable RLS on all tables
ALTER TABLE public.admin_permissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.company_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_audit_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.system_config ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.company_menu_items ENABLE ROW LEVEL SECURITY;

-- RLS Policies for admin_permissions
CREATE POLICY "Super admins can manage all permissions"
ON public.admin_permissions
FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM public.admin_permissions ap
    WHERE ap.user_id = auth.uid() 
    AND ap.permission_level = 'super_admin'
    AND ap.is_active = true
  )
);

CREATE POLICY "Users can view their own permissions"
ON public.admin_permissions
FOR SELECT
USING (auth.uid() = user_id);

-- RLS Policies for company_settings
CREATE POLICY "Admins can manage company settings"
ON public.company_settings
FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM public.admin_permissions ap
    WHERE ap.user_id = auth.uid() 
    AND ap.permission_level IN ('super_admin', 'admin')
    AND ap.is_active = true
  )
);

CREATE POLICY "Users can view their company settings"
ON public.company_settings
FOR SELECT
USING (
  company = get_current_user_company() OR
  EXISTS (
    SELECT 1 FROM public.admin_permissions ap
    WHERE ap.user_id = auth.uid() 
    AND ap.is_active = true
  )
);

-- RLS Policies for admin_audit_log
CREATE POLICY "Super admins can view all audit logs"
ON public.admin_audit_log
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.admin_permissions ap
    WHERE ap.user_id = auth.uid() 
    AND ap.permission_level = 'super_admin'
    AND ap.is_active = true
  )
);

CREATE POLICY "System can insert audit logs"
ON public.admin_audit_log
FOR INSERT
WITH CHECK (true);

-- RLS Policies for system_config
CREATE POLICY "Admins can manage system config"
ON public.system_config
FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM public.admin_permissions ap
    WHERE ap.user_id = auth.uid() 
    AND ap.permission_level IN ('super_admin', 'admin')
    AND ap.is_active = true
  )
);

CREATE POLICY "Public can view public configs"
ON public.system_config
FOR SELECT
USING (is_public = true);

-- RLS Policies for company_menu_items
CREATE POLICY "Admins can manage company menu items"
ON public.company_menu_items
FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM public.admin_permissions ap
    WHERE ap.user_id = auth.uid() 
    AND ap.permission_level IN ('super_admin', 'admin')
    AND ap.is_active = true
  )
);

CREATE POLICY "Users can view their company menu items"
ON public.company_menu_items
FOR SELECT
USING (
  company = get_current_user_company() AND is_enabled = true
);

-- Create function to check admin permissions
CREATE OR REPLACE FUNCTION public.has_admin_permission(user_id UUID, required_level admin_permission_level)
RETURNS BOOLEAN
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path = 'public'
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.admin_permissions
    WHERE admin_permissions.user_id = $1
    AND is_active = true
    AND (expires_at IS NULL OR expires_at > now())
    AND CASE 
      WHEN $2 = 'viewer' THEN permission_level IN ('viewer', 'moderator', 'admin', 'super_admin')
      WHEN $2 = 'moderator' THEN permission_level IN ('moderator', 'admin', 'super_admin')
      WHEN $2 = 'admin' THEN permission_level IN ('admin', 'super_admin')
      WHEN $2 = 'super_admin' THEN permission_level = 'super_admin'
    END
  );
$$;

-- Create trigger functions for updated_at
CREATE OR REPLACE FUNCTION public.update_admin_permissions_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION public.update_company_settings_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION public.update_system_config_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION public.update_company_menu_items_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers
CREATE TRIGGER update_admin_permissions_updated_at
  BEFORE UPDATE ON public.admin_permissions
  FOR EACH ROW
  EXECUTE FUNCTION public.update_admin_permissions_updated_at();

CREATE TRIGGER update_company_settings_updated_at
  BEFORE UPDATE ON public.company_settings
  FOR EACH ROW
  EXECUTE FUNCTION public.update_company_settings_updated_at();

CREATE TRIGGER update_system_config_updated_at
  BEFORE UPDATE ON public.system_config
  FOR EACH ROW
  EXECUTE FUNCTION public.update_system_config_updated_at();

CREATE TRIGGER update_company_menu_items_updated_at
  BEFORE UPDATE ON public.company_menu_items
  FOR EACH ROW
  EXECUTE FUNCTION public.update_company_menu_items_updated_at();

-- Insert default admin permission for existing admin users
INSERT INTO public.admin_permissions (user_id, permission_level, granted_by, granted_at)
SELECT id, 'super_admin', id, now()
FROM public.profiles 
WHERE is_admin = true
ON CONFLICT DO NOTHING;

-- Insert default company menu items for DHL
INSERT INTO public.company_menu_items (company, menu_key, title_cs, title_de, title_pl, description_cs, description_de, description_pl, icon, route, display_order) VALUES
('dhl', 'wechselschicht', 'Wechselschicht', 'Wechselschicht', 'Zmiana pracy', 'Správa střídavých směn', 'Wechselschicht Verwaltung', 'Zarządzanie zmianami', 'Clock', '/wechselschicht', 1),
('dhl', 'overtime', 'Přesčasy', 'Überstunden', 'Nadgodziny', 'Sledování přesčasů', 'Überstunden verfolgen', 'Śledzenie nadgodzin', 'Timer', '/overtime', 2),
('dhl', 'documents', 'DHL Dokumenty', 'DHL Dokumente', 'Dokumenty DHL', 'Firemní dokumenty', 'Firmendokumente', 'Dokumenty firmowe', 'FileText', '/dhl-documents', 3),
('dhl', 'notifications', 'Notifikace', 'Benachrichtigungen', 'Powiadomienia', 'DHL specifické notifikace', 'DHL Benachrichtigungen', 'Powiadomienia DHL', 'Bell', '/notifications', 4);

-- Insert default company menu items for Adecco
INSERT INTO public.company_menu_items (company, menu_key, title_cs, title_de, title_pl, description_cs, description_de, description_pl, icon, route, display_order) VALUES
('adecco', 'assignments', 'Zadání', 'Aufträge', 'Zadania', 'Pracovní zadání', 'Arbeitsaufträge', 'Zadania pracy', 'Briefcase', '/assignments', 1),
('adecco', 'timesheets', 'Výkazy', 'Stundenzettel', 'Raporty', 'Časové výkazy', 'Arbeitszeiterfassung', 'Raporty czasu pracy', 'Clock', '/timesheets', 2),
('adecco', 'placements', 'Umístění', 'Stellenvermittlung', 'Miejsca pracy', 'Pracovní umístění', 'Arbeitsvermittlung', 'Miejsca zatrudnienia', 'MapPin', '/placements', 3),
('adecco', 'training', 'Školení', 'Schulungen', 'Szkolenia', 'Školení a certifikace', 'Schulungen und Zertifikate', 'Szkolenia i certyfikaty', 'GraduationCap', '/training', 4);

-- Insert default company menu items for Randstad
INSERT INTO public.company_menu_items (company, menu_key, title_cs, title_de, title_pl, description_cs, description_de, description_pl, icon, route, display_order) VALUES
('randstad', 'flexible_work', 'Flexibilní práce', 'Flexible Arbeit', 'Elastyczna praca', 'Flexibilní pracovní možnosti', 'Flexible Arbeitsoptionen', 'Elastyczne opcje pracy', 'Clock', '/flexible-work', 1),
('randstad', 'opportunities', 'Příležitosti', 'Chancen', 'Możliwości', 'Pracovní příležitosti', 'Arbeitsmöglichkeiten', 'Możliwości zatrudnienia', 'Target', '/opportunities', 2),
('randstad', 'skills', 'Dovednosti', 'Fähigkeiten', 'Umiejętności', 'Rozvoj dovedností', 'Kompetenzentwicklung', 'Rozwój umiejętności', 'Award', '/skills', 3),
('randstad', 'feedback', 'Zpětná vazba', 'Feedback', 'Opinie', 'Zpětná vazba a hodnocení', 'Feedback und Bewertung', 'Opinie i oceny', 'MessageSquare', '/feedback', 4);

-- Insert default system configurations
INSERT INTO public.system_config (config_key, config_value, description, is_public) VALUES
('app_name', '"PendlerApp"', 'Application name', true),
('app_version', '"2.0.0"', 'Current application version', true),
('maintenance_mode', 'false', 'Enable maintenance mode', false),
('max_file_upload_size', '10485760', 'Maximum file upload size in bytes (10MB)', false),
('supported_languages', '["cs", "de", "pl"]', 'List of supported languages', true),
('default_language', '"cs"', 'Default application language', true),
('company_colors', '{"dhl": "#FFCC00", "adecco": "#0052CC", "randstad": "#FFB300"}', 'Company brand colors', true);