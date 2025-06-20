
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MapPin } from "lucide-react";
import { useLanguage } from "@/hooks/useLanguage";

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
  const { t } = useLanguage();

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('searchRides')}</CardTitle>
        <CardDescription>{t('findRide')}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative">
            <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              className="pl-10"
              value={searchFilters.origin}
              onChange={(e) => onSearchFiltersChange({...searchFilters, origin: e.target.value})}
              placeholder={t('origin')}
            />
          </div>
          <div className="relative">
            <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              className="pl-10"
              value={searchFilters.destination}
              onChange={(e) => onSearchFiltersChange({...searchFilters, destination: e.target.value})}
              placeholder={t('destination')}
            />
          </div>
          <Input 
            type="date" 
            value={searchFilters.date}
            onChange={(e) => onSearchFiltersChange({...searchFilters, date: e.target.value})}
          />
          <Button onClick={onSearch} className="md:col-span-3">{t('searchRides')}</Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default RideSearchForm;
