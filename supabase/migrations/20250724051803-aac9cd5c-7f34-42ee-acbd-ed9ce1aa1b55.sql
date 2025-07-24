-- Vytvořit RLS politiky pro rideshare nabídky
-- Zjistit existující tabule
SELECT table_name, row_security FROM information_schema.tables 
WHERE table_schema = 'public' AND table_name LIKE '%rideshare%';

-- Povolit RLS na rideshare_offers pokud už není
ALTER TABLE public.rideshare_offers ENABLE ROW LEVEL SECURITY;

-- Smazat existující politiky pokud existují
DROP POLICY IF EXISTS "Users can view all rideshare offers" ON public.rideshare_offers;
DROP POLICY IF EXISTS "Users can create their own rideshare offers" ON public.rideshare_offers;
DROP POLICY IF EXISTS "Users can update their own rideshare offers" ON public.rideshare_offers;
DROP POLICY IF EXISTS "Users can delete their own rideshare offers" ON public.rideshare_offers;

-- Vytvořit nové RLS politiky pro rideshare_offers
-- Každý může vidět všechny nabídky
CREATE POLICY "Users can view all rideshare offers" 
ON public.rideshare_offers 
FOR SELECT 
USING (true);

-- Uživatelé mohou vytvářet pouze své vlastní nabídky
CREATE POLICY "Users can create their own rideshare offers" 
ON public.rideshare_offers 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- Uživatelé mohou upravovat pouze své vlastní nabídky
CREATE POLICY "Users can update their own rideshare offers" 
ON public.rideshare_offers 
FOR UPDATE 
USING (auth.uid() = user_id);

-- Uživatelé mohou mazat pouze své vlastní nabídky
CREATE POLICY "Users can delete their own rideshare offers" 
ON public.rideshare_offers 
FOR DELETE 
USING (auth.uid() = user_id);

-- Zkontrolovat existující strukturu tabulky rideshare_offers
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_schema = 'public' AND table_name = 'rideshare_offers'
ORDER BY ordinal_position;