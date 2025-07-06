-- Vytvoření DHL admin uživatele
INSERT INTO auth.users (
    id,
    instance_id,
    email,
    encrypted_password,
    email_confirmed_at,
    created_at,
    updated_at,
    aud,
    role
) VALUES (
    gen_random_uuid(),
    '00000000-0000-0000-0000-000000000000',
    'admindhl@pendlerapp.com',
    crypt('admin123', gen_salt('bf')),
    now(),
    now(),
    now(),
    'authenticated',
    'authenticated'
) ON CONFLICT (email) DO NOTHING;

-- Vytvoření profilu pro DHL admin uživatele
INSERT INTO public.profiles (
    id,
    email,
    is_admin,
    is_premium,
    is_dhl_employee,
    language
) 
SELECT 
    u.id,
    u.email,
    true,
    true,
    true,
    'cs'
FROM auth.users u 
WHERE u.email = 'admindhl@pendlerapp.com'
ON CONFLICT (id) DO UPDATE SET
    is_admin = true,
    is_premium = true,
    is_dhl_employee = true;