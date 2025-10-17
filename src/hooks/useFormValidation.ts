import { useState, useCallback } from 'react';
import { z } from 'zod';

interface ValidationError {
  field: string;
  message: string;
}

interface UseFormValidationOptions<T> {
  schema: z.ZodSchema<T>;
  onValidate?: (isValid: boolean, errors: ValidationError[]) => void;
  validateOnChange?: boolean;
}

export function useFormValidation<T extends Record<string, any>>({
  schema,
  onValidate,
  validateOnChange = true,
}: UseFormValidationOptions<T>) {
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touchedFields, setTouchedFields] = useState<Set<string>>(new Set());

  const validateField = useCallback(
    (fieldName: string, value: any) => {
      try {
        // Create a partial object with just this field
        const testData = { [fieldName]: value } as any;
        schema.parse(testData);
        
        setErrors((prev) => {
          const newErrors = { ...prev };
          delete newErrors[fieldName];
          return newErrors;
        });
        return true;
      } catch (error) {
        if (error instanceof z.ZodError) {
          const fieldError = error.errors.find(e => e.path[0] === fieldName);
          if (fieldError) {
            setErrors((prev) => ({
              ...prev,
              [fieldName]: fieldError.message,
            }));
          }
          return false;
        }
      }
      return true;
    },
    [schema]
  );

  const validateForm = useCallback(
    (data: T) => {
      try {
        schema.parse(data);
        setErrors({});
        onValidate?.(true, []);
        return { isValid: true, errors: {} };
      } catch (error) {
        if (error instanceof z.ZodError) {
          const formattedErrors: Record<string, string> = {};
          const errorList: ValidationError[] = [];

          error.errors.forEach((err) => {
            const field = err.path.join('.');
            formattedErrors[field] = err.message;
            errorList.push({ field, message: err.message });
          });

          setErrors(formattedErrors);
          onValidate?.(false, errorList);
          return { isValid: false, errors: formattedErrors };
        }
      }
      return { isValid: false, errors: {} };
    },
    [schema, onValidate]
  );

  const handleFieldChange = useCallback(
    (fieldName: string, value: any) => {
      if (validateOnChange && touchedFields.has(fieldName)) {
        validateField(fieldName, value);
      }
    },
    [validateField, validateOnChange, touchedFields]
  );

  const handleFieldBlur = useCallback(
    (fieldName: string, value: any) => {
      setTouchedFields((prev) => new Set(prev).add(fieldName));
      validateField(fieldName, value);
    },
    [validateField]
  );

  const clearErrors = useCallback(() => {
    setErrors({});
  }, []);

  const clearFieldError = useCallback((fieldName: string) => {
    setErrors((prev) => {
      const newErrors = { ...prev };
      delete newErrors[fieldName];
      return newErrors;
    });
  }, []);

  return {
    errors,
    validateField,
    validateForm,
    handleFieldChange,
    handleFieldBlur,
    clearErrors,
    clearFieldError,
    touchedFields,
  };
}
