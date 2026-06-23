import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: { main: '#7C3AED' },
    secondary: { main: '#06B6D4' },
    background: {
      default: '#080810',
      paper: '#12121E',
    },
    text: {
      primary: '#F1F1F3',
      secondary: '#6B7280',
    },
  },
  typography: {
    fontFamily: `'Inter', 'Roboto', sans-serif`,
    h6: { fontWeight: 700 },
  },
  shape: { borderRadius: 16 },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderRadius: 20,
          fontWeight: 600,
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          background: '#12121E',
          border: '1px solid rgba(124,58,237,0.15)',
          borderRadius: 20,
          boxShadow: '0 4px 24px rgba(0,0,0,0.4)',
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': { borderRadius: 12 },
        },
      },
    },
  },
});

export default theme;