
export interface VehicleData {
  id?: string;
  user_id?: string;
  brand: string;
  model: string;
  year: string;
  license_plate: string;
  vin?: string;
  fuel_type?: string;
  engine?: string;
  power?: string;
  transmission?: string;
  color?: string;
  mileage?: string;
  purchase_price?: string;
  average_consumption?: string;
  insurance_monthly?: string;
  tax_yearly?: string;
  last_service?: string;
  next_inspection?: string;
  last_repair_cost?: string;
  created_at?: string;
  updated_at?: string;
}

export interface ServiceRecord {
  id?: string;
  vehicle_id: string;
  service_date: string;
  service_type: string;
  description: string;
  mileage: string;
  cost: string;
  provider: string;
}

export interface FuelRecord {
  id?: string;
  vehicle_id: string;
  date: string;
  amount_liters: number;
  price_per_liter: number;
  total_cost: number;
  mileage: string;
  full_tank: boolean;
  station: string;
}

export interface InsuranceRecord {
  id?: string;
  vehicle_id: string;
  provider: string;
  policy_number: string;
  valid_from: string;
  valid_until: string;
  monthly_cost: string;
  coverage_type: string;
  notes?: string;
}

export interface DocumentRecord {
  id?: string;
  vehicle_id: string;
  name: string;
  type: string;
  expiry_date?: string;
  notes?: string;
  file_path?: string;
}

export interface InspectionRecord {
  id?: string;
  vehicle_id: string;
  inspection_date: string;
  next_inspection_date: string;
  result: string;
  station: string;
  cost: string;
  mileage: string;
  notes?: string;
}

export interface VignetteRecord {
  id?: string;
  vehicle_id: string;
  country: string;
  vignette_type: string;
  valid_from: string;
  valid_until: string;
  cost: string;
  purchase_location?: string;
  notes?: string;
}
