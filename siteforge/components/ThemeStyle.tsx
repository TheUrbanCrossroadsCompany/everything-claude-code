import { themeToCssVars } from '@/lib/theme';
import type { ThemeTokens } from '@/lib/site-config';

/** Injects the active site's design tokens as CSS custom properties. */
export function ThemeStyle({ theme }: { theme: ThemeTokens }) {
  return <style>{`:root {\n  ${themeToCssVars(theme)}\n}`}</style>;
}
