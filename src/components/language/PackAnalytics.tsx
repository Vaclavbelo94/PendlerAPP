
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { 
  BarChart3, 
  TrendingUp, 
  Clock, 
  Star, 
  Download,
  Users,
  Zap
} from 'lucide-react';

interface PackAnalyticsProps {
  usageReport: any;
  analytics: any[];
}

export const PackAnalytics: React.FC<PackAnalyticsProps> = ({ 
  usageReport, 
  analytics 
}) => {
  if (!usageReport) {
    return (
      <Card>
        <CardContent className="text-center py-8">
          <BarChart3 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">Žádná analytická data k dispozici</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center gap-2">
              <Download className="h-4 w-4" />
              Celkem balíčků
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{usageReport.totalPacks}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center gap-2">
              <Star className="h-4 w-4" />
              Nejpoužívanější
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-lg font-medium">{usageReport.mostUsedPack}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              Průměrná dokončenost
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {Math.round(usageReport.avgCompletionRate * 100)}%
            </div>
            <Progress value={usageReport.avgCompletionRate * 100} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center gap-2">
              <Zap className="h-4 w-4" />
              Aktivní trendy
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{usageReport.trends?.length || 0}</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-sm flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            Trendy využití balíčků
          </CardTitle>
        </CardHeader>
        <CardContent>
          {usageReport.trends && usageReport.trends.length > 0 ? (
            <div className="space-y-3">
              {usageReport.trends.map((trend: any, index: number) => (
                <div key={index} className="flex items-center justify-between p-3 border rounded">
                  <div className="flex items-center gap-3">
                    <div className="text-sm font-medium">{trend.packId}</div>
                    <Badge variant={trend.trend === 'increasing' ? 'default' : 'secondary'}>
                      {trend.trend === 'increasing' ? 'Rostoucí' : 'Stabilní'}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-gray-400" />
                    <span className="text-sm text-gray-600">
                      {Math.round(trend.momentum)} min
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-4 text-gray-500">
              Zatím nejsou k dispozici žádné trendy
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
