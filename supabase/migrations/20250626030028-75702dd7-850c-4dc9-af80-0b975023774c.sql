
-- Vytvoření 14 DHL pozic s definovanými týdny v cyklu
INSERT INTO public.dhl_positions (name, position_type, cycle_weeks, is_active) VALUES
('Dpl 28h (Verlader Nacht)', 'other', ARRAY[1,2,3,4,5], true),
('Verlader Wechselschicht 32h', 'other', ARRAY[1,2,3,4,5], true),
('Sperrgut/Verlader', 'other', ARRAY[1,2,3,4,5], true),
('Wechselschicht 30h', 'other', ARRAY[1,2,3,4,5,6,7,8,9,10,11,12,13,14,15], true),
('Wechselschicht 25h', 'other', ARRAY[1,2,3,4,5], true),
('SoEst Nacht/Spät 30h', 'other', ARRAY[1,2,3,4,5], true),
('SoEst Nacht/Spät 32h', 'other', ARRAY[1,2,3,4,5], true),
('TeamL Spät/Nacht', 'other', ARRAY[1,2,3,4,5], true),
('TeamL SpG/NVP', 'other', ARRAY[1,2,3,4,5], true),
('Rangierer', 'other', ARRAY[1,2,3,4,5], true),
('Technik', 'other', ARRAY[1,2,3,4,5], true),
('Pausenvertreter PZE', 'other', ARRAY[1,2,3,4,5], true),
('Abrufkräfte', 'other', ARRAY[1,2,3,4,5], true),
('Nachverpackung', 'other', ARRAY[1,2,3,4,5], true);
