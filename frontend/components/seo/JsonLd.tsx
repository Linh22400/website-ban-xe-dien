"use client";

import Script from "next/script";

export default function JsonLd() {
    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "MotorcycleDealer",
        "name": "Xe Điện Xanh",
        "image": "https://website-xe-dien.vercel.app/logo.png", // Placeholder or actual URL
        "description": "Nhà phân phối xe đạp điện, xe máy điện cao cấp chính hãng TAILG và các thương hiệu uy tín hàng đầu.",
        "address": {
            "@type": "PostalAddress",
            "streetAddress": "Số 1 Đại lộ Thăng Long",
            "addressLocality": "Hà Nội",
            "addressRegion": "HN",
            "postalCode": "100000",
            "addressCountry": "VN"
        },
        "geo": {
            "@type": "GeoCoordinates",
            "latitude": "21.000000", // Update with real coordinates if available
            "longitude": "105.800000"
        },
        "url": "https://website-xe-dien.vercel.app",
        "telephone": "+84988888888",
        "priceRange": "$$",
        "openingHoursSpecification": [
            {
                "@type": "OpeningHoursSpecification",
                "dayOfWeek": [
                    "Monday",
                    "Tuesday",
                    "Wednesday",
                    "Thursday",
                    "Friday",
                    "Saturday",
                    "Sunday"
                ],
                "opens": "08:00",
                "closes": "21:00"
            }
        ]
    };

    return (
        <Script id="json-ld-schema" type="application/ld+json" strategy="lazyOnload">
            {JSON.stringify(jsonLd)}
        </Script>
    );
}
