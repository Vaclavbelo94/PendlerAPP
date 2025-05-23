
import React, { useState, useEffect } from 'react';
import { Helmet } from "react-helmet";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import TaxCalculator from "@/components/calculator/TaxCalculator";
import CrossBorderTaxCalculator from "@/components/calculator/CrossBorderTaxCalculator";
import { BadgePercent } from "lucide-react";
import PremiumCheck from "@/components/premium/PremiumCheck";
import { ResponsiveContainer } from "@/components/ui/responsive-container";
import { useMediaQuery } from "@/hooks/use-media-query";
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';

interface CalculationHistory {
  id?: string;
  user_id: string;
  type: string;
  inputs: Record<string, any>;
  result: Record<string, any>;
  created_at?: string;
}

const CalculatorPage = () => {
  const [activeTab, setActiveTab] = useState('tax');
  const isMobile = useMediaQuery("xs");
  const { user } = useAuth();
  const [history, setHistory] = useState<CalculationHistory[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  
  useEffect(() => {
    if (user) {
      loadCalculationHistory();
    }
  }, [user, activeTab]);

  const loadCalculationHistory = async () => {
    if (!user) return;
    
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('calculation_history')
        .select('*')
        .eq('user_id', user.id)
        .eq('type', activeTab)
        .order('created_at', { ascending: false })
        .limit(10);
        
      if (error) throw error;
      setHistory(data || []);
    } catch (error) {
      console.error('Chyba při načítání historie výpočtů:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const saveCalculation = async (type: string, inputs: Record<string, any>, result: Record<string, any>) => {
    if (!user) return;
    
    try {
      const { error } = await supabase
        .from('calculation_history')
        .insert({
          user_id: user.id,
          type,
          inputs,
          result,
        });
        
      if (error) throw error;
      loadCalculationHistory();
    } catch (error) {
      console.error('Chyba při ukládání výpočtu:', error);
      toast.error('Nepodařilo se uložit výpočet');
    }
  };
  
  return (
    <PremiumCheck featureKey="calculators">
      <ResponsiveContainer className="py-4 sm:py-6">
        <Helmet>
          <title>Kalkulačky | Pendler Buddy</title>
        </Helmet>
        <h1 className="text-2xl sm:text-3xl font-bold mb-2 sm:mb-4">Kalkulačky</h1>
        <div className="mb-3 sm:mb-5">
          <p className="text-sm sm:text-base text-muted-foreground">
            Daňové kalkulačky pro pendlery pracující v Německu, převod měn a odhad nákladů.
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-3 sm:space-y-4">
          <TabsList className="bg-muted/60 p-0.5 h-auto w-full justify-start overflow-x-auto">
            <TabsTrigger 
              value="tax" 
              className="flex items-center gap-1 py-1 px-2 sm:py-1.5 sm:px-3 text-[10px] sm:text-xs"
            >
              <BadgePercent className="h-3 w-3 sm:h-4 sm:w-4" /> 
              <span>Daňová</span>
            </TabsTrigger>
            <TabsTrigger 
              value="border" 
              className="flex items-center gap-1 py-1 px-2 sm:py-1.5 sm:px-3 text-[10px] sm:text-xs"
            >
              <BadgePercent className="h-3 w-3 sm:h-4 sm:w-4" /> 
              <span>Přeshraniční</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="tax">
            <TaxCalculator 
              onCalculate={(inputs, result) => saveCalculation('tax', inputs, result)} 
              calculationHistory={history}
            />
          </TabsContent>
          
          <TabsContent value="border">
            <CrossBorderTaxCalculator 
              onCalculate={(inputs, result) => saveCalculation('border', inputs, result)}
              calculationHistory={history}
            />
          </TabsContent>
        </Tabs>
      </ResponsiveContainer>
    </PremiumCheck>
  );
};

export default CalculatorPage;
