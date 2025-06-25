
-- Fix RLS policies for promo codes system

-- Enable RLS on promo_codes table if not already enabled
ALTER TABLE promo_codes ENABLE ROW LEVEL SECURITY;

-- Enable RLS on promo_code_redemptions table if not already enabled  
ALTER TABLE promo_code_redemptions ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist to avoid conflicts
DROP POLICY IF EXISTS "Anyone can view promo codes" ON promo_codes;
DROP POLICY IF EXISTS "Service can update promo codes" ON promo_codes;
DROP POLICY IF EXISTS "Users can view own redemptions" ON promo_code_redemptions;
DROP POLICY IF EXISTS "Users can insert own redemptions" ON promo_code_redemptions;
DROP POLICY IF EXISTS "Users can view own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON profiles;

-- Policies for promo_codes table (allow reading for authenticated users)
CREATE POLICY "Authenticated users can view promo codes" ON promo_codes
FOR SELECT TO authenticated USING (true);

-- Allow updating promo codes for usage count (needed for redemption process)
CREATE POLICY "Authenticated users can update promo code usage" ON promo_codes
FOR UPDATE TO authenticated USING (true);

-- Policies for promo_code_redemptions table
CREATE POLICY "Users can view own redemptions" ON promo_code_redemptions
FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own redemptions" ON promo_code_redemptions
FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Policies for profiles table (ensure users can manage their own profiles)
CREATE POLICY "Users can view own profile" ON profiles
FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON profiles
FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON profiles
FOR INSERT WITH CHECK (auth.uid() = id);

-- Ensure DHL2025 promo code exists and is valid
INSERT INTO promo_codes (code, discount, duration, valid_until, used_count, max_uses)
VALUES ('DHL2025', 100, 3, '2025-12-31T23:59:59.999Z', 0, 100)
ON CONFLICT (code) DO UPDATE SET
  valid_until = '2025-12-31T23:59:59.999Z',
  used_count = 0;
