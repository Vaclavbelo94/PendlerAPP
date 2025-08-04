-- Clean up duplicate active DHL assignments, keeping only the most recent per user
WITH ranked_assignments AS (
  SELECT 
    id,
    user_id,
    ROW_NUMBER() OVER (PARTITION BY user_id ORDER BY created_at DESC) as rn
  FROM user_dhl_assignments 
  WHERE is_active = true
)
UPDATE user_dhl_assignments 
SET is_active = false, updated_at = now()
WHERE id IN (
  SELECT id FROM ranked_assignments WHERE rn > 1
);

-- Add unique constraint to prevent multiple active assignments per user
CREATE UNIQUE INDEX CONCURRENTLY IF NOT EXISTS idx_user_dhl_assignments_unique_active 
ON user_dhl_assignments (user_id) 
WHERE is_active = true;

-- Create function to automatically deactivate old assignments when new one is created
CREATE OR REPLACE FUNCTION handle_dhl_assignment_insert()
RETURNS TRIGGER AS $$
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
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for automatic cleanup
DROP TRIGGER IF EXISTS trigger_handle_dhl_assignment_insert ON user_dhl_assignments;
CREATE TRIGGER trigger_handle_dhl_assignment_insert
  BEFORE INSERT ON user_dhl_assignments
  FOR EACH ROW
  EXECUTE FUNCTION handle_dhl_assignment_insert();