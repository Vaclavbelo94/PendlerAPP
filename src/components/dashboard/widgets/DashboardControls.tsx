
import React from 'react';
import { Button } from '@/components/ui/button';
import { RotateCcw, Settings } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';

interface DashboardControlsProps {
  onResetLayout: () => void;
  onOpenSettings: () => void;
}

export const DashboardControls: React.FC<DashboardControlsProps> = ({
  onResetLayout,
  onOpenSettings
}) => {
  return (
    <div className="flex items-center gap-2">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm">
            <Settings className="h-4 w-4 mr-2" />
            Upravit dashboard
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Možnosti dashboardu</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={onOpenSettings}>
            <Settings className="h-4 w-4 mr-2" />
            Nastavení widgetů
          </DropdownMenuItem>
          <DropdownMenuItem onClick={onResetLayout}>
            <RotateCcw className="h-4 w-4 mr-2" />
            Obnovit výchozí rozložení
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};
