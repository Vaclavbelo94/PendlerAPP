
export type ColorVariant = 'primary' | 'secondary' | 'accent' | 'muted' | 'danger';
export type SizeVariant = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

// Aktualizované DHL konstanty pro design
export const DESIGN_TOKENS = {
  // Přesné DHL barvy
  colors: {
    primary: {
      DEFAULT: '#FFCC00', // Oficiální DHL žlutá
      light: '#FFD633',
      dark: '#E6B800',
      contrast: '#000000', // Černý text na žluté
    },
    secondary: {
      DEFAULT: '#D40511', // Oficiální DHL červená
      light: '#E63946',
      dark: '#B8040E',
      contrast: '#FFFFFF', // Bílý text na červené
    },
    accent: {
      DEFAULT: '#FFCC00', // Stejná jako primární pro konzistenci
      light: '#FFD633',
      dark: '#E6B800',
      contrast: '#000000',
    },
    neutral: {
      50: '#FAFAFA',
      100: '#F5F5F5',
      200: '#E5E5E5',
      300: '#D4D4D4',
      400: '#A3A3A3',
      500: '#737373',
      600: '#525252',
      700: '#404040',
      800: '#262626',
      900: '#171717',
    },
    success: '#22C55E',
    warning: '#FFCC00', // DHL žlutá pro warnings
    danger: '#D40511', // DHL červená pro errors
    info: '#3B82F6',
  },

  // Moderní DHL gradienty
  gradients: {
    primary: 'linear-gradient(135deg, #FFCC00 0%, #D40511 100%)',
    subtle: 'linear-gradient(135deg, rgba(255, 204, 0, 0.1) 0%, rgba(212, 5, 17, 0.1) 100%)',
    radial: 'radial-gradient(circle at center, #FFCC00 0%, #D40511 70%)',
    hero: 'linear-gradient(135deg, #FFCC00 0%, #FFD633 50%, #D40511 100%)',
  },

  // Typography
  typography: {
    families: {
      base: 'Inter, sans-serif',
      heading: 'Inter, sans-serif', // Používáme Inter pro konzistenci
    },
    weights: {
      light: 300,
      normal: 400,
      medium: 500,
      semibold: 600,
      bold: 700,
    },
    sizes: {
      xs: '0.75rem',
      sm: '0.875rem',
      base: '1rem',
      lg: '1.125rem',
      xl: '1.25rem',
      '2xl': '1.5rem',
      '3xl': '1.875rem',
      '4xl': '2.25rem',
      '5xl': '3rem',
    },
  },

  // Spacing
  spacing: {
    0: '0',
    1: '0.25rem',
    2: '0.5rem',
    3: '0.75rem',
    4: '1rem',
    5: '1.25rem',
    6: '1.5rem',
    8: '2rem',
    10: '2.5rem',
    12: '3rem',
    16: '4rem',
    20: '5rem',
    24: '6rem',
  },

  // Radius
  radius: {
    none: '0',
    sm: '0.125rem',
    DEFAULT: '0.375rem', // Moderní zaoblení
    md: '0.5rem',
    lg: '0.75rem',
    xl: '1rem',
    '2xl': '1.5rem',
    full: '9999px',
  },

  // Shadows s DHL barvami
  shadows: {
    sm: '0 1px 2px 0 rgba(255, 204, 0, 0.05)',
    DEFAULT: '0 1px 3px 0 rgba(255, 204, 0, 0.1), 0 1px 2px 0 rgba(212, 5, 17, 0.06)',
    md: '0 4px 6px -1px rgba(255, 204, 0, 0.1), 0 2px 4px -1px rgba(212, 5, 17, 0.06)',
    lg: '0 10px 15px -3px rgba(255, 204, 0, 0.1), 0 4px 6px -2px rgba(212, 5, 17, 0.05)',
    xl: '0 20px 25px -5px rgba(255, 204, 0, 0.1), 0 10px 10px -5px rgba(212, 5, 17, 0.04)',
    glow: '0 0 20px rgba(255, 204, 0, 0.3)',
  },

  // Animace
  animation: {
    durations: {
      fast: '150ms',
      normal: '300ms',
      slow: '500ms',
    },
    easings: {
      ease: 'cubic-bezier(0.25, 0.1, 0.25, 1)',
      easeIn: 'cubic-bezier(0.42, 0, 1, 1)',
      easeOut: 'cubic-bezier(0, 0, 0.58, 1)',
      easeInOut: 'cubic-bezier(0.42, 0, 0.58, 1)',
    },
  },

  // Z-indexy
  zIndex: {
    0: '0',
    10: '10',
    20: '20',
    30: '30',
    40: '40',
    50: '50',
    auto: 'auto',
    dropdown: '1000',
    sticky: '1020',
    fixed: '1030',
    backdrop: '1040',
    modal: '1050',
    popover: '1060',
    tooltip: '1070',
  },
};

// Přesné DHL barvy pro rychlý přístup
export const DHL_COLORS = {
  yellow: '#FFCC00',
  red: '#D40511',
  black: '#000000',
  white: '#FFFFFF',
};

// Utility funkce pro design systém
export const getColorValue = (color: ColorVariant, variant: 'light' | 'DEFAULT' | 'dark' = 'DEFAULT') => {
  switch (color) {
    case 'primary':
      return DESIGN_TOKENS.colors.primary[variant];
    case 'secondary':
      return DESIGN_TOKENS.colors.secondary[variant];
    case 'accent':
      return DESIGN_TOKENS.colors.accent[variant];
    case 'muted':
      return DESIGN_TOKENS.colors.neutral[300];
    case 'danger':
      return DESIGN_TOKENS.colors.danger;
    default:
      return DESIGN_TOKENS.colors.primary[variant];
  }
};

export const getSpacing = (size: SizeVariant) => {
  switch (size) {
    case 'xs': return DESIGN_TOKENS.spacing[1];
    case 'sm': return DESIGN_TOKENS.spacing[2];
    case 'md': return DESIGN_TOKENS.spacing[4];
    case 'lg': return DESIGN_TOKENS.spacing[6];
    case 'xl': return DESIGN_TOKENS.spacing[8];
    default: return DESIGN_TOKENS.spacing[4];
  }
};

// Exportujeme konstanty pro použití v celé aplikaci
export default DESIGN_TOKENS;
