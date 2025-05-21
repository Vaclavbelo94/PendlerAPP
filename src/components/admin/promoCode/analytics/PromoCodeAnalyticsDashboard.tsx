
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { 
  ChartContainer, 
  ChartTooltip, 
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent 
} from "@/components/ui/chart";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { UsageOverTimeChart } from "./UsageOverTimeChart";
import { DiscountDistributionChart } from "./DiscountDistributionChart";
import { RedemptionRateCard } from "./RedemptionRateCard";
import { PromoCodeBreakdownTable } from "./PromoCodeBreakdownTable";
import { fetchPromoCodeAnalytics } from "../api/analyticsApi";
import { PromoCodeAnalytics } from "../types";

export const PromoCodeAnalyticsDashboard = () => {
  const [analytics, setAnalytics] = useState<PromoCodeAnalytics | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [timeframe, setTimeframe] = useState<"week" | "month" | "year">("month");

  useEffect(() => {
    const loadAnalytics = async () => {
      setIsLoading(true);
      try {
        const data = await fetchPromoCodeAnalytics(timeframe);
        setAnalytics(data);
      } catch (error) {
        console.error("Error fetching analytics data:", error);
        toast.error("Nepodařilo se načíst analytická data");
      } finally {
        setIsLoading(false);
      }
    };

    loadAnalytics();
  }, [timeframe]);

  if (!analytics && isLoading) {
    return <AnalyticsLoadingSkeleton />;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <h2 className="text-2xl font-bold">Analýza promo kódů</h2>
        <Tabs 
          value={timeframe} 
          onValueChange={(value) => setTimeframe(value as "week" | "month" | "year")}
          className="w-full sm:w-auto"
        >
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="week">Týden</TabsTrigger>
            <TabsTrigger value="month">Měsíc</TabsTrigger>
            <TabsTrigger value="year">Rok</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <RedemptionRateCard
          redeemed={analytics?.totalRedemptions || 0}
          created={analytics?.totalPromoCodes || 0}
        />
        <MetricCard
          title="Průměrná sleva"
          value={`${analytics?.averageDiscount || 0}%`}
          trend={analytics?.discountTrend || 0}
        />
        <MetricCard
          title="Nejpoužívanější kód"
          value={analytics?.mostUsedCode || 'N/A'}
          subtitle={`${analytics?.mostUsedCodeCount || 0}× použito`}
        />
        <MetricCard
          title="Platných kódů"
          value={analytics?.activePromoCodes || 0}
          trend={analytics?.activeCodesTrend || 0}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Použití v průběhu času</CardTitle>
            <CardDescription>Počet uplatnění kódů v průběhu času</CardDescription>
          </CardHeader>
          <CardContent>
            {analytics?.usageOverTime ? (
              <ChartContainer
                config={{
                  usages: { theme: { light: "#3b82f6", dark: "#2563eb" } },
                  creations: { theme: { light: "#10b981", dark: "#059669" } }
                }}
                className="h-80"
              >
                <UsageOverTimeChart data={analytics.usageOverTime} />
                <ChartTooltip>
                  <ChartTooltipContent />
                </ChartTooltip>
                <ChartLegend>
                  <ChartLegendContent />
                </ChartLegend>
              </ChartContainer>
            ) : (
              <div className="flex justify-center items-center h-80">
                <p className="text-muted-foreground">Žádná data k zobrazení</p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Rozložení slev</CardTitle>
            <CardDescription>Podíl jednotlivých procentuálních slev</CardDescription>
          </CardHeader>
          <CardContent>
            {analytics?.discountDistribution ? (
              <ChartContainer
                config={{
                  distribution: { theme: { light: "#8b5cf6", dark: "#7c3aed" } }
                }}
                className="h-80"
              >
                <DiscountDistributionChart data={analytics.discountDistribution} />
                <ChartTooltip>
                  <ChartTooltipContent />
                </ChartTooltip>
              </ChartContainer>
            ) : (
              <div className="flex justify-center items-center h-80">
                <p className="text-muted-foreground">Žádná data k zobrazení</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Detailní přehled kódů</CardTitle>
          <CardDescription>Jednotlivé promo kódy a jejich statistiky využití</CardDescription>
        </CardHeader>
        <CardContent>
          {analytics?.codeBreakdown ? (
            <PromoCodeBreakdownTable data={analytics.codeBreakdown} />
          ) : (
            <div className="py-8 text-center">
              <p className="text-muted-foreground">Žádná data k zobrazení</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

interface MetricCardProps {
  title: string;
  value: string | number;
  trend?: number;
  subtitle?: string;
}

const MetricCard = ({ title, value, trend, subtitle }: MetricCardProps) => {
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex flex-col space-y-2">
          <p className="text-sm text-muted-foreground">{title}</p>
          <div className="flex items-baseline justify-between">
            <h3 className="text-2xl font-bold">{value}</h3>
            {trend !== undefined && (
              <div className={`text-sm font-medium ${trend >= 0 ? "text-green-600" : "text-red-600"}`}>
                {trend > 0 && "+"}{trend}%
              </div>
            )}
          </div>
          {subtitle && <p className="text-xs text-muted-foreground">{subtitle}</p>}
        </div>
      </CardContent>
    </Card>
  );
};

const AnalyticsLoadingSkeleton = () => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-10 w-40" />
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {Array(4).fill(0).map((_, i) => (
          <Card key={i}>
            <CardContent className="pt-6">
              <Skeleton className="h-4 w-24 mb-2" />
              <Skeleton className="h-8 w-full mb-2" />
              <Skeleton className="h-3 w-16" />
            </CardContent>
          </Card>
        ))}
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {Array(2).fill(0).map((_, i) => (
          <Card key={i}>
            <CardHeader>
              <Skeleton className="h-5 w-48 mb-1" />
              <Skeleton className="h-4 w-64" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-80 w-full" />
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
