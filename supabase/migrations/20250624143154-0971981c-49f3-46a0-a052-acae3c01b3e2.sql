
-- Nejdříve zkontrolujeme a vytvoříme RLS politiky pro profiles tabulku
-- Politika pro čtení vlastního profilu
CREATE POLICY "Users can view own profile" ON public.profiles
FOR SELECT USING (auth.uid() = id);

-- Politika pro aktualizaci vlastního profilu (včetně premium statusu)
CREATE POLICY "Users can update own profile" ON public.profiles
FOR UPDATE USING (auth.uid() = id);

-- Politika pro vkládání vlastního profilu
CREATE POLICY "Users can insert own profile" ON public.profiles
FOR INSERT WITH CHECK (auth.uid() = id);

-- Politiky pro promo_code_redemptions tabulku
-- Politika pro čtení vlastních redemptions
CREATE POLICY "Users can view own redemptions" ON public.promo_code_redemptions
FOR SELECT USING (auth.uid() = user_id);

-- Politika pro vkládání vlastních redemptions
CREATE POLICY "Users can insert own redemptions" ON public.promo_code_redemptions
FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Politiky pro promo_codes tabulku (čtení pro všechny)
CREATE POLICY "Anyone can view promo codes" ON public.promo_codes
FOR SELECT TO authenticated USING (true);

-- Politiky pro aktualizaci promo_codes (pro správné počítání použití)
CREATE POLICY "Service can update promo codes" ON public.promo_codes
FOR UPDATE TO authenticated USING (true);

-- Povolit RLS na těchto tabulkách pokud už není povoleno
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.promo_code_redemptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.promo_codes ENABLE ROW LEVEL SECURITY;
