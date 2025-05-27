
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { DatePicker } from '@/components/ui/date-picker';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { X, Filter, RotateCcw } from 'lucide-react';

interface UserFiltersProps {
  onFiltersChange: (filters: any) => void;
}

export const UserFilters: React.FC<UserFiltersProps> = ({ onFiltersChange }) => {
  const [filters, setFilters] = useState({
    registrationDateFrom: null as Date | null,
    registrationDateTo: null as Date | null,
    lastLoginFrom: null as Date | null,
    lastLoginTo: null as Date | null,
    premiumStatus: 'all',
    adminStatus: 'all',
    activityLevel: 'all',
    emailDomain: '',
    minShifts: '',
    maxShifts: '',
    hasVehicles: false,
    hasNotifications: false
  });

  const [activeFilters, setActiveFilters] = useState<string[]>([]);

  const handleFilterChange = (key: string, value: any) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    
    // Update active filters list
    const active = Object.entries(newFilters)
      .filter(([k, v]) => {
        if (v === null || v === '' || v === 'all' || v === false) return false;
        return true;
      })
      .map(([k]) => k);
    
    setActiveFilters(active);
    onFiltersChange(newFilters);
  };

  const clearAllFilters = () => {
    const clearedFilters = {
      registrationDateFrom: null,
      registrationDateTo: null,
      lastLoginFrom: null,
      lastLoginTo: null,
      premiumStatus: 'all',
      adminStatus: 'all',
      activityLevel: 'all',
      emailDomain: '',
      minShifts: '',
      maxShifts: '',
      hasVehicles: false,
      hasNotifications: false
    };
    
    setFilters(clearedFilters);
    setActiveFilters([]);
    onFiltersChange(clearedFilters);
  };

  const removeFilter = (filterKey: string) => {
    let defaultValue;
    switch (filterKey) {
      case 'registrationDateFrom':
      case 'registrationDateTo':
      case 'lastLoginFrom':
      case 'lastLoginTo':
        defaultValue = null;
        break;
      case 'premiumStatus':
      case 'adminStatus':
      case 'activityLevel':
        defaultValue = 'all';
        break;
      case 'hasVehicles':
      case 'hasNotifications':
        defaultValue = false;
        break;
      default:
        defaultValue = '';
    }
    
    handleFilterChange(filterKey, defaultValue);
  };

  const getFilterLabel = (key: string) => {
    const labels: { [key: string]: string } = {
      registrationDateFrom: 'Registrace od',
      registrationDateTo: 'Registrace do',
      lastLoginFrom: 'Poslední přihlášení od',
      lastLoginTo: 'Poslední přihlášení do',
      premiumStatus: 'Premium status',
      adminStatus: 'Admin status',
      activityLevel: 'Úroveň aktivity',
      emailDomain: 'Email doména',
      minShifts: 'Min. směn',
      maxShifts: 'Max. směn',
      hasVehicles: 'Má vozidla',
      hasNotifications: 'Má notifikace'
    };
    return labels[key] || key;
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Filter className="h-5 w-5" />
              Pokročilé filtry
            </CardTitle>
            <CardDescription>
              Detailní filtrování uživatelů podle různých kritérií
            </CardDescription>
          </div>
          <Button variant="outline" size="sm" onClick={clearAllFilters}>
            <RotateCcw className="h-4 w-4 mr-2" />
            Vymazat vše
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Active Filters */}
        {activeFilters.length > 0 && (
          <div className="space-y-2">
            <Label className="text-sm font-medium">Aktivní filtry:</Label>
            <div className="flex flex-wrap gap-2">
              {activeFilters.map((filterKey) => (
                <Badge key={filterKey} variant="secondary" className="flex items-center gap-1">
                  {getFilterLabel(filterKey)}
                  <button
                    onClick={() => removeFilter(filterKey)}
                    className="ml-1 hover:bg-red-100 rounded-full p-0.5"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
            </div>
            <Separator />
          </div>
        )}

        {/* Date Filters */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Datum registrace</Label>
            <div className="flex gap-2">
              <div className="flex-1">
                <DatePicker
                  selected={filters.registrationDateFrom}
                  onSelect={(date) => handleFilterChange('registrationDateFrom', date)}
                  placeholderText="Od"
                />
              </div>
              <div className="flex-1">
                <DatePicker
                  selected={filters.registrationDateTo}
                  onSelect={(date) => handleFilterChange('registrationDateTo', date)}
                  placeholderText="Do"
                />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Poslední přihlášení</Label>
            <div className="flex gap-2">
              <div className="flex-1">
                <DatePicker
                  selected={filters.lastLoginFrom}
                  onSelect={(date) => handleFilterChange('lastLoginFrom', date)}
                  placeholderText="Od"
                />
              </div>
              <div className="flex-1">
                <DatePicker
                  selected={filters.lastLoginTo}
                  onSelect={(date) => handleFilterChange('lastLoginTo', date)}
                  placeholderText="Do"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Status Filters */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="premiumStatus">Premium status</Label>
            <Select value={filters.premiumStatus} onValueChange={(value) => handleFilterChange('premiumStatus', value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Všichni</SelectItem>
                <SelectItem value="premium">Pouze premium</SelectItem>
                <SelectItem value="regular">Pouze běžní</SelectItem>
                <SelectItem value="expired">Vypršelý premium</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="adminStatus">Admin status</Label>
            <Select value={filters.adminStatus} onValueChange={(value) => handleFilterChange('adminStatus', value)}>
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

          <div className="space-y-2">
            <Label htmlFor="activityLevel">Úroveň aktivity</Label>
            <Select value={filters.activityLevel} onValueChange={(value) => handleFilterChange('activityLevel', value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Všichni</SelectItem>
                <SelectItem value="high">Vysoká aktivita</SelectItem>
                <SelectItem value="medium">Střední aktivita</SelectItem>
                <SelectItem value="low">Nízká aktivita</SelectItem>
                <SelectItem value="inactive">Neaktivní</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Text and Number Filters */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="emailDomain">Email doména</Label>
            <Input
              id="emailDomain"
              placeholder="např. gmail.com"
              value={filters.emailDomain}
              onChange={(e) => handleFilterChange('emailDomain', e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="minShifts">Minimální počet směn</Label>
            <Input
              id="minShifts"
              type="number"
              placeholder="0"
              value={filters.minShifts}
              onChange={(e) => handleFilterChange('minShifts', e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="maxShifts">Maximální počet směn</Label>
            <Input
              id="maxShifts"
              type="number"
              placeholder="100"
              value={filters.maxShifts}
              onChange={(e) => handleFilterChange('maxShifts', e.target.value)}
            />
          </div>
        </div>

        {/* Boolean Filters */}
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="hasVehicles"
              checked={filters.hasVehicles}
              onCheckedChange={(checked) => handleFilterChange('hasVehicles', checked)}
            />
            <Label htmlFor="hasVehicles">Pouze uživatelé s vozidly</Label>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="hasNotifications"
              checked={filters.hasNotifications}
              onCheckedChange={(checked) => handleFilterChange('hasNotifications', checked)}
            />
            <Label htmlFor="hasNotifications">Pouze uživatelé s povolenými notifikacemi</Label>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
