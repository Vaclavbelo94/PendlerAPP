
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
import { useTranslation } from 'react-i18next';

interface WorkPreferencesProps {
  // Define props if needed
}

const WorkPreferences: React.FC<WorkPreferencesProps> = ({ /* props */ }) => {
  const { user } = useAuth();
  const { t } = useTranslation('profile');
  const [formData, setFormData] = useState({
    preferredLocation: '',
    availableShifts: '',
    expectedSalary: '',
    remoteWork: false,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    setFormData(prevData => ({
      ...prevData,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSwitchChange = (checked: boolean) => {
    setFormData(prevData => ({
      ...prevData,
      remoteWork: checked,
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
          {t('workPreferences')}
        </CardTitle>
        <CardDescription>
          {t('workPreferencesDescription')}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="preferredLocation" className="flex items-center space-x-2">
              <MapPin className="h-4 w-4 mr-2" />
              {t('preferredLocation')}
            </Label>
            <Input
              type="text"
              id="preferredLocation"
              name="preferredLocation"
              value={formData.preferredLocation}
              onChange={handleChange}
              placeholder={t('enterPreferredLocation')}
            />
          </div>
          <div>
            <Label htmlFor="availableShifts" className="flex items-center space-x-2">
              <Clock className="h-4 w-4 mr-2" />
              {t('availableShifts')}
            </Label>
            <Select onValueChange={(value) => handleChange({ target: { name: 'availableShifts', value } } as any)}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder={t('selectAvailableShifts')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="morning">{t('morning')}</SelectItem>
                <SelectItem value="afternoon">{t('afternoon')}</SelectItem>
                <SelectItem value="evening">{t('evening')}</SelectItem>
                <SelectItem value="night">{t('night')}</SelectItem>
                <SelectItem value="flexible">{t('flexible')}</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="expectedSalary" className="flex items-center space-x-2">
              <DollarSign className="h-4 w-4 mr-2" />
              {t('expectedSalary')}
            </Label>
            <Input
              type="number"
              id="expectedSalary"
              name="expectedSalary"
              value={formData.expectedSalary}
              onChange={handleChange}
              placeholder={t('enterExpectedSalary')}
            />
          </div>
          <div className="flex items-center justify-between">
            <Label htmlFor="remoteWork" className="flex items-center space-x-2">
              <Calendar className="h-4 w-4 mr-2" />
              {t('remoteWork')}
            </Label>
            <Switch
              id="remoteWork"
              name="remoteWork"
              checked={formData.remoteWork}
              onCheckedChange={handleSwitchChange}
            />
          </div>
          <Button type="submit" className="w-full">
            {t('savePreferences')}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default WorkPreferences;
