
-- Add PREMIUM2025 promo code for 50 people, valid for 6 months
INSERT INTO public.promo_codes (code, discount, duration, valid_until, used_count, max_uses)
VALUES ('PREMIUM2025', 100, 6, '2025-12-31T23:59:59.999Z', 0, 50)
ON CONFLICT (code) DO UPDATE SET
  discount = 100,
  duration = 6,
  valid_until = '2025-12-31T23:59:59.999Z',
  used_count = 0,
  max_uses = 50;
