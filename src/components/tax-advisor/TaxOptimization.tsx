
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { TrendingUp, Lightbulb, Target, CheckCircle } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const TaxOptimization = () => {
  const { t } = useTranslation('taxAdvisor');

  const optimizationTips = [
    {
      id: 1,
      title: t('tips.tip1'),
      description: 'Manželé s různými příjmy mohou využít kombinaci daňových tříd III/V pro optimalizaci.',
      savings: '€ 2,400',
      difficulty: 'easy',
      category: 'marriage'
    },
    {
      id: 2,
      title: t('tips.tip2'),
      description: 'Pendleři mohou odečíst 0,30 € za každý kilometr pracovní cesty.',
      savings: '€ 1,800',
      difficulty: 'easy',
      category: 'commute'
    },
    {
      id: 3,
      title: t('tips.tip3'),
      description: 'Minijobs do 520€ jsou osvobozeny od daně z příjmu.',
      savings: '€ 1,200',
      difficulty: 'medium',
      category: 'income'
    },
    {
      id: 4,
      title: t('tips.tip4'),
      description: 'Benefity jako firemní auto nebo jídlo mohou snížit zdanitelný příjem.',
      savings: '€ 3,600',
      difficulty: 'medium',
      category: 'benefits'
    }
  ];

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'bg-green-100 text-green-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'hard': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getDifficultyText = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'Snadné';
      case 'medium': return 'Střední';
      case 'hard': return 'Těžké';
      default: return 'Neznámé';
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            {t('optimizer.title')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Alert>
            <Lightbulb className="h-4 w-4" />
            <AlertDescription>
              {t('optimizer.description')}
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>

      <div className="grid gap-4">
        {optimizationTips.map((tip) => (
          <Card key={tip.id} className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="font-semibold text-lg mb-2">{tip.title}</h3>
                  <p className="text-muted-foreground text-sm mb-3">{tip.description}</p>
                </div>
                <div className="flex flex-col items-end gap-2 ml-4">
                  <Badge variant="outline" className="text-green-600 border-green-600">
                    <Target className="h-3 w-3 mr-1" />
                    {tip.savings}
                  </Badge>
                  <Badge className={getDifficultyColor(tip.difficulty)}>
                    {getDifficultyText(tip.difficulty)}
                  </Badge>
                </div>
              </div>
              
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <span>Roční úspora až {tip.savings}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{t('optimizer.optimizationTips')}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center mt-0.5">
                <span className="text-xs font-bold text-primary">1</span>
              </div>
              <p className="text-sm">{t('optimizer.tip1')}</p>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center mt-0.5">
                <span className="text-xs font-bold text-primary">2</span>
              </div>
              <p className="text-sm">{t('optimizer.tip2')}</p>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center mt-0.5">
                <span className="text-xs font-bold text-primary">3</span>
              </div>
              <p className="text-sm">{t('optimizer.tip3')}</p>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center mt-0.5">
                <span className="text-xs font-bold text-primary">4</span>
              </div>
              <p className="text-sm">{t('optimizer.tip4')}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TaxOptimization;
