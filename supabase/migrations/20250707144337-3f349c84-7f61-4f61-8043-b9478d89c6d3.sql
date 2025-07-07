-- Add currency column to rideshare_offers table
ALTER TABLE public.rideshare_offers 
ADD COLUMN currency text NOT NULL DEFAULT 'EUR';

-- Add index for better performance
CREATE INDEX idx_rideshare_offers_currency ON public.rideshare_offers(currency);