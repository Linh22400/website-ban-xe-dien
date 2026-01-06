import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
    // Dùng biến môi trường để tránh hardcode domain khi deploy nhiều môi trường.
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://xedienviet.com'

    return {
        rules: {
            userAgent: '*',
            allow: '/',
            disallow: ['/api/', '/admin/'],
        },
        sitemap: `${baseUrl}/sitemap.xml`,
    }
}
