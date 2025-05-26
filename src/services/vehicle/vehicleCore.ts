
import { supabase } from '@/integrations/supabase/client';
import { VehicleData } from '@/types/vehicle';

export const fetchVehicles = async (userId: string): Promise<VehicleData[]> => {
  const { data, error } = await supabase
    .from('vehicles')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });
  
  if (error) throw error;
  return data || [];
};

export const fetchVehicleById = async (vehicleId: string): Promise<VehicleData | null> => {
  const { data, error } = await supabase
    .from('vehicles')
    .select('*')
    .eq('id', vehicleId)
    .maybeSingle();
  
  if (error) throw error;
  return data;
};

export const saveVehicle = async (vehicleData: Partial<VehicleData>): Promise<VehicleData | null> => {
  if (vehicleData.id) {
    // Update existing vehicle
    const { data, error } = await supabase
      .from('vehicles')
      .update(vehicleData)
      .eq('id', vehicleData.id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  } else {
    // Create new vehicle - fix the array issue by passing single object
    const { data, error } = await supabase
      .from('vehicles')
      .insert(vehicleData as any) // Cast to any to handle Partial types
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }
};

export const deleteVehicle = async (vehicleId: string): Promise<boolean> => {
  const { error } = await supabase
    .from('vehicles')
    .delete()
    .eq('id', vehicleId);
  
  if (error) throw error;
  return true;
};
