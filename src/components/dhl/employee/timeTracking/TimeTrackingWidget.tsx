import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Clock, 
  Play, 
  Square, 
  Coffee, 
  MapPin,
  Timer
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/auth';
import { toast } from '@/hooks/use-toast';

interface TimeEntry {
  id?: string;
  user_id?: string;
  date: string;
  clock_in_time?: string;
  clock_out_time?: string;
  break_start?: string;
  break_end?: string;
  break_duration_minutes: number;
  total_hours?: number;
  overtime_hours?: number;
  status: 'active' | 'completed' | 'cancelled';
  location?: any;
  notes?: string;
  created_at?: string;
  updated_at?: string;
}

interface TimeTrackingWidgetProps {
  className?: string;
}

export const TimeTrackingWidget: React.FC<TimeTrackingWidgetProps> = ({ 
  className = '' 
}) => {
  const { t } = useTranslation('dhl-employee');
  const { user } = useAuth();
  const [currentEntry, setCurrentEntry] = useState<TimeEntry | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());

  // Aktualizace času každou sekundu
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Načtení dnešního záznamu při mount
  useEffect(() => {
    if (user) {
      loadTodaysEntry();
    }
  }, [user]);

  const loadTodaysEntry = async () => {
    if (!user) return;
    
    const today = new Date().toISOString().split('T')[0];
    
    const { data, error } = await supabase
      .from('dhl_time_entries')
      .select('*')
      .eq('user_id', user.id)
      .eq('date', today)
      .single();

    if (error && error.code !== 'PGRST116') {
      console.error('Error loading time entry:', error);
      return;
    }

    if (data) {
      setCurrentEntry(data as TimeEntry);
    }
  };

  const getWorkStatus = () => {
    if (!currentEntry) return 'notStarted';
    if (currentEntry.break_start && !currentEntry.break_end) return 'onBreak';
    if (currentEntry.clock_in_time && !currentEntry.clock_out_time) return 'working';
    if (currentEntry.clock_out_time) return 'finished';
    return 'notStarted';
  };

  const calculateTotalHours = () => {
    if (!currentEntry?.clock_in_time) return 0;
    
    const clockIn = new Date(currentEntry.clock_in_time);
    const clockOut = currentEntry.clock_out_time 
      ? new Date(currentEntry.clock_out_time)
      : new Date();
    
    const totalMs = clockOut.getTime() - clockIn.getTime();
    const totalHours = totalMs / (1000 * 60 * 60);
    const breakHours = (currentEntry.break_duration_minutes || 0) / 60;
    
    return Math.max(0, totalHours - breakHours);
  };

  const handleClockIn = async () => {
    if (!user) return;
    
    setIsLoading(true);
    try {
      const now = new Date().toISOString();
      const today = new Date().toISOString().split('T')[0];
      
      // Získání polohy (volitelné)
      let location = null;
      if (navigator.geolocation) {
        try {
          const position = await new Promise<GeolocationPosition>((resolve, reject) => {
            navigator.geolocation.getCurrentPosition(resolve, reject, {
              timeout: 5000,
              enableHighAccuracy: false
            });
          });
          
          location = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            timestamp: now
          };
        } catch (error) {
          console.log('Location not available:', error);
        }
      }

      const newEntry = {
        user_id: user.id,
        date: today,
        clock_in_time: now,
        break_duration_minutes: 0,
        status: 'active' as const,
        location
      };

      const { data, error } = await supabase
        .from('dhl_time_entries')
        .insert(newEntry)
        .select()
        .single();

      if (error) throw error;

      setCurrentEntry(data as TimeEntry);
      toast({
        title: t('common.success'),
        description: `${t('timeTracking.clockIn')} - ${currentTime.toLocaleTimeString()}`,
      });
    } catch (error) {
      console.error('Clock in error:', error);
      toast({
        title: t('common.error'),
        description: 'Chyba při příchodu',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleClockOut = async () => {
    if (!currentEntry) return;
    
    setIsLoading(true);
    try {
      const now = new Date().toISOString();
      const totalHours = calculateTotalHours();
      const overtimeHours = Math.max(0, totalHours - 8);

      const { error } = await supabase
        .from('dhl_time_entries')
        .update({
          clock_out_time: now,
          total_hours: totalHours,
          overtime_hours: overtimeHours,
          status: 'completed'
        })
        .eq('id', currentEntry.id);

      if (error) throw error;

      setCurrentEntry(prev => prev ? {
        ...prev,
        clock_out_time: now,
        total_hours: totalHours,
        overtime_hours: overtimeHours,
        status: 'completed' as const
      } : null);

      toast({
        title: t('common.success'),
        description: `${t('timeTracking.clockOut')} - ${currentTime.toLocaleTimeString()}`,
      });
    } catch (error) {
      console.error('Clock out error:', error);
      toast({
        title: t('common.error'),
        description: 'Chyba při odchodu',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleBreakToggle = async () => {
    if (!currentEntry) return;
    
    setIsLoading(true);
    try {
      const now = new Date().toISOString();
      const isOnBreak = currentEntry.break_start && !currentEntry.break_end;

      let updateData: Partial<TimeEntry>;

      if (isOnBreak) {
        // Ukončit přestávku
        const breakStart = new Date(currentEntry.break_start!);
        const breakEnd = new Date(now);
        const breakDuration = Math.round((breakEnd.getTime() - breakStart.getTime()) / (1000 * 60));
        
        updateData = {
          break_end: now,
          break_duration_minutes: (currentEntry.break_duration_minutes || 0) + breakDuration
        };
      } else {
        // Začít přestávku
        updateData = {
          break_start: now,
          break_end: null
        };
      }

      const { error } = await supabase
        .from('dhl_time_entries')
        .update(updateData)
        .eq('id', currentEntry.id);

      if (error) throw error;

      setCurrentEntry(prev => prev ? { ...prev, ...updateData } : null);

      toast({
        title: t('common.success'),
        description: isOnBreak ? t('timeTracking.endBreak') : t('timeTracking.startBreak'),
      });
    } catch (error) {
      console.error('Break toggle error:', error);
      toast({
        title: t('common.error'),
        description: 'Chyba při změně přestávky',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const workStatus = getWorkStatus();
  const totalHours = calculateTotalHours();
  const isOnBreak = workStatus === 'onBreak';

  return (
    <Card className={`${className} overflow-hidden`}>
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2">
          <Clock className="h-5 w-5 text-primary" />
          {t('timeTracking.title')}
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Status Badge */}
        <div className="flex items-center justify-between">
          <Badge 
            variant={workStatus === 'working' ? 'default' : 
                    workStatus === 'onBreak' ? 'secondary' :
                    workStatus === 'finished' ? 'outline' : 'secondary'}
            className="text-sm px-3 py-1"
          >
            {t(`timeTracking.status.${workStatus}`)}
          </Badge>
          
          <div className="text-sm text-muted-foreground">
            {currentTime.toLocaleTimeString()}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <AnimatePresence mode="wait">
            {workStatus === 'notStarted' && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="sm:col-span-3"
              >
                <Button
                  onClick={handleClockIn}
                  disabled={isLoading}
                  className="w-full h-12 text-lg bg-green-600 hover:bg-green-700"
                  size="lg"
                >
                  <Play className="h-5 w-5 mr-2" />
                  {t('timeTracking.clockIn')}
                </Button>
              </motion.div>
            )}

            {(workStatus === 'working' || workStatus === 'onBreak') && (
              <>
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                >
                  <Button
                    onClick={handleClockOut}
                    disabled={isLoading}
                    variant="destructive"
                    className="w-full h-12"
                  >
                    <Square className="h-4 w-4 mr-2" />
                    {t('timeTracking.clockOut')}
                  </Button>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="sm:col-span-2"
                >
                  <Button
                    onClick={handleBreakToggle}
                    disabled={isLoading}
                    variant={isOnBreak ? "default" : "outline"}
                    className="w-full h-12"
                  >
                    <Coffee className="h-4 w-4 mr-2" />
                    {isOnBreak ? t('timeTracking.endBreak') : t('timeTracking.startBreak')}
                  </Button>
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>

        {/* Statistics */}
        {currentEntry && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="grid grid-cols-2 gap-4 pt-4 border-t"
          >
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">
                {totalHours.toFixed(2)}h
              </div>
              <div className="text-sm text-muted-foreground">
                {t('timeTracking.totalHours')}
              </div>
            </div>
            
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">
                {Math.round((currentEntry.break_duration_minutes || 0))}min
              </div>
              <div className="text-sm text-muted-foreground">
                {t('timeTracking.breakDuration')}
              </div>
            </div>
          </motion.div>
        )}

        {/* Location indicator */}
        {currentEntry?.location && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <MapPin className="h-4 w-4" />
            {t('timeTracking.location')}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default TimeTrackingWidget;