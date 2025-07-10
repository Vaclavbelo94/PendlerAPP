-- Update user profile to be DHL employee 
UPDATE profiles 
SET is_dhl_employee = true, updated_at = now()
WHERE email = 'dhl@gmail.com';

-- Update user assignment to have correct reference_woche for Woche 13
UPDATE user_dhl_assignments 
SET 
  reference_woche = 13,
  updated_at = now()
WHERE user_id = (SELECT id FROM profiles WHERE email = 'dhl@gmail.com')
AND is_active = true;