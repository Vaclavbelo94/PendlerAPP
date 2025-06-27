
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { BarChart3, Users, TrendingUp, Activity, Calendar, Download } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/hooks/auth';

const AdminAnalyticsDashboard = () => {
  const { user, unifiedUser } = useAuth();

  // Sample analytics data - in real app this would come from API
  const analyticsData = {
    totalUsers: 1247,
    activeUsers: 892,
    totalShifts: 5634,
    avgShiftsPerUser: 4.5,
    topLocations: ['Německo', 'Rakousko', 'Švýcarsko'],
    monthlyGrowth: 12.5
  };

  if (!unifiedUser?.isAdmin) {
    return (
      <div className="text-center py-8">
        <p className="text-red-600">Nemáte oprávnění k přístupu na tuto stránku.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Analytics Dashboard</h1>
        <Button variant="outline">
          <Download className="h-4 w-4 mr-2" />
          Export dat
        </Button>
      </div>

      {/* Key metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Celkem uživatelů</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analyticsData.totalUsers}</div>
            <Badge variant="secondary" className="mt-1">
              <TrendingUp className="h-3 w-3 mr-1" />
              +{analyticsData.monthlyGrowth}%
            </Badge>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Aktivní uživatelé</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analyticsData.activeUsers}</div>
            <p className="text-xs text-muted-foreground">Za posledních 30 dní</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Celkem směn</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analyticsData.totalShifts}</div>
            <p className="text-xs text-muted-foreground">Všechny směny</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Průměr směn/uživatel</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analyticsData.avgShiftsPerUser}</div>
            <p className="text-xs text-muted-foreground">Měsíční průměr</p>
          </CardContent>
        </Card>
      </div>

      {/* Additional analytics cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Nejpopulárnější lokace</CardTitle>
            <CardDescription>Top destinace pro práci</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {analyticsData.topLocations.map((location, index) => (
                <div key={index} className="flex justify-between items-center">
                  <span>{location}</span>
                  <Badge variant="outline">#{index + 1}</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Rychlé akce</CardTitle>
            <CardDescription>Správa a export dat</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button variant="outline" className="w-full justify-start">
              <Users className="h-4 w-4 mr-2" />
              Správa uživatelů
            </Button>
            <Button variant="outline" className="w-full justify-start">
              <Calendar className="h-4 w-4 mr-2" />
              Správa směn
            </Button>
            <Button variant="outline" className="w-full justify-start">
              <BarChart3 className="h-4 w-4 mr-2" />
              Detailní reporty
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminAnalyticsDashboard;
