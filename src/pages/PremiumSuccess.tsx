
import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { CheckCircle, Crown, ArrowRight } from 'lucide-react';
import { useStripePayments } from '@/hooks/useStripePayments';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';

const PremiumSuccess = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const sessionId = searchParams.get('session_id');
  const { checkSubscriptionStatus, isCheckingSubscription } = useStripePayments();
  const { user, refreshPremiumStatus } = useAuth();
  const [verificationComplete, setVerificationComplete] = useState(false);

  useEffect(() => {
    if (sessionId && user) {
      // Wait a moment for Stripe to process, then check subscription
      const timer = setTimeout(async () => {
        try {
          const result = await checkSubscriptionStatus();
          if (result?.subscribed) {
            toast.success('Premium předplatné bylo úspěšně aktivováno!');
            await refreshPremiumStatus();
          }
          setVerificationComplete(true);
        } catch (error) {
          console.error('Error verifying subscription:', error);
          setVerificationComplete(true);
        }
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [sessionId, user, checkSubscriptionStatus, refreshPremiumStatus]);

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
            {isCheckingSubscription || !verificationComplete ? (
              <Alert>
                <Crown className="h-4 w-4" />
                <AlertDescription>
                  Ověřujeme vaše předplatné... Prosím chvilku strpení.
                </AlertDescription>
              </Alert>
            ) : (
              <Alert className="border-green-500/20 bg-green-50 dark:bg-green-900/10">
                <Crown className="h-4 w-4 text-green-600" />
                <AlertDescription className="text-green-800 dark:text-green-200">
                  <strong>Premium funkce jsou nyní aktivní!</strong>
                  <br />
                  Máte nyní přístup ke všem premium funkcím aplikace.
                </AlertDescription>
              </Alert>
            )}

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
                disabled={isCheckingSubscription}
              >
                <ArrowRight className="w-4 h-4 mr-2" />
                Pokračovat do aplikace
              </Button>
              <Button 
                variant="outline" 
                onClick={handleViewPremium}
                disabled={isCheckingSubscription}
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
