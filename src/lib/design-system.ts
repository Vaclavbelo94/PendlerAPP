
export type ColorVariant = 'primary' | 'secondary' | 'accent' | 'muted' | 'danger';
export type SizeVariant = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

// Konstanty pro design - v souladu s tailwind.config
export const DESIGN_TOKENS = {
  // Barvy z DHL brandu
  colors: {
    primary: {
      DEFAULT: '#FFEB3B', // DHL žlutá
      light: '#FFF9C4',
      dark: '#FBC02D',
      contrast: '#000000', // Text na primární barvě
    },
    secondary: {
      DEFAULT: '#F44336', // DHL červená
      light: '#FFCDD2',
      dark: '#D32F2F',
      contrast: '#FFFFFF', // Text na sekundární barvě
    },
    accent: {
      DEFAULT: '#3F51B5',
      light: '#C5CAE9',
      dark: '#303F9F',
      contrast: '#FFFFFF',
    },
    neutral: {
      50: '#F5F5F5',
      100: '#E0E0E0',
      200: '#BDBDBD',
      300: '#9E9E9E',
      400: '#757575',
      500: '#616161',
      600: '#424242',
      700: '#212121',
      800: '#121212',
      900: '#090909',
    },
    success: '#4CAF50',
    warning: '#FF9800',
    danger: '#FF5252',
    info: '#2196F3',
  },

  // Typografie
  typography: {
    families: {
      base: 'Inter, sans-serif',
      heading: 'Poppins, sans-serif',
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
    DEFAULT: '0.25rem',
    md: '0.375rem',
    lg: '0.5rem',
    xl: '0.75rem',
    '2xl': '1rem',
    full: '9999px',
  },

  // Shadows
  shadows: {
    sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    DEFAULT: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
    md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
    lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
    xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
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

// Přidání specifických DHL barev pro rychlý přístup
export const DHL_COLORS = {
  yellow: '#FFCC00',
  red: '#D40511',
  black: '#000000',
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
