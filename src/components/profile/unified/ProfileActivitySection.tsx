
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { 
  ActivityIcon, PieChartIcon, CalendarIcon, BookOpenIcon,
  TrendingUpIcon, ClockIcon
} from "lucide-react";
import { useTranslation } from 'react-i18next';
import UserActivityChart from "../UserActivityChart";

const ProfileActivitySection = () => {
  const [showStatistics, setShowStatistics] = useState(false);
  const { t } = useTranslation('profile');

  const activityStats = [
    {
      title: t('totalShifts'),
      value: "24",
      change: `+3 ${t('thisMonth')}`,
      icon: CalendarIcon,
      color: "text-blue-600"
    },
    {
      title: t('germanStudy'),
      value: "18h",
      change: `+2h ${t('thisWeek')}`,
      icon: BookOpenIcon,
      color: "text-green-600"
    },
    {
      title: t('activeDays'),
      value: "15",
      change: t('last30Days'),
      icon: ActivityIcon,
      color: "text-purple-600"
    },
    {
      title: t('averageTime'),
      value: "1.2h",
      change: t('perShift'),
      icon: ClockIcon,
      color: "text-orange-600"
    }
  ];

  return (
    <div className="space-y-6">
      {/* Ovládání zobrazení */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ActivityIcon className="h-5 w-5" />
            {t('activityAndStatistics')}
          </CardTitle>
          <CardDescription>
            {t('trackProgressDescription')}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="show-stats" className="text-base font-medium">
                {t('showDetailedStatistics')}
              </Label>
              <p className="text-sm text-muted-foreground mt-1">
                {t('showStatisticsDescription')}
              </p>
            </div>
            <Switch 
              id="show-stats"
              checked={showStatistics}
              onCheckedChange={setShowStatistics}
            />
          </div>
        </CardContent>
      </Card>

      {/* Rychlé statistiky */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {activityStats.map((stat, index) => (
          <Card key={index}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    {stat.title}
                  </p>
                  <p className="text-2xl font-bold mt-1">{stat.value}</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    {stat.change}
                  </p>
                </div>
                <stat.icon className={`h-8 w-8 ${stat.color}`} />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Detailní statistiky */}
      {showStatistics && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUpIcon className="h-5 w-5" />
                  {t('activityOverTime')}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <UserActivityChart />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <PieChartIcon className="h-5 w-5" />
                  {t('languageSkills')}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-muted-foreground text-center py-8">
                  {t('languageStatsNotAvailable')}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Nedávná aktivita */}
          <Card>
            <CardHeader>
              <CardTitle>{t('recentActivity')}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  {
                    action: t('shiftCompleted'),
                    detail: `München - ${t('morningShift')}`,
                    time: t('hoursAgo'),
                    type: "shift"
                  },
                  {
                    action: t('germanStudy'),
                    detail: `15 ${t('newWordsLearned')}`,
                    time: t('yesterday'),
                    type: "language"
                  },
                  {
                    action: t('profileUpdated'),
                    detail: t('workPreferencesChanged'),
                    time: t('daysAgo'),
                    type: "profile"
                  }
                ].map((activity, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className={`w-2 h-2 rounded-full ${
                        activity.type === 'shift' ? 'bg-blue-500' :
                        activity.type === 'language' ? 'bg-green-500' :
                        'bg-purple-500'
                      }`} />
                      <div>
                        <p className="font-medium">{activity.action}</p>
                        <p className="text-sm text-muted-foreground">{activity.detail}</p>
                      </div>
                    </div>
                    <Badge variant="secondary">{activity.time}</Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default ProfileActivitySection;
