
import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { 
  Crown, 
  Shield, 
  Ban, 
  Mail,
  CheckCircle,
  AlertTriangle
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface BulkActionsDialogProps {
  selectedUsers: string[];
  onClose: () => void;
  onComplete: () => void;
}

type BulkAction = 'grant_premium' | 'revoke_premium' | 'grant_admin' | 'revoke_admin' | 'delete_users' | 'send_email';

export const BulkActionsDialog: React.FC<BulkActionsDialogProps> = ({
  selectedUsers,
  onClose,
  onComplete
}) => {
  const [selectedAction, setSelectedAction] = useState<BulkAction | ''>('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [processedCount, setProcessedCount] = useState(0);

  const actions = [
    {
      value: 'grant_premium',
      label: 'Udělit Premium status',
      icon: <Crown className="h-4 w-4" />,
      variant: 'default' as const,
      description: 'Udělí Premium status všem vybraným uživatelům na 90 dní'
    },
    {
      value: 'revoke_premium',
      label: 'Odebrat Premium status',
      icon: <Crown className="h-4 w-4" />,
      variant: 'secondary' as const,
      description: 'Odeře Premium status všem vybraným uživatelům'
    },
    {
      value: 'grant_admin',
      label: 'Udělit Admin práva',
      icon: <Shield className="h-4 w-4" />,
      variant: 'destructive' as const,
      description: 'Udělí administrátorská práva všem vybraným uživatelům'
    },
    {
      value: 'revoke_admin',
      label: 'Odebrat Admin práva',
      icon: <Shield className="h-4 w-4" />,
      variant: 'secondary' as const,
      description: 'Odebere administrátorská práva všem vybraným uživatelům'
    },
    {
      value: 'send_email',
      label: 'Odeslat hromadný email',
      icon: <Mail className="h-4 w-4" />,
      variant: 'default' as const,
      description: 'Odešle email všem vybraným uživatelům'
    },
    {
      value: 'delete_users',
      label: 'Smazat uživatele',
      icon: <Ban className="h-4 w-4" />,
      variant: 'destructive' as const,
      description: 'Trvale smaže všechny vybrané uživatele a jejich data'
    }
  ];

  const selectedActionConfig = actions.find(action => action.value === selectedAction);

  const processUsers = async () => {
    if (!selectedAction) return;

    const confirmMessage = `Opravdu chcete provést akci "${selectedActionConfig?.label}" na ${selectedUsers.length} uživatelích?`;
    
    if (selectedAction === 'delete_users') {
      const extraConfirm = confirm(`VAROVÁNÍ: Tato akce je nevratná!\n\n${confirmMessage}`);
      if (!extraConfirm) return;
    } else {
      if (!confirm(confirmMessage)) return;
    }

    setIsProcessing(true);
    setProgress(0);
    setProcessedCount(0);

    try {
      for (let i = 0; i < selectedUsers.length; i++) {
        const userId = selectedUsers[i];
        
        try {
          await processUserAction(userId, selectedAction);
          setProcessedCount(i + 1);
          setProgress(((i + 1) / selectedUsers.length) * 100);
          
          // Small delay to prevent overwhelming the database
          await new Promise(resolve => setTimeout(resolve, 100));
        } catch (error) {
          console.error(`Error processing user ${userId}:`, error);
          // Continue with other users even if one fails
        }
      }

      toast.success(`Hromadná akce dokončena pro ${selectedUsers.length} uživatelů`);
      onComplete();
    } catch (error) {
      console.error('Bulk action error:', error);
      toast.error('Chyba při provádění hromadné akce');
    } finally {
      setIsProcessing(false);
    }
  };

  const processUserAction = async (userId: string, action: BulkAction) => {
    switch (action) {
      case 'grant_premium':
        const premiumExpiry = new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString();
        await supabase
          .from('profiles')
          .update({ 
            is_premium: true,
            premium_expiry: premiumExpiry
          })
          .eq('id', userId);
        break;

      case 'revoke_premium':
        await supabase
          .from('profiles')
          .update({ 
            is_premium: false,
            premium_expiry: null
          })
          .eq('id', userId);
        break;

      case 'grant_admin':
        await supabase
          .from('profiles')
          .update({ is_admin: true })
          .eq('id', userId);
        break;

      case 'revoke_admin':
        await supabase
          .from('profiles')
          .update({ is_admin: false })
          .eq('id', userId);
        break;

      case 'delete_users':
        await supabase
          .from('profiles')
          .delete()
          .eq('id', userId);
        break;

      case 'send_email':
        // This would require an edge function to send emails
        console.log('Email sending not implemented yet');
        break;

      default:
        throw new Error(`Unknown action: ${action}`);
    }
  };

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Hromadné akce</DialogTitle>
          <DialogDescription>
            Vyberte akci pro {selectedUsers.length} označených uživatelů
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium">Vyberte akci</label>
            <Select value={selectedAction} onValueChange={(value) => setSelectedAction(value as BulkAction)}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Vyberte akci..." />
              </SelectTrigger>
              <SelectContent>
                {actions.map((action) => (
                  <SelectItem key={action.value} value={action.value}>
                    <div className="flex items-center gap-2">
                      {action.icon}
                      {action.label}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {selectedActionConfig && (
            <div className="p-3 bg-muted rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Badge variant={selectedActionConfig.variant}>
                  {selectedActionConfig.icon}
                  {selectedActionConfig.label}
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground">
                {selectedActionConfig.description}
              </p>
              
              {selectedAction === 'delete_users' && (
                <div className="flex items-start gap-2 mt-2 p-2 bg-red-50 border border-red-200 rounded">
                  <AlertTriangle className="h-4 w-4 text-red-500 mt-0.5" />
                  <div className="text-xs text-red-700">
                    <strong>Varování:</strong> Tato akce je nevratná a smaže všechna uživatelská data!
                  </div>
                </div>
              )}
            </div>
          )}

          {isProcessing && (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span>Zpracování...</span>
                <span>{processedCount} / {selectedUsers.length}</span>
              </div>
              <Progress value={progress} className="w-full" />
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={isProcessing}>
            Zrušit
          </Button>
          <Button 
            onClick={processUsers} 
            disabled={!selectedAction || isProcessing}
            variant={selectedActionConfig?.variant === 'destructive' ? 'destructive' : 'default'}
          >
            {isProcessing ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Zpracování...
              </>
            ) : (
              <>
                {selectedActionConfig?.icon}
                Provést akci
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
