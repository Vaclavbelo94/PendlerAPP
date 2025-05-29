
import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar
} from 'recharts';
import { 
  TrendingUp, 
  TrendingDown, 
  Target, 
  Clock, 
  Brain, 
  Award,
  Calendar,
  DollarSign,
  Car,
  BookOpen
} from 'lucide-react';
import { predictiveAnalyticsService } from '@/services/PredictiveAnalyticsService';
import { dataSharingService } from '@/services/DataSharingService';

interface AdvancedAnalyticsDashboardProps {
  userId: string;
}

export const AdvancedAnalyticsDashboard: React.FC<AdvancedAnalyticsDashboardProps> = ({ userId }) => {
  const [selectedTimeRange, setSelectedTimeRange] = useState<'week' | 'month' | 'quarter'>('month');
  const [predictions, setPredictions] = useState<any[]>([]);
  const [userPattern, setUserPattern] = useState<any>(null);

  // Mock analytics data - would be replaced with real data
  const analyticsData = useMemo(() => ({
    learning: {
      totalHours: 24.5,
      completedLessons: 156,
      accuracy: 87,
      streak: 12,
      weeklyProgress: [
        { day: 'Po', hours: 1.2, accuracy: 85 },
        { day: 'Út', hours: 0.8, accuracy: 90 },
        { day: 'St', hours: 1.5, accuracy: 88 },
        { day: 'Čt', hours: 1.1, accuracy: 89 },
        { day: 'Pá', hours: 2.0, accuracy: 85 },
        { day: 'So', hours: 1.8, accuracy: 92 },
        { day: 'Ne', hours: 1.4, accuracy: 87 }
      ],
      skillDistribution: [
        { skill: 'Vocabulary', value: 85, color: '#8884d8' },
        { skill: 'Grammar', value: 72, color: '#82ca9d' },
        { skill: 'Listening', value: 78, color: '#ffc658' },
        { skill: 'Speaking', value: 68, color: '#ff7300' }
      ]
    },
    work: {
      totalShifts: 22,
      totalHours: 176,
      averageCommute: 35,
      efficiency: 92,
      monthlyTrend: [
        { month: 'Led', hours: 168, efficiency: 88 },
        { month: 'Úno', hours: 172, efficiency: 90 },
        { month: 'Bře', hours: 176, efficiency: 92 },
        { month: 'Dub', hours: 180, efficiency: 89 }
      ]
    },
    financial: {
      totalEarnings: 2800,
      expenses: 650,
      netIncome: 2150,
      savingsRate: 23,
      expenseBreakdown: [
        { category: 'Palivo', amount: 320, color: '#8884d8' },
        { category: 'Jídlo', amount: 180, color: '#82ca9d' },
        { category: 'Ubytování', amount: 150, color: '#ffc658' }
      ]
    },
    predictions: [
      {
        type: 'learning',
        title: 'Optimální učební čas',
        prediction: 'Nejlepší výsledky dosáhnete učením mezi 19:00-21:00',
        confidence: 85,
        impact: 'high'
      },
      {
        type: 'work',
        title: 'Efektivita směn',
        prediction: 'Ranní směny vám vyhovují o 15% lépe než odpolední',
        confidence: 78,
        impact: 'medium'
      },
      {
        type: 'financial',
        title: 'Úspory na palivu',
        prediction: 'Sdílením jízd 2x týdně ušetříte 120€ měsíčně',
        confidence: 72,
        impact: 'high'
      }
    ]
  }), [selectedTimeRange]);

  const MetricCard: React.FC<{
    title: string;
    value: string | number;
    change?: number;
    icon: React.ReactNode;
    trend?: 'up' | 'down' | 'stable';
  }> = ({ title, value, change, icon, trend }) => (
    <Card>
      <CardContent className="pt-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <p className="text-2xl font-bold">{value}</p>
            {change !== undefined && (
              <div className="flex items-center mt-1">
                {trend === 'up' ? (
                  <TrendingUp className="h-3 w-3 text-green-500 mr-1" />
                ) : trend === 'down' ? (
                  <TrendingDown className="h-3 w-3 text-red-500 mr-1" />
                ) : null}
                <span className={`text-xs ${
                  trend === 'up' ? 'text-green-500' : 
                  trend === 'down' ? 'text-red-500' : 
                  'text-muted-foreground'
                }`}>
                  {change > 0 ? '+' : ''}{change}%
                </span>
              </div>
            )}
          </div>
          <div className="text-muted-foreground">{icon}</div>
        </div>
      </CardContent>
    </Card>
  );

  const PredictionCard: React.FC<{ prediction: any }> = ({ prediction }) => (
    <Card className="border-l-4 border-l-blue-500">
      <CardContent className="pt-4">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h4 className="font-medium text-sm">{prediction.title}</h4>
            <p className="text-sm text-muted-foreground mt-1">{prediction.prediction}</p>
            <div className="flex items-center gap-2 mt-2">
              <Badge variant={prediction.impact === 'high' ? 'default' : 'secondary'}>
                {prediction.confidence}% jistota
              </Badge>
              <Badge variant="outline">
                {prediction.impact === 'high' ? 'Vysoký dopad' : 'Střední dopad'}
              </Badge>
            </div>
          </div>
          <Brain className="h-4 w-4 text-blue-500 ml-2" />
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Pokročilá analytika</h2>
          <p className="text-muted-foreground">Detailní přehled vašeho pokroku a výkonu</p>
        </div>
        <div className="flex gap-2">
          {(['week', 'month', 'quarter'] as const).map((range) => (
            <Button
              key={range}
              variant={selectedTimeRange === range ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedTimeRange(range)}
            >
              {range === 'week' ? 'Týden' : range === 'month' ? 'Měsíc' : 'Kvartál'}
            </Button>
          ))}
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <MetricCard
          title="Studium (hodiny)"
          value={analyticsData.learning.totalHours}
          change={12}
          trend="up"
          icon={<BookOpen className="h-4 w-4" />}
        />
        <MetricCard
          title="Přesnost (%)"
          value={analyticsData.learning.accuracy}
          change={5}
          trend="up"
          icon={<Target className="h-4 w-4" />}
        />
        <MetricCard
          title="Pracovní hodiny"
          value={analyticsData.work.totalHours}
          change={2}
          trend="up"
          icon={<Clock className="h-4 w-4" />}
        />
        <MetricCard
          title="Čistý příjem"
          value={`${analyticsData.financial.netIncome}€`}
          change={8}
          trend="up"
          icon={<DollarSign className="h-4 w-4" />}
        />
      </div>

      <Tabs defaultValue="learning" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="learning">Učení</TabsTrigger>
          <TabsTrigger value="work">Práce</TabsTrigger>
          <TabsTrigger value="financial">Finance</TabsTrigger>
          <TabsTrigger value="predictions">Predikce</TabsTrigger>
        </TabsList>

        <TabsContent value="learning" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Weekly Progress Chart */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Týdenní pokrok</CardTitle>
                <CardDescription>Studijní hodiny a přesnost podle dní</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart data={analyticsData.learning.weeklyProgress}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="day" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="hours" fill="#8884d8" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Skill Distribution */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Distribuce dovedností</CardTitle>
                <CardDescription>Pokrok v jednotlivých oblastech</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={200}>
                  <RadarChart data={analyticsData.learning.skillDistribution}>
                    <PolarGrid />
                    <PolarAngleAxis dataKey="skill" />
                    <PolarRadiusAxis angle={90} domain={[0, 100]} />
                    <Radar name="Pokrok" dataKey="value" stroke="#8884d8" fill="#8884d8" fillOpacity={0.6} />
                  </RadarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* Learning Streak */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Award className="h-5 w-5 text-yellow-500" />
                Studijní série
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-yellow-500 mb-2">
                {analyticsData.learning.streak} dní
              </div>
              <Progress value={(analyticsData.learning.streak / 30) * 100} className="mb-2" />
              <p className="text-sm text-muted-foreground">
                Cíl: 30 dní v řadě (zbývá {30 - analyticsData.learning.streak} dní)
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="work" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Monthly Trend */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Měsíční trend</CardTitle>
                <CardDescription>Pracovní hodiny a efektivita</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={200}>
                  <LineChart data={analyticsData.work.monthlyTrend}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="hours" stroke="#8884d8" />
                    <Line type="monotone" dataKey="efficiency" stroke="#82ca9d" />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Work Summary */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Přehled práce</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span>Celkem směn:</span>
                  <span className="font-semibold">{analyticsData.work.totalShifts}</span>
                </div>
                <div className="flex justify-between">
                  <span>Průměrné dojíždění:</span>
                  <span className="font-semibold">{analyticsData.work.averageCommute} min</span>
                </div>
                <div className="flex justify-between">
                  <span>Efektivita:</span>
                  <span className="font-semibold">{analyticsData.work.efficiency}%</span>
                </div>
                <Progress value={analyticsData.work.efficiency} className="mt-2" />
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="financial" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Expense Breakdown */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Rozpis výdajů</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={200}>
                  <PieChart>
                    <Pie
                      data={analyticsData.financial.expenseBreakdown}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="amount"
                      label={({ category, amount }) => `${category}: ${amount}€`}
                    >
                      {analyticsData.financial.expenseBreakdown.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Financial Summary */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Finanční přehled</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span>Celkové příjmy:</span>
                  <span className="font-semibold text-green-600">{analyticsData.financial.totalEarnings}€</span>
                </div>
                <div className="flex justify-between">
                  <span>Celkové výdaje:</span>
                  <span className="font-semibold text-red-600">{analyticsData.financial.expenses}€</span>
                </div>
                <div className="flex justify-between">
                  <span>Čistý příjem:</span>
                  <span className="font-semibold">{analyticsData.financial.netIncome}€</span>
                </div>
                <div className="flex justify-between">
                  <span>Míra úspor:</span>
                  <span className="font-semibold">{analyticsData.financial.savingsRate}%</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="predictions" className="space-y-4">
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Brain className="h-5 w-5 text-blue-500" />
                  AI Predikce a doporučení
                </CardTitle>
                <CardDescription>
                  Inteligentní insights založené na analýze vašich dat
                </CardDescription>
              </CardHeader>
            </Card>

            {analyticsData.predictions.map((prediction, index) => (
              <PredictionCard key={index} prediction={prediction} />
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdvancedAnalyticsDashboard;
