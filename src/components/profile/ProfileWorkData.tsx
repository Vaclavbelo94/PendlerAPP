
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useWorkData } from "@/hooks/useWorkData";
import { useTranslation } from 'react-i18next';
import { DollarSign, Phone, MapPin } from 'lucide-react';

const ProfileWorkData = () => {
  const { t } = useTranslation('profile');
  const { workData, loading, saveWorkData, setWorkData } = useWorkData();
  const [tempData, setTempData] = useState(workData);

  const countryOptions = [
    { code: 'CZ', label: 'Česká republika (+420)', flag: '🇨🇿' },
    { code: 'DE', label: 'Deutschland (+49)', flag: '🇩🇪' },
    { code: 'PL', label: 'Polska (+48)', flag: '🇵🇱' }
  ];

  const handleSave = async () => {
    const success = await saveWorkData(tempData);
    if (success) {
      setWorkData(tempData);
    }
  };

  // Update tempData when workData changes (after fetch)
  React.useEffect(() => {
    setTempData(workData);
  }, [workData]);

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-gray-200 rounded w-1/4"></div>
            <div className="h-10 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded w-1/4"></div>
            <div className="h-10 bg-gray-200 rounded"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="h-5 w-5" />
            {t('workData')}
          </CardTitle>
          <CardDescription>
            {t('workDataDescription')}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="hourlyWage">{t('hourlyWage')}</Label>
            <div className="relative">
              <Input
                id="hourlyWage"
                type="number"
                min="0"
                step="0.5"
                value={tempData.hourly_wage || ''}
                onChange={(e) => setTempData({
                  ...tempData,
                  hourly_wage: e.target.value ? parseFloat(e.target.value) : null
                })}
                placeholder={t('enterHourlyWage')}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="phoneNumber">{t('phoneNumber')}</Label>
            <div className="flex gap-2">
              <Select
                value={tempData.phone_country_code}
                onValueChange={(value) => setTempData({
                  ...tempData,
                  phone_country_code: value
                })}
              >
                <SelectTrigger className="w-48">
                  <SelectValue placeholder={t('countryCode')} />
                </SelectTrigger>
                <SelectContent>
                  {countryOptions.map((option) => (
                    <SelectItem key={option.code} value={option.code}>
                      <span className="flex items-center gap-2">
                        <span>{option.flag}</span>
                        <span>{option.label}</span>
                      </span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <div className="relative flex-1">
                <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="phoneNumber"
                  type="tel"
                  value={tempData.phone_number}
                  onChange={(e) => setTempData({
                    ...tempData,
                    phone_number: e.target.value
                  })}
                  placeholder={t('enterPhoneNumber')}
                  className="pl-10"
                />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="workplaceLocation">{t('workplaceLocation')}</Label>
            <div className="relative">
              <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="workplaceLocation"
                value={tempData.workplace_location}
                onChange={(e) => setTempData({
                  ...tempData,
                  workplace_location: e.target.value
                })}
                placeholder={t('enterWorkplaceLocation')}
                className="pl-10"
              />
            </div>
          </div>

          <div className="flex justify-end">
            <Button onClick={handleSave} disabled={loading}>
              {loading ? t('savingSettings') : t('save')}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProfileWorkData;
