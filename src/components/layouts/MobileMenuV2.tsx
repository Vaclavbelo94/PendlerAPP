import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { useCompanyMenuItems } from '@/hooks/useCompanyMenuItems';
import { useCompany } from '@/hooks/useCompany';
import * as Icons from 'lucide-react';

interface MobileMenuV2Props {
  isOpen: boolean;
  onClose: () => void;
  variant?: 'overlay' | 'compact';
}

export const MobileMenuV2: React.FC<MobileMenuV2Props> = ({
  isOpen,
  onClose,
  variant = 'overlay'
}) => {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation('navigation');
  const { localizedMenuItems, isLoading } = useCompanyMenuItems();
  const { company } = useCompany();

  // Disable body scroll when menu is open and handle escape key
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      document.body.style.touchAction = 'none';
      
      const handleEscape = (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
          onClose();
        }
      };
      
      document.addEventListener('keydown', handleEscape);
      
      return () => {
        document.removeEventListener('keydown', handleEscape);
        document.body.style.overflow = '';
        document.body.style.touchAction = '';
      };
    } else {
      document.body.style.overflow = '';
      document.body.style.touchAction = '';
    }
  }, [isOpen, onClose]);

  const handleNavigation = (href: string) => {
    navigate(href);
    onClose();
  };

  const getCurrentTitle = (item: any): string => {
    switch (i18n.language) {
      case 'de':
        return item.title_de || item.title_cs;
      case 'pl':
        return item.title_pl || item.title_cs;
      default:
        return item.title_cs;
    }
  };

  const getCurrentDescription = (item: any): string | null => {
    switch (i18n.language) {
      case 'de':
        return item.description_de || item.description_cs;
      case 'pl':
        return item.description_pl || item.description_cs;
      default:
        return item.description_cs;
    }
  };

  const getIcon = (iconName: string) => {
    const IconComponent = (Icons as any)[iconName];
    return IconComponent ? IconComponent : Icons.Circle;
  };

  // Group items into pairs for 2x2 grid
  const getGroupedItems = () => {
    const pairs = [];
    for (let i = 0; i < localizedMenuItems.length; i += 2) {
      pairs.push(localizedMenuItems.slice(i, i + 2));
    }
    return pairs;
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      {variant === 'overlay' && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Mobile Menu */}
      <div className={cn(
        "fixed inset-0 z-50 lg:hidden bg-background",
        variant === 'compact' ? "w-80" : "w-full"
      )}>
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b">
            <div className="flex items-center gap-3">
              <h2 className="text-lg font-semibold">
                {company ? `${company.toUpperCase()} Menu` : 'Menu'}
              </h2>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
            >
              <X className="h-5 w-5" />
            </Button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-4">
            {isLoading ? (
              <div className="flex items-center justify-center h-32">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              </div>
            ) : localizedMenuItems.length > 0 ? (
              <div className="space-y-4">
                <h3 className="text-sm font-medium text-muted-foreground mb-4">
                  {t('company_sections', `Firemní sekce ${company?.toUpperCase()}`)}
                </h3>
                
                {/* 2x2 Grid Layout */}
                <div className="space-y-3">
                  {getGroupedItems().map((pair, pairIndex) => (
                    <div key={pairIndex} className="grid grid-cols-2 gap-3">
                      {pair.map((item) => {
                        const IconComponent = getIcon(item.icon);
                        const title = getCurrentTitle(item);
                        const description = getCurrentDescription(item);
                        
                        return (
                          <button
                            key={item.id}
                            onClick={() => handleNavigation(item.route)}
                            className="p-4 rounded-lg border bg-card hover:bg-accent hover:text-accent-foreground transition-colors text-left group"
                          >
                            <div className="flex flex-col items-center text-center space-y-2">
                              <div className="p-3 rounded-full bg-primary/10 group-hover:bg-primary/20 transition-colors">
                                <IconComponent className="h-6 w-6 text-primary" />
                              </div>
                              <div>
                                <h4 className="font-medium text-sm leading-tight">{title}</h4>
                                {description && (
                                  <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                                    {description}
                                  </p>
                                )}
                              </div>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="text-center text-muted-foreground py-8">
                <p>Žádné menu položky nejsou dostupné</p>
                <p className="text-sm mt-2">
                  {company ? `Pro firmu ${company.toUpperCase()}` : 'Nejste přiřazeni k žádné firmě'}
                </p>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="border-t p-4">
            <div className="flex items-center justify-between text-sm text-muted-foreground">
              <span>PendlerApp v2.0</span>
              {company && (
                <span className="font-medium">{company.toUpperCase()}</span>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};