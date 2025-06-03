import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import { Separator } from "@/components/ui/separator";
import PromoCodeField from "@/components/auth/PromoCodeField";
import { cleanupAuthState, checkLocalStorageSpace } from "@/utils/authUtils";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

const Register = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [username, setUsername] = useState("");
  const [promoCode, setPromoCode] = useState("");
  const [isPromoValid, setIsPromoValid] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [storageWarning, setStorageWarning] = useState(false);
  const navigate = useNavigate();
  const { signUp, signInWithGoogle, user } = useAuth();
  
  useEffect(() => {
    // Redirect user to homepage if already logged in
    if (user) {
      navigate("/");
    }
    
    // Check localStorage space and clean up if needed
    if (!checkLocalStorageSpace()) {
      setStorageWarning(true);
      cleanupAuthState();
    }
  }, [user, navigate]);

  const handlePromoCodeChange = (code: string, isValid: boolean) => {
    setPromoCode(code);
    setIsPromoValid(isValid);
  };

  const handleStorageCleanup = () => {
    cleanupAuthState();
    setStorageWarning(false);
    toast.success("Úložiště bylo vyčištěno");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      toast.error("Hesla se neshodují");
      return;
    }
    
    if (password.length < 6) {
      toast.error("Heslo musí mít alespoň 6 znaků");
      return;
    }
    
    // Check storage space before attempting registration
    if (!checkLocalStorageSpace()) {
      toast.error("Nedostatek místa v úložišti", {
        description: "Zkuste vyčistit úložiště prohlížeče nebo použijte jiný prohlížeč"
      });
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Clean up any existing auth state before registration
      cleanupAuthState();
      
      const { error } = await signUp(email, password, username);
      
      if (error) {
        let errorMessage = "Zkontrolujte své údaje a zkuste to znovu.";
        
        const errorStr = typeof error === 'string' ? error : (error?.message || JSON.stringify(error));
        const errorCode = typeof error === 'object' && error !== null ? error?.code : undefined;
        
        if (errorStr.includes("User already registered") || errorCode === "user_already_exists") {
          errorMessage = "Uživatel s tímto emailem již existuje. Zkuste se přihlásit.";
        } else if (errorStr.includes("Invalid email")) {
          errorMessage = "Neplatný formát emailu.";
        } else if (errorStr.includes("Password")) {
          errorMessage = "Heslo nesplňuje požadavky.";
        } else if (errorStr.includes("quota") || errorStr.includes("storage")) {
          errorMessage = "Problém s úložištěm prohlížeče. Zkuste vyčistit cache.";
        }
        
        toast.error("Registrace selhala", {
          description: errorMessage,
        });
      } else {
        let successMessage = "Účet byl úspěšně vytvořen!";
        let description = "Nyní se můžete přihlásit.";
        
        if (isPromoValid && promoCode) {
          successMessage = "Účet vytvořen s Premium přístupem!";
          description = `Promo kód "${promoCode}" byl aktivován. Nyní se můžete přihlásit.`;
        }
        
        toast.success(successMessage, { description });
        navigate("/login");
      }
    } catch (error: any) {
      let errorMessage = "Nastala neznámá chyba. Zkuste to prosím později.";
      
      if (error?.message?.includes("quota") || error?.message?.includes("storage")) {
        errorMessage = "Nedostatek místa v úložišti prohlížeče. Zkuste vyčistit cache nebo použít jiný prohlížeč.";
      }
      
      toast.error("Chyba při registraci", {
        description: errorMessage,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleRegister = async () => {
    if (!checkLocalStorageSpace()) {
      toast.error("Nedostatek místa v úložišti", {
        description: "Zkuste vyčistit úložiště prohlížeče"
      });
      return;
    }
    
    setIsGoogleLoading(true);
    
    try {
      // Clean up any existing auth state
      cleanupAuthState();
      
      const { error, url } = await signInWithGoogle();
      
      if (error) {
        const errorMessage = typeof error === 'string' ? error : (error?.message || "Nastala chyba při registraci s Google účtem.");
        toast.error("Registrace s Google selhala", {
          description: errorMessage,
        });
      }
      
      if (url) {
        window.location.href = url;
      }
    } catch (error: any) {
      toast.error("Chyba při registraci", {
        description: error?.message || "Nastala neznámá chyba. Zkuste to prosím později.",
      });
    } finally {
      setIsGoogleLoading(false);
    }
  };

  return (
    <div className="container max-w-md mx-auto py-16 px-4">
      <Card className="w-full">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl">Registrace</CardTitle>
          <CardDescription>
            Vytvořte si nový účet a začněte využívat všechny funkce
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          {storageWarning && (
            <Alert className="border-yellow-500/20 bg-yellow-50 dark:bg-yellow-900/10">
              <AlertCircle className="h-4 w-4 text-yellow-600" />
              <AlertDescription className="text-yellow-800 dark:text-yellow-200">
                <div className="flex flex-col space-y-2">
                  <span>Úložiště prohlížeče je plné. To může způsobit problémy při registraci.</span>
                  <Button 
                    size="sm" 
                    variant="outline" 
                    onClick={handleStorageCleanup}
                    className="w-fit"
                  >
                    Vyčistit úložiště
                  </Button>
                </div>
              </AlertDescription>
            </Alert>
          )}
          
          {/* Google Register Button */}
          <Button 
            type="button" 
            variant="outline" 
            className="w-full flex items-center justify-center gap-2"
            onClick={handleGoogleRegister}
            disabled={isGoogleLoading}
          >
            {isGoogleLoading ? (
              "Registrace..."
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
                Registrovat se pomocí Google
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
              <Label htmlFor="username">Uživatelské jméno (volitelné)</Label>
              <Input
                id="username"
                type="text"
                placeholder="Vaše uživatelské jméno"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
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
              <Label htmlFor="password">Heslo</Label>
              <Input
                id="password"
                type="password"
                placeholder="Alespoň 6 znaků"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="confirmPassword">Potvrďte heslo</Label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="Zadejte heslo znovu"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>
            
            <PromoCodeField onPromoCodeChange={handlePromoCodeChange} />
            
            <Button
              type="submit"
              className="w-full"
              disabled={isLoading}
            >
              {isLoading ? "Registrování..." : "Vytvořit účet"}
            </Button>
          </form>
        </CardContent>
        <CardFooter>
          <div className="text-center w-full text-sm">
            Již máte účet?{" "}
            <Link to="/login" className="text-primary underline-offset-4 hover:underline">
              Přihlaste se
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Register;
