"use client";

import Script from "next/script";

export default function JsonLd() {
    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "MotorcycleDealer",
        "name": "Xe Điện Đức Duy Cà Mau",
        "image": "https://xedienducduy.id.vn/logo(Ducduy).jpg",
        "description": "Hệ thống showroom Xe Điện Đức Duy uy tín số 1 tại Cà Mau. Chuyên phân phối xe máy điện, xe đạp điện TAILG chính hãng, giá tốt nhất.",
        "url": "https://xedienducduy.id.vn",
        "telephone": "+84943424787",
        "email": "camauducduy@gmail.com",
        "priceRange": "$",
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
            "latitude": "9.176",
            "longitude": "105.150"
        },
        "openingHoursSpecification": [
            {
                "@type": "OpeningHoursSpecification",
                "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
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
        ],
        "department": [
            {
                "@type": "MotorcycleDealer",
                "name": "Xe Điện Đức Duy - Showroom 2",
                "image": "https://xedienducduy.id.vn/logo(Ducduy).jpg",
                "telephone": "+84943424787",
                "address": {
                    "@type": "PostalAddress",
                    "streetAddress": "276B Ngô Quyền, Phường 1",
                    "addressLocality": "Cà Mau",
                    "addressRegion": "Cà Mau",
                    "postalCode": "970000",
                    "addressCountry": "VN"
                }
            }
        ]
    };

    return (
        <Script id="json-ld-schema" type="application/ld+json" strategy="lazyOnload">
            {JSON.stringify(jsonLd)}
        </Script>
    );
}
