import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Building2, Clock, MapPin, User, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';

const MobileDHLPage = () => {
  const { t } = useTranslation('settings');
  const [dhlSettings, setDhlSettings] = useState({
    woche: 'A',
    position: 'Zusteller',
    standort: 'Praha'
  });

  const dhlOptions = [
    {
      id: 'woche',
      label: t('woche'),
      description: t('wocheDesc'),
      icon: Clock,
      value: dhlSettings.woche,
      options: [
        { value: 'A', label: 'Woche A' },
        { value: 'B', label: 'Woche B' }
      ]
    },
    {
      id: 'position',
      label: t('position'),
      description: t('positionDesc'),
      icon: User,
      value: dhlSettings.position,
      options: [
        { value: 'Zusteller', label: 'Zusteller' },
        { value: 'Fahrer', label: 'Fahrer' },
        { value: 'Dispatcher', label: 'Dispatcher' }
      ]
    },
    {
      id: 'standort',
      label: t('location'),
      description: t('locationDesc'),
      icon: MapPin,
      value: dhlSettings.standort,
      options: [
        { value: 'Praha', label: 'Praha' },
        { value: 'Brno', label: 'Brno' },
        { value: 'Ostrava', label: 'Ostrava' }
      ]
    }
  ];

  const handleSettingChange = (key: string, value: string) => {
    setDhlSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };

  return (
    <div className="p-4 space-y-4">
      {/* DHL Header */}
      <div className="bg-yellow-50 dark:bg-yellow-950/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
        <div className="flex items-center gap-2 mb-2">
          <Building2 className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
          <h3 className="font-semibold text-yellow-800 dark:text-yellow-200">
            {t('dhlSettings')}
          </h3>
        </div>
        <p className="text-sm text-yellow-700 dark:text-yellow-300">
          {t('dhlSettingsInfo')}
        </p>
      </div>

      {/* DHL Settings */}
      {dhlOptions.map((option) => (
        <div key={option.id} className="bg-card border rounded-lg p-4">
          <div className="flex items-center gap-3 mb-3">
            <option.icon className="h-5 w-5 text-primary" />
            <div>
              <Label className="font-medium">{option.label}</Label>
              <p className="text-sm text-muted-foreground">{option.description}</p>
            </div>
          </div>
          
          <Select
            value={option.value}
            onValueChange={(value) => handleSettingChange(option.id, value)}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {option.options.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      ))}

      {/* Additional DHL Actions */}
      <div className="space-y-2">
        <Button
          variant="ghost"
          size="lg"
          className="w-full justify-between h-auto py-3 px-4"
          onClick={() => console.log('DHL schedule')}
        >
          <div className="flex items-center gap-3">
            <Clock className="h-5 w-5 text-muted-foreground" />
            <div className="text-left">
              <div className="font-medium">{t('dhlSchedule')}</div>
              <div className="text-sm text-muted-foreground">
                {t('dhlScheduleDesc')}
              </div>
            </div>
          </div>
          <ChevronRight className="h-5 w-5 text-muted-foreground" />
        </Button>
      </div>
    </div>
  );
};

export default MobileDHLPage;