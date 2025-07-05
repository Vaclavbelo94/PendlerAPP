-- Rozšíření user_notification_preferences o SMS a push notifikace
ALTER TABLE public.user_notification_preferences 
ADD COLUMN IF NOT EXISTS sms_notifications boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS push_notifications boolean DEFAULT true,
ADD COLUMN IF NOT EXISTS sms_reminder_advance integer DEFAULT 30,
ADD COLUMN IF NOT EXISTS immediate_notifications boolean DEFAULT true,
ADD COLUMN IF NOT EXISTS device_token text;

-- Vytvoření tabulky pro SMS logy
CREATE TABLE IF NOT EXISTS public.sms_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  phone_number text NOT NULL,
  message text NOT NULL,
  status text NOT NULL DEFAULT 'pending',
  sent_at timestamp with time zone,
  error_message text,
  sms_type text DEFAULT 'shift-reminder',
  related_to jsonb,
  created_at timestamp with time zone DEFAULT now()
);

-- RLS politiky pro SMS logs
ALTER TABLE public.sms_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own SMS logs"
ON public.sms_logs FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "System can insert SMS logs"
ON public.sms_logs FOR INSERT
WITH CHECK (true);

-- Vytvoření triggeru pro okamžité notifikace při změně směn
CREATE OR REPLACE FUNCTION public.notify_shift_changes()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
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
      
      -- Zavolání edge funkce pro okamžité odeslání notifikace
      PERFORM net.http_post(
        url := 'https://ghfjdgnnhhxhamcwjodx.supabase.co/functions/v1/send-immediate-notification',
        headers := '{"Content-Type": "application/json", "Authorization": "Bearer ' || current_setting('app.service_role_key', true) || '"}'::jsonb,
        body := jsonb_build_object(
          'user_id', NEW.user_id,
          'type', 'shift_change',
          'shift_id', NEW.id,
          'old_time', old_time,
          'new_time', new_time,
          'date', NEW.date
        )
      );
    END IF;
  END IF;
  
  RETURN COALESCE(NEW, OLD);
END;
$$;

-- Vytvoření triggeru na tabulku shifts
DROP TRIGGER IF EXISTS trigger_notify_shift_changes ON public.shifts;
CREATE TRIGGER trigger_notify_shift_changes
  AFTER UPDATE ON public.shifts
  FOR EACH ROW
  EXECUTE FUNCTION public.notify_shift_changes();

-- Povolit pg_net extension pokud není povolena
CREATE EXTENSION IF NOT EXISTS pg_net;

-- Uložení service role key pro triggery (je to bezpečné protože je to security definer funkce)
ALTER DATABASE postgres SET app.service_role_key = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdoZmpkZ25uaGh4aGFtY3dqb2R4Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0NzMwOTk3MywiZXhwIjoyMDYyODg1OTczfQ.5qiQYwOQrRFjEeGHNMYHm3yTNbCGo1vJWHHu9vvl6Co';