import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  TrendingUp, 
  TrendingDown, 
  Clock, 
  Target, 
  Brain, 
  BarChart3,
  Calendar,
  AlertTriangle,
  CheckCircle,
  RefreshCw,
  Lightbulb,
  Award,
  Zap
} from 'lucide-react';
import { useAdvancedAnalytics } from '@/hooks/useAdvancedAnalytics';
import { useUserAnalytics } from '@/hooks/useUserAnalytics';

interface PerformanceMetric {
  label: string;
  value: number;
  trend: 'up' | 'down' | 'stable';
  unit: string;
  change: number;
}

interface InsightCard {
  id: string;
  type: 'success' | 'warning' | 'info' | 'tip';
  title: string;
  description: string;
  action?: string;
  priority: 'high' | 'medium' | 'low';
}

export const DHLAnalyticsDashboard: React.FC = () => {
  const { 
    learningPattern, 
    predictiveInsights, 
    isAnalyzing,
    analyzeLearningPatterns,
    generatePredictiveInsights 
  } = useAdvancedAnalytics();
  
  const { userId, isAdmin, isPremium, trackEvent } = useUserAnalytics();
  const [activeTab, setActiveTab] = useState('overview');

  const performanceMetrics: PerformanceMetric[] = [
    {
      label: 'Míra retence',
      value: learningPattern?.retentionRate ? learningPattern.retentionRate * 100 : 85,
      trend: 'up',
      unit: '%',
      change: 2.5
    },
    {
      label: 'Rychlost učení',
      value: learningPattern?.learningVelocity || 12.5,
      trend: 'up',
      unit: 'bodů/týden',
      change: 1.2
    },
    {
      label: 'Optimální délka',
      value: learningPattern?.optimalSessionLength || 25,
      trend: 'stable',
      unit: 'min',
      change: 0
    },
    {
      label: 'Produktivita směny',
      value: 92,
      trend: 'up',
      unit: '%',
      change: 3.1
    }
  ];

  const insights: InsightCard[] = [
    {
      id: '1',
      type: 'success',
      title: 'Vynikající pokrok!',
      description: 'Vaše výkonnost se za poslední měsíc zlepšila o 15%. Pokračujte v současném tempu.',
      priority: 'high'
    },
    {
      id: '2',
      type: 'tip',
      title: 'Optimalizace času',
      description: 'Nejproduktivnější jste mezi 14:00-16:00. Plánujte náročnější úkoly na tento čas.',
      action: 'Upravit plán',
      priority: 'medium'
    },
    {
      id: '3',
      type: 'warning',
      title: 'Pozornost na gramatiku',
      description: 'V oblasti gramatiky je prostor pro zlepšení. Doporučujeme zaměřit se na tento aspekt.',
      action: 'Procvičit',
      priority: 'medium'
    },
    {
      id: '4',
      type: 'info',
      title: 'Nový milestone',
      description: 'Blahopřejeme! Dosáhli jste 100 hodin celkového času studia.',
      priority: 'low'
    }
  ];

  const handleAnalyzePatterns = async () => {
    trackEvent('analytics_pattern_analysis_started');
    await analyzeLearningPatterns();
    trackEvent('analytics_pattern_analysis_completed');
  };

  const handleGenerateInsights = async () => {
    trackEvent('analytics_insights_generated');
    await generatePredictiveInsights();
  };

  const renderMetricCard = (metric: PerformanceMetric, index: number) => (
    <motion.div
      key={metric.label}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
    >
      <Card className="relative overflow-hidden">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {metric.label}
            </CardTitle>
            <div className="flex items-center gap-1">
              {metric.trend === 'up' && <TrendingUp className="h-4 w-4 text-green-500" />}
              {metric.trend === 'down' && <TrendingDown className="h-4 w-4 text-red-500" />}
              {metric.trend === 'stable' && <div className="h-4 w-4 bg-yellow-500 rounded-full" />}
              <span className={`text-xs font-medium ${
                metric.trend === 'up' ? 'text-green-500' : 
                metric.trend === 'down' ? 'text-red-500' : 'text-yellow-500'
              }`}>
                {metric.change > 0 ? '+' : ''}{metric.change}%
              </span>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold">{metric.value}</span>
            <span className="text-sm text-muted-foreground">{metric.unit}</span>
          </div>
          <Progress value={metric.value} className="mt-3" />
        </CardContent>
      </Card>
    </motion.div>
  );

  const renderInsightCard = (insight: InsightCard, index: number) => (
    <motion.div
      key={insight.id}
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.1 }}
    >
      <Card className={`border-l-4 ${
        insight.type === 'success' ? 'border-l-green-500' :
        insight.type === 'warning' ? 'border-l-yellow-500' :
        insight.type === 'info' ? 'border-l-blue-500' : 'border-l-purple-500'
      }`}>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {insight.type === 'success' && <CheckCircle className="h-4 w-4 text-green-500" />}
              {insight.type === 'warning' && <AlertTriangle className="h-4 w-4 text-yellow-500" />}
              {insight.type === 'info' && <Target className="h-4 w-4 text-blue-500" />}
              {insight.type === 'tip' && <Lightbulb className="h-4 w-4 text-purple-500" />}
              <CardTitle className="text-sm">{insight.title}</CardTitle>
            </div>
            <Badge variant={
              insight.priority === 'high' ? 'destructive' :
              insight.priority === 'medium' ? 'default' : 'secondary'
            }>
              {insight.priority}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <CardDescription className="mb-3">{insight.description}</CardDescription>
          {insight.action && (
            <Button variant="outline" size="sm">
              {insight.action}
            </Button>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Analytics & Insights</h2>
          <p className="text-muted-foreground">
            Pokročilá analýza výkonnosti a prediktivní pozorování
          </p>
        </div>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            onClick={handleAnalyzePatterns}
            disabled={isAnalyzing}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${isAnalyzing ? 'animate-spin' : ''}`} />
            Analyzovat vzorce
          </Button>
          <Button 
            onClick={handleGenerateInsights}
            disabled={isAnalyzing}
          >
            <Brain className="h-4 w-4 mr-2" />
            Generovat insights
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Přehled</TabsTrigger>
          <TabsTrigger value="performance">Výkonnost</TabsTrigger>
          <TabsTrigger value="insights">Insights</TabsTrigger>
          <TabsTrigger value="predictions">Predikce</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {performanceMetrics.map((metric, index) => renderMetricCard(metric, index))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Týdenní trend
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {learningPattern?.strongAreas.map((area, index) => (
                    <div key={area} className="flex items-center justify-between">
                      <span className="text-sm">{area}</span>
                      <div className="flex items-center gap-2">
                        <Progress value={85 + index * 5} className="w-20" />
                        <span className="text-xs text-muted-foreground">
                          {85 + index * 5}%
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="h-5 w-5" />
                  Dosažení
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    <div>
                      <p className="text-sm font-medium">Týdenní cíl splněn</p>
                      <p className="text-xs text-muted-foreground">25 hodin studia</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                    <Zap className="h-5 w-5 text-blue-500" />
                    <div>
                      <p className="text-sm font-medium">Série 7 dní</p>
                      <p className="text-xs text-muted-foreground">Denní aktivita</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="performance" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Silné oblasti</CardTitle>
                <CardDescription>Oblasti, ve kterých vynikáte</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {learningPattern?.strongAreas.map((area, index) => (
                    <div key={area} className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                      <span className="font-medium">{area}</span>
                      <Badge variant="secondary">Vynikající</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Oblasti pro zlepšení</CardTitle>
                <CardDescription>Zaměřte se na tyto aspekty</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {learningPattern?.weakAreas.map((area, index) => (
                    <div key={area} className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                      <span className="font-medium">{area}</span>
                      <Button variant="outline" size="sm">
                        Procvičit
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="insights" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {insights.map((insight, index) => renderInsightCard(insight, index))}
          </div>
        </TabsContent>

        <TabsContent value="predictions" className="space-y-4">
          <div className="space-y-4">
            {predictiveInsights.map((insight, index) => (
              <motion.div
                key={insight.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-sm">
                        Predikce {insight.type === 'performance' ? 'výkonnosti' : 
                        insight.type === 'difficulty' ? 'obtížnosti' : 
                        insight.type === 'engagement' ? 'zapojení' : 'retence'}
                      </CardTitle>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline">{Math.round(insight.confidence * 100)}% jistota</Badge>
                        <Badge variant="secondary">{insight.timeframe}</Badge>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-3">
                      {insight.prediction}
                    </p>
                    {insight.actionable && (
                      <Button variant="outline" size="sm">
                        <Target className="h-4 w-4 mr-2" />
                        Aplikovat doporučení
                      </Button>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};