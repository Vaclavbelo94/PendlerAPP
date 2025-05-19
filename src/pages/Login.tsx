
import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "@/components/ui/use-toast";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const navigate = useNavigate();
  const { signIn, signInWithGoogle, user } = useAuth();
  
  useEffect(() => {
    // Redirect user to homepage if already logged in
    if (user) {
      navigate("/");
    }
  }, [user, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const { error } = await signIn(email, password);
      
      if (error) {
        toast({
          title: "Přihlášení selhalo",
          description: error.message || "Zkontrolujte své přihlašovací údaje a zkuste to znovu.",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Úspěšně přihlášeno!",
          variant: "default",
        });
        navigate("/");
      }
    } catch (error: any) {
      toast({
        title: "Chyba při přihlašování",
        description: error?.message || "Nastala neznámá chyba. Zkuste to prosím později.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setIsGoogleLoading(true);
    
    try {
      const { error, url } = await signInWithGoogle();
      
      if (error) {
        toast({
          title: "Přihlášení s Google selhalo",
          description: error.message || "Nastala chyba při přihlašování s Google účtem.",
          variant: "destructive",
        });
      }
      
      // Pokud máme URL pro přesměrování, přesměrujeme uživatele (standardní OAuth flow)
      if (url) {
        window.location.href = url;
      }
    } catch (error: any) {
      toast({
        title: "Chyba při přihlašování",
        description: error?.message || "Nastala neznámá chyba. Zkuste to prosím později.",
        variant: "destructive",
      });
    } finally {
      setIsGoogleLoading(false);
    }
  };

  const setTestAccount = (type: 'user1' | 'user2' | 'admin') => {
    if (type === 'user1') {
      setEmail('uzivatel1@example.com');
      setPassword('heslo123');
    } else if (type === 'user2') {
      setEmail('uzivatel2@example.com');
      setPassword('heslo123');
    } else if (type === 'admin') {
      setEmail('admin@pendlerapp.com');
      setPassword('Admin123');
    }
  };

  return (
    <div className="container max-w-md mx-auto py-16 px-4">
      <Card className="w-full">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl">Přihlášení</CardTitle>
          <CardDescription>
            Zadejte své přihlašovací údaje pro přístup k vašemu účtu
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          <Tabs defaultValue="regular">
            <TabsList className="grid grid-cols-2 mb-4">
              <TabsTrigger value="regular">Přihlášení</TabsTrigger>
              <TabsTrigger value="test">Testovací účty</TabsTrigger>
            </TabsList>
            
            <TabsContent value="regular">
              <div className="space-y-4">
                {/* Google Login Button */}
                <Button 
                  type="button" 
                  variant="outline" 
                  className="w-full flex items-center justify-center gap-2"
                  onClick={handleGoogleLogin}
                  disabled={isGoogleLoading}
                >
                  {isGoogleLoading ? (
                    "Přihlašování..."
                  ) : (
                    <>
                      <svg viewBox="0 0 24 24" width="16" height="16" xmlns="http://www.w3.org/2000/svg">
                        <g transform="matrix(1, 0, 0, 1, 27.009001, -39.238998)">
                          <path fill="#4285F4" d="M -3.264 51.509 C -3.264 50.719 -3.334 49.969 -3.454 49.239 L -14.754 49.239 L -14.754 53.749 L -8.284 53.749 C -8.574 55.229 -9.424 56.479 -10.684 57.329 L -10.684 60.329 L -6.824 60.329 C -4.564 58.239 -3.264 55.159 -3.264 51.509 Z" />
                          <path fill="#34A853" d="M -14.754 63.239 C -11.514 63.239 -8.804 62.159 -6.824 60.329 L -10.684 57.329 C -11.764 58.049 -13.134 58.489 -14.754 58.489 C -17.884 58.489 -20.534 56.379 -21.484 53.529 L -25.464 53.529 L -25.464 56.619 C -23.494 60.539 -19.444 63.239 -14.754 63.239 Z" />
                          <path fill="#FBBC05" d="M -21.484 53.529 C -21.734 52.809 -21.864 52.039 -21.864 51.239 C -21.864 50.439 -21.724 49.669 -21.484 48.949 L -21.484 45.859 L -25.464 45.859 C -26.284 47.479 -26.754 49.299 -26.754 51.239 C -26.754 53.179 -26.284 54.999 -25.464 56.619 L -21.484 53.529 Z" />
                          <path fill="#EA4335" d="M -14.754 43.989 C -12.984 43.989 -11.404 44.599 -10.154 45.789 L -6.734 42.369 C -8.804 40.429 -11.514 39.239 -14.754 39.239 C -19.444 39.239 -23.494 41.939 -25.464 45.859 L -21.484 48.949 C -20.534 46.099 -17.884 43.989 -14.754 43.989 Z" />
                        </g>
                      </svg>
                      Přihlásit se pomocí Google
                    </>
                  )}
                </Button>
                
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <Separator className="w-full" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-background px-2 text-muted-foreground">
                      Nebo s emailem
                    </span>
                  </div>
                </div>
                
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid gap-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="vas@email.cz"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                  <div className="grid gap-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="password">Heslo</Label>
                      <Link
                        to="/forgot-password"
                        className="text-sm text-primary underline-offset-4 hover:underline"
                      >
                        Zapomenuté heslo?
                      </Link>
                    </div>
                    <Input
                      id="password"
                      type="password"
                      placeholder="********"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                  </div>
                  <Button
                    type="submit"
                    className="w-full"
                    disabled={isLoading}
                  >
                    {isLoading ? "Přihlašování..." : "Přihlásit se"}
                  </Button>
                </form>
              </div>
            </TabsContent>
            
            <TabsContent value="test">
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground mb-2">
                  Vyberte testovací účet pro rychlé přihlášení:
                </p>
                
                <div className="grid gap-2">
                  <Button
                    variant="outline"
                    className="justify-start h-auto py-3"
                    onClick={() => setTestAccount('user1')}
                  >
                    <div className="text-left">
                      <p className="font-medium">Prémiový uživatel</p>
                      <p className="text-sm text-muted-foreground">uzivatel1@example.com / heslo123</p>
                    </div>
                  </Button>
                  
                  <Button
                    variant="outline"
                    className="justify-start h-auto py-3"
                    onClick={() => setTestAccount('user2')}
                  >
                    <div className="text-left">
                      <p className="font-medium">Běžný uživatel</p>
                      <p className="text-sm text-muted-foreground">uzivatel2@example.com / heslo123</p>
                    </div>
                  </Button>
                  
                  <Button
                    variant="outline"
                    className="justify-start h-auto py-3"
                    onClick={() => setTestAccount('admin')}
                  >
                    <div className="text-left">
                      <p className="font-medium">Administrátorský účet</p>
                      <p className="text-sm text-muted-foreground">admin@pendlerapp.com / Admin123</p>
                    </div>
                  </Button>
                </div>
                
                <Button 
                  type="submit" 
                  className="w-full mt-2" 
                  onClick={handleSubmit}
                  disabled={isLoading}
                >
                  {isLoading ? "Přihlašování..." : "Přihlásit se s testovacím účtem"}
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
        <CardFooter>
          <div className="text-center w-full text-sm">
            Nemáte účet?{" "}
            <Link to="/register" className="text-primary underline-offset-4 hover:underline">
              Registrujte se zdarma
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Login;
