-- DHL Employee Module - Fáze 1: Databázové schéma
-- Tabulka pro rozšířené profily DHL zaměstnanců
CREATE TABLE public.dhl_employee_profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  employee_number TEXT,
  department TEXT,
  team_leader_id UUID REFERENCES profiles(id),
  hire_date DATE,
  emergency_contact JSONB,
  preferences JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id)
);

-- Tabulka pro docházku a časové záznamy  
CREATE TABLE public.dhl_time_entries (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  clock_in_time TIMESTAMP WITH TIME ZONE,
  clock_out_time TIMESTAMP WITH TIME ZONE,
  break_start TIMESTAMP WITH TIME ZONE,
  break_end TIMESTAMP WITH TIME ZONE,
  break_duration_minutes INTEGER DEFAULT 0,
  total_hours DECIMAL(4,2),
  overtime_hours DECIMAL(4,2) DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'completed', 'cancelled')),
  notes TEXT,
  location JSONB,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Tabulka pro týmové zprávy a komunikaci
CREATE TABLE public.dhl_team_messages (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  sender_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  team_id UUID REFERENCES dhl_work_groups(id),
  message_type TEXT NOT NULL DEFAULT 'text' CHECK (message_type IN ('text', 'shift_swap', 'announcement', 'emergency')),
  content TEXT NOT NULL,
  metadata JSONB DEFAULT '{}',
  is_read BOOLEAN DEFAULT false,
  reply_to_id UUID REFERENCES dhl_team_messages(id),
  expires_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Tabulka pro správu dokumentů
CREATE TABLE public.dhl_document_storage (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  document_type TEXT NOT NULL CHECK (document_type IN ('arbeitsvertrag', 'anmeldung', 'insurance', 'payslip', 'tax_document', 'other')),
  title TEXT NOT NULL,
  description TEXT,
  file_path TEXT,
  file_size INTEGER,
  mime_type TEXT,
  expiry_date DATE,
  is_verified BOOLEAN DEFAULT false,
  tags TEXT[],
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Tabulka pro záznamy cest do práce
CREATE TABLE public.dhl_commute_records (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  origin_address TEXT NOT NULL,
  destination_address TEXT NOT NULL,
  distance_km DECIMAL(6,2),
  duration_minutes INTEGER,
  transport_mode TEXT NOT NULL DEFAULT 'car' CHECK (transport_mode IN ('car', 'public_transport', 'bike', 'walk', 'carpool')),
  cost_amount DECIMAL(8,2),
  fuel_consumption DECIMAL(5,2),
  is_business_trip BOOLEAN DEFAULT true,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Tabulka pro výměny směn
CREATE TABLE public.dhl_shift_swaps (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  requester_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  target_user_id UUID REFERENCES profiles(id),
  original_shift_id UUID REFERENCES shifts(id),
  requested_shift_id UUID REFERENCES shifts(id),
  swap_type TEXT NOT NULL DEFAULT 'exchange' CHECK (swap_type IN ('exchange', 'cover', 'trade')),
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'completed', 'cancelled')),
  reason TEXT,
  admin_approved_by UUID REFERENCES profiles(id),
  approved_at TIMESTAMP WITH TIME ZONE,
  expires_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS na všech tabulkách
ALTER TABLE public.dhl_employee_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.dhl_time_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.dhl_team_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.dhl_document_storage ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.dhl_commute_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.dhl_shift_swaps ENABLE ROW LEVEL SECURITY;

-- RLS policies pro dhl_employee_profiles
CREATE POLICY "DHL employees can view their own profile" 
ON public.dhl_employee_profiles 
FOR SELECT 
USING (auth.uid() = user_id OR get_current_user_admin_status() = true);

CREATE POLICY "DHL employees can update their own profile" 
ON public.dhl_employee_profiles 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "DHL employees can create their own profile" 
ON public.dhl_employee_profiles 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- RLS policies pro dhl_time_entries
CREATE POLICY "DHL employees can manage their time entries" 
ON public.dhl_time_entries 
FOR ALL 
USING (auth.uid() = user_id OR get_current_user_admin_status() = true)
WITH CHECK (auth.uid() = user_id);

-- RLS policies pro dhl_team_messages
CREATE POLICY "DHL employees can view team messages" 
ON public.dhl_team_messages 
FOR SELECT 
USING (get_current_user_company() = 'dhl' OR get_current_user_admin_status() = true);

CREATE POLICY "DHL employees can send team messages" 
ON public.dhl_team_messages 
FOR INSERT 
WITH CHECK (auth.uid() = sender_id AND get_current_user_company() = 'dhl');

CREATE POLICY "Users can update their own messages" 
ON public.dhl_team_messages 
FOR UPDATE 
USING (auth.uid() = sender_id);

-- RLS policies pro dhl_document_storage
CREATE POLICY "DHL employees can manage their documents" 
ON public.dhl_document_storage 
FOR ALL 
USING (auth.uid() = user_id OR get_current_user_admin_status() = true)
WITH CHECK (auth.uid() = user_id);

-- RLS policies pro dhl_commute_records
CREATE POLICY "DHL employees can manage their commute records" 
ON public.dhl_commute_records 
FOR ALL 
USING (auth.uid() = user_id OR get_current_user_admin_status() = true)
WITH CHECK (auth.uid() = user_id);

-- RLS policies pro dhl_shift_swaps
CREATE POLICY "DHL employees can view shift swaps" 
ON public.dhl_shift_swaps 
FOR SELECT 
USING (auth.uid() = requester_id OR auth.uid() = target_user_id OR get_current_user_admin_status() = true);

CREATE POLICY "DHL employees can create shift swap requests" 
ON public.dhl_shift_swaps 
FOR INSERT 
WITH CHECK (auth.uid() = requester_id AND get_current_user_company() = 'dhl');

CREATE POLICY "DHL employees can update their shift swaps" 
ON public.dhl_shift_swaps 
FOR UPDATE 
USING (auth.uid() = requester_id OR auth.uid() = target_user_id OR get_current_user_admin_status() = true);

-- Indexy pro výkon
CREATE INDEX idx_dhl_employee_profiles_user_id ON public.dhl_employee_profiles(user_id);
CREATE INDEX idx_dhl_time_entries_user_date ON public.dhl_time_entries(user_id, date);
CREATE INDEX idx_dhl_team_messages_team_created ON public.dhl_team_messages(team_id, created_at);
CREATE INDEX idx_dhl_document_storage_user_type ON public.dhl_document_storage(user_id, document_type);
CREATE INDEX idx_dhl_commute_records_user_date ON public.dhl_commute_records(user_id, date);
CREATE INDEX idx_dhl_shift_swaps_status ON public.dhl_shift_swaps(status, created_at);

-- Triggery pro updated_at
CREATE TRIGGER update_dhl_employee_profiles_updated_at
  BEFORE UPDATE ON public.dhl_employee_profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_dhl_time_entries_updated_at
  BEFORE UPDATE ON public.dhl_time_entries
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_dhl_team_messages_updated_at
  BEFORE UPDATE ON public.dhl_team_messages
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_dhl_document_storage_updated_at
  BEFORE UPDATE ON public.dhl_document_storage
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_dhl_commute_records_updated_at
  BEFORE UPDATE ON public.dhl_commute_records
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_dhl_shift_swaps_updated_at
  BEFORE UPDATE ON public.dhl_shift_swaps
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();