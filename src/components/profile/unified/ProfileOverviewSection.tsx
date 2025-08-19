import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { User, Calendar, Mail, Crown, Shield, Clock } from "lucide-react";
import { useAuth } from "@/hooks/auth";
import { useTranslation } from 'react-i18next';
import { format } from "date-fns";
import { cs, de, pl } from "date-fns/locale";
import RideRequestsSection from "../RideRequestsSection";

const ProfileOverviewSection = () => {
  const { user, unifiedUser } = useAuth();
  const { t, i18n } = useTranslation('profile');

  const getLocale = () => {
    switch (i18n.language) {
      case 'de': return de;
      case 'pl': return pl;
      default: return cs;
    }
  };

  const formatDate = (dateString: string) => {
    return format(new Date(dateString), 'PPP', { locale: getLocale() });
  };

  const userStats = [
    {
      label: t('totalShifts'),
      value: "24",
      icon: Calendar,
      color: "text-blue-600"
    },
    {
      label: t('activeSince'),
      value: user?.created_at ? formatDate(user.created_at) : t('unknown'),
      icon: Clock,
      color: "text-green-600"
    },
    {
      label: t('accountStatus'),
      value: unifiedUser?.isPremium ? t('premium') : t('standard'),
      icon: unifiedUser?.isPremium ? Crown : User,
      color: unifiedUser?.isPremium ? "text-yellow-600" : "text-gray-600"
    }
  ];

  return (
    <div className="space-y-6">
      {/* Základní informace */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            {t('basicInformation')}
          </CardTitle>
          <CardDescription>
            {t('viewBasicProfileInfo')}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground">{t('email')}</label>
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <span>{user?.email}</span>
              </div>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground">{t('username')}</label>
              <span>{user?.user_metadata?.username || user?.email?.split('@')[0] || t('notSet')}</span>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground">{t('registrationDate')}</label>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span>{user?.created_at ? formatDate(user.created_at) : t('unknown')}</span>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground">{t('accountType')}</label>
              <div className="flex gap-2">
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
                {!unifiedUser?.isPremium && !unifiedUser?.isAdmin && (
                  <Badge variant="outline">
                    <User className="h-3 w-3 mr-1" />
                    {t('standard')}
                  </Badge>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Statistiky */}
      <Card>
        <CardHeader>
          <CardTitle>{t('statistics')}</CardTitle>
          <CardDescription>
            {t('yourActivityOverview')}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {userStats.map((stat, index) => (
              <div key={index} className="flex items-center gap-3 p-4 border rounded-lg">
                <stat.icon className={`h-8 w-8 ${stat.color}`} />
                <div>
                  <p className="text-sm font-medium text-muted-foreground">{stat.label}</p>
                  <p className="text-lg font-semibold">{stat.value}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Sekce pro ride requests */}
      <RideRequestsSection />
    </div>
  );
};

export default ProfileOverviewSection;