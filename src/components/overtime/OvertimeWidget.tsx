import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { LucideIcon } from 'lucide-react';

interface OvertimeWidgetProps {
  icon: LucideIcon;
  title: string;
  hours: number;
  iconColor: string;
  bgColor: string;
  unitLabel?: string;
}

const OvertimeWidget: React.FC<OvertimeWidgetProps> = ({
  icon: Icon,
  title,
  hours,
  iconColor,
  bgColor,
  unitLabel
}) => {
  return (
    <Card className="h-full">
      <CardContent className="p-6">
        <div className={`flex flex-col items-center text-center space-y-3 p-4 rounded-lg ${bgColor}`}>
          <Icon className={`h-8 w-8 ${iconColor}`} />
          <div>
            <div className="text-3xl font-bold text-foreground">{hours}</div>
            <div className="text-sm text-muted-foreground">{unitLabel ?? 'h'}</div>
          </div>
          <div className="text-sm font-medium text-muted-foreground">
            {title}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default OvertimeWidget;