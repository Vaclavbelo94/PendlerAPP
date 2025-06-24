
-- Create table for user work data
CREATE TABLE public.user_work_data (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  hourly_wage DECIMAL(10,2),
  phone_number TEXT,
  phone_country_code TEXT DEFAULT 'CZ',
  workplace_location TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id)
);

-- Enable Row Level Security
ALTER TABLE public.user_work_data ENABLE ROW LEVEL SECURITY;

-- Create policies for user work data
CREATE POLICY "Users can view their own work data" 
  ON public.user_work_data 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own work data" 
  ON public.user_work_data 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own work data" 
  ON public.user_work_data 
  FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own work data" 
  ON public.user_work_data 
  FOR DELETE 
  USING (auth.uid() = user_id);

-- Create function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_user_work_data_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_user_work_data_updated_at
  BEFORE UPDATE ON public.user_work_data
  FOR EACH ROW EXECUTE FUNCTION public.update_user_work_data_updated_at();
