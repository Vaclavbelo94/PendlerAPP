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
  UserIcon, KeyIcon, ShieldIcon, LogOutIcon, SettingsIcon, 
  BellIcon, LanguagesIcon, CarIcon, ClockIcon, LayoutIcon,
  Activity, PieChart
} from "lucide-react";

// Import the new components
import UserActivityChart from "@/components/profile/UserActivityChart";
import LanguageSkillsChart from "@/components/profile/LanguageSkillsChart";
import ProfileAppearance from "@/components/profile/ProfileAppearance";
import { formatDateByPreference } from "@/utils/chartData";

const Profile = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  
  // Nová uživatelská nastavení
  const [preferredLanguage, setPreferredLanguage] = useState("cs");
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [address, setAddress] = useState("");
  const [defaultVehicle, setDefaultVehicle] = useState("none");
  const [currency, setCurrency] = useState("EUR");
  const [dateFormat, setDateFormat] = useState("dd.MM.yyyy");
  const [timeFormat, setTimeFormat] = useState("24h");
  const [shiftReminderHours, setShiftReminderHours] = useState("12");
  const [avatar, setAvatar] = useState("");
  const [colorScheme, setColorScheme] = useState("purple");
  const [compactMode, setCompactMode] = useState(false);
  
  // For data visualization - changed to false by default
  const [showStats, setShowStats] = useState(false);
  
  useEffect(() => {
    // Check if user is logged in
    const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
    if (!isLoggedIn) {
      navigate("/login");
      return;
    }
    
    try {
      // Get user data from localStorage
      const userData = JSON.parse(localStorage.getItem("currentUser") || "{}");
      setUser(userData);
      setName(userData.name || "");
      setEmail(userData.email || "");
      
      // Get all users to find additional data
      const allUsers = JSON.parse(localStorage.getItem("users") || "[]");
      const currentUser = allUsers.find((u: any) => u.email === userData.email);
      if (currentUser) {
        // Nastavení základních údajů
        setUser({
          ...userData,
          isPremium: currentUser.isPremium || false,
          premiumExpiry: currentUser.premiumExpiry || null
        });
        
        // Nastavení uživatelských preferencí (pokud existují)
        setPreferredLanguage(currentUser.preferredLanguage || "cs");
        setNotificationsEnabled(currentUser.notificationsEnabled !== false);
        setDarkMode(currentUser.darkMode || false);
        setPhoneNumber(currentUser.phoneNumber || "");
        setAddress(currentUser.address || "");
        setDefaultVehicle(currentUser.defaultVehicle || "none");
        setCurrency(currentUser.currency || "EUR");
        setDateFormat(currentUser.dateFormat || "dd.MM.yyyy");
        setTimeFormat(currentUser.timeFormat || "24h");
        setShiftReminderHours(currentUser.shiftReminderHours || "12");
        setAvatar(currentUser.avatar || "");
        setColorScheme(currentUser.colorScheme || "purple");
        setCompactMode(currentUser.compactMode || false);
        setShowStats(currentUser.showStats === true);
      }
    } catch (error) {
      console.error("Error loading user data:", error);
      toast.error("Chyba při načítání uživatelského profilu");
    } finally {
      setLoading(false);
    }
  }, [navigate]);
  
  const handleProfileUpdate = () => {
    try {
      // Update user info in localStorage
      const allUsers = JSON.parse(localStorage.getItem("users") || "[]");
      const updatedUsers = allUsers.map((u: any) => {
        if (u.email === user.email) {
          return { 
            ...u, 
            name,
            phoneNumber,
            address,
            avatar
          };
        }
        return u;
      });
      
      localStorage.setItem("users", JSON.stringify(updatedUsers));
      
      // Update current user
      const updatedUser = { ...user, name, phoneNumber, address, avatar };
      localStorage.setItem("currentUser", JSON.stringify(updatedUser));
      setUser(updatedUser);
      
      toast.success("Profil byl úspěšně aktualizován");
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Chyba při aktualizaci profilu");
    }
  };
  
  const handlePasswordChange = () => {
    // Validations
    if (newPassword !== confirmPassword) {
      toast.error("Nová hesla se neshodují");
      return;
    }
    
    if (newPassword.length < 6) {
      toast.error("Heslo musí mít alespoň 6 znaků");
      return;
    }
    
    try {
      // Get all users
      const allUsers = JSON.parse(localStorage.getItem("users") || "[]");
      const currentUserIndex = allUsers.findIndex((u: any) => u.email === user.email);
      
      if (currentUserIndex === -1) {
        toast.error("Uživatel nenalezen");
        return;
      }
      
      // Check if current password matches
      if (allUsers[currentUserIndex].password !== currentPassword) {
        toast.error("Současné heslo je nesprávné");
        return;
      }
      
      // Update password
      allUsers[currentUserIndex].password = newPassword;
      localStorage.setItem("users", JSON.stringify(allUsers));
      
      // Clear password fields
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      
      toast.success("Heslo bylo úspěšně změněno");
    } catch (error) {
      console.error("Error changing password:", error);
      toast.error("Chyba při změně hesla");
    }
  };
  
  const handlePreferencesUpdate = () => {
    try {
      // Update user preferences in localStorage
      const allUsers = JSON.parse(localStorage.getItem("users") || "[]");
      const updatedUsers = allUsers.map((u: any) => {
        if (u.email === user.email) {
          return { 
            ...u, 
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
        }
        return u;
      });
      
      localStorage.setItem("users", JSON.stringify(updatedUsers));
      
      // Update current user
      const updatedUser = { 
        ...user, 
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
      localStorage.setItem("currentUser", JSON.stringify(updatedUser));
      setUser(updatedUser);
      
      toast.success("Uživatelské předvolby byly úspěšně aktualizovány");
      
      // V reálné aplikaci by zde byla implementace změny motivu
      if (darkMode) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
      
    } catch (error) {
      console.error("Error updating preferences:", error);
      toast.error("Chyba při aktualizaci předvoleb");
    }
  };
  
  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("currentUser");
    navigate("/");
    toast.success("Byli jste úspěšně odhlášeni");
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
    setDarkMode(settings.darkMode);
    setColorScheme(settings.colorScheme);
    setCompactMode(settings.compactMode);
    
    // Apply settings immediately for preview
    if (settings.darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    
    // This will be saved when the user clicks "Save Preferences" in the preferences tab
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
      {user?.isPremium ? (
        <div className="bg-gradient-to-r from-amber-100 to-yellow-100 border border-amber-200 rounded-lg p-4 mb-8">
          <div className="flex items-center gap-3">
            <ShieldIcon className="h-8 w-8 text-amber-500" />
            <div>
              <h3 className="font-medium text-lg">Premium účet</h3>
              <p className="text-sm text-muted-foreground">
                Vaše předplatné vyprší: {formatDate(user.premiumExpiry)}
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
            onClick={() => setShowStats(true)}
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
              onClick={() => setShowStats(false)}
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
      
      <Tabs defaultValue="account" className="space-y-6">
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
                  onChange={(e) => setName(e.target.value)}
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
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  placeholder="+420 123 456 789"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="address">Adresa</Label>
                <Input
                  id="address"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
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
                      onChange={(e) => setAvatar(e.target.value)}
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
              <Button variant="outline" onClick={() => {
                setName(user?.name || "");
                setPhoneNumber(user?.phoneNumber || "");
                setAddress(user?.address || "");
                setAvatar(user?.avatar || "");
              }}>
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
                  <Select value={preferredLanguage} onValueChange={setPreferredLanguage}>
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
                  <Select value={currency} onValueChange={setCurrency}>
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
                  <Select value={dateFormat} onValueChange={setDateFormat}>
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
                  <Select value={timeFormat} onValueChange={setTimeFormat}>
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
                  <Select value={defaultVehicle} onValueChange={setDefaultVehicle}>
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
                  <Select value={shiftReminderHours} onValueChange={setShiftReminderHours}>
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
                    onCheckedChange={setShowStats}
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
                  onCheckedChange={setNotificationsEnabled}
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
                  {user?.isPremium ? (
                    <Badge variant="default" className="bg-amber-500">Aktivní</Badge>
                  ) : (
                    <Badge variant="outline">Neaktivní</Badge>
                  )}
                </div>
                
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Typ účtu:</span>
                    <span className="font-medium">{user?.isPremium ? 'Premium' : 'Standard'}</span>
                  </div>
                  
                  {user?.isPremium && (
                    <>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Platné do:</span>
                        <span className="font-medium">{formatDate(user.premiumExpiry)}</span>
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
                  {user?.isPremium ? (
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
            </CardContent>
            <CardFooter>
              {!user?.isPremium && (
                <Button onClick={() => navigate("/premium")} className="ml-auto">
                  Získat Premium
                </Button>
              )}
              {user?.isPremium && (
                <Button variant="outline" className="ml-auto">
                  Spravovat předplatné
                </Button>
              )}
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
      
      <div className="mt-10 pt-6 border-t">
        <h3 className="font-medium text-lg mb-4">Nastavení účtu</h3>
        <Button 
          variant="destructive" 
          onClick={handleLogout}
          className="flex items-center gap-2"
        >
          <LogOutIcon className="h-4 w-4" />
          Odhlásit se
        </Button>
      </div>
    </div>
  );
};

// Helper component for notifications settings
const NotificationSetting = ({ 
  id, 
  title, 
  description, 
  icon, 
  disabled = false 
}: { 
  id: string; 
  title: string; 
  description: string; 
  icon?: React.ReactNode;
  disabled?: boolean;
}) => {
  const [enabled, setEnabled] = useState(true);
  
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-start gap-3">
        {icon && (
          <div className="mt-0.5 text-muted-foreground">
            {icon}
          </div>
        )}
        <div>
          <Label htmlFor={id} className="text-base">{title}</Label>
          <p className="text-sm text-muted-foreground">
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

// Helper component for premium features list
const PremiumFeatureItem = ({ name, isActive }: { name: string; isActive: boolean }) => (
  <div className="flex items-center justify-between p-2 border rounded-md">
    <span>{name}</span>
    {isActive ? (
      <Badge className="bg-green-500">Aktivní</Badge>
    ) : (
      <Badge variant="outline">Neaktivní</Badge>
    )}
  </div>
);

export default Profile;
