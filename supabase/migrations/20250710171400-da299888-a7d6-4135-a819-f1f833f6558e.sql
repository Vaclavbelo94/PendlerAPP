-- Phase 1: Update database structure for annual rotational system

-- Add calendar_week and annual_plan fields to dhl_shift_schedules
ALTER TABLE public.dhl_shift_schedules 
ADD COLUMN calendar_week INTEGER CHECK (calendar_week >= 1 AND calendar_week <= 53),
ADD COLUMN annual_plan BOOLEAN DEFAULT false,
ADD COLUMN woche_group INTEGER CHECK (woche_group >= 1 AND woche_group <= 15);

-- Create index for efficient querying by calendar week and position
CREATE INDEX idx_dhl_shift_schedules_calendar_week ON public.dhl_shift_schedules(position_id, calendar_week, woche_group);
CREATE INDEX idx_dhl_shift_schedules_annual ON public.dhl_shift_schedules(annual_plan, calendar_week) WHERE annual_plan = true;

-- Update existing records to mark them as non-annual plans
UPDATE public.dhl_shift_schedules SET annual_plan = false WHERE annual_plan IS NULL;