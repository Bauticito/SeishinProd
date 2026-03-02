/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        /* Shadcn/ui compat — maps Tailwind classes to CSS vars */
        primary:    { DEFAULT: 'var(--primary)',    foreground: 'var(--primary-foreground)' },
        foreground: 'var(--foreground)',
        background: 'var(--background)',
        border:     'var(--border)',
        muted:      { DEFAULT: 'var(--background)', foreground: 'var(--muted-foreground)' },
        card:       { DEFAULT: 'var(--card-bg)',    foreground: 'var(--card-foreground)' },
        sidebar: {
          DEFAULT:    'var(--sidebar)',
          border:     'var(--sidebar-border)',
          accent:     'var(--sidebar-accent)',
          foreground: 'var(--sidebar-foreground)',
        },
        status: {
          ok:      'var(--status-ok)',
          warning: 'var(--status-warning)',
          error:   'var(--status-error)',
        },
        brand: {
          50:  '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          300: '#93c5fd',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
          900: '#1e3a8a',
        },
      },
      boxShadow: {
        panel: '0 1px 4px 0 rgba(0,0,0,0.08)',
      },
    },
  },
  plugins: [],
};
