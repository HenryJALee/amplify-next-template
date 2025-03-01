'use client';

import { Amplify } from 'aws-amplify';
import './globals.css';
import { Authenticator, ThemeProvider, createTheme } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';
import outputs from '@/amplify_outputs.json';
import Image from 'next/image';
import { ReactNode } from 'react';

// Add the WonderSocietyButton component here
const WonderSocietyButton = () => {
  const handleClick = () => {
    window.open('https://forms.gle/yphHf7qyBqx4RwYv6', '_blank');
  };

  return (
    <div className="flex justify-center w-full">
      <button
        onClick={handleClick}
        className="mt-6 px-6 py-2 rounded-full bg-pink-500 hover:bg-pink-600 transition-colors duration-200 ease-in-out"
      >
        <span className="text-lg text-white">✨ Join the Wonder Society ✨</span>
      </button>
    </div>
  );
};

// Type safety for outputs
if (!outputs) {
  throw new Error('Amplify outputs not found');
}

try {
  Amplify.configure(outputs);
} catch (error) {
  console.error('Error configuring Amplify:', error);
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

interface RootLayoutProps {
  children: ReactNode;
}

function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en">
      <body>
        <Authenticator.Provider>
          <ThemeProvider theme={logintheme}>
            <Authenticator 
              hideSignUp={true} 
              components={{
                SignIn: {
                  Header() {
                    return (
                      <div className="w-full">
                        <div className="bg-[#fff6f9]">
                          <div className="bg-[#FFF6F9] flex flex-col items-center">
                            <div className="max-w-2xl mx-auto bg-[#fff6f9] w-full">
                              <div className="flex flex-col items-center">
                                <div className="relative">
                                  <Image 
                                    src="/icons/Wonderverse-logo-update.png"
                                    alt="Wonderverse Logo"
                                    width={300}
                                    height={104}
                                    priority
                                    onError={() => {
                                      console.error('Logo failed to load');
                                    }}
                                  />
                                </div>
                                <div className="relative mt-2">
                                  <Image 
                                    src="/icons/pink-yacht-club.png"
                                    alt="Pink Yacht Club Icon"
                                    width={150}
                                    height={150}
                                    priority
                                    onError={() => {
                                      console.error('Icon failed to load');
                                    }}
                                  />
                                </div>
                              </div>
                            </div>
                          </div>
                          <WonderSocietyButton />
                        </div>
                      </div>
                    );
                  }
                }
              }}
            >
              {children}
            </Authenticator>
          </ThemeProvider>
        </Authenticator.Provider>
      </body>
    </html>
  );
}

export default RootLayout;