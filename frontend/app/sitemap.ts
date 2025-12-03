import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
    const baseUrl = 'https://xedienviet.com' // Thay bằng domain thật

    // Static pages
    const staticPages = [
        '',
        '/about',
        '/cars',
        '/compare',
        '/promotions',
        '/blog',
        '/contact',
    ].map((route) => ({
        url: `${baseUrl}${route}`,
        lastModified: new Date(),
        changeFrequency: 'weekly' as const,
        priority: route === '' ? 1 : 0.8,
    }))

    // Dynamic car pages (would fetch from API in production)
    const carPages = [
        'xe-dap-dien-giant',
        'xe-may-dien-vinfast-klara',
        'xe-dap-dien-trek',
        'xe-may-dien-yadea',
    ].map((slug) => ({
        url: `${baseUrl}/cars/${slug}`,
        lastModified: new Date(),
        changeFrequency: 'monthly' as const,
        priority: 0.9,
    }))

    // Blog pages (would fetch from API in production)
    const blogPages = [
        'tuong-lai-xe-dien',
        'tram-sac-dien-viet-nam',
        'pin-lithium-moi',
    ].map((slug) => ({
        url: `${baseUrl}/blog/${slug}`,
        lastModified: new Date(),
        changeFrequency: 'monthly' as const,
        priority: 0.6,
    }))

    return [...staticPages, ...carPages, ...blogPages]
}
