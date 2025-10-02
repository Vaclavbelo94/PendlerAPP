-- Insert notification preferences for users who don't have them yet
INSERT INTO user_notification_preferences (
  user_id,
  email_notifications,
  push_notifications,
  shift_reminders,
  weekly_summaries,
  system_updates,
  reminder_time
)
SELECT 
  id as user_id,
  true as email_notifications,
  true as push_notifications,
  true as shift_reminders,
  false as weekly_summaries,
  true as system_updates,
  '08:00:00'::time as reminder_time
FROM auth.users
WHERE id NOT IN (SELECT user_id FROM user_notification_preferences)
ON CONFLICT (user_id) DO UPDATE SET
  shift_reminders = true;