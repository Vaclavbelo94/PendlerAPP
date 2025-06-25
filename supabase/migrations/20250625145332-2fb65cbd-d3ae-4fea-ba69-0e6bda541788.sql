
-- Fáze 1: Vytvoření databázové struktury pro DHL systém

-- 1. Vytvoření enum pro DHL pozice
CREATE TYPE public.dhl_position_type AS ENUM (
  'technik',
  'rangierer', 
  'verlader',
  'sortierer',
  'fahrer',
  'other'
);

-- 2. Vytvoření tabulky DHL pozic
CREATE TABLE public.dhl_positions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  position_type dhl_position_type NOT NULL,
  description TEXT,
  hourly_rate NUMERIC(10,2),
  requirements TEXT[],
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- 3. Vytvoření tabulky DHL pracovních skupin (Woche 1-15)
CREATE TABLE public.dhl_work_groups (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  week_number INTEGER NOT NULL CHECK (week_number >= 1 AND week_number <= 15),
  name TEXT NOT NULL, -- např. "Woche 1", "Woche 2"
  description TEXT,
  shift_pattern JSONB, -- vzor směn pro daný týden
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE (week_number)
);

-- 4. Vytvoření tabulky DHL směnových šablon
CREATE TABLE public.dhl_shift_templates (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  position_id UUID REFERENCES public.dhl_positions(id) ON DELETE CASCADE,
  work_group_id UUID REFERENCES public.dhl_work_groups(id) ON DELETE CASCADE,
  day_of_week INTEGER NOT NULL CHECK (day_of_week >= 0 AND day_of_week <= 6), -- 0=neděle, 1=pondělí...
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  break_duration INTEGER DEFAULT 30, -- přestávka v minutách
  is_required BOOLEAN NOT NULL DEFAULT false, -- povinná směna
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- 5. Rozšíření shifts tabulky o DHL specifické sloupce
ALTER TABLE public.shifts 
ADD COLUMN dhl_position_id UUID REFERENCES public.dhl_positions(id),
ADD COLUMN dhl_work_group_id UUID REFERENCES public.dhl_work_groups(id),
ADD COLUMN is_dhl_managed BOOLEAN DEFAULT false,
ADD COLUMN dhl_override BOOLEAN DEFAULT false, -- uživatel změnil DHL směnu
ADD COLUMN original_dhl_data JSONB; -- původní DHL data před změnou

-- 6. Vytvoření tabulky DHL notifikací
CREATE TABLE public.dhl_notifications (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  shift_id UUID REFERENCES public.shifts(id) ON DELETE CASCADE,
  notification_type TEXT NOT NULL, -- 'shift_assigned', 'shift_changed', 'shift_cancelled'
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  is_read BOOLEAN NOT NULL DEFAULT false,
  metadata JSONB,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- 7. Vytvoření tabulky pro propojení uživatelů s DHL pozicemi a skupinami
CREATE TABLE public.user_dhl_assignments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  dhl_position_id UUID REFERENCES public.dhl_positions(id) ON DELETE CASCADE NOT NULL,
  dhl_work_group_id UUID REFERENCES public.dhl_work_groups(id) ON DELETE CASCADE NOT NULL,
  assigned_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE (user_id, dhl_position_id, dhl_work_group_id)
);

-- 8. Povolení RLS na všech nových tabulkách
ALTER TABLE public.dhl_positions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.dhl_work_groups ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.dhl_shift_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.dhl_notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_dhl_assignments ENABLE ROW LEVEL SECURITY;

-- 9. Vytvoření RLS politik

-- DHL pozice - všichni mohou číst, pouze admin může upravovat
CREATE POLICY "Anyone can view active DHL positions" ON public.dhl_positions
  FOR SELECT USING (is_active = true);

CREATE POLICY "Admins can manage DHL positions" ON public.dhl_positions
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND is_admin = true)
  );

-- DHL pracovní skupiny - všichni mohou číst, pouze admin může upravovat  
CREATE POLICY "Anyone can view active work groups" ON public.dhl_work_groups
  FOR SELECT USING (is_active = true);

CREATE POLICY "Admins can manage work groups" ON public.dhl_work_groups
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND is_admin = true)
  );

-- DHL směnové šablony - všichni mohou číst, pouze admin může upravovat
CREATE POLICY "Anyone can view shift templates" ON public.dhl_shift_templates
  FOR SELECT USING (true);

CREATE POLICY "Admins can manage shift templates" ON public.dhl_shift_templates
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND is_admin = true)
  );

-- DHL notifikace - uživatelé vidí pouze své notifikace
CREATE POLICY "Users can view their DHL notifications" ON public.dhl_notifications
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update their DHL notifications" ON public.dhl_notifications
  FOR UPDATE USING (auth.uid() = user_id);

-- Uživatelská DHL přiřazení - uživatelé vidí pouze svá přiřazení
CREATE POLICY "Users can view their DHL assignments" ON public.user_dhl_assignments
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Admins can manage all DHL assignments" ON public.user_dhl_assignments
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND is_admin = true)
  );

-- 10. Vytvoření indexů pro optimální výkon
CREATE INDEX idx_dhl_positions_type ON public.dhl_positions(position_type);
CREATE INDEX idx_dhl_positions_active ON public.dhl_positions(is_active);
CREATE INDEX idx_dhl_work_groups_week ON public.dhl_work_groups(week_number);
CREATE INDEX idx_dhl_shift_templates_position ON public.dhl_shift_templates(position_id);
CREATE INDEX idx_dhl_shift_templates_work_group ON public.dhl_shift_templates(work_group_id);
CREATE INDEX idx_dhl_shift_templates_day ON public.dhl_shift_templates(day_of_week);
CREATE INDEX idx_shifts_dhl_managed ON public.shifts(is_dhl_managed) WHERE is_dhl_managed = true;
CREATE INDEX idx_shifts_dhl_position ON public.shifts(dhl_position_id);
CREATE INDEX idx_shifts_dhl_work_group ON public.shifts(dhl_work_group_id);
CREATE INDEX idx_dhl_notifications_user ON public.dhl_notifications(user_id);
CREATE INDEX idx_dhl_notifications_unread ON public.dhl_notifications(user_id, is_read) WHERE is_read = false;
CREATE INDEX idx_user_dhl_assignments_user ON public.user_dhl_assignments(user_id);
CREATE INDEX idx_user_dhl_assignments_active ON public.user_dhl_assignments(user_id, is_active) WHERE is_active = true;

-- 11. Vložení základních DHL pozic
INSERT INTO public.dhl_positions (name, position_type, description, hourly_rate) VALUES
('DHL Technik', 'technik', 'Technische Wartung und Reparaturen', 25.50),
('DHL Rangierer', 'rangierer', 'Fahrzeuge rangieren und organisieren', 22.00),
('DHL Verlader', 'verlader', 'Be- und Entladen von Fahrzeugen', 20.50),
('DHL Sortierer', 'sortierer', 'Pakete und Sendungen sortieren', 19.00),
('DHL Fahrer', 'fahrer', 'Auslieferung und Transport', 23.00),
('DHL Sonstige', 'other', 'Andere Tätigkeiten bei DHL', 18.50);

-- 12. Vložení pracovních skupin (Woche 1-15)
INSERT INTO public.dhl_work_groups (week_number, name, description) VALUES
(1, 'Woche 1', 'Erste Arbeitswoche'),
(2, 'Woche 2', 'Zweite Arbeitswoche'),
(3, 'Woche 3', 'Dritte Arbeitswoche'),
(4, 'Woche 4', 'Vierte Arbeitswoche'),
(5, 'Woche 5', 'Fünfte Arbeitswoche'),
(6, 'Woche 6', 'Sechste Arbeitswoche'),
(7, 'Woche 7', 'Siebte Arbeitswoche'),
(8, 'Woche 8', 'Achte Arbeitswoche'),
(9, 'Woche 9', 'Neunte Arbeitswoche'),
(10, 'Woche 10', 'Zehnte Arbeitswoche'),
(11, 'Woche 11', 'Elfte Arbeitswoche'),
(12, 'Woche 12', 'Zwölfte Arbeitswoche'),
(13, 'Woche 13', 'Dreizehnte Arbeitswoche'),
(14, 'Woche 14', 'Vierzehnte Arbeitswoche'),
(15, 'Woche 15', 'Fünfzehnte Arbeitswoche');

-- 13. Vytvoření trigger funkce pro aktualizaci updated_at
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- 14. Aplikace triggerů na nové tabulky
CREATE TRIGGER update_dhl_positions_updated_at BEFORE UPDATE ON public.dhl_positions FOR EACH ROW EXECUTE PROCEDURE public.update_updated_at_column();
CREATE TRIGGER update_dhl_work_groups_updated_at BEFORE UPDATE ON public.dhl_work_groups FOR EACH ROW EXECUTE PROCEDURE public.update_updated_at_column();
CREATE TRIGGER update_dhl_shift_templates_updated_at BEFORE UPDATE ON public.dhl_shift_templates FOR EACH ROW EXECUTE PROCEDURE public.update_updated_at_column();
CREATE TRIGGER update_dhl_notifications_updated_at BEFORE UPDATE ON public.dhl_notifications FOR EACH ROW EXECUTE PROCEDURE public.update_updated_at_column();
CREATE TRIGGER update_user_dhl_assignments_updated_at BEFORE UPDATE ON public.user_dhl_assignments FOR EACH ROW EXECUTE PROCEDURE public.update_updated_at_column();
