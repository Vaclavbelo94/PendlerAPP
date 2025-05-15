
import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "@/components/ui/use-toast";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { signIn, user } = useAuth();
  
  useEffect(() => {
    // Pokud je uživatel již přihlášen, přesměrujeme ho na hlavní stránku
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
