-- Create real-time traffic data table
CREATE TABLE public.real_time_traffic_data (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  route_origin TEXT NOT NULL,
  route_destination TEXT NOT NULL,
  current_duration INTEGER, -- in minutes
  normal_duration INTEGER, -- in minutes 
  traffic_level TEXT NOT NULL DEFAULT 'normal',
  incidents JSONB DEFAULT '[]'::jsonb,
  weather_impact JSONB DEFAULT '{}'::jsonb,
  last_updated TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.real_time_traffic_data ENABLE ROW LEVEL SECURITY;

-- Create traffic notifications table
CREATE TABLE public.traffic_notifications (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  notification_type TEXT NOT NULL, -- 'departure_reminder', 'traffic_alert', 'route_change'
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  route_data JSONB DEFAULT '{}'::jsonb,
  is_read BOOLEAN NOT NULL DEFAULT false,
  scheduled_for TIMESTAMP WITH TIME ZONE,
  sent_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.traffic_notifications ENABLE ROW LEVEL SECURITY;

-- Create smart alerts table
CREATE TABLE public.smart_alerts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  alert_type TEXT NOT NULL, -- 'morning_briefing', 'departure_time', 'traffic_change'
  route_origin TEXT NOT NULL,
  route_destination TEXT NOT NULL,
  alert_time TIME WITHOUT TIME ZONE NOT NULL,
  days_of_week INTEGER[] NOT NULL DEFAULT '{1,2,3,4,5}', -- Mon-Fri
  is_active BOOLEAN NOT NULL DEFAULT true,
  settings JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.smart_alerts ENABLE ROW LEVEL SECURITY;

-- Create route predictions table
CREATE TABLE public.route_predictions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  route_origin TEXT NOT NULL,
  route_destination TEXT NOT NULL,
  prediction_date DATE NOT NULL,
  hour_of_day INTEGER NOT NULL, -- 0-23
  predicted_duration INTEGER NOT NULL, -- in minutes
  confidence_score NUMERIC(3,2) DEFAULT 0.85,
  historical_data JSONB DEFAULT '{}'::jsonb,
  weather_factors JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.route_predictions ENABLE ROW LEVEL SECURITY;

-- RLS Policies for real_time_traffic_data
CREATE POLICY "Users can manage their own traffic data" 
ON public.real_time_traffic_data 
FOR ALL 
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- RLS Policies for traffic_notifications
CREATE POLICY "Users can manage their own notifications" 
ON public.traffic_notifications 
FOR ALL 
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- RLS Policies for smart_alerts
CREATE POLICY "Users can manage their own smart alerts" 
ON public.smart_alerts 
FOR ALL 
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- RLS Policies for route_predictions
CREATE POLICY "Users can view their own route predictions" 
ON public.route_predictions 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "System can insert route predictions" 
ON public.route_predictions 
FOR INSERT 
WITH CHECK (true);

-- Create triggers for updated_at columns
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_real_time_traffic_data_updated_at
    BEFORE UPDATE ON public.real_time_traffic_data
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_traffic_notifications_updated_at
    BEFORE UPDATE ON public.traffic_notifications
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_smart_alerts_updated_at
    BEFORE UPDATE ON public.smart_alerts
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

-- Create indexes for better performance
CREATE INDEX idx_real_time_traffic_data_user_route ON public.real_time_traffic_data(user_id, route_origin, route_destination);
CREATE INDEX idx_traffic_notifications_user_unread ON public.traffic_notifications(user_id, is_read) WHERE is_read = false;
CREATE INDEX idx_smart_alerts_user_active ON public.smart_alerts(user_id, is_active) WHERE is_active = true;
CREATE INDEX idx_route_predictions_user_route_date ON public.route_predictions(user_id, route_origin, route_destination, prediction_date);