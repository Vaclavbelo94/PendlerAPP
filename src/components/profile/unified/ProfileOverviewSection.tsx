
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { 
  ShieldIcon, CalendarIcon, MapPinIcon, GlobeIcon, 
  BookOpenIcon, CarIcon, SettingsIcon
} from "lucide-react";
import ProfileBio from "../overview/ProfileBio";
import ProfileInfo from "../overview/ProfileInfo";
import ProfileCards from "../overview/ProfileCards";
import PromoCodeRedemption from "@/components/premium/PromoCodeRedemption";
import { formatDate, getShiftTypeLabel } from "../utils/formatters";

const ProfileOverviewSection = () => {
  const { user, isPremium } = useAuth();
  const navigate = useNavigate();

  const quickActions = [
    {
      title: "Nastavení účtu",
      description: "Upravit osobní údaje a heslo",
      icon: SettingsIcon,
      action: () => navigate("/profile?tab=settings")
    },
    {
      title: "Plánování směn",
      description: "Spravovat směny a rozvrh",
      icon: CalendarIcon,
      action: () => navigate("/shifts"),
      premium: true
    },
    {
      title: "Správa vozidla",
      description: "Přidat nebo upravit vozidlo",
      icon: CarIcon,
      action: () => navigate("/vehicle"),
      premium: true
    },
    {
      title: "Německý jazyk",
      description: "Pokračovat v učení",
      icon: BookOpenIcon,
      action: () => navigate("/language")
    }
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Hlavní informace */}
      <div className="lg:col-span-2 space-y-6">
        {/* Premium Status */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ShieldIcon className="h-5 w-5" />
              Status účtu
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isPremium ? (
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium text-amber-800">Premium aktivní</h3>
                    <p className="text-sm text-amber-600 mt-1">
                      Máte přístup ke všem funkcím aplikace
                    </p>
                  </div>
                  <Badge className="bg-amber-500">Premium</Badge>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="bg-slate-50 border border-slate-200 rounded-lg p-4">
                  <h3 className="font-medium text-slate-700">Standardní účet</h3>
                  <p className="text-sm text-slate-600 mt-1">
                    Aktivujte Premium pro plný přístup
                  </p>
                </div>
                <PromoCodeRedemption />
              </div>
            )}
          </CardContent>
        </Card>

        {/* Bio a základní info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>O mně</CardTitle>
            </CardHeader>
            <CardContent>
              <ProfileBio />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Základní informace</CardTitle>
            </CardHeader>
            <CardContent>
              <ProfileInfo 
                formatDate={formatDate} 
                createdAt={user?.created_at} 
              />
            </CardContent>
          </Card>
        </div>

        {/* Karty s preferencemi */}
        <ProfileCards 
          workPreferences={{
            preferred_shift_type: "morning",
            preferred_locations: ["München", "Stuttgart"]
          }} 
          certificatesCount={2} 
          getShiftTypeLabel={getShiftTypeLabel} 
        />
      </div>

      {/* Sidebar s rychlými akcemi */}
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Rychlé akce</CardTitle>
            <CardDescription>
              Nejčastěji používané funkce
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {quickActions.map((action, index) => (
              <Button
                key={index}
                variant={action.premium && !isPremium ? "secondary" : "outline"}
                className="w-full justify-start h-auto p-4 text-left"
                onClick={action.action}
                disabled={action.premium && !isPremium}
              >
                <div className="flex items-start gap-3 w-full">
                  <action.icon className="h-5 w-5 mt-0.5 flex-shrink-0" />
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{action.title}</span>
                      {action.premium && (
                        <Badge variant="secondary" className="text-xs">Premium</Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                      {action.description}
                    </p>
                  </div>
                </div>
              </Button>
            ))}
          </CardContent>
        </Card>

        {/* Pokrok v profilu */}
        <Card>
          <CardHeader>
            <CardTitle>Kompletnost profilu</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="w-full bg-secondary rounded-full h-2">
                <div className="bg-primary h-2 rounded-full" style={{ width: '65%' }}></div>
              </div>
              <p className="text-sm text-muted-foreground">
                Váš profil je kompletní z 65%
              </p>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2 text-green-600">
                  ✓ Základní údaje vyplněny
                </div>
                <div className="flex items-center gap-2 text-green-600">
                  ✓ Email ověřen
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  • Přidejte biografii
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  • Nastavte pracovní preference
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ProfileOverviewSection;
