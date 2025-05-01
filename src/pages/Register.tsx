
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { UserRound, KeyRound, Mail, UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import Navbar from "@/components/layouts/Navbar";
import Footer from "@/components/layouts/Footer";

const Register = () => {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Form validation
      if (!name || !email || !password || !confirmPassword) {
        toast.error("Prosím vyplňte všechna pole");
        setIsLoading(false);
        return;
      }

      if (password !== confirmPassword) {
        toast.error("Hesla se neshodují");
        setIsLoading(false);
        return;
      }

      if (!agreeTerms) {
        toast.error("Musíte souhlasit s podmínkami");
        setIsLoading(false);
        return;
      }

      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Check if user already exists in local storage
      const users = JSON.parse(localStorage.getItem("users") || "[]");
      const userExists = users.some((user: any) => user.email === email);
      
      if (userExists) {
        toast.error("Uživatel s tímto emailem již existuje");
        setIsLoading(false);
        return;
      }

      // Save new user to local storage
      const newUser = { name, email, password };
      users.push(newUser);
      localStorage.setItem("users", JSON.stringify(users));
      
      toast.success("Registrace úspěšná");
      navigate("/login");
    } catch (error) {
      toast.error("Chyba při registraci");
      console.error(error);
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
              <UserPlus className="h-12 w-12 text-primary" />
            </div>
            <CardTitle className="text-2xl font-bold text-center">Registrace</CardTitle>
            <CardDescription className="text-center">
              Vytvořte si účet a získejte přístup k plné verzi aplikace
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleRegister} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Jméno</Label>
                <div className="relative">
                  <UserRound className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input 
                    id="name"
                    type="text"
                    placeholder="Vaše jméno"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
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
                <Label htmlFor="password">Heslo</Label>
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
              <div className="space-y-2">
                <Label htmlFor="confirm-password">Potvrzení hesla</Label>
                <div className="relative">
                  <KeyRound className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input 
                    id="confirm-password" 
                    type="password"
                    placeholder="••••••••"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="terms" 
                  checked={agreeTerms}
                  onCheckedChange={(checked) => setAgreeTerms(checked === true)}
                />
                <Label htmlFor="terms" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                  Souhlasím s{" "}
                  <Button
                    variant="link"
                    className="p-0 h-auto text-primary"
                    onClick={(e) => {
                      e.preventDefault();
                      navigate("/terms");
                    }}
                  >
                    podmínkami
                  </Button>{" "}
                  a{" "}
                  <Button
                    variant="link"
                    className="p-0 h-auto text-primary"
                    onClick={(e) => {
                      e.preventDefault();
                      navigate("/privacy");
                    }}
                  >
                    ochranou osobních údajů
                  </Button>
                </Label>
              </div>
              <Button 
                type="submit" 
                className="w-full" 
                disabled={isLoading}
              >
                {isLoading ? "Registruji..." : "Registrovat se"}
              </Button>
            </form>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <div className="text-center text-sm">
              Již máte účet?{" "}
              <Button
                variant="link"
                className="p-0 h-auto text-primary"
                onClick={() => navigate("/login")}
              >
                Přihlásit se
              </Button>
            </div>
          </CardFooter>
        </Card>
      </main>
      <Footer />
    </div>
  );
};

export default Register;
