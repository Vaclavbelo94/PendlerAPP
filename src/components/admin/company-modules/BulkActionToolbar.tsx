import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useCompanyModulesAdmin } from '@/hooks/useCompanyModulesAdmin';
import { CompanyType } from '@/types/auth';
import { Eye, EyeOff, Building2 } from 'lucide-react';

interface BulkActionToolbarProps {
  selectedCompany: CompanyType | null;
  onCompanySelect: (company: CompanyType | null) => void;
}

const COMPANY_LABELS = {
  dhl: 'DHL',
  adecco: 'Adecco',
  randstad: 'Randstad'
};

export const BulkActionToolbar: React.FC<BulkActionToolbarProps> = ({
  selectedCompany,
  onCompanySelect
}) => {
  const {
    bulkToggleModules,
    bulkToggleWidgets,
    isBulkTogglingModules,
    isBulkTogglingWidgets,
    allModules,
    allWidgets
  } = useCompanyModulesAdmin();

  const companies: CompanyType[] = [CompanyType.DHL, CompanyType.ADECCO, CompanyType.RANDSTAD];

  const getCompanyStats = (company: CompanyType) => {
    const companyModules = allModules.filter(m => m.company === company);
    const companyWidgets = allWidgets.filter(w => w.company === company);
    
    const enabledModules = companyModules.filter(m => m.is_enabled).length;
    const enabledWidgets = companyWidgets.filter(w => w.is_enabled).length;
    
    return {
      modules: { enabled: enabledModules, total: companyModules.length },
      widgets: { enabled: enabledWidgets, total: companyWidgets.length }
    };
  };

  const handleBulkToggle = (company: CompanyType, enable: boolean) => {
    if (window.confirm(
      `Opravdu chcete ${enable ? 'povolit' : 'zakázat'} všechny moduly a widgety pro firmu ${COMPANY_LABELS[company]}?`
    )) {
      bulkToggleModules({ company, isEnabled: enable });
      bulkToggleWidgets({ company, isEnabled: enable });
    }
  };

  const isLoading = isBulkTogglingModules || isBulkTogglingWidgets;

  return (
    <div className="space-y-4 p-4 border border-border rounded-lg bg-muted/30">
      <div className="flex items-center gap-2">
        <Building2 className="h-4 w-4" />
        <span className="text-sm font-medium">Hromadné operace</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {companies.map(company => {
          const stats = getCompanyStats(company);
          const isSelected = selectedCompany === company;
          
          return (
            <div
              key={company}
              className={`p-3 border rounded-lg cursor-pointer transition-all ${
                isSelected 
                  ? 'border-primary bg-primary/5' 
                  : 'border-border hover:border-primary/50'
              }`}
              onClick={() => onCompanySelect(isSelected ? null : company)}
            >
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-medium">{COMPANY_LABELS[company]}</h4>
                <Badge variant={isSelected ? "default" : "outline"}>
                  {isSelected ? 'Vybráno' : 'Klikněte pro výběr'}
                </Badge>
              </div>
              
              <div className="space-y-1 text-xs text-muted-foreground">
                <div>Moduly: {stats.modules.enabled}/{stats.modules.total}</div>
                <div>Widgety: {stats.widgets.enabled}/{stats.widgets.total}</div>
              </div>

              {isSelected && (
                <div className="flex gap-2 mt-3">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleBulkToggle(company, true);
                    }}
                    disabled={isLoading}
                    className="flex-1 text-xs"
                  >
                    <Eye className="h-3 w-3 mr-1" />
                    Povolit vše
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleBulkToggle(company, false);
                    }}
                    disabled={isLoading}
                    className="flex-1 text-xs"
                  >
                    <EyeOff className="h-3 w-3 mr-1" />
                    Zakázat vše
                  </Button>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {selectedCompany && (
        <div className="text-xs text-muted-foreground">
          Vybraná firma: <strong>{COMPANY_LABELS[selectedCompany]}</strong>. 
          Použijte tlačítka výše pro hromadné operace.
        </div>
      )}
    </div>
  );
};