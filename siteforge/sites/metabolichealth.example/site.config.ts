import { defineSiteConfig } from '@/lib/site-config';

/**
 * Demo site: metabolic-health education + daily six-pillar tracker,
 * inspired by publicly discussed metabolic-health research.
 *
 * Educational content only — nothing on this site diagnoses, treats,
 * cures, or prevents any disease. healthDisclaimer is mandatory ON.
 */
export default defineSiteConfig({
  domain: 'metabolichealth.example',
  brandName: 'MetaboWell',
  tagline: 'Learn the six pillars. Track them daily. Grade your progress.',
  niche: 'health-education',
  description:
    'A fun, science-curious education and daily tracking app for metabolic health: food quality, exercise, stress, forever-chemical reduction, clean water, and glucose–ketone awareness.',
  theme: {
    primary: '13 148 136',
    accent: '234 88 12',
    bg: '250 250 249',
    surface: '255 255 255',
    text: '28 25 23',
    muted: '87 83 78',
    headingFont: "'Avenir Next', 'Segoe UI', system-ui",
    bodyFont: "'Avenir Next', 'Segoe UI', system-ui",
    radius: '1rem'
  },
  nav: [
    { label: 'Six Pillars', href: '/pillars' },
    { label: 'Daily Tracker', href: '/tracker' },
    { label: 'Articles', href: '/articles' }
  ],
  footerNav: [
    { label: 'Privacy', href: '/privacy' },
    { label: 'Terms', href: '/terms' },
    { label: 'Disclosure', href: '/disclosure' }
  ],
  monetization: {
    primaryCta: 'email',
    affiliatePrograms: [
      {
        id: 'amazon',
        name: 'Amazon Associates',
        network: 'amazon',
        trackingParam: 'tag=AMAZON_ASSOC_TAG_PLACEHOLDER'
      }
    ],
    emailFormId: 'KIT_FORM_ID_PLACEHOLDER',
    leadMagnetTitle: 'Free: The 6-Pillar Metabolic Health Starter Checklist',
    adsEnabled: false,
    sponsorsEnabled: false
  },
  compliance: {
    affiliateDisclosure: true,
    healthDisclaimer: true,
    cryptoDisclaimer: false,
    legalEntity: 'The Urban Crossroads Company LLC',
    contactEmail: 'hello@metabolichealth.example'
  },
  analytics: {
    provider: 'plausible',
    id: 'PLAUSIBLE_DOMAIN_PLACEHOLDER'
  },
  author: {
    name: 'The MetaboWell Team',
    bio: 'Curious humans translating metabolic-health research into simple daily habits. We are not doctors, and this site is education — not medical advice.'
  },
  features: {
    tracker: true,
    pillars: true
  }
});
