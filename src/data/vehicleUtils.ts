
import { vehicleBrands } from './vehicleBrands';

export const findBrandById = (brandId: string) => {
  return vehicleBrands.find(brand => brand.id === brandId);
};

export const findBrandByName = (brandName: string) => {
  return vehicleBrands.find(brand => 
    brand.name.toLowerCase() === brandName.toLowerCase()
  );
};

export const getModelsForBrand = (brandId: string): string[] => {
  const brand = findBrandById(brandId);
  return brand ? brand.models : [];
};

export const searchBrands = (query: string) => {
  if (!query) return vehicleBrands;
  
  return vehicleBrands.filter(brand =>
    brand.name.toLowerCase().includes(query.toLowerCase())
  );
};

export const searchModels = (brandId: string, query: string): string[] => {
  const models = getModelsForBrand(brandId);
  if (!query) return models;
  
  return models.filter(model =>
    model.toLowerCase().includes(query.toLowerCase())
  );
};
