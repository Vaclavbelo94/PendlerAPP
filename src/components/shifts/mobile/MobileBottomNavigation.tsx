import React from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Clock, Download } from 'lucide-react';
import { useCompany } from '@/hooks/useCompany';
import MobileViewSwitcher from './MobileViewSwitcher';
import { ViewType } from '@/hooks/shifts/useMobileShifts';

interface MobileBottomNavigationProps {
  activeView: ViewType;
  onViewChange: (view: ViewType) => void;
  onCompanyImport?: () => void;
}

const MobileBottomNavigation: React.FC<MobileBottomNavigationProps> = ({
  activeView,
  onViewChange,
  onCompanyImport
}) => {
  const { t } = useTranslation('shifts');
  const navigate = useNavigate();
  const { isDHL, isAdecco, isRandstad } = useCompany();

  const getCompanyImportLabel = () => {
    if (isDHL) return 'DHL';
    if (isAdecco) return 'Adecco';
    if (isRandstad) return 'Randstad';
    return t('mobile.companyImport', 'Import');
  };

  const canShowImport = isDHL || isAdecco || isRandstad;

  return (
    <div className="border-t border-border bg-background/95 backdrop-blur-sm">
      <div className="flex items-center justify-around px-4 py-2">
        {/* Current View Tab with Dropdown */}
        <MobileViewSwitcher
          activeView={activeView}
          onViewChange={onViewChange}
        />

        {/* Overtime Tab */}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate('/overtime')}
          className="flex flex-col items-center gap-1 h-auto py-2 px-3 min-w-0 text-muted-foreground hover:text-foreground"
        >
          <Clock className="h-4 w-4" />
          <span className="text-xs font-medium">{t('mobile.overtime', 'Přesčasy')}</span>
        </Button>

        {/* Company Import Tab */}
        {canShowImport && onCompanyImport && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onCompanyImport}
            className="flex flex-col items-center gap-1 h-auto py-2 px-3 min-w-0 text-muted-foreground hover:text-foreground"
          >
            <Download className="h-4 w-4" />
            <span className="text-xs font-medium">{getCompanyImportLabel()}</span>
          </Button>
        )}
      </div>
    </div>
  );
};

export default MobileBottomNavigation;