import type { Config } from "tailwindcss";  // Fix the import name

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      backgroundColor: {
        '#fff6f9': '#fff6f9',
      },
      colors: {
        '#fff6f9': '#fff6f9',
        'ff47b0': '#ff47b0',
      },
    },
  },
  plugins: [],
};

export default config;