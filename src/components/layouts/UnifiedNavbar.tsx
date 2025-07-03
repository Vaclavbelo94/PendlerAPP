
import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/hooks/auth';
import { LanguageSwitcher } from '@/components/i18n/LanguageSwitcher';

interface UnifiedNavbarProps {
  rightContent?: React.ReactNode;
}

const UnifiedNavbar: React.FC<UnifiedNavbarProps> = ({ rightContent }) => {
  const { user } = useAuth();

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center space-x-2">
          <div className="flex items-center space-x-2">
            <div className="h-8 w-8 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center">
              <span className="text-white font-bold text-sm">PA</span>
            </div>
            <span className="hidden font-bold sm:inline-block">PendlerApp</span>
          </div>
        </Link>

        {/* Right Side */}
        <div className="flex items-center space-x-2">
          <LanguageSwitcher />
          {rightContent}
        </div>
      </div>
    </nav>
  );
};

export default UnifiedNavbar;
