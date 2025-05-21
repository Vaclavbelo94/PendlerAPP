
import React, { ReactNode } from 'react';
import { Badge } from '@/components/ui/badge';

interface StatCardProps {
  icon: ReactNode;
  iconBgClass: string;
  iconColor: string;
  label: string;
  value: number | string;
  badge?: {
    text: string;
    variant?: "default" | "secondary" | "destructive" | "outline" | "success";
  };
}

const StatCard: React.FC<StatCardProps> = ({
  icon,
  iconBgClass,
  iconColor,
  label,
  value,
  badge
}) => {
  return (
    <div className="rounded-lg border p-3">
      <div className="flex items-center gap-2">
        <div className={`rounded-full ${iconBgClass} p-1.5`}>
          {React.cloneElement(icon as React.ReactElement, { 
            className: `h-4 w-4 ${iconColor}` 
          })}
        </div>
        <span className="text-sm font-medium">{label}</span>
      </div>
      <p className="mt-2 text-2xl font-bold">{value}</p>
      {badge && (
        <Badge variant={badge.variant || "secondary"} className="mt-1">
          {badge.text}
        </Badge>
      )}
    </div>
  );
};

export default StatCard;
