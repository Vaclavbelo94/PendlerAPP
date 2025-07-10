-- Phase 1: Clean up and create structured DHL positions with correct rotation patterns

-- First, deactivate all existing positions
UPDATE dhl_positions SET is_active = false;

-- Create the 15 new structured positions with correct cycle_weeks rotation patterns
INSERT INTO dhl_positions (name, position_type, description, cycle_weeks, is_active, hourly_rate) VALUES
-- Verlader positions
('Dpl 28h (Verlader Nacht)', 'verlader', 'Doplňovač 28 hodin - noční směny', ARRAY[1,4,7,10,13], true, 15.50),
('Verlader Wechselschicht 32h', 'verlader', 'Verlader střídavé směny 32 hodin týdně', ARRAY[2,5,8,11,14], true, 16.00),
('Sperrgut/Verlader', 'verlader', 'Nakládání speciálního zboží', ARRAY[1,3,5,7,9,11,13,15], true, 16.50),

-- Wechselschicht positions  
('Wechselschicht 30h', 'other', 'Střídavé směny 30 hodin týdně', ARRAY[1,4,7,10,13], true, 15.80),
('Wechselschicht 25h', 'other', 'Střídavé směny 25 hodin týdně', ARRAY[2,6,10,14], true, 15.20),

-- SoEst positions
('SoEst Nacht/Spät 30h', 'sortierer', 'Sorting Evening/Night 30h', ARRAY[1,2,3,4,5,6,7,8,9,10,11,12,13,14,15], true, 16.20),
('SoEst Nacht/Spät 32h', 'sortierer', 'Sorting Evening/Night 32h', ARRAY[1,2,3,4,5,6,7,8,9,10,11,12,13,14,15], true, 16.80),

-- Team Leader positions
('TeamL Spät/Nacht', 'other', 'Team Leader večerní/noční směny', ARRAY[1,3,5,7,9,11,13,15], true, 18.50),
('TeamL SpG/NVP', 'other', 'Team Leader SpG/NVP', ARRAY[2,4,6,8,10,12,14], true, 18.50),

-- Rangierer positions
('Rangierer Gr 5', 'rangierer', 'Rangierer Gruppe 5', ARRAY[1,6,11], true, 17.20),
('Rangierer Gr 4', 'rangierer', 'Rangierer Gruppe 4', ARRAY[3,8,13], true, 17.20),

-- Specialized positions
('Technik', 'technik', 'Technická pozice', ARRAY[1,2,3,4,5,6,7,8,9,10,11,12,13,14,15], true, 19.00),
('Pausenvertreter PZE', 'other', 'Zástupce pro přestávky PZE', ARRAY[1,3,5,7,9,11,13,15], true, 16.00),
('Abrufkräfte', 'other', 'Pohotovostní síly', ARRAY[1,2,3,4,5,6,7,8,9,10,11,12,13,14,15], true, 15.50),
('Nachverpackung', 'other', 'Doplňkové balení', ARRAY[2,4,6,8,10,12,14], true, 15.80);

-- Update work groups to ensure we have all 15 weeks
INSERT INTO dhl_work_groups (week_number, name, description, is_active) 
SELECT 
    generate_series(1, 15) as week_number,
    'Woche ' || generate_series(1, 15) as name,
    'Pracovní týden ' || generate_series(1, 15) as description,
    true as is_active
ON CONFLICT (week_number) DO UPDATE SET
    is_active = true,
    updated_at = now();

-- Deactivate any existing user assignments to prepare for clean reassignment
UPDATE user_dhl_assignments SET is_active = false;

-- Clean up any existing shift schedules that might be inconsistent
UPDATE dhl_shift_schedules SET is_active = false;