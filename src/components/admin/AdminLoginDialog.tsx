
import { useState } from "react";
import { toast } from "sonner";
import { Shield, KeyIcon, LogInIcon, EyeIcon, EyeOffIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";

interface AdminLoginDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const AdminLoginDialog = ({ isOpen, onClose, onSuccess }: AdminLoginDialogProps) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulace ověření (v produkci by toto bylo na backendu)
    setTimeout(() => {
      if (username === "vbelo" && password === "Vaclav711") {
        localStorage.setItem("adminLoggedIn", "true");
        toast.success("Přihlášení do administrace úspěšné");
        onSuccess();
      } else {
        toast.error("Nesprávné přihlašovací údaje");
      }
      setIsLoading(false);
    }, 800);
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => {
      if (!open) onClose();
    }}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex justify-center mb-4">
            <div className="w-12 h-12 rounded-full bg-primary-500/20 flex items-center justify-center text-primary">
              <Shield className="h-6 w-6" />
            </div>
          </div>
          <DialogTitle className="text-center">Přihlášení do administrace</DialogTitle>
          <DialogDescription className="text-center">
            Pro vstup do administrace je potřeba přihlášení
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleLogin} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="username">Uživatelské jméno</Label>
            <div className="relative">
              <Input 
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="pl-10"
                placeholder="Zadejte uživatelské jméno"
                required
              />
              <div className="absolute left-3 top-2.5 text-gray-400">
                <Shield className="h-4 w-4" />
              </div>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="password">Heslo</Label>
            <div className="relative">
              <Input 
                id="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="pl-10 pr-10"
                placeholder="Zadejte heslo"
                required
              />
              <div className="absolute left-3 top-2.5 text-gray-400">
                <KeyIcon className="h-4 w-4" />
              </div>
              <button 
                type="button"
                className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <EyeOffIcon className="h-4 w-4" />
                ) : (
                  <EyeIcon className="h-4 w-4" />
                )}
              </button>
            </div>
          </div>
          
          <DialogFooter className="pt-4">
            <Button
              type="button" 
              variant="outline" 
              onClick={onClose}
              disabled={isLoading}
            >
              Zrušit
            </Button>
            <Button 
              type="submit"
              className="gap-2"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Přihlašování...
                </>
              ) : (
                <>
                  <LogInIcon className="h-4 w-4" />
                  Přihlásit se
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AdminLoginDialog;
