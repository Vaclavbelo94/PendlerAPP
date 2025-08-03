import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { 
  Calendar, 
  Clock, 
  User,
  ArrowLeftRight,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Plus
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useAuth } from '@/hooks/auth';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';

interface ShiftSwap {
  id: string;
  requester_id: string;
  target_user_id?: string;
  original_shift_id?: string;
  requested_shift_id?: string;
  swap_type: 'exchange' | 'cover' | 'trade';
  status: 'pending' | 'approved' | 'rejected' | 'completed' | 'cancelled';
  reason?: string;
  admin_approved_by?: string;
  approved_at?: string;
  expires_at?: string;
  created_at: string;
  requester?: {
    email: string;
    username?: string;
  };
  target_user?: {
    email: string;
    username?: string;
  };
}

interface ShiftExchangeBoardProps {
  className?: string;
}

export const ShiftExchangeBoard: React.FC<ShiftExchangeBoardProps> = ({ 
  className = '' 
}) => {
  const { t } = useTranslation('dhl-employee');
  const { user } = useAuth();
  const [swapRequests, setSwapRequests] = useState<ShiftSwap[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [newSwapData, setNewSwapData] = useState<{
    swap_type: 'exchange' | 'cover' | 'trade';
    reason: string;
    target_user_id: string;
  }>({
    swap_type: 'exchange',
    reason: '',
    target_user_id: ''
  });

  useEffect(() => {
    if (user) {
      loadSwapRequests();
      setupRealtimeSubscription();
    }
  }, [user]);

  const loadSwapRequests = async () => {
    if (!user) return;

    const { data, error } = await supabase
      .from('dhl_shift_swaps')
      .select(`
        *,
        requester:profiles!requester_id(email, username),
        target_user:profiles!target_user_id(email, username)
      `)
      .or(`requester_id.eq.${user.id},target_user_id.eq.${user.id}`)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error loading swap requests:', error);
      return;
    }

    setSwapRequests((data || []) as ShiftSwap[]);
  };

  const setupRealtimeSubscription = () => {
    const channel = supabase
      .channel('shift-swaps')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'dhl_shift_swaps'
        },
        () => {
          loadSwapRequests();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  };

  const createSwapRequest = async () => {
    if (!user || !newSwapData.reason.trim()) return;

    setIsLoading(true);
    try {
      const { error } = await supabase
        .from('dhl_shift_swaps')
        .insert({
          requester_id: user.id,
          swap_type: newSwapData.swap_type,
          reason: newSwapData.reason,
          status: 'pending',
          expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString() // 7 days
        });

      if (error) throw error;

      toast({
        title: t('common.success'),
        description: 'Žádost o výměnu směny byla odeslána',
      });

      setShowCreateDialog(false);
      setNewSwapData({
        swap_type: 'exchange',
        reason: '',
        target_user_id: ''
      });
      
      loadSwapRequests();
    } catch (error) {
      console.error('Error creating swap request:', error);
      toast({
        title: t('common.error'),
        description: 'Chyba při vytváření žádosti o výměnu',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const respondToSwap = async (swapId: string, action: 'approved' | 'rejected') => {
    if (!user) return;

    setIsLoading(true);
    try {
      const { error } = await supabase
        .from('dhl_shift_swaps')
        .update({
          status: action,
          approved_at: action === 'approved' ? new Date().toISOString() : null
        })
        .eq('id', swapId);

      if (error) throw error;

      toast({
        title: t('common.success'),
        description: action === 'approved' ? 'Výměna byla schválena' : 'Výměna byla odmítnuta',
      });

      loadSwapRequests();
    } catch (error) {
      console.error('Error responding to swap:', error);
      toast({
        title: t('common.error'),
        description: 'Chyba při odpovědi na žádost',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      pending: { variant: 'secondary' as const, icon: AlertTriangle, color: 'text-yellow-600' },
      approved: { variant: 'default' as const, icon: CheckCircle, color: 'text-green-600' },
      rejected: { variant: 'destructive' as const, icon: XCircle, color: 'text-red-600' },
      completed: { variant: 'outline' as const, icon: CheckCircle, color: 'text-green-600' },
      cancelled: { variant: 'outline' as const, icon: XCircle, color: 'text-gray-600' }
    };

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.pending;
    const Icon = config.icon;

    return (
      <Badge variant={config.variant} className="text-xs">
        <Icon className="h-3 w-3 mr-1" />
        {t(`shifts.swapStatus.${status}`)}
      </Badge>
    );
  };

  const getSwapTypeIcon = (type: string) => {
    switch (type) {
      case 'exchange':
        return <ArrowLeftRight className="h-4 w-4" />;
      case 'cover':
        return <User className="h-4 w-4" />;
      case 'trade':
        return <Calendar className="h-4 w-4" />;
      default:
        return <ArrowLeftRight className="h-4 w-4" />;
    }
  };

  const getUserName = (userProfile: any) => {
    return userProfile?.username || userProfile?.email?.split('@')[0] || 'Uživatel';
  };

  const isMyRequest = (swap: ShiftSwap) => swap.requester_id === user?.id;
  const canRespond = (swap: ShiftSwap) => 
    swap.target_user_id === user?.id && swap.status === 'pending';

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header with Create Button */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-semibold">{t('team.shiftBoard')}</h3>
          <p className="text-sm text-muted-foreground">
            Spravujte výměny směn s kolegy
          </p>
        </div>
        
        <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Nová žádost
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Vytvořit žádost o výměnu</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="swap-type">Typ výměny</Label>
                <div className="grid grid-cols-3 gap-2 mt-2">
                  {(['exchange', 'cover', 'trade'] as const).map((type) => (
                    <Button
                      key={type}
                      variant={newSwapData.swap_type === type ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setNewSwapData(prev => ({ ...prev, swap_type: type }))}
                    >
                      {getSwapTypeIcon(type)}
                    </Button>
                  ))}
                </div>
              </div>
              
              <div>
                <Label htmlFor="reason">Důvod výměny</Label>
                <Textarea
                  id="reason"
                  value={newSwapData.reason}
                  onChange={(e) => setNewSwapData(prev => ({ ...prev, reason: e.target.value }))}
                  placeholder="Uveďte důvod žádosti o výměnu..."
                  className="mt-2"
                />
              </div>
              
              <div className="flex gap-2 pt-4">
                <Button 
                  onClick={createSwapRequest}
                  disabled={isLoading || !newSwapData.reason.trim()}
                  className="flex-1"
                >
                  Odeslat žádost
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => setShowCreateDialog(false)}
                  className="flex-1"
                >
                  Zrušit
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Swap Requests List */}
      <div className="space-y-4">
        <AnimatePresence>
          {swapRequests.map((swap) => (
            <motion.div
              key={swap.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              <Card className={`${isMyRequest(swap) ? 'border-l-4 border-l-primary' : 'border-l-4 border-l-blue-500'}`}>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-muted rounded-full">
                        {getSwapTypeIcon(swap.swap_type)}
                      </div>
                      <div>
                        <h4 className="font-medium flex items-center gap-2">
                          {isMyRequest(swap) ? 'Moje žádost' : `Žádost od ${getUserName(swap.requester)}`}
                          {getStatusBadge(swap.status)}
                        </h4>
                        <p className="text-sm text-muted-foreground">
                          {new Date(swap.created_at).toLocaleDateString('cs-CZ')}
                        </p>
                      </div>
                    </div>
                  </div>

                  {swap.reason && (
                    <div className="mb-4 p-3 bg-muted/50 rounded-lg">
                      <p className="text-sm">{swap.reason}</p>
                    </div>
                  )}

                  {/* Action Buttons */}
                  {canRespond(swap) && (
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        onClick={() => respondToSwap(swap.id, 'approved')}
                        disabled={isLoading}
                        className="bg-green-600 hover:bg-green-700"
                      >
                        <CheckCircle className="h-4 w-4 mr-1" />
                        Schválit
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => respondToSwap(swap.id, 'rejected')}
                        disabled={isLoading}
                      >
                        <XCircle className="h-4 w-4 mr-1" />
                        Odmítnout
                      </Button>
                    </div>
                  )}

                  {/* Expiry Warning */}
                  {swap.expires_at && swap.status === 'pending' && (
                    <div className="mt-3 text-xs text-muted-foreground">
                      Vyprší: {new Date(swap.expires_at).toLocaleDateString('cs-CZ')}
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </AnimatePresence>

        {swapRequests.length === 0 && (
          <Card>
            <CardContent className="p-8 text-center">
              <ArrowLeftRight className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="font-medium mb-2">Žádné žádosti o výměnu</h3>
              <p className="text-sm text-muted-foreground">
                Zatím nebyly vytvořeny žádné žádosti o výměnu směn
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default ShiftExchangeBoard;