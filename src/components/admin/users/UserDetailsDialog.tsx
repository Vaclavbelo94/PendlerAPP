
import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  User, 
  Crown, 
  Shield, 
  Calendar, 
  Activity, 
  Car,
  Calculator,
  Languages,
  Briefcase,
  MapPin
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface UserDetailsDialogProps {
  userId: string;
  onClose: () => void;
}

interface UserDetails {
  id: string;
  email: string | null;
  username: string | null;
  is_premium: boolean | null;
  is_admin: boolean | null;
  created_at: string;
  premium_expiry: string | null;
  last_login: string | null;
  profile_data?: any;
}

interface UserActivity {
  shifts_count: number;
  vehicles_count: number;
  vocabulary_progress: number;
  calculator_usage: number;
  last_active: string | null;
}

export const UserDetailsDialog: React.FC<UserDetailsDialogProps> = ({ userId, onClose }) => {
  const [userDetails, setUserDetails] = useState<UserDetails | null>(null);
  const [userActivity, setUserActivity] = useState<UserActivity | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchUserDetails();
  }, [userId]);

  const fetchUserDetails = async () => {
    try {
      setIsLoading(true);

      // Fetch user profile
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (profileError) throw profileError;

      // Fetch user statistics
      const { data: stats, error: statsError } = await supabase
        .from('user_statistics')
        .select('*')
        .eq('user_id', userId)
        .single();

      // Fetch activity data
      const [shiftsResult, vehiclesResult] = await Promise.all([
        supabase.from('shifts').select('*', { count: 'exact', head: true }).eq('user_id', userId),
        supabase.from('vehicles').select('*', { count: 'exact', head: true }).eq('user_id', userId)
      ]);

      setUserDetails({
        ...profile,
        last_login: stats?.last_login || null,
        profile_data: null
      });

      setUserActivity({
        shifts_count: shiftsResult.count || 0,
        vehicles_count: vehiclesResult.count || 0,
        vocabulary_progress: 0, // Will be implemented when vocabulary table exists
        calculator_usage: stats?.login_count || 0, // Using login_count as proxy for calculator usage
        last_active: stats?.last_login || null
      });

    } catch (error) {
      console.error('Error fetching user details:', error);
      toast.error('Nepodařilo se načíst detail uživatele');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <Dialog open onOpenChange={onClose}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  if (!userDetails) {
    return (
      <Dialog open onOpenChange={onClose}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Chyba</DialogTitle>
            <DialogDescription>
              Nepodařilo se načíst detail uživatele.
            </DialogDescription>
          </DialogHeader>
          <Button onClick={onClose}>Zavřít</Button>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Detail uživatele
          </DialogTitle>
          <DialogDescription>
            Kompletní přehled uživatele {userDetails.email}
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Přehled</TabsTrigger>
            <TabsTrigger value="activity">Aktivita</TabsTrigger>
            <TabsTrigger value="data">Data</TabsTrigger>
            <TabsTrigger value="settings">Nastavení</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Základní informace</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Email</label>
                    <p className="text-sm">{userDetails.email}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Uživatelské jméno</label>
                    <p className="text-sm">{userDetails.username || 'Nenastaveno'}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Registrace</label>
                    <p className="text-sm">{new Date(userDetails.created_at).toLocaleDateString('cs-CZ')}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Poslední přihlášení</label>
                    <p className="text-sm">
                      {userDetails.last_login 
                        ? new Date(userDetails.last_login).toLocaleDateString('cs-CZ')
                        : 'Nikdy'
                      }
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Status a oprávnění</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex gap-2">
                    {userDetails.is_premium && (
                      <Badge variant="default" className="bg-amber-100 text-amber-800">
                        <Crown className="h-3 w-3 mr-1" />
                        Premium
                      </Badge>
                    )}
                    {userDetails.is_admin && (
                      <Badge variant="destructive">
                        <Shield className="h-3 w-3 mr-1" />
                        Admin
                      </Badge>
                    )}
                    {!userDetails.is_premium && !userDetails.is_admin && (
                      <Badge variant="secondary">Běžný uživatel</Badge>
                    )}
                  </div>
                  {userDetails.premium_expiry && (
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Premium do</label>
                      <p className="text-sm">
                        {new Date(userDetails.premium_expiry).toLocaleDateString('cs-CZ')}
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="activity" className="space-y-4">
            {userActivity && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm flex items-center gap-2">
                      <Briefcase className="h-4 w-4" />
                      Směny
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{userActivity.shifts_count}</div>
                    <p className="text-xs text-muted-foreground">Celkem naplánováno</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm flex items-center gap-2">
                      <Car className="h-4 w-4" />
                      Vozidla
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{userActivity.vehicles_count}</div>
                    <p className="text-xs text-muted-foreground">Registrovaných vozidel</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm flex items-center gap-2">
                      <Languages className="h-4 w-4" />
                      Slovní zásoba
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{userActivity.vocabulary_progress}</div>
                    <p className="text-xs text-muted-foreground">Naučených slov</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm flex items-center gap-2">
                      <Calculator className="h-4 w-4" />
                      Aktivita
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{userActivity.calculator_usage}</div>
                    <p className="text-xs text-muted-foreground">Počet přihlášení</p>
                  </CardContent>
                </Card>
              </div>
            )}
          </TabsContent>

          <TabsContent value="data" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Uživatelská data</CardTitle>
                <CardDescription>
                  Přehled všech dat uložených pro tohoto uživatele
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-sm text-muted-foreground">
                  Detailní analýza dat bude implementována v další verzi.
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Nastavení účtu</CardTitle>
                <CardDescription>
                  Správa nastavení a preferencí uživatele
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-sm text-muted-foreground">
                  Správa nastavení bude implementována v další verzi.
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="flex justify-end gap-2 pt-4 border-t">
          <Button variant="outline" onClick={onClose}>
            Zavřít
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
