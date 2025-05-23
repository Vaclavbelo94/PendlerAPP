import { supabase } from '@/integrations/supabase/client';
import { VehicleData, ServiceRecord, FuelRecord, InsuranceRecord, DocumentRecord } from '@/types/vehicle';
import { toast } from 'sonner';

// Vozidla
export const fetchVehicles = async (userId: string) => {
  try {
    const { data, error } = await supabase
      .from('vehicles')
      .select('*')
      .eq('user_id', userId);
      
    if (error) throw error;
    return data as VehicleData[];
  } catch (error) {
    console.error('Chyba při načítání vozidel:', error);
    toast.error('Nepodařilo se načíst vozidla');
    return [] as VehicleData[];
  }
};

export const fetchVehicleById = async (id: string) => {
  try {
    const { data, error } = await supabase
      .from('vehicles')
      .select('*')
      .eq('id', id)
      .single();
      
    if (error) throw error;
    return data as VehicleData;
  } catch (error) {
    console.error('Chyba při načítání vozidla:', error);
    toast.error('Nepodařilo se načíst vozidlo');
    return null;
  }
};

export const saveVehicle = async (vehicle: VehicleData) => {
  try {
    const { id, ...vehicleData } = vehicle;
    
    if (id) {
      // Aktualizace
      const { data, error } = await supabase
        .from('vehicles')
        .update({ ...vehicleData, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select();
        
      if (error) throw error;
      toast.success('Vozidlo bylo aktualizováno');
      return data?.[0] as VehicleData;
    } else {
      // Vytvoření nového
      const { data, error } = await supabase
        .from('vehicles')
        .insert({ ...vehicleData, created_at: new Date().toISOString() })
        .select();
        
      if (error) throw error;
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
    const { error } = await supabase
      .from('vehicles')
      .delete()
      .eq('id', id);
      
    if (error) throw error;
    toast.success('Vozidlo bylo odstraněno');
    return true;
  } catch (error) {
    console.error('Chyba při odstraňování vozidla:', error);
    toast.error('Nepodařilo se odstranit vozidlo');
    return false;
  }
};

// Servisní záznamy
export const fetchServiceRecords = async (vehicleId: string) => {
  try {
    const { data, error } = await supabase
      .from('service_records')
      .select('*')
      .eq('vehicle_id', vehicleId)
      .order('service_date', { ascending: false });
      
    if (error) throw error;
    return data as ServiceRecord[];
  } catch (error) {
    console.error('Chyba při načítání servisních záznamů:', error);
    toast.error('Nepodařilo se načíst servisní záznamy');
    return [] as ServiceRecord[];
  }
};

export const saveServiceRecord = async (record: ServiceRecord) => {
  try {
    const { id, ...recordData } = record;
    
    if (id) {
      const { data, error } = await supabase
        .from('service_records')
        .update({ ...recordData, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select();
        
      if (error) throw error;
      toast.success('Servisní záznam byl aktualizován');
      return data?.[0] as ServiceRecord;
    } else {
      const { data, error } = await supabase
        .from('service_records')
        .insert({ ...recordData, created_at: new Date().toISOString() })
        .select();
        
      if (error) throw error;
      toast.success('Servisní záznam byl vytvořen');
      return data?.[0] as ServiceRecord;
    }
  } catch (error) {
    console.error('Chyba při ukládání servisního záznamu:', error);
    toast.error('Nepodařilo se uložit servisní záznam');
    return null;
  }
};

export const deleteServiceRecord = async (id: string) => {
  try {
    const { error } = await supabase
      .from('service_records')
      .delete()
      .eq('id', id);
      
    if (error) throw error;
    toast.success('Servisní záznam byl odstraněn');
    return true;
  } catch (error) {
    console.error('Chyba při odstraňování servisního záznamu:', error);
    toast.error('Nepodařilo se odstranit servisní záznam');
    return false;
  }
};

// Záznamy o tankování
export const fetchFuelRecords = async (vehicleId: string) => {
  try {
    const { data, error } = await supabase
      .from('fuel_records')
      .select('*')
      .eq('vehicle_id', vehicleId)
      .order('date', { ascending: false });
      
    if (error) throw error;
    return data as FuelRecord[];
  } catch (error) {
    console.error('Chyba při načítání záznamů o tankování:', error);
    toast.error('Nepodařilo se načíst záznamy o tankování');
    return [] as FuelRecord[];
  }
};

export const saveFuelRecord = async (record: FuelRecord) => {
  try {
    const { id, ...recordData } = record;
    
    if (id) {
      const { data, error } = await supabase
        .from('fuel_records')
        .update({ ...recordData, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select();
        
      if (error) throw error;
      toast.success('Záznam o tankování byl aktualizován');
      return data?.[0] as FuelRecord;
    } else {
      const { data, error } = await supabase
        .from('fuel_records')
        .insert({ ...recordData, created_at: new Date().toISOString() })
        .select();
        
      if (error) throw error;
      toast.success('Záznam o tankování byl vytvořen');
      return data?.[0] as FuelRecord;
    }
  } catch (error) {
    console.error('Chyba při ukládání záznamu o tankování:', error);
    toast.error('Nepodařilo se uložit záznam o tankování');
    return null;
  }
};

export const deleteFuelRecord = async (id: string) => {
  try {
    const { error } = await supabase
      .from('fuel_records')
      .delete()
      .eq('id', id);
      
    if (error) throw error;
    toast.success('Záznam o tankování byl odstraněn');
    return true;
  } catch (error) {
    console.error('Chyba při odstraňování záznamu o tankování:', error);
    toast.error('Nepodařilo se odstranit záznam o tankování');
    return false;
  }
};

// Pojištění
export const fetchInsurance = async (vehicleId: string) => {
  try {
    const { data, error } = await supabase
      .from('insurance_records')
      .select('*')
      .eq('vehicle_id', vehicleId)
      .order('valid_until', { ascending: false });
      
    if (error) throw error;
    return data as InsuranceRecord[];
  } catch (error) {
    console.error('Chyba při načítání pojištění:', error);
    toast.error('Nepodařilo se načíst pojištění');
    return [] as InsuranceRecord[];
  }
};

export const saveInsurance = async (record: InsuranceRecord) => {
  try {
    const { id, ...recordData } = record;
    
    if (id) {
      const { data, error } = await supabase
        .from('insurance_records')
        .update({ ...recordData, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select();
        
      if (error) throw error;
      toast.success('Pojištění bylo aktualizováno');
      return data?.[0] as InsuranceRecord;
    } else {
      const { data, error } = await supabase
        .from('insurance_records')
        .insert({ ...recordData, created_at: new Date().toISOString() })
        .select();
        
      if (error) throw error;
      toast.success('Pojištění bylo vytvořeno');
      return data?.[0] as InsuranceRecord;
    }
  } catch (error) {
    console.error('Chyba při ukládání pojištění:', error);
    toast.error('Nepodařilo se uložit pojištění');
    return null;
  }
};

export const deleteInsurance = async (id: string) => {
  try {
    const { error } = await supabase
      .from('insurance_records')
      .delete()
      .eq('id', id);
      
    if (error) throw error;
    toast.success('Pojištění bylo odstraněno');
    return true;
  } catch (error) {
    console.error('Chyba při odstraňování pojištění:', error);
    toast.error('Nepodařilo se odstranit pojištění');
    return false;
  }
};

// Dokumenty
export const fetchDocuments = async (vehicleId: string) => {
  try {
    const { data, error } = await supabase
      .from('vehicle_documents')
      .select('*')
      .eq('vehicle_id', vehicleId)
      .order('name');
      
    if (error) throw error;
    return data as DocumentRecord[];
  } catch (error) {
    console.error('Chyba při načítání dokumentů:', error);
    toast.error('Nepodařilo se načíst dokumenty');
    return [] as DocumentRecord[];
  }
};

export const saveDocument = async (document: DocumentRecord) => {
  try {
    const { id, ...docData } = document;
    
    if (id) {
      const { data, error } = await supabase
        .from('vehicle_documents')
        .update({ ...docData, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select();
        
      if (error) throw error;
      toast.success('Dokument byl aktualizován');
      return data?.[0] as DocumentRecord;
    } else {
      const { data, error } = await supabase
        .from('vehicle_documents')
        .insert({ ...docData, created_at: new Date().toISOString() })
        .select();
        
      if (error) throw error;
      toast.success('Dokument byl vytvořen');
      return data?.[0] as DocumentRecord;
    }
  } catch (error) {
    console.error('Chyba při ukládání dokumentu:', error);
    toast.error('Nepodařilo se uložit dokument');
    return null;
  }
};

export const deleteDocument = async (id: string) => {
  try {
    const { error } = await supabase
      .from('vehicle_documents')
      .delete()
      .eq('id', id);
      
    if (error) throw error;
    toast.success('Dokument byl odstraněn');
    return true;
  } catch (error) {
    console.error('Chyba při odstraňování dokumentu:', error);
    toast.error('Nepodařilo se odstranit dokument');
    return false;
  }
};

// Pomocná funkce pro výpočet spotřeby
export const calculateConsumption = (fuelRecords: FuelRecord[]) => {
  if (fuelRecords.length < 2) return { averageConsumption: 0, totalCost: 0, totalDistance: 0 };
  
  const sortedRecords = [...fuelRecords].sort((a, b) => 
    new Date(a.date).getTime() - new Date(b.date).getTime()
  );
  
  let totalFuel = 0;
  let totalCost = 0;
  let totalDistance = 0;
  
  for (let i = 1; i < sortedRecords.length; i++) {
    const currentMileage = parseFloat(sortedRecords[i].mileage);
    const prevMileage = parseFloat(sortedRecords[i-1].mileage);
    
    if (!isNaN(currentMileage) && !isNaN(prevMileage) && currentMileage > prevMileage) {
      const distance = currentMileage - prevMileage;
      totalDistance += distance;
      totalFuel += sortedRecords[i-1].amount_liters;
      totalCost += sortedRecords[i-1].total_cost;
    }
  }
  
  const averageConsumption = totalDistance > 0 ? (totalFuel / totalDistance) * 100 : 0;
  
  return {
    averageConsumption: parseFloat(averageConsumption.toFixed(2)),
    totalCost: parseFloat(totalCost.toFixed(2)),
    totalDistance: parseFloat(totalDistance.toFixed(2))
  };
};
