-- Nejdříve zkontrolujeme, zda trigger existuje a případně ho vytvoříme
-- Vytvoření triggeru pro automatické vytváření profilů při registraci nových uživatelů
CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Najdeme a vytvoříme chybějící profily pro existující uživatele
-- Toto vloží profily pro všechny uživatele z auth.users, kteří nemají profil v profiles tabulce
INSERT INTO public.profiles (id, email, username, is_admin, is_premium, is_dhl_employee, company)
SELECT 
  au.id,
  au.email,
  COALESCE(au.raw_user_meta_data ->> 'username', split_part(au.email, '@', 1)) as username,
  CASE WHEN au.email = 'admin@pendlerapp.com' THEN TRUE ELSE FALSE END as is_admin,
  CASE WHEN au.email = 'admin@pendlerapp.com' THEN TRUE ELSE FALSE END as is_premium,
  CASE WHEN (au.raw_user_meta_data ->> 'company')::company_type = 'dhl' THEN TRUE ELSE FALSE END as is_dhl_employee,
  (au.raw_user_meta_data ->> 'company')::company_type as company
FROM auth.users au
LEFT JOIN public.profiles p ON au.id = p.id
WHERE p.id IS NULL  -- Pouze uživatelé bez profilu
ON CONFLICT (id) DO NOTHING;