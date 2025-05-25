
import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  User, 
  Crown, 
  Shield, 
  Calendar,
  MapPin,
  Globe,
  Mail,
  Activity,
  Car,
  FileText
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface UserDetailsDialogProps {
  userId: string;
  onClose: () => void;
}

interface UserDetail {
  id: string;
  email: string;
  username: string | null;
  is_premium: boolean;
  is_admin: boolean;
  created_at: string;
  premium_expiry: string | null;
  // Extended profile data
  display_name?: string;
  bio?: string;
  location?: string;
  website?: string;
  preferred_language?: string;
  // Statistics
  login_count?: number;
  last_login?: string;
  shift_count?: number;
  // Activity counts
  vehicles_count?: number;
  shifts_count?: number;
  routes_count?: number;
}

export const UserDetailsDialog: React.FC<UserDetailsDialogProps> = ({ userId, onClose }) => {
  const [user, setUser] = useState<UserDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchUserDetails();
  }, [userId]);

  const fetchUserDetails = async () => {
    try {
      setIsLoading(true);

      // Fetch basic profile
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (profileError) throw profileError;

      // Fetch extended profile
      const { data: extendedProfile } = await supabase
        .from('user_extended_profiles')
        .select('*')
        .eq('user_id', userId)
        .single();

      // Fetch user statistics
      const { data: userStats } = await supabase
        .from('user_statistics')
        .select('*')
        .eq('user_id', userId)
        .single();

      // Fetch activity counts
      const [vehiclesResult, shiftsResult, routesResult] = await Promise.all([
        supabase.from('vehicles').select('id').eq('user_id', userId),
        supabase.from('shifts').select('id').eq('user_id', userId),
        supabase.from('saved_routes').select('id').eq('user_id', userId)
      ]);

      const userDetail: UserDetail = {
        ...profile,
        display_name: extendedProfile?.display_name,
        bio: extendedProfile?.bio,
        location: extendedProfile?.location,
        website: extendedProfile?.website,
        preferred_language: extendedProfile?.preferred_language,
        login_count: userStats?.login_count || 0,
        last_login: userStats?.last_login,
        shift_count: userStats?.shift_count || 0,
        vehicles_count: vehiclesResult.data?.length || 0,
        shifts_count: shiftsResult.data?.length || 0,
        routes_count: routesResult.data?.length || 0
      };

      setUser(userDetail);
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
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  if (!user) {
    return (
      <Dialog open onOpenChange={onClose}>
        <DialogContent>
          <div className="text-center">Uživatel nenalezen</div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Detail uživatele
          </DialogTitle>
          <DialogDescription>
            Kompletní přehled uživatele {user.email}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Header Info */}
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
                <span className="text-2xl font-bold">
                  {(user.display_name || user.email).charAt(0).toUpperCase()}
                </span>
              </div>
              <div>
                <h3 className="text-xl font-semibold">
                  {user.display_name || user.username || user.email.split('@')[0]}
                </h3>
                <p className="text-muted-foreground">{user.email}</p>
                <div className="flex gap-2 mt-2">
                  {user.is_admin && (
                    <Badge variant="destructive">
                      <Shield className="h-3 w-3 mr-1" />
                      Admin
                    </Badge>
                  )}
                  {user.is_premium && (
                    <Badge className="bg-amber-100 text-amber-800">
                      <Crown className="h-3 w-3 mr-1" />
                      Premium
                    </Badge>
                  )}
                </div>
              </div>
            </div>
          </div>

          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="overview">Přehled</TabsTrigger>
              <TabsTrigger value="activity">Aktivita</TabsTrigger>
              <TabsTrigger value="profile">Profil</TabsTrigger>
              <TabsTrigger value="data">Data</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      Registrace
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-lg font-semibold">
                      {new Date(user.created_at).toLocaleDateString('cs-CZ')}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {Math.floor((Date.now() - new Date(user.created_at).getTime()) / (1000 * 60 * 60 * 24))} dní
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium flex items-center gap-2">
                      <Activity className="h-4 w-4" />
                      Přihlášení
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-lg font-semibold">{user.login_count}</div>
                    <p className="text-xs text-muted-foreground">
                      {user.last_login 
                        ? `Naposledy: ${new Date(user.last_login).toLocaleDateString('cs-CZ')}`
                        : 'Nikdy se nepřihlásil'
                      }
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium flex items-center gap-2">
                      <Crown className="h-4 w-4" />
                      Premium Status
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-lg font-semibold">
                      {user.is_premium ? 'Aktivní' : 'Neaktivní'}
                    </div>
                    {user.is_premium && user.premium_expiry && (
                      <p className="text-xs text-muted-foreground">
                        Do: {new Date(user.premium_expiry).toLocaleDateString('cs-CZ')}
                      </p>
                    )}
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="activity" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium flex items-center gap-2">
                      <Car className="h-4 w-4" />
                      Vozidla
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{user.vehicles_count}</div>
                    <p className="text-xs text-muted-foreground">Registrovaných vozidel</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      Směny
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{user.shifts_count}</div>
                    <p className="text-xs text-muted-foreground">Zaznamenaných směn</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium flex items-center gap-2">
                      <MapPin className="h-4 w-4" />
                      Trasy
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{user.routes_count}</div>
                    <p className="text-xs text-muted-foreground">Uložených tras</p>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="profile" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Informace o profilu</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {user.bio && (
                    <div>
                      <label className="text-sm font-medium">Bio</label>
                      <p className="text-sm text-muted-foreground">{user.bio}</p>
                    </div>
                  )}
                  
                  {user.location && (
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">{user.location}</span>
                    </div>
                  )}
                  
                  {user.website && (
                    <div className="flex items-center gap-2">
                      <Globe className="h-4 w-4 text-muted-foreground" />
                      <a href={user.website} target="_blank" rel="noopener noreferrer" 
                         className="text-sm text-blue-600 hover:underline">
                        {user.website}
                      </a>
                    </div>
                  )}
                  
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{user.email}</span>
                  </div>
                  
                  {user.preferred_language && (
                    <div>
                      <label className="text-sm font-medium">Preferovaný jazyk</label>
                      <p className="text-sm text-muted-foreground">
                        {user.preferred_language === 'cs' ? 'Čeština' : 'Němčina'}
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="data" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Data a statistiky</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="font-medium">ID uživatele:</span>
                      <p className="text-muted-foreground font-mono text-xs">{user.id}</p>
                    </div>
                    <div>
                      <span className="font-medium">Datum registrace:</span>
                      <p className="text-muted-foreground">{new Date(user.created_at).toLocaleString('cs-CZ')}</p>
                    </div>
                    <div>
                      <span className="font-medium">Celkem přihlášení:</span>
                      <p className="text-muted-foreground">{user.login_count}</p>
                    </div>
                    <div>
                      <span className="font-medium">Celkem směn:</span>
                      <p className="text-muted-foreground">{user.shift_count}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={onClose}>
              Zavřít
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
