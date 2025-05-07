
import { useState } from "react";
import { Link } from "react-router-dom";
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

const Register = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    agreeTerms: false,
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    agreeTerms: "",
  });

  const handleChange = (e) => {
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

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      setLoading(true);
      
      // Simulace registrace
      setTimeout(() => {
        setLoading(false);
        toast({
          title: "Registrace úspěšná!",
          description: "Váš účet byl vytvořen.",
        });
      }, 1500);
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
