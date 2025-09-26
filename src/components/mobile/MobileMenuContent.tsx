import React from 'react';
import { useTranslation } from 'react-i18next';
import { 
  Globe, 
  FileText, 
  Scale, 
  Home,
  BarChart3,
  Calendar,
  Car,
  User,
  Settings,
  House,
  CreditCard,
  Mail,
  HelpCircle,
  ChevronRight
} from 'lucide-react';

interface MobileMenuContentProps {
  onNavigate: (href: string) => void;
}

export const MobileMenuContent: React.FC<MobileMenuContentProps> = ({
  onNavigate
}) => {
  const { t } = useTranslation('navigation');

  // Define menu structure with categories
  const menuCategories = [
    {
      title: t('categories.premium'),
      items: [
        { id: 'translator', icon: Globe, label: t('translator'), route: '/translator' },
        { id: 'taxAdvisor', icon: FileText, label: t('taxAdvisor'), route: '/tax-advisor' },
        { id: 'laws', icon: Scale, label: t('laws'), route: '/laws' },
      ]
    },
    {
      title: t('categories.apps'),
      items: [
        { id: 'dashboard', icon: BarChart3, label: t('dashboard'), route: '/dashboard' },
        { id: 'shifts', icon: Calendar, label: t('shifts'), route: '/shifts' },
        { id: 'travel', icon: Car, label: t('travel'), route: '/travel' },
        { id: 'settings', icon: Settings, label: t('settings'), route: '/settings' },
      ]
    },
    {
      title: t('categories.general'),
      items: [
        { id: 'home', icon: House, label: t('home'), route: '/' },
        { id: 'pricing', icon: CreditCard, label: t('pricing'), route: '/pricing' },
        { id: 'contact', icon: Mail, label: t('contact'), route: '/contact' },
        { id: 'faq', icon: HelpCircle, label: t('faq'), route: '/faq' },
      ]
    }
  ];

  return (
    <div className="py-2">
      {menuCategories.map((category, categoryIndex) => (
        <div key={categoryIndex} className="mb-6">
          {/* Category Header */}
          <div className="px-4 py-2">
            <h3 className="text-base font-semibold text-foreground">
              {category.title}
            </h3>
          </div>
          
          {/* Category Items */}
          <div className="px-2">
            {category.items.map((item) => {
              const IconComponent = item.icon;
              
              return (
                <button
                  key={item.id}
                  onClick={() => onNavigate(item.route)}
                  className="w-full flex items-center justify-between px-3 py-3 mx-1 rounded-lg hover:bg-accent/50 transition-colors group"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex-shrink-0">
                      <IconComponent className="h-5 w-5 text-red-500" />
                    </div>
                    <span className="text-sm font-medium text-foreground">
                      {item.label}
                    </span>
                  </div>
                  <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-foreground transition-colors" />
                </button>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
};