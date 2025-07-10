-- Add missing foreign key between user_dhl_assignments.user_id and profiles.id
ALTER TABLE public.user_dhl_assignments 
ADD CONSTRAINT fk_user_dhl_assignments_user_id 
FOREIGN KEY (user_id) REFERENCES public.profiles(id) ON DELETE CASCADE;