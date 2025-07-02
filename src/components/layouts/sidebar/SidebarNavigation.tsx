
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Home, 
  Calendar, 
  Calculator,
  Car,
  User,
  Settings,
  HelpCircle,
  Book,
  Plane,
  Languages,
  BarChart3
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';

interface SidebarNavigationProps {
  collapsed: boolean;
}

const SidebarNavigation: React.FC<SidebarNavigationProps> = ({ collapsed }) => {
  const location = useLocation();
  const { t } = useTranslation('common');

  const navigationItems = [
    {
      title: t('main'),
      items: [
        {
          icon: Home,
          label: t('dashboard'),
          href: '/dashboard',
          isActive: location.pathname === '/dashboard'
        },
        {
          icon: Calendar,
          label: t('shifts'),
          href: '/shifts',
          isActive: location.pathname === '/shifts',
          badge: '2'
        },
        {
          icon: BarChart3,
          label: t('analytics'),
          href: '/analytics',
          isActive: location.pathname === '/analytics'
        }
      ]
    },
    {
      title: t('tools'),
      items: [
        {
          icon: Calculator,
          label: t('taxAdvisor'),
          href: '/tax-advisor',
          isActive: location.pathname === '/tax-advisor'
        },
        {
          icon: Car,
          label: t('vehicle'),
          href: '/vehicle',
          isActive: location.pathname === '/vehicle'
        },
        {
          icon: Plane,
          label: t('travel'),
          href: '/travel',
          isActive: location.pathname === '/travel'
        },
        {
          icon: Languages,
          label: t('translator'),
          href: '/translator',
          isActive: location.pathname === '/translator'
        },
        {
          icon: Book,
          label: t('laws'),
          href: '/laws',
          isActive: location.pathname === '/laws'
        }
      ]
    },
    {
      title: t('account'),
      items: [
        {
          icon: User,
          label: t('profile'),
          href: '/profile',
          isActive: location.pathname === '/profile'
        },
        {
          icon: Settings,
          label: t('settings'),
          href: '/settings',
          isActive: location.pathname === '/settings'
        },
        {
          icon: HelpCircle,
          label: t('help'),
          href: '/help',
          isActive: location.pathname === '/help'
        }
      ]
    }
  ];

  return (
    <div className="space-y-6">
      {navigationItems.map((section, sectionIndex) => (
        <motion.div
          key={section.title}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: sectionIndex * 0.1 }}
        >
          {!collapsed && (
            <h3 className="px-3 mb-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              {section.title}
            </h3>
          )}
          
          <div className="space-y-1">
            {section.items.map((item, itemIndex) => (
              <motion.div
                key={item.href}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: (sectionIndex * 0.1) + (itemIndex * 0.05) }}
              >
                <Button
                  variant={item.isActive ? "secondary" : "ghost"}
                  size="sm"
                  asChild
                  className={cn(
                    "w-full justify-start gap-3 h-9 transition-all duration-200",
                    collapsed && "px-2 justify-center",
                    item.isActive && "bg-primary/10 text-primary hover:bg-primary/15 shadow-sm"
                  )}
                >
                  <Link to={item.href}>
                    <item.icon className="h-4 w-4 flex-shrink-0" />
                    {!collapsed && (
                      <div className="flex items-center justify-between flex-1 min-w-0">
                        <span className="truncate">{item.label}</span>
                        {item.badge && (
                          <Badge variant="secondary" className="h-5 text-xs ml-2">
                            {item.badge}
                          </Badge>
                        )}
                      </div>
                    )}
                  </Link>
                </Button>
              </motion.div>
            ))}
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default SidebarNavigation;
