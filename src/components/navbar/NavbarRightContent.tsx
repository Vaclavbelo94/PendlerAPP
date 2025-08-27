import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Bell, User } from 'lucide-react';
import { useAuth } from '@/hooks/auth';
import LanguageSwitcherCompact from '@/components/ui/LanguageSwitcherCompact';
import { Link } from 'react-router-dom';

export const NavbarRightContent: React.FC = () => {
  const { user } = useAuth();

  return (
    <div className="flex items-center space-x-2">
      {/* Language Switcher */}
      <LanguageSwitcherCompact />
      
      {/* Notifications */}
      {user && (
        <div className="relative">
          <Button 
            variant="ghost" 
            size="sm" 
            className="h-8 w-8 p-0 relative"
            onClick={() => {
              // TODO: Implement notification dropdown
              console.log('Notifications clicked');
            }}
          >
            <Bell className="h-4 w-4" />
            {/* Notification badge - can be made dynamic later */}
            <Badge 
              variant="destructive" 
              className="absolute -top-1 -right-1 h-4 w-4 text-xs p-0 flex items-center justify-center pointer-events-none"
            >
              3
            </Badge>
          </Button>
        </div>
      )}
      
      {/* Profile Button */}
      {user && (
        <Link to="/profile">
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
            <User className="h-4 w-4" />
          </Button>
        </Link>
      )}
    </div>
  );
};