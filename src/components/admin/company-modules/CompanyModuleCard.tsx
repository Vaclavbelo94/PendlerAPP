import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ModuleToggleSwitch } from './ModuleToggleSwitch';
import { ConfigDialog } from './ConfigDialog';
import { CompanyType } from '@/types/auth';
import { CompanyModuleAdmin, CompanyWidgetAdmin } from '@/hooks/useCompanyModulesAdmin';
import { Settings, Eye, EyeOff } from 'lucide-react';

interface CompanyModuleCardProps {
  company: CompanyType;
  modules?: CompanyModuleAdmin[];
  widgets?: CompanyWidgetAdmin[];
  type: 'module' | 'widget';
}

const COMPANY_LABELS = {
  dhl: 'DHL',
  adecco: 'Adecco',
  randstad: 'Randstad'
};

const COMPANY_COLORS = {
  dhl: 'bg-yellow-500',
  adecco: 'bg-blue-500', 
  randstad: 'bg-orange-500'
};

export const CompanyModuleCard: React.FC<CompanyModuleCardProps> = ({
  company,
  modules = [],
  widgets = [],
  type
}) => {
  const [configDialogOpen, setConfigDialogOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<CompanyModuleAdmin | CompanyWidgetAdmin | null>(null);

  const items = type === 'module' ? modules : widgets;
  const enabledCount = items.filter(item => item.is_enabled).length;
  const totalCount = items.length;

  const handleConfigClick = (item: CompanyModuleAdmin | CompanyWidgetAdmin) => {
    setSelectedItem(item);
    setConfigDialogOpen(true);
  };

  const getItemKey = (item: CompanyModuleAdmin | CompanyWidgetAdmin) => {
    return type === 'module' ? (item as CompanyModuleAdmin).module_key : (item as CompanyWidgetAdmin).widget_key;
  };

  const getItemTitle = (item: CompanyModuleAdmin | CompanyWidgetAdmin) => {
    const config = item.config as any;
    return config?.title || getItemKey(item);
  };

  const getItemDescription = (item: CompanyModuleAdmin | CompanyWidgetAdmin) => {
    const config = item.config as any;
    return config?.description || 'Bez popisu';
  };

  if (totalCount === 0) {
    return (
      <Card className="border-dashed">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={`w-3 h-3 rounded-full ${COMPANY_COLORS[company]}`} />
              <span>{COMPANY_LABELS[company]}</span>
              <Badge variant="outline" className="text-xs">
                Žádné {type === 'module' ? 'moduly' : 'widgety'}
              </Badge>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground text-center py-4">
            Pro tuto firmu nejsou definovány žádné {type === 'module' ? 'moduly' : 'widgety'}.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={`w-3 h-3 rounded-full ${COMPANY_COLORS[company]}`} />
              <span>{COMPANY_LABELS[company]}</span>
              <Badge variant={enabledCount === totalCount ? "default" : enabledCount === 0 ? "destructive" : "secondary"}>
                {enabledCount}/{totalCount} aktivních
              </Badge>
            </div>
            <div className="flex items-center gap-2">
              {enabledCount > 0 && (
                <Eye className="h-4 w-4 text-green-600" />
              )}
              {enabledCount < totalCount && (
                <EyeOff className="h-4 w-4 text-gray-400" />
              )}
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {items.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between p-3 rounded-lg border border-border hover:bg-muted/50 transition-colors"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3">
                    <h4 className="font-medium text-sm truncate">
                      {getItemTitle(item)}
                    </h4>
                    <Badge variant="outline" className="text-xs shrink-0">
                      {getItemKey(item)}
                    </Badge>
                    {type === 'widget' && (
                      <Badge variant="outline" className="text-xs shrink-0">
                        {(item as CompanyWidgetAdmin).category}
                      </Badge>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1 truncate">
                    {getItemDescription(item)}
                  </p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleConfigClick(item)}
                    className="h-8 w-8 p-0"
                  >
                    <Settings className="h-4 w-4" />
                  </Button>
                  <ModuleToggleSwitch
                    id={item.id}
                    isEnabled={item.is_enabled}
                    type={type}
                  />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <ConfigDialog
        open={configDialogOpen}
        onOpenChange={setConfigDialogOpen}
        item={selectedItem}
        type={type}
      />
    </>
  );
};