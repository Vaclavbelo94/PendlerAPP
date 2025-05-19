
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/components/ui/use-toast";
import { ArrowRight } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { Separator } from "@/components/ui/separator";

interface FormData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  agreeTerms: boolean;
}

interface FormErrors {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  agreeTerms: string;
}

const Register = () => {
  const { toast } = useToast();
  const { signUp, signInWithGoogle, user } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    agreeTerms: false,
  });
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    agreeTerms: "",
  });

  // Pokud je uživatel již přihlášen, přesměrujeme ho na hlavní stránku
  if (user) {
    navigate("/");
    return null;
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });

    // Clear error when user starts typing
    setErrors({
      ...errors,
      [name]: "",
    });
  };

  const validateForm = () => {
    let valid = true;
    const newErrors = { ...errors };

    if (!formData.name.trim()) {
      newErrors.name = "Jméno je povinné";
      valid = false;
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email je povinný";
      valid = false;
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Neplatný email";
      valid = false;
    }

    if (!formData.password) {
      newErrors.password = "Heslo je povinné";
      valid = false;
    } else if (formData.password.length < 8) {
      newErrors.password = "Heslo musí mít alespoň 8 znaků";
      valid = false;
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Hesla se neshodují";
      valid = false;
    }

    if (!formData.agreeTerms) {
      newErrors.agreeTerms = "Musíte souhlasit s podmínkami";
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      setLoading(true);
      
      try {
        const { error } = await signUp(formData.email, formData.password, formData.name);
        
        if (error) {
          toast({
            title: "Registrace selhala",
            description: error.message,
            variant: "destructive",
          });
        } else {
          toast({
            title: "Registrace úspěšná!",
            description: "Váš účet byl vytvořen a jste přihlášeni.",
            variant: "default",
          });
          
          // Přesměrování na hlavní stránku po úspěšné registraci
          navigate("/");
        }
      } catch (error: any) {
        toast({
          title: "Registrace selhala",
          description: error.message,
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    }
  };

  const handleGoogleSignUp = async () => {
    setGoogleLoading(true);
    
    try {
      const { error, url } = await signInWithGoogle();
      
      if (error) {
        toast({
          title: "Registrace s Google selhala",
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
        title: "Chyba při registraci",
        description: error?.message || "Nastala neznámá chyba. Zkuste to prosím později.",
        variant: "destructive",
      });
    } finally {
      setGoogleLoading(false);
    }
  };

  return (
    <div className="container flex items-center justify-center py-12 md:py-20">
      <Card className="w-full max-w-lg">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold">Vytvořit účet</CardTitle>
          <CardDescription>
            Vytvořte si účet pro přístup k dalším funkcím
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Google Sign Up Button */}
          <Button 
            type="button" 
            variant="outline" 
            className="w-full flex items-center justify-center gap-2 mb-4"
            onClick={handleGoogleSignUp}
            disabled={googleLoading}
          >
            {googleLoading ? (
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
                Registrovat se s Google
              </>
            )}
          </Button>
          
          <div className="relative mb-4">
            <div className="absolute inset-0 flex items-center">
              <Separator className="w-full" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">
                Nebo s emailem
              </span>
            </div>
          </div>
          
          <form onSubmit={handleSubmit}>
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Jméno a příjmení</Label>
                <Input
                  id="name"
                  name="name"
                  placeholder="Jan Novák"
                  autoComplete="name"
                  value={formData.name}
                  onChange={handleChange}
                  disabled={loading}
                />
                {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
              </div>
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="vas@email.cz"
                  autoComplete="email"
                  value={formData.email}
                  onChange={handleChange}
                  disabled={loading}
                />
                {errors.email && <p className="text-sm text-red-500">{errors.email}</p>}
              </div>
              <div className="grid gap-2">
                <Label htmlFor="password">Heslo</Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="********"
                  autoComplete="new-password"
                  value={formData.password}
                  onChange={handleChange}
                  disabled={loading}
                />
                {errors.password && <p className="text-sm text-red-500">{errors.password}</p>}
              </div>
              <div className="grid gap-2">
                <Label htmlFor="confirmPassword">Potvrzení hesla</Label>
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  placeholder="********"
                  autoComplete="new-password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  disabled={loading}
                />
                {errors.confirmPassword && <p className="text-sm text-red-500">{errors.confirmPassword}</p>}
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="agreeTerms" 
                  name="agreeTerms"
                  checked={formData.agreeTerms}
                  onCheckedChange={(checked) => 
                    setFormData({...formData, agreeTerms: checked === true})
                  }
                  disabled={loading}
                />
                <Label htmlFor="agreeTerms" className="text-sm">
                  Souhlasím s <Link to="/terms" className="text-primary hover:underline">podmínkami</Link> a{" "}
                  <Link to="/privacy" className="text-primary hover:underline">ochranou osobních údajů</Link>
                </Label>
              </div>
              {errors.agreeTerms && <p className="text-sm text-red-500">{errors.agreeTerms}</p>}
              <Button type="submit" className="w-full mt-4" disabled={loading}>
                {loading ? "Registrace..." : "Registrovat se"}
                {!loading && <ArrowRight className="ml-2 h-4 w-4" />}
              </Button>
            </div>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col space-y-4">
          <div className="text-sm text-center text-muted-foreground">
            Již máte účet?{" "}
            <Link to="/login" className="text-primary hover:underline">
              Přihlásit se
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Register;
