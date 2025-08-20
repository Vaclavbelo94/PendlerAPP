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
            <SelectTrigger className="w-40">
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
            className="w-48"
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
    <div className="flex items-center justify-between py-4 border-b border-border/50 last:border-b-0">
      <div className="flex-1">
        <div className="font-medium text-foreground">{title}</div>
        {description && (
          <div className="text-sm text-muted-foreground mt-1">{description}</div>
        )}
      </div>
      <div className="ml-4">
        {renderControl()}
      </div>
    </div>
  );
};

export default SettingItem;