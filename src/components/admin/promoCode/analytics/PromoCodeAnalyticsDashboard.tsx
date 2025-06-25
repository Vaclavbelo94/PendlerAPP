
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, TrendingUp, Users, Gift, Download, RefreshCw } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import PromoCodeUsageChart from './PromoCodeUsageChart';
import PromoCodePerformanceTable from './PromoCodePerformanceTable';
import PromoCodeTrendsChart from './PromoCodeTrendsChart';

interface PromoCodeStats {
  totalCodes: number;
  activeCodes: number;
  totalRedemptions: number;
  totalDiscountGiven: number;
  popularCodes: Array<{
    code: string;
    usage: number;
    discount: number;
  }>;
  recentActivity: Array<{
    code: string;
    redeemedAt: string;
    discount: number;
  }>;
}

const PromoCodeAnalyticsDashboard: React.FC = () => {
  const [stats, setStats] = useState<PromoCodeStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [dateRange, setDateRange] = useState<'week' | 'month' | 'quarter' | 'year'>('month');

  const fetchAnalytics = async () => {
    setIsLoading(true);
    try {
      console.log('Načítám analytics pro promo kódy...');

      // Získáme základní statistiky promo kódů
      const { data: promoCodes, error: promoError } = await supabase
        .from('promo_codes')
        .select('*');

      if (promoError) throw promoError;

      // Získáme redemption data
      const { data: redemptions, error: redemptionError } = await supabase
        .from('promo_code_redemptions')
        .select(`
          *,
          promo_codes (
            code,
            discount,
            duration
          )
        `);

      if (redemptionError) throw redemptionError;

      const now = new Date();
      const validCodes = promoCodes?.filter(code => new Date(code.valid_until) > now) || [];
      
      // Výpočet celkové slevy
      const totalDiscountGiven = redemptions?.reduce((total, redemption) => {
        return total + (redemption.promo_codes?.discount || 0);
      }, 0) || 0;

      // Nejpopulárnější kódy
      const codeUsage = new Map();
      redemptions?.forEach(redemption => {
        const code = redemption.promo_codes?.code;
        if (code) {
          codeUsage.set(code, (codeUsage.get(code) || 0) + 1);
        }
      });

      const popularCodes = Array.from(codeUsage.entries())
        .map(([code, usage]) => {
          const promoCode = promoCodes?.find(pc => pc.code === code);
          return {
            code,
            usage: usage as number,
            discount: promoCode?.discount || 0
          };
        })
        .sort((a, b) => b.usage - a.usage)
        .slice(0, 5);

      // Nedávná aktivita
      const recentActivity = redemptions
        ?.slice(-10)
        .reverse()
        .map(redemption => ({
          code: redemption.promo_codes?.code || 'Unknown',
          redeemedAt: redemption.redeemed_at || '',
          discount: redemption.promo_codes?.discount || 0
        })) || [];

      setStats({
        totalCodes: promoCodes?.length || 0,
        activeCodes: validCodes.length,
        totalRedemptions: redemptions?.length || 0,
        totalDiscountGiven,
        popularCodes,
        recentActivity
      });

      console.log('Analytics úspěšně načteny:', {
        totalCodes: promoCodes?.length || 0,
        activeCodes: validCodes.length,
        totalRedemptions: redemptions?.length || 0
      });

    } catch (error) {
      console.error('Chyba při načítání analytics:', error);
      toast.error('Nepodařilo se načíst analytics data');
    } finally {
      setIsLoading(false);
    }
  };

  const exportAnalytics = () => {
    if (!stats) return;

    const data = {
      exportDate: new Date().toISOString(),
      dateRange,
      summary: {
        totalCodes: stats.totalCodes,
        activeCodes: stats.activeCodes,
        totalRedemptions: stats.totalRedemptions,
        totalDiscountGiven: stats.totalDiscountGiven
      },
      popularCodes: stats.popularCodes,
      recentActivity: stats.recentActivity
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: 'application/json'
    });
    
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `promo-code-analytics-${dateRange}-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast.success('Analytics data exportována');
  };

  useEffect(() => {
    fetchAnalytics();
  }, [dateRange]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <RefreshCw className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!stats) {
    return (
      <Card>
        <CardContent className="p-6">
          <p className="text-center text-muted-foreground">
            Nepodařilo se načíst analytics data.
          </p>
          <Button onClick={fetchAnalytics} className="mt-4 mx-auto block">
            Zkusit znovu
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Promo Code Analytics</h2>
          <p className="text-muted-foreground">
            Kompletní přehled využití a výkonnosti promo kódů
          </p>
        </div>
        <div className="flex gap-2">
          <Button onClick={fetchAnalytics} variant="outline" size="sm">
            <RefreshCw className="h-4 w-4 mr-2" />
            Obnovit
          </Button>
          <Button onClick={exportAnalytics} size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Gift className="h-4 w-4" />
              Celkem kódů
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalCodes}</div>
            <p className="text-xs text-muted-foreground">
              {stats.activeCodes} aktivních
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Users className="h-4 w-4" />
              Použití
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalRedemptions}</div>
            <p className="text-xs text-muted-foreground">celkový počet použití</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              Celková sleva
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalDiscountGiven}%</div>
            <p className="text-xs text-muted-foreground">poskytnutá sleva</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Průměr za den
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {Math.round(stats.totalRedemptions / 30)}
            </div>
            <p className="text-xs text-muted-foreground">posledních 30 dní</p>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Analytics */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Přehled</TabsTrigger>
          <TabsTrigger value="performance">Výkonnost</TabsTrigger>
          <TabsTrigger value="trends">Trendy</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Nejpopulárnější kódy */}
            <Card>
              <CardHeader>
                <CardTitle>Nejpopulárnější kódy</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {stats.popularCodes.map((code, index) => (
                    <div key={code.code} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Badge variant="outline">
                          #{index + 1}
                        </Badge>
                        <div>
                          <div className="font-medium">{code.code}</div>
                          <div className="text-sm text-muted-foreground">
                            {code.discount}% sleva
                          </div>
                        </div>
                      </div>
                      <Badge variant="secondary">
                        {code.usage}× použito
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Nedávná aktivita */}
            <Card>
              <CardHeader>
                <CardTitle>Nedávná aktivita</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {stats.recentActivity.map((activity, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div>
                        <div className="font-medium">{activity.code}</div>
                        <div className="text-sm text-muted-foreground">
                          {new Date(activity.redeemedAt).toLocaleDateString('cs-CZ')}
                        </div>
                      </div>
                      <Badge variant="outline">
                        {activity.discount}% sleva
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="performance">
          <PromoCodePerformanceTable />
        </TabsContent>

        <TabsContent value="trends">
          <div className="space-y-4">
            <PromoCodeUsageChart dateRange={dateRange} />
            <PromoCodeTrendsChart dateRange={dateRange} />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default PromoCodeAnalyticsDashboard;
