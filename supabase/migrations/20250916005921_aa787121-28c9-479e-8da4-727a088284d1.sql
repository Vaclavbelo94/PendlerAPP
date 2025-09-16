-- Add status field to rideshare_contacts and improve notification trigger
ALTER TABLE public.rideshare_contacts 
ADD COLUMN IF NOT EXISTS status text DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected'));

-- Update the notification trigger to include requester name and better messaging
CREATE OR REPLACE FUNCTION public.create_rideshare_notifications()
RETURNS TRIGGER AS $$
DECLARE
  offer_record RECORD;
  requester_name text;
BEGIN
  -- Get the offer details
  SELECT * INTO offer_record 
  FROM rideshare_offers 
  WHERE id = NEW.offer_id;
  
  -- Get requester name from profiles
  SELECT COALESCE(username, 'Neznámý uživatel') INTO requester_name
  FROM profiles 
  WHERE id = NEW.requester_user_id;
  
  IF FOUND AND offer_record.user_id IS NOT NULL THEN
    -- Create notification for the driver (if different from requester)
    IF offer_record.user_id != NEW.requester_user_id THEN
      INSERT INTO notifications (user_id, title, message, type, category, metadata, related_to)
      VALUES (
        offer_record.user_id,
        'Nová žádost o spolujízdu',
        'Uživatel ' || requester_name || ' žádá o spolujízdu z ' || offer_record.origin_address || ' do ' || offer_record.destination_address || ' dne ' || offer_record.departure_date || ' v ' || offer_record.departure_time,
        'rideshare_match',
        'rideshare',
        jsonb_build_object(
          'contact_id', NEW.id,
          'offer_id', NEW.offer_id,
          'requester_email', NEW.requester_email,
          'requester_name', requester_name,
          'origin_address', offer_record.origin_address,
          'destination_address', offer_record.destination_address,
          'departure_time', offer_record.departure_time,
          'departure_date', offer_record.departure_date,
          'status', 'pending'
        ),
        jsonb_build_object('type', 'rideshare_contact', 'id', NEW.id)
      );
    END IF;
    
    -- Create confirmation notification for the requester  
    INSERT INTO notifications (user_id, title, message, type, category, metadata, related_to)
    VALUES (
      NEW.requester_user_id,
      'Žádost odeslána',
      'Vaše žádost o spolujízdu z ' || offer_record.origin_address || ' do ' || offer_record.destination_address || ' čeká na schválení',
      'rideshare_request',
      'rideshare',
      jsonb_build_object(
        'contact_id', NEW.id,
        'offer_id', NEW.offer_id,
        'origin_address', offer_record.origin_address,
        'destination_address', offer_record.destination_address,
        'departure_time', offer_record.departure_time,
        'departure_date', offer_record.departure_date,
        'status', 'pending'
      ),
      jsonb_build_object('type', 'rideshare_contact', 'id', NEW.id)
    );
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Create trigger for rideshare contact status updates
CREATE OR REPLACE FUNCTION public.notify_rideshare_status_change()
RETURNS TRIGGER AS $$
DECLARE
  offer_record RECORD;
  driver_name text;
BEGIN
  -- Only proceed if status has changed
  IF OLD.status = NEW.status THEN
    RETURN NEW;
  END IF;
  
  -- Get offer and driver details
  SELECT ro.*, p.username 
  INTO offer_record
  FROM rideshare_offers ro
  LEFT JOIN profiles p ON ro.user_id = p.id
  WHERE ro.id = NEW.offer_id;
  
  driver_name := COALESCE(offer_record.username, 'Řidič');
  
  -- Notify the requester about status change
  IF NEW.status = 'approved' THEN
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
        'status', 'approved',
        'driver_name', driver_name
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
        'driver_name', driver_name
      ),
      jsonb_build_object('type', 'rideshare_contact', 'id', NEW.id)
    );
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Create the update trigger
DROP TRIGGER IF EXISTS rideshare_status_change_trigger ON rideshare_contacts;
CREATE TRIGGER rideshare_status_change_trigger
  AFTER UPDATE ON rideshare_contacts
  FOR EACH ROW
  EXECUTE FUNCTION notify_rideshare_status_change();