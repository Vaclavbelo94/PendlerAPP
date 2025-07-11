
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useWorkData } from "@/hooks/useWorkData";
import { useAddressAutocomplete } from "@/hooks/useAddressAutocomplete";
import { useTranslation } from 'react-i18next';
import { useLanguage } from '@/hooks/useLanguage';
import { DollarSign, Phone, MapPin, Home } from 'lucide-react';

const ProfileWorkData = () => {
  const { t } = useTranslation('profile');
  const { language } = useLanguage();
  const { workData, loading, saveWorkData, setWorkData } = useWorkData();
  const [tempData, setTempData] = useState(workData);
  const [workAddressQuery, setWorkAddressQuery] = useState('');
  const [homeAddressQuery, setHomeAddressQuery] = useState('');
  const { suggestions: workSuggestions, loading: workAddressLoading } = useAddressAutocomplete(workAddressQuery);
  const { suggestions: homeSuggestions, loading: homeAddressLoading } = useAddressAutocomplete(homeAddressQuery);

  const countryOptions = [
    { code: 'CZ', label: t('czechRepublic') + ' (+420)', flag: '🇨🇿' },
    { code: 'DE', label: t('germany') + ' (+49)', flag: '🇩🇪' },
    { code: 'PL', label: t('poland') + ' (+48)', flag: '🇵🇱' }
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

  // Automatické nastavení country code podle jazyka při změně jazyka
  useEffect(() => {
    let defaultCountryCode = 'CZ';
    
    switch (language) {
      case 'pl':
        defaultCountryCode = 'PL';
        break;
      case 'de':
        defaultCountryCode = 'DE';
        break;
      case 'cs':
      default:
        defaultCountryCode = 'CZ';
        break;
    }

    // Pokud se data načetla a předvolba není nastavena nebo se liší od očekávané
    if (workData && (!workData.phone_country_code || workData.phone_country_code !== defaultCountryCode)) {
      const updatedData = {
        ...workData,
        phone_country_code: defaultCountryCode
      };
      setWorkData(updatedData);
      setTempData(updatedData);
    }
  }, [language, workData, setWorkData]);

  const handleSave = async () => {
    const success = await saveWorkData(tempData);
    if (success) {
      setWorkData(tempData);
    }
  };

  const handleWorkAddressSelect = (suggestion: any) => {
    setTempData({
      ...tempData,
      workplace_location: suggestion.display_name
    });
    setWorkAddressQuery('');
  };

  const handleHomeAddressSelect = (suggestion: any) => {
    setTempData({
      ...tempData,
      home_address: suggestion.display_name
    });
    setHomeAddressQuery('');
  };

  // Update tempData when workData changes (after fetch)
  useEffect(() => {
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
            <Label htmlFor="homeAddress">{t('homeAddress')}</Label>
            <div className="relative">
              <Home className="absolute left-3 top-3 h-4 w-4 text-muted-foreground z-10" />
              <Input
                id="homeAddress"
                value={homeAddressQuery || tempData.home_address}
                onChange={(e) => {
                  setHomeAddressQuery(e.target.value);
                  setTempData({
                    ...tempData,
                    home_address: e.target.value
                  });
                }}
                placeholder={t('enterHomeAddress')}
                className="pl-10"
              />
              {homeAddressQuery && homeSuggestions.length > 0 && (
                <div className="absolute z-50 w-full mt-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md shadow-lg max-h-60 overflow-auto">
                  {homeSuggestions.map((suggestion) => (
                    <button
                      key={suggestion.place_id}
                      type="button"
                      className="w-full px-4 py-3 text-left hover:bg-gray-100 dark:hover:bg-gray-700 focus:bg-gray-100 dark:focus:bg-gray-700 text-sm border-b border-gray-100 dark:border-gray-700 last:border-b-0 transition-colors"
                      onClick={() => handleHomeAddressSelect(suggestion)}
                    >
                      <div className="flex items-start gap-2">
                        <Home className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                        <span className="text-gray-900 dark:text-gray-100 break-words">
                          {suggestion.display_name}
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              )}
              {homeAddressLoading && (
                <div className="absolute right-3 top-3 z-10">
                  <div className="animate-spin h-4 w-4 border-2 border-gray-300 border-t-blue-600 rounded-full"></div>
                </div>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="workplaceLocation">{t('workplaceLocation')}</Label>
            <div className="relative">
              <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground z-10" />
              <Input
                id="workplaceLocation"
                value={workAddressQuery || tempData.workplace_location}
                onChange={(e) => {
                  setWorkAddressQuery(e.target.value);
                  setTempData({
                    ...tempData,
                    workplace_location: e.target.value
                  });
                }}
                placeholder={t('enterWorkplaceLocation')}
                className="pl-10"
              />
              {workAddressQuery && workSuggestions.length > 0 && (
                <div className="absolute z-50 w-full mt-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md shadow-lg max-h-60 overflow-auto">
                  {workSuggestions.map((suggestion) => (
                    <button
                      key={suggestion.place_id}
                      type="button"
                      className="w-full px-4 py-3 text-left hover:bg-gray-100 dark:hover:bg-gray-700 focus:bg-gray-100 dark:focus:bg-gray-700 text-sm border-b border-gray-100 dark:border-gray-700 last:border-b-0 transition-colors"
                      onClick={() => handleWorkAddressSelect(suggestion)}
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
              {workAddressLoading && (
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
