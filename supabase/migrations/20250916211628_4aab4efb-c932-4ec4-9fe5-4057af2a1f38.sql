-- Enhanced trigger function to automatically update notification metadata
CREATE OR REPLACE FUNCTION public.notify_rideshare_status_change()
RETURNS TRIGGER AS $$
DECLARE
  offer_record RECORD;
  driver_name text;
  requester_name text;
BEGIN
  -- Only proceed if status has changed
  IF OLD.status = NEW.status THEN
    RETURN NEW;
  END IF;
  
  -- Get offer and user details
  SELECT ro.*, 
         p1.username as driver_username,
         p2.username as requester_username
  INTO offer_record
  FROM rideshare_offers ro
  LEFT JOIN profiles p1 ON ro.user_id = p1.id
  LEFT JOIN profiles p2 ON NEW.requester_user_id = p2.id
  WHERE ro.id = NEW.offer_id;
  
  driver_name := COALESCE(offer_record.driver_username, 'Řidič');
  requester_name := COALESCE(offer_record.requester_username, 'Neznámý uživatel');
  
  -- Update ALL existing notification metadata for this contact
  UPDATE notifications 
  SET metadata = jsonb_set(metadata, '{status}', to_jsonb(NEW.status::text)),
      updated_at = now()
  WHERE metadata->>'contact_id' = NEW.id::text;
  
  -- Notify the requester about status change
  IF NEW.status = 'accepted' THEN
    INSERT INTO notifications (user_id, title, message, type, category, metadata, related_to)
    VALUES (
      NEW.requester_user_id,
      '✅ Žádost schválena',
      'Uživatel ' || driver_name || ' schválil vaši žádost o spolujízdu z ' || offer_record.origin_address || ' do ' || offer_record.destination_address,
      'success',
      'rideshare',
      jsonb_build_object(
        'contact_id', NEW.id,
        'offer_id', NEW.offer_id,
        'status', 'accepted',
        'driver_name', driver_name,
        'origin_address', offer_record.origin_address,
        'destination_address', offer_record.destination_address,
        'departure_time', offer_record.departure_time,
        'departure_date', offer_record.departure_date
      ),
      jsonb_build_object('type', 'rideshare_contact', 'id', NEW.id)
    );
  ELSIF NEW.status = 'rejected' THEN
    INSERT INTO notifications (user_id, title, message, type, category, metadata, related_to)
    VALUES (
      NEW.requester_user_id,
      '❌ Žádost zamítnuta',
      'Uživatel ' || driver_name || ' zamítl vaši žádost o spolujízdu z ' || offer_record.origin_address || ' do ' || offer_record.destination_address,
      'warning',
      'rideshare',
      jsonb_build_object(
        'contact_id', NEW.id,
        'offer_id', NEW.offer_id,
        'status', 'rejected',
        'driver_name', driver_name,
        'origin_address', offer_record.origin_address,
        'destination_address', offer_record.destination_address,
        'departure_time', offer_record.departure_time,
        'departure_date', offer_record.departure_date
      ),
      jsonb_build_object('type', 'rideshare_contact', 'id', NEW.id)
    );
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Create edge function for periodic cleanup and sync
CREATE OR REPLACE FUNCTION public.sync_rideshare_notifications()
RETURNS void AS $$
DECLARE
  contact_record RECORD;
BEGIN
  -- Sync all notifications that have outdated metadata
  FOR contact_record IN 
    SELECT rc.id, rc.status, rc.offer_id, rc.requester_user_id
    FROM rideshare_contacts rc
    WHERE EXISTS (
      SELECT 1 FROM notifications n 
      WHERE n.metadata->>'contact_id' = rc.id::text 
      AND n.metadata->>'status' != rc.status::text
    )
  LOOP
    -- Update notification metadata to match current contact status
    UPDATE notifications 
    SET metadata = jsonb_set(metadata, '{status}', to_jsonb(contact_record.status::text)),
        updated_at = now()
    WHERE metadata->>'contact_id' = contact_record.id::text;
    
    RAISE NOTICE 'Synced notifications for contact %', contact_record.id;
  END LOOP;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;