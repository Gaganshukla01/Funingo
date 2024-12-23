import { red } from '@mui/material/colors';
import { createTheme, responsiveFontSizes } from '@mui/material/styles';

// const theme = createTheme();

const theme = responsiveFontSizes(
  createTheme({
    typography: {
      body1: {
        fontSize: 14
      }
    },
    components: {
      MuiPaper: {
        root: {
          boxShadow: 'none'
        }
      },
      MuiTablePagination: {
        actions: {
          display: 'flex',
          flexDirection: 'row'
        }
      },
      MuiFormHelperText: {
        contained: {
          marginLeft: 0
        }
      }
    },
    palette: {
      common: {
        black: '#000',
        white: '#fff',
        lightCaption: 'rgba(152, 152, 152, 0.7)',
        text: 'rgba(0, 0, 0, 0.87)',
        success: '#4caf50',
        warning: 'rgb(233, 196, 106)',
        error: '#f44336',
        info: '#00bcd4',
        background: '#F8F8F8'
      },
      primary: {
        main: '#25507B',
        dark: '#25507B',
        background: '#DAE5F0'
      },
      secondary: {
        main: '#3572B0',
        dark: '#25507B',
        background: '#DAE5F0'
      },
      error: {
        main: red.A400
      },
      success: {
        main: '#4caf50',
        contrastText: '#ffffff'
      },
      background: {
        main: '#fff'
      },
      text: {
        main: '#7B7B7B'
      }
    }
  })
);

export default theme;
