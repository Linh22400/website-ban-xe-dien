// JSON-LD Structured Data helpers for SEO

export function generateProductSchema(product: {
    name: string;
    description: string;
    price: number;
    image: string;
    brand: string;
    url: string;
}) {
    return {
        '@context': 'https://schema.org',
        '@type': 'Product',
        name: product.name,
        description: product.description,
        image: product.image,
        brand: {
            '@type': 'Brand',
            name: product.brand,
        },
        offers: {
            '@type': 'Offer',
            url: product.url,
            priceCurrency: 'VND',
            price: product.price,
            availability: 'https://schema.org/InStock',
            seller: {
                '@type': 'Organization',
                name: 'Xe Điện Xanh',
            },
        },
    };
}

export function generateOrganizationSchema() {
    return {
        '@context': 'https://schema.org',
        '@type': 'Organization',
        name: 'Xe Điện Xanh',
        url: 'https://xedienviet.com',
        logo: 'https://xedienviet.com/logo.png',
        description: 'Cung cấp xe đạp điện và xe máy điện cao cấp tại Việt Nam',
        address: {
            '@type': 'PostalAddress',
            addressCountry: 'VN',
            addressLocality: 'TP. Hồ Chí Minh',
        },
        contactPoint: {
            '@type': 'ContactPoint',
            telephone: '+84-1900-xxxx',
            contactType: 'customer service',
            availableLanguage: 'Vietnamese',
        },
        sameAs: [
            'https://facebook.com/xedienviet',
            'https://instagram.com/xedienviet',
            'https://youtube.com/xedienviet',
        ],
    };
}

export function generateBreadcrumbSchema(items: { name: string; url: string }[]) {
    return {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: items.map((item, index) => ({
            '@type': 'ListItem',
            position: index + 1,
            name: item.name,
            item: item.url,
        })),
    };
}

export function generateArticleSchema(article: {
    title: string;
    description: string;
    image: string;
    datePublished: string;
    dateModified: string;
    author: string;
    url: string;
}) {
    return {
        '@context': 'https://schema.org',
        '@type': 'Article',
        headline: article.title,
        description: article.description,
        image: article.image,
        datePublished: article.datePublished,
        dateModified: article.dateModified,
        author: {
            '@type': 'Person',
            name: article.author,
        },
        publisher: {
            '@type': 'Organization',
            name: 'Xe Điện Xanh',
            logo: {
                '@type': 'ImageObject',
                url: 'https://xedienviet.com/logo.png',
            },
        },
        mainEntityOfPage: {
            '@type': 'WebPage',
            '@id': article.url,
        },
    };
}
