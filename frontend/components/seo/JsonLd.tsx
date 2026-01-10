"use client";

import Script from "next/script";

export default function JsonLd() {
    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "MotorcycleDealer",
        "name": "Xe Điện Đức Duy",
        "image": "https://xedienducduy.id.vn/logo(Ducduy).jpg",
        "description": "Nhà phân phối xe đạp điện, xe máy điện cao cấp chính hãng TAILG và các thương hiệu uy tín hàng đầu tại Cà Mau.",
        "address": {
            "@type": "PostalAddress",
            "streetAddress": "118 Nguyễn Tất Thành, Phường 8",
            "addressLocality": "Cà Mau",
            "addressRegion": "Cà Mau",
            "postalCode": "970000",
            "addressCountry": "VN"
        },
        "geo": {
            "@type": "GeoCoordinates",
            "latitude": "9.17",
            "longitude": "105.15"
        },
        "url": "https://xedienducduy.id.vn",
        "telephone": "+84943424787",
        "email": "camauducduy@gmail.com",
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
                "closes": "20:00"
            }
        ],
        "areaServed": {
            "@type": "City",
            "name": "Cà Mau"
        },
        "sameAs": [
            "https://facebook.com/xedienducduy",
            "https://instagram.com/xedienducduy"
        ]
    };

    return (
        <Script id="json-ld-schema" type="application/ld+json" strategy="lazyOnload">
            {JSON.stringify(jsonLd)}
        </Script>
    );
}
