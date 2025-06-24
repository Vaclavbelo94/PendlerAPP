
export interface VehicleBrand {
  id: string;
  name: string;
  models: string[];
}

export const vehicleBrands: VehicleBrand[] = [
  {
    id: 'audi',
    name: 'Audi',
    models: ['A1', 'A3', 'A4', 'A5', 'A6', 'A7', 'A8', 'Q2', 'Q3', 'Q5', 'Q7', 'Q8', 'TT', 'R8', 'e-tron GT']
  },
  {
    id: 'bmw',
    name: 'BMW',
    models: ['1 Series', '2 Series', '3 Series', '4 Series', '5 Series', '6 Series', '7 Series', '8 Series', 'X1', 'X2', 'X3', 'X4', 'X5', 'X6', 'X7', 'Z4', 'i3', 'i4', 'iX']
  },
  {
    id: 'mercedes-benz',
    name: 'Mercedes-Benz',
    models: ['A-Class', 'B-Class', 'C-Class', 'E-Class', 'S-Class', 'CLA', 'CLS', 'GLA', 'GLB', 'GLC', 'GLE', 'GLS', 'G-Class', 'AMG GT', 'EQA', 'EQB', 'EQC', 'EQS']
  },
  {
    id: 'volkswagen',
    name: 'Volkswagen',
    models: ['Polo', 'Golf', 'Jetta', 'Passat', 'Arteon', 'T-Cross', 'T-Roc', 'Tiguan', 'Touareg', 'Sharan', 'Touran', 'Caddy', 'Crafter', 'ID.3', 'ID.4', 'ID.5']
  },
  {
    id: 'skoda',
    name: 'Škoda',
    models: ['Citigo', 'Fabia', 'Scala', 'Octavia', 'Superb', 'Kamiq', 'Karoq', 'Kodiaq', 'Enyaq iV']
  },
  {
    id: 'ford',
    name: 'Ford',
    models: ['Fiesta', 'Focus', 'Mondeo', 'Mustang', 'EcoSport', 'Kuga', 'Edge', 'Explorer', 'Ranger', 'Transit', 'Mustang Mach-E']
  },
  {
    id: 'opel',
    name: 'Opel',
    models: ['Corsa', 'Astra', 'Insignia', 'Crossland', 'Grandland', 'Mokka', 'Zafira', 'Vivaro', 'Corsa-e', 'Mokka-e']
  },
  {
    id: 'peugeot',
    name: 'Peugeot',
    models: ['108', '208', '308', '508', '2008', '3008', '5008', 'Partner', 'Expert', 'e-208', 'e-2008']
  },
  {
    id: 'renault',
    name: 'Renault',
    models: ['Clio', 'Megane', 'Talisman', 'Captur', 'Kadjar', 'Koleos', 'Scenic', 'Espace', 'Kangoo', 'Trafic', 'ZOE', 'Twingo']
  },
  {
    id: 'toyota',
    name: 'Toyota',
    models: ['Aygo', 'Yaris', 'Corolla', 'Camry', 'Avensis', 'C-HR', 'RAV4', 'Highlander', 'Land Cruiser', 'Prius', 'Mirai']
  },
  {
    id: 'honda',
    name: 'Honda',
    models: ['Jazz', 'Civic', 'Accord', 'HR-V', 'CR-V', 'Pilot', 'Ridgeline', 'Insight', 'Clarity']
  },
  {
    id: 'hyundai',
    name: 'Hyundai',
    models: ['i10', 'i20', 'i30', 'Elantra', 'Sonata', 'Kona', 'Tucson', 'Santa Fe', 'Palisade', 'IONIQ', 'IONIQ 5']
  },
  {
    id: 'kia',
    name: 'Kia',
    models: ['Picanto', 'Rio', 'Ceed', 'Optima', 'Stinger', 'Stonic', 'Sportage', 'Sorento', 'Telluride', 'Niro', 'EV6']
  },
  {
    id: 'nissan',
    name: 'Nissan',
    models: ['Micra', 'Sentra', 'Altima', 'Maxima', 'Juke', 'Qashqai', 'X-Trail', 'Pathfinder', 'Armada', 'Leaf', '370Z']
  },
  {
    id: 'mazda',
    name: 'Mazda',
    models: ['Mazda2', 'Mazda3', 'Mazda6', 'CX-3', 'CX-30', 'CX-5', 'CX-9', 'MX-5', 'MX-30']
  },
  {
    id: 'fiat',
    name: 'Fiat',
    models: ['500', 'Panda', 'Tipo', '500X', '500L', 'Doblo', 'Ducato', '500e']
  },
  {
    id: 'seat',
    name: 'SEAT',
    models: ['Mii', 'Ibiza', 'Leon', 'Toledo', 'Arona', 'Ateca', 'Tarraco', 'Alhambra']
  },
  {
    id: 'volvo',
    name: 'Volvo',
    models: ['V40', 'V60', 'V90', 'S60', 'S90', 'XC40', 'XC60', 'XC90', 'C40', 'EX30']
  },
  {
    id: 'other',
    name: 'Jiná značka',
    models: []
  }
];

export const generateYears = (): string[] => {
  const currentYear = new Date().getFullYear();
  const years: string[] = [];
  
  for (let year = currentYear; year >= 1990; year--) {
    years.push(year.toString());
  }
  
  return years;
};
