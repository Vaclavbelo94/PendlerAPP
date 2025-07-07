-- Create assisted submissions table
CREATE TABLE public.assisted_submissions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  form_code TEXT,
  user_data JSONB NOT NULL,
  calculation_result JSONB NOT NULL,
  contact_info JSONB NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'completed', 'cancelled')),
  priority TEXT NOT NULL DEFAULT 'standard' CHECK (priority IN ('standard', 'high', 'urgent')),
  admin_notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.assisted_submissions ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can create their own submissions" 
ON public.assisted_submissions 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view their own submissions" 
ON public.assisted_submissions 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all submissions" 
ON public.assisted_submissions 
FOR SELECT 
USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND is_admin = true));

CREATE POLICY "Admins can update all submissions" 
ON public.assisted_submissions 
FOR UPDATE 
USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND is_admin = true));

-- Create updated_at trigger
CREATE TRIGGER update_assisted_submissions_updated_at
BEFORE UPDATE ON public.assisted_submissions
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create indexes for performance
CREATE INDEX idx_assisted_submissions_user_id ON public.assisted_submissions(user_id);
CREATE INDEX idx_assisted_submissions_status ON public.assisted_submissions(status);
CREATE INDEX idx_assisted_submissions_created_at ON public.assisted_submissions(created_at DESC);