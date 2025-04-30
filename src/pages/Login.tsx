
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { UserRound, KeyRound, LogIn } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import Navbar from "@/components/layouts/Navbar";
import Footer from "@/components/layouts/Footer";

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Mock login functionality
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      if (email && password) {
        localStorage.setItem("isLoggedIn", "true");
        if (rememberMe) {
          localStorage.setItem("rememberedEmail", email);
        }
        toast.success("Přihlášení úspěšné");
        navigate("/");
      } else {
        toast.error("Prosím vyplňte všechna pole");
      }
    } catch (error) {
      toast.error("Chyba při přihlašování");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <Card className="w-full max-w-md">
          <CardHeader className="space-y-1">
            <div className="flex justify-center mb-2">
              <LogIn className="h-12 w-12 text-primary" />
            </div>
            <CardTitle className="text-2xl font-bold text-center">Přihlášení</CardTitle>
            <CardDescription className="text-center">
              Zadejte své přihlašovací údaje pro přístup k účtu
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <UserRound className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input 
                    id="email"
                    type="email"
                    placeholder="jmeno@domena.cz"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Heslo</Label>
                  <Button
                    variant="link"
                    className="text-sm text-primary p-0 h-auto"
                    type="button"
                  >
                    Zapomenuté heslo?
                  </Button>
                </div>
                <div className="relative">
                  <KeyRound className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input 
                    id="password" 
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="remember" 
                  checked={rememberMe}
                  onCheckedChange={(checked) => setRememberMe(checked === true)}
                />
                <Label htmlFor="remember" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                  Zapamatovat si mě
                </Label>
              </div>
              <Button 
                type="submit" 
                className="w-full" 
                disabled={isLoading}
              >
                {isLoading ? "Přihlašování..." : "Přihlásit se"}
              </Button>
            </form>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <div className="text-center text-sm">
              Nemáte účet?{" "}
              <Button
                variant="link"
                className="p-0 h-auto text-primary"
                onClick={() => navigate("/register")}
              >
                Registrovat se
              </Button>
            </div>
          </CardFooter>
        </Card>
      </main>
      <Footer />
    </div>
  );
};

export default Login;
