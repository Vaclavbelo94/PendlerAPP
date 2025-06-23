
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import { motion } from 'framer-motion';
import { Shift } from '@/hooks/useShiftsManagement';
import { useTranslation } from 'react-i18next';

interface ShiftsAnalyticsProps {
  shifts?: Shift[];
}

const ShiftsAnalytics: React.FC<ShiftsAnalyticsProps> = ({ shifts = [] }) => {
  const [period, setPeriod] = useState('month');
  const { t, i18n } = useTranslation('shifts');

  // Get localized week days
  const getWeekDays = () => {
    return [
      t('weekDays.monday'),
      t('weekDays.tuesday'),
      t('weekDays.wednesday'),
      t('weekDays.thursday'),
      t('weekDays.friday'),
      t('weekDays.saturday'),
      t('weekDays.sunday')
    ];
  };

  // Get localized months
  const getMonths = () => {
    return [
      t('months.january'),
      t('months.february'),
      t('months.march'),
      t('months.april'),
      t('months.may'),
      t('months.june'),
      t('months.july'),
      t('months.august'),
      t('months.september'),
      t('months.october'),
      t('months.november'),
      t('months.december')
    ];
  };

  const weekDays = getWeekDays();
  const months = getMonths();

  // Mock data with localized labels
  const weeklyData = weekDays.map((day, index) => ({
    name: day,
    [t('hours')]: index === 2 || index === 5 || index === 6 ? 0 : 8, // No work on Wednesday, Saturday, Sunday
    [t('earnings')]: index === 2 || index === 5 || index === 6 ? 0 : 320
  }));

  const shiftTypeData = [
    { name: t('morning'), value: 60, color: '#3b82f6' },
    { name: t('afternoon'), value: 30, color: '#f59e0b' },
    { name: t('night'), value: 10, color: '#6366f1' }
  ];

  const monthlyTrend = months.slice(0, 6).map((month, index) => ({
    [t('months')]: month,
    [t('hours')]: [160, 152, 168, 144, 176, 160][index],
    [t('earningsEuro')]: [6400, 6080, 6720, 5760, 7040, 6400][index]
  }));

  return (
    <div className="space-y-6">
      {/* Header with Period Selection */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="flex items-center justify-between"
      >
        <h2 className="text-2xl font-bold">{t('shiftsAnalytics')}</h2>
        <Select value={period} onValueChange={setPeriod}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder={t('selectPeriod')} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="week">{t('thisWeek')}</SelectItem>
            <SelectItem value="month">{t('thisMonth')}</SelectItem>
            <SelectItem value="quarter">{t('thisQuarter')}</SelectItem>
            <SelectItem value="year">{t('thisYear')}</SelectItem>
          </SelectContent>
        </Select>
      </motion.div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Weekly Hours Chart */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <Card className="bg-card/50 backdrop-blur-sm border-0 shadow-lg">
            <CardHeader>
              <CardTitle>{t('weeklyWorkedHours')}</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={weeklyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey={t('hours')} fill="#3b82f6" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </motion.div>

        {/* Shift Type Distribution */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <Card className="bg-card/50 backdrop-blur-sm border-0 shadow-lg">
            <CardHeader>
              <CardTitle>{t('shiftTypeDistribution')}</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={shiftTypeData}
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, value }) => `${name}: ${value}%`}
                  >
                    {shiftTypeData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </motion.div>

        {/* Monthly Trend */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="lg:col-span-2"
        >
          <Card className="bg-card/50 backdrop-blur-sm border-0 shadow-lg">
            <CardHeader>
              <CardTitle>{t('monthlyTrendHoursEarnings')}</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <LineChart data={monthlyTrend}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey={t('months')} />
                  <YAxis yAxisId="left" />
                  <YAxis yAxisId="right" orientation="right" />
                  <Tooltip />
                  <Bar yAxisId="left" dataKey={t('hours')} fill="#3b82f6" name={t('hours')} />
                  <Line yAxisId="right" type="monotone" dataKey={t('earningsEuro')} stroke="#10b981" strokeWidth={3} name={t('earningsEuro')} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Statistics Summary */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
      >
        <Card className="bg-card/50 backdrop-blur-sm border-0 shadow-lg">
          <CardHeader>
            <CardTitle>{t('statisticalSummary')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-primary">152</p>
                <p className="text-sm text-muted-foreground">{t('totalHours')}</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-green-600">€6,080</p>
                <p className="text-sm text-muted-foreground">{t('totalEarnings')}</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-blue-600">19</p>
                <p className="text-sm text-muted-foreground">{t('shiftsCompleted')}</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-purple-600">€40</p>
                <p className="text-sm text-muted-foreground">{t('averagePerHour')}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default ShiftsAnalytics;
