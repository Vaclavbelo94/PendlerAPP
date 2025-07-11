
import React from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { CheckCircle } from "lucide-react";
import { useTranslation } from 'react-i18next';
import CityAutocomplete from "@/components/common/CityAutocomplete";

interface PersonalInfoFormProps {
  displayName: string;
  bio: string;
  location: string;
  website: string;
  filledFields: Record<string, boolean>;
  handleInputChange: (field: string, value: string) => void;
}

const PersonalInfoForm = ({
  displayName,
  bio,
  location,
  website,
  filledFields,
  handleInputChange,
}: PersonalInfoFormProps) => {
  const { t } = useTranslation('profile');

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">{t('personalInfo') || 'Osobní údaje'}</h3>
      
      <div className="space-y-2 relative">
        <Label htmlFor="displayName">{t('displayName') || 'Zobrazované jméno'}</Label>
        <div className="relative">
          <Input
            id="displayName"
            value={displayName}
            onChange={(e) => handleInputChange('displayName', e.target.value)}
            placeholder={t('enterYourName') || 'Zadejte své jméno'}
            className={filledFields.displayName ? "pr-10" : ""}
          />
          {filledFields.displayName && (
            <CheckCircle className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-green-500" />
          )}
        </div>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="bio">{t('aboutMe') || 'O mně'}</Label>
        <div className="relative">
          <Textarea
            id="bio"
            value={bio}
            onChange={(e) => handleInputChange('bio', e.target.value)}
            placeholder={t('writeSomethingAboutYourself') || 'Napište něco o sobě'}
            className={filledFields.bio ? "pr-10" : ""}
          />
          {filledFields.bio && (
            <CheckCircle className="absolute right-3 top-3 h-5 w-5 text-green-500" />
          )}
        </div>
        <p className="text-sm text-muted-foreground">
          {t('shortDescriptionForProfile') || 'Stručný popis pro váš profil'}
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="location">{t('residence') || 'Bydliště'}</Label>
          <CityAutocomplete
            id="location"
            value={location}
            onChange={(value) => handleInputChange('location', value)}
            placeholder={t('locationPlaceholder') || 'Město, země'}
            showCheckIcon={filledFields.location}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="website">{t('website') || 'Webová stránka'}</Label>
          <div className="relative">
            <Input
              id="website"
              value={website}
              onChange={(e) => handleInputChange('website', e.target.value)}
              placeholder="https://example.com"
              className={filledFields.website ? "pr-10" : ""}
            />
            {filledFields.website && (
              <CheckCircle className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-green-500" />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PersonalInfoForm;
