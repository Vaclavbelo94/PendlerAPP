import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from '@/hooks/auth';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Clock, MapPin, Briefcase, DollarSign, Calendar } from "lucide-react";

interface WorkPreferencesProps {
  // Define props if needed
}

const WorkPreferences: React.FC<WorkPreferencesProps> = ({ /* props */ }) => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    preferredLocation: '',
    availableShifts: '',
    expectedSalary: '',
    remoteWork: false,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission logic here
    console.log('Form submitted:', formData);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Briefcase className="h-5 w-5" />
          Pracovní preference
        </CardTitle>
        <CardDescription>
          Nastavte si vaše pracovní preference pro lepší nabídky
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="preferredLocation" className="flex items-center space-x-2">
              <MapPin className="h-4 w-4 mr-2" />
              Preferovaná lokalita
            </Label>
            <Input
              type="text"
              id="preferredLocation"
              name="preferredLocation"
              value={formData.preferredLocation}
              onChange={handleChange}
              placeholder="Zadejte preferovanou lokalitu"
            />
          </div>
          <div>
            <Label htmlFor="availableShifts" className="flex items-center space-x-2">
              <Clock className="h-4 w-4 mr-2" />
              Dostupné směny
            </Label>
            <Select onValueChange={(value) => handleChange({ target: { name: 'availableShifts', value } } as any)}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Vyberte dostupné směny" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="morning">Ranní</SelectItem>
                <SelectItem value="afternoon">Odpolední</SelectItem>
                <SelectItem value="evening">Večerní</SelectItem>
                <SelectItem value="night">Noční</SelectItem>
                <SelectItem value="flexible">Flexibilní</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="expectedSalary" className="flex items-center space-x-2">
              <DollarSign className="h-4 w-4 mr-2" />
              Očekávaný plat
            </Label>
            <Input
              type="number"
              id="expectedSalary"
              name="expectedSalary"
              value={formData.expectedSalary}
              onChange={handleChange}
              placeholder="Zadejte očekávaný plat"
            />
          </div>
          <div className="flex items-center justify-between">
            <Label htmlFor="remoteWork" className="flex items-center space-x-2">
              <Calendar className="h-4 w-4 mr-2" />
              Práce na dálku
            </Label>
            <Switch
              id="remoteWork"
              name="remoteWork"
              checked={formData.remoteWork}
              onCheckedChange={(checked) => handleChange({ target: { name: 'remoteWork', type: 'checkbox', checked } } as any)}
            />
          </div>
          <Button type="submit" className="w-full">
            Uložit preference
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default WorkPreferences;
