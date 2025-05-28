
import React from 'react';
import { Card, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckSquare, X } from 'lucide-react';

interface SelectionHeaderProps {
  selectedCount: number;
  onSelectAll: () => void;
  onClearSelection: () => void;
}

export const SelectionHeader: React.FC<SelectionHeaderProps> = ({
  selectedCount,
  onSelectAll,
  onClearSelection
}) => {
  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">
            Hromadné operace
            {selectedCount > 0 && (
              <Badge variant="secondary" className="ml-2">
                {selectedCount} vybráno
              </Badge>
            )}
          </CardTitle>
          
          <div className="flex gap-2">
            {selectedCount === 0 ? (
              <Button
                variant="outline"
                size="sm"
                onClick={onSelectAll}
                className="flex items-center gap-2"
              >
                <CheckSquare className="h-4 w-4" />
                Vybrat vše
              </Button>
            ) : (
              <Button
                variant="outline"
                size="sm"
                onClick={onClearSelection}
                className="flex items-center gap-2"
              >
                <X className="h-4 w-4" />
                Zrušit výběr
              </Button>
            )}
          </div>
        </div>
      </CardHeader>
    </Card>
  );
};
