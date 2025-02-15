'use client';

import { Amplify } from 'aws-amplify';
import './globals.css';
import { Authenticator, ThemeProvider, createTheme } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';
import outputs from '@/amplify_outputs.json';
import Image from 'next/image';
import { ReactNode } from 'react';

// Type safety for outputs
if (!outputs) {
  throw new Error('Amplify outputs not found');
}

try {
  Amplify.configure(outputs);
} catch (error) {
  console.error('Error configuring Amplify:', error);
  // You might want to add error handling UI here
}

const logintheme = createTheme({
  name: 'custom-theme',
  tokens: {
    colors: {
      primary: {
        10: '#FFF6F9',
        20: '#FCE7F3',
        40: '#F9A8D4',
        60: '#EC4899',
        80: '#BE185D',
        90: '#ff47b0',
        100: '#ff6dec',
      }
    },
    components: {
      authenticator: {
        router: {
          borderWidth: '0px'
        
        }
      }
    }
  }
});

// Proper type definition
interface RootLayoutProps {
  children: ReactNode;
}

function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en">
      <body>

                  <Authenticator.Provider>
                    <Authenticator 
                      hideSignUp={true} 
                      components={{
                        SignIn: {
                          Header() {
                            return (
                              <ThemeProvider theme={logintheme}>
                              <div className="w-full">
                              <div className="bg-[#fff6f9] p-6">
                              <div className="min-h-screen bg-[#FFF6F9] flex flex-col items-center justify-center p-6">
                                <div className="max-w-2xl mx-auto bg-[#fff6f9] p-8 mb-8 w-full">
                                  <div className="flex flex-col items-center mb-8">
                                    <div className="mb-4 relative">
                                      <Image 
                                        src="/icons/Wonderverse-logo-update.png"
                                        alt="Wonderverse Logo"
                                        width={300}
                                        height={104}
                                        priority
                                        onError={(e: any) => {
                                          console.error('Logo failed to load');
                                          // Add fallback if needed
                                        }}
                                      />
                                    </div>
                                    <div className="mb-4 relative">
                                      <Image 
                                        src="/icons/pink-yacht-club.png"
                                        alt="Pink Yacht Club Icon"
                                        width={200}
                                        height={200}
                                        priority
                                        onError={() => {
                                          console.error('Icon failed to load');
                                          // Add fallback if needed
                                        }}
                                      />
                                    </div>
                                  </div>
                                  </div>
                                </div>

                                <p className="text-center mt-6 text-lg" style={{ color: "#ff47b0" }}>
                                  ✨ Join the Wonder Society ✨
                                </p>
                              </div>
                            </div>   
                              </ThemeProvider>
                            );
                          }
                        }
                      }
                    }
                  >
                      {children}
                    </Authenticator>
                  </Authenticator.Provider>
      </body>
    </html>
  );
}

export default RootLayout;