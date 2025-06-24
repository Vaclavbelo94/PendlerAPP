
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { 
  Home, 
  Calendar, 
  Calculator,
  Car,
  User,
  Settings,
  HelpCircle,
  ChevronLeft,
  ChevronRight,
  Book,
  Plane,
  Languages,
  BarChart3
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/hooks/useAuth';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';

const ModernSidebar: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();
  const { user } = useAuth();
  const { t } = useTranslation('navigation');

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
    <div className={cn(
      "fixed left-0 top-0 z-30 h-full bg-card border-r border-border transition-all duration-300",
      collapsed ? "w-16" : "w-64"
    )}>
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className={cn(
          "flex items-center justify-between p-4 border-b border-border",
          collapsed && "justify-center"
        )}>
          <AnimatePresence>
            {!collapsed && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="flex items-center gap-2"
              >
                <div className="bg-primary text-primary-foreground p-2 rounded-lg">
                  <span className="font-bold">WA</span>
                </div>
                <span className="text-lg font-bold">{t('workAssistant')}</span>
              </motion.div>
            )}
          </AnimatePresence>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setCollapsed(!collapsed)}
            className="h-8 w-8 p-0"
          >
            {collapsed ? (
              <ChevronRight className="h-4 w-4" />
            ) : (
              <ChevronLeft className="h-4 w-4" />
            )}
          </Button>
        </div>

        {/* Navigation */}
        <ScrollArea className="flex-1 px-3 py-4">
          <div className="space-y-6">
            {navigationItems.map((section) => (
              <div key={section.title}>
                <AnimatePresence>
                  {!collapsed && (
                    <motion.h3
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="px-3 mb-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider"
                    >
                      {section.title}
                    </motion.h3>
                  )}
                </AnimatePresence>
                
                <div className="space-y-1">
                  {section.items.map((item) => (
                    <Button
                      key={item.href}
                      variant={item.isActive ? "secondary" : "ghost"}
                      size="sm"
                      asChild
                      className={cn(
                        "w-full justify-start gap-3 h-9",
                        collapsed && "px-2 justify-center",
                        item.isActive && "bg-primary/10 text-primary hover:bg-primary/15"
                      )}
                    >
                      <Link to={item.href}>
                        <item.icon className="h-4 w-4 flex-shrink-0" />
                        <AnimatePresence>
                          {!collapsed && (
                            <motion.div
                              initial={{ opacity: 0, x: -10 }}
                              animate={{ opacity: 1, x: 0 }}
                              exit={{ opacity: 0, x: -10 }}
                              className="flex items-center justify-between flex-1 min-w-0"
                            >
                              <span className="truncate">{item.label}</span>
                              {item.badge && (
                                <Badge variant="secondary" className="h-5 text-xs">
                                  {item.badge}
                                </Badge>
                              )}
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </Link>
                    </Button>
                  ))}
                </div>
                
                {section.title !== t('account') && <Separator className="my-4" />}
              </div>
            ))}
          </div>
        </ScrollArea>

        {/* User Section */}
        <div className="p-4 border-t border-border">
          <AnimatePresence>
            {!collapsed ? (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="flex items-center gap-3 p-2 rounded-lg bg-muted/50"
              >
                <div className="bg-primary text-primary-foreground p-2 rounded-full">
                  <User className="h-4 w-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">
                    {user?.email?.split('@')[0] || t('user')}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {t('freeAccount')}
                  </p>
                </div>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex justify-center"
              >
                <div className="bg-primary text-primary-foreground p-2 rounded-full">
                  <User className="h-4 w-4" />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default ModernSidebar;
