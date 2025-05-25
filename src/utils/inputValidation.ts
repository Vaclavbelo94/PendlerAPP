
export interface ValidationResult {
  isValid: boolean;
  errors: string[];
}

export const validateShiftNotes = (notes: string): ValidationResult => {
  const errors: string[] = [];
  
  if (notes.length > 500) {
    errors.push('Poznámka může mít maximálně 500 znaků');
  }
  
  // Check for potential XSS patterns
  const dangerousPatterns = [
    /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
    /javascript:/gi,
    /on\w+\s*=/gi
  ];
  
  for (const pattern of dangerousPatterns) {
    if (pattern.test(notes)) {
      errors.push('Poznámka obsahuje nepovolené znaky');
      break;
    }
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

export const sanitizeInput = (input: string): string => {
  return input
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');
};

export const validateDate = (date: Date): ValidationResult => {
  const errors: string[] = [];
  const now = new Date();
  const oneYearAgo = new Date(now.getFullYear() - 1, now.getMonth(), now.getDate());
  const oneYearFromNow = new Date(now.getFullYear() + 1, now.getMonth(), now.getDate());
  
  if (isNaN(date.getTime())) {
    errors.push('Neplatné datum');
  } else if (date < oneYearAgo) {
    errors.push('Datum nemůže být starší než jeden rok');
  } else if (date > oneYearFromNow) {
    errors.push('Datum nemůže být vzdálenější než jeden rok');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};
