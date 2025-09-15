-- Create rideshare_contacts table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.rideshare_contacts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  offer_id UUID NOT NULL,
  requester_user_id UUID,
  requester_email TEXT NOT NULL,
  requester_phone TEXT,
  message TEXT,
  status TEXT NOT NULL DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  CONSTRAINT rideshare_contacts_offer_fk FOREIGN KEY (offer_id) REFERENCES public.rideshare_offers(id) ON DELETE CASCADE
);

-- Enable RLS
ALTER TABLE public.rideshare_contacts ENABLE ROW LEVEL SECURITY;

-- Create policies for rideshare_contacts
CREATE POLICY "Users can view contacts for their offers" 
ON public.rideshare_contacts 
FOR SELECT 
USING (
  auth.uid() = requester_user_id OR
  offer_id IN (SELECT id FROM rideshare_offers WHERE user_id = auth.uid())
);

CREATE POLICY "Users can create contact requests" 
ON public.rideshare_contacts 
FOR INSERT 
WITH CHECK (auth.uid() = requester_user_id);

CREATE POLICY "Offer owners can update contact status" 
ON public.rideshare_contacts 
FOR UPDATE 
USING (
  offer_id IN (SELECT id FROM rideshare_offers WHERE user_id = auth.uid())
);

-- Create trigger for automatic timestamp updates
CREATE OR REPLACE FUNCTION update_rideshare_contacts_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_rideshare_contacts_updated_at
BEFORE UPDATE ON public.rideshare_contacts
FOR EACH ROW
EXECUTE FUNCTION update_rideshare_contacts_updated_at();

-- Add the table to realtime publication
ALTER PUBLICATION supabase_realtime ADD TABLE public.rideshare_contacts;