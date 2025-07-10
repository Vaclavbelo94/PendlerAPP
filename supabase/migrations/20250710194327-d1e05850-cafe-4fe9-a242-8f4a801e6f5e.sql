-- Fix DHL assignment creation by making dhl_work_group_id nullable
-- This allows individual assignments without a work group
ALTER TABLE public.user_dhl_assignments 
ALTER COLUMN dhl_work_group_id DROP NOT NULL;