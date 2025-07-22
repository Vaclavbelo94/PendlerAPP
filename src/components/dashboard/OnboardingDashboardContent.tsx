
import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  TrendingUp, 
  Calendar, 
  Calculator, 
  Car, 
  Languages,
  BarChart3,
  Clock,
  Euro,
  Target,
  Sparkles
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const OnboardingDashboardContent: React.FC = () => {
  const { t } = useTranslation(['common']);

  const mockData = {
    monthlyShifts: 22,
    estimatedHours: 176,
    potentialSavings: 1250,
    averageCommute: 45
  };

  const features = [
    {
      icon: Calendar,
      title: t('dashboard.features.shiftTracking.title'),
      description: t('dashboard.features.shiftTracking.description'),
      benefit: t('dashboard.features.shiftTracking.benefit'),
      color: 'bg-blue-50 border-blue-200 text-blue-700',
      link: '/shifts'
    },
    {
      icon: Calculator,
      title: t('dashboard.features.taxAdvisor.title'),
      description: t('dashboard.features.taxAdvisor.description'),
      benefit: t('dashboard.features.taxAdvisor.benefit', { amount: mockData.potentialSavings }),
      color: 'bg-green-50 border-green-200 text-green-700',
      link: '/tax-advisor'
    },
    {
      icon: Car,
      title: t('dashboard.features.vehicleManagement.title'),
      description: t('dashboard.features.vehicleManagement.description'),
      benefit: t('dashboard.features.vehicleManagement.benefit'),
      color: 'bg-purple-50 border-purple-200 text-purple-700',
      link: '/vehicle'
    },
    {
      icon: Languages,
      title: t('dashboard.features.translator.title'),
      description: t('dashboard.features.translator.description'),
      benefit: t('dashboard.features.translator.benefit'),
      color: 'bg-orange-50 border-orange-200 text-orange-700',
      link: '/translator'
    }
  ];

  const stats = [
    {
      icon: Clock,
      label: t('dashboard.stats.monthlyHours'),
      value: `~${mockData.estimatedHours}h`,
      description: t('dashboard.stats.hoursDescription'),
      trend: t('dashboard.stats.trend.increase')
    },
    {
      icon: Euro,
      label: t('dashboard.stats.potentialSavings'),
      value: `${mockData.potentialSavings}€`,
      description: t('dashboard.stats.savingsDescription'),
      trend: t('dashboard.stats.trend.new')
    },
    {
      icon: Target,
      label: t('dashboard.stats.averageCommute'),
      value: `${mockData.averageCommute} km`,
      description: t('dashboard.stats.commuteDescription'),
      trend: t('dashboard.stats.trend.bothWays')
    }
  ];

  return (
    <div className="space-y-8">
      {/* Welcome Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center bg-gradient-to-r from-amber-50 to-yellow-50 p-8 rounded-lg border border-amber-200"
      >
        <div className="inline-flex items-center gap-2 bg-amber-100 px-4 py-2 rounded-full mb-4">
          <Sparkles className="h-5 w-5 text-amber-600" />
          <span className="text-amber-800 font-medium">{t('dashboard.welcome.premiumActive')}</span>
        </div>
        
        <h2 className="text-2xl font-bold text-amber-900 mb-2">
          {t('dashboard.welcome.title')}
        </h2>
        <p className="text-amber-700 max-w-2xl mx-auto">
          {t('dashboard.welcome.description')}
        </p>
      </motion.div>

      {/* Preview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="relative overflow-hidden">
              <div className="absolute top-0 right-0 bg-gradient-to-l from-primary/10 to-transparent w-24 h-24" />
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <stat.icon className="h-8 w-8 text-muted-foreground" />
                  <Badge variant="secondary" className="text-xs">
                    {stat.trend}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-muted-foreground/50 mb-1">
                  {stat.value}
                </div>
                <div className="text-sm font-medium text-muted-foreground mb-1">
                  {stat.label}
                </div>
                <div className="text-xs text-muted-foreground">
                  {stat.description}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Features Preview */}
      <div>
        <div className="flex items-center gap-2 mb-6">
          <BarChart3 className="h-6 w-6 text-primary" />
          <h3 className="text-xl font-semibold">{t('dashboard.features.title')}</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.15 }}
            >
              <Card className={`h-full border-2 ${feature.color.split(' ')[1]} hover:shadow-lg transition-all duration-300`}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className={`p-3 rounded-lg ${feature.color.split(' ')[0]}`}>
                      <feature.icon className={`h-6 w-6 ${feature.color.split(' ')[2]}`} />
                    </div>
                    <Badge className="bg-green-100 text-green-800 border-green-200">
                      Premium
                    </Badge>
                  </div>
                  <CardTitle className="text-lg">{feature.title}</CardTitle>
                  <CardDescription>{feature.description}</CardDescription>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  <div className={`p-3 rounded-lg ${feature.color.split(' ')[0]} border ${feature.color.split(' ')[1]}`}>
                    <div className="flex items-center gap-2">
                      <TrendingUp className={`h-4 w-4 ${feature.color.split(' ')[2]}`} />
                      <span className={`text-sm font-medium ${feature.color.split(' ')[2]}`}>
                        {feature.benefit}
                      </span>
                    </div>
                  </div>
                  
                  <Button asChild variant="outline" className="w-full">
                    <Link to={feature.link}>
                      {t('dashboard.features.tryFeature')}
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Quick Start Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
      >
        <Card className="bg-gradient-to-r from-primary/5 to-accent/5 border-primary/20">
          <CardHeader className="text-center">
            <CardTitle className="flex items-center justify-center gap-2">
              <Target className="h-6 w-6" />
              {t('dashboard.quickStart.title')}
            </CardTitle>
            <CardDescription>
              {t('dashboard.quickStart.description')}
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Button asChild size="lg" className="h-auto p-4">
                <Link to="/dhl-setup" className="flex flex-col items-center gap-2">
                  <Calendar className="h-6 w-6" />
                  <div className="text-center">
                    <div className="font-medium">{t('dashboard.quickStart.setupProfile')}</div>
                    <div className="text-xs opacity-80">{t('dashboard.quickStart.setupTime')}</div>
                  </div>
                </Link>
              </Button>
              
              <Button asChild variant="outline" size="lg" className="h-auto p-4">
                <Link to="/shifts" className="flex flex-col items-center gap-2">
                  <Clock className="h-6 w-6" />
                  <div className="text-center">
                    <div className="font-medium">{t('dashboard.quickStart.addFirstShift')}</div>
                    <div className="text-xs opacity-80">{t('dashboard.quickStart.shiftTime')}</div>
                  </div>
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default OnboardingDashboardContent;
