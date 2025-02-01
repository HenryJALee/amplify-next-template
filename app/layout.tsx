'use client';

import { Amplify } from 'aws-amplify';
import './globals.css';
import { Inter } from 'next/font/google';
import { Authenticator } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';
import outputs from '@/amplify_outputs.json';

const inter = Inter({ subsets: ['latin'] });

Amplify.configure(outputs);

function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Authenticator>
          {children}
        </Authenticator>
      </body>
    </html>
  );
}

export default RootLayout;