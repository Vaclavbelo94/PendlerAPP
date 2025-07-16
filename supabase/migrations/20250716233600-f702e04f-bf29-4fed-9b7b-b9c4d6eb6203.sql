-- Vytvoření tabulky pro Wechselschicht vzorce (15 skupin)
CREATE TABLE public.dhl_wechselschicht_patterns (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  woche_number INTEGER NOT NULL CHECK (woche_number >= 1 AND woche_number <= 15),
  pattern_name TEXT NOT NULL, -- např. "Woche 1", "Woche 2"
  description TEXT,
  -- Směny pro jednotlivé dny (NULL = volno)
  monday_shift TEXT, -- 'morning', 'afternoon', 'night', nebo NULL
  tuesday_shift TEXT,
  wednesday_shift TEXT,
  thursday_shift TEXT,
  friday_shift TEXT,
  saturday_shift TEXT,
  sunday_shift TEXT,
  -- Časy pro každý typ směny (flexibilní ±1 hodina)
  morning_start_time TIME DEFAULT '06:00',
  morning_end_time TIME DEFAULT '14:00',
  afternoon_start_time TIME DEFAULT '14:00',
  afternoon_end_time TIME DEFAULT '22:00',
  night_start_time TIME DEFAULT '22:00',
  night_end_time TIME DEFAULT '06:00',
  -- Metadata
  weekly_hours INTEGER DEFAULT 30,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE (woche_number)
);

-- Tabulka pro tracking denních změn časů směn
CREATE TABLE public.dhl_shift_time_changes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  woche_number INTEGER NOT NULL,
  change_date DATE NOT NULL,
  shift_type TEXT NOT NULL, -- 'morning', 'afternoon', 'night'
  original_start_time TIME NOT NULL,
  new_start_time TIME NOT NULL,
  original_end_time TIME NOT NULL,
  new_end_time TIME NOT NULL,
  reason TEXT,
  admin_user_id UUID REFERENCES auth.users(id) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE (woche_number, change_date, shift_type)
);

-- Rozšíření user_dhl_assignments o reference_date pro tracking pozice v rotaci
ALTER TABLE public.user_dhl_assignments 
ADD COLUMN reference_date DATE,
ADD COLUMN reference_woche INTEGER;

-- Povolení RLS
ALTER TABLE public.dhl_wechselschicht_patterns ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.dhl_shift_time_changes ENABLE ROW LEVEL SECURITY;

-- RLS policies pro Wechselschicht vzorce
CREATE POLICY "Admins can manage Wechselschicht patterns" 
ON public.dhl_wechselschicht_patterns
FOR ALL USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND is_admin = true)
);

CREATE POLICY "DHL employees can view active patterns" 
ON public.dhl_wechselschicht_patterns
FOR SELECT USING (
  is_active = true AND (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND is_admin = true) OR
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND is_dhl_employee = true)
  )
);

-- RLS policies pro změny časů
CREATE POLICY "Admins can manage time changes" 
ON public.dhl_shift_time_changes
FOR ALL USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND is_admin = true)
);

CREATE POLICY "DHL employees can view time changes" 
ON public.dhl_shift_time_changes
FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND is_dhl_employee = true)
);

-- Indexy pro optimální výkon
CREATE INDEX idx_wechselschicht_patterns_woche ON public.dhl_wechselschicht_patterns(woche_number);
CREATE INDEX idx_wechselschicht_patterns_active ON public.dhl_wechselschicht_patterns(is_active);
CREATE INDEX idx_shift_time_changes_date ON public.dhl_shift_time_changes(change_date);
CREATE INDEX idx_shift_time_changes_woche ON public.dhl_shift_time_changes(woche_number);

-- Trigger pro updated_at
CREATE TRIGGER update_dhl_wechselschift_patterns_updated_at 
BEFORE UPDATE ON public.dhl_wechselschicht_patterns 
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Vložení základních vzorců (bude možné upravit přes admin)
INSERT INTO public.dhl_wechselschicht_patterns (woche_number, pattern_name, description, 
  monday_shift, tuesday_shift, wednesday_shift, thursday_shift, friday_shift, saturday_shift, sunday_shift) VALUES
(1, 'Woche 1', 'Odpolední směny Po-Pá', 'afternoon', 'afternoon', 'afternoon', 'afternoon', 'afternoon', NULL, NULL),
(2, 'Woche 2', 'Noční směny Ne-So bez středy', 'night', 'night', NULL, 'night', 'night', 'night', 'night'),
(3, 'Woche 3', 'Ranní směny Po-Pá', 'morning', 'morning', 'morning', 'morning', 'morning', NULL, NULL),
(4, 'Woche 4', 'Kombinované směny', 'morning', 'afternoon', 'morning', 'afternoon', 'morning', NULL, NULL),
(5, 'Woche 5', 'Víkendové směny', NULL, NULL, NULL, NULL, NULL, 'morning', 'morning'),
(6, 'Woche 6', 'Kratší týden', 'afternoon', 'afternoon', 'afternoon', NULL, NULL, NULL, NULL),
(7, 'Woche 7', 'Směny s prodlouženým víkendem', 'morning', 'morning', 'morning', 'morning', NULL, NULL, NULL),
(8, 'Woche 8', 'Noční + víkend', 'night', 'night', 'night', NULL, NULL, 'night', 'night'),
(9, 'Woche 9', 'Standardní týden', 'morning', 'afternoon', 'morning', 'afternoon', 'morning', NULL, NULL),
(10, 'Woche 10', 'Pouze všední dny odpoledne', 'afternoon', 'afternoon', 'afternoon', 'afternoon', 'afternoon', NULL, NULL),
(11, 'Woche 11', 'Ranní + víkend', 'morning', 'morning', 'morning', NULL, NULL, 'morning', 'morning'),
(12, 'Woche 12', 'Krátké směny', 'morning', NULL, 'morning', NULL, 'morning', NULL, NULL),
(13, 'Woche 13', 'Intenzivní týden', 'morning', 'afternoon', 'night', 'morning', 'afternoon', NULL, NULL),
(14, 'Woche 14', 'Flexibilní rozvrh', 'afternoon', 'morning', 'afternoon', 'morning', NULL, NULL, NULL),
(15, 'Woche 15', 'Speciální vzorec', 'night', NULL, 'night', NULL, 'night', 'morning', NULL);