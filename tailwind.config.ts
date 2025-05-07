import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#1976d2',
        secondary: '#42a5f5',
        success: '#2e7d32',
        warning: '#ed6c02',
        error: '#d32f2f',
        background: '#f5f5f5',
        text: '#1a1a1a',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      fontSize: {
        'heading-1': '24px',
        'heading-2': '20px',
        'heading-3': '18px',
        'subtitle': '16px',
        'body': '14px',
        'small': '12px',
      },
    },
  },
  plugins: [],
};

export default config; 