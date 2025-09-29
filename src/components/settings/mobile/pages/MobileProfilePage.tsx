import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { User, Mail, Phone, MapPin, Crown, Shield, ChevronRight, Edit } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/hooks/auth';
import { cn } from '@/lib/utils';

const MobileProfilePage = () => {
  const { t } = useTranslation('settings');
  const { unifiedUser } = useAuth();
  
  const profileItems = [
    {
      id: 'personal-info',
      label: t('personalInfo'),
      description: t('personalInfoDesc'),
      icon: User,
      action: () => console.log('Edit personal info')
    },
    {
      id: 'contact',
      label: t('contactInfo'),
      description: t('contactInfoDesc'),
      icon: Mail,
      action: () => console.log('Edit contact info')
    },
    {
      id: 'address',
      label: t('address'),
      description: t('addressDesc'),
      icon: MapPin,
      action: () => console.log('Edit address')
    },
    {
      id: 'change-password',
      label: t('changePassword'),
      description: t('changePasswordDesc'),
      icon: Shield,
      action: () => console.log('Change password')
    }
  ];

  return (
    <div className="p-4 space-y-6">
      {/* User Info Card */}
      <div className="bg-card border rounded-lg p-4">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
            <User className="h-6 w-6 text-primary" />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold">{unifiedUser?.email || t('guest')}</h3>
            <div className="flex items-center gap-2 mt-1">
              <Badge variant="secondary" className="text-xs">
                <Crown className="h-3 w-3 mr-1" />
                {t('premiumStatus')}
              </Badge>
            </div>
          </div>
        </div>
      </div>

      {/* Profile Actions */}
      <div className="space-y-2">
        {profileItems.map((item) => (
          <Button
            key={item.id}
            variant="ghost"
            size="lg"
            onClick={item.action}
            className="w-full justify-between h-auto py-3 px-4"
          >
            <div className="flex items-center gap-3">
              <item.icon className="h-5 w-5 text-muted-foreground" />
              <div className="text-left">
                <div className="font-medium">{item.label}</div>
                <div className="text-sm text-muted-foreground">
                  {item.description}
                </div>
              </div>
            </div>
            <ChevronRight className="h-5 w-5 text-muted-foreground" />
          </Button>
        ))}
      </div>

      {/* Danger Zone */}
      <div className="bg-destructive/5 border border-destructive/20 rounded-lg p-4">
        <h4 className="font-medium text-destructive mb-2">{t('dangerZone')}</h4>
        <Button
          variant="outline"
          className="w-full justify-start border-destructive/20 text-destructive hover:bg-destructive/10"
          onClick={() => console.log('Delete account')}
        >
          {t('deleteAccount')}
        </Button>
      </div>
    </div>
  );
};

export default MobileProfilePage;