
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Crown, User, Mail } from "lucide-react";
import { useAuth } from "@/hooks/auth";
import { useTranslation } from 'react-i18next';

const ProfileBio = () => {
  const { user, unifiedUser } = useAuth();
  const { t } = useTranslation(['common', 'profile']);

  const getInitials = (email: string) => {
    return email.split('@')[0].slice(0, 2).toUpperCase();
  };

  const getUserDisplayName = (email: string) => {
    return email.split('@')[0];
  };

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex flex-col items-center space-y-4 text-center">
          <Avatar className="h-20 w-20">
            <AvatarImage src="" />
            <AvatarFallback className="text-lg">
              {user?.email ? getInitials(user.email) : <User className="h-8 w-8" />}
            </AvatarFallback>
          </Avatar>
          
          <div className="space-y-3 w-full">
            <div className="space-y-2">
              <h2 className="text-lg font-semibold text-center">
                {user?.email ? getUserDisplayName(user.email) : t('common:user')}
              </h2>
              
              <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                <Mail className="h-3 w-3 flex-shrink-0" />
                <span className="break-all text-xs text-center">{user?.email}</span>
              </div>
            </div>
            
            <div className="flex justify-center">
              {unifiedUser?.isPremium ? (
                <Badge variant="default" className="bg-amber-500 hover:bg-amber-600">
                  <Crown className="h-3 w-3 mr-1" />
                  {t('common:premium')}
                </Badge>
              ) : (
                <Badge variant="secondary">
                  {t('profile:basicAccount')}
                </Badge>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProfileBio;
