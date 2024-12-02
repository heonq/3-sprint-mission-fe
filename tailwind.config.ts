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
        background: 'var(--background)',
        foreground: 'var(--foreground)',

        primary: 'var(--primary-blue)',

        text: {
          black: {
            primary: 'var(--text-primary-black)',
            secondary: 'var(--text-secondary-black)',
          },
          gray: {
            primary: 'var(--text-primary-gray)',
            secondary: 'var(--text-secondary-gray)',
          },
          white: 'var(--text-primary-white)',
        },
        bg: {
          input: 'var(--input-background)',
          article: {
            best: 'var(--best-article-background)',
            normal: 'var(--normal-article-background)',
          },
          badge: {
            best: 'var(--best-badge-background)',
          },
          button: {
            active: 'var(--button-active-background)',
            disabled: 'var(--button-disabled-background)',
          },
        },

        border: {
          gnb: 'var(--gnb-border)',
          normalArticle: 'var(--normal-article-border)',
        },
      },
    },
  },
  plugins: [],
};
export default config;