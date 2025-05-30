
import React from 'react';
import { useAuth } from '@/hooks/useAuth';
import PremiumFeatureAlert from '@/components/PremiumFeatureAlert';

interface PublicPageWithPremiumCheckProps {
  children: React.ReactNode;
  featureName: string;
  description?: string;
  allowPublicAccess?: boolean;
}

const PublicPageWithPremiumCheck: React.FC<PublicPageWithPremiumCheckProps> = ({
  children,
  featureName,
  description,
  allowPublicAccess = false
}) => {
  const { user, isPremium, isAdmin } = useAuth();

  // Allow access if:
  // 1. Public access is allowed, OR
  // 2. User has premium, OR
  // 3. User is admin
  const hasAccess = allowPublicAccess || isPremium || isAdmin;

  if (!hasAccess) {
    return (
      <div className="container py-8 max-w-4xl">
        <PremiumFeatureAlert
          featureName={featureName}
          description={description || `Funkce ${featureName} je dostupná pouze pro Premium uživatele.`}
        />
      </div>
    );
  }

  return <>{children}</>;
};

export default PublicPageWithPremiumCheck;
