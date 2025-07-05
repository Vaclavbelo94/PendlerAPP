-- Drop existing conflicting policies for promo_code_redemptions
DROP POLICY IF EXISTS "Users can insert own redemptions" ON public.promo_code_redemptions;
DROP POLICY IF EXISTS "Users can redeem promo codes" ON public.promo_code_redemptions;

-- Create a comprehensive policy that allows both authenticated users and security definer functions
CREATE POLICY "Users and system can insert redemptions" 
ON public.promo_code_redemptions 
FOR INSERT 
WITH CHECK (
  -- Allow if current user matches user_id (normal user redemption)
  auth.uid() = user_id 
  OR 
  -- Allow if called from security definer context (triggers, admin functions)
  current_setting('role') = 'service_role'
  OR
  -- Allow if no auth context (for triggers)
  auth.uid() IS NULL
);

-- Also ensure system can update promo code usage counts
DROP POLICY IF EXISTS "System can update usage" ON public.promo_codes;
CREATE POLICY "System can update usage" 
ON public.promo_codes 
FOR UPDATE 
USING (
  -- Allow authenticated users or system/triggers
  auth.uid() IS NOT NULL 
  OR 
  current_setting('role') = 'service_role'
  OR
  auth.uid() IS NULL
);