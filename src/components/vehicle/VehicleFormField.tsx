
import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { Check, ChevronsUpDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { vehicleBrands, generateYears } from '@/data/vehicleBrands';
import { getModelsForBrand, searchBrands } from '@/data/vehicleUtils';
import { useTranslation } from 'react-i18next';

interface VehicleFieldProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  required?: boolean;
}

interface BrandSelectorProps extends VehicleFieldProps {
  onBrandChange?: (brandId: string) => void;
}

interface ModelSelectorProps extends VehicleFieldProps {
  brandId: string;
}

export const BrandSelector: React.FC<BrandSelectorProps> = ({
  value,
  onChange,
  onBrandChange,
  placeholder,
  required
}) => {
  const { t } = useTranslation(['vehicle']);
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredBrands = searchBrands(searchQuery);
  const selectedBrand = vehicleBrands.find(brand => brand.name === value);

  const handleSelect = (brandName: string, brandId: string) => {
    onChange(brandName);
    onBrandChange?.(brandId);
    setOpen(false);
    setSearchQuery("");
  };

  return (
    <div className="space-y-2">
      <Label>{t('vehicle:brand')} {required && '*'}</Label>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full justify-between"
          >
            {value || placeholder || t('vehicle:selectBrand')}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-full p-0">
          <Command>
            <CommandInput 
              placeholder={t('vehicle:searchBrand')} 
              value={searchQuery}
              onValueChange={setSearchQuery}
            />
            <CommandEmpty>{t('vehicle:noBrandFound')}</CommandEmpty>
            <CommandList>
              <CommandGroup>
                {filteredBrands.map((brand) => (
                  <CommandItem
                    key={brand.id}
                    value={brand.name}
                    onSelect={() => handleSelect(brand.name, brand.id)}
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        selectedBrand?.id === brand.id ? "opacity-100" : "opacity-0"
                      )}
                    />
                    {brand.name}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
};

export const ModelSelector: React.FC<ModelSelectorProps> = ({
  value,
  onChange,
  brandId,
  placeholder,
  required
}) => {
  const { t } = useTranslation(['vehicle']);
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const availableModels = getModelsForBrand(brandId);
  const filteredModels = availableModels.filter(model =>
    model.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSelect = (modelName: string) => {
    onChange(modelName);
    setOpen(false);
    setSearchQuery("");
  };

  // Pokud není vybrána značka nebo je vybrána "Jiná značka", zobrazíme input
  if (!brandId || brandId === 'other') {
    return (
      <div className="space-y-2">
        <Label>{t('vehicle:model')} {required && '*'}</Label>
        <Input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder || t('vehicle:enterModel')}
          required={required}
        />
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <Label>{t('vehicle:model')} {required && '*'}</Label>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full justify-between"
            disabled={!brandId || brandId === ''}
          >
            {value || placeholder || t('vehicle:selectModel')}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-full p-0">
          <Command>
            <CommandInput 
              placeholder={t('vehicle:searchModel')} 
              value={searchQuery}
              onValueChange={setSearchQuery}
            />
            <CommandEmpty>
              <div className="p-4 space-y-2">
                <p>{t('vehicle:noModelFound')}</p>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    onChange(searchQuery);
                    setOpen(false);
                  }}
                  disabled={!searchQuery}
                >
                  {t('vehicle:useCustomModel', { model: searchQuery })}
                </Button>
              </div>
            </CommandEmpty>
            <CommandList>
              <CommandGroup>
                {filteredModels.map((model) => (
                  <CommandItem
                    key={model}
                    value={model}
                    onSelect={() => handleSelect(model)}
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        value === model ? "opacity-100" : "opacity-0"
                      )}
                    />
                    {model}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
};

export const YearSelector: React.FC<VehicleFieldProps> = ({
  value,
  onChange,
  placeholder,
  required
}) => {
  const { t } = useTranslation(['vehicle']);
  const years = generateYears();

  return (
    <div className="space-y-2">
      <Label>{t('vehicle:year')} {required && '*'}</Label>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger>
          <SelectValue placeholder={placeholder || t('vehicle:selectYear')} />
        </SelectTrigger>
        <SelectContent>
          {years.map((year) => (
            <SelectItem key={year} value={year}>
              {year}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};
