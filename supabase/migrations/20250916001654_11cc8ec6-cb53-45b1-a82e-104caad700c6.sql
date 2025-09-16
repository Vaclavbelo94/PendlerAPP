-- Enable real-time functionality for rideshare tables
-- Set REPLICA IDENTITY FULL to capture complete row data during updates
ALTER TABLE public.rideshare_contacts REPLICA IDENTITY FULL;
ALTER TABLE public.rideshare_offers REPLICA IDENTITY FULL;
ALTER TABLE public.rideshare_requests REPLICA IDENTITY FULL;

-- Add rideshare tables to supabase_realtime publication
ALTER PUBLICATION supabase_realtime ADD TABLE public.rideshare_contacts;
ALTER PUBLICATION supabase_realtime ADD TABLE public.rideshare_offers;
ALTER PUBLICATION supabase_realtime ADD TABLE public.rideshare_requests;