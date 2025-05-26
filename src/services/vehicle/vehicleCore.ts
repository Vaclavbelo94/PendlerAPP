
import { supabase } from '@/integrations/supabase/client';
import { VehicleData } from '@/types/vehicle';

export const fetchVehicles = async (userId: string): Promise<VehicleData[]> => {
  if (!userId) {
    throw new Error('User ID is required');
  }

  console.log('Fetching vehicles for user:', userId);
  
  const { data, error } = await supabase
    .from('vehicles')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });
  
  if (error) {
    console.error('Supabase error:', error);
    throw new Error(`Failed to fetch vehicles: ${error.message}`);
  }
  
  console.log('Fetched vehicles:', data?.length || 0);
  return data || [];
};

export const fetchVehicleById = async (vehicleId: string): Promise<VehicleData | null> => {
  if (!vehicleId) {
    throw new Error('Vehicle ID is required');
  }

  console.log('Fetching vehicle by ID:', vehicleId);
  
  const { data, error } = await supabase
    .from('vehicles')
    .select('*')
    .eq('id', vehicleId)
    .maybeSingle();
  
  if (error) {
    console.error('Supabase error:', error);
    throw new Error(`Failed to fetch vehicle: ${error.message}`);
  }
  
  return data;
};

export const saveVehicle = async (vehicleData: Partial<VehicleData>): Promise<VehicleData | null> => {
  if (!vehicleData.user_id && !vehicleData.id) {
    throw new Error('User ID is required for new vehicles');
  }

  console.log('Saving vehicle:', vehicleData.id ? 'update' : 'create');

  try {
    if (vehicleData.id) {
      // Update existing vehicle
      const { data, error } = await supabase
        .from('vehicles')
        .update(vehicleData)
        .eq('id', vehicleData.id)
        .select()
        .single();
      
      if (error) {
        console.error('Update error:', error);
        throw new Error(`Failed to update vehicle: ${error.message}`);
      }
      
      console.log('Vehicle updated successfully');
      return data;
    } else {
      // Create new vehicle
      const { data, error } = await supabase
        .from('vehicles')
        .insert(vehicleData as any)
        .select()
        .single();
      
      if (error) {
        console.error('Insert error:', error);
        throw new Error(`Failed to create vehicle: ${error.message}`);
      }
      
      console.log('Vehicle created successfully');
      return data;
    }
  } catch (error: any) {
    console.error('Save vehicle error:', error);
    throw error;
  }
};

export const deleteVehicle = async (vehicleId: string): Promise<boolean> => {
  if (!vehicleId) {
    throw new Error('Vehicle ID is required');
  }

  console.log('Deleting vehicle:', vehicleId);
  
  const { error } = await supabase
    .from('vehicles')
    .delete()
    .eq('id', vehicleId);
  
  if (error) {
    console.error('Delete error:', error);
    throw new Error(`Failed to delete vehicle: ${error.message}`);
  }
  
  console.log('Vehicle deleted successfully');
  return true;
};
