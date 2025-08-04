-- Fix search path for the DHL assignment function
CREATE OR REPLACE FUNCTION handle_dhl_assignment_insert()
RETURNS TRIGGER 
LANGUAGE plpgsql 
SECURITY DEFINER 
SET search_path = public
AS $$
BEGIN
  -- If inserting an active assignment, deactivate all other active assignments for this user
  IF NEW.is_active = true THEN
    UPDATE user_dhl_assignments 
    SET is_active = false, updated_at = now()
    WHERE user_id = NEW.user_id 
    AND is_active = true 
    AND id != NEW.id;
  END IF;
  
  RETURN NEW;
END;
$$;