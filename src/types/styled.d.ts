import 'styled-components';

declare module 'styled-components' {
  export interface DefaultTheme {
    colors: {
      primary: string;
      primaryLight: string;
      primaryDark: string;
      secondary: string;
      secondaryLight: string;
      secondaryDark: string;
      success: string;
      info: string;
      warning: string;
      danger: string;
      error: string;
      highlight: string;
      background: string;
      foreground: string;
      card: string;
      text: string;
      textLight: string;
      border: string;
      hover: string;
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
    fonts: {
      sans: string;
      mono: string;
      body: string;
      heading: string;
      code: string;
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
      body: number;
      heading: number;
    };
    shadows: {
      sm: string;
      md: string;
      lg: string;
    };
    transitions: {
      default: string;
      fast: string;
      slow: string;
    };
    borderRadius: string;
    breakpoints: {
      xs: string;
      sm: string;
      md: string;
      lg: string;
      xl: string;
    };
  }
} 