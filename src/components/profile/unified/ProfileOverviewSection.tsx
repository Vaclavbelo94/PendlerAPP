
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuth } from '@/hooks/auth';
import { Edit, Save, X } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import RideRequestsSection from '@/components/profile/RideRequestsSection';

export interface ProfileOverviewSectionProps {
  onEdit?: () => void;
  onSave?: () => void;
  onCancel?: () => void;
  isEditing?: boolean;
}

const ProfileOverviewSection: React.FC<ProfileOverviewSectionProps> = ({
  onEdit = () => {},
  onSave = () => {},
  onCancel = () => {},
  isEditing = false
}) => {
  const { user } = useAuth();
  const { t } = useTranslation('profile');

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>{t('basicInfo')}</CardTitle>
              {!isEditing ? (
                <Button onClick={onEdit} variant="outline" size="sm">
                  <Edit className="h-4 w-4 mr-2" />
                  {t('edit')}
                </Button>
              ) : (
                <div className="flex gap-2">
                  <Button onClick={onSave} size="sm">
                    <Save className="h-4 w-4 mr-2" />
                    {t('save')}
                  </Button>
                  <Button onClick={onCancel} variant="outline" size="sm">
                    <X className="h-4 w-4 mr-2" />
                    {t('cancel')}
                  </Button>
                </div>
              )}
            </div>
            <CardDescription>
              {t('basicInfoManage')}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium">{t('email')}</label>
              <p className="text-sm text-muted-foreground">{user?.email}</p>
            </div>
            <div>
              <label className="text-sm font-medium">{t('username')}</label>
              <p className="text-sm text-muted-foreground">
                {user?.user_metadata?.username || t('notSet')}
              </p>
            </div>
            <div>
              <label className="text-sm font-medium">{t('registration')}</label>
              <p className="text-sm text-muted-foreground">
                {user?.created_at ? new Date(user.created_at).toLocaleDateString('cs-CZ') : t('unknown')}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{t('statistics')}</CardTitle>
            <CardDescription>
              {t('activityOverview')}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between">
              <span className="text-sm">{t('shiftsCount')}</span>
              <span className="text-sm font-medium">0</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm">{t('vehicles')}</span>
              <span className="text-sm font-medium">0</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm">{t('activeSince')}</span>
              <span className="text-sm font-medium">
                {user?.created_at ? new Date(user.created_at).toLocaleDateString('cs-CZ') : t('unknown')}
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Ride Requests Section */}
      <RideRequestsSection />
    </div>
  );
};

export default ProfileOverviewSection;
