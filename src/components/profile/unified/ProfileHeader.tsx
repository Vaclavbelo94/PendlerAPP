
import React from 'react';
import { useAuth } from '@/hooks/auth';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Crown, Shield, User } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export const ProfileHeader: React.FC = () => {
  const { user, unifiedUser } = useAuth();
  const { t } = useTranslation('profile');

  return (
    <div className="bg-gradient-to-r from-primary/10 to-accent/10 border-b">
      <div className="container py-8 max-w-6xl">
        <Card className="bg-background/80 backdrop-blur-sm border border-border/50 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                <User className="h-8 w-8 text-primary" />
              </div>
              <div className="flex-1">
                <h1 className="text-2xl font-bold">
                  {user?.user_metadata?.username || user?.email?.split('@')[0] || t('user')}
                </h1>
                <p className="text-muted-foreground">{user?.email}</p>
                <div className="flex gap-2 mt-2">
                  {unifiedUser?.isPremium && (
                    <Badge className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white">
                      <Crown className="h-3 w-3 mr-1" />
                      {t('premium')}
                    </Badge>
                  )}
                  {unifiedUser?.isAdmin && (
                    <Badge variant="secondary">
                      <Shield className="h-3 w-3 mr-1" />
                      {t('admin')}
                    </Badge>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ProfileHeader;
