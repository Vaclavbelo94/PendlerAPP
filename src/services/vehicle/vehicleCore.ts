
import { supabase } from '@/integrations/supabase/client';
import { VehicleData } from '@/types/vehicle';
import { toast } from 'sonner';

export const fetchVehicles = async (userId: string) => {
  try {
    console.log("Fetching vehicles for user:", userId);
    const { data, error } = await supabase
      .from('vehicles')
      .select('*')
      .eq('user_id', userId);
      
    if (error) {
      console.error("Error fetching vehicles:", error);
      throw error;
    }
    
    console.log("Fetched vehicles:", data?.length || 0);
    return data as VehicleData[];
  } catch (error) {
    console.error('Chyba při načítání vozidel:', error);
    toast.error('Nepodařilo se načíst vozidla');
    return [] as VehicleData[];
  }
};

export const fetchVehicleById = async (id: string) => {
  try {
    console.log("Fetching vehicle by ID:", id);
    const { data, error } = await supabase
      .from('vehicles')
      .select('*')
      .eq('id', id)
      .single();
      
    if (error) {
      console.error("Error fetching vehicle:", error);
      throw error;
    }
    
    console.log("Fetched vehicle:", data);
    return data as VehicleData;
  } catch (error) {
    console.error('Chyba při načítání vozidla:', error);
    toast.error('Nepodařilo se načíst vozidlo');
    return null;
  }
};

export const saveVehicle = async (vehicle: VehicleData) => {
  try {
    console.log("Saving vehicle:", vehicle);
    const { id, created_at, updated_at, ...vehicleData } = vehicle;
    
    if (id) {
      // Aktualizace
      const { data, error } = await supabase
        .from('vehicles')
        .update({ ...vehicleData, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select();
        
      if (error) {
        console.error("Error updating vehicle:", error);
        throw error;
      }
      
      console.log("Vehicle updated successfully");
      toast.success('Vozidlo bylo aktualizováno');
      return data?.[0] as VehicleData;
    } else {
      // Vytvoření nového
      if (!vehicleData.user_id) {
        throw new Error('user_id je vyžadováno pro vytvoření nového vozidla');
      }
      
      const insertData: any = {
        user_id: vehicleData.user_id,
        brand: vehicleData.brand,
        model: vehicleData.model,
        year: vehicleData.year,
        license_plate: vehicleData.license_plate,
        vin: vehicleData.vin,
        fuel_type: vehicleData.fuel_type,
        color: vehicleData.color,
        mileage: vehicleData.mileage,
        engine: vehicleData.engine || '',
        power: vehicleData.power || '',
        transmission: vehicleData.transmission || '',
        next_inspection: vehicleData.next_inspection || '',
        last_service: vehicleData.last_service || '',
        average_consumption: vehicleData.average_consumption || '',
        purchase_price: vehicleData.purchase_price || '',
        insurance_monthly: vehicleData.insurance_monthly || '',
        tax_yearly: vehicleData.tax_yearly || '',
        last_repair_cost: vehicleData.last_repair_cost || ''
      };
      
      const { data, error } = await supabase
        .from('vehicles')
        .insert(insertData)
        .select();
        
      if (error) {
        console.error("Error creating vehicle:", error);
        throw error;
      }
      
      console.log("Vehicle created successfully");
      toast.success('Vozidlo bylo vytvořeno');
      return data?.[0] as VehicleData;
    }
  } catch (error) {
    console.error('Chyba při ukládání vozidla:', error);
    toast.error('Nepodařilo se uložit vozidlo');
    return null;
  }
};

export const deleteVehicle = async (id: string) => {
  try {
    console.log("Deleting vehicle:", id);
    const { error } = await supabase
      .from('vehicles')
      .delete()
      .eq('id', id);
      
    if (error) {
      console.error("Error deleting vehicle:", error);
      throw error;
    }
    
    console.log("Vehicle deleted successfully");
    toast.success('Vozidlo bylo odstraněno');
    return true;
  } catch (error) {
    console.error('Chyba při odstraňování vozidla:', error);
    toast.error('Nepodařilo se odstranit vozidlo');
    return false;
  }
};
