-- Create company premium codes table for managing company-specific premium codes
CREATE TABLE public.company_premium_codes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  company company_type NOT NULL,
  code TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL, -- Display name for the code
  description TEXT,
  
  -- Premium settings
  premium_duration_months INTEGER NOT NULL DEFAULT 1, -- Duration in months
  max_users INTEGER, -- Maximum number of users who can use this code (NULL = unlimited)
  used_count INTEGER NOT NULL DEFAULT 0,
  
  -- Validity settings
  valid_from TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  valid_until TIMESTAMP WITH TIME ZONE NOT NULL,
  is_active BOOLEAN NOT NULL DEFAULT true,
  
  -- Auto-generation settings
  auto_generate BOOLEAN NOT NULL DEFAULT false, -- If true, codes are auto-generated for new employees
  code_prefix TEXT, -- Prefix for auto-generated codes (e.g., "DHL_", "ADECCO_")
  
  -- Audit fields
  created_by UUID REFERENCES profiles(id),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.company_premium_codes ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Super admins can manage all company premium codes" 
ON company_premium_codes 
FOR ALL 
USING (
  EXISTS (
    SELECT 1 FROM admin_permissions ap
    WHERE ap.user_id = auth.uid() 
    AND ap.permission_level = 'super_admin'
    AND ap.is_active = true
  )
);

CREATE POLICY "Company admins can manage their company codes" 
ON company_premium_codes 
FOR ALL 
USING (
  company = get_current_user_company() AND
  EXISTS (
    SELECT 1 FROM admin_permissions ap
    WHERE ap.user_id = auth.uid() 
    AND ap.permission_level IN ('admin', 'dhl_admin')
    AND ap.is_active = true
  )
);

CREATE POLICY "Users can view active codes for their company" 
ON company_premium_codes 
FOR SELECT 
USING (
  company = get_current_user_company() AND 
  is_active = true AND 
  valid_until > now()
);

-- Create redemption tracking table
CREATE TABLE public.company_premium_code_redemptions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  company_premium_code_id UUID NOT NULL REFERENCES company_premium_codes(id) ON DELETE CASCADE,
  redeemed_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  premium_expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  
  UNIQUE(user_id, company_premium_code_id)
);

-- Enable RLS for redemptions
ALTER TABLE public.company_premium_code_redemptions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own redemptions" 
ON company_premium_code_redemptions 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all redemptions" 
ON company_premium_code_redemptions 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM admin_permissions ap
    WHERE ap.user_id = auth.uid() 
    AND ap.permission_level IN ('super_admin', 'admin', 'dhl_admin')
    AND ap.is_active = true
  )
);

CREATE POLICY "System can insert redemptions" 
ON company_premium_code_redemptions 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- Create indexes for performance
CREATE INDEX idx_company_premium_codes_company ON company_premium_codes(company);
CREATE INDEX idx_company_premium_codes_active ON company_premium_codes(is_active, valid_until);
CREATE INDEX idx_company_premium_code_redemptions_user ON company_premium_code_redemptions(user_id);

-- Create trigger for updated_at
CREATE TRIGGER update_company_premium_codes_updated_at
  BEFORE UPDATE ON company_premium_codes
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Insert some sample company premium codes
INSERT INTO company_premium_codes (
  company, code, name, description, premium_duration_months, max_users, 
  valid_from, valid_until, created_by
) VALUES 
(
  'dhl', 'DHL_PREMIUM_2025', 'DHL Premium 2025', 
  'Roční premium přístup pro DHL zaměstnance', 
  12, 1000, 
  '2025-01-01'::timestamptz, '2025-12-31'::timestamptz,
  (SELECT id FROM profiles WHERE email = 'admin@pendlerapp.com')
),
(
  'adecco', 'ADECCO_PREMIUM_Q1', 'Adecco Premium Q1', 
  'Čtvrtletní premium přístup pro Adecco zaměstnance', 
  3, 500, 
  '2025-01-01'::timestamptz, '2025-03-31'::timestamptz,
  (SELECT id FROM profiles WHERE email = 'admin@pendlerapp.com')
),
(
  'randstad', 'RANDSTAD_PREMIUM_2025', 'Randstad Premium 2025', 
  'Půlroční premium přístup pro Randstad zaměstnance', 
  6, 300, 
  '2025-01-01'::timestamptz, '2025-06-30'::timestamptz,
  (SELECT id FROM profiles WHERE email = 'admin@pendlerapp.com')
);