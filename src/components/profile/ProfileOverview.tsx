
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { 
  User, 
  Crown, 
  Settings, 
  Activity, 
  Shield, 
  Mail,
  Calendar,
  CheckCircle,
  AlertCircle,
  ArrowRight,
  Download,
  Upload
} from "lucide-react";

interface ProfileOverviewProps {
  userId?: string;
}

const ProfileOverview: React.FC<ProfileOverviewProps> = ({ userId }) => {
  const { user, isPremium, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [profileCompletion, setProfileCompletion] = useState(65);

  useEffect(() => {
    // Calculate profile completion based on available data
    let completion = 0;
    if (user?.email) completion += 25;
    if (user?.created_at) completion += 25;
    if (isPremium) completion += 25;
    if (localStorage.getItem('generalSettings')) completion += 25;
    setProfileCompletion(completion);
  }, [user, isPremium]);

  const quickActions = [
    {
      icon: Settings,
      label: 'Nastavení účtu',
      description: 'Upravte svá nastavení',
      action: () => navigate('/settings'),
      color: 'text-blue-600'
    },
    {
      icon: Activity,
      label: 'Dashboard',
      description: 'Zobrazit přehled aktivit',
      action: () => navigate('/dashboard'),
      color: 'text-green-600'
    },
    {
      icon: Download,
      label: 'Export dat',
      description: 'Stáhnout vaše data',
      action: () => console.log('Export data'),
      color: 'text-purple-600'
    }
  ];

  if (!isPremium) {
    quickActions.push({
      icon: Crown,
      label: 'Upgradovat na Premium',
      description: 'Odemknout všechny funkce',
      action: () => navigate('/premium'),
      color: 'text-amber-600'
    });
  }

  return (
    <div className="space-y-6">
      {/* Profile Header Card */}
      <Card className="bg-gradient-to-br from-card/80 to-card/60 backdrop-blur-sm border border-border/50">
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row sm:items-center gap-6">
            <Avatar className="h-20 w-20 mx-auto sm:mx-0 border-4 border-primary/20">
              <AvatarFallback className="text-2xl bg-gradient-to-br from-primary/20 to-accent/20">
                {user?.email?.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            
            <div className="flex-1 text-center sm:text-left">
              <div className="flex items-center gap-2 justify-center sm:justify-start mb-2">
                <h2 className="text-2xl font-bold">{user?.email}</h2>
                {isPremium && (
                  <Badge className="bg-amber-500">
                    <Crown className="h-3 w-3 mr-1" />
                    Premium
                  </Badge>
                )}
                {isAdmin && (
                  <Badge className="bg-red-500">
                    <Shield className="h-3 w-3 mr-1" />
                    Admin
                  </Badge>
                )}
              </div>
              
              <div className="flex items-center gap-2 text-muted-foreground justify-center sm:justify-start mb-4">
                <Mail className="h-4 w-4" />
                <span className="text-sm">{user?.email}</span>
              </div>
              
              <div className="flex items-center gap-2 text-muted-foreground justify-center sm:justify-start">
                <Calendar className="h-4 w-4" />
                <span className="text-sm">
                  Člen od {new Date(user?.created_at || '').toLocaleDateString('cs-CZ')}
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Profile Completion */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-green-600" />
            Dokončenost profilu
          </CardTitle>
          <CardDescription>
            Dokončete svůj profil pro lepší zážitek z aplikace
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Celkový pokrok</span>
              <span className="text-sm text-muted-foreground">{profileCompletion}%</span>
            </div>
            <Progress value={profileCompletion} className="h-2" />
            
            <div className="grid grid-cols-2 gap-4 mt-4">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <span className="text-sm">E-mail ověřen</span>
              </div>
              <div className="flex items-center gap-2">
                {isPremium ? (
                  <CheckCircle className="h-4 w-4 text-green-600" />
                ) : (
                  <AlertCircle className="h-4 w-4 text-orange-600" />
                )}
                <span className="text-sm">Premium účet</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Rychlé akce</CardTitle>
          <CardDescription>
            Nejčastěji používané funkce v jednom místě
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {quickActions.map((action, index) => (
              <button
                key={index}
                onClick={action.action}
                className="p-4 text-left rounded-lg border border-border hover:bg-accent/50 transition-colors group"
              >
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg bg-muted group-hover:bg-background transition-colors`}>
                    <action.icon className={`h-5 w-5 ${action.color}`} />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium group-hover:text-foreground">
                      {action.label}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {action.description}
                    </p>
                  </div>
                  <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-foreground transition-colors" />
                </div>
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Account Status */}
      <Card>
        <CardHeader>
          <CardTitle>Stav účtu</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-600" />
                <span>Účet je aktivní</span>
              </div>
              <Badge variant="secondary">Ověřeno</Badge>
            </div>
            
            {isPremium ? (
              <div className="flex items-center justify-between p-3 bg-amber-50 dark:bg-amber-900/20 rounded-lg border border-amber-200 dark:border-amber-800">
                <div className="flex items-center gap-2">
                  <Crown className="h-5 w-5 text-amber-600" />
                  <span>Premium předplatné aktivní</span>
                </div>
                <Button variant="outline" size="sm" onClick={() => navigate('/settings')}>
                  Spravovat
                </Button>
              </div>
            ) : (
              <div className="flex items-center justify-between p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                <div className="flex items-center gap-2">
                  <User className="h-5 w-5 text-blue-600" />
                  <span>Základní účet</span>
                </div>
                <Button onClick={() => navigate('/premium')} size="sm">
                  <Crown className="h-4 w-4 mr-2" />
                  Upgrade
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProfileOverview;
