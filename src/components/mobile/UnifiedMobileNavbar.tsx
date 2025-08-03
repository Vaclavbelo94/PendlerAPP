import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/hooks/auth';
import LanguageSwitcherCompact from '@/components/ui/LanguageSwitcherCompact';
import { UnifiedMobileMenu } from './UnifiedMobileMenu';

interface UnifiedMobileNavbarProps {
  rightContent?: React.ReactNode;
}

export const UnifiedMobileNavbar: React.FC<UnifiedMobileNavbarProps> = ({ 
  rightContent 
}) => {
  const { user, unifiedUser } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <>
      <nav className="sticky top-0 z-[60] w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between px-4">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="flex items-center space-x-2">
              <div className="h-8 w-8 rounded-lg bg-gradient-to-r from-primary to-primary/80 flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-sm">PA</span>
              </div>
              <span className="hidden font-bold sm:inline-block text-foreground">
                PendlerApp
              </span>
            </div>
          </Link>

          {/* Right Side */}
          <div className="flex items-center space-x-2">
            {/* Language Switcher - Hidden on small screens */}
            <div className="hidden sm:block">
              <LanguageSwitcherCompact />
            </div>
            
            {/* Custom Right Content - this includes NotificationIndicator */}
            {rightContent}
            
            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0"
              onClick={() => setIsMobileMenuOpen(true)}
            >
              <Menu className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      <UnifiedMobileMenu 
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
      />
    </>
  );
};