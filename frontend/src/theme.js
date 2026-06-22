import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#7C3AED',
    },
    secondary: {
      main: '#06B6D4',
    },
    background: {
      default: '#0F0F13',
      paper: '#1A1A24',
    },
    text: {
      primary: '#F1F1F3',
      secondary: '#9CA3AF',
    },
  },
  typography: {
    fontFamily: `'Inter', 'Roboto', sans-serif`,
    h6: { fontWeight: 700 },
    subtitle2: { color: '#9CA3AF' },
  },
  shape: {
    borderRadius: 16,
  },
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
          background: '#1A1A24',
          border: '1px solid #2D2D3D',
          borderRadius: 16,
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 12,
          },
        },
      },
    },
  },
});

export default theme;