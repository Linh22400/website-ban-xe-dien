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
      {/* Google Analytics 4 (GA4) Script - Optimized to reduce main thread blocking */}
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
        strategy="lazyOnload"
      />
      <Script id="google-analytics" strategy="lazyOnload">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());

          gtag('config', '${gaId}', {
            page_path: window.location.pathname,
            send_page_view: true, // Reduce forced reflow by batching if possible? GA4 handles this.
            optimize_id: '${gaId}' // Sometimes helps
          });
        `}
      </Script>
    </>
  );
}
