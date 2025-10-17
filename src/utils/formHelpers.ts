/**
 * Form helpers for mobile optimization
 */

// Map of common form field names to autocomplete attributes
export const autocompleteMap: Record<string, string> = {
  // Name fields
  firstName: 'given-name',
  lastname: 'family-name',
  fullName: 'name',
  username: 'username',
  
  // Contact fields
  email: 'email',
  phone: 'tel',
  mobilePhone: 'tel',
  homePhone: 'tel-local',
  workPhone: 'tel-area-code',
  
  // Address fields
  address: 'street-address',
  addressLine1: 'address-line1',
  addressLine2: 'address-line2',
  city: 'address-level2',
  state: 'address-level1',
  country: 'country',
  postalCode: 'postal-code',
  zipCode: 'postal-code',
  
  // Organization fields
  company: 'organization',
  jobTitle: 'organization-title',
  
  // Payment fields
  ccName: 'cc-name',
  ccNumber: 'cc-number',
  ccExp: 'cc-exp',
  ccExpMonth: 'cc-exp-month',
  ccExpYear: 'cc-exp-year',
  ccCsc: 'cc-csc',
  
  // Authentication fields
  password: 'current-password',
  newPassword: 'new-password',
  confirmPassword: 'new-password',
  
  // Date fields
  birthDate: 'bday',
  birthDay: 'bday-day',
  birthMonth: 'bday-month',
  birthYear: 'bday-year',
  
  // Other
  url: 'url',
  photo: 'photo',
};

// Map field types to inputMode
export const inputModeMap: Record<string, 'text' | 'tel' | 'url' | 'email' | 'numeric' | 'decimal' | 'search'> = {
  email: 'email',
  phone: 'tel',
  tel: 'tel',
  url: 'url',
  number: 'numeric',
  search: 'search',
  postalCode: 'numeric',
  zipCode: 'numeric',
  age: 'numeric',
  quantity: 'numeric',
  price: 'decimal',
  amount: 'decimal',
  salary: 'decimal',
};

/**
 * Get autocomplete attribute for a field name
 */
export function getAutocomplete(fieldName: string): string | undefined {
  const lowerFieldName = fieldName.toLowerCase().replace(/[_-]/g, '');
  
  // Direct match
  if (autocompleteMap[fieldName]) {
    return autocompleteMap[fieldName];
  }
  
  // Fuzzy match
  for (const [key, value] of Object.entries(autocompleteMap)) {
    if (lowerFieldName.includes(key.toLowerCase())) {
      return value;
    }
  }
  
  return undefined;
}

/**
 * Get inputMode for a field based on name or type
 */
export function getInputMode(fieldName: string, type?: string): string | undefined {
  // Check by type first
  if (type && inputModeMap[type]) {
    return inputModeMap[type];
  }
  
  // Check by field name
  const lowerFieldName = fieldName.toLowerCase().replace(/[_-]/g, '');
  
  for (const [key, value] of Object.entries(inputModeMap)) {
    if (lowerFieldName.includes(key.toLowerCase())) {
      return value;
    }
  }
  
  return undefined;
}

/**
 * Enhance input props with mobile-friendly attributes
 */
export function enhanceInputProps(
  fieldName: string,
  type?: string
): {
  autoComplete?: string;
  inputMode?: 'text' | 'tel' | 'url' | 'email' | 'numeric' | 'decimal' | 'search';
} {
  return {
    autoComplete: getAutocomplete(fieldName),
    inputMode: getInputMode(fieldName, type) as any,
  };
}

/**
 * Scroll input into view with offset for mobile keyboards
 */
export function scrollInputIntoView(element: HTMLElement, offset = 120) {
  if (!element) return;
  
  setTimeout(() => {
    const rect = element.getBoundingClientRect();
    const isInView = rect.top >= 0 && rect.bottom <= window.innerHeight;
    
    if (!isInView) {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      const elementTop = rect.top + scrollTop;
      const scrollPosition = elementTop - offset;
      
      window.scrollTo({
        top: scrollPosition,
        behavior: 'smooth',
      });
    }
  }, 100);
}

/**
 * Handle virtual keyboard on mobile
 */
export function useVirtualKeyboard() {
  if (typeof window === 'undefined') return null;
  
  const visualViewport = window.visualViewport;
  
  if (!visualViewport) return null;
  
  return {
    height: visualViewport.height,
    offset: window.innerHeight - visualViewport.height,
    isVisible: window.innerHeight - visualViewport.height > 150,
  };
}
