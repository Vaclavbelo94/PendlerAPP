
import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { 
  Crown, 
  Shield, 
  Trash2, 
  Mail, 
  Download,
  AlertTriangle
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface BulkActionsDialogProps {
  selectedUsers: string[];
  onClose: () => void;
  onComplete: () => void;
}

interface BulkAction {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  variant: 'default' | 'destructive';
  requiresConfirmation: boolean;
}

const bulkActions: BulkAction[] = [
  {
    id: 'add-premium',
    title: 'Přidat Premium',
    description: 'Aktivovat Premium status pro vybrané uživatele (90 dní)',
    icon: <Crown className="h-4 w-4" />,
    variant: 'default',
    requiresConfirmation: true
  },
  {
    id: 'remove-premium',
    title: 'Odebrat Premium',
    description: 'Deaktivovat Premium status pro vybrané uživatele',
    icon: <Crown className="h-4 w-4" />,
    variant: 'default',
    requiresConfirmation: true
  },
  {
    id: 'add-admin',
    title: 'Přidat Admin práva',
    description: 'Udělit administrátorská oprávnění vybraným uživatelům',
    icon: <Shield className="h-4 w-4" />,
    variant: 'destructive',
    requiresConfirmation: true
  },
  {
    id: 'remove-admin',
    title: 'Odebrat Admin práva',
    description: 'Odebrat administrátorská oprávnění vybraným uživatelům',
    icon: <Shield className="h-4 w-4" />,
    variant: 'default',
    requiresConfirmation: true
  },
  {
    id: 'export-data',
    title: 'Exportovat data',
    description: 'Stáhnout CSV soubor s údaji vybraných uživatelů',
    icon: <Download className="h-4 w-4" />,
    variant: 'default',
    requiresConfirmation: false
  },
  {
    id: 'send-notification',
    title: 'Odeslat notifikaci',
    description: 'Odeslat email notifikaci vybraným uživatelům',
    icon: <Mail className="h-4 w-4" />,
    variant: 'default',
    requiresConfirmation: false
  },
  {
    id: 'delete-users',
    title: 'Smazat uživatele',
    description: 'POZOR: Permanentně smazat vybrané uživatele včetně všech dat',
    icon: <Trash2 className="h-4 w-4" />,
    variant: 'destructive',
    requiresConfirmation: true
  }
];

export const BulkActionsDialog: React.FC<BulkActionsDialogProps> = ({
  selectedUsers,
  onClose,
  onComplete
}) => {
  const [selectedAction, setSelectedAction] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [confirmationChecked, setConfirmationChecked] = useState(false);

  const handleActionSelect = (actionId: string) => {
    setSelectedAction(actionId);
    setConfirmationChecked(false);
  };

  const executeAction = async () => {
    if (!selectedAction) return;

    const action = bulkActions.find(a => a.id === selectedAction);
    if (!action) return;

    if (action.requiresConfirmation && !confirmationChecked) {
      toast.error('Potvrďte prosím akci zaškrtnutím políčka');
      return;
    }

    setIsProcessing(true);

    try {
      switch (selectedAction) {
        case 'add-premium':
          await updateUsersPremium(true);
          break;
        case 'remove-premium':
          await updateUsersPremium(false);
          break;
        case 'add-admin':
          await updateUsersAdmin(true);
          break;
        case 'remove-admin':
          await updateUsersAdmin(false);
          break;
        case 'export-data':
          await exportSelectedUsers();
          break;
        case 'send-notification':
          await sendNotificationToUsers();
          break;
        case 'delete-users':
          await deleteSelectedUsers();
          break;
        default:
          toast.error('Neznámá akce');
      }
      
      onComplete();
    } catch (error) {
      console.error('Error executing bulk action:', error);
      toast.error('Nepodařilo se provést akci');
    } finally {
      setIsProcessing(false);
    }
  };

  const updateUsersPremium = async (isPremium: boolean) => {
    const premiumExpiry = isPremium 
      ? new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString()
      : null;

    const { error } = await supabase
      .from('profiles')
      .update({ 
        is_premium: isPremium,
        premium_expiry: premiumExpiry
      })
      .in('id', selectedUsers);

    if (error) throw error;

    toast.success(`Premium status ${isPremium ? 'aktivován' : 'deaktivován'} pro ${selectedUsers.length} uživatelů`);
  };

  const updateUsersAdmin = async (isAdmin: boolean) => {
    const { error } = await supabase
      .from('profiles')
      .update({ is_admin: isAdmin })
      .in('id', selectedUsers);

    if (error) throw error;

    toast.success(`Admin práva ${isAdmin ? 'udělena' : 'odebrána'} pro ${selectedUsers.length} uživatelů`);
  };

  const exportSelectedUsers = async () => {
    const { data: users, error } = await supabase
      .from('profiles')
      .select('email, username, is_premium, is_admin, created_at')
      .in('id', selectedUsers);

    if (error) throw error;

    const csvContent = [
      ['Email', 'Username', 'Premium', 'Admin', 'Registrace'].join(','),
      ...users.map(user => [
        user.email,
        user.username || '',
        user.is_premium ? 'Ano' : 'Ne',
        user.is_admin ? 'Ano' : 'Ne',
        new Date(user.created_at).toLocaleDateString('cs-CZ')
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `vybrani_uzivatele_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();

    toast.success('Export dokončen');
  };

  const sendNotificationToUsers = async () => {
    toast.info('Funkce odesílání notifikací bude implementována v další verzi');
  };

  const deleteSelectedUsers = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      toast.error('Nejste přihlášeni');
      return;
    }

    let successCount = 0;
    let errorCount = 0;

    for (const userId of selectedUsers) {
      try {
        const response = await fetch('/functions/v1/delete-user', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${session.access_token}`
          },
          body: JSON.stringify({ userId })
        });

        if (response.ok) {
          successCount++;
        } else {
          errorCount++;
        }
      } catch (error) {
        errorCount++;
      }
    }

    if (successCount > 0) {
      toast.success(`Úspěšně smazáno ${successCount} uživatelů`);
    }
    if (errorCount > 0) {
      toast.error(`Nepodařilo se smazat ${errorCount} uživatelů`);
    }
  };

  const selectedActionData = bulkActions.find(a => a.id === selectedAction);

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Hromadné akce</DialogTitle>
          <DialogDescription>
            Provést akci pro {selectedUsers.length} vybraných uživatelů
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {bulkActions.map((action) => (
              <Card 
                key={action.id}
                className={`cursor-pointer transition-colors hover:bg-accent ${
                  selectedAction === action.id ? 'ring-2 ring-primary' : ''
                }`}
                onClick={() => handleActionSelect(action.id)}
              >
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm flex items-center gap-2">
                    {action.icon}
                    {action.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-xs">
                    {action.description}
                  </CardDescription>
                  {action.variant === 'destructive' && (
                    <Badge variant="destructive" className="mt-2 text-xs">
                      <AlertTriangle className="h-3 w-3 mr-1" />
                      Nebezpečná akce
                    </Badge>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>

          {selectedActionData?.requiresConfirmation && (
            <Card className="border-amber-200 bg-amber-50">
              <CardContent className="pt-4">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="confirm"
                    checked={confirmationChecked}
                    onCheckedChange={setConfirmationChecked}
                  />
                  <label
                    htmlFor="confirm"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Potvrzuji, že chci provést akci "{selectedActionData.title}" pro {selectedUsers.length} uživatelů
                  </label>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        <div className="flex justify-end gap-2 pt-4 border-t">
          <Button variant="outline" onClick={onClose} disabled={isProcessing}>
            Zrušit
          </Button>
          <Button 
            onClick={executeAction} 
            disabled={!selectedAction || isProcessing}
            variant={selectedActionData?.variant === 'destructive' ? 'destructive' : 'default'}
          >
            {isProcessing ? 'Zpracovávám...' : 'Provést akci'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
