import type { ThemeTokens } from '@/lib/site-config';

/** Converts site theme tokens into the CSS custom properties Tailwind reads. */
export function themeToCssVars(theme: ThemeTokens): string {
  return [
    `--color-primary: ${theme.primary};`,
    `--color-accent: ${theme.accent};`,
    `--color-bg: ${theme.bg};`,
    `--color-surface: ${theme.surface};`,
    `--color-text: ${theme.text};`,
    `--color-muted: ${theme.muted};`,
    `--font-heading: ${theme.headingFont};`,
    `--font-body: ${theme.bodyFont};`,
    `--radius-brand: ${theme.radius};`,
    `--heading-transform: ${theme.headingUppercase ? 'uppercase' : 'none'};`,
    `--heading-tracking: ${theme.headingUppercase ? '0.02em' : '-0.02em'};`
  ].join('\n  ');
}
