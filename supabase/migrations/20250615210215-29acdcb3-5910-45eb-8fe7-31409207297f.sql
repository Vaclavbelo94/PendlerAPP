
-- Add a nullable phone_number column for rideshare offers  
ALTER TABLE rideshare_offers ADD COLUMN IF NOT EXISTS phone_number text;
