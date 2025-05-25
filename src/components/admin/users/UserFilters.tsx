
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
import { Calendar } from '@/components/ui/calendar';
import { 
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { CalendarIcon, X } from 'lucide-react';
import { format } from 'date-fns';
import { cs } from 'date-fns/locale';

interface UserFiltersProps {
  onFiltersChange: (filters: any) => void;
}

export const UserFilters: React.FC<UserFiltersProps> = ({ onFiltersChange }) => {
  const [registrationFrom, setRegistrationFrom] = useState<Date>();
  const [registrationTo, setRegistrationTo] = useState<Date>();
  const [lastLoginFrom, setLastLoginFrom] = useState<Date>();
  const [lastLoginTo, setLastLoginTo] = useState<Date>();
  const [premiumStatus, setPremiumStatus] = useState<string>('all');
  const [adminStatus, setAdminStatus] = useState<string>('all');
  const [minLoginCount, setMinLoginCount] = useState<string>('');
  const [maxLoginCount, setMaxLoginCount] = useState<string>('');

  const handleApplyFilters = () => {
    const filters = {
      registrationFrom,
      registrationTo,
      lastLoginFrom,
      lastLoginTo,
      premiumStatus: premiumStatus !== 'all' ? premiumStatus : null,
      adminStatus: adminStatus !== 'all' ? adminStatus : null,
      minLoginCount: minLoginCount ? parseInt(minLoginCount) : null,
      maxLoginCount: maxLoginCount ? parseInt(maxLoginCount) : null
    };
    
    onFiltersChange(filters);
  };

  const handleClearFilters = () => {
    setRegistrationFrom(undefined);
    setRegistrationTo(undefined);
    setLastLoginFrom(undefined);
    setLastLoginTo(undefined);
    setPremiumStatus('all');
    setAdminStatus('all');
    setMinLoginCount('');
    setMaxLoginCount('');
    onFiltersChange({});
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          Pokročilé filtry
          <Button variant="ghost" size="sm" onClick={handleClearFilters}>
            <X className="h-4 w-4 mr-2" />
            Vyčistit
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Registration Date Range */}
          <div className="space-y-2">
            <Label>Registrace od</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="w-full justify-start text-left font-normal">
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {registrationFrom ? format(registrationFrom, "dd.MM.yyyy", { locale: cs }) : "Vyberte datum"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={registrationFrom}
                  onSelect={setRegistrationFrom}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          <div className="space-y-2">
            <Label>Registrace do</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="w-full justify-start text-left font-normal">
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {registrationTo ? format(registrationTo, "dd.MM.yyyy", { locale: cs }) : "Vyberte datum"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={registrationTo}
                  onSelect={setRegistrationTo}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          {/* Premium Status */}
          <div className="space-y-2">
            <Label>Premium status</Label>
            <Select value={premiumStatus} onValueChange={setPremiumStatus}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Všechny</SelectItem>
                <SelectItem value="premium">Pouze Premium</SelectItem>
                <SelectItem value="regular">Pouze běžní</SelectItem>
                <SelectItem value="expired">Vypršelé Premium</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Admin Status */}
          <div className="space-y-2">
            <Label>Admin status</Label>
            <Select value={adminStatus} onValueChange={setAdminStatus}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Všechny</SelectItem>
                <SelectItem value="admin">Pouze Admin</SelectItem>
                <SelectItem value="regular">Pouze běžní</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Login Count Range */}
          <div className="space-y-2">
            <Label>Min. počet přihlášení</Label>
            <Input
              type="number"
              placeholder="0"
              value={minLoginCount}
              onChange={(e) => setMinLoginCount(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label>Max. počet přihlášení</Label>
            <Input
              type="number"
              placeholder="∞"
              value={maxLoginCount}
              onChange={(e) => setMaxLoginCount(e.target.value)}
            />
          </div>

          {/* Last Login Date Range */}
          <div className="space-y-2">
            <Label>Poslední přihlášení od</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="w-full justify-start text-left font-normal">
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {lastLoginFrom ? format(lastLoginFrom, "dd.MM.yyyy", { locale: cs }) : "Vyberte datum"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={lastLoginFrom}
                  onSelect={setLastLoginFrom}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          <div className="space-y-2">
            <Label>Poslední přihlášení do</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="w-full justify-start text-left font-normal">
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {lastLoginTo ? format(lastLoginTo, "dd.MM.yyyy", { locale: cs }) : "Vyberte datum"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={lastLoginTo}
                  onSelect={setLastLoginTo}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>

        <div className="flex justify-end gap-2 mt-4">
          <Button variant="outline" onClick={handleClearFilters}>
            Vyčistit filtry
          </Button>
          <Button onClick={handleApplyFilters}>
            Použít filtry
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
