-- Create test rideshare offer for xtest@gmail.com user
INSERT INTO rideshare_offers (user_id, origin_address, destination_address, departure_date, departure_time, seats_available, price_per_person, currency, notes, is_recurring, recurring_days, is_active, phone_number) 
VALUES (
  '93935316-3fc4-43dd-9bca-fe75db115a00', -- xtest@gmail.com user ID from logs
  'Praha',
  'Brno', 
  '2025-01-05',
  '08:00:00',
  3,
  200.00,
  'EUR',
  'Pohodlná jízda do Brna',
  false,
  '{}',
  true,
  '+420 777 123 456'
);

-- Get the created offer ID for creating contact
DO $$
DECLARE
    offer_uuid UUID;
    requester_uuid UUID;
BEGIN
    -- Get the offer ID we just created
    SELECT id INTO offer_uuid FROM rideshare_offers 
    WHERE user_id = '93935316-3fc4-43dd-9bca-fe75db115a00' 
    AND origin_address = 'Praha' 
    AND destination_address = 'Brno'
    LIMIT 1;
    
    -- Get another user ID for the requester (viktor@gmail.com or any other user)
    SELECT id INTO requester_uuid FROM auth.users 
    WHERE email != 'xtest@gmail.com' 
    LIMIT 1;
    
    -- Create a test contact request
    IF offer_uuid IS NOT NULL AND requester_uuid IS NOT NULL THEN
        INSERT INTO rideshare_contacts (offer_id, requester_user_id, message, status, requester_email, phone_number, country_code) 
        VALUES (
            offer_uuid,
            requester_uuid,
            'Dobrý den, rád bych se svezl do Brna. Můžeme se domluvit na čase a místě?',
            'pending',
            'test.passenger@example.com',
            '123456789',
            '+420'
        );
    END IF;
END $$;