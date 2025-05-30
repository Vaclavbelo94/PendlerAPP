
import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { CheckCircle, Crown, ArrowRight, RefreshCw } from 'lucide-react';
import { useStripePayments } from '@/hooks/useStripePayments';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';

const PremiumSuccess = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const sessionId = searchParams.get('session_id');
  const { checkSubscriptionStatus, isCheckingSubscription } = useStripePayments();
  const { user, refreshPremiumStatus, isPremium } = useAuth();
  const [verificationStatus, setVerificationStatus] = useState<'checking' | 'success' | 'failed' | 'timeout'>('checking');
  const [retryCount, setRetryCount] = useState(0);
  const [isManualRefresh, setIsManualRefresh] = useState(false);

  const MAX_RETRIES = 10;
  const INITIAL_DELAY = 3000; // Start with 3 seconds
  const RETRY_INTERVAL = 2000; // Then check every 2 seconds

  const verifySubscription = async (attempt = 1, isManual = false) => {
    console.log(`Verification attempt ${attempt}, manual: ${isManual}`);
    
    try {
      if (isManual) {
        setIsManualRefresh(true);
      }

      // First check Stripe subscription status
      const stripeResult = await checkSubscriptionStatus();
      console.log('Stripe result:', stripeResult);
      
      if (stripeResult?.subscribed) {
        // Then refresh auth premium status
        const authResult = await refreshPremiumStatus();
        console.log('Auth refresh result:', authResult);
        
        if (authResult?.isPremium) {
          console.log('Premium status successfully verified');
          setVerificationStatus('success');
          toast.success('Premium předplatné bylo úspěšně aktivováno!');
          return true;
        }
      }

      // If not successful and we have more retries
      if (attempt < MAX_RETRIES && !isManual) {
        console.log(`Verification failed, retrying in ${RETRY_INTERVAL}ms...`);
        setRetryCount(attempt);
        setTimeout(() => verifySubscription(attempt + 1), RETRY_INTERVAL);
      } else if (!isManual) {
        console.log('Max retries reached, verification failed');
        setVerificationStatus('timeout');
        toast.error('Ověření předplatného trvá déle než obvykle. Zkuste ruční obnovení.');
      }
      
      return false;
    } catch (error) {
      console.error('Error verifying subscription:', error);
      if (attempt >= MAX_RETRIES || isManual) {
        setVerificationStatus('failed');
        toast.error('Chyba při ověřování předplatného. Zkuste to znovu.');
      } else {
        setTimeout(() => verifySubscription(attempt + 1), RETRY_INTERVAL);
      }
      return false;
    } finally {
      if (isManual) {
        setIsManualRefresh(false);
      }
    }
  };

  useEffect(() => {
    if (sessionId && user) {
      console.log('Starting premium verification process...');
      // Wait initial delay for Stripe to process, then start verification
      setTimeout(() => {
        verifySubscription(1);
      }, INITIAL_DELAY);
    } else if (!sessionId) {
      setVerificationStatus('failed');
    }
  }, [sessionId, user]);

  // Check if premium status changed in auth context
  useEffect(() => {
    if (isPremium && verificationStatus === 'checking') {
      console.log('Premium detected in auth context');
      setVerificationStatus('success');
      toast.success('Premium předplatné bylo úspěšně aktivováno!');
    }
  }, [isPremium, verificationStatus]);

  const handleManualRefresh = () => {
    setVerificationStatus('checking');
    setRetryCount(0);
    verifySubscription(1, true);
  };

  const handleContinue = () => {
    navigate('/dashboard');
  };

  const handleViewPremium = () => {
    navigate('/premium');
  };

  if (!sessionId) {
    return (
      <div className="container py-8 max-w-2xl">
        <Alert variant="destructive">
          <AlertDescription>
            Neplatný odkaz. Prosím vraťte se na stránku premium funkcí.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  const renderVerificationStatus = () => {
    switch (verificationStatus) {
      case 'checking':
        return (
          <Alert>
            <Crown className="h-4 w-4" />
            <AlertDescription>
              <div className="flex flex-col space-y-2">
                <span>Ověřujeme vaše předplatné... ({retryCount}/{MAX_RETRIES})</span>
                <div className="text-xs text-muted-foreground">
                  Prosím chvilku strpení, synchronizujeme data se Stripe.
                </div>
                {retryCount > 5 && (
                  <Button 
                    size="sm" 
                    variant="outline" 
                    onClick={handleManualRefresh}
                    disabled={isManualRefresh || isCheckingSubscription}
                  >
                    <RefreshCw className={`w-3 h-3 mr-1 ${isManualRefresh ? 'animate-spin' : ''}`} />
                    Zkusit znovu
                  </Button>
                )}
              </div>
            </AlertDescription>
          </Alert>
        );
      
      case 'success':
        return (
          <Alert className="border-green-500/20 bg-green-50 dark:bg-green-900/10">
            <Crown className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-800 dark:text-green-200">
              <strong>Premium funkce jsou nyní aktivní!</strong>
              <br />
              Máte nyní přístup ke všem premium funkcím aplikace.
            </AlertDescription>
          </Alert>
        );
      
      case 'timeout':
        return (
          <Alert className="border-yellow-500/20 bg-yellow-50 dark:bg-yellow-900/10">
            <Crown className="h-4 w-4 text-yellow-600" />
            <AlertDescription className="text-yellow-800 dark:text-yellow-200">
              <div className="flex flex-col space-y-3">
                <div>
                  <strong>Ověření trvá déle než obvykle</strong>
                  <br />
                  Platba byla úspěšná, ale aktivace premium funkcí může trvat několik minut.
                </div>
                <Button 
                  size="sm" 
                  variant="outline" 
                  onClick={handleManualRefresh}
                  disabled={isManualRefresh || isCheckingSubscription}
                >
                  <RefreshCw className={`w-3 h-3 mr-1 ${isManualRefresh ? 'animate-spin' : ''}`} />
                  Zkusit znovu
                </Button>
              </div>
            </AlertDescription>
          </Alert>
        );
      
      case 'failed':
        return (
          <Alert variant="destructive">
            <Crown className="h-4 w-4" />
            <AlertDescription>
              <div className="flex flex-col space-y-3">
                <div>
                  <strong>Problém s ověřením předplatného</strong>
                  <br />
                  Platba byla úspěšná, ale nastala chyba při aktivaci. Zkuste obnovit stránku.
                </div>
                <Button 
                  size="sm" 
                  variant="outline" 
                  onClick={handleManualRefresh}
                  disabled={isManualRefresh || isCheckingSubscription}
                >
                  <RefreshCw className={`w-3 h-3 mr-1 ${isManualRefresh ? 'animate-spin' : ''}`} />
                  Zkusit znovu
                </Button>
              </div>
            </AlertDescription>
          </Alert>
        );
      
      default:
        return null;
    }
  };

  return (
    <div className="container py-8 max-w-2xl">
      <div className="space-y-6">
        <Card className="text-center">
          <CardHeader>
            <div className="mx-auto mb-4">
              <CheckCircle className="h-16 w-16 text-green-500" />
            </div>
            <CardTitle className="text-2xl">Platba byla úspěšná!</CardTitle>
            <CardDescription>
              Děkujeme za nákup premium předplatného
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {renderVerificationStatus()}

            <div className="space-y-2">
              <h3 className="font-semibold">Co máte nyní k dispozici:</h3>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Neomezený překladač</li>
                <li>• Pokročilé kalkulačky</li>
                <li>• Neomezený počet slovíček</li>
                <li>• Offline přístup ke slovíčkům</li>
                <li>• Pokročilé grafy a statistiky</li>
                <li>• Přednostní podpora</li>
              </ul>
            </div>

            <div className="flex gap-3 pt-4">
              <Button 
                onClick={handleContinue}
                className="flex-1"
                disabled={isCheckingSubscription || isManualRefresh}
              >
                <ArrowRight className="w-4 h-4 mr-2" />
                Pokračovat do aplikace
              </Button>
              <Button 
                variant="outline" 
                onClick={handleViewPremium}
                disabled={isCheckingSubscription || isManualRefresh}
              >
                Zobrazit premium
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Správa předplatného</CardTitle>
            <CardDescription>
              Své předplatné můžete kdykoliv spravovat na stránce premium funkcí.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Pokud máte jakékoliv otázky nebo problémy s předplatným, 
              neváhejte nás kontaktovat na naší podpoře.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PremiumSuccess;
