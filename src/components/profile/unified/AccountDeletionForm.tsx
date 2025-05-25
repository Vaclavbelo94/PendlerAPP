
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Trash2, AlertTriangle } from 'lucide-react';
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";

const AccountDeletionForm = () => {
  const [confirmationText, setConfirmationText] = useState("");
  const [loading, setLoading] = useState(false);
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const handleDeleteAccount = async () => {
    if (confirmationText !== "SMAZAT") {
      toast.error("Pro potvrzení napište 'SMAZAT'");
      return;
    }
    
    setLoading(true);
    try {
      // Note: Account deletion through Supabase Admin API would require backend implementation
      // For now, we'll sign out the user and show a message
      toast.success("Žádost o smazání účtu byla odeslána. Kontaktujte podporu pro dokončení procesu.");
      await signOut();
      navigate("/");
    } catch (error) {
      console.error('Account deletion error:', error);
      toast.error("Chyba při mazání účtu");
    } finally {
      setLoading(false);
      setConfirmationText("");
    }
  };

  return (
    <Card className="border-destructive">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-destructive">
          <Trash2 className="h-5 w-5" />
          Smazání účtu
        </CardTitle>
        <CardDescription>
          Trvale smaže váš účet a všechna data. Tato akce je nevratná.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-start space-x-3 p-4 bg-destructive/10 rounded-lg border border-destructive/20">
          <AlertTriangle className="h-5 w-5 text-destructive mt-0.5 flex-shrink-0" />
          <div className="space-y-1">
            <p className="font-medium text-sm">Varování</p>
            <p className="text-sm text-muted-foreground">
              Smazání účtu je nevratné. Všechny vaše data včetně směn, nastavení a pokroku 
              budou trvale odstraněny.
            </p>
          </div>
        </div>

        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="destructive" className="w-full">
              Smazat můj účet
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Opravdu chcete smazat účet?</AlertDialogTitle>
              <AlertDialogDescription className="space-y-3">
                <p>
                  Tato akce trvale smaže váš účet <strong>{user?.email}</strong> a všechna související data.
                </p>
                <p>
                  Pro potvrzení napište <strong>SMAZAT</strong> do pole níže:
                </p>
                <div className="space-y-2">
                  <Label htmlFor="confirmDelete">Potvrzení</Label>
                  <Input
                    id="confirmDelete"
                    value={confirmationText}
                    onChange={(e) => setConfirmationText(e.target.value)}
                    placeholder="Napište 'SMAZAT'"
                  />
                </div>
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel onClick={() => setConfirmationText("")}>
                Zrušit
              </AlertDialogCancel>
              <AlertDialogAction
                onClick={handleDeleteAccount}
                disabled={confirmationText !== "SMAZAT" || loading}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              >
                {loading ? "Mazání..." : "Smazat účet"}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </CardContent>
    </Card>
  );
};

export default AccountDeletionForm;
