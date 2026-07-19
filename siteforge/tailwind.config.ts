import type { Config } from 'tailwindcss';

// Every brand color is a CSS custom property injected by ThemeStyle from the
// active site config. Components must use these token classes — hardcoded
// brand values in components are a defect.
const config: Config = {
  content: [
    './app/**/*.{ts,tsx,mdx}',
    './components/**/*.{ts,tsx}',
    './sites/**/*.{ts,tsx,mdx}'
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          primary: 'rgb(var(--color-primary) / <alpha-value>)',
          accent: 'rgb(var(--color-accent) / <alpha-value>)',
          bg: 'rgb(var(--color-bg) / <alpha-value>)',
          surface: 'rgb(var(--color-surface) / <alpha-value>)',
          text: 'rgb(var(--color-text) / <alpha-value>)',
          muted: 'rgb(var(--color-muted) / <alpha-value>)'
        }
      },
      fontFamily: {
        heading: ['var(--font-heading)', 'system-ui', 'sans-serif'],
        body: ['var(--font-body)', 'system-ui', 'sans-serif']
      },
      borderRadius: {
        brand: 'var(--radius-brand)'
      }
    }
  },
  plugins: []
};

export default config;
