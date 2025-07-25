-- Create ride_requests table
CREATE TABLE public.ride_requests (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  rideshare_offer_id UUID NOT NULL REFERENCES public.rideshare_offers(id) ON DELETE CASCADE,
  requester_user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  driver_user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  message TEXT,
  requester_email TEXT,
  requester_phone TEXT,
  requester_country_code TEXT DEFAULT '+420',
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'rejected')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.ride_requests ENABLE ROW LEVEL SECURITY;

-- Create policies for ride requests
CREATE POLICY "Users can view ride requests where they are involved"
ON public.ride_requests
FOR SELECT
USING (auth.uid() = requester_user_id OR auth.uid() = driver_user_id);

CREATE POLICY "Users can create ride requests"
ON public.ride_requests
FOR INSERT
WITH CHECK (auth.uid() = requester_user_id);

CREATE POLICY "Drivers can update ride request status"
ON public.ride_requests
FOR UPDATE
USING (auth.uid() = driver_user_id);

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_ride_requests_updated_at
BEFORE UPDATE ON public.ride_requests
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create indexes for better performance
CREATE INDEX idx_ride_requests_requester ON public.ride_requests(requester_user_id);
CREATE INDEX idx_ride_requests_driver ON public.ride_requests(driver_user_id);
CREATE INDEX idx_ride_requests_offer ON public.ride_requests(rideshare_offer_id);
CREATE INDEX idx_ride_requests_status ON public.ride_requests(status);