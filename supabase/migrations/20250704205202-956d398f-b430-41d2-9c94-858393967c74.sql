
-- Ensure DHL2026 promo code exists
INSERT INTO public.promo_codes (code, discount, duration, valid_until, used_count, max_uses)
VALUES ('DHL2026', 100, 12, '2025-12-31T23:59:59.999Z', 0, 1000)
ON CONFLICT (code) DO UPDATE SET
  valid_until = '2025-12-31T23:59:59.999Z',
  max_uses = 1000;

-- Add is_dhl_employee column to profiles table if it doesn't exist
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS is_dhl_employee BOOLEAN DEFAULT FALSE;

-- Create redemption record for current user (replace with actual user ID)
-- This will be done via the application code for the logged-in user

-- Update profiles table to set DHL employee status for users with DHL promo redemptions
UPDATE public.profiles 
SET is_dhl_employee = TRUE 
WHERE id IN (
  SELECT DISTINCT pcr.user_id 
  FROM promo_code_redemptions pcr
  JOIN promo_codes pc ON pcr.promo_code_id = pc.id
  WHERE pc.code IN ('DHL2026', 'DHL2025', 'DHLSPECIAL')
);
