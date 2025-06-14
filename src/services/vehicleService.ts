import { ServiceRecord, FuelRecord, InsuranceRecord, DocumentRecord, InspectionRecord, VignetteRecord } from '@/types/vehicle';
import { supabase } from '@/integrations/supabase/client';

// Real Supabase implementations
export const fetchServiceRecords = async (vehicleId: string): Promise<ServiceRecord[]> => {
  if (!vehicleId) {
    throw new Error('Vehicle ID is required');
  }

  console.log('Fetching service records for vehicle:', vehicleId);
  
  const { data, error } = await supabase
    .from('service_records')
    .select('*')
    .eq('vehicle_id', vehicleId)
    .order('service_date', { ascending: false });
  
  if (error) {
    console.error('Error fetching service records:', error);
    throw new Error(`Failed to fetch service records: ${error.message}`);
  }
  
  return data || [];
};

export const saveServiceRecord = async (record: Partial<ServiceRecord>): Promise<ServiceRecord | null> => {
  try {
    if (record.id) {
      // Update existing record
      const { data, error } = await supabase
        .from('service_records')
        .update(record)
        .eq('id', record.id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    } else {
      // Create new record - validate required fields
      if (!record.vehicle_id || !record.service_date || !record.service_type || 
          !record.description || !record.mileage || !record.cost || !record.provider) {
        throw new Error('Missing required fields for service record');
      }

      const newRecord = {
        vehicle_id: record.vehicle_id,
        service_date: record.service_date,
        service_type: record.service_type,
        description: record.description,
        mileage: record.mileage,
        cost: record.cost,
        provider: record.provider
      };

      const { data, error } = await supabase
        .from('service_records')
        .insert(newRecord)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    }
  } catch (error: any) {
    console.error('Error saving service record:', error);
    throw new Error(`Failed to save service record: ${error.message}`);
  }
};

export const deleteServiceRecord = async (id: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('service_records')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    return true;
  } catch (error: any) {
    console.error('Error deleting service record:', error);
    throw new Error(`Failed to delete service record: ${error.message}`);
  }
};

export const fetchFuelRecords = async (vehicleId: string): Promise<FuelRecord[]> => {
  if (!vehicleId) {
    throw new Error('Vehicle ID is required');
  }

  console.log('Fetching fuel records for vehicle:', vehicleId);
  
  const { data, error } = await supabase
    .from('fuel_records')
    .select('*')
    .eq('vehicle_id', vehicleId)
    .order('date', { ascending: false });
  
  if (error) {
    console.error('Error fetching fuel records:', error);
    throw new Error(`Failed to fetch fuel records: ${error.message}`);
  }
  
  return data || [];
};

export const saveFuelRecord = async (record: Partial<FuelRecord>): Promise<FuelRecord | null> => {
  try {
    if (record.id) {
      // Update existing record
      const { data, error } = await supabase
        .from('fuel_records')
        .update(record)
        .eq('id', record.id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    } else {
      // Create new record - validate required fields
      if (!record.vehicle_id || !record.date || record.amount_liters === undefined || 
          record.price_per_liter === undefined || record.total_cost === undefined || 
          !record.mileage || record.full_tank === undefined || !record.station) {
        throw new Error('Missing required fields for fuel record');
      }

      const newRecord = {
        vehicle_id: record.vehicle_id,
        date: record.date,
        amount_liters: record.amount_liters,
        price_per_liter: record.price_per_liter,
        total_cost: record.total_cost,
        mileage: record.mileage,
        full_tank: record.full_tank,
        station: record.station
      };

      const { data, error } = await supabase
        .from('fuel_records')
        .insert(newRecord)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    }
  } catch (error: any) {
    console.error('Error saving fuel record:', error);
    throw new Error(`Failed to save fuel record: ${error.message}`);
  }
};

export const deleteFuelRecord = async (id: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('fuel_records')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    return true;
  } catch (error: any) {
    console.error('Error deleting fuel record:', error);
    throw new Error(`Failed to delete fuel record: ${error.message}`);
  }
};

export const fetchInsuranceRecords = async (vehicleId: string): Promise<InsuranceRecord[]> => {
  if (!vehicleId) {
    throw new Error('Vehicle ID is required');
  }

  console.log('Fetching insurance records for vehicle:', vehicleId);
  
  const { data, error } = await supabase
    .from('insurance_records')
    .select('*')
    .eq('vehicle_id', vehicleId)
    .order('valid_from', { ascending: false });
  
  if (error) {
    console.error('Error fetching insurance records:', error);
    throw new Error(`Failed to fetch insurance records: ${error.message}`);
  }
  
  return data || [];
};

export const saveInsuranceRecord = async (record: Partial<InsuranceRecord>): Promise<InsuranceRecord | null> => {
  try {
    if (record.id) {
      // Update existing record
      const { data, error } = await supabase
        .from('insurance_records')
        .update(record)
        .eq('id', record.id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    } else {
      // Create new record - validate required fields
      if (!record.vehicle_id || !record.provider || !record.policy_number || 
          !record.valid_from || !record.valid_until || !record.monthly_cost || 
          !record.coverage_type) {
        throw new Error('Missing required fields for insurance record');
      }

      const newRecord = {
        vehicle_id: record.vehicle_id,
        provider: record.provider,
        policy_number: record.policy_number,
        valid_from: record.valid_from,
        valid_until: record.valid_until,
        monthly_cost: record.monthly_cost,
        coverage_type: record.coverage_type,
        notes: record.notes || ''
      };

      const { data, error } = await supabase
        .from('insurance_records')
        .insert(newRecord)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    }
  } catch (error: any) {
    console.error('Error saving insurance record:', error);
    throw new Error(`Failed to save insurance record: ${error.message}`);
  }
};

export const deleteInsuranceRecord = async (id: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('insurance_records')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    return true;
  } catch (error: any) {
    console.error('Error deleting insurance record:', error);
    throw new Error(`Failed to delete insurance record: ${error.message}`);
  }
};

export const fetchDocuments = async (vehicleId: string): Promise<DocumentRecord[]> => {
  if (!vehicleId) {
    throw new Error('Vehicle ID is required');
  }

  console.log('Fetching documents for vehicle:', vehicleId);
  
  const { data, error } = await supabase
    .from('vehicle_documents')
    .select('*')
    .eq('vehicle_id', vehicleId)
    .order('created_at', { ascending: false });
  
  if (error) {
    console.error('Error fetching documents:', error);
    throw new Error(`Failed to fetch documents: ${error.message}`);
  }
  
  return data || [];
};

export const saveDocument = async (document: Partial<DocumentRecord>): Promise<DocumentRecord | null> => {
  try {
    if (document.id) {
      // Update existing document
      const { data, error } = await supabase
        .from('vehicle_documents')
        .update(document)
        .eq('id', document.id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    } else {
      // Create new document - validate required fields
      if (!document.vehicle_id || !document.name || !document.type) {
        throw new Error('Missing required fields for document');
      }

      const newDocument = {
        vehicle_id: document.vehicle_id,
        name: document.name,
        type: document.type,
        expiry_date: document.expiry_date,
        notes: document.notes,
        file_path: document.file_path
      };

      const { data, error } = await supabase
        .from('vehicle_documents')
        .insert(newDocument)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    }
  } catch (error: any) {
    console.error('Error saving document:', error);
    throw new Error(`Failed to save document: ${error.message}`);
  }
};

export const deleteDocument = async (id: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('vehicle_documents')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    return true;
  } catch (error: any) {
    console.error('Error deleting document:', error);
    throw new Error(`Failed to delete document: ${error.message}`);
  }
};

// STK Inspection Records
export const fetchInspectionRecords = async (vehicleId: string): Promise<InspectionRecord[]> => {
  if (!vehicleId) {
    throw new Error('Vehicle ID is required');
  }

  console.log('Fetching inspection records for vehicle:', vehicleId);
  
  const { data, error } = await supabase
    .from('vehicle_inspections')
    .select('*')
    .eq('vehicle_id', vehicleId)
    .order('inspection_date', { ascending: false });
  
  if (error) {
    console.error('Error fetching inspection records:', error);
    throw new Error(`Failed to fetch inspection records: ${error.message}`);
  }
  
  return data || [];
};

export const saveInspectionRecord = async (record: Partial<InspectionRecord>): Promise<InspectionRecord | null> => {
  try {
    if (record.id) {
      // Update existing record
      const { data, error } = await supabase
        .from('vehicle_inspections')
        .update(record)
        .eq('id', record.id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    } else {
      // Create new record - validate required fields
      if (!record.vehicle_id || !record.inspection_date || !record.next_inspection_date || 
          !record.result || !record.station || !record.cost || !record.mileage) {
        throw new Error('Missing required fields for inspection record');
      }

      const newRecord = {
        vehicle_id: record.vehicle_id,
        inspection_date: record.inspection_date,
        next_inspection_date: record.next_inspection_date,
        result: record.result,
        station: record.station,
        cost: record.cost,
        mileage: record.mileage,
        notes: record.notes
      };

      const { data, error } = await supabase
        .from('vehicle_inspections')
        .insert(newRecord)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    }
  } catch (error: any) {
    console.error('Error saving inspection record:', error);
    throw new Error(`Failed to save inspection record: ${error.message}`);
  }
};

export const deleteInspectionRecord = async (id: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('vehicle_inspections')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    return true;
  } catch (error: any) {
    console.error('Error deleting inspection record:', error);
    throw new Error(`Failed to delete inspection record: ${error.message}`);
  }
};

// Highway Vignette Records
export const fetchVignetteRecords = async (vehicleId: string): Promise<VignetteRecord[]> => {
  if (!vehicleId) {
    throw new Error('Vehicle ID is required');
  }

  console.log('Fetching vignette records for vehicle:', vehicleId);
  
  const { data, error } = await supabase
    .from('highway_vignettes')
    .select('*')
    .eq('vehicle_id', vehicleId)
    .order('valid_from', { ascending: false });
  
  if (error) {
    console.error('Error fetching vignette records:', error);
    throw new Error(`Failed to fetch vignette records: ${error.message}`);
  }
  
  return data || [];
};

export const saveVignetteRecord = async (record: Partial<VignetteRecord>): Promise<VignetteRecord | null> => {
  try {
    if (record.id) {
      // Update existing record
      const { data, error } = await supabase
        .from('highway_vignettes')
        .update(record)
        .eq('id', record.id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    } else {
      // Create new record - validate required fields
      if (!record.vehicle_id || !record.country || !record.vignette_type || 
          !record.valid_from || !record.valid_until || !record.cost) {
        throw new Error('Missing required fields for vignette record');
      }

      const newRecord = {
        vehicle_id: record.vehicle_id,
        country: record.country,
        vignette_type: record.vignette_type,
        valid_from: record.valid_from,
        valid_until: record.valid_until,
        cost: record.cost,
        purchase_location: record.purchase_location,
        notes: record.notes
      };

      const { data, error } = await supabase
        .from('highway_vignettes')
        .insert(newRecord)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    }
  } catch (error: any) {
    console.error('Error saving vignette record:', error);
    throw new Error(`Failed to save vignette record: ${error.message}`);
  }
};

export const deleteVignetteRecord = async (id: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('highway_vignettes')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    return true;
  } catch (error: any) {
    console.error('Error deleting vignette record:', error);
    throw new Error(`Failed to delete vignette record: ${error.message}`);
  }
};

// Helper function for calculating consumption
export const calculateConsumption = (fuelRecords: FuelRecord[]) => {
  if (fuelRecords.length === 0) {
    return {
      averageConsumption: 0,
      totalCost: 0,
      totalDistance: 0
    };
  }

  // Sort records by date
  const sortedRecords = [...fuelRecords].sort((a, b) => 
    new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  let totalCost = 0;
  let totalDistance = 0;
  let totalLiters = 0;
  let consumptionSamples = 0;

  for (let i = 0; i < sortedRecords.length; i++) {
    const record = sortedRecords[i];
    totalCost += record.total_cost;

    if (i > 0) {
      const currentMileage = parseFloat(record.mileage);
      const prevMileage = parseFloat(sortedRecords[i - 1].mileage);
      
      if (!isNaN(currentMileage) && !isNaN(prevMileage) && currentMileage > prevMileage) {
        const distance = currentMileage - prevMileage;
        totalDistance += distance;
        totalLiters += sortedRecords[i - 1].amount_liters;
        consumptionSamples++;
      }
    }
  }

  const averageConsumption = totalDistance > 0 ? (totalLiters / totalDistance) * 100 : 0;

  return {
    averageConsumption,
    totalCost,
    totalDistance
  };
};
