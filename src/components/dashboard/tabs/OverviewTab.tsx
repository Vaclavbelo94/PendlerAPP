
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CalendarDays, TrendingUp, Clock, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/hooks/auth';
import { supabase } from '@/integrations/supabase/client';
import { useState, useEffect } from 'react';

const OverviewTab = () => {
  const { user } = useAuth();
  const [displayName, setDisplayName] = useState<string>('');
  
  // Load user's display name from extended profile
  useEffect(() => {
    const loadDisplayName = async () => {
      if (!user?.id) return;
      
      try {
        const { data: extendedProfile } = await supabase
          .from('user_extended_profiles')
          .select('display_name')
          .eq('user_id', user.id)
          .maybeSingle();
          
        const name = extendedProfile?.display_name || user?.email?.split('@')[0] || 'uživatel';
        setDisplayName(name);
      } catch (error) {
        console.error('Error loading display name:', error);
        setDisplayName(user?.email?.split('@')[0] || 'uživatel');
      }
    };
    
    loadDisplayName();
  }, [user]);

  // Mock data - would come from API
  const stats = {
    totalShifts: 45,
    upcomingShifts: 3,
    hoursThisMonth: 168,
    favoriteLocation: 'Frankfurt'
  };

  return (
    <div className="space-y-6">
      {/* Welcome section */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Vítejte zpět, {displayName}!
        </h2>
        <p className="text-gray-600">
          Zde je přehled vašich nejnovějších aktivit a nadcházejících směn.
        </p>
      </div>

      {/* Statistics cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Celkem směn</CardTitle>
            <CalendarDays className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalShifts}</div>
            <p className="text-xs text-muted-foreground">Za celou dobu</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Nadcházející</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.upcomingShifts}</div>
            <p className="text-xs text-muted-foreground">Naplánované směny</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Hodiny tento měsíc</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.hoursThisMonth}</div>
            <p className="text-xs text-muted-foreground">Odpracováno</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Oblíbená lokace</CardTitle>
            <MapPin className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.favoriteLocation}</div>
            <p className="text-xs text-muted-foreground">Nejčastější</p>
          </CardContent>
        </Card>
      </div>

      {/* Quick actions */}
      <Card>
        <CardHeader>
          <CardTitle>Rychlé akce</CardTitle>
          <CardDescription>Nejčastěji používané funkce</CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Button asChild variant="outline" className="h-20 flex-col">
            <Link to="/shifts">
              <CalendarDays className="h-6 w-6 mb-2" />
              Správa směn
            </Link>
          </Button>
          <Button asChild variant="outline" className="h-20 flex-col">
            <Link to="/tax-advisor">
              <TrendingUp className="h-6 w-6 mb-2" />
              Daňový poradce
            </Link>
          </Button>
          <Button asChild variant="outline" className="h-20 flex-col">
            <Link to="/translator">
              <MapPin className="h-6 w-6 mb-2" />
              Překladač
            </Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default OverviewTab;
