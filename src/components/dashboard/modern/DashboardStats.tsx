import React, { useState } from 'react';
import { useAuth } from '@/hooks/auth';
import { useTranslation } from 'react-i18next';
import { useShiftsData } from '@/hooks/shifts/useShiftsData';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Clock, Calendar, Euro, TrendingUp, ChevronDown, ChevronUp } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const DashboardStats: React.FC = () => {
  const { user } = useAuth();
  const { t } = useTranslation(['dashboard']);
  const { shifts, isLoading } = useShiftsData({ userId: user?.id });
  const [isExpanded, setIsExpanded] = useState(false);

  // Calculate real statistics from shifts data
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();
  
  const monthlyShifts = shifts.filter(shift => {
    const shiftDate = new Date(shift.date);
    return shiftDate.getMonth() === currentMonth && shiftDate.getFullYear() === currentYear;
  });

  const weeklyHours = shifts
    .filter(shift => {
      const shiftDate = new Date(shift.date);
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      return shiftDate >= weekAgo;
    })
    .reduce((total, shift) => {
      if (shift.start_time && shift.end_time) {
        const start = new Date(`1970-01-01T${shift.start_time}`);
        const end = new Date(`1970-01-01T${shift.end_time}`);
        return total + (end.getTime() - start.getTime()) / (1000 * 60 * 60);
      }
      return total;
    }, 0);

  // Calculate total earnings based on actual shift hours (simplified calculation)
  const totalEarnings = shifts.reduce((total, shift) => {
    if (shift.start_time && shift.end_time) {
      const start = new Date(`1970-01-01T${shift.start_time}`);
      const end = new Date(`1970-01-01T${shift.end_time}`);
      const hours = (end.getTime() - start.getTime()) / (1000 * 60 * 60);
      // Using estimated hourly rate for Czech Republic (average minimum wage)
      return total + hours * 120; // 120 CZK per hour estimate
    }
    return total;
  }, 0);

  const stats = [
    {
      icon: Clock,
      label: t('dashboard:weeklyHours'),
      value: isLoading ? '...' : `${Math.round(weeklyHours)}h`,
      trend: weeklyHours > 0 ? '+' : '',
      color: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      icon: Calendar,
      label: t('dashboard:monthlyShifts'),
      value: isLoading ? '...' : monthlyShifts.length.toString(),
      trend: monthlyShifts.length > 0 ? '+' : '',
      color: 'text-green-600',
      bgColor: 'bg-green-50'
    },
    {
      icon: Euro,
      label: t('dashboard:totalEarnings'),
      value: isLoading ? '...' : `${Math.round(totalEarnings)}€`,
      trend: totalEarnings > 0 ? '+' : '',
      color: 'text-purple-600',
      bgColor: 'bg-purple-50'
    }
  ];

  return (
    <div className="mt-8">
      {/* Expandable Statistics Section */}
      <Card className="bg-card/80 backdrop-blur-sm border border-border/50">
        <CardContent className="p-6">
          <Button
            variant="ghost"
            onClick={() => setIsExpanded(!isExpanded)}
            className="w-full flex items-center justify-between p-0 h-auto font-semibold text-lg"
          >
            <span>{t('dashboard:statistics')}</span>
            {isExpanded ? (
              <ChevronUp className="h-5 w-5" />
            ) : (
              <ChevronDown className="h-5 w-5" />
            )}
          </Button>

          <AnimatePresence>
            {isExpanded && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3, ease: 'easeInOut' }}
                className="overflow-hidden"
              >
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                  {stats.map((stat, index) => (
                    <motion.div
                      key={stat.label}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1, duration: 0.4 }}
                    >
                      <Card className="bg-card border border-border/30">
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between mb-3">
                            <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                              <stat.icon className={`h-5 w-5 ${stat.color}`} />
                            </div>
                            {stat.trend && (
                              <div className="flex items-center text-green-600">
                                <TrendingUp className="h-3 w-3 mr-1" />
                                <span className="text-xs font-medium">{stat.trend}</span>
                              </div>
                            )}
                          </div>
                          
                          <div className="space-y-1">
                            {isLoading ? (
                              <Skeleton className="h-6 w-12" />
                            ) : (
                              <div className="text-xl font-bold text-foreground">
                                {stat.value}
                              </div>
                            )}
                            <div className="text-xs font-medium text-muted-foreground">
                              {stat.label}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardStats;