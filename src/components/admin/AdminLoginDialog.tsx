
import { useState } from "react";
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { useAuth } from "@/hooks/auth";
import { isRegularAdmin, isDHLAdmin } from "@/utils/dhlAuthUtils";

interface AdminLoginDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const AdminLoginDialog = ({ isOpen, onClose, onSuccess }: AdminLoginDialogProps) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { signIn, refreshAdminStatus } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { error } = await signIn(email, password);
      
      if (error) {
        toast.error("Přihlášení selhalo: " + String(error));
        return;
      }
      
      // Po úspěšném přihlášení obnovíme admin status
      await refreshAdminStatus();
      
      // Malé zpoždění pro zpracování admin statusu
      setTimeout(() => {
        // Check if user is any type of admin
        const userObj = { email } as any;
        const isRegAdmin = isRegularAdmin(userObj);
        const isDHLAdm = isDHLAdmin(userObj);
        
        if (isRegAdmin || isDHLAdm) {
          toast.success(`Přihlášení do ${isDHLAdm ? 'DHL ' : ''}administrace úspěšné`);
          setEmail("");
          setPassword("");
          onSuccess();
        } else {
          toast.error("Nemáte administrátorská práva");
        }
      }, 100);
    } catch (error: any) {
      const errorMessage = error?.message || "Neočekávaná chyba";
      toast.error("Přihlášení selhalo: " + errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Přihlášení administrátora</DialogTitle>
          <DialogDescription>
            Pro přístup do administrátorské sekce je nutné se přihlásit s administrátorskými právy.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="admin-email">Email</Label>
            <Input 
              id="admin-email" 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@pendlerapp.com"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="admin-password">Heslo</Label>
            <Input 
              id="admin-password" 
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="********" 
              required
            />
          </div>
          <div className="text-sm bg-muted p-2 rounded space-y-1">
            <p>Testovací admin přístupy:</p>
            <p><strong>Hlavní admin:</strong> admin@pendlerapp.com / admin123</p>
            <p><strong>DHL admin:</strong> admindhl@pendlerapp.com / admin123</p>
          </div>
          <DialogFooter>
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
              disabled={isLoading}
            >
              {isLoading ? "Přihlašování..." : "Přihlásit"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AdminLoginDialog;
