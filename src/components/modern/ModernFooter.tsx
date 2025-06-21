
import React from 'react';
import { Link } from 'react-router-dom';
import { Briefcase, Mail, MessageCircle } from 'lucide-react';
import { useLanguage } from '@/hooks/useLanguage';

export const ModernFooter: React.FC = () => {
  const { t } = useLanguage();
  const currentYear = new Date().getFullYear();

  const footerSections = [
    {
      title: t('features'),
      links: [
        { key: 'dashboard', path: '/dashboard' },
        { key: 'shifts', path: '/shifts' },
        { key: 'vehicle', path: '/vehicle' },
      ]
    },
    {
      title: t('aboutUs'),
      links: [
        { key: 'translator', path: '/translator' },
        { key: 'taxAdvisor', path: '/tax-advisor' },
        { key: 'travel', path: '/travel' },
        { key: 'laws', path: '/laws' },
      ]
    },
    {
      title: t('settings'),
      links: [
        { key: 'premium', path: '/premium' },
        { key: 'profile', path: '/profile' },
        { key: 'settings', path: '/settings' },
      ]
    },
    {
      title: t('contact'),
      links: [
        { key: 'faq', path: '/faq' },
        { key: 'contact', path: '/contact' },
        { key: 'privacy', path: '/privacy' },
        { key: 'terms', path: '/terms' },
      ]
    }
  ];

  return (
    <footer className="bg-card border-t mt-auto">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          <div className="lg:col-span-1">
            <Link to="/" className="flex items-center space-x-2 mb-4">
              <Briefcase className="h-6 w-6 text-primary" />
              <span className="font-bold text-xl">{t('appName') || 'PendlerApp'}</span>
            </Link>
            <p className="text-sm text-muted-foreground mb-4">
              {t('heroSubtitle')}
            </p>
            <div className="flex space-x-4">
              <Link to="/contact" className="text-muted-foreground hover:text-primary transition-colors">
                <Mail className="h-5 w-5" />
              </Link>
              <Link to="/contact" className="text-muted-foreground hover:text-primary transition-colors">
                <MessageCircle className="h-5 w-5" />
              </Link>
            </div>
          </div>

          {footerSections.map((section, index) => (
            <div key={index}>
              <h3 className="font-semibold text-sm uppercase tracking-wider mb-4">
                {section.title}
              </h3>
              <ul className="space-y-2">
                {section.links.map((link, linkIndex) => (
                  <li key={linkIndex}>
                    <Link
                      to={link.path}
                      className="text-sm text-muted-foreground hover:text-primary transition-colors"
                    >
                      {t(link.key)}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-muted-foreground mb-4 md:mb-0">
            © {currentYear} {t('appName') || 'PendlerApp'}. {t('allRightsReserved')}.
          </p>
          <div className="flex space-x-6">
            <Link to="/privacy" className="text-sm text-muted-foreground hover:text-primary transition-colors">
              {t('privacy')}
            </Link>
            <Link to="/terms" className="text-sm text-muted-foreground hover:text-primary transition-colors">
              {t('terms')}
            </Link>
            <Link to="/cookies" className="text-sm text-muted-foreground hover:text-primary transition-colors">
              {t('cookies')}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
