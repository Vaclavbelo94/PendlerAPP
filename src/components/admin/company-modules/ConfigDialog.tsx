import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { useCompanyModulesAdmin, CompanyModuleAdmin, CompanyWidgetAdmin } from '@/hooks/useCompanyModulesAdmin';
import { Save, X } from 'lucide-react';

interface ConfigDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  item: CompanyModuleAdmin | CompanyWidgetAdmin | null;
  type: 'module' | 'widget';
}

export const ConfigDialog: React.FC<ConfigDialogProps> = ({
  open,
  onOpenChange,
  item,
  type
}) => {
  const {
    updateModuleConfig,
    updateWidgetConfig,
    isUpdatingModuleConfig,
    isUpdatingWidgetConfig
  } = useCompanyModulesAdmin();

  const [config, setConfig] = useState<any>({});

  useEffect(() => {
    if (item) {
      setConfig(item.config || {});
    }
  }, [item]);

  const isLoading = type === 'module' ? isUpdatingModuleConfig : isUpdatingWidgetConfig;

  const handleSave = () => {
    if (!item) return;

    if (type === 'module') {
      updateModuleConfig({ id: item.id, config });
    } else {
      updateWidgetConfig({ id: item.id, config });
    }
    onOpenChange(false);
  };

  const getItemKey = () => {
    if (!item) return '';
    return type === 'module' ? (item as CompanyModuleAdmin).module_key : (item as CompanyWidgetAdmin).widget_key;
  };

  const updateConfig = (key: string, value: any) => {
    setConfig((prev: any) => ({
      ...prev,
      [key]: value
    }));
  };

  if (!item) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            Konfigurace {type === 'module' ? 'modulu' : 'widgetu'}
            <Badge variant="outline">{getItemKey()}</Badge>
          </DialogTitle>
          <DialogDescription>
            Upravte konfiguraci pro {type === 'module' ? 'modul' : 'widget'} v rámci firmy {item.company.toUpperCase()}.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Název</Label>
            <Input
              id="title"
              value={config.title || ''}
              onChange={(e) => updateConfig('title', e.target.value)}
              placeholder="Zadejte název"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Popis</Label>
            <Textarea
              id="description"
              value={config.description || ''}
              onChange={(e) => updateConfig('description', e.target.value)}
              placeholder="Zadejte popis"
              rows={3}
            />
          </div>

          {type === 'widget' && (
            <>
              <div className="space-y-2">
                <Label htmlFor="priority">Priorita</Label>
                <select
                  id="priority"
                  value={config.priority || 'medium'}
                  onChange={(e) => updateConfig('priority', e.target.value)}
                  className="w-full px-3 py-2 border border-border rounded-md bg-background"
                >
                  <option value="low">Nízká</option>
                  <option value="medium">Střední</option>
                  <option value="high">Vysoká</option>
                </select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="size">Velikost</Label>
                <select
                  id="size"
                  value={config.size || 'medium'}
                  onChange={(e) => updateConfig('size', e.target.value)}
                  className="w-full px-3 py-2 border border-border rounded-md bg-background"
                >
                  <option value="small">Malá</option>
                  <option value="medium">Střední</option>
                  <option value="large">Velká</option>
                </select>
              </div>
            </>
          )}

          <div className="pt-2 border-t">
            <Label className="text-xs text-muted-foreground">Surová konfigurace (JSON)</Label>
            <Textarea
              value={JSON.stringify(config, null, 2)}
              onChange={(e) => {
                try {
                  const parsed = JSON.parse(e.target.value);
                  setConfig(parsed);
                } catch {
                  // Invalid JSON, ignore
                }
              }}
              rows={6}
              className="mt-1 font-mono text-xs"
              placeholder="Zadejte JSON konfiguraci"
            />
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isLoading}
          >
            <X className="h-4 w-4 mr-2" />
            Zrušit
          </Button>
          <Button onClick={handleSave} disabled={isLoading}>
            {isLoading ? (
              <>
                <div className="h-4 w-4 mr-2 animate-spin rounded-full border-2 border-background border-t-transparent" />
                Ukládám...
              </>
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" />
                Uložit
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};