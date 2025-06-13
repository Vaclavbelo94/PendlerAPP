
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { 
  Clock, 
  Calendar, 
  TrendingUp, 
  Euro,
  MapPin,
  CheckCircle 
} from 'lucide-react';
import { motion } from 'framer-motion';

interface Shift {
  id: string;
  date: Date | string;
  type: 'morning' | 'afternoon' | 'night';
  notes?: string;
}

interface ShiftsOverviewProps {
  shifts?: Shift[];
  onEditShift?: (shift: Shift) => void;
  onDeleteShift?: (shiftId: string) => void;
}

const ShiftsOverview: React.FC<ShiftsOverviewProps> = ({ 
  shifts = [],
  onEditShift,
  onDeleteShift 
}) => {
  // Mock data - v reálné aplikaci by se načítalo z API nebo používalo real shifts data
  const weeklyStats = {
    hoursWorked: 32,
    plannedHours: 40,
    shiftsCompleted: 4,
    shiftsPlanned: 5,
    earnings: 1280
  };

  const upcomingShifts = [
    {
      id: '1',
      date: 'Zítra',
      time: '06:00 - 14:00',
      type: 'Ranní směna',
      location: 'München, DE',
      status: 'planned'
    },
    {
      id: '2',
      date: 'Pátek',
      time: '14:00 - 22:00',
      type: 'Odpolední směna',
      location: 'Augsburg, DE',
      status: 'planned'
    }
  ];

  const recentShifts = [
    {
      id: '1',
      date: 'Včera',
      time: '06:00 - 14:00',
      type: 'Ranní směna',
      location: 'München, DE',
      status: 'completed'
    },
    {
      id: '2',
      date: 'Pondělí',
      time: '06:00 - 14:00',
      type: 'Ranní směna',
      location: 'München, DE',
      status: 'completed'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Weekly Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Card className="bg-card/50 backdrop-blur-sm border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Týdenní hodiny</p>
                  <p className="text-2xl font-bold">{weeklyStats.hoursWorked}h</p>
                  <p className="text-xs text-muted-foreground">z {weeklyStats.plannedHours}h</p>
                </div>
                <div className="p-2 rounded-lg bg-primary/10">
                  <Clock className="h-5 w-5 text-primary" />
                </div>
              </div>
              <Progress value={(weeklyStats.hoursWorked / weeklyStats.plannedHours) * 100} className="mt-3" />
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <Card className="bg-card/50 backdrop-blur-sm border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Směny</p>
                  <p className="text-2xl font-bold">{weeklyStats.shiftsCompleted}</p>
                  <p className="text-xs text-muted-foreground">z {weeklyStats.shiftsPlanned}</p>
                </div>
                <div className="p-2 rounded-lg bg-green-100 dark:bg-green-900/30">
                  <Calendar className="h-5 w-5 text-green-600 dark:text-green-400" />
                </div>
              </div>
              <Progress value={(weeklyStats.shiftsCompleted / weeklyStats.shiftsPlanned) * 100} className="mt-3" />
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <Card className="bg-card/50 backdrop-blur-sm border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Výdělky</p>
                  <p className="text-2xl font-bold">€{weeklyStats.earnings}</p>
                  <p className="text-xs text-muted-foreground">tento týden</p>
                </div>
                <div className="p-2 rounded-lg bg-green-100 dark:bg-green-900/30">
                  <Euro className="h-5 w-5 text-green-600 dark:text-green-400" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <Card className="bg-card/50 backdrop-blur-sm border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Efektivita</p>
                  <p className="text-2xl font-bold">92%</p>
                  <p className="text-xs text-muted-foreground">+5% vs minulý týden</p>
                </div>
                <div className="p-2 rounded-lg bg-orange-100 dark:bg-orange-900/30">
                  <TrendingUp className="h-5 w-5 text-orange-600 dark:text-orange-400" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Upcoming and Recent Shifts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Upcoming Shifts */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <Card className="bg-card/50 backdrop-blur-sm border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="text-lg">Nadcházející směny</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {upcomingShifts.map((shift, index) => (
                  <motion.div
                    key={shift.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.5 + index * 0.1 }}
                    className="flex items-center justify-between p-3 bg-muted/30 rounded-lg"
                  >
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <Badge variant="outline">{shift.date}</Badge>
                        <span className="text-sm font-medium">{shift.type}</span>
                      </div>
                      <div className="flex items-center text-sm text-muted-foreground">
                        <Clock className="h-3 w-3 mr-1" />
                        {shift.time}
                        <MapPin className="h-3 w-3 ml-3 mr-1" />
                        {shift.location}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Recent Shifts */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
        >
          <Card className="bg-card/50 backdrop-blur-sm border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="text-lg">Nedávné směny</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {recentShifts.map((shift, index) => (
                  <motion.div
                    key={shift.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.6 + index * 0.1 }}
                    className="flex items-center justify-between p-3 bg-muted/30 rounded-lg"
                  >
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <Badge variant="outline">{shift.date}</Badge>
                        <span className="text-sm font-medium">{shift.type}</span>
                        <CheckCircle className="h-4 w-4 text-green-600" />
                      </div>
                      <div className="flex items-center text-sm text-muted-foreground">
                        <Clock className="h-3 w-3 mr-1" />
                        {shift.time}
                        <MapPin className="h-3 w-3 ml-3 mr-1" />
                        {shift.location}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default ShiftsOverview;
