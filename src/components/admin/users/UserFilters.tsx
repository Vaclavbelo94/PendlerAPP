
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { DatePickerWithRange } from '@/components/ui/date-range-picker';
import { Badge } from '@/components/ui/badge';
import { X, Filter } from 'lucide-react';

interface UserFiltersProps {
  onFiltersChange: (filters: any) => void;
}

export const UserFilters: React.FC<UserFiltersProps> = ({ onFiltersChange }) => {
  const [filters, setFilters] = useState({
    registrationDate: null,
    premiumStatus: 'all',
    adminStatus: 'all',
    lastLoginDate: null,
    minShifts: '',
    maxShifts: '',
    location: ''
  });

  const [activeFilters, setActiveFilters] = useState<string[]>([]);

  const applyFilters = () => {
    const activeFilterList = [];
    
    if (filters.registrationDate) activeFilterList.push('Datum registrace');
    if (filters.premiumStatus !== 'all') activeFilterList.push('Premium status');
    if (filters.adminStatus !== 'all') activeFilterList.push('Admin status');
    if (filters.lastLoginDate) activeFilterList.push('Poslední přihlášení');
    if (filters.minShifts || filters.maxShifts) activeFilterList.push('Počet směn');
    if (filters.location) activeFilterList.push('Lokace');

    setActiveFilters(activeFilterList);
    onFiltersChange(filters);
  };

  const clearFilters = () => {
    const emptyFilters = {
      registrationDate: null,
      premiumStatus: 'all',
      adminStatus: 'all',
      lastLoginDate: null,
      minShifts: '',
      maxShifts: '',
      location: ''
    };
    setFilters(emptyFilters);
    setActiveFilters([]);
    onFiltersChange(emptyFilters);
  };

  const removeFilter = (filterName: string) => {
    const newFilters = { ...filters };
    switch (filterName) {
      case 'Datum registrace':
        newFilters.registrationDate = null;
        break;
      case 'Premium status':
        newFilters.premiumStatus = 'all';
        break;
      case 'Admin status':
        newFilters.adminStatus = 'all';
        break;
      case 'Poslední přihlášení':
        newFilters.lastLoginDate = null;
        break;
      case 'Počet směn':
        newFilters.minShifts = '';
        newFilters.maxShifts = '';
        break;
      case 'Lokace':
        newFilters.location = '';
        break;
    }
    setFilters(newFilters);
    applyFilters();
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Filter className="h-5 w-5" />
          Rozšířené filtry
        </CardTitle>
        <CardDescription>
          Použijte pokročilé filtry pro přesnější vyhledávání uživatelů
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Active filters */}
        {activeFilters.length > 0 && (
          <div className="flex flex-wrap gap-2">
            <span className="text-sm font-medium">Aktivní filtry:</span>
            {activeFilters.map((filter) => (
              <Badge 
                key={filter} 
                variant="secondary" 
                className="flex items-center gap-1"
              >
                {filter}
                <X 
                  className="h-3 w-3 cursor-pointer hover:text-destructive" 
                  onClick={() => removeFilter(filter)}
                />
              </Badge>
            ))}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Registration Date */}
          <div className="space-y-2">
            <Label>Datum registrace</Label>
            <DatePickerWithRange
              value={filters.registrationDate}
              onChange={(date) => setFilters({ ...filters, registrationDate: date })}
            />
          </div>

          {/* Premium Status */}
          <div className="space-y-2">
            <Label>Premium status</Label>
            <Select 
              value={filters.premiumStatus} 
              onValueChange={(value) => setFilters({ ...filters, premiumStatus: value })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Všichni</SelectItem>
                <SelectItem value="premium">Pouze Premium</SelectItem>
                <SelectItem value="regular">Pouze běžní</SelectItem>
                <SelectItem value="expired">Vypršelé Premium</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Admin Status */}
          <div className="space-y-2">
            <Label>Admin status</Label>
            <Select 
              value={filters.adminStatus} 
              onValueChange={(value) => setFilters({ ...filters, adminStatus: value })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Všichni</SelectItem>
                <SelectItem value="admin">Pouze admini</SelectItem>
                <SelectItem value="regular">Pouze běžní</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Last Login */}
          <div className="space-y-2">
            <Label>Poslední přihlášení</Label>
            <DatePickerWithRange
              value={filters.lastLoginDate}
              onChange={(date) => setFilters({ ...filters, lastLoginDate: date })}
            />
          </div>

          {/* Shifts Range */}
          <div className="space-y-2">
            <Label>Počet směn</Label>
            <div className="flex gap-2">
              <Input
                placeholder="Min"
                type="number"
                value={filters.minShifts}
                onChange={(e) => setFilters({ ...filters, minShifts: e.target.value })}
              />
              <Input
                placeholder="Max"
                type="number"
                value={filters.maxShifts}
                onChange={(e) => setFilters({ ...filters, maxShifts: e.target.value })}
              />
            </div>
          </div>

          {/* Location */}
          <div className="space-y-2">
            <Label>Lokace</Label>
            <Input
              placeholder="Město nebo region"
              value={filters.location}
              onChange={(e) => setFilters({ ...filters, location: e.target.value })}
            />
          </div>
        </div>

        <div className="flex gap-2 pt-4 border-t">
          <Button onClick={applyFilters}>
            Použít filtry
          </Button>
          <Button variant="outline" onClick={clearFilters}>
            Vymazat vše
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
