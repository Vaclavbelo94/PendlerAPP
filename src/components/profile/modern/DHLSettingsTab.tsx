import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Building2, MapPin, Calendar, Download, Settings } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useAuth } from '@/hooks/auth';
import { useDHLData } from '@/hooks/dhl/useDHLData';
import { useToast } from '@/hooks/use-toast';
import { CalendarSyncComponent } from './CalendarSyncComponent';

export const DHLSettingsTab: React.FC = () => {
  const { t } = useTranslation('profile');
  const { user, unifiedUser } = useAuth();
  const { userAssignment, positions, isLoading } = useDHLData(user?.id);
  const { toast } = useToast();
  const [showCalendarSync, setShowCalendarSync] = useState(false);

  if (!unifiedUser?.isDHLEmployee) {
    return null;
  }

  const currentPosition = positions?.find(p => p.id === userAssignment?.dhl_position_id);

  const handleExportCalendar = () => {
    setShowCalendarSync(true);
  };

  if (isLoading) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="bg-card/80 backdrop-blur-sm border border-border/50 shadow-lg">
          <CardContent className="p-8">
            <div className="text-center">
              <div className="animate-pulse">
                <div className="h-4 bg-muted rounded w-3/4 mx-auto mb-4"></div>
                <div className="h-4 bg-muted rounded w-1/2 mx-auto"></div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      {/* Header Card */}
      <Card className="bg-gradient-to-r from-blue-500/10 to-indigo-600/10 border border-border/50">
        <CardHeader className="pb-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-gradient-to-r from-blue-500/20 to-indigo-600/20 rounded-lg">
              <Building2 className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <CardTitle className="text-xl">{t('dhlSettings')}</CardTitle>
              <CardDescription>{t('dhlSettingsDescription')}</CardDescription>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Current DHL Assignment */}
      <Card className="bg-card/80 backdrop-blur-sm border border-border/50 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5 text-primary" />
            {t('currentSettings')}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {dhlAssignment ? (
            <>
              {/* Position Information */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">{t('position')}</span>
                  </div>
                  <Badge variant="secondary">
                    {dhlPosition?.name || t('position')}
                  </Badge>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">Woche</span>
                  </div>
                  <Badge variant="outline">
                    {dhlAssignment.current_woche || t('notSet')}
                  </Badge>
                </div>
              </div>

              <Separator />

              {/* Assignment Details */}
              <div className="space-y-2">
                <div className="text-sm text-muted-foreground">
                  <div className="flex justify-between">
                    <span>{t('assignedAt')}:</span>
                    <span>{new Date(dhlAssignment.assigned_at).toLocaleDateString('cs-CZ')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>{t('lastUpdated')}:</span>
                    <span>{new Date(dhlAssignment.updated_at).toLocaleDateString('cs-CZ')}</span>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="text-center py-6 text-muted-foreground">
              <Building2 className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p className="font-medium">{t('noDHLSetup')}</p>
              <p className="text-sm">{t('contactAdminForSetup')}</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Calendar Sync */}
      <Card className="bg-card/80 backdrop-blur-sm border border-border/50 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-primary" />
            {t('calendarSync')}
          </CardTitle>
          <CardDescription>
            {t('calendarSyncDescription')}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button
            onClick={handleExportCalendar}
            className="w-full bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90"
            disabled={!userAssignment}
          >
            <Download className="h-4 w-4 mr-2" />
            {t('exportCalendar')}
          </Button>
        </CardContent>
      </Card>

      {/* Calendar Sync Modal */}
      {showCalendarSync && (
        <CalendarSyncComponent
          isOpen={showCalendarSync}
          onClose={() => setShowCalendarSync(false)}
        />
      )}
    </motion.div>
  );
};