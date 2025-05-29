
-- Enable extensions for cron jobs
SELECT cron.schedule(
  'notification-scheduler',
  '0 8,18 * * *', -- Runs at 8:00 AM and 6:00 PM daily
  $$
  SELECT
    net.http_post(
        url:='https://ghfjdgnnhhxhamcwjodx.supabase.co/functions/v1/notification-scheduler',
        headers:='{"Content-Type": "application/json", "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdoZmpkZ25uaGh4aGFtY3dqb2R4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDczMDk5NzMsImV4cCI6MjA2Mjg4NTk3M30.CMZnWLopnWOghTFxule4c3BB9G5CMLlr0CNhxeoZa3w"}'::jsonb,
        body:='{"scheduled": true}'::jsonb
    ) as request_id;
  $$
);
