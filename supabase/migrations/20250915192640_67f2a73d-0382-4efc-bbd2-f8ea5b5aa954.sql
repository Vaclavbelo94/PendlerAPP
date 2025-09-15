-- Drop the existing constraint
ALTER TABLE notifications DROP CONSTRAINT notifications_type_check;

-- Add a new constraint with extended notification types
ALTER TABLE notifications ADD CONSTRAINT notifications_type_check 
CHECK (type = ANY (ARRAY[
  'info'::text, 
  'warning'::text, 
  'success'::text, 
  'error'::text,
  'shift_reminder'::text,
  'shift_update'::text,
  'shift_cancelled'::text,
  'overtime'::text,
  'rideshare_match'::text,
  'rideshare_request'::text,
  'system_maintenance'::text,
  'system_update'::text,
  'admin_announcement'::text
]));