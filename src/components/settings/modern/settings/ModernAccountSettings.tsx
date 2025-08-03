import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { User, Mail, Phone, MapPin, Camera, Shield } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';

const ModernAccountSettings = () => {
  const { t } = useTranslation('settings');
  const [profile, setProfile] = useState({
    name: 'Jan Novák',
    email: 'jan.novak@example.com',
    phone: '+420 123 456 789',
    position: 'Vedoucí směny',
    department: 'Výroba',
    location: 'Praha',
    avatarUrl: ''
  });

  const handleSave = () => {
    localStorage.setItem('userProfile', JSON.stringify(profile));
    toast.success(t('settingsSaved'));
  };

  const handleAvatarChange = () => {
    // Simulace nahrání avataru
    toast.info('Funkce nahrání avataru bude brzy dostupná');
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            {t('accountInfo')}
          </CardTitle>
          <CardDescription>
            Základní informace o vašem účtu
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Avatar */}
          <div className="flex items-center gap-4">
            <Avatar className="h-20 w-20">
              <AvatarImage src={profile.avatarUrl} />
              <AvatarFallback className="text-lg">
                {profile.name.split(' ').map(n => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
            <div className="space-y-2">
              <h3 className="font-medium">{profile.name}</h3>
              <Badge variant="secondary">{profile.position}</Badge>
              <Button size="sm" variant="outline" onClick={handleAvatarChange}>
                <Camera className="h-4 w-4 mr-2" />
                Změnit foto
              </Button>
            </div>
          </div>

          {/* Základní údaje */}
          <div className="grid gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Jméno a příjmení</Label>
              <Input
                id="name"
                value={profile.name}
                onChange={(e) => setProfile({...profile, name: e.target.value})}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">E-mail</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  value={profile.email}
                  onChange={(e) => setProfile({...profile, email: e.target.value})}
                  className="pl-10"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Telefon</Label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="phone"
                  value={profile.phone}
                  onChange={(e) => setProfile({...profile, phone: e.target.value})}
                  className="pl-10"
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            Pracovní informace
          </CardTitle>
          <CardDescription>
            Detaily o vaší pozici a pracovišti
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="position">Pozice</Label>
            <Input
              id="position"
              value={profile.position}
              onChange={(e) => setProfile({...profile, position: e.target.value})}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="department">Oddělení</Label>
            <Input
              id="department"
              value={profile.department}
              onChange={(e) => setProfile({...profile, department: e.target.value})}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="location">Pracoviště</Label>
            <Input
              id="location"
              value={profile.location}
              onChange={(e) => setProfile({...profile, location: e.target.value})}
            />
          </div>
        </CardContent>
      </Card>

      <Card className="border-amber-200 bg-amber-50/50 dark:border-amber-800 dark:bg-amber-950/50">
        <CardContent className="pt-6">
          <div className="flex items-start gap-3">
            <Shield className="h-5 w-5 text-amber-600 mt-0.5" />
            <div>
              <h4 className="font-medium text-amber-900 dark:text-amber-100">
                Bezpečnost účtu
              </h4>
              <p className="text-sm text-amber-700 dark:text-amber-300 mt-1">
                Pro změnu hesla nebo aktivaci 2FA přejděte do sekce Bezpečnost.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex gap-3">
        <Button onClick={handleSave} className="flex-1">
          {t('saveChanges')}
        </Button>
      </div>
    </div>
  );
};

export default ModernAccountSettings;