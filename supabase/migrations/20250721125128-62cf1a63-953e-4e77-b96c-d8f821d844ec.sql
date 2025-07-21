
-- Update the dhl_wechselschicht_patterns table with correct 15-week rotation
-- First, clear existing patterns to avoid conflicts
DELETE FROM public.dhl_wechselschicht_patterns;

-- Insert correct 15-week rotation patterns for Wechselschicht 30h
-- Night shifts: Woche 1,4,6,9,11,14
INSERT INTO public.dhl_wechselschicht_patterns (woche_number, pattern_name, description, monday_shift, tuesday_shift, wednesday_shift, thursday_shift, friday_shift, saturday_shift, sunday_shift, morning_start_time, morning_end_time, afternoon_start_time, afternoon_end_time, night_start_time, night_end_time, weekly_hours, is_active) VALUES
(1, 'Woche 1 - Noční směny', 'Noční směny Po-Pá', 'noční', 'noční', 'noční', 'noční', 'noční', 'volno', 'volno', '06:00:00', '14:00:00', '14:00:00', '22:00:00', '22:00:00', '06:00:00', 30, true),
(4, 'Woche 4 - Noční směny', 'Noční směny Po-Pá', 'noční', 'noční', 'noční', 'noční', 'noční', 'volno', 'volno', '06:00:00', '14:00:00', '14:00:00', '22:00:00', '22:00:00', '06:00:00', 30, true),
(6, 'Woche 6 - Noční směny', 'Noční směny Po-Pá', 'noční', 'noční', 'noční', 'noční', 'noční', 'volno', 'volno', '06:00:00', '14:00:00', '14:00:00', '22:00:00', '22:00:00', '06:00:00', 30, true),
(9, 'Woche 9 - Noční směny', 'Noční směny Po-Pá', 'noční', 'noční', 'noční', 'noční', 'noční', 'volno', 'volno', '06:00:00', '14:00:00', '14:00:00', '22:00:00', '22:00:00', '06:00:00', 30, true),
(11, 'Woche 11 - Noční směny', 'Noční směny Po-Pá', 'noční', 'noční', 'noční', 'noční', 'noční', 'volno', 'volno', '06:00:00', '14:00:00', '14:00:00', '22:00:00', '22:00:00', '06:00:00', 30, true),
(14, 'Woche 14 - Noční směny', 'Noční směny Po-Pá', 'noční', 'noční', 'noční', 'noční', 'noční', 'volno', 'volno', '06:00:00', '14:00:00', '14:00:00', '22:00:00', '22:00:00', '06:00:00', 30, true);

-- Afternoon shifts: Woche 2,5,7,10,12,15
INSERT INTO public.dhl_wechselschicht_patterns (woche_number, pattern_name, description, monday_shift, tuesday_shift, wednesday_shift, thursday_shift, friday_shift, saturday_shift, sunday_shift, morning_start_time, morning_end_time, afternoon_start_time, afternoon_end_time, night_start_time, night_end_time, weekly_hours, is_active) VALUES
(2, 'Woche 2 - Odpolední směny', 'Odpolední směny Po-Pá', 'odpolední', 'odpolední', 'odpolední', 'odpolední', 'odpolední', 'volno', 'volno', '06:00:00', '14:00:00', '14:00:00', '22:00:00', '22:00:00', '06:00:00', 30, true),
(5, 'Woche 5 - Odpolední směny', 'Odpolední směny Po-Pá', 'odpolední', 'odpolední', 'odpolední', 'odpolední', 'odpolední', 'volno', 'volno', '06:00:00', '14:00:00', '14:00:00', '22:00:00', '22:00:00', '06:00:00', 30, true),
(7, 'Woche 7 - Odpolední směny', 'Odpolední směny Po-Pá', 'odpolední', 'odpolední', 'odpolední', 'odpolední', 'odpolední', 'volno', 'volno', '06:00:00', '14:00:00', '14:00:00', '22:00:00', '22:00:00', '06:00:00', 30, true),
(10, 'Woche 10 - Odpolední směny', 'Odpolední směny Po-Pá', 'odpolední', 'odpolední', 'odpolední', 'odpolední', 'odpolední', 'volno', 'volno', '06:00:00', '14:00:00', '14:00:00', '22:00:00', '22:00:00', '06:00:00', 30, true),
(12, 'Woche 12 - Odpolední směny', 'Odpolední směny Po-Pá', 'odpolední', 'odpolední', 'odpolední', 'odpolední', 'odpolední', 'volno', 'volno', '06:00:00', '14:00:00', '14:00:00', '22:00:00', '22:00:00', '06:00:00', 30, true),
(15, 'Woche 15 - Odpolední směny', 'Odpolední směny Po-Pá', 'odpolední', 'odpolední', 'odpolední', 'odpolední', 'odpolední', 'volno', 'volno', '06:00:00', '14:00:00', '14:00:00', '22:00:00', '22:00:00', '06:00:00', 30, true);

-- Morning shifts: Woche 3,8,13
INSERT INTO public.dhl_wechselschicht_patterns (woche_number, pattern_name, description, monday_shift, tuesday_shift, wednesday_shift, thursday_shift, friday_shift, saturday_shift, sunday_shift, morning_start_time, morning_end_time, afternoon_start_time, afternoon_end_time, night_start_time, night_end_time, weekly_hours, is_active) VALUES
(3, 'Woche 3 - Ranní směny', 'Ranní směny Po-Pá', 'ranní', 'ranní', 'ranní', 'ranní', 'ranní', 'volno', 'volno', '06:00:00', '14:00:00', '14:00:00', '22:00:00', '22:00:00', '06:00:00', 30, true),
(8, 'Woche 8 - Ranní směny', 'Ranní směny Po-Pá', 'ranní', 'ranní', 'ranní', 'ranní', 'ranní', 'volno', 'volno', '06:00:00', '14:00:00', '14:00:00', '22:00:00', '22:00:00', '06:00:00', 30, true),
(13, 'Woche 13 - Ranní směny', 'Ranní směny Po-Pá', 'ranní', 'ranní', 'ranní', 'ranní', 'ranní', 'volno', 'volno', '06:00:00', '14:00:00', '14:00:00', '22:00:00', '22:00:00', '06:00:00', 30, true);

-- Enhance dhl_shift_time_changes table for better exception handling
ALTER TABLE public.dhl_shift_time_changes 
ADD COLUMN IF NOT EXISTS calendar_week INTEGER,
ADD COLUMN IF NOT EXISTS affects_all_woche BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS is_day_off BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS affected_days TEXT[] DEFAULT '{}';

-- Add comment for clarity
COMMENT ON COLUMN public.dhl_shift_time_changes.calendar_week IS 'Calendar week (KW) when this change applies';
COMMENT ON COLUMN public.dhl_shift_time_changes.affects_all_woche IS 'Whether this change affects all woche groups in the calendar week';
COMMENT ON COLUMN public.dhl_shift_time_changes.is_day_off IS 'Whether this change creates a day off (e.g., Wednesday-Thursday)';
COMMENT ON COLUMN public.dhl_shift_time_changes.affected_days IS 'Array of affected days (monday, tuesday, etc.)';

-- Create index for performance
CREATE INDEX IF NOT EXISTS idx_dhl_shift_time_changes_calendar_week ON public.dhl_shift_time_changes(calendar_week);
CREATE INDEX IF NOT EXISTS idx_dhl_shift_time_changes_woche_calendar ON public.dhl_shift_time_changes(woche_number, calendar_week);
