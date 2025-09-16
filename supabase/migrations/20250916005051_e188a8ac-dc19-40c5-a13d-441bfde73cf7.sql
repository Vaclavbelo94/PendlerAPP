-- Update rideshare notifications function with correct types
CREATE OR REPLACE FUNCTION public.create_rideshare_notifications()
RETURNS TRIGGER AS $$
DECLARE
  offer_record RECORD;
BEGIN
  -- Get the offer details
  SELECT * INTO offer_record 
  FROM rideshare_offers 
  WHERE id = NEW.offer_id;
  
  IF FOUND THEN
    -- Create notification for the driver (if different from requester)
    IF offer_record.user_id != NEW.requester_user_id THEN
      INSERT INTO notifications (user_id, title, message, type, category, metadata, related_to)
      VALUES (
        offer_record.user_id,
        'Nová žádost o spolujízdu',
        'Někdo se zajímá o vaši spolujízdu z ' || offer_record.origin_address || ' do ' || offer_record.destination_address,
        'rideshare_match', -- Using valid type from check constraint
        'rideshare',
        jsonb_build_object(
          'contact_id', NEW.id,
          'offer_id', NEW.offer_id,
          'requester_email', NEW.requester_email,
          'origin_address', offer_record.origin_address,
          'destination_address', offer_record.destination_address,
          'departure_time', offer_record.departure_time
        ),
        jsonb_build_object('type', 'rideshare_contact', 'id', NEW.id)
      );
    END IF;
    
    -- Create confirmation notification for the requester  
    INSERT INTO notifications (user_id, title, message, type, category, metadata, related_to)
    VALUES (
      NEW.requester_user_id,
      'Žádost odeslána',
      'Vaše žádost o spolujízdu byla odeslána',
      'rideshare_request', -- Using valid type from check constraint
      'rideshare',
      jsonb_build_object(
        'contact_id', NEW.id,
        'offer_id', NEW.offer_id,
        'origin_address', offer_record.origin_address,
        'destination_address', offer_record.destination_address,
        'departure_time', offer_record.departure_time
      ),
      jsonb_build_object('type', 'rideshare_contact', 'id', NEW.id)
    );
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;