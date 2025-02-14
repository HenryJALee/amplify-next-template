'use client';

import { Amplify } from 'aws-amplify';
import './globals.css';
import { Authenticator, ThemeProvider, createTheme } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';
import outputs from '@/amplify_outputs.json';

Amplify.configure(outputs);

//add theme to autheticator
const theme = createTheme({
  name: 'custom-theme',
  tokens: {
    colors: {
      primary: {
        10: '#FDF2F8',
        20: '#FCE7F3',
        40: '#F9A8D4',
        60: '#EC4899',
        80: '#BE185D',
        90: '#9D174D',
        100: '#831843',
      }
    }
  },
  breakpoints: {
    values: {
      base: 0,
      small: 480,
      medium: 768,
      large: 992,
      xl: 1280,
    }
  }
});

function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
       <ThemeProvider theme={theme}>
        <Authenticator.Provider>
          <Authenticator hideSignUp={true}>
            {children}
          </Authenticator>
        </Authenticator.Provider>
      </ThemeProvider>
      </body>
    </html>
  );
}

export default RootLayout;