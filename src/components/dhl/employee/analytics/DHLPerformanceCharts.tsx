import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  Area,
  AreaChart
} from 'recharts';

interface ChartData {
  name: string;
  value: number;
  trend?: number;
  category?: string;
}

export const DHLPerformanceCharts: React.FC = () => {
  const weeklyPerformance: ChartData[] = [
    { name: 'Po', value: 85, trend: 2 },
    { name: 'Út', value: 88, trend: 3 },
    { name: 'St', value: 82, trend: -3 },
    { name: 'Čt', value: 91, trend: 9 },
    { name: 'Pá', value: 94, trend: 3 },
    { name: 'So', value: 76, trend: -18 },
    { name: 'Ne', value: 78, trend: 2 }
  ];

  const monthlyTrends: ChartData[] = [
    { name: 'Led', value: 82 },
    { name: 'Úno', value: 85 },
    { name: 'Bře', value: 87 },
    { name: 'Dub', value: 89 },
    { name: 'Kvě', value: 91 },
    { name: 'Čer', value: 93 }
  ];

  const skillDistribution: ChartData[] = [
    { name: 'Slovní zásoba', value: 92, category: 'strong' },
    { name: 'Poslech', value: 88, category: 'strong' },
    { name: 'Čtení', value: 85, category: 'good' },
    { name: 'Gramatika', value: 72, category: 'weak' },
    { name: 'Mluvení', value: 68, category: 'weak' }
  ];

  const productivityByHour: ChartData[] = [
    { name: '6:00', value: 65 },
    { name: '8:00', value: 72 },
    { name: '10:00', value: 78 },
    { name: '12:00', value: 75 },
    { name: '14:00', value: 85 },
    { name: '16:00', value: 92 },
    { name: '18:00', value: 88 },
    { name: '20:00', value: 82 },
    { name: '22:00', value: 70 }
  ];

  const COLORS = {
    strong: '#10b981',
    good: '#3b82f6',
    weak: '#f59e0b',
    critical: '#ef4444'
  };

  const getColorByCategory = (category: string) => {
    return COLORS[category as keyof typeof COLORS] || COLORS.good;
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Weekly Performance Trend */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <Card>
          <CardHeader>
            <CardTitle>Týdenní výkonnost</CardTitle>
            <CardDescription>Sledování pokroku během týdne</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={weeklyPerformance}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis domain={[0, 100]} />
                <Tooltip 
                  formatter={(value, name) => [`${value}%`, 'Výkonnost']}
                  labelFormatter={(label) => `Den: ${label}`}
                />
                <Line 
                  type="monotone" 
                  dataKey="value" 
                  stroke="#3b82f6" 
                  strokeWidth={3}
                  dot={{ fill: '#3b82f6', strokeWidth: 2, r: 5 }}
                  activeDot={{ r: 7, stroke: '#3b82f6', strokeWidth: 2 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </motion.div>

      {/* Monthly Trends */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Card>
          <CardHeader>
            <CardTitle>Měsíční trendy</CardTitle>
            <CardDescription>Dlouhodobý pokrok během roku</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <AreaChart data={monthlyTrends}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis domain={[0, 100]} />
                <Tooltip 
                  formatter={(value, name) => [`${value}%`, 'Průměrná výkonnost']}
                  labelFormatter={(label) => `Měsíc: ${label}`}
                />
                <Area 
                  type="monotone" 
                  dataKey="value" 
                  stroke="#10b981" 
                  fill="#10b981"
                  fillOpacity={0.3}
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </motion.div>

      {/* Skill Distribution */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <Card>
          <CardHeader>
            <CardTitle>Distribuce dovedností</CardTitle>
            <CardDescription>Rozložení výkonnosti podle oblastí</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={skillDistribution} layout="horizontal">
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" domain={[0, 100]} />
                <YAxis dataKey="name" type="category" width={80} />
                <Tooltip 
                  formatter={(value, name) => [`${value}%`, 'Úroveň']}
                />
                <Bar 
                  dataKey="value" 
                  radius={[0, 4, 4, 0]}
                >
                  {skillDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={getColorByCategory(entry.category)} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </motion.div>

      {/* Productivity by Hour */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <Card>
          <CardHeader>
            <CardTitle>Produktivita podle hodin</CardTitle>
            <CardDescription>Nejlepší časy pro učení</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <AreaChart data={productivityByHour}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis domain={[0, 100]} />
                <Tooltip 
                  formatter={(value, name) => [`${value}%`, 'Produktivita']}
                  labelFormatter={(label) => `Hodina: ${label}`}
                />
                <Area 
                  type="monotone" 
                  dataKey="value" 
                  stroke="#8b5cf6" 
                  fill="#8b5cf6"
                  fillOpacity={0.3}
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};