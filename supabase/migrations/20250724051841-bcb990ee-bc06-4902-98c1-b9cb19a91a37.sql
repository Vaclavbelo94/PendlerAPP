-- Zkontrolovat existující RLS na rideshare_offers tabulce
SELECT schemaname, tablename, rowsecurity 
FROM pg_tables 
WHERE tablename = 'rideshare_offers' AND schemaname = 'public';

-- Zkontrolovat existující politiky
SELECT policyname, cmd, qual, with_check 
FROM pg_policies 
WHERE tablename = 'rideshare_offers' AND schemaname = 'public';

-- Upravit politiku pro SELECT - změnit aby mohli všichni vidět všechny aktivní nabídky
DROP POLICY IF EXISTS "Users can view all active rideshare offers" ON public.rideshare_offers;

-- Vytvořit novou politiku pro VIEW - všichni mohou vidět aktivní nabídky
CREATE POLICY "Users can view all active rideshare offers" 
ON public.rideshare_offers 
FOR SELECT 
USING (is_active = true);