import React, { } from 'react';
import useMediaQuery from '@mui/material/useMediaQuery';
import darkScrollbar from '@mui/material/darkScrollbar';

import { BrowserRouter as Router } from 'react-router-dom';
import Routes from './Routes';

import { ThemeProvider, unstable_createMuiStrictModeTheme } from '@mui/material/styles';


const App = () => {
  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');

  const theme = React.useMemo(
    () =>
    unstable_createMuiStrictModeTheme({
        palette: {
          mode: prefersDarkMode ? 'dark' : 'light',
        },
        MuiCssBaseline: {
          styleOverrides: {
            body: prefersDarkMode === 'dark' ? darkScrollbar() : null,
          },
        },
        props: {
          MuiList: {
            dense: true,
          },
          MuiMenuItem: {
            dense: true,
          },
          MuiTable: {
            size: 'small',
          },
        },
      }),
    [prefersDarkMode],
  );

  return (
    <ThemeProvider theme={theme}>
      <Router>
        <main>
          <Routes />
        </main>
      </Router>
    </ThemeProvider>
  )
}

export default App