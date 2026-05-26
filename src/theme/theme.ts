import { createTheme } from '@mui/material/styles';

export const lightTheme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#1e3a5f',
    },
    secondary: {
      main: '#c9a84c',
    },
    background: {
      default: '#fafbfc',
      paper: '#ffffff',
    },
    error: {
      main: '#e85d3a',
    },
  },
  typography: {
    fontFamily: 'Roboto, sans-serif',
    h1: { fontWeight: 700 },
    h2: { fontWeight: 700 },
    h3: { fontWeight: 600 },
    h4: { fontWeight: 600 },
    h5: { fontWeight: 500 },
    h6: { fontWeight: 500 },
    body1: { fontWeight: 400 },
    body2: { fontWeight: 400 },
  },
  shape: {
    borderRadius: 12,
  },
});

export const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#1e3a5f',
    },
    secondary: {
      main: '#c9a84c',
    },
    background: {
      default: '#0d1b2a',
      paper: '#1a2332',
    },
    error: {
      main: '#e85d3a',
    },
  },
  typography: {
    fontFamily: 'Roboto, sans-serif',
    h1: { fontWeight: 700 },
    h2: { fontWeight: 700 },
    h3: { fontWeight: 600 },
    h4: { fontWeight: 600 },
    h5: { fontWeight: 500 },
    h6: { fontWeight: 500 },
    body1: { fontWeight: 400 },
    body2: { fontWeight: 400 },
  },
  shape: {
    borderRadius: 12,
  },
});
