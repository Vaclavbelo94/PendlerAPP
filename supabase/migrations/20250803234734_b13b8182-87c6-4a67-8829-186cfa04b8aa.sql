-- Fáze 3: Dokumentový systém - Storage buckets a policies

-- Vytvoření storage buckets pro DHL dokumenty
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES 
  (
    'dhl-documents', 
    'dhl-documents', 
    false,
    10485760, -- 10MB limit
    ARRAY['application/pdf', 'image/jpeg', 'image/png', 'image/jpg', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']
  );

-- Storage policies pro DHL dokumenty
CREATE POLICY "DHL employees can view their own documents" 
ON storage.objects 
FOR SELECT 
USING (
  bucket_id = 'dhl-documents' AND 
  auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "DHL employees can upload their own documents" 
ON storage.objects 
FOR INSERT 
WITH CHECK (
  bucket_id = 'dhl-documents' AND 
  auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "DHL employees can update their own documents" 
ON storage.objects 
FOR UPDATE 
USING (
  bucket_id = 'dhl-documents' AND 
  auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "DHL employees can delete their own documents" 
ON storage.objects 
FOR DELETE 
USING (
  bucket_id = 'dhl-documents' AND 
  auth.uid()::text = (storage.foldername(name))[1]
);

-- Admins mohou vidět všechny dokumenty
CREATE POLICY "Admins can view all DHL documents" 
ON storage.objects 
FOR SELECT 
USING (
  bucket_id = 'dhl-documents' AND
  EXISTS (
    SELECT 1 FROM profiles 
    WHERE id = auth.uid() AND is_admin = true
  )
);

-- Přidání indexů pro lepší výkon dokumentových tabulek
CREATE INDEX IF NOT EXISTS idx_dhl_document_storage_expiry ON public.dhl_document_storage(expiry_date) WHERE expiry_date IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_dhl_document_storage_verified ON public.dhl_document_storage(is_verified);
CREATE INDEX IF NOT EXISTS idx_dhl_document_storage_tags ON public.dhl_document_storage USING GIN(tags);

-- Tabulka pro připomínky dokumentů
CREATE TABLE public.dhl_document_reminders (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  document_id UUID NOT NULL REFERENCES dhl_document_storage(id) ON DELETE CASCADE,
  reminder_type TEXT NOT NULL DEFAULT 'expiry' CHECK (reminder_type IN ('expiry', 'renewal', 'submission', 'review')),
  reminder_date DATE NOT NULL,
  is_sent BOOLEAN DEFAULT false,
  is_dismissed BOOLEAN DEFAULT false,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS na reminder tabulce
ALTER TABLE public.dhl_document_reminders ENABLE ROW LEVEL SECURITY;

-- RLS policies pro reminders
CREATE POLICY "DHL employees can manage their document reminders" 
ON public.dhl_document_reminders 
FOR ALL 
USING (auth.uid() = user_id OR EXISTS (
  SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = true
))
WITH CHECK (auth.uid() = user_id);

-- Triggery pro reminders
CREATE TRIGGER update_dhl_document_reminders_updated_at
  BEFORE UPDATE ON public.dhl_document_reminders
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Indexy pro reminders
CREATE INDEX idx_dhl_document_reminders_user_date ON public.dhl_document_reminders(user_id, reminder_date);
CREATE INDEX idx_dhl_document_reminders_pending ON public.dhl_document_reminders(reminder_date) WHERE is_sent = false AND is_dismissed = false;

-- Enable realtime pro dokumentové tabulky
ALTER PUBLICATION supabase_realtime ADD TABLE public.dhl_document_storage;
ALTER PUBLICATION supabase_realtime ADD TABLE public.dhl_document_reminders;