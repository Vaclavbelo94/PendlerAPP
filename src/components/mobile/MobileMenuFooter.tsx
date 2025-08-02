import React from 'react';

interface UserInfo {
  email: string;
  role: string;
  company?: string;
  isPremium: boolean;
  isAdmin: boolean;
}

interface MobileMenuFooterProps {
  userInfo: UserInfo | null;
}

export const MobileMenuFooter: React.FC<MobileMenuFooterProps> = ({
  userInfo
}) => {
  return (
    <div className="border-t p-4 bg-muted/5">
      <div className="flex items-center justify-between text-sm text-muted-foreground">
        <span>PendlerApp v2.0</span>
        {userInfo?.company && (
          <span className="font-medium">{userInfo.company.toUpperCase()}</span>
        )}
      </div>
      <div className="text-xs text-muted-foreground mt-1">
        © 2024 PendlerApp. Všechna práva vyhrazena.
      </div>
    </div>
  );
};