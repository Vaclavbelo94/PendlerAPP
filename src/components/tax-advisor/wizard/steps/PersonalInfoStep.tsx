
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { User, Mail, MapPin, FileText, Calendar } from 'lucide-react';
import { PersonalInfo } from '../types';
import { useTranslation } from 'react-i18next';

interface PersonalInfoStepProps {
  data: PersonalInfo;
  onChange: (data: PersonalInfo) => void;
}

const PersonalInfoStep: React.FC<PersonalInfoStepProps> = ({ data, onChange }) => {
  const { t } = useTranslation('taxAdvisor');
  
  const handleChange = (field: keyof PersonalInfo, value: string) => {
    onChange({ ...data, [field]: value });
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <User className="h-5 w-5" />
          {t('wizard.personalInfo.title')}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="firstName">{t('wizard.personalInfo.firstName')}</Label>
            <Input
              id="firstName"
              placeholder={t('wizard.personalInfo.firstName')}
              value={data.firstName}
              onChange={(e) => handleChange('firstName', e.target.value)}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="lastName">{t('wizard.personalInfo.lastName')}</Label>
            <Input
              id="lastName"
              placeholder={t('wizard.personalInfo.lastName')}
              value={data.lastName}
              onChange={(e) => handleChange('lastName', e.target.value)}
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="address" className="flex items-center gap-2">
            <MapPin className="h-4 w-4" />
            {t('wizard.personalInfo.address')}
          </Label>
          <Input
            id="address"
            placeholder={t('wizard.personalInfo.address')}
            value={data.address}
            onChange={(e) => handleChange('address', e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="taxId" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            {t('wizard.personalInfo.taxId')}
          </Label>
          <Input
            id="taxId"
            placeholder="Steuerliche Identifikationsnummer"
            value={data.taxId}
            onChange={(e) => handleChange('taxId', e.target.value)}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="email" className="flex items-center gap-2">
              <Mail className="h-4 w-4" />
              {t('wizard.personalInfo.email')}
            </Label>
            <Input
              id="email"
              type="email"
              placeholder={t('wizard.personalInfo.email')}
              value={data.email}
              onChange={(e) => handleChange('email', e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="dateOfBirth" className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              {t('wizard.personalInfo.dateOfBirth')}
            </Label>
            <Input
              id="dateOfBirth"
              type="date"
              value={data.dateOfBirth}
              onChange={(e) => handleChange('dateOfBirth', e.target.value)}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PersonalInfoStep;
