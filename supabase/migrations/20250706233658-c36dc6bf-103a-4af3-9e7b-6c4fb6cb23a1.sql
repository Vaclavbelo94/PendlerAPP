-- Route analytics table for tracking user travel patterns
CREATE TABLE public.route_analytics (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  route_hash TEXT NOT NULL,
  origin_address TEXT NOT NULL,
  destination_address TEXT NOT NULL,
  travel_time INTEGER NOT NULL, -- in minutes
  distance INTEGER NOT NULL, -- in meters
  weather_conditions TEXT,
  traffic_level TEXT CHECK (traffic_level IN ('light', 'normal', 'heavy')),
  transport_mode TEXT NOT NULL DEFAULT 'driving',
  cost_estimate NUMERIC,
  carbon_footprint NUMERIC, -- kg CO2
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.route_analytics ENABLE ROW LEVEL SECURITY;

-- RLS policies for route_analytics
CREATE POLICY "Users can view their own route analytics"
ON public.route_analytics
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own route analytics"
ON public.route_analytics
FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Personal routes for frequent destinations
CREATE TABLE public.personal_routes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  name TEXT NOT NULL,
  origin_address TEXT NOT NULL,
  destination_address TEXT NOT NULL,
  preferred_departure_times JSONB, -- array of time preferences
  alert_preferences JSONB, -- notification settings
  is_frequent BOOLEAN DEFAULT false,
  transport_modes TEXT[] DEFAULT ARRAY['driving'], -- preferred transport modes
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.personal_routes ENABLE ROW LEVEL SECURITY;

-- RLS policies for personal_routes
CREATE POLICY "Users can manage their own personal routes"
ON public.personal_routes
FOR ALL
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Multi-modal transport options table
CREATE TABLE public.transport_modes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  mode_name TEXT NOT NULL UNIQUE,
  display_name_cs TEXT NOT NULL,
  display_name_de TEXT NOT NULL,
  display_name_pl TEXT NOT NULL,
  icon_name TEXT,
  carbon_factor NUMERIC, -- kg CO2 per km
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Insert default transport modes
INSERT INTO public.transport_modes (mode_name, display_name_cs, display_name_de, display_name_pl, icon_name, carbon_factor) VALUES
('driving', 'Auto', 'Auto', 'Samochód', 'car', 0.21),
('walking', 'Chůze', 'Zu Fuß', 'Pieszo', 'walk', 0.0),
('cycling', 'Kolo', 'Fahrrad', 'Rower', 'bike', 0.0),
('public_transport', 'MHD', 'Öffentliche Verkehrsmittel', 'Transport publiczny', 'bus', 0.05),
('train', 'Vlak', 'Zug', 'Pociąg', 'train', 0.04),
('rideshare', 'Spolujízda', 'Mitfahrgelegenheit', 'Współdzielenie przejazdu', 'users', 0.11);

-- Enable public read access for transport modes
ALTER TABLE public.transport_modes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view transport modes"
ON public.transport_modes
FOR SELECT
USING (is_active = true);

-- Create indexes for performance
CREATE INDEX idx_route_analytics_user_id ON public.route_analytics(user_id);
CREATE INDEX idx_route_analytics_created_at ON public.route_analytics(created_at);
CREATE INDEX idx_personal_routes_user_id ON public.personal_routes(user_id);
CREATE INDEX idx_personal_routes_frequent ON public.personal_routes(user_id, is_frequent) WHERE is_frequent = true;