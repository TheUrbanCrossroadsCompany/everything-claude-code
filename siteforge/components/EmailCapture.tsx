import type { SiteConfig } from '@/lib/site-config';

/**
 * Kit (ConvertKit) email capture. Uses the form ID from config — the real
 * embed script is added at deploy time; this renders an accessible,
 * layout-stable placeholder form wired to the Kit endpoint pattern.
 */
export function EmailCapture({
  site,
  placement
}: {
  site: SiteConfig;
  placement: 'footer' | 'inline';
}) {
  const formId = site.monetization.emailFormId;
  if (!formId) return null;
  return (
    <section
      aria-label="Email signup"
      className="rounded-brand border border-brand-primary/20 bg-brand-primary/5 p-6"
    >
      <h2 className="text-lg font-bold">
        {site.monetization.leadMagnetTitle ?? `Get the best of ${site.brandName}`}
      </h2>
      <p className="mt-1 text-sm text-brand-muted">
        One useful email a week. No spam, unsubscribe anytime.
      </p>
      <form
        action={`https://app.kit.com/forms/${formId}/subscriptions`}
        method="post"
        className="mt-4 flex flex-col gap-3 sm:flex-row"
        data-placement={placement}
      >
        <label className="sr-only" htmlFor={`email-${placement}`}>
          Email address
        </label>
        <input
          id={`email-${placement}`}
          type="email"
          name="email_address"
          required
          placeholder="you@example.com"
          className="w-full rounded-brand border border-brand-text/20 bg-brand-surface px-4 py-2 text-sm"
        />
        <button
          type="submit"
          className="rounded-brand bg-brand-primary px-6 py-2 text-sm font-semibold text-white hover:opacity-90"
        >
          Subscribe
        </button>
      </form>
    </section>
  );
}
