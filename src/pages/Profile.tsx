
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { 
  UserIcon, KeyIcon, ShieldIcon, LogOutIcon, SettingsIcon, Settings2Icon,
  BellIcon, LanguagesIcon, CarIcon, ClockIcon, LayoutIcon,
  Activity, PieChart
} from "lucide-react";

// Import the new components
import UserActivityChart from "@/components/profile/UserActivityChart";
import LanguageSkillsChart from "@/components/profile/LanguageSkillsChart";
import ProfileAppearance from "@/components/profile/ProfileAppearance";
import { formatDateByPreference } from "@/utils/chartData";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from '@/integrations/supabase/client';

interface UserProfile {
  name: string;
  email: string;
  phoneNumber: string;
  address: string;
  avatar: string;
  preferredLanguage: string;
  notificationsEnabled: boolean;
  darkMode: boolean;
  defaultVehicle: string;
  currency: string;
  dateFormat: string;
  timeFormat: string;
  shiftReminderHours: string;
  colorScheme: string;
  compactMode: boolean;
  showStats: boolean;
}

const Profile = () => {
  const navigate = useNavigate();
  const { user, isPremium, signOut } = useAuth();
  const [loading, setLoading] = useState(true);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  
  // Profil uživatele
  const [userProfile, setUserProfile] = useState<UserProfile>({
    name: "",
    email: "",
    phoneNumber: "",
    address: "",
    avatar: "",
    preferredLanguage: "cs",
    notificationsEnabled: true,
    darkMode: false,
    defaultVehicle: "none",
    currency: "EUR",
    dateFormat: "dd.MM.yyyy",
    timeFormat: "24h",
    shiftReminderHours: "12",
    colorScheme: "purple",
    compactMode: false,
    showStats: false
  });
  
  // Hodnoty extrahované pro použití v komponentě
  const {
    name,
    email,
    phoneNumber,
    address,
    avatar,
    preferredLanguage,
    notificationsEnabled,
    darkMode,
    defaultVehicle,
    currency,
    dateFormat,
    timeFormat,
    shiftReminderHours,
    colorScheme,
    compactMode,
    showStats
  } = userProfile;
  
  // Track the currently selected tab to prevent multiple rapid clicks
  const [activeTab, setActiveTab] = useState("account");
  const [isTabSwitching, setIsTabSwitching] = useState(false);
  
  // Načtení profilu uživatele při prvním renderu
  useEffect(() => {
    // Check if user is logged in
    if (!user) {
      navigate("/login");
      return;
    }
    
    loadUserProfile();
  }, [navigate, user]);
  
  const loadUserProfile = async () => {
    setLoading(true);
    
    try {
      // Pokus o načtení z localStorage
      const storedProfile = localStorage.getItem(`profile_${user?.id}`);
      
      if (storedProfile) {
        // Načtení z localStorage
        const profileData = JSON.parse(storedProfile);
        setUserProfile({
          ...userProfile,
          ...profileData,
          email: user?.email || ""
        });
      } else {
        // Inicializace základních údajů z Auth
        setUserProfile({
          ...userProfile,
          name: user?.user_metadata?.username || user?.email?.split('@')[0] || '',
          email: user?.email || ""
        });
      }
      
      // Aplikování vzhledových nastavení
      applyAppearanceSettings();
    } catch (error) {
      console.error("Error loading user profile:", error);
      toast.error("Chyba při načítání uživatelského profilu");
    } finally {
      setLoading(false);
    }
  };

  const applyAppearanceSettings = () => {
    // Aplikovat tmavý režim
    if (userProfile.darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    
    // Aplikovat barevné schéma - vyžadovalo by další CSS proměnné
    document.documentElement.style.setProperty('--color-primary', getColorByScheme(userProfile.colorScheme));
    
    // Aplikovat kompaktní režim
    if (userProfile.compactMode) {
      document.documentElement.classList.add('compact');
    } else {
      document.documentElement.classList.remove('compact');
    }
  };
  
  const getColorByScheme = (scheme: string): string => {
    switch (scheme) {
      case 'purple': return '#8884d8';
      case 'blue': return '#0ea5e9';
      case 'green': return '#10b981';
      case 'amber': return '#f59e0b';
      case 'red': return '#ef4444';
      case 'pink': return '#ec4899';
      default: return '#8884d8';
    }
  };
  
  const handleProfileUpdate = () => {
    try {
      // Aktualizace jména, telefonu, adresy a avataru
      const updatedProfile = {
        ...userProfile,
        name,
        phoneNumber,
        address,
        avatar
      };
      
      // Uložení do localStorage
      localStorage.setItem(`profile_${user?.id}`, JSON.stringify(updatedProfile));
      setUserProfile(updatedProfile);
      
      toast.success("Profil byl úspěšně aktualizován");
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Chyba při aktualizaci profilu");
    }
  };
  
  const handlePasswordChange = async () => {
    // Validace
    if (newPassword !== confirmPassword) {
      toast.error("Nová hesla se neshodují");
      return;
    }
    
    if (newPassword.length < 6) {
      toast.error("Heslo musí mít alespoň 6 znaků");
      return;
    }
    
    try {
      // Update password using Supabase Auth
      const { error } = await supabase.auth.updateUser({ 
        password: newPassword 
      });
      
      if (error) {
        throw error;
      }
      
      // Clear password fields
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      
      toast.success("Heslo bylo úspěšně změněno");
    } catch (error: any) {
      console.error("Error changing password:", error);
      toast.error(error.message || "Chyba při změně hesla");
    }
  };
  
  const handlePreferencesUpdate = () => {
    try {
      // Aktualizace uživatelských předvoleb
      const updatedProfile = {
        ...userProfile,
        preferredLanguage,
        notificationsEnabled,
        darkMode,
        defaultVehicle,
        currency,
        dateFormat,
        timeFormat,
        shiftReminderHours,
        colorScheme,
        compactMode,
        showStats
      };
      
      // Uložení do localStorage
      localStorage.setItem(`profile_${user?.id}`, JSON.stringify(updatedProfile));
      setUserProfile(updatedProfile);
      
      // Aplikování nastavení vzhledu
      applyAppearanceSettings();
      
      toast.success("Uživatelské předvolby byly úspěšně aktualizovány");
    } catch (error) {
      console.error("Error updating preferences:", error);
      toast.error("Chyba při aktualizaci předvoleb");
    }
  };
  
  const handleLogout = async () => {
    await signOut();
    navigate("/");
  };
  
  const formatDate = (dateString: string | null) => {
    if (!dateString) return "N/A";
    return formatDateByPreference(dateString, dateFormat);
  };
  
  const handleAppearanceUpdate = (settings: {
    darkMode: boolean;
    colorScheme: string;
    compactMode: boolean;
  }) => {
    // Aktualizace stavů
    const updatedProfile = {
      ...userProfile,
      darkMode: settings.darkMode,
      colorScheme: settings.colorScheme,
      compactMode: settings.compactMode
    };
    
    setUserProfile(updatedProfile);
    
    // Aplikování nastavení
    if (settings.darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    
    document.documentElement.style.setProperty('--color-primary', getColorByScheme(settings.colorScheme));
    
    if (settings.compactMode) {
      document.documentElement.classList.add('compact');
    } else {
      document.documentElement.classList.remove('compact');
    }
    
    // Uložení do localStorage
    localStorage.setItem(`profile_${user?.id}`, JSON.stringify(updatedProfile));
    
    toast.success("Nastavení vzhledu bylo uloženo");
  };

  // Handle tab changes safely to prevent crashes from rapid clicking
  const handleTabChange = (value: string) => {
    // If we're already switching tabs, ignore additional clicks
    if (isTabSwitching) {
      return;
    }
    
    // Set flag to ignore additional clicks
    setIsTabSwitching(true);
    
    // Update the active tab
    setActiveTab(value);
    
    // Reset the flag after a short delay to prevent rapid clicks
    setTimeout(() => {
      setIsTabSwitching(false);
    }, 300); // 300ms debounce
  };
  
  if (loading) {
    return (
      <div className="container py-10">
        <div className="flex items-center justify-center h-40">
          <p>Načítání...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-6 md:py-10">
      <h1 className="text-3xl font-bold mb-6">Váš profil</h1>
      
      {/* Premium Status Banner */}
      {isPremium ? (
        <div className="bg-gradient-to-r from-amber-100 to-yellow-100 border border-amber-200 rounded-lg p-4 mb-8">
          <div className="flex items-center gap-3">
            <ShieldIcon className="h-8 w-8 text-amber-500" />
            <div>
              <h3 className="font-medium text-lg">Premium účet</h3>
              <p className="text-sm text-muted-foreground">
                Vaše předplatné vyprší: {user?.user_metadata?.premium_expiry ? formatDate(user.user_metadata.premium_expiry) : "Neurčito"}
              </p>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-slate-100 border border-slate-200 rounded-lg p-4 mb-8">
          <div className="flex items-center gap-3">
            <ShieldIcon className="h-8 w-8 text-slate-400" />
            <div>
              <h3 className="font-medium text-lg">Standardní účet</h3>
              <p className="text-sm text-muted-foreground">
                Aktivujte Premium pro přístup ke všem funkcím
              </p>
            </div>
            <Button 
              className="ml-auto" 
              size="sm" 
              onClick={() => navigate("/premium")}
            >
              Aktivovat Premium
            </Button>
          </div>
        </div>
      )}
      
      {/* Data Visualization Section - Now hidden by default */}
      {!showStats && (
        <div className="mb-8">
          <Button 
            variant="outline" 
            onClick={() => {
              setUserProfile(prev => ({ ...prev, showStats: true }));
              localStorage.setItem(`profile_${user?.id}`, JSON.stringify({...userProfile, showStats: true}));
            }}
            className="flex items-center gap-2"
          >
            <PieChart className="h-4 w-4" />
            Zobrazit statistiky
          </Button>
        </div>
      )}
      
      {showStats && (
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold flex items-center gap-2">
              <Activity className="h-6 w-6" />
              Statistiky a aktivita
            </h2>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => {
                setUserProfile(prev => ({ ...prev, showStats: false }));
                localStorage.setItem(`profile_${user?.id}`, JSON.stringify({...userProfile, showStats: false}));
              }}
            >
              Skrýt statistiky
            </Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <UserActivityChart />
            <LanguageSkillsChart />
          </div>
        </div>
      )}
      
      <Tabs value={activeTab} onValueChange={handleTabChange} className="space-y-6">
        <TabsList className="grid grid-cols-3 md:grid-cols-6 max-w-3xl">
          <TabsTrigger value="account">
            <UserIcon className="mr-2 h-4 w-4" /> Účet
          </TabsTrigger>
          <TabsTrigger value="password">
            <KeyIcon className="mr-2 h-4 w-4" /> Heslo
          </TabsTrigger>
          <TabsTrigger value="preferences">
            <SettingsIcon className="mr-2 h-4 w-4" /> Předvolby
          </TabsTrigger>
          <TabsTrigger value="appearance">
            <LayoutIcon className="mr-2 h-4 w-4" /> Vzhled
          </TabsTrigger>
          <TabsTrigger value="subscription">
            <ShieldIcon className="mr-2 h-4 w-4" /> Předplatné
          </TabsTrigger>
          <TabsTrigger value="notifications">
            <BellIcon className="mr-2 h-4 w-4" /> Notifikace
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="account">
          <Card>
            <CardHeader>
              <CardTitle>Informace o účtu</CardTitle>
              <CardDescription>
                Zde můžete upravit základní údaje o vašem profilu
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Jméno</Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setUserProfile(prev => ({ ...prev, name: e.target.value }))}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  value={email}
                  disabled
                  className="bg-slate-50"
                />
                <p className="text-xs text-muted-foreground">
                  Email nelze změnit, slouží jako přihlašovací jméno
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Telefonní číslo</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={phoneNumber}
                  onChange={(e) => setUserProfile(prev => ({ ...prev, phoneNumber: e.target.value }))}
                  placeholder="+420 123 456 789"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="address">Adresa</Label>
                <Input
                  id="address"
                  value={address}
                  onChange={(e) => setUserProfile(prev => ({ ...prev, address: e.target.value }))}
                  placeholder="Ulice, Město, PSČ"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="avatar">Profilový obrázek</Label>
                <div className="flex items-center gap-4">
                  <div className="h-16 w-16 rounded-full bg-slate-200 flex items-center justify-center overflow-hidden border">
                    {avatar ? (
                      <img src={avatar} alt="Avatar" className="h-full w-full object-cover" />
                    ) : (
                      <UserIcon className="h-8 w-8 text-slate-400" />
                    )}
                  </div>
                  <div className="flex-1">
                    <Input
                      id="avatar"
                      type="text"
                      value={avatar}
                      onChange={(e) => setUserProfile(prev => ({ ...prev, avatar: e.target.value }))}
                      placeholder="URL obrázku pro avatar"
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      Zadejte URL adresu obrázku (JPG, PNG)
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" onClick={loadUserProfile}>
                Zrušit
              </Button>
              <Button onClick={handleProfileUpdate}>Uložit změny</Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="password">
          <Card>
            <CardHeader>
              <CardTitle>Změna hesla</CardTitle>
              <CardDescription>
                Aktualizujte své heslo pro lepší zabezpečení účtu
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="current-password">Současné heslo</Label>
                <Input
                  id="current-password"
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                />
              </div>
              
              <Separator className="my-4" />
              
              <div className="space-y-2">
                <Label htmlFor="new-password">Nové heslo</Label>
                <Input
                  id="new-password"
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="confirm-password">Potvrďte nové heslo</Label>
                <Input
                  id="confirm-password"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button 
                className="ml-auto" 
                onClick={handlePasswordChange}
              >
                Změnit heslo
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="preferences">
          <Card>
            <CardHeader>
              <CardTitle>Uživatelské předvolby</CardTitle>
              <CardDescription>
                Přizpůsobte si aplikaci podle svých potřeb
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="language">Preferovaný jazyk</Label>
                  <Select 
                    value={preferredLanguage} 
                    onValueChange={(value) => setUserProfile(prev => ({ ...prev, preferredLanguage: value }))}
                  >
                    <SelectTrigger id="language" className="w-full">
                      <SelectValue placeholder="Vyberte jazyk" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="cs">Čeština</SelectItem>
                      <SelectItem value="de">Němčina</SelectItem>
                      <SelectItem value="en">Angličtina</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="currency">Měna</Label>
                  <Select 
                    value={currency} 
                    onValueChange={(value) => setUserProfile(prev => ({ ...prev, currency: value }))}
                  >
                    <SelectTrigger id="currency" className="w-full">
                      <SelectValue placeholder="Vyberte měnu" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="EUR">Euro (€)</SelectItem>
                      <SelectItem value="CZK">Česká koruna (Kč)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="dateFormat">Formát data</Label>
                  <Select 
                    value={dateFormat}
                    onValueChange={(value) => setUserProfile(prev => ({ ...prev, dateFormat: value }))}
                  >
                    <SelectTrigger id="dateFormat" className="w-full">
                      <SelectValue placeholder="Vyberte formát data" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="dd.MM.yyyy">DD.MM.YYYY (01.01.2023)</SelectItem>
                      <SelectItem value="MM/dd/yyyy">MM/DD/YYYY (01/01/2023)</SelectItem>
                      <SelectItem value="yyyy-MM-dd">YYYY-MM-DD (2023-01-01)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="timeFormat">Formát času</Label>
                  <Select 
                    value={timeFormat} 
                    onValueChange={(value) => setUserProfile(prev => ({ ...prev, timeFormat: value }))}
                  >
                    <SelectTrigger id="timeFormat" className="w-full">
                      <SelectValue placeholder="Vyberte formát času" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="24h">24-hodinový (14:30)</SelectItem>
                      <SelectItem value="12h">12-hodinový (2:30 PM)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="defaultVehicle">Výchozí vozidlo</Label>
                  <Select 
                    value={defaultVehicle} 
                    onValueChange={(value) => setUserProfile(prev => ({ ...prev, defaultVehicle: value }))}
                  >
                    <SelectTrigger id="defaultVehicle" className="w-full">
                      <SelectValue placeholder="Vyberte vozidlo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">Žádné</SelectItem>
                      <SelectItem value="car1">Osobní automobil</SelectItem>
                      <SelectItem value="car2">Služební vozidlo</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="shiftReminder">Upozornění na směnu před</Label>
                  <Select 
                    value={shiftReminderHours} 
                    onValueChange={(value) => setUserProfile(prev => ({ ...prev, shiftReminderHours: value }))}
                  >
                    <SelectTrigger id="shiftReminder" className="w-full">
                      <SelectValue placeholder="Vyberte čas" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">1 hodinou</SelectItem>
                      <SelectItem value="2">2 hodinami</SelectItem>
                      <SelectItem value="6">6 hodinami</SelectItem>
                      <SelectItem value="12">12 hodinami</SelectItem>
                      <SelectItem value="24">24 hodinami</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <Separator />
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="showStats" className="text-base">Zobrazit statistiky</Label>
                    <p className="text-sm text-muted-foreground">
                      Zobrazí grafy a statistiky na profilu
                    </p>
                  </div>
                  <Switch 
                    id="showStats" 
                    checked={showStats}
                    onCheckedChange={(checked) => setUserProfile(prev => ({ ...prev, showStats: checked }))}
                  />
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button 
                className="ml-auto" 
                onClick={handlePreferencesUpdate}
              >
                Uložit předvolby
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="appearance">
          <ProfileAppearance 
            initialDarkMode={darkMode}
            initialColorScheme={colorScheme}
            initialCompactMode={compactMode}
            onSave={handleAppearanceUpdate}
          />
        </TabsContent>
        
        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle>Nastavení notifikací</CardTitle>
              <CardDescription>
                Upravte si, jaké typy upozornění chcete dostávat
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="notificationsEnabled" className="text-base">Povolit notifikace</Label>
                  <p className="text-sm text-muted-foreground">
                    Zapne nebo vypne všechny notifikace
                  </p>
                </div>
                <Switch 
                  id="notificationsEnabled" 
                  checked={notificationsEnabled}
                  onCheckedChange={(checked) => setUserProfile(prev => ({ ...prev, notificationsEnabled: checked }))}
                />
              </div>
              
              <Separator />
              
              <div className="space-y-4">
                <h3 className="font-medium">Typy upozornění</h3>
                
                <NotificationSetting 
                  id="notifyShifts" 
                  title="Upozornění na směny"
                  description="Upozornění před začátkem směny"
                  icon={<ClockIcon className="h-5 w-5" />}
                  disabled={!notificationsEnabled}
                />
                
                <NotificationSetting 
                  id="notifyVehicle" 
                  title="Upozornění na vozidlo"
                  description="Připomenutí údržby, STK apod."
                  icon={<CarIcon className="h-5 w-5" />}
                  disabled={!notificationsEnabled}
                />
                
                <NotificationSetting 
                  id="notifyLanguage" 
                  title="Upozornění na lekce"
                  description="Připomenutí jazykové lekce"
                  icon={<LanguagesIcon className="h-5 w-5" />}
                  disabled={!notificationsEnabled}
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button 
                className="ml-auto" 
                onClick={handlePreferencesUpdate}
              >
                Uložit nastavení
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="subscription">
          <Card>
            <CardHeader>
              <CardTitle>Předplatné</CardTitle>
              <CardDescription>
                Správa vašeho předplatného a Premium funkcí
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="bg-slate-50 p-4 rounded-md">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-medium">Stav předplatného</h3>
                  {isPremium ? (
                    <Badge variant="default" className="bg-amber-500">Aktivní</Badge>
                  ) : (
                    <Badge variant="outline">Neaktivní</Badge>
                  )}
                </div>
                
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Typ účtu:</span>
                    <span className="font-medium">{isPremium ? 'Premium' : 'Standard'}</span>
                  </div>
                  
                  {isPremium && (
                    <>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Platné do:</span>
                        <span className="font-medium">{user?.user_metadata?.premium_expiry ? formatDate(user.user_metadata.premium_expiry) : "Neurčito"}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Automatické obnovení:</span>
                        <span className="font-medium">Ne</span>
                      </div>
                    </>
                  )}
                </div>
              </div>
              
              <div>
                <h3 className="font-medium mb-2">Dostupné Premium funkce</h3>
                <div className="space-y-2">
                  {isPremium ? (
                    <>
                      <PremiumFeatureItem name="Plánování směn" isActive={true} />
                      <PremiumFeatureItem name="Pokročilý překladač" isActive={true} />
                      <PremiumFeatureItem name="Daňové kalkulačky" isActive={true} />
                      <PremiumFeatureItem name="Rozšířené materiály k němčině" isActive={true} />
                      <PremiumFeatureItem name="Správa vozidla" isActive={true} />
                    </>
                  ) : (
                    <>
                      <PremiumFeatureItem name="Plánování směn" isActive={false} />
                      <PremiumFeatureItem name="Pokročilý překladač" isActive={false} />
                      <PremiumFeatureItem name="Daňové kalkulačky" isActive={false} />
                      <PremiumFeatureItem name="Rozšířené materiály k němčině" isActive={false} />
                      <PremiumFeatureItem name="Správa vozidla" isActive={false} />
                    </>
                  )}
                </div>
              </div>
              
              {!isPremium && (
                <div className="mt-4 text-center">
                  <Button onClick={() => navigate("/premium")} className="bg-amber-500 hover:bg-amber-600">
                    <ShieldIcon className="mr-2 h-4 w-4" />
                    Aktivovat Premium
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

// Pomocná komponenta pro zobrazení notifikačního nastavení
interface NotificationSettingProps {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  disabled?: boolean;
}

const NotificationSetting = ({ id, title, description, icon, disabled = false }: NotificationSettingProps) => {
  const [enabled, setEnabled] = useState(true);
  
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-start gap-3">
        <div className={`mt-1 ${disabled ? 'text-muted-foreground' : ''}`}>
          {icon}
        </div>
        <div>
          <Label htmlFor={id} className={`text-base ${disabled ? 'text-muted-foreground' : ''}`}>
            {title}
          </Label>
          <p className={`text-sm ${disabled ? 'text-muted-foreground/70' : 'text-muted-foreground'}`}>
            {description}
          </p>
        </div>
      </div>
      <Switch 
        id={id} 
        checked={enabled && !disabled} 
        onCheckedChange={setEnabled}
        disabled={disabled}
      />
    </div>
  );
};

// Pomocná komponenta pro zobrazení prémiové funkce
interface PremiumFeatureItemProps {
  name: string;
  isActive: boolean;
}

const PremiumFeatureItem = ({ name, isActive }: PremiumFeatureItemProps) => (
  <div className="flex items-center justify-between py-1 border-b border-muted">
    <span>{name}</span>
    {isActive ? (
      <span className="text-green-600 text-sm font-medium flex items-center">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
        </svg>
        Aktivní
      </span>
    ) : (
      <span className="text-gray-400 text-sm flex items-center">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
        </svg>
        Neaktivní
      </span>
    )}
  </div>
);

export default Profile;
