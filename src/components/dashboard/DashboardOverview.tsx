import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CalendarDays, TrendingUp, Users, Activity } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/hooks/auth';

const DashboardOverview = () => {
  const { user, unifiedUser } = useAuth();

  // Placeholder data for demonstration
  const totalShifts = 1250;
  const activeUsers = 457;
  const shiftStreak = 15;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Směny celkem</CardTitle>
            <CardDescription>Počet všech zadaných směn</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalShifts}</div>
            <p className="text-sm text-muted-foreground">
              Včetně budoucích a minulých směn
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Aktivní uživatelé</CardTitle>
            <CardDescription>Uživatelé, kteří zadali alespoň jednu směnu</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeUsers}</div>
            <p className="text-sm text-muted-foreground">
              Za posledních 30 dní
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Série směn</CardTitle>
            <CardDescription>Nejdelší série po sobě jdoucích směn</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{shiftStreak}</div>
            <p className="text-sm text-muted-foreground">
              Aktuální série
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DashboardOverview;
