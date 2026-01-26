'use client';

import Script from 'next/script';

export default function GoogleAnalytics({ gaId }: { gaId: string }) {
  // Avoid running Google Analytics in development to prevent console errors (net::ERR_ABORTED)
  // and data pollution.
  if (process.env.NODE_ENV === 'development') {
    return null;
  }

  return (
    <>
      {/* Google Analytics 4 (GA4) Script */}
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
        strategy="afterInteractive"
      />
      <Script id="google-analytics" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());

          gtag('config', '${gaId}');
        `}
      </Script>
    </>
  );
}
