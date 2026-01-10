import { MetadataRoute } from 'next'

export const revalidate = 3600;

const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337';

// Lấy danh sách slug theo phân trang để sitemap luôn đầy đủ.
async function fetchAllSlugs(endpoint: string, slugKeys: string[]): Promise<string[]> {
    const slugs: string[] = [];
    const pageSize = 100;
    let page = 1;
    let totalPages = 1;

    while (page <= totalPages) {
        const url = `${STRAPI_URL}${endpoint}&pagination[page]=${page}&pagination[pageSize]=${pageSize}`;

        // Nếu Strapi không chạy (ví dụ build CI), sitemap vẫn phải build được.
        let json: any;
        try {
            // Thêm timeout 10s để tránh build hang
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 10000);
            
            const res = await fetch(url, { 
                next: { revalidate },
                signal: controller.signal 
            });
            clearTimeout(timeoutId);
            
            if (!res.ok) break;
            json = await res.json();
        } catch {
            // Timeout hoặc network error: break khỏi loop
            console.warn(`Fetch timeout for ${endpoint}, returning partial slugs`);
            break;
        }

        const data = Array.isArray(json?.data) ? json.data : [];
        data.forEach((item: any) => {
            // Strapi v5 thường trả field trực tiếp; v4 có thể nằm trong attributes.
            const source = item?.attributes || item;
            const found = slugKeys.map((k) => source?.[k]).find(Boolean);
            if (typeof found === 'string' && found.trim()) slugs.push(found.trim());
        });

        const pagination = json?.meta?.pagination;
        totalPages = typeof pagination?.pageCount === 'number' ? pagination.pageCount : page;
        page += 1;
    }

    // Loại trùng slug nếu có.
    return Array.from(new Set(slugs));
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://xedienviet.com';

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
    }));

    // Dynamic pages từ Strapi
    let carSlugs: string[] = [];
    let blogSlugs: string[] = [];
    try {
        [carSlugs, blogSlugs] = await Promise.all([
            // car-model schema dùng field "slug"
            fetchAllSlugs('/api/car-models?fields[0]=slug', ['slug', 'Slug']),
            // article schema dùng field "Slug" (viết hoa)
            fetchAllSlugs('/api/articles?fields[0]=Slug', ['Slug', 'slug']),
        ]);
    } catch {
        // Fallback: chỉ trả về static pages nếu có lỗi kết nối.
        carSlugs = [];
        blogSlugs = [];
    }

    const carPages = carSlugs.map((slug) => ({
        url: `${baseUrl}/cars/${slug}`,
        lastModified: new Date(),
        changeFrequency: 'weekly' as const,
        priority: 0.9,
    }));

    const blogPages = blogSlugs.map((slug) => ({
        url: `${baseUrl}/blog/${slug}`,
        lastModified: new Date(),
        changeFrequency: 'weekly' as const,
        priority: 0.6,
    }));

    return [...staticPages, ...carPages, ...blogPages];
}
