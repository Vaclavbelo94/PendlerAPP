-- Oprava profilu uživatele 4.8@gmail.com
-- Nastavení správných hodnot pro DHL zaměstnance s promokódem DHL_PREMIUM_2025

UPDATE profiles 
SET 
  company = 'dhl',
  is_dhl_employee = true,
  is_premium = true,
  premium_expiry = NOW() + INTERVAL '12 months',
  updated_at = NOW()
WHERE email = '4.8@gmail.com';

-- Vytvoření záznamu o použití promokódu
INSERT INTO company_premium_code_redemptions (
  user_id, 
  company_premium_code_id, 
  redeemed_at, 
  premium_expires_at
)
SELECT 
  p.id,
  cpc.id,
  NOW(),
  NOW() + INTERVAL '12 months'
FROM profiles p, company_premium_codes cpc
WHERE p.email = '4.8@gmail.com' 
  AND cpc.code = 'DHL_PREMIUM_2025'
ON CONFLICT (user_id, company_premium_code_id) DO NOTHING;

-- Aktualizace počtu použití promokódu
UPDATE company_premium_codes 
SET used_count = used_count + 1, updated_at = NOW()
WHERE code = 'DHL_PREMIUM_2025';