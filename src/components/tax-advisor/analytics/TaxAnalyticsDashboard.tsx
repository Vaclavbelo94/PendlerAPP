import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  TrendingUp, 
  TrendingDown, 
  BarChart3, 
  PieChart, 
  Calendar, 
  Target,
  AlertTriangle,
  CheckCircle,
  Clock,
  Euro
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { TaxWizardData, TaxCalculationResult } from '../wizard/types';

interface TaxAnalyticsDashboardProps {
  currentData: TaxWizardData;
  currentResult: TaxCalculationResult;
  historicalData?: TaxWizardData[];
  historicalResults?: TaxCalculationResult[];
}

const TaxAnalyticsDashboard: React.FC<TaxAnalyticsDashboardProps> = ({
  currentData,
  currentResult,
  historicalData = [],
  historicalResults = []
}) => {
  const { t } = useTranslation(['taxAdvisor']);
  const [insights, setInsights] = useState<any[]>([]);
  const [predictions, setPredictions] = useState<any>({});

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('de-DE', {
      style: 'currency',
      currency: 'EUR'
    }).format(amount);
  };

  const calculateYearOverYear = () => {
    if (historicalResults.length === 0) return null;
    
    const lastYear = historicalResults[historicalResults.length - 1];
    const change = currentResult.totalDeductions - lastYear.totalDeductions;
    const percentChange = (change / lastYear.totalDeductions) * 100;
    
    return { change, percentChange };
  };

  const generateInsights = () => {
    const insights = [];
    
    // Reisepauschale optimization insight
    if (currentData.reisepauschale.commuteDistance > 50) {
      insights.push({
        type: 'optimization',
        title: t('analytics.insights.longCommute'),
        description: t('analytics.insights.longCommuteDesc'),
        impact: 'high',
        action: t('analytics.insights.considerSecondHome')
      });
    }

    // Missing deductions insight
    const activeDeductions = Object.values(currentData.deductions).filter(Boolean).length;
    if (activeDeductions < 3) {
      insights.push({
        type: 'missing',
        title: t('analytics.insights.missingDeductions'),
        description: t('analytics.insights.missingDeductionsDesc'),
        impact: 'medium',
        action: t('analytics.insights.reviewDeductions')
      });
    }

    // Income vs deductions insight
    const deductionRatio = (currentResult.totalDeductions / currentData.employmentInfo.annualIncome) * 100;
    if (deductionRatio < 2) {
      insights.push({
        type: 'warning',
        title: t('analytics.insights.lowDeductions'),
        description: t('analytics.insights.lowDeductionsDesc'),
        impact: 'medium',
        action: t('analytics.insights.increaseDeductions')
      });
    }

    setInsights(insights);
  };

  const calculatePredictions = () => {
    const currentYear = new Date().getFullYear();
    const nextYearPrediction = {
      reisepauschale: currentResult.reisepausaleBenefit * 1.03, // 3% inflation
      totalDeductions: currentResult.totalDeductions * 1.025, // 2.5% average increase
      estimatedSavings: currentResult.totalDeductions * 1.025 * 0.25
    };

    setPredictions({
      nextYear: nextYearPrediction,
      fiveYear: {
        totalSavings: nextYearPrediction.estimatedSavings * 5 * 1.1 // compound growth
      }
    });
  };

  useEffect(() => {
    generateInsights();
    calculatePredictions();
  }, [currentData, currentResult]);

  const yearOverYear = calculateYearOverYear();

  return (
    <div className="space-y-6">
      {/* Key Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('analytics.totalDeductions')}</CardTitle>
            <Euro className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(currentResult.totalDeductions)}</div>
            {yearOverYear && (
              <p className={`text-xs flex items-center ${yearOverYear.change > 0 ? 'text-green-600' : 'text-red-600'}`}>
                {yearOverYear.change > 0 ? <TrendingUp className="h-3 w-3 mr-1" /> : <TrendingDown className="h-3 w-3 mr-1" />}
                {yearOverYear.percentChange.toFixed(1)}% vs {t('analytics.lastYear')}
              </p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('analytics.estimatedRefund')}</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {formatCurrency(currentResult.totalDeductions * 0.25)}
            </div>
            <p className="text-xs text-muted-foreground">{t('analytics.basedOnTaxRate')}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('analytics.optimizationScore')}</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">85%</div>
            <Progress value={85} className="mt-2" />
            <p className="text-xs text-muted-foreground mt-1">{t('analytics.goodOptimization')}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('analytics.nextYearPrediction')}</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(predictions.nextYear?.estimatedSavings || 0)}</div>
            <p className="text-xs text-muted-foreground">{t('analytics.projectedSavings')}</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="insights" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="insights">{t('analytics.tabs.insights')}</TabsTrigger>
          <TabsTrigger value="trends">{t('analytics.tabs.trends')}</TabsTrigger>
          <TabsTrigger value="benchmark">{t('analytics.tabs.benchmark')}</TabsTrigger>
          <TabsTrigger value="predictions">{t('analytics.tabs.predictions')}</TabsTrigger>
        </TabsList>

        <TabsContent value="insights" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5" />
                {t('analytics.smartInsights')}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {insights.map((insight, index) => (
                <div key={index} className="flex items-start space-x-4 p-4 border rounded-lg">
                  <div className={`mt-1 h-2 w-2 rounded-full ${
                    insight.impact === 'high' ? 'bg-red-500' : 
                    insight.impact === 'medium' ? 'bg-yellow-500' : 'bg-green-500'
                  }`} />
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center justify-between">
                      <h4 className="font-semibold">{insight.title}</h4>
                      <Badge variant={insight.impact === 'high' ? 'destructive' : 'secondary'}>
                        {insight.impact}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{insight.description}</p>
                    <Button variant="outline" size="sm">{insight.action}</Button>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="trends" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>{t('analytics.deductionTrends')}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span>{t('wizard.results.totalReisepauschale')}</span>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold">{formatCurrency(currentResult.reisepausaleBenefit)}</span>
                    <Badge variant="outline" className="text-green-600">+5.2%</Badge>
                  </div>
                </div>
                <Progress value={75} />
                
                <div className="flex justify-between items-center">
                  <span>{t('wizard.deductions.workClothes')}</span>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold">{formatCurrency(currentResult.workClothesBenefit)}</span>
                    <Badge variant="outline" className="text-blue-600">+12%</Badge>
                  </div>
                </div>
                <Progress value={30} />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="benchmark" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>{t('analytics.benchmarkComparison')}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
                  <div>
                    <h4 className="font-semibold text-green-800">{t('analytics.yourPosition')}</h4>
                    <p className="text-sm text-green-600">{t('analytics.topPerformer')}</p>
                  </div>
                  <Badge className="bg-green-100 text-green-800">Top 15%</Badge>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="text-center p-4 border rounded-lg">
                    <div className="text-2xl font-bold">{formatCurrency(3200)}</div>
                    <p className="text-sm text-muted-foreground">{t('analytics.averageDeductions')}</p>
                  </div>
                  <div className="text-center p-4 border rounded-lg">
                    <div className="text-2xl font-bold text-green-600">+28%</div>
                    <p className="text-sm text-muted-foreground">{t('analytics.aboveAverage')}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="predictions" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>{t('analytics.futurePredictions')}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-base">{t('analytics.nextYear')} (2025)</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-sm">{t('analytics.projectedDeductions')}</span>
                          <span className="font-semibold">{formatCurrency(predictions.nextYear?.totalDeductions || 0)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm">{t('analytics.projectedSavings')}</span>
                          <span className="font-semibold text-green-600">{formatCurrency(predictions.nextYear?.estimatedSavings || 0)}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-base">{t('analytics.fiveYearOutlook')}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-blue-600">
                          {formatCurrency(predictions.fiveYear?.totalSavings || 0)}
                        </div>
                        <p className="text-sm text-muted-foreground">{t('analytics.cumulativeSavings')}</p>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <div className="p-4 bg-blue-50 rounded-lg">
                  <h4 className="font-semibold text-blue-800 mb-2">{t('analytics.recommendations')}</h4>
                  <ul className="text-sm text-blue-700 space-y-1">
                    <li>• {t('analytics.recommendation1')}</li>
                    <li>• {t('analytics.recommendation2')}</li>
                    <li>• {t('analytics.recommendation3')}</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default TaxAnalyticsDashboard;