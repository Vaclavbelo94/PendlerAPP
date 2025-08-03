-- Insert sample classic premium code
INSERT INTO company_premium_codes (
  company, code, name, description, premium_duration_months, max_users, 
  valid_from, valid_until, created_by
) VALUES 
(
  null, 'CLASSIC_PREMIUM_2025', 'Klasické Premium 2025', 
  'Obecný premium přístup pro všechny uživatele', 
  6, null, 
  '2025-01-01'::timestamptz, '2025-12-31'::timestamptz,
  (SELECT id FROM profiles WHERE email = 'admin@pendlerapp.com')
);