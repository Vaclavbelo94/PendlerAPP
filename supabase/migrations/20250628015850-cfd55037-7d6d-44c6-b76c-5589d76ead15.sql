
-- Fix RLS policies for promo_code_redemptions table

-- Enable RLS if not already enabled
ALTER TABLE promo_code_redemptions ENABLE ROW LEVEL SECURITY;

-- Drop existing policies to avoid conflicts
DROP POLICY IF EXISTS "Users can view own redemptions" ON promo_code_redemptions;
DROP POLICY IF EXISTS "Users can insert own redemptions" ON promo_code_redemptions;

-- Allow users to view their own redemptions
CREATE POLICY "Users can view own redemptions" ON promo_code_redemptions
FOR SELECT USING (auth.uid() = user_id);

-- Allow users to insert their own redemptions
CREATE POLICY "Users can insert own redemptions" ON promo_code_redemptions
FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Allow authenticated users to view promo codes (needed for validation)
DROP POLICY IF EXISTS "Authenticated users can view promo codes" ON promo_codes;
CREATE POLICY "Authenticated users can view promo codes" ON promo_codes
FOR SELECT TO authenticated USING (true);
