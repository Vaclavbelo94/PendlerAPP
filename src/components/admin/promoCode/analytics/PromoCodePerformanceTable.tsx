
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { supabase } from '@/integrations/supabase/client';

interface PromoCodePerformance {
  code: string;
  discount: number;
  duration: number;
  maxUses: number | null;
  usedCount: number;
  validUntil: string;
  usageRate: number;
  isActive: boolean;
}

const PromoCodePerformanceTable: React.FC = () => {
  const [codes, setCodes] = useState<PromoCodePerformance[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchPerformanceData = async () => {
    setIsLoading(true);
    try {
      const { data: promoCodes, error } = await supabase
        .from('promo_codes')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      const now = new Date();
      const performanceData = promoCodes?.map(code => {
        const usageRate = code.max_uses 
          ? (code.used_count / code.max_uses) * 100 
          : code.used_count * 10; // Odhad pro neomezené kódy
        
        return {
          code: code.code,
          discount: code.discount,
          duration: code.duration,
          maxUses: code.max_uses,
          usedCount: code.used_count,
          validUntil: code.valid_until,
          usageRate: Math.min(usageRate, 100),
          isActive: new Date(code.valid_until) > now
        };
      }) || [];

      setCodes(performanceData);
    } catch (error) {
      console.error('Chyba při načítání performance dat:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPerformanceData();
  }, []);

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Výkonnost promo kódů</CardTitle>
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
        <CardTitle>Výkonnost promo kódů</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Kód</TableHead>
              <TableHead>Sleva</TableHead>
              <TableHead>Délka</TableHead>
              <TableHead>Využití</TableHead>
              <TableHead>Míra využití</TableHead>
              <TableHead>Platnost</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {codes.map((code) => (
              <TableRow key={code.code}>
                <TableCell className="font-medium">{code.code}</TableCell>
                <TableCell>
                  <Badge variant="secondary">{code.discount}%</Badge>
                </TableCell>
                <TableCell>{code.duration} měsíců</TableCell>
                <TableCell>
                  {code.usedCount}
                  {code.maxUses && ` / ${code.maxUses}`}
                </TableCell>
                <TableCell>
                  <div className="space-y-1">
                    <Progress value={code.usageRate} className="h-2" />
                    <span className="text-xs text-muted-foreground">
                      {code.usageRate.toFixed(1)}%
                    </span>
                  </div>
                </TableCell>
                <TableCell>
                  {new Date(code.validUntil).toLocaleDateString('cs-CZ')}
                </TableCell>
                <TableCell>
                  <Badge variant={code.isActive ? "default" : "secondary"}>
                    {code.isActive ? "Aktivní" : "Vypršel"}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default PromoCodePerformanceTable;
