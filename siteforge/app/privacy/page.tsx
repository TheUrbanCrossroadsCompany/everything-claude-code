import type { Metadata } from 'next';
import { getSite } from '@/lib/get-site';

export const metadata: Metadata = { title: 'Privacy Policy' };

export default function PrivacyPage() {
  const site = getSite();
  return (
    <div className="prose-site mx-auto max-w-3xl">
      <h1 className="text-3xl">Privacy Policy</h1>
      <p>
        This policy describes how {site.compliance.legalEntity} (&quot;we&quot;) handles
        information on {site.domain}.
      </p>
      <h2>What we collect</h2>
      <ul>
        <li>
          <strong>Tracker data:</strong> daily habit entries and optional glucose/ketone values
          are stored only in your browser&apos;s local storage. They are never transmitted to us.
        </li>
        <li>
          <strong>Email signup:</strong> if you subscribe, your email address is processed by our
          email provider to send you the newsletter.
        </li>
        <li>
          <strong>Analytics:</strong> we use privacy-respecting, aggregate analytics to
          understand which pages are useful.
        </li>
      </ul>
      <h2>What we do not do</h2>
      <ul>
        <li>We do not sell personal information.</li>
        <li>We do not collect health data on our servers.</li>
      </ul>
      <h2>Contact</h2>
      <p>
        Questions: <a href={`mailto:${site.compliance.contactEmail}`}>{site.compliance.contactEmail}</a>
      </p>
    </div>
  );
}
