
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts';
import { supabase } from '@/integrations/supabase/client';

interface TrendData {
  date: string;
  newCodes: number;
  activeUsers: number;
  conversionRate: number;
}

interface PromoCodeTrendsChartProps {
  dateRange: 'week' | 'month' | 'quarter' | 'year';
}

const PromoCodeTrendsChart: React.FC<PromoCodeTrendsChartProps> = ({ dateRange }) => {
  const [data, setData] = useState<TrendData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchTrendsData = async () => {
    setIsLoading(true);
    try {
      // Načteme data pro trendy
      const { data: promoCodes, error: promoError } = await supabase
        .from('promo_codes')
        .select('created_at');

      const { data: redemptions, error: redemptionError } = await supabase
        .from('promo_code_redemptions')
        .select('redeemed_at, user_id');

      if (promoError || redemptionError) {
        throw promoError || redemptionError;
      }

      // Simulace trend dat - v reálné aplikaci by se počítalo z reálných dat
      const trendData: TrendData[] = [];
      const now = new Date();
      const daysToShow = dateRange === 'week' ? 7 : dateRange === 'month' ? 30 : 90;

      for (let i = daysToShow - 1; i >= 0; i--) {
        const date = new Date(now);
        date.setDate(date.getDate() - i);
        
        // Simulace dat
        const newCodes = Math.floor(Math.random() * 3);
        const activeUsers = Math.floor(Math.random() * 50) + 10;
        const conversionRate = Math.random() * 20 + 5;

        trendData.push({
          date: date.toLocaleDateString('cs-CZ', { 
            day: '2-digit', 
            month: '2-digit' 
          }),
          newCodes,
          activeUsers,
          conversionRate
        });
      }

      setData(trendData);
    } catch (error) {
      console.error('Chyba při načítání trend dat:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTrendsData();
  }, [dateRange]);

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Trendy využití</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64 flex items-center justify-center">
            <div className="text-muted-foreground">Načítám data...</div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Trendy využití</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Area 
              type="monotone" 
              dataKey="activeUsers" 
              stackId="1"
              stroke="#8884d8" 
              fill="#8884d8" 
              name="Aktivní uživatelé"
            />
            <Area 
              type="monotone" 
              dataKey="conversionRate" 
              stackId="2"
              stroke="#82ca9d" 
              fill="#82ca9d" 
              name="Míra konverze (%)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default PromoCodeTrendsChart;
