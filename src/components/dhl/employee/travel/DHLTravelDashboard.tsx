import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Car, 
  Clock, 
  Euro, 
  Leaf, 
  TrendingUp, 
  Calendar,
  MapPin,
  BarChart3,
  Target
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { useAuth } from '@/hooks/auth';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface CommuteStats {
  totalTrips: number;
  totalDistance: number;
  totalCost: number;
  totalCO2: number;
  avgDuration: number;
  monthlyTrends: any[];
}

interface MonthlyData {
  month: string;
  trips: number;
  distance: number;
  cost: number;
  co2: number;
}

const DHLTravelDashboard: React.FC = () => {
  const { t } = useTranslation('travel');
  const { unifiedUser } = useAuth();
  const { toast } = useToast();
  
  const [stats, setStats] = useState<CommuteStats>({
    totalTrips: 0,
    totalDistance: 0,
    totalCost: 0,
    totalCO2: 0,
    avgDuration: 0,
    monthlyTrends: []
  });
  const [isLoading, setIsLoading] = useState(true);
  const [selectedPeriod, setSelectedPeriod] = useState<'week' | 'month' | 'year'>('month');

  useEffect(() => {
    if (unifiedUser?.id) {
      loadCommuteStats();
    }
  }, [unifiedUser, selectedPeriod]);

  const loadCommuteStats = async () => {
    if (!unifiedUser?.id) return;

    setIsLoading(true);
    try {
      const endDate = new Date();
      const startDate = new Date();
      
      switch (selectedPeriod) {
        case 'week':
          startDate.setDate(endDate.getDate() - 7);
          break;
        case 'month':
          startDate.setMonth(endDate.getMonth() - 1);
          break;
        case 'year':
          startDate.setFullYear(endDate.getFullYear() - 1);
          break;
      }

      const { data, error } = await supabase
        .from('dhl_commute_records')
        .select('*')
        .eq('user_id', unifiedUser.id)
        .gte('date', startDate.toISOString().split('T')[0])
        .lte('date', endDate.toISOString().split('T')[0])
        .order('date', { ascending: true });

      if (error) throw error;

      const records = data || [];
      
      // Calculate stats
      const totalTrips = records.length;
      const totalDistance = records.reduce((sum, record) => sum + (record.distance_km || 0), 0);
      const totalCost = records.reduce((sum, record) => sum + (record.cost_amount || 0), 0);
      const totalCO2 = records.reduce((sum, record) => sum + (record.fuel_consumption || 0) * 2.31, 0); // CO2 per liter
      const avgDuration = records.length > 0 
        ? records.reduce((sum, record) => sum + (record.duration_minutes || 0), 0) / records.length 
        : 0;

      // Group by month for trends
      const monthlyData = records.reduce((acc: { [key: string]: MonthlyData }, record) => {
        const month = record.date.substring(0, 7); // YYYY-MM
        if (!acc[month]) {
          acc[month] = { month, trips: 0, distance: 0, cost: 0, co2: 0 };
        }
        acc[month].trips += 1;
        acc[month].distance += record.distance_km || 0;
        acc[month].cost += record.cost_amount || 0;
        acc[month].co2 += (record.fuel_consumption || 0) * 2.31;
        return acc;
      }, {});

      setStats({
        totalTrips,
        totalDistance,
        totalCost,
        totalCO2,
        avgDuration,
        monthlyTrends: Object.values(monthlyData)
      });

    } catch (error) {
      console.error('Error loading commute stats:', error);
      toast({
        title: "Chyba",
        description: "Nepodařilo se načíst statistiky dojíždění",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('cs-CZ', {
      style: 'currency',
      currency: 'EUR'
    }).format(amount);
  };

  const getSavingsComparedToRealRate = () => {
    // DHL reimbursement rate vs actual costs
    const dhlRate = 0.30; // €0.30 per km
    const actualCostPerKm = stats.totalDistance > 0 ? stats.totalCost / stats.totalDistance : 0;
    const savings = (dhlRate - actualCostPerKm) * stats.totalDistance;
    return savings;
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        {[...Array(4)].map((_, i) => (
          <Card key={i}>
            <CardContent className="p-6">
              <div className="animate-pulse space-y-4">
                <div className="h-4 bg-secondary rounded w-3/4"></div>
                <div className="h-8 bg-secondary rounded w-1/2"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Period Selector */}
      <div className="flex justify-center">
        <Tabs value={selectedPeriod} onValueChange={(value) => setSelectedPeriod(value as any)}>
          <TabsList>
            <TabsTrigger value="week">Týden</TabsTrigger>
            <TabsTrigger value="month">Měsíc</TabsTrigger>
            <TabsTrigger value="year">Rok</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Car className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Cesty</p>
                  <p className="text-2xl font-bold">{stats.totalTrips}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-100 rounded-lg">
                  <MapPin className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Kilometry</p>
                  <p className="text-2xl font-bold">{stats.totalDistance.toFixed(0)}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-yellow-100 rounded-lg">
                  <Euro className="h-5 w-5 text-yellow-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Náklady</p>
                  <p className="text-2xl font-bold">{formatCurrency(stats.totalCost)}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-red-100 rounded-lg">
                  <Leaf className="h-5 w-5 text-red-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">CO₂</p>
                  <p className="text-2xl font-bold">{stats.totalCO2.toFixed(1)} kg</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* DHL Specific Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              DHL Refundace
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Nárok na refundaci (€0.30/km)</span>
                <span className="font-medium">
                  {formatCurrency(stats.totalDistance * 0.30)}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Skutečné náklady</span>
                <span className="font-medium">{formatCurrency(stats.totalCost)}</span>
              </div>
              <hr />
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Úspora/Ztráta</span>
                <span className={`font-bold ${getSavingsComparedToRealRate() >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {formatCurrency(getSavingsComparedToRealRate())}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Průměry
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Průměrná doba cesty</span>
                <span className="font-medium">{stats.avgDuration.toFixed(0)} min</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Průměrná vzdálenost</span>
                <span className="font-medium">
                  {stats.totalTrips > 0 ? (stats.totalDistance / stats.totalTrips).toFixed(1) : 0} km
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Náklady na km</span>
                <span className="font-medium">
                  {stats.totalDistance > 0 
                    ? formatCurrency(stats.totalCost / stats.totalDistance)
                    : formatCurrency(0)
                  }
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Monthly Trends */}
      {stats.monthlyTrends.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Měsíční trendy
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {stats.monthlyTrends.map((month, index) => (
                <motion.div
                  key={month.month}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center justify-between p-3 border rounded-lg"
                >
                  <div>
                    <h4 className="font-medium">
                      {new Date(month.month + '-01').toLocaleDateString('cs-CZ', { 
                        year: 'numeric', 
                        month: 'long' 
                      })}
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      {month.trips} cest • {month.distance.toFixed(0)} km
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">{formatCurrency(month.cost)}</p>
                    <p className="text-sm text-muted-foreground">
                      {month.co2.toFixed(1)} kg CO₂
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Environmental Impact */}
      <Card className="border-green-200 bg-green-50/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-green-800">
            <Leaf className="h-5 w-5" />
            Ekologický dopad
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-700">
                {(stats.totalCO2 / 1000).toFixed(2)} t
              </div>
              <div className="text-sm text-green-600">CO₂ emisí</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-700">
                {(stats.totalCO2 / 22).toFixed(0)}
              </div>
              <div className="text-sm text-green-600">ekvivalent stromů</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-700">
                {(stats.totalDistance * 0.05).toFixed(1)} l
              </div>
              <div className="text-sm text-green-600">spotřeba paliva</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DHLTravelDashboard;