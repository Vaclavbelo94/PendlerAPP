-- Přidání jazyka do profiles tabulky
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS language text DEFAULT 'cs';

-- Update existujících uživatelů (nastavit český jazyk jako default)
UPDATE public.profiles 
SET language = 'cs' 
WHERE language IS NULL;