
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowRight, Users, TrendingUp, Globe, Briefcase, Map, Car } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from '@/hooks/useAuth';
import { useLanguage } from '@/hooks/useLanguage';

const features = [
  { icon: Briefcase, key: 'shifts', route: '/shifts' },
  { icon: Map, key: 'travel', route: '/travel' },
  { icon: Car, key: 'vehicle', route: '/vehicle' },
  { icon: Globe, key: 'translator', route: '/translator' },
];

const stats = [
  { icon: Users, value: '15,000+', labelKey: 'activeUsers' },
  { icon: TrendingUp, value: '200,000+', labelKey: 'shiftsManaged' },
  { icon: Globe, value: '3', labelKey: 'countries' },
];

export const ModernHero: React.FC = () => {
  const { user } = useAuth();
  const { t } = useLanguage();

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-background via-background/95 to-primary/5">
      {/* Animated background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse delay-1000" />
      </div>

      <div className="container mx-auto px-4 py-16 relative z-10">
        <div className="text-center max-w-4xl mx-auto mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-6"
          >
            <span className="inline-flex items-center px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
              <span className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></span>
              {t('heroSubtitle')}
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-5xl lg:text-7xl font-bold mb-6 leading-tight"
          >
            <span className="bg-gradient-to-r from-primary via-blue-600 to-purple-600 bg-clip-text text-transparent">
              {t('heroTitle')}
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-xl lg:text-2xl text-muted-foreground mb-8 max-w-3xl mx-auto leading-relaxed"
          >
            {t('heroDescription')}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-4 justify-center mb-12"
          >
            {user ? (
              <Button size="lg" className="text-lg px-8 py-4 h-auto group" asChild>
                <Link to="/dashboard">
                  {t('dashboard')}
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
            ) : (
              <>
                <Button size="lg" className="text-lg px-8 py-4 h-auto group" asChild>
                  <Link to="/register">
                    {t('getStarted')}
                    <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </Button>
                <Button size="lg" variant="outline" className="text-lg px-8 py-4 h-auto" asChild>
                  <Link to="/login">
                    {t('login')}
                  </Link>
                </Button>
              </>
            )}
          </motion.div>

          {/* Quick features preview */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12"
          >
            {features.map((feature, index) => (
              <Link key={index} to={feature.route} className="group">
                <Card className="bg-card/50 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300 group cursor-pointer">
                  <CardContent className="p-6 text-center">
                    <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-r from-primary/20 to-blue-500/20 mb-4 group-hover:scale-110 transition-transform">
                      <feature.icon className="h-6 w-6 text-primary" />
                    </div>
                    <div className="text-sm font-medium">{t(feature.key)}</div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </motion.div>
        </div>

        {/* Stats section */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto"
        >
          {stats.map((stat, index) => (
            <Card key={index} className="bg-card/70 backdrop-blur-sm border-0 shadow-xl">
              <CardContent className="p-6 text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-r from-primary/20 to-blue-500/20 mb-4">
                  <stat.icon className="h-6 w-6 text-primary" />
                </div>
                <div className="text-2xl font-bold text-foreground mb-1">{stat.value}</div>
                <div className="text-sm text-muted-foreground">{stat.labelKey}</div>
              </CardContent>
            </Card>
          ))}
        </motion.div>
      </div>
    </section>
  );
};
