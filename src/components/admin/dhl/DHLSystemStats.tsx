
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { Building2, Users, Calendar, TrendingUp } from 'lucide-react';
import LoadingSpinner from '@/components/LoadingSpinner';

interface DHLStats {
  totalPositions: number;
  activePositions: number;
  totalWorkGroups: number;
  activeWorkGroups: number;
  totalShiftTemplates: number;
  totalAssignments: number;
  activeAssignments: number;
  totalDHLShifts: number;
}

const DHLSystemStats: React.FC = () => {
  const [stats, setStats] = useState<DHLStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setIsLoading(true);

      // Fetch all stats in parallel
      const [
        positionsResult,
        workGroupsResult,
        templatesResult,
        assignmentsResult,
        shiftsResult
      ] = await Promise.all([
        supabase.from('dhl_positions').select('id, is_active'),
        supabase.from('dhl_work_groups').select('id, is_active'),
        supabase.from('dhl_shift_templates').select('id'),
        supabase.from('user_dhl_assignments').select('id, is_active'),
        supabase.from('shifts').select('id').eq('is_dhl_managed', true)
      ]);

      const positions = positionsResult.data || [];
      const workGroups = workGroupsResult.data || [];
      const templates = templatesResult.data || [];
      const assignments = assignmentsResult.data || [];
      const shifts = shiftsResult.data || [];

      setStats({
        totalPositions: positions.length,
        activePositions: positions.filter(p => p.is_active).length,
        totalWorkGroups: workGroups.length,
        activeWorkGroups: workGroups.filter(g => g.is_active).length,
        totalShiftTemplates: templates.length,
        totalAssignments: assignments.length,
        activeAssignments: assignments.filter(a => a.is_active).length,
        totalDHLShifts: shifts.length
      });

    } catch (error) {
      console.error('Error fetching DHL stats:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (!stats) {
    return (
      <Card>
        <CardContent className="p-6">
          <p className="text-center text-muted-foreground">
            Nepodařilo se načíst statistiky DHL systému
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Building2 className="h-5 w-5 text-blue-600" />
              <div>
                <p className="text-sm text-muted-foreground">DHL Pozice</p>
                <p className="text-2xl font-bold">{stats.activePositions}</p>
                <p className="text-xs text-muted-foreground">
                  z {stats.totalPositions} celkem
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5 text-green-600" />
              <div>
                <p className="text-sm text-muted-foreground">Pracovní skupiny</p>
                <p className="text-2xl font-bold">{stats.activeWorkGroups}</p>
                <p className="text-xs text-muted-foreground">
                  z {stats.totalWorkGroups} celkem
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-orange-600" />
              <div>
                <p className="text-sm text-muted-foreground">Šablony směn</p>
                <p className="text-2xl font-bold">{stats.totalShiftTemplates}</p>
                <p className="text-xs text-muted-foreground">aktivních šablon</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-purple-600" />
              <div>
                <p className="text-sm text-muted-foreground">Aktivní uživatelé</p>
                <p className="text-2xl font-bold">{stats.activeAssignments}</p>
                <p className="text-xs text-muted-foreground">
                  z {stats.totalAssignments} přiřazených
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Systémový přehled</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span>Celkem DHL směn:</span>
              <Badge variant="secondary">{stats.totalDHLShifts}</Badge>
            </div>
            
            <div className="flex items-center justify-between">
              <span>Aktivní pozice:</span>
              <Badge variant={stats.activePositions > 0 ? "success" : "destructive"}>
                {stats.activePositions > 0 ? "Funkční" : "Chyba"}
              </Badge>
            </div>
            
            <div className="flex items-center justify-between">
              <span>Aktivní pracovní skupiny:</span>
              <Badge variant={stats.activeWorkGroups > 0 ? "success" : "destructive"}>
                {stats.activeWorkGroups > 0 ? "Funkční" : "Chyba"}
              </Badge>
            </div>
            
            <div className="flex items-center justify-between">
              <span>Šablony směn:</span>
              <Badge variant={stats.totalShiftTemplates > 0 ? "success" : "outline"}>
                {stats.totalShiftTemplates > 0 ? "Nakonfigurovány" : "Není nakonfigurováno"}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DHLSystemStats;
