
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import AddressAutocomplete from '../AddressAutocomplete';

interface SearchFilters {
  origin: string;
  destination: string;
  date: string;
}

interface RideSearchFormProps {
  searchFilters: SearchFilters;
  onSearchFiltersChange: (filters: SearchFilters) => void;
  onSearch: () => void;
}

const RideSearchForm = ({ searchFilters, onSearchFiltersChange, onSearch }: RideSearchFormProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Vyhledat spolujízdu</CardTitle>
        <CardDescription>Najděte spolujízdu podle vašich potřeb.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <AddressAutocomplete
            value={searchFilters.origin}
            onChange={(value) => onSearchFiltersChange({...searchFilters, origin: value})}
            placeholder="Místo odjezdu"
          />
          <AddressAutocomplete
            value={searchFilters.destination}
            onChange={(value) => onSearchFiltersChange({...searchFilters, destination: value})}
            placeholder="Cíl cesty"
          />
          <Input 
            type="date" 
            value={searchFilters.date}
            onChange={(e) => onSearchFiltersChange({...searchFilters, date: e.target.value})}
          />
          <Button onClick={onSearch} className="md:col-span-3">Hledat spolujízdy</Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default RideSearchForm;
