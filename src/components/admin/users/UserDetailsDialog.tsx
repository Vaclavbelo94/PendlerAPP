
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { 
  User, 
  Mail, 
  Calendar, 
  Activity, 
  Car, 
  Clock, 
  Crown, 
  Shield,
  MapPin,
  Phone,
  Globe,
  Download
} from 'lucide-react';
import { toast } from 'sonner';

interface UserDetailsDialogProps {
  userId: string;
  onClose: () => void;
}

interface UserDetails {
  id: string;
  email: string;
  username: string;
  is_premium: boolean;
  is_admin: boolean;
  created_at: string;
  last_login: string | null;
  profile: {
    display_name?: string;
    bio?: string;
    location?: string;
    website?: string;
    phone?: string;
  };
  stats: {
    total_shifts: number;
    total_vehicles: number;
    last_activity: string;
    login_count: number;
  };
  recent_activity: Array<{
    action: string;
    resource: string;
    timestamp: string;
  }>;
}

export const UserDetailsDialog: React.FC<UserDetailsDialogProps> = ({ userId, onClose }) => {
  const [userDetails, setUserDetails] = useState<UserDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Mock data for demonstration
  const mockUserDetails: UserDetails = {
    id: userId,
    email: 'user@example.com',
    username: 'john_doe',
    is_premium: true,
    is_admin: false,
    created_at: '2024-01-15T10:30:00Z',
    last_login: new Date().toISOString(),
    profile: {
      display_name: 'John Doe',
      bio: 'Pendler z Prahy do Brna',
      location: 'Praha, Česká republika',
      website: 'https://johndoe.com',
      phone: '+420 123 456 789'
    },
    stats: {
      total_shifts: 87,
      total_vehicles: 2,
      last_activity: new Date(Date.now() - 3600000).toISOString(),
      login_count: 245
    },
    recent_activity: [
      { action: 'login', resource: 'auth', timestamp: new Date().toISOString() },
      { action: 'create_shift', resource: 'shifts', timestamp: new Date(Date.now() - 3600000).toISOString() },
      { action: 'access_premium', resource: 'premium', timestamp: new Date(Date.now() - 7200000).toISOString() }
    ]
  };

  useEffect(() => {
    fetchUserDetails();
  }, [userId]);

  const fetchUserDetails = async () => {
    setIsLoading(true);
    try {
      // TODO: Replace with actual Supabase query
      await new Promise(resolve => setTimeout(resolve, 1000));
      setUserDetails(mockUserDetails);
    } catch (error) {
      console.error('Error fetching user details:', error);
      toast.error('Nepodařilo se načíst detaily uživatele');
    } finally {
      setIsLoading(false);
    }
  };

  const exportUserData = async () => {
    if (!userDetails) return;

    try {
      const data = {
        basic_info: {
          email: userDetails.email,
          username: userDetails.username,
          created_at: userDetails.created_at,
          last_login: userDetails.last_login
        },
        profile: userDetails.profile,
        stats: userDetails.stats,
        recent_activity: userDetails.recent_activity
      };

      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `user-data-${userDetails.email}-${new Date().toISOString().split('T')[0]}.json`;
      link.click();
      URL.revokeObjectURL(url);
      
      toast.success('Data uživatele exportována');
    } catch (error) {
      console.error('Export error:', error);
      toast.error('Nepodařilo se exportovat data');
    }
  };

  if (isLoading) {
    return (
      <Dialog open={true} onOpenChange={onClose}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  if (!userDetails) {
    return (
      <Dialog open={true} onOpenChange={onClose}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Chyba</DialogTitle>
            <DialogDescription>
              Nepodařilo se načíst detaily uživatele.
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Avatar className="h-12 w-12">
                <AvatarFallback>
                  {userDetails.email.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div>
                <DialogTitle className="text-xl">
                  {userDetails.profile.display_name || userDetails.username}
                </DialogTitle>
                <DialogDescription className="flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  {userDetails.email}
                </DialogDescription>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {userDetails.is_admin && (
                <Badge variant="destructive" className="flex items-center gap-1">
                  <Shield className="h-3 w-3" />
                  Admin
                </Badge>
              )}
              {userDetails.is_premium && (
                <Badge variant="default" className="bg-amber-100 text-amber-800 flex items-center gap-1">
                  <Crown className="h-3 w-3" />
                  Premium
                </Badge>
              )}
              <Button variant="outline" size="sm" onClick={exportUserData}>
                <Download className="h-4 w-4 mr-2" />
                Export dat
              </Button>
            </div>
          </div>
        </DialogHeader>

        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Přehled</TabsTrigger>
            <TabsTrigger value="profile">Profil</TabsTrigger>
            <TabsTrigger value="activity">Aktivita</TabsTrigger>
            <TabsTrigger value="stats">Statistiky</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <User className="h-5 w-5" />
                    Základní informace
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Email:</span>
                    <span>{userDetails.email}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Uživatelské jméno:</span>
                    <span>{userDetails.username}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Registrace:</span>
                    <span>{new Date(userDetails.created_at).toLocaleDateString('cs-CZ')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Poslední přihlášení:</span>
                    <span>
                      {userDetails.last_login 
                        ? new Date(userDetails.last_login).toLocaleString('cs-CZ')
                        : 'Nikdy'
                      }
                    </span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Activity className="h-5 w-5" />
                    Rychlé statistiky
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Celkem směn:</span>
                    <Badge variant="secondary">{userDetails.stats.total_shifts}</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Vozidla:</span>
                    <Badge variant="secondary">{userDetails.stats.total_vehicles}</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Počet přihlášení:</span>
                    <Badge variant="secondary">{userDetails.stats.login_count}</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Poslední aktivita:</span>
                    <span className="text-sm">
                      {new Date(userDetails.stats.last_activity).toLocaleString('cs-CZ')}
                    </span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="profile" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Profilové informace</CardTitle>
                <CardDescription>
                  Detailní informace z uživatelského profilu
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {userDetails.profile.display_name && (
                  <div className="flex items-center gap-3">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <div className="font-medium">Zobrazované jméno</div>
                      <div className="text-sm text-muted-foreground">{userDetails.profile.display_name}</div>
                    </div>
                  </div>
                )}

                {userDetails.profile.bio && (
                  <div className="flex items-start gap-3">
                    <Mail className="h-4 w-4 text-muted-foreground mt-1" />
                    <div>
                      <div className="font-medium">Bio</div>
                      <div className="text-sm text-muted-foreground">{userDetails.profile.bio}</div>
                    </div>
                  </div>
                )}

                {userDetails.profile.location && (
                  <div className="flex items-center gap-3">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <div className="font-medium">Lokace</div>
                      <div className="text-sm text-muted-foreground">{userDetails.profile.location}</div>
                    </div>
                  </div>
                )}

                {userDetails.profile.website && (
                  <div className="flex items-center gap-3">
                    <Globe className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <div className="font-medium">Webové stránky</div>
                      <div className="text-sm text-muted-foreground">
                        <a href={userDetails.profile.website} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                          {userDetails.profile.website}
                        </a>
                      </div>
                    </div>
                  </div>
                )}

                {userDetails.profile.phone && (
                  <div className="flex items-center gap-3">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <div className="font-medium">Telefon</div>
                      <div className="text-sm text-muted-foreground">{userDetails.profile.phone}</div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="activity" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Nedávná aktivita</CardTitle>
                <CardDescription>
                  Posledních 10 akcí uživatele
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {userDetails.recent_activity.map((activity, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <Activity className="h-4 w-4 text-muted-foreground" />
                        <div>
                          <div className="font-medium">{activity.action}</div>
                          <div className="text-sm text-muted-foreground">{activity.resource}</div>
                        </div>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {new Date(activity.timestamp).toLocaleString('cs-CZ')}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="stats" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="h-5 w-5" />
                    Směny
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{userDetails.stats.total_shifts}</div>
                  <p className="text-sm text-muted-foreground">Celkem vytvořených směn</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Car className="h-5 w-5" />
                    Vozidla
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{userDetails.stats.total_vehicles}</div>
                  <p className="text-sm text-muted-foreground">Registrovaných vozidel</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="h-5 w-5" />
                    Přihlášení
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{userDetails.stats.login_count}</div>
                  <p className="text-sm text-muted-foreground">Celkem přihlášení</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="h-5 w-5" />
                    Aktivita
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-sm font-medium text-green-600">Aktivní</div>
                  <p className="text-sm text-muted-foreground">
                    Naposledy: {new Date(userDetails.stats.last_activity).toLocaleString('cs-CZ')}
                  </p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};
