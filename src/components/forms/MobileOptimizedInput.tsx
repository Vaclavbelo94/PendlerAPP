import React from 'react';
import { Input } from '@/components/ui/input';
import { getAutocomplete, getInputMode } from '@/utils/formHelpers';

interface MobileOptimizedInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  fieldName?: string;
  fieldType?: 'text' | 'email' | 'tel' | 'number' | 'url' | 'search';
}

export const MobileOptimizedInput = React.forwardRef<HTMLInputElement, MobileOptimizedInputProps>(
  ({ fieldName, fieldType, inputMode, autoComplete, ...props }, ref) => {
    const derivedInputMode = inputMode || (fieldName ? getInputMode(fieldName, fieldType) as any : undefined);
    const derivedAutoComplete = autoComplete || (fieldName ? getAutocomplete(fieldName) : undefined);

    return (
      <Input
        ref={ref}
        inputMode={derivedInputMode}
        autoComplete={derivedAutoComplete}
        {...props}
      />
    );
  }
);

MobileOptimizedInput.displayName = 'MobileOptimizedInput';
