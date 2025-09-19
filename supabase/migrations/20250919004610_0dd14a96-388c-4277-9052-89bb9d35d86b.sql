-- Create cron job for traffic monitoring every 2 hours
SELECT cron.schedule(
  'traffic-border-monitoring-2h',
  '0 */2 * * *', -- Every 2 hours
  $$
  SELECT
    net.http_post(
        url:='https://ghfjdgnnhhxhamcwjodx.supabase.co/functions/v1/traffic-border-monitoring',
        headers:='{"Content-Type": "application/json", "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdoZmpkZ25uaGh4aGFtY3dqb2R4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDczMDk5NzMsImV4cCI6MjA2Mjg4NTk3M30.CMZnWLopnWOghTFxule4c3BB9G5CMLlr0CNhxeoZa3w"}'::jsonb,
        body:='{"automated": true}'::jsonb
    ) as request_id;
  $$
);