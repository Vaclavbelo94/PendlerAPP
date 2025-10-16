
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
import { useTranslation } from "react-i18next";

interface AdminLoginDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const AdminLoginDialog = ({ isOpen, onClose, onSuccess }: AdminLoginDialogProps) => {
  const { t } = useTranslation('admin');
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
        toast.error(t('login.loginFailed') + ": " + String(error));
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
          toast.success(t('login.loginSuccess', { type: isDHLAdm ? 'DHL ' : '' }));
          setEmail("");
          setPassword("");
          onSuccess();
        } else {
          toast.error(t('login.noPermissions'));
        }
      }, 100);
    } catch (error: any) {
      const errorMessage = error?.message || t('login.unexpectedError');
      toast.error(t('login.loginFailed') + ": " + errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{t('login.title')}</DialogTitle>
          <DialogDescription>
            {t('login.description')}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="admin-email">{t('login.email')}</Label>
            <Input 
              id="admin-email" 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={t('login.emailPlaceholder')}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="admin-password">{t('login.password')}</Label>
            <Input 
              id="admin-password" 
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder={t('login.passwordPlaceholder')} 
              required
            />
          </div>
          <div className="text-sm bg-muted p-2 rounded space-y-1">
            <p>{t('login.testAccess')}</p>
            <p><strong>{t('login.mainAdmin')}</strong> admin@pendlerapp.com / admin123</p>
            <p><strong>{t('login.dhlAdmin')}</strong> admindhl@pendlerapp.com / admin123</p>
          </div>
          <DialogFooter>
            <Button 
              type="button" 
              variant="outline" 
              onClick={onClose}
              disabled={isLoading}
            >
              {t('login.cancel')}
            </Button>
            <Button 
              type="submit" 
              disabled={isLoading}
            >
              {isLoading ? t('login.loggingIn') : t('login.login')}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AdminLoginDialog;
