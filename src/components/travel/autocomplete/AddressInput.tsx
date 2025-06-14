
import React, { forwardRef } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { MapPin, Loader2, X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface AddressInputProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onKeyDown: (e: React.KeyboardEvent) => void;
  onClear: () => void;
  placeholder?: string;
  disabled?: boolean;
  loading?: boolean;
  error?: string | null;
  className?: string;
  id?: string;
}

const AddressInput = forwardRef<HTMLInputElement, AddressInputProps>(({
  value,
  onChange,
  onKeyDown,
  onClear,
  placeholder = "Zadejte adresu...",
  disabled = false,
  loading = false,
  error,
  className,
  id
}, ref) => {
  return (
    <div className="relative">
      <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
      <Input
        ref={ref}
        id={id}
        value={value}
        onChange={onChange}
        onKeyDown={onKeyDown}
        placeholder={placeholder}
        disabled={disabled}
        className={cn(
          "pl-10 pr-10",
          error && "border-destructive",
          className
        )}
      />
      {loading && (
        <Loader2 className="absolute right-8 top-1/2 transform -translate-y-1/2 h-4 w-4 animate-spin text-muted-foreground" />
      )}
      {value && !loading && (
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={onClear}
          className="absolute right-1 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0 hover:bg-muted"
        >
          <X className="h-3 w-3" />
        </Button>
      )}
    </div>
  );
});

AddressInput.displayName = 'AddressInput';

export default AddressInput;
