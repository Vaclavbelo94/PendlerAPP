-- Extend profiles table for subscription source tracking
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS subscription_source TEXT;
COMMENT ON COLUMN profiles.subscription_source IS 'Source of subscription: stripe, google_play, app_store, promo_code';

-- Add Google Play offer ID to promo codes
ALTER TABLE company_premium_codes ADD COLUMN IF NOT EXISTS google_play_offer_id TEXT;
COMMENT ON COLUMN company_premium_codes.google_play_offer_id IS 'Google Play promotional offer ID for RevenueCat integration';

-- Create table for tracking RevenueCat transactions
CREATE TABLE IF NOT EXISTS revenuecat_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  transaction_id TEXT NOT NULL UNIQUE,
  product_id TEXT NOT NULL,
  purchase_date TIMESTAMP WITH TIME ZONE NOT NULL,
  expiration_date TIMESTAMP WITH TIME ZONE,
  store TEXT NOT NULL, -- 'google_play', 'app_store'
  event_type TEXT NOT NULL, -- 'INITIAL_PURCHASE', 'RENEWAL', 'CANCELLATION', 'EXPIRATION'
  is_trial BOOLEAN DEFAULT FALSE,
  raw_data JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE revenuecat_transactions ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view their own transactions"
  ON revenuecat_transactions FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Service role can insert transactions"
  ON revenuecat_transactions FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Service role can update transactions"
  ON revenuecat_transactions FOR UPDATE
  USING (true);

-- Create index for performance
CREATE INDEX IF NOT EXISTS idx_revenuecat_transactions_user_id ON revenuecat_transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_revenuecat_transactions_transaction_id ON revenuecat_transactions(transaction_id);

-- Add trigger for updated_at
CREATE TRIGGER update_revenuecat_transactions_updated_at
  BEFORE UPDATE ON revenuecat_transactions
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();