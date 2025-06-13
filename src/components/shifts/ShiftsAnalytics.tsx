
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import { motion } from 'framer-motion';
import { Shift } from '@/hooks/useShiftsManagement';

interface ShiftsAnalyticsProps {
  shifts?: Shift[];
}

const ShiftsAnalytics: React.FC<ShiftsAnalyticsProps> = ({ shifts = [] }) => {
  const [period, setPeriod] = useState('month');

  // Mock data - v reálné aplikaci by se načítalo z API nebo používalo real shifts data
  const weeklyData = [
    { name: 'Po', hodiny: 8, vydelky: 320 },
    { name: 'Út', hodiny: 8, vydelky: 320 },
    { name: 'St', hodiny: 0, vydelky: 0 },
    { name: 'Čt', hodiny: 8, vydelky: 320 },
    { name: 'Pá', hodiny: 8, vydelky: 320 },
    { name: 'So', hodiny: 0, vydelky: 0 },
    { name: 'Ne', hodiny: 0, vydelky: 0 }
  ];

  const shiftTypeData = [
    { name: 'Ranní', value: 60, color: '#3b82f6' },
    { name: 'Odpolední', value: 30, color: '#f59e0b' },
    { name: 'Noční', value: 10, color: '#6366f1' }
  ];

  const monthlyTrend = [
    { mesic: 'Led', hodiny: 160, vydelky: 6400 },
    { mesic: 'Úno', hodiny: 152, vydelky: 6080 },
    { mesic: 'Bře', hodiny: 168, vydelky: 6720 },
    { mesic: 'Dub', hodiny: 144, vydelky: 5760 },
    { mesic: 'Kvě', hodiny: 176, vydelky: 7040 },
    { mesic: 'Čer', hodiny: 160, vydelky: 6400 }
  ];

  return (
    <div className="space-y-6">
      {/* Header with Period Selection */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="flex items-center justify-between"
      >
        <h2 className="text-2xl font-bold">Analýzy směn</h2>
        <Select value={period} onValueChange={setPeriod}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Vyberte období" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="week">Tento týden</SelectItem>
            <SelectItem value="month">Tento měsíc</SelectItem>
            <SelectItem value="quarter">Toto čtvrtletí</SelectItem>
            <SelectItem value="year">Tento rok</SelectItem>
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
              <CardTitle>Týdenní odpracované hodiny</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={weeklyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="hodiny" fill="#3b82f6" radius={[4, 4, 0, 0]} />
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
              <CardTitle>Rozdělení typů směn</CardTitle>
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
              <CardTitle>Měsíční trend hodin a výdělků</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <LineChart data={monthlyTrend}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="mesic" />
                  <YAxis yAxisId="left" />
                  <YAxis yAxisId="right" orientation="right" />
                  <Tooltip />
                  <Bar yAxisId="left" dataKey="hodiny" fill="#3b82f6" name="Hodiny" />
                  <Line yAxisId="right" type="monotone" dataKey="vydelky" stroke="#10b981" strokeWidth={3} name="Výdělky (€)" />
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
            <CardTitle>Statistické shrnutí</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-primary">152</p>
                <p className="text-sm text-muted-foreground">Celkem hodin</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-green-600">€6,080</p>
                <p className="text-sm text-muted-foreground">Celkem výdělky</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-blue-600">19</p>
                <p className="text-sm text-muted-foreground">Směn dokončeno</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-purple-600">€40</p>
                <p className="text-sm text-muted-foreground">Průměr/hodina</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default ShiftsAnalytics;
