-- Enable pg_cron extension for scheduled tasks
CREATE EXTENSION IF NOT EXISTS pg_cron;

-- Enable pg_net extension for HTTP requests
CREATE EXTENSION IF NOT EXISTS pg_net;

-- Schedule the sync function to run every 5 minutes
SELECT cron.schedule(
  'sync-rideshare-notifications',
  '*/5 * * * *', -- every 5 minutes
  $$
  select
    net.http_post(
        url:='https://ghfjdgnnhhxhamcwjodx.supabase.co/functions/v1/sync-rideshare-notifications',
        headers:='{"Content-Type": "application/json", "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdoZmpkZ25uaGh4aGFtY3dqb2R4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDczMDk5NzMsImV4cCI6MjA2Mjg4NTk3M30.CMZnWLopnWOghTFxule4c3BB9G5CMLlr0CNhxeoZa3w"}'::jsonb,
        body:=concat('{"triggered_at": "', now(), '"}')::jsonb
    ) as request_id;
  $$
);

-- Run initial cleanup of notification queue
DELETE FROM notification_queue WHERE processed_at IS NOT NULL AND processed_at < now() - interval '7 days';

-- Run the sync function once immediately to test it
SELECT sync_rideshare_notifications();