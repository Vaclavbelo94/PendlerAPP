-- Fix existing notification metadata that should show 'accepted' status
UPDATE notifications 
SET metadata = jsonb_set(metadata, '{status}', '"accepted"'::jsonb),
    updated_at = now()
WHERE id = '2dd19125-3f2d-4439-bbb1-cc64f4ad6b90' 
AND metadata->>'contact_id' = 'b0c54adb-5ec6-4649-b2e4-ca3608c67c85';