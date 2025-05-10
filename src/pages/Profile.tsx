
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { UserIcon, KeyIcon, ShieldIcon, LogOutIcon } from "lucide-react";

const Profile = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  
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
        setUser({
          ...userData,
          isPremium: currentUser.isPremium || false,
          premiumExpiry: currentUser.premiumExpiry || null
        });
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
          return { ...u, name };
        }
        return u;
      });
      
      localStorage.setItem("users", JSON.stringify(updatedUsers));
      
      // Update current user
      const updatedUser = { ...user, name };
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
  
  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("currentUser");
    navigate("/");
    toast.success("Byli jste úspěšně odhlášeni");
  };
  
  const formatDate = (dateString: string | null) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("cs-CZ");
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
      
      <Tabs defaultValue="account" className="space-y-6">
        <TabsList className="grid grid-cols-3 md:w-[400px]">
          <TabsTrigger value="account">
            <UserIcon className="mr-2 h-4 w-4" /> Účet
          </TabsTrigger>
          <TabsTrigger value="password">
            <KeyIcon className="mr-2 h-4 w-4" /> Heslo
          </TabsTrigger>
          <TabsTrigger value="subscription">
            <ShieldIcon className="mr-2 h-4 w-4" /> Předplatné
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
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" onClick={() => setName(user?.name || "")}>
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
