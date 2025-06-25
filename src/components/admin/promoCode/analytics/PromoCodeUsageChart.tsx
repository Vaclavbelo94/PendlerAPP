
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { supabase } from '@/integrations/supabase/client';

interface UsageData {
  date: string;
  usage: number;
  codes: number;
}

interface PromoCodeUsageChartProps {
  dateRange: 'week' | 'month' | 'quarter' | 'year';
}

const PromoCodeUsageChart: React.FC<PromoCodeUsageChartProps> = ({ dateRange }) => {
  const [data, setData] = useState<UsageData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchUsageData = async () => {
    setIsLoading(true);
    try {
      const { data: redemptions, error } = await supabase
        .from('promo_code_redemptions')
        .select('redeemed_at')
        .order('redeemed_at', { ascending: true });

      if (error) throw error;

      // Skupinování dat podle období
      const groupedData = new Map<string, number>();
      
      redemptions?.forEach(redemption => {
        const date = new Date(redemption.redeemed_at || '');
        let key: string;
        
        switch (dateRange) {
          case 'week':
            key = date.toLocaleDateString('cs-CZ', { weekday: 'short' });
            break;
          case 'month':
            key = date.toLocaleDateString('cs-CZ', { day: '2-digit', month: '2-digit' });
            break;
          case 'quarter':
            key = `${date.getFullYear()}-${Math.ceil((date.getMonth() + 1) / 3)}Q`;
            break;
          case 'year':
            key = date.toLocaleDateString('cs-CZ', { month: 'long' });
            break;
          default:
            key = date.toLocaleDateString('cs-CZ');
        }
        
        groupedData.set(key, (groupedData.get(key) || 0) + 1);
      });

      const chartData = Array.from(groupedData.entries()).map(([date, usage]) => ({
        date,
        usage,
        codes: Math.ceil(usage / 2) // Odhad počtu různých kódů
      }));

      setData(chartData);
    } catch (error) {
      console.error('Chyba při načítání usage dat:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsageData();
  }, [dateRange]);

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Využití promo kódů v čase</CardTitle>
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
        <CardTitle>Využití promo kódů v čase</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="usage" fill="#8884d8" name="Použití" />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default PromoCodeUsageChart;
