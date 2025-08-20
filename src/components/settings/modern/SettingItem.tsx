import React from 'react';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface SettingItemProps {
  title: string;
  description?: string;
  type: 'toggle' | 'select' | 'button' | 'input' | 'display';
  value?: any;
  onChange?: (value: any) => void;
  onClick?: () => void;
  options?: { value: string; label: string }[];
  disabled?: boolean;
  variant?: 'default' | 'destructive';
}

const SettingItem: React.FC<SettingItemProps> = ({
  title,
  description,
  type,
  value,
  onChange,
  onClick,
  options,
  disabled = false,
  variant = 'default'
}) => {
  const renderControl = () => {
    switch (type) {
      case 'toggle':
        return (
          <Switch
            checked={value}
            onCheckedChange={onChange}
            disabled={disabled}
          />
        );
      
      case 'select':
        return (
          <Select value={value} onValueChange={onChange} disabled={disabled}>
            <SelectTrigger className="w-48 min-w-[12rem]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {options?.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        );
      
      case 'button':
        return (
          <Button
            variant={variant === 'destructive' ? 'destructive' : 'outline'}
            size="sm"
            onClick={onClick}
            disabled={disabled}
          >
            {title}
          </Button>
        );
      
      case 'input':
        return (
          <Input
            value={value}
            onChange={(e) => onChange?.(e.target.value)}
            disabled={disabled}
            className="w-64 min-w-[16rem]"
          />
        );
      
      case 'display':
        return (
          <span className="text-sm text-muted-foreground">{value}</span>
        );
      
      default:
        return null;
    }
  };

  return (
    <div className="flex items-start justify-between py-6 border-b border-border/50 last:border-b-0 min-h-[4rem]">
      <div className="flex-1 pr-6">
        <div className="font-medium text-foreground text-base leading-tight">{title}</div>
        {description && (
          <div className="text-sm text-muted-foreground mt-2 leading-relaxed max-w-md">{description}</div>
        )}
      </div>
      <div className="flex-shrink-0 flex items-center">
        {renderControl()}
      </div>
    </div>
  );
};

export default SettingItem;