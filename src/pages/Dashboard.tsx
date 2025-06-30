
import React from 'react';
import { useUnifiedAuth } from '@/contexts/UnifiedAuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, Car, Languages, Scale, Crown, Users } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const Dashboard = () => {
  const { unifiedUser } = useUnifiedAuth();

  const quickActions = [
    { icon: Calendar, title: 'Směny', href: '/shifts', color: 'text-blue-600' },
    { icon: Car, title: 'Vozidlo', href: '/vehicle', color: 'text-green-600' },
    { icon: Languages, title: 'Překladač', href: '/translator', color: 'text-purple-600' },
    { icon: Scale, title: 'Zákony', href: '/laws', color: 'text-orange-600' },
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">
            Vítejte zpět, {unifiedUser?.displayName || unifiedUser?.email}!
          </h1>
          <p className="text-muted-foreground">
            Zde je přehled vaší aktivity
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant={unifiedUser?.hasPremiumAccess ? 'default' : 'secondary'}>
            {unifiedUser?.hasPremiumAccess ? 'Premium' : 'Standard'}
          </Badge>
          {unifiedUser?.hasAdminAccess && (
            <Badge variant="destructive">Admin</Badge>
          )}
          {unifiedUser?.isDHLEmployee && (
            <Badge variant="outline">DHL</Badge>
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {quickActions.map((action) => (
          <Card key={action.href} className="hover:shadow-md transition-shadow cursor-pointer">
            <Link to={action.href}>
              <CardHeader className="pb-2">
                <action.icon className={`h-6 w-6 ${action.color}`} />
              </CardHeader>
              <CardContent>
                <p className="font-medium">{action.title}</p>
              </CardContent>
            </Link>
          </Card>
        ))}
      </div>

      {/* Stats Cards */}
      <div className="grid md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Tento měsíc</CardTitle>
            <CardDescription>Přehled vašich směn</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">24</div>
            <p className="text-sm text-muted-foreground">směn odpracováno</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Překladač</CardTitle>
            <CardDescription>Vaše aktivita</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">158</div>
            <p className="text-sm text-muted-foreground">překladů použito</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Premium</CardTitle>
            <CardDescription>Stav předplatného</CardDescription>
          </CardHeader>
          <CardContent>
            {unifiedUser?.hasPremiumAccess ? (
              <div>
                <div className="text-2xl font-bold text-green-600">Aktivní</div>
                <p className="text-sm text-muted-foreground">
                  {unifiedUser.premiumExpiry ? 
                    `Vyprší ${new Date(unifiedUser.premiumExpiry).toLocaleDateString()}` : 
                    'Trvalé premium'
                  }
                </p>
              </div>
            ) : (
              <div>
                <div className="text-2xl font-bold text-orange-600">Neaktivní</div>
                <Button asChild size="sm" className="mt-2">
                  <Link to="/premium">Upgrade</Link>
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Nedávná aktivita</CardTitle>
          <CardDescription>Vaše poslední akce v aplikaci</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
              <Calendar className="h-5 w-5 text-blue-600" />
              <div>
                <p className="font-medium">Nová směna přidána</p>
                <p className="text-sm text-muted-foreground">Před 2 hodinami</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
              <Languages className="h-5 w-5 text-purple-600" />
              <div>
                <p className="font-medium">Použit překladač</p>
                <p className="text-sm text-muted-foreground">Před 4 hodinami</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;
