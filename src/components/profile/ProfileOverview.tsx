
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { MobileOptimizedCard } from "@/components/ui/mobile-optimized-card";
import { useIsMobile } from '@/hooks/use-mobile';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from '@/hooks/auth';
import { User, Mail, Calendar, MapPin, Briefcase, Edit2, Save, X } from "lucide-react";
import { useTranslation } from 'react-i18next';
import { useProfileSettings } from './settings/useProfileSettings';
import CityAutocomplete from '@/components/common/CityAutocomplete';
import { useToast } from '@/hooks/use-toast';

interface ProfileOverviewProps {
  onEdit: () => void;
  onSave: () => void;
  onCancel: () => void;
  isEditing: boolean;
}

const ProfileOverview: React.FC<ProfileOverviewProps> = ({ onEdit, onSave, onCancel, isEditing }) => {
  const { user } = useAuth();
  const { t } = useTranslation('profile');
  const { toast } = useToast();
  const { settings, isLoading, isSaving, saveSettings } = useProfileSettings();
  const isMobile = useIsMobile();
  
  const [formData, setFormData] = useState({
    username: '',
    bio: '',
    location: '',
    website: ''
  });

  useEffect(() => {
    if (settings) {
      setFormData({
        username: settings.username || '',
        bio: settings.bio || '',
        location: settings.location || '',
        website: settings.website || ''
      });
    }
  }, [settings]);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = async () => {
    const success = await saveSettings({
      username: formData.username,
      fullName: formData.username,
      bio: formData.bio,
      location: formData.location,
      website: formData.website
    });

    if (success) {
      toast({
        title: t('saveChanges'),
        description: t('saveChanges'),
        variant: "default",
      });
      onSave();
    } else {
      toast({
        title: t('errors:generic', { ns: 'errors' }),
        description: t('errors:saveFailed', { ns: 'errors' }),
        variant: "destructive",
      });
    }
  };

  if (!user) {
    return <p>{isLoading ? t('loading', { ns: 'common' }) : t('errors:loadFailed', { ns: 'errors' })}</p>;
  }

  if (isLoading) {
    return <p>{t('loading', { ns: 'common' })}</p>;
  }

  const CardComponent = isMobile ? MobileOptimizedCard : Card;
  const cardProps = isMobile ? {
    title: t('profileOverview'),
    description: t('basicInfoDescription'),
    compact: true
  } : {};

  return (
    <CardComponent {...cardProps}>
      {!isMobile && (
        <CardHeader>
          <CardTitle>{t('profileOverview')}</CardTitle>
          <CardDescription>{t('basicInfoDescription')}</CardDescription>
        </CardHeader>
      )}
      <CardContent className={`grid gap-6 ${isMobile ? 'p-0' : ''}`}>
        <div className="flex items-center space-x-4">
          <Avatar className="h-12 w-12">
            <AvatarImage src={user.user_metadata?.avatar_url} />
            <AvatarFallback>
              <User className="h-5 w-5" />
            </AvatarFallback>
          </Avatar>
          <div>
            <h2 className="text-lg font-semibold">{formData.username || user.email?.split('@')[0]}</h2>
            <Badge variant="secondary">
              <Mail className="h-3 w-3 mr-1" />
              {user.email}
            </Badge>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="username">{t('username')}</Label>
          {isEditing ? (
            <Input
              id="username"
              value={formData.username}
              onChange={(e) => handleInputChange('username', e.target.value)}
              placeholder={t('enterYourName')}
            />
          ) : (
            <p className="text-sm text-muted-foreground">
              <User className="h-4 w-4 mr-2 inline-block" />
              {formData.username || t('notSet')}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="bio">{t('bio')}</Label>
          {isEditing ? (
            <Textarea
              id="bio"
              value={formData.bio}
              onChange={(e) => handleInputChange('bio', e.target.value)}
              placeholder={t('writeSomethingAboutYourself')}
            />
          ) : (
            <p className="text-sm text-muted-foreground">
              <Briefcase className="h-4 w-4 mr-2 inline-block" />
              {formData.bio || t('notSet')}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="location">{t('location')}</Label>
          {isEditing ? (
            <CityAutocomplete
              id="location"
              value={formData.location}
              onChange={(value) => handleInputChange('location', value)}
              placeholder={t('locationPlaceholder')}
            />
          ) : (
            <p className="text-sm text-muted-foreground">
              <MapPin className="h-4 w-4 mr-2 inline-block" />
              {formData.location || t('notSet')}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="website">{t('website')}</Label>
          {isEditing ? (
            <Input
              id="website"
              value={formData.website}
              onChange={(e) => handleInputChange('website', e.target.value)}
              placeholder="https://example.com"
            />
          ) : (
            <p className="text-sm text-muted-foreground">
              <Briefcase className="h-4 w-4 mr-2 inline-block" />
              {formData.website || t('notSet')}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label>{t('registrationDate')}</Label>
          <p className="text-sm text-muted-foreground">
            <Calendar className="h-4 w-4 mr-2 inline-block" />
            {user.created_at ? new Date(user.created_at).toLocaleDateString('cs-CZ') : t('notSet')}
          </p>
        </div>

        {!isEditing && (
          <Button onClick={onEdit} className="w-full">
            <Edit2 className="h-4 w-4 mr-2" />
            {t('editProfile')}
          </Button>
        )}

        {isEditing && (
          <div className="flex justify-end space-x-2">
            <Button variant="ghost" onClick={onCancel}>
              <X className="h-4 w-4 mr-2" />
              {t('cancel')}
            </Button>
            <Button onClick={handleSave} disabled={isSaving}>
              <Save className="h-4 w-4 mr-2" />
              {isSaving ? t('saving') : t('save')}
            </Button>
          </div>
        )}
      </CardContent>
    </CardComponent>
  );
};

export default ProfileOverview;
