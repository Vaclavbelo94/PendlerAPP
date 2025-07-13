-- Enable pg_cron extension if not already enabled
CREATE EXTENSION IF NOT EXISTS pg_cron;

-- Create a cron job to run rideshare cleanup daily at 02:00 UTC
SELECT cron.schedule(
  'rideshare-cleanup-daily',
  '0 2 * * *', -- Every day at 02:00 UTC
  $$
  select
    net.http_post(
        url:='https://ghfjdgnnhhxhamcwjodx.supabase.co/functions/v1/rideshare-cleanup',
        headers:='{"Content-Type": "application/json", "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdoZmpkZ25uaGh4aGFtY3dqb2R4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDczMDk5NzMsImV4cCI6MjA2Mjg4NTk3M30.CMZnWLopnWOghTFxule4c3BB9G5CMLlr0CNhxeoZa3w"}'::jsonb,
        body:='{"time": "' || now() || '"}'::jsonb
    ) as request_id;
  $$
);