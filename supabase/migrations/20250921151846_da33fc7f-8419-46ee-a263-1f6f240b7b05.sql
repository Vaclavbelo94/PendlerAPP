-- FÁZE 3: OPRAVA EXTENSION V PUBLIC SCHEMA

-- Identifikace a oprava problematických rozšíření v public schema
-- Nejčastěji je problém s uuid-ossp extension

-- Přesunout uuid-ossp extension z public do extensions schema
DROP EXTENSION IF EXISTS "uuid-ossp" CASCADE;
CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA extensions;

-- Ověřit a opravit další možné extensions
SELECT 
    extname,
    nspname as schema_name
FROM pg_extension e
JOIN pg_namespace n ON e.extnamespace = n.oid
WHERE nspname = 'public';