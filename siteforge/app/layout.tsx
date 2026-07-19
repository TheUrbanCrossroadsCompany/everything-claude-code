import type { Metadata } from 'next';
import { getSite } from '@/lib/get-site';
import { ThemeStyle } from '@/components/ThemeStyle';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { HealthDisclaimer } from '@/components/HealthDisclaimer';
import './globals.css';

const site = getSite();

export const metadata: Metadata = {
  metadataBase: new URL(`https://${site.domain}`),
  title: {
    default: `${site.brandName} — ${site.tagline}`,
    template: `%s | ${site.brandName}`
  },
  description: site.description,
  openGraph: {
    siteName: site.brandName,
    type: 'website'
  }
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="flex min-h-screen flex-col">
        <ThemeStyle theme={site.theme} />
        <HealthDisclaimer site={site} />
        <Header site={site} />
        <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-8">{children}</main>
        <Footer site={site} />
      </body>
    </html>
  );
}
