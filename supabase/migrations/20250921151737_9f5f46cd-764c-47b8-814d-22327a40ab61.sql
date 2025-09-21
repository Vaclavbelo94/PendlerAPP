-- FÁZE 2C: DOKONČENÍ POSLEDNÍCH SEARCH_PATH OPRAV

-- Aktualizace všech zbývajících funkcí (triggers a další)
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public
AS $function$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$function$;

CREATE OR REPLACE FUNCTION public.update_company_modules_updated_at()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $function$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$function$;

CREATE OR REPLACE FUNCTION public.update_admin_permissions_updated_at()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $function$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$function$;

CREATE OR REPLACE FUNCTION public.update_dhl_shift_schedules_updated_at()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $function$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$function$;

CREATE OR REPLACE FUNCTION public.update_company_settings_updated_at()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $function$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$function$;

CREATE OR REPLACE FUNCTION public.update_system_config_updated_at()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $function$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$function$;

CREATE OR REPLACE FUNCTION public.update_company_menu_items_updated_at()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $function$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$function$;

CREATE OR REPLACE FUNCTION public.update_user_work_data_updated_at()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $function$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$function$;

CREATE OR REPLACE FUNCTION public.notify_shift_changes()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $function$
DECLARE
  old_time text;
  new_time text;
  change_type text;
BEGIN
  -- Pouze pro UPDATE operace
  IF TG_OP = 'UPDATE' THEN
    old_time := OLD.start_time::text;
    new_time := NEW.start_time::text;
    
    -- Kontrola změny času
    IF old_time != new_time THEN
      change_type := 'time_change';
      
      -- Vytvoření okamžité notifikace
      INSERT INTO public.notifications (user_id, title, message, type, related_to)
      VALUES (
        NEW.user_id,
        'Změna směny',
        '🔄 ZMĚNA: Směna ' || NEW.date || ' přesunuta z ' || old_time || ' na ' || new_time,
        'warning',
        jsonb_build_object('type', 'shift_change', 'shift_id', NEW.id, 'old_time', old_time, 'new_time', new_time)
      );
      
      -- Vložení do fronty pro okamžité zpracování
      INSERT INTO public.notification_queue (user_id, notification_type, message_data)
      VALUES (
        NEW.user_id,
        'shift_change',
        jsonb_build_object(
          'shift_id', NEW.id,
          'old_time', old_time,
          'new_time', new_time,
          'date', NEW.date,
          'shift_type', NEW.type,
          'notes', NEW.notes
        )
      );
    END IF;
  END IF;
  
  RETURN COALESCE(NEW, OLD);
END;
$function$;

CREATE OR REPLACE FUNCTION public.create_rideshare_notifications()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $function$
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
$function$;

CREATE OR REPLACE FUNCTION public.notify_rideshare_status_change()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $function$
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
$function$;

CREATE OR REPLACE FUNCTION public.sync_rideshare_notifications()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $function$
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
$function$;