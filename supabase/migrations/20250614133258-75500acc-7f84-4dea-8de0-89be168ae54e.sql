
-- Create table for vehicle inspections (STK)
CREATE TABLE public.vehicle_inspections (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  vehicle_id UUID NOT NULL,
  inspection_date TEXT NOT NULL,
  next_inspection_date TEXT NOT NULL,
  result TEXT NOT NULL,
  station TEXT NOT NULL,
  cost TEXT NOT NULL,
  mileage TEXT NOT NULL,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create table for highway vignettes (dálniční známky)
CREATE TABLE public.highway_vignettes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  vehicle_id UUID NOT NULL,
  country TEXT NOT NULL,
  vignette_type TEXT NOT NULL,
  valid_from TEXT NOT NULL,
  valid_until TEXT NOT NULL,
  cost TEXT NOT NULL,
  purchase_location TEXT,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add Row Level Security (RLS) to ensure users can only see their own records
ALTER TABLE public.vehicle_inspections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.highway_vignettes ENABLE ROW LEVEL SECURITY;

-- Create policies for vehicle_inspections (accessible through vehicle ownership)
CREATE POLICY "Users can view inspections for their vehicles" 
  ON public.vehicle_inspections 
  FOR SELECT 
  USING (
    vehicle_id IN (
      SELECT id FROM public.vehicles WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Users can create inspections for their vehicles" 
  ON public.vehicle_inspections 
  FOR INSERT 
  WITH CHECK (
    vehicle_id IN (
      SELECT id FROM public.vehicles WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update inspections for their vehicles" 
  ON public.vehicle_inspections 
  FOR UPDATE 
  USING (
    vehicle_id IN (
      SELECT id FROM public.vehicles WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete inspections for their vehicles" 
  ON public.vehicle_inspections 
  FOR DELETE 
  USING (
    vehicle_id IN (
      SELECT id FROM public.vehicles WHERE user_id = auth.uid()
    )
  );

-- Create policies for highway_vignettes (accessible through vehicle ownership)
CREATE POLICY "Users can view vignettes for their vehicles" 
  ON public.highway_vignettes 
  FOR SELECT 
  USING (
    vehicle_id IN (
      SELECT id FROM public.vehicles WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Users can create vignettes for their vehicles" 
  ON public.highway_vignettes 
  FOR INSERT 
  WITH CHECK (
    vehicle_id IN (
      SELECT id FROM public.vehicles WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update vignettes for their vehicles" 
  ON public.highway_vignettes 
  FOR UPDATE 
  USING (
    vehicle_id IN (
      SELECT id FROM public.vehicles WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete vignettes for their vehicles" 
  ON public.highway_vignettes 
  FOR DELETE 
  USING (
    vehicle_id IN (
      SELECT id FROM public.vehicles WHERE user_id = auth.uid()
    )
  );
