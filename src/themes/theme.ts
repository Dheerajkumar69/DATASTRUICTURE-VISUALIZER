
export interface Theme {
  colors: {
    primary: string;
    primaryLight: string;
    primaryDark: string;
    secondary: string;
    secondaryLight: string;
    secondaryDark: string;
    background: string;
    surface: string;
    text: string;
    textLight: string;
    textSecondary: string;
    border: string;
    hover: string;
    success: string;
    warning: string;
    error: string;
    danger: string;
    info: string;
    highlight: string;
    accent: string;
    card: string;
    foreground: string;
    gray50: string;
    gray100: string;
    gray200: string;
    gray300: string;
    gray400: string;
    gray500: string;
    gray600: string;
    gray700: string;
    gray800: string;
    gray900: string;
  };
  spacing: {
    xs: string;
    sm: string;
    md: string;
    lg: string;
    xl: string;
  };
  borderRadius: {
    sm: string;
    md: string;
    lg: string;
  };
  shadows: {
    sm: string;
    md: string;
    lg: string;
    xl: string;
  };
  transitions: {
    fast: string;
    normal: string;
    slow: string;
    default: string;
  };
  fonts: {
    sans: string;
    mono: string;
  };
  fontSizes: {
    xs: string;
    sm: string;
    md: string;
    lg: string;
    xl: string;
    xxl: string;
  };
  fontWeights: {
    normal: number;
    medium: number;
    bold: number;
  };
  lineHeights: {
    body: string;
    heading: string;
  };
  breakpoints: {
    sm: string;
    md: string;
    lg: string;
    xl: string;
  };
  // Legacy properties for backward compatibility
  primary: string;
  primaryDark: string;
  cardBackground: string;
  textSecondary: string;
  border: string;
}

export const lightTheme: Theme = {
  colors: {
    primary: '#3B82F6',
    primaryLight: '#93C5FD',
    primaryDark: '#2563EB',
    secondary: '#8B5CF6',
    secondaryLight: '#C4B5FD',
    secondaryDark: '#7C3AED',
    background: '#FFFFFF',
    surface: '#F8FAFC',
    text: '#1E293B',
    textLight: '#64748B',
    textSecondary: '#64748B',
    border: '#E2E8F0',
    hover: '#F1F5F9',
    success: '#10B981',
    warning: '#F59E0B',
    error: '#EF4444',
    danger: '#EF4444',
    info: '#06B6D4',
    highlight: '#FCD34D',
    accent: '#F472B6',
    card: '#FFFFFF',
    foreground: '#1E293B',
    gray50: '#F8FAFC',
    gray100: '#F1F5F9',
    gray200: '#E2E8F0',
    gray300: '#CBD5E1',
    gray400: '#94A3B8',
    gray500: '#64748B',
    gray600: '#475569',
    gray700: '#334155',
    gray800: '#1E293B',
    gray900: '#0F172A',
  },
  spacing: {
    xs: '0.25rem',
    sm: '0.5rem',
    md: '1rem',
    lg: '1.5rem',
    xl: '2rem',
  },
  borderRadius: {
    sm: '0.25rem',
    md: '0.5rem',
    lg: '0.75rem',
  },
  shadows: {
    sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    md: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
    lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
    xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
  },
  transitions: {
    fast: 'all 0.15s ease',
    normal: 'all 0.3s ease',
    slow: 'all 0.5s ease',
    default: 'all 0.3s ease',
  },
  fonts: {
    sans: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    mono: '"SF Mono", Monaco, Inconsolata, "Roboto Mono", "Source Code Pro", monospace',
  },
  fontSizes: {
    xs: '0.75rem',
    sm: '0.875rem',
    md: '1rem',
    lg: '1.125rem',
    xl: '1.25rem',
    xxl: '1.875rem',
  },
  fontWeights: {
    normal: 400,
    medium: 500,
    bold: 700,
  },
  lineHeights: {
    body: '1.6',
    heading: '1.2',
  },
  breakpoints: {
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: '1280px',
  },
  // Legacy properties for backward compatibility
  primary: '#3B82F6',
  primaryDark: '#2563EB',
  cardBackground: '#FFFFFF',
  textSecondary: '#64748B',
  border: '#E2E8F0',
};

export const darkTheme: Theme = {
  ...lightTheme,
  colors: {
    primary: '#60A5FA',
    primaryLight: '#93C5FD',
    primaryDark: '#2563EB',
    secondary: '#A78BFA',
    secondaryLight: '#C4B5FD',
    secondaryDark: '#7C3AED',
    background: '#0F172A',
    surface: '#1E293B',
    text: '#F1F5F9',
    textLight: '#CBD5E1',
    textSecondary: '#94A3B8',
    border: '#334155',
    hover: '#334155',
    success: '#34D399',
    warning: '#FBBF24',
    error: '#F87171',
    danger: '#F87171',
    info: '#22D3EE',
    highlight: '#FCD34D',
    accent: '#F472B6',
    card: '#1E293B',
    foreground: '#F1F5F9',
    gray50: '#1E293B',
    gray100: '#334155',
    gray200: '#475569',
    gray300: '#64748B',
    gray400: '#94A3B8',
    gray500: '#CBD5E1',
    gray600: '#E2E8F0',
    gray700: '#F1F5F9',
    gray800: '#F8FAFC',
    gray900: '#FFFFFF',
  },
  // Legacy properties for backward compatibility
  primary: '#60A5FA',
  primaryDark: '#2563EB',
  cardBackground: '#1E293B',
  textSecondary: '#94A3B8',
  border: '#334155',
};
