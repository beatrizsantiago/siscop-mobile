import 'styled-components/native';

declare module 'styled-components/native' {
  export interface DefaultTheme {
    primary: {
      main: string;
      light: string;
      dark: string;
    };
    secondary: {
      main: string;
      light: string;
      dark: string;
    };
    tertiary: {
      main: string;
      light: string;
      dark: string;
    };
    blue: {
      main: string;
      light: string;
      dark: string;
    };
    background: {
      default: string;
      paper: string;
      soft: string;
    };
    error: {
      main: string;
    };
    low: {
      main: string;
      medium: string;
    };
    high: {
      main: string;
    };
    gray: {
      main: string;
      light: string;
      medium: string;
      dark: string;
      '100': string;
      '200': string;
      '600': string;
    };
  }
}
