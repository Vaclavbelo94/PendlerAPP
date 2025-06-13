
-- Enhance rideshare_offers table with new features
ALTER TABLE rideshare_offers ADD COLUMN IF NOT EXISTS rating numeric DEFAULT 0;
ALTER TABLE rideshare_offers ADD COLUMN IF NOT EXISTS completed_rides integer DEFAULT 0;

-- Enhance rideshare_contacts table
ALTER TABLE rideshare_contacts ADD COLUMN IF NOT EXISTS rating integer;
ALTER TABLE rideshare_contacts ADD COLUMN IF NOT EXISTS review text;

-- Create traffic alerts table
CREATE TABLE IF NOT EXISTS traffic_alerts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  route_origin text NOT NULL,
  route_destination text NOT NULL,
  alert_type text NOT NULL,
  severity text NOT NULL DEFAULT 'medium',
  message text NOT NULL,
  is_active boolean DEFAULT true,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Create route preferences table
CREATE TABLE IF NOT EXISTS route_preferences (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  origin_address text NOT NULL,
  destination_address text NOT NULL,
  preferred_departure_time time,
  avoid_tolls boolean DEFAULT false,
  avoid_highways boolean DEFAULT false,
  transport_mode text DEFAULT 'driving',
  is_default boolean DEFAULT false,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Create commute analytics table
CREATE TABLE IF NOT EXISTS commute_analytics (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  route_origin text NOT NULL,
  route_destination text NOT NULL,
  travel_date date NOT NULL,
  departure_time time NOT NULL,
  arrival_time time,
  duration_minutes integer,
  distance_km numeric,
  cost_amount numeric,
  transport_mode text NOT NULL,
  weather_conditions text,
  traffic_level text,
  created_at timestamp with time zone DEFAULT now()
);

-- Create rideshare chat messages table
CREATE TABLE IF NOT EXISTS rideshare_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  contact_id uuid NOT NULL,
  sender_user_id uuid NOT NULL,
  message text NOT NULL,
  created_at timestamp with time zone DEFAULT now(),
  FOREIGN KEY (contact_id) REFERENCES rideshare_contacts(id) ON DELETE CASCADE
);

-- Enable RLS on new tables
ALTER TABLE traffic_alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE route_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE commute_analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE rideshare_messages ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for traffic_alerts
CREATE POLICY "Users can view their own traffic alerts" ON traffic_alerts
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own traffic alerts" ON traffic_alerts
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own traffic alerts" ON traffic_alerts
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own traffic alerts" ON traffic_alerts
  FOR DELETE USING (auth.uid() = user_id);

-- Create RLS policies for route_preferences
CREATE POLICY "Users can view their own route preferences" ON route_preferences
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own route preferences" ON route_preferences
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own route preferences" ON route_preferences
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own route preferences" ON route_preferences
  FOR DELETE USING (auth.uid() = user_id);

-- Create RLS policies for commute_analytics
CREATE POLICY "Users can view their own commute analytics" ON commute_analytics
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own commute analytics" ON commute_analytics
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Create RLS policies for rideshare_messages
CREATE POLICY "Users can view messages in their contacts" ON rideshare_messages
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM rideshare_contacts rc 
      WHERE rc.id = contact_id 
      AND (rc.requester_user_id = auth.uid() OR 
           EXISTS (SELECT 1 FROM rideshare_offers ro WHERE ro.id = rc.offer_id AND ro.user_id = auth.uid()))
    )
  );

CREATE POLICY "Users can create messages in their contacts" ON rideshare_messages
  FOR INSERT WITH CHECK (
    auth.uid() = sender_user_id AND
    EXISTS (
      SELECT 1 FROM rideshare_contacts rc 
      WHERE rc.id = contact_id 
      AND (rc.requester_user_id = auth.uid() OR 
           EXISTS (SELECT 1 FROM rideshare_offers ro WHERE ro.id = rc.offer_id AND ro.user_id = auth.uid()))
    )
  );
