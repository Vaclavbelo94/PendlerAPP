-- Update handle_new_user trigger to set app_metadata for DHL employees
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
  promo_code_input TEXT;
  promo_code_record RECORD;
  is_dhl_code BOOLEAN := FALSE;
BEGIN
  -- Extract promo code from user metadata
  promo_code_input := NEW.raw_user_meta_data ->> 'promo_code';
  
  -- Create the profile first
  INSERT INTO public.profiles (id, email, username, is_admin, is_premium, is_dhl_employee)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data ->> 'username', split_part(NEW.email, '@', 1)),
    CASE WHEN NEW.email = 'vaclavbelo94@gmail.com' THEN TRUE ELSE FALSE END,
    CASE WHEN NEW.email = 'vaclavbelo94@gmail.com' THEN TRUE ELSE FALSE END,
    FALSE -- Will be updated if DHL promo code is found
  );
  
  -- Process promo code if provided
  IF promo_code_input IS NOT NULL AND promo_code_input != '' THEN
    -- Find the promo code in the database
    SELECT * INTO promo_code_record 
    FROM public.promo_codes 
    WHERE UPPER(code) = UPPER(promo_code_input)
    AND valid_until > NOW()
    AND (max_uses IS NULL OR used_count < max_uses);
    
    -- If valid promo code found, create redemption record
    IF FOUND THEN
      -- Create promo code redemption
      INSERT INTO public.promo_code_redemptions (user_id, promo_code_id, redeemed_at)
      VALUES (NEW.id, promo_code_record.id, NOW());
      
      -- Update promo code usage count
      UPDATE public.promo_codes 
      SET used_count = used_count + 1, updated_at = NOW()
      WHERE id = promo_code_record.id;
      
      -- Check if it's a DHL promo code
      IF UPPER(promo_code_record.code) IN ('DHL2026', 'DHL2025', 'DHLSPECIAL') THEN
        is_dhl_code := TRUE;
        
        -- Update profile to mark as DHL employee
        UPDATE public.profiles 
        SET is_dhl_employee = TRUE, updated_at = NOW()
        WHERE id = NEW.id;
        
        -- Update user app_metadata to include DHL flag
        UPDATE auth.users
        SET app_metadata = COALESCE(app_metadata, '{}'::jsonb) || '{"is_dhl_employee": true}'::jsonb
        WHERE id = NEW.id;
      END IF;

      -- Log the successful promo code redemption
      RAISE NOTICE 'Promo code % redeemed for user %, is_dhl: %', promo_code_record.code, NEW.id, is_dhl_code;
    ELSE
      -- Log invalid promo code attempt
      RAISE NOTICE 'Invalid or expired promo code attempt: % for user %', promo_code_input, NEW.id;
    END IF;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Update existing DHL employees to have app_metadata set
UPDATE auth.users 
SET app_metadata = COALESCE(app_metadata, '{}'::jsonb) || '{"is_dhl_employee": true}'::jsonb
WHERE id IN (
  SELECT id FROM public.profiles WHERE is_dhl_employee = TRUE
);