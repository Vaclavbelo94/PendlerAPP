
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useWorkData } from "@/hooks/useWorkData";
import { useAddressAutocomplete } from "@/hooks/useAddressAutocomplete";
import { useTranslation } from 'react-i18next';
import { DollarSign, Phone, MapPin } from 'lucide-react';

const ProfileWorkData = () => {
  const { t } = useTranslation('profile');
  const { workData, loading, saveWorkData, setWorkData } = useWorkData();
  const [tempData, setTempData] = useState(workData);
  const [addressQuery, setAddressQuery] = useState('');
  const { suggestions, loading: addressLoading } = useAddressAutocomplete(addressQuery);

  const countryOptions = [
    { code: 'CZ', label: 'Česká republika (+420)', flag: '🇨🇿' },
    { code: 'DE', label: 'Deutschland (+49)', flag: '🇩🇪' },
    { code: 'PL', label: 'Polska (+48)', flag: '🇵🇱' }
  ];

  // Hodinové mzdy v eurech pro německý trh
  const hourlyWageOptions = [
    { value: 12, label: '12,00 €' },
    { value: 13, label: '13,00 €' },
    { value: 14, label: '14,00 €' },
    { value: 15, label: '15,00 €' },
    { value: 16, label: '16,00 €' },
    { value: 17, label: '17,00 €' },
    { value: 18, label: '18,00 €' },
    { value: 19, label: '19,00 €' },
    { value: 20, label: '20,00 €' },
    { value: 22, label: '22,00 €' },
    { value: 25, label: '25,00 €' },
    { value: 28, label: '28,00 €' },
    { value: 30, label: '30,00 €' },
    { value: 35, label: '35,00 €' },
    { value: 40, label: '40,00 €' },
  ];

  const handleSave = async () => {
    const success = await saveWorkData(tempData);
    if (success) {
      setWorkData(tempData);
    }
  };

  const handleAddressSelect = (suggestion: any) => {
    setTempData({
      ...tempData,
      workplace_location: suggestion.display_name
    });
    setAddressQuery('');
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
            <Label htmlFor="hourlyWage">{t('hourlyWage')} (EUR)</Label>
            <Select
              value={tempData.hourly_wage?.toString() || ''}
              onValueChange={(value) => setTempData({
                ...tempData,
                hourly_wage: parseFloat(value)
              })}
            >
              <SelectTrigger>
                <SelectValue placeholder={t('enterHourlyWage')} />
              </SelectTrigger>
              <SelectContent>
                {hourlyWageOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value.toString()}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
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
              <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground z-10" />
              <Input
                id="workplaceLocation"
                value={addressQuery || tempData.workplace_location}
                onChange={(e) => {
                  setAddressQuery(e.target.value);
                  setTempData({
                    ...tempData,
                    workplace_location: e.target.value
                  });
                }}
                placeholder={t('enterWorkplaceLocation')}
                className="pl-10"
              />
              {addressQuery && suggestions.length > 0 && (
                <div className="absolute z-50 w-full mt-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md shadow-lg max-h-60 overflow-auto">
                  {suggestions.map((suggestion) => (
                    <button
                      key={suggestion.place_id}
                      type="button"
                      className="w-full px-4 py-3 text-left hover:bg-gray-100 dark:hover:bg-gray-700 focus:bg-gray-100 dark:focus:bg-gray-700 text-sm border-b border-gray-100 dark:border-gray-700 last:border-b-0 transition-colors"
                      onClick={() => handleAddressSelect(suggestion)}
                    >
                      <div className="flex items-start gap-2">
                        <MapPin className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                        <span className="text-gray-900 dark:text-gray-100 break-words">
                          {suggestion.display_name}
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              )}
              {addressLoading && (
                <div className="absolute right-3 top-3 z-10">
                  <div className="animate-spin h-4 w-4 border-2 border-gray-300 border-t-blue-600 rounded-full"></div>
                </div>
              )}
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
