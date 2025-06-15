
import React from 'react';
import { useLanguage } from '@/hooks/useLanguage';
import { LanguageSelector } from './LanguageSelector';
import { Button } from "@/components/ui/button";
import { Link } from 'react-router-dom';

// Do navigace přidáváme pouze ukázku pár položek pro ověření fungování překladu
const NAV_LINKS = [
  { key: 'home', to: '/' },
  { key: 'dashboard', to: '/dashboard' },
  { key: 'shifts', to: '/shifts' },
  { key: 'calculator', to: '/calculator' },
  { key: 'translator', to: '/translator' },
  { key: 'profile', to: '/profile' }
];

export const ModernNavbar: React.FC = () => {
  const { t } = useLanguage();

  return (
    <nav className="flex items-center justify-between bg-background border-b px-4 py-2">
      <div className="flex gap-2 items-center">
        <Link to="/" className="font-bold text-xl text-primary">
          Pendler
        </Link>
        <div className="hidden md:flex gap-2 ml-4">
          {NAV_LINKS.map(link => (
            <Button asChild key={link.key} variant="ghost" size="sm">
              <Link to={link.to}>{t(link.key)}</Link>
            </Button>
          ))}
        </div>
      </div>
      <LanguageSelector />
    </nav>
  );
};
