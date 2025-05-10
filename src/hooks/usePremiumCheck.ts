
import { useState, useEffect } from 'react';

interface PremiumFeature {
  id: string;
  name: string;
  description: string;
  isEnabled: boolean;
  key: string;
}

export const usePremiumCheck = (featureKey: string) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isPremiumFeature, setIsPremiumFeature] = useState(false);
  const [userHasPremium, setUserHasPremium] = useState(false);
  const [canAccess, setCanAccess] = useState(false);

  useEffect(() => {
    const checkPremiumAccess = () => {
      setIsLoading(true);
      try {
        // 1. Načtení informací o premium funkcích
        const premiumFeatures: PremiumFeature[] = JSON.parse(
          localStorage.getItem('premiumFeatures') || '[]'
        );
        
        // 2. Zjištění, zda je daná funkce označena jako premium
        const feature = premiumFeatures.find(f => f.key === featureKey);
        const isPremium = feature ? feature.isEnabled : false;
        setIsPremiumFeature(isPremium);
        
        // 3. Zjištění, zda je uživatel přihlášen
        const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
        
        // 4. Pokud je uživatel přihlášen, zjistíme, zda má premium
        let hasPremium = false;
        if (isLoggedIn) {
          // Načtení seznamu uživatelů
          const users = JSON.parse(localStorage.getItem('users') || '[]');
          
          // Načtení aktuálně přihlášeného uživatele
          const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
          
          // Najdeme uživatele podle emailu
          const user = users.find((u: any) => u.email === currentUser.email);
          
          // Zkontrolujeme, zda má uživatel premium
          if (user && user.isPremium) {
            hasPremium = true;
          }
        }
        
        setUserHasPremium(hasPremium);
        
        // 5. Uživatel může přistupovat k funkci, pokud:
        // - funkce není prémiová NEBO
        // - uživatel má premium
        setCanAccess(!isPremium || hasPremium);
        
      } catch (error) {
        console.error('Chyba při kontrole premium přístupu:', error);
        // V případě chyby dáme uživateli přístup (failsafe)
        setCanAccess(true);
      } finally {
        setIsLoading(false);
      }
    };

    checkPremiumAccess();
    
    // Přidáme event listener pro změny v localStorage
    const handleStorageChange = (e: StorageEvent) => {
      if (
        e.key === 'premiumFeatures' || 
        e.key === 'users' || 
        e.key === 'isLoggedIn' || 
        e.key === 'currentUser'
      ) {
        checkPremiumAccess();
      }
    };
    
    window.addEventListener('storage', handleStorageChange);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [featureKey]);

  return { isLoading, isPremiumFeature, userHasPremium, canAccess };
};
