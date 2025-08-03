import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { 
  Settings, User, Palette, Bell, Globe, Shield, 
  Zap, Database, Smartphone, Cog, Wifi, 
  Calendar, Mail, MessageSquare, Key, Eye,
  FileText, Download, BarChart3, Clock,
  Briefcase, Car, Home
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { SettingItem } from './ModernSettingsContainer';

interface ModernSettingsGridProps {
  searchQuery: string;
  onSettingSelect: (settingId: string) => void;
}

const ModernSettingsGrid: React.FC<ModernSettingsGridProps> = ({
  searchQuery,
  onSettingSelect
}) => {
  const { t } = useTranslation('settings');

  const settingItems: SettingItem[] = useMemo(() => [
    // Základní kategorie
    {
      id: 'general',
      title: t('general'),
      description: t('basicSettings'),
      icon: Settings,
      category: 'basic',
      color: 'hsl(var(--primary))',
    },
    {
      id: 'account',
      title: t('account'),
      description: t('accountInfo'),
      icon: User,
      category: 'basic',
      color: 'hsl(var(--primary))',
    },
    {
      id: 'appearance',
      title: t('appearance'),
      description: t('display'),
      icon: Palette,
      category: 'basic',
      color: 'hsl(var(--primary))',
    },
    {
      id: 'notifications',
      title: t('notifications'),
      description: t('shiftNotifications'),
      icon: Bell,
      category: 'basic',
      color: 'hsl(var(--primary))',
      badge: 'Nové'
    },
    {
      id: 'language',
      title: t('language'),
      description: t('languageSettings'),
      icon: Globe,
      category: 'basic',
      color: 'hsl(var(--primary))',
    },

    // Pokročilé funkce
    {
      id: 'shifts',
      title: t('shifts'),
      description: 'Správa směn a generování',
      icon: Calendar,
      category: 'work',
      color: 'hsl(var(--chart-1))',
    },
    {
      id: 'automation',
      title: t('automation'),
      description: t('workAutomation'),
      icon: Zap,
      category: 'work',
      color: 'hsl(var(--chart-2))',
      badge: 'Pro'
    },
    {
      id: 'reports',
      title: t('reports'),
      description: 'E-mailové a týdenní reporty',
      icon: FileText,
      category: 'work',
      color: 'hsl(var(--chart-3))',
    },

    // Data a synchronizace
    {
      id: 'data',
      title: t('data'),
      description: t('dataManagement'),
      icon: Database,
      category: 'data',
      color: 'hsl(var(--chart-4))',
    },
    {
      id: 'sync',
      title: t('synchronization'),
      description: t('manageSyncBetweenDevices'),
      icon: Wifi,
      category: 'data',
      color: 'hsl(var(--chart-5))',
    },
    {
      id: 'export',
      title: t('dataExport'),
      description: 'Export dat a zálohování',
      icon: Download,
      category: 'data',
      color: 'hsl(var(--muted-foreground))',
    },

    // Bezpečnost
    {
      id: 'security',
      title: t('security'),
      description: t('biometricLogin') + ', 2FA',
      icon: Shield,
      category: 'security',
      color: 'hsl(var(--destructive))',
    },
    {
      id: 'privacy',
      title: t('privacy'),
      description: 'Ochrana soukromí a dat',
      icon: Eye,
      category: 'security',
      color: 'hsl(var(--destructive))',
    },
    {
      id: 'sessions',
      title: 'Relace',
      description: t('loginHistory'),
      icon: Key,
      category: 'security',
      color: 'hsl(var(--destructive))',
    },

    // Systém a zařízení
    {
      id: 'device',
      title: t('device'),
      description: 'Nastavení zařízení a cache',
      icon: Smartphone,
      category: 'system',
      color: 'hsl(var(--muted-foreground))',
    },
    {
      id: 'advanced',
      title: t('advanced'),
      description: t('developerOptions'),
      icon: Cog,
      category: 'system',
      color: 'hsl(var(--muted-foreground))',
    },
    {
      id: 'analytics',
      title: t('analytics'),
      description: 'Statistiky a crash reporty',
      icon: BarChart3,
      category: 'system',
      color: 'hsl(var(--muted-foreground))',
    }
  ], [t]);

  const filteredItems = useMemo(() => {
    if (!searchQuery) return settingItems;
    
    const query = searchQuery.toLowerCase();
    return settingItems.filter(item => 
      item.title.toLowerCase().includes(query) ||
      item.description.toLowerCase().includes(query) ||
      item.category.toLowerCase().includes(query)
    );
  }, [settingItems, searchQuery]);

  const categories = useMemo(() => {
    const cats = Array.from(new Set(filteredItems.map(item => item.category)));
    return cats.map(cat => ({
      id: cat,
      title: cat === 'basic' ? 'Základní' :
             cat === 'work' ? 'Práce' :
             cat === 'data' ? 'Data' :
             cat === 'security' ? 'Bezpečnost' :
             cat === 'system' ? 'Systém' : cat,
      items: filteredItems.filter(item => item.category === cat)
    }));
  }, [filteredItems]);

  return (
    <div className="p-4 space-y-6 overflow-y-auto h-full">
      {categories.map((category, categoryIndex) => (
        <motion.div
          key={category.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: categoryIndex * 0.1 }}
        >
          <h3 className="text-lg font-semibold mb-3 text-foreground/80">
            {category.title}
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {category.items.map((item, itemIndex) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ 
                  duration: 0.3, 
                  delay: categoryIndex * 0.1 + itemIndex * 0.05 
                }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Card
                  className="p-4 cursor-pointer hover:shadow-lg transition-all duration-200 border-border/50 bg-card/50 backdrop-blur-sm group relative overflow-hidden"
                  onClick={() => onSettingSelect(item.id)}
                >
                  {/* Background gradient */}
                  <div 
                    className="absolute inset-0 opacity-5 group-hover:opacity-10 transition-opacity"
                    style={{ 
                      background: `linear-gradient(135deg, ${item.color}, transparent)` 
                    }}
                  />
                  
                  <div className="relative z-10">
                    <div className="flex items-start justify-between mb-3">
                      <div 
                        className="p-2 rounded-lg"
                        style={{ 
                          backgroundColor: `${item.color}15`,
                          border: `1px solid ${item.color}25`
                        }}
                      >
                        <item.icon 
                          className="h-5 w-5" 
                          style={{ color: item.color }}
                        />
                      </div>
                      
                      {item.badge && (
                        <Badge 
                          variant="secondary" 
                          className="text-xs bg-primary/10 text-primary border-primary/20"
                        >
                          {item.badge}
                        </Badge>
                      )}
                    </div>
                    
                    <h4 className="font-semibold text-foreground mb-1">
                      {item.title}
                    </h4>
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {item.description}
                    </p>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>
      ))}
      
      {filteredItems.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-12"
        >
          <p className="text-muted-foreground">
            Žádné nastavení nenalezeno pro "{searchQuery}"
          </p>
        </motion.div>
      )}
    </div>
  );
};

export default ModernSettingsGrid;