
import { ServiceRecord, FuelRecord, InsuranceRecord, DocumentRecord } from '@/types/vehicle';

// Mock data pro development - později nahradit skutečnými Supabase calls

export const fetchServiceRecords = async (vehicleId: string): Promise<ServiceRecord[]> => {
  // Simulace načítání
  await new Promise(resolve => setTimeout(resolve, 500));
  
  return [
    {
      id: '1',
      vehicle_id: vehicleId,
      service_date: '2024-03-15',
      service_type: 'Výměna oleje',
      description: 'Výměna motorového oleje a filtru',
      mileage: '85000',
      cost: '1500',
      provider: 'Autoservis Novák'
    }
  ];
};

export const saveServiceRecord = async (record: Partial<ServiceRecord>): Promise<ServiceRecord | null> => {
  // Simulace ukládání
  await new Promise(resolve => setTimeout(resolve, 300));
  
  return {
    id: record.id || Math.random().toString(),
    vehicle_id: record.vehicle_id!,
    service_date: record.service_date!,
    service_type: record.service_type!,
    description: record.description!,
    mileage: record.mileage!,
    cost: record.cost!,
    provider: record.provider!
  };
};

export const deleteServiceRecord = async (id: string): Promise<boolean> => {
  // Simulace mazání
  await new Promise(resolve => setTimeout(resolve, 200));
  return true;
};

export const fetchFuelRecords = async (vehicleId: string): Promise<FuelRecord[]> => {
  await new Promise(resolve => setTimeout(resolve, 500));
  
  return [
    {
      id: '1',
      vehicle_id: vehicleId,
      date: '2024-04-20',
      amount_liters: 45.5,
      price_per_liter: 36.90,
      total_cost: 1679.95,
      mileage: '87500',
      full_tank: true,
      station: 'Shell'
    }
  ];
};

export const saveFuelRecord = async (record: Partial<FuelRecord>): Promise<FuelRecord | null> => {
  await new Promise(resolve => setTimeout(resolve, 300));
  
  return {
    id: record.id || Math.random().toString(),
    vehicle_id: record.vehicle_id!,
    date: record.date!,
    amount_liters: record.amount_liters!,
    price_per_liter: record.price_per_liter!,
    total_cost: record.total_cost!,
    mileage: record.mileage!,
    full_tank: record.full_tank!,
    station: record.station!
  };
};

export const deleteFuelRecord = async (id: string): Promise<boolean> => {
  await new Promise(resolve => setTimeout(resolve, 200));
  return true;
};

export const fetchInsuranceRecords = async (vehicleId: string): Promise<InsuranceRecord[]> => {
  await new Promise(resolve => setTimeout(resolve, 500));
  
  return [
    {
      id: '1',
      vehicle_id: vehicleId,
      provider: 'Kooperativa',
      policy_number: 'POL123456',
      valid_from: '2024-01-01',
      valid_until: '2024-12-31',
      monthly_cost: '1200',
      coverage_type: 'Plné pojištění',
      notes: 'Zahrnuje povinné ručení a havarijní pojištění'
    }
  ];
};

export const saveInsuranceRecord = async (record: Partial<InsuranceRecord>): Promise<InsuranceRecord | null> => {
  await new Promise(resolve => setTimeout(resolve, 300));
  
  return {
    id: record.id || Math.random().toString(),
    vehicle_id: record.vehicle_id!,
    provider: record.provider!,
    policy_number: record.policy_number!,
    valid_from: record.valid_from!,
    valid_until: record.valid_until!,
    monthly_cost: record.monthly_cost!,
    coverage_type: record.coverage_type!,
    notes: record.notes || ''
  };
};

export const deleteInsuranceRecord = async (id: string): Promise<boolean> => {
  await new Promise(resolve => setTimeout(resolve, 200));
  return true;
};

export const fetchDocuments = async (vehicleId: string): Promise<DocumentRecord[]> => {
  await new Promise(resolve => setTimeout(resolve, 500));
  
  return [
    {
      id: '1',
      vehicle_id: vehicleId,
      name: 'Technický průkaz',
      type: 'stk',
      expiry_date: '2025-05-15',
      notes: 'Platný technický průkaz vozidla'
    }
  ];
};

export const saveDocument = async (document: Partial<DocumentRecord>): Promise<DocumentRecord | null> => {
  await new Promise(resolve => setTimeout(resolve, 300));
  
  return {
    id: document.id || Math.random().toString(),
    vehicle_id: document.vehicle_id!,
    name: document.name!,
    type: document.type!,
    expiry_date: document.expiry_date,
    notes: document.notes
  };
};

export const deleteDocument = async (id: string): Promise<boolean> => {
  await new Promise(resolve => setTimeout(resolve, 200));
  return true;
};
