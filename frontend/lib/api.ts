import qs from "qs";
import { apiCache } from './cache';

export interface Warranty {
    // Tùy schema Strapi, giữ linh hoạt để tránh gãy type khi backend đổi cấu trúc.
    [key: string]: any;
}

export interface Car {
    id: string;
    documentId: string;
    slug: string;
    name: string;
    price: number;
    brand: string;
    type: 'bicycle' | 'motorcycle';
    range: number;
    topSpeed: number;
    acceleration: number;
    description: string;
    thumbnail: string;
    thumbnailId?: number;
    isFeatured: boolean;
    modelUrl?: string;
    colors: {
        name: string;
        hex: string;
        images: string[];
        imageIds?: number[];
        price?: number;
        stock?: number;
    }[];
    features: any[];
    options?: {
        name: string;
        group: string;
        priceAdjustment: number;
        stock: number;
    }[];
    specifications: any[];
    technicalImage?: string;
    warranty?: Warranty;
    stock: number;
    sold?: number;
}

export interface PaginationMeta {
    page: number;
    pageSize: number;
    pageCount: number;
    total: number;
}

export interface GetCarsResult {
    cars: Car[];
    pagination?: PaginationMeta;
}

export interface LeadData {
    name: string;
    phone: string;
    email?: string;
    message?: string;
    [key: string]: any;
}

export interface User {
    id: number;
    username: string;
    email: string;
    [key: string]: any;
}

export interface AuthResponse {
    jwt: string;
    user: User;
}

export interface RegisterData {
    username: string;
    email: string;
    password: string;
}

export interface LoginData {
    identifier: string;
    password: string;
}

// Auto-detect Strapi URL based on environment
// Development: use local backend
// Production: use production backend from env or auto-detect
const getApiUrl = () => {
    // If explicitly set, use it
    if (process.env.NEXT_PUBLIC_STRAPI_URL) {
        return process.env.NEXT_PUBLIC_STRAPI_URL;
    }

    // In development (local), default to localhost
    if (process.env.NODE_ENV === 'development') {
        return 'http://localhost:1337';
    }

    // In production, use production backend
    return 'https://website-ban-xe-dien.onrender.com';
};

const STRAPI_URL = getApiUrl();
const DEBUG_LOG = process.env.NODE_ENV !== 'production';

async function getApiErrorMessage(response: Response, fallbackMessage: string) {
    try {
        const data = await response.json();
        const message =
            data?.error?.message ||
            data?.message ||
            data?.error ||
            fallbackMessage;
        const retryAfterSec = Number(data?.error?.retryAfterSec);
        if (Number.isFinite(retryAfterSec) && retryAfterSec > 0) {
            return `${String(message)} (thử lại sau ${retryAfterSec}s)`;
        }
        return String(message);
    } catch {
        return fallbackMessage;
    }
}

// Khi chạy `next build`, nếu Strapi không bật thì các fetch sẽ fail (ECONNREFUSED).
// Đây là trường hợp “bình thường” trong CI/build, nên ta không in console.error để log sạch.
const IS_NEXT_BUILD_PHASE = (typeof process !== 'undefined' && process.env?.NEXT_PHASE === 'phase-production-build');

function logFetchIssue(context: string, error: unknown) {
    if (IS_NEXT_BUILD_PHASE) return;
    console.error(context, error);
}

async function logNonOkResponse(context: string, response: Response) {
    if (IS_NEXT_BUILD_PHASE) return;
    try {
        const text = await response.text();
        console.error(context, text);
    } catch (error) {
        console.error(context, error);
    }
}

// Ghi chú: Trong Next.js, fetch ở server có thể dùng ISR (revalidate) để tăng tốc và tốt cho SEO.
// Browser-side fetch cũng nên cache với stale-while-revalidate để tăng tốc UX.
function getDefaultFetchOptions(revalidateSeconds: number = 300): RequestInit & { next?: { revalidate: number } } {
    if (typeof window === 'undefined') {
        // Server-side: Dùng Next.js ISR
        return { next: { revalidate: revalidateSeconds } };
    }
    // Browser-side: Cache với max-age để tăng tốc
    return {
        cache: 'force-cache',
        next: { revalidate: revalidateSeconds }
    };
}

/**
 * Cached fetch wrapper for client-side API calls
 * Automatically caches responses in memory to prevent redundant requests
 */
async function cachedFetch<T>(
    url: string,
    options: RequestInit = {},
    ttlSeconds: number = 60
): Promise<T | null> {
    // Check cache first (client-side only)
    if (typeof window !== 'undefined') {
        const cached = apiCache.get<T>(url);
        if (cached) {
            return cached;
        }
    }

    try {
        const response = await fetch(url, options);
        if (!response.ok) return null;

        const data = await response.json();

        // Cache the result (client-side only)
        if (typeof window !== 'undefined') {
            apiCache.set(url, data, ttlSeconds);
        }

        return data as T;
    } catch (error) {
        console.error('Fetch error:', error);
        return null;
    }
}

// Fallback images for each product type
const FALLBACK_IMAGES: Record<string, string> = {
    'bicycle': '/images/placeholder-bicycle.svg',
    'motorcycle': '/images/placeholder-motorcycle.svg',
};

// Transform Strapi response to our Car interface
function transformStrapiCar(strapiCar: any): Car {
    // Strapi v5 flat structure - no nested attributes
    const slug = strapiCar.slug || strapiCar.name?.toLowerCase().replace(/\s+/g, '-') || '';
    const type = strapiCar.type || 'bicycle';

    // Get thumbnail URL - Strapi v5 returns thumbnail directly
    let thumbnailUrl = FALLBACK_IMAGES[type] || FALLBACK_IMAGES['bicycle'];
    let thumbnailId = undefined;

    if (strapiCar.thumbnail?.url) {
        const imageUrl = strapiCar.thumbnail.url;
        thumbnailUrl = imageUrl.startsWith('http')
            ? imageUrl
            : `${STRAPI_URL}${imageUrl}`;
        thumbnailId = strapiCar.thumbnail.id;
    }

    // Get Technical Image URL
    let technicalImageUrl = undefined;
    if (strapiCar.technicalImage?.url) {
        const techUrl = strapiCar.technicalImage.url;
        technicalImageUrl = techUrl.startsWith('http')
            ? techUrl
            : `${STRAPI_URL}${techUrl}`;
    }

    // Ưu tiên dùng id/documentId ổn định để tránh lỗi hydration và key bị thay đổi.
    const stableId = strapiCar.id?.toString() || (strapiCar.documentId ? String(strapiCar.documentId) : (slug ? `slug:${slug}` : 'unknown'));

    return {
        id: stableId,
        documentId: strapiCar.documentId || strapiCar.id?.toString() || stableId,
        slug: slug,
        name: strapiCar.name || 'Unknown',
        brand: strapiCar.brand || 'Unknown',
        type: type,
        price: parseFloat(strapiCar.price) || 0,
        range: parseInt(strapiCar.range) || 0,
        topSpeed: parseInt(strapiCar.topSpeed) || 0,
        acceleration: parseFloat(strapiCar.acceleration) || 0,
        description: strapiCar.description || '',
        thumbnail: thumbnailUrl,
        thumbnailId: thumbnailId,
        // Hỗ trợ nhiều tên field để tránh lệch schema giữa Strapi (isFeatured vs featured).
        isFeatured: Boolean(strapiCar.isFeatured ?? strapiCar.IsFeatured ?? strapiCar.featured ?? strapiCar.Featured ?? false),
        modelUrl: strapiCar.model3D?.url
            ? `${STRAPI_URL}${strapiCar.model3D.url}`
            : undefined,
        colors: Array.isArray(strapiCar.colors || strapiCar.color)
            ? (strapiCar.colors || strapiCar.color)
                .filter((c: any) => c && c.name) // Filter out null/undefined colors
                .map((c: any) => {
                    // Handle multiple images
                    let images: string[] = [];
                    let imageIds: number[] = [];

                    if (c.images && Array.isArray(c.images)) {
                        images = c.images.map((img: any) =>
                            img.url ? (img.url.startsWith('http') ? img.url : `${STRAPI_URL}${img.url}`) : ''
                        ).filter(Boolean);
                        imageIds = c.images.map((img: any) => img.id).filter(Boolean);
                    } else if (c.image?.url) {
                        // Fallback for single image legacy data
                        const imgUrl = c.image.url.startsWith('http') ? c.image.url : `${STRAPI_URL}${c.image.url}`;
                        images = [imgUrl];
                        if (c.image.id) imageIds = [c.image.id];
                    }

                    return {
                        name: c.name || 'Unknown',
                        hex: c.hex || '#000000',
                        images: images,
                        imageIds: imageIds,
                        price: typeof c.price === 'number' ? c.price : undefined,
                        stock: typeof c.stock === 'number' ? c.stock : undefined
                    };
                })
            : [],
        features: strapiCar.features || [],
        options: Array.isArray(strapiCar.options) ? strapiCar.options.map((opt: any) => ({
            name: opt.name,
            group: opt.group || 'Other',
            priceAdjustment: parseFloat(opt.priceAdjustment) || 0,
            stock: opt.stock || 0
        })) : [],
        specifications: strapiCar.specifications || [],
        technicalImage: technicalImageUrl,
        warranty: strapiCar.warranty || undefined,
        stock: strapiCar.stock || 0,
        sold: typeof strapiCar.sold === 'number' ? strapiCar.sold : (parseInt(strapiCar.sold) || 0)
    };
}

export interface HeroSlide {
    id: number;
    title: string;
    subtitle: string;
    desc: string;
    image: string;
    link: string;
    color: string;
    order: number;
}

export interface Promotion {
    id: number;
    title: string;
    description: string;
    discountTag: string;
    image: string;
    link: string;
    expiryDate: string | null;
    isActive: boolean;
    discountPercent?: number;
    car_models?: any[];
}

export interface ArticleCategory {
    id: number;
    name: string;
    slug: string;
}

export interface Article {
    id: number;
    title: string;
    slug: string;
    excerpt: string;
    content: any[]; // Dynamic Zone
    coverImage: string;
    category?: ArticleCategory;
    author?: string;
    publishedDate?: string;
    readingTime?: number;
    featured?: boolean;
    tags?: string;
}

export async function getArticles(): Promise<Article[]> {
    try {
        const url = `${STRAPI_URL}/api/articles?populate[0]=Cover_image&populate[1]=category&sort=createdAt:desc`;
        
        // Use direct fetch with robust error handling for build stability
        const response = await fetch(url, {
            ...getDefaultFetchOptions(180)
        });

        if (!response.ok) {
            // Log error even during build to help debugging
            console.error(`Failed to fetch articles: ${response.status} ${response.statusText}`);
            return [];
        }

        const data = await response.json();

        if (!data || !data.data) return [];

        return data.data
            .map((item: any) => {
                try {
                    return transformStrapiArticle(item);
                } catch (err) {
                    console.error("Error transforming article:", err);
                    return null;
                }
            })
            .filter((item: any): item is Article => item !== null);
            
    } catch (error) {
        // Ensure we log errors even in production build for this critical path
        console.error("Error fetching articles:", error);
        return [];
    }
}

export async function getArticleBySlug(slug: string): Promise<Article | undefined> {
    try {
        // Lưu ý: Slug của Article trong Strapi đang là field "Slug" (viết hoa).
        // Dùng qs để build query rõ ràng + tránh lỗi encode.
        const query = qs.stringify({
            filters: {
                Slug: {
                    $eq: slug,
                },
            },
            populate: {
                Cover_image: true,
                category: true,
                OG_Image: true,
                content: {
                    on: {
                        'product.article-text': {
                            populate: '*',
                        },
                        'product.article-image': {
                            populate: '*',
                        },
                        'product.article-section': {
                            populate: '*',
                        },
                        'product.article-gallery': {
                            populate: '*',
                        },
                        'product.article-two-column': {
                            populate: '*',
                        },
                    },
                },
            },
        }, {
            // Encode giá trị để URL an toàn hơn (đặc biệt khi slug có ký tự đặc biệt).
            encodeValuesOnly: true,
        });

        const url = `${STRAPI_URL}/api/articles?${query}`;
        const response = await fetch(url, { ...getDefaultFetchOptions(60) });

        if (!response.ok) {
            await logNonOkResponse("Article fetch failed:", response);
            return undefined;
        }

        const data = await response.json();

        if (data.data.length === 0) return undefined;

        return transformStrapiArticle(data.data[0]);
    } catch (error) {
        logFetchIssue("Error fetching article:", error);
        return undefined;
    }
}

function transformStrapiArticle(item: any): Article {
    // Handle potential field name variations from user's manual creation
    const coverImageBlob = item.Cover_image || item.cover_image || item.coverImage;
    let coverImageUrl = '';

    if (coverImageBlob?.url) {
        coverImageUrl = coverImageBlob.url.startsWith('http')
            ? coverImageBlob.url
            : `${STRAPI_URL}${coverImageBlob.url}`;
    }

    const categoryData = item.category || item.Category;
    let category: ArticleCategory | undefined;

    if (categoryData) {
        // Handle both direct object or data wrapper (Strapi v4 vs v5)
        const cat = categoryData.data || categoryData;
        if (cat) {
            category = {
                id: cat.id,
                name: cat.name || cat.Name || 'Tin tức',
                slug: cat.slug || ''
            };
        }
    }

    return {
        id: item.id,
        title: item.Title || item.title || '',
        slug: item.Slug || item.slug || '',
        excerpt: item.Excerpt || item.excerpt || '',
        content: item.Content || item.content || [],
        coverImage: coverImageUrl,
        category: category,
        author: item.Author || item.author,
        publishedDate: item.Published_Date || item.published_date || item.publishedDate,
        readingTime: item.Reading_Time || item.reading_time || item.readingTime,
        featured: item.Featured || item.featured || false,
        tags: item.Tags || item.tags
    };
}

export async function getPromotions(): Promise<Promotion[]> {
    try {
        const url = `${STRAPI_URL}/api/promotions?filters[isActive][$eq]=true&populate[0]=image&populate[1]=car_models&sort=createdAt:desc`;
        const data = await cachedFetch<any>(url, getDefaultFetchOptions(180), 180);

        if (!data || !data.data) return [];

        return data.data.map((item: any) => ({
            id: item.id,
            title: item.title || '',
            description: item.description || '',
            discountTag: item.discountTag || '',
            image: item.image?.url ? (item.image.url.startsWith('http') ? item.image.url : `${STRAPI_URL}${item.image.url}`) : '',
            link: item.link || '/cars',
            expiryDate: item.expiryDate || null,
            isActive: item.isActive ?? true,
            discountPercent: item.discountPercent || 0,
            // Handle both Strapi v4 (data wrapper) and v5 (direct array) styles just in case, 
            // but based on observation it's likely array or data wrapper. 
            // Let's normalize to array.
            car_models: Array.isArray(item.car_models) ? item.car_models : (item.car_models?.data || [])
        }));
    } catch (error) {
        logFetchIssue("Error fetching promotions:", error);
        return [];
    }
}

export async function getHeroSlides(): Promise<HeroSlide[]> {
    try {
        const url = `${STRAPI_URL}/api/hero-slides?populate=*&sort=order:asc`;
        const data = await cachedFetch<any>(url, getDefaultFetchOptions(300), 300);

        if (!data || !data.data) return [];

        return data.data.map((item: any) => ({
            id: item.id,
            title: item.title || '',
            subtitle: item.subtitle || '',
            desc: item.desc || '',
            image: item.image?.url ? (item.image.url.startsWith('http') ? item.image.url : `${STRAPI_URL}${item.image.url}`) : '',
            link: item.link || '',
            color: item.color || 'from-primary/80 to-blue-600/80',
            order: item.order || 0
        }));
    } catch (error) {
        console.error("Error fetching hero slides:", error);
        return [];
    }
}

export async function getFeaturedCars(): Promise<Car[]> {
    try {
        // Hỗ trợ cả 2 schema: isFeatured (thường) hoặc featured (một số content-type cũ).
        const featuredFilter = [
            'filters[$or][0][isFeatured][$eq]=true',
            'filters[$or][1][featured][$eq]=true',
        ].join('&');

        const url = `${STRAPI_URL}/api/car-models?${featuredFilter}&populate[0]=thumbnail&populate[1]=model3D&populate[2]=colors.images&populate[3]=technicalImage&populate[4]=warranty&populate[5]=options`;
        const data = await cachedFetch<any>(url, getDefaultFetchOptions(300), 300);

        if (!data || !data.data) return [];

        return data.data.map(transformStrapiCar);
    } catch (error) {
        console.error("Error fetching featured cars:", error);
        return [];
    }
}


export interface GetCarsParams {
    type?: string;
    brand?: string;
    search?: string;
    minPrice?: number;
    maxPrice?: number;
    minRange?: number;
    maxRange?: number;
    minSpeed?: number;
    maxSpeed?: number;
    sort?: string;
    page?: number;
    pageSize?: number;
}

export async function getCarsWithMeta(params: GetCarsParams = {}): Promise<GetCarsResult> {
    try {
        const { type, brand, search, minPrice, maxPrice, sort, page = 1, pageSize = 12 } = params;

        // Build query parts
        const queryParts = [
            'populate[0]=thumbnail',
            'populate[1]=model3D',
            'populate[2]=colors.images',
            'populate[3]=technicalImage',
            'populate[4]=warranty',
            'populate[5]=options',
            `pagination[page]=${page}`,
            `pagination[pageSize]=${pageSize}`
        ];

        // Add filters
        if (type) queryParts.push(`filters[type][$eq]=${encodeURIComponent(type)}`);
        if (brand) queryParts.push(`filters[brand][$eq]=${encodeURIComponent(brand)}`);

        // Search by name/brand/slug (case-insensitive)
        if (search && search.trim()) {
            const q = encodeURIComponent(search.trim());
            queryParts.push(`filters[$or][0][name][$containsi]=${q}`);
            queryParts.push(`filters[$or][1][brand][$containsi]=${q}`);
            queryParts.push(`filters[$or][2][slug][$containsi]=${q}`);
        }
        if (minPrice !== undefined) queryParts.push(`filters[price][$gte]=${minPrice}`);
        if (maxPrice !== undefined) queryParts.push(`filters[price][$lte]=${maxPrice}`);

        // Add range filters
        if (params.minRange !== undefined) queryParts.push(`filters[range][$gte]=${params.minRange}`);
        if (params.maxRange !== undefined) queryParts.push(`filters[range][$lte]=${params.maxRange}`);

        // Add speed filters (field trong Strapi đang là topSpeed)
        if (params.minSpeed !== undefined) queryParts.push(`filters[topSpeed][$gte]=${params.minSpeed}`);
        if (params.maxSpeed !== undefined) queryParts.push(`filters[topSpeed][$lte]=${params.maxSpeed}`);

        // Add sort
        if (sort) {
            queryParts.push(`sort=${encodeURIComponent(sort)}`);
        } else {
            queryParts.push('sort=createdAt:desc'); // Default sort
        }

        const queryString = queryParts.join('&');
        const url = `${STRAPI_URL}/api/car-models?${queryString}`;

        const response = await fetch(url, {
            ...getDefaultFetchOptions(60)
        });

        if (!response.ok) {
            await logNonOkResponse('Cars fetch failed:', response);
            return { cars: [] };
        }

        const data = await response.json();

        const cars = Array.isArray(data?.data) ? data.data.map(transformStrapiCar) : [];
        const pagination = data?.meta?.pagination;
        const meta: PaginationMeta | undefined = pagination && typeof pagination === 'object'
            ? {
                page: typeof pagination.page === 'number' ? pagination.page : page,
                pageSize: typeof pagination.pageSize === 'number' ? pagination.pageSize : pageSize,
                pageCount: typeof pagination.pageCount === 'number' ? pagination.pageCount : 1,
                total: typeof pagination.total === 'number' ? pagination.total : cars.length,
            }
            : undefined;

        return { cars, pagination: meta };
    } catch (error) {
        logFetchIssue('Error fetching cars:', error);
        return { cars: [] };
    }
}

export async function getCars(params: GetCarsParams = {}): Promise<Car[]> {
    const result = await getCarsWithMeta(params);
    return result.cars;
}

export async function getProductsCount(): Promise<number> {
    try {
        const response = await fetch(`${STRAPI_URL}/api/car-models?pagination[pageSize]=1`, {
            next: { revalidate: 60 }
        });
        if (!response.ok) return 0;
        const data = await response.json();
        return data.meta?.pagination?.total || 0;
    } catch (error) {
        console.error("Error fetching products count:", error);
        return 0;
    }
}

export async function getCarById(documentId: string): Promise<Car | undefined> {
    try {
        // Use filters instead of direct ID endpoint to avoid 404 if findOne permission is missing
        const response = await fetch(
            `${STRAPI_URL}/api/car-models/${documentId}?populate[0]=thumbnail&populate[1]=model3D&populate[2]=colors.images&populate[3]=warranty&populate[4]=options`,
            { ...getDefaultFetchOptions(60) }
        );

        if (!response.ok) {
            return undefined;
        }

        const data = await response.json();

        // Check for single object response (Strapi "Get One")
        if (data.data) {
            return transformStrapiCar(data.data);
        }

        return undefined;
    } catch (error) {
        console.error('Error fetching car by ID:', error);
        return undefined;
    }
}

export async function getCarBySlug(slug: string): Promise<Car | undefined> {
    try {
        const safeSlug = encodeURIComponent(slug);
        const response = await fetch(
            `${STRAPI_URL}/api/car-models?filters[slug][$eq]=${safeSlug}&populate[0]=thumbnail&populate[1]=model3D&populate[2]=colors.images&populate[3]=technicalImage&populate[4]=warranty&populate[5]=options`,
            { ...getDefaultFetchOptions(60) }
        );

        if (!response.ok) {
            throw new Error('Failed to fetch car');
        }

        const data = await response.json();

        if (data.data.length === 0) {
            return undefined;
        }

        return transformStrapiCar(data.data[0]);
    } catch (error) {
        console.error('Error fetching car:', error);
        return undefined;
    }
}

export async function getRelatedCars(currentSlug: string, type: string, limit: number = 3): Promise<Car[]> {
    try {
        const response = await fetch(
            `${STRAPI_URL}/api/car-models?filters[slug][$ne]=${currentSlug}&filters[type][$eq]=${type}&pagination[limit]=${limit}&populate[0]=thumbnail&populate[1]=model3D&populate[2]=colors.images&populate[3]=options`,
            { ...getDefaultFetchOptions(60) }
        );

        if (!response.ok) {
            return [];
        }

        const data = await response.json();
        return data.data.map(transformStrapiCar);
    } catch (error) {
        console.error('Error fetching related cars:', error);
        return [];
    }
}

export async function getCarsBySlugs(slugs: string[]): Promise<Car[]> {
    if (slugs.length === 0) return [];

    try {
        // Build OR filter for slugs
        const slugFilters = slugs.map((slug, index) => `filters[slug][$in][${index}]=${slug}`).join('&');

        const response = await fetch(
            `${STRAPI_URL}/api/car-models?${slugFilters}&populate[0]=thumbnail&populate[1]=model3D&populate[2]=colors.images&populate[3]=options`,
            { ...getDefaultFetchOptions(60) }
        );

        if (!response.ok) {
            return [];
        }

        const data = await response.json();
        return data.data.map(transformStrapiCar);
    } catch (error) {
        console.error('Error fetching cars by slugs:', error);
        return [];
    }
}

export async function submitLead(leadData: LeadData): Promise<boolean> {
    try {
        const response = await fetch(`${STRAPI_URL}/api/leads`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                data: leadData
            }),
        });

        if (!response.ok) {
            const message = await getApiErrorMessage(response, 'Gửi yêu cầu thất bại. Vui lòng thử lại.');
            throw new Error(message);
        }

        return true;
    } catch (error) {
        console.error('Error submitting lead:', error);
        throw error;
    }
}

// ============================================
// Authentication Functions
// ============================================

export async function registerUser(data: RegisterData): Promise<AuthResponse | null> {
    try {
        const response = await fetch(`${STRAPI_URL}/api/auth/local/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error('Registration failed:', errorText);
            throw new Error('Registration failed');
        }

        const authData: AuthResponse = await response.json();
        return authData;
    } catch (error) {
        console.error('Error registering user:', error);
        return null;
    }
}

// ============================================
// Admin Product Functions
// ============================================

export async function createCar(token: string, data: any): Promise<boolean> {
    try {
        const response = await fetch(`${STRAPI_URL}/api/car-models`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ data }),
        });

        return response.ok;
    } catch (error) {
        console.error('Error creating car:', error);
        return false;
    }
}

export async function updateCar(token: string, documentId: string, data: any): Promise<boolean> {
    try {
        const response = await fetch(`${STRAPI_URL}/api/car-models/${documentId}`, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ data }),
        });

        return response.ok;
    } catch (error) {
        console.error('Error updating car:', error);
        return false;
    }
}

export async function deleteCar(token: string, documentId: string): Promise<boolean> {
    try {
        const response = await fetch(`${STRAPI_URL}/api/car-models/${documentId}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        });

        return response.ok;
    } catch (error) {
        console.error('Error deleting car:', error);
        return false;
    }
}

export async function uploadFile(token: string, file: File): Promise<any[] | null> {
    try {
        const formData = new FormData();
        formData.append('files', file);

        const response = await fetch(`${STRAPI_URL}/api/upload`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
            },
            body: formData,
        });

        if (!response.ok) {
            console.error('Upload failed:', await response.text());
            return null;
        }

        const data = await response.json();
        return data; // Return the full array of files
    } catch (error) {
        console.error('Error uploading file:', error);
        return null;
    }
}

export async function loginUser(data: LoginData): Promise<AuthResponse | null> {
    try {
        const response = await fetch(`${STRAPI_URL}/api/auth/local`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error('Login failed:', errorText);
            throw new Error('Login failed');
        }

        const authData: AuthResponse = await response.json();
        return authData;
    } catch (error) {
        console.error('Error logging in:', error);
        return null;
    }
}

export async function getUsers(token: string): Promise<User[]> {
    try {
        const response = await fetch(`${STRAPI_URL}/api/users?sort=createdAt:desc`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        if (!response.ok) {
            console.error('Failed to fetch users:', await response.text());
            return [];
        }

        const users = await response.json();
        return users.map((u: any) => ({
            id: u.id,
            username: u.username,
            email: u.email,
            blocked: u.blocked,
            createdAt: u.createdAt,
            role: u.role?.name || 'Customer' // Strapi usually returns role object if populated, specific handling might be needed depending on permission
        }));
    } catch (error) {
        console.error('Error fetching users:', error);
        return [];
    }
}

export async function getCurrentUser(token: string): Promise<User | null> {
    try {
        const response = await fetch(`${STRAPI_URL}/api/users/me`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        if (!response.ok) {
            throw new Error('Failed to get current user');
        }

        const user: User = await response.json();
        return user;
    } catch (error) {
        console.error('Error getting current user:', error);
        return null;
    }
}

export async function getUserLeads(token: string): Promise<any[]> {
    try {
        // First, get current user info
        const currentUser = await getCurrentUser(token);
        if (!currentUser) {
            return [];
        }

        // Fetch all leads with user relation populated
        const response = await fetch(`${STRAPI_URL}/api/leads?populate=users_permissions_user&sort=createdAt:desc`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error('Failed to get user leads. Status:', response.status);
            console.error('Error response:', errorText);
            throw new Error('Failed to get user leads');
        }

        const data = await response.json();
        const allLeads = data.data || [];

        // Filter client-side to only show current user's leads
        const userLeads = allLeads.filter((lead: any) => {
            const leadUserId = lead.attributes?.users_permissions_user?.data?.id;
            return leadUserId === currentUser.id;
        });

        return userLeads;
    } catch (error) {
        console.error('Error getting user leads:', error);
        return [];
    }
}

export async function getAdminLeads(token: string): Promise<any[]> {
    try {
        const response = await fetch(`${STRAPI_URL}/api/leads?populate=users_permissions_user&sort=createdAt:desc`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
            cache: 'no-store'
        });

        if (!response.ok) {
            console.error('Failed to get admin leads:', await response.text());
            return [];
        }

        const data = await response.json();
        return data.data.map((item: any) => ({
            id: item.id,
            ...item.attributes, // Handle v4 structure if needed, or flat v5
            // In v5 flat response:
            documentId: item.documentId,
            name: item.name,
            email: item.email,
            phone: item.phone,
            type: item.type,
            message: item.message,
            model: item.model,
            createdAt: item.createdAt,
            user: item.users_permissions_user // if populated
        }));
    } catch (error) {
        console.error('Error getting admin leads:', error);
        return [];
    }
}


export interface Accessory {
    id: number;
    documentId: string;
    name: string;
    slug: string;
    price: number;
    category: 'battery' | 'charger' | 'helmet' | 'other';
    description: string;
    image: string;
    isFeatured: boolean;
}

export async function getAccessories(category?: string): Promise<Accessory[]> {
    try {
        // Fetch all accessories first to avoid filter field name mismatch (category vs Category)
        const url = `${STRAPI_URL}/api/accessories?populate=*&sort=createdAt:desc`;

        if (DEBUG_LOG) console.log("Fetching accessories from:", url);
        const data = await cachedFetch<any>(url, getDefaultFetchOptions(300), 300);

        if (!data || !data.data) return [];


        const allAccessories = data.data.map((item: any) => {
            // Handle Strapi v4 nested attributes if present
            const attributes = item.attributes || item;
            const id = item.id;

            // Handle image mapping (check both direct and nested)
            const imageField = attributes.image || attributes.Image;
            const imageData = imageField?.data || imageField;

            const imageUrl = imageData?.url
                ? (imageData.url.startsWith('http') ? imageData.url : `${STRAPI_URL}${imageData.url}`)
                : 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&q=80&w=800';

            return {
                id: id,
                documentId: item.documentId || String(id),
                name: attributes.name || attributes.Name || 'Unknown Accessory',
                slug: attributes.slug || attributes.Slug || '',
                price: Number(attributes.price || attributes.Price) || 0,
                category: attributes.category || attributes.Category || 'other',
                description: attributes.description || attributes.Description || '',
                image: imageUrl,
                isFeatured: attributes.isFeatured || attributes.IsFeatured || false
            };
        });

        // Filter in memory
        if (category) {
            return allAccessories.filter((item: Accessory) => item.category === category);
        }

        return allAccessories;
    } catch (error) {
        console.error("Error fetching accessories:", error);
        return [];
    }
}

export async function getAccessoryBySlug(slug: string): Promise<Accessory | undefined> {
    try {
        if (DEBUG_LOG) console.log("getAccessoryBySlug called with:", slug);

        const query = qs.stringify({
            filters: {
                Slug: {
                    $eq: slug,
                },
            },
            populate: '*',
        }, {
            encodeValuesOnly: false,
        });

        const url = `${STRAPI_URL}/api/accessories?${query}`;
        if (DEBUG_LOG) console.log("Fetching accessory from:", url);

        const response = await fetch(url, { cache: 'no-store' });

        if (!response.ok) {
            console.error("Accessory fetch failed:", response.status, response.statusText);
            return undefined;
        }

        const data = await response.json();
        if (DEBUG_LOG) console.log("Accessory API response:", JSON.stringify(data.data?.[0], null, 2));

        if (!data.data || data.data.length === 0) {
            console.warn("No accessory found for slug:", slug);
            return undefined;
        }

        const item = data.data[0];
        const attributes = item.attributes || item;

        const imageField = attributes.image || attributes.Image;
        const imageData = imageField?.data || imageField;

        const imageUrl = imageData?.url
            ? (imageData.url.startsWith('http') ? imageData.url : `${STRAPI_URL}${imageData.url}`)
            : 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&q=80&w=800';

        return {
            id: item.id,
            documentId: item.documentId || String(item.id),
            name: attributes.name || attributes.Name || 'Unknown Accessory',
            slug: attributes.slug || attributes.Slug || '',
            price: Number(attributes.price || attributes.Price) || 0,
            category: attributes.category || attributes.Category || 'other',
            description: attributes.description || attributes.Description || '',
            image: imageUrl,
            isFeatured: attributes.isFeatured || attributes.IsFeatured || false
        };
    } catch (error) {
        console.error("Error fetching accessory by slug:", error);
        return undefined;
    }
}

// Accessories Management API (Admin)

export async function getAccessoriesAdmin(token: string): Promise<any[]> {
    try {
        const response = await fetch(`${STRAPI_URL}/api/accessories?populate=*&sort=createdAt:desc`, {
            headers: { Authorization: `Bearer ${token}` },
            cache: 'no-store'
        });
        if (!response.ok) return [];
        const data = await response.json();
        return data.data.map((item: any) => {
            const attrs = item.attributes || item;
            return {
                id: item.id,
                documentId: item.documentId,
                name: attrs.name || attrs.Name || '',
                slug: attrs.slug || attrs.Slug || '',
                price: Number(attrs.price || attrs.Price) || 0,
                category: attrs.category || attrs.Category || 'other',
                description: attrs.description || attrs.Description || '',
                isFeatured: attrs.isFeatured || attrs.IsFeatured || false,
                image: attrs.image || attrs.Image || null
            };
        });
    } catch (error) {
        console.error("Error fetching admin accessories:", error);
        return [];
    }
}

export async function createAccessory(token: string, data: any): Promise<boolean> {
    try {
        const response = await fetch(`${STRAPI_URL}/api/accessories`, {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ data })
        });
        return response.ok;
    } catch (error) {
        console.error("Error creating accessory:", error);
        return false;
    }
}

export async function updateAccessory(token: string, documentId: string, data: any): Promise<boolean> {
    try {
        const response = await fetch(`${STRAPI_URL}/api/accessories/${documentId}`, {
            method: 'PUT',
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ data })
        });
        return response.ok;
    } catch (error) {
        console.error("Error updating accessory:", error);
        return false;
    }
}

export async function deleteAccessory(token: string, documentId: string): Promise<boolean> {
    try {
        const response = await fetch(`${STRAPI_URL}/api/accessories/${documentId}`, {
            method: 'DELETE',
            headers: { Authorization: `Bearer ${token}` }
        });
        return response.ok;
    } catch (error) {
        console.error("Error deleting accessory:", error);
        return false;
    }
}


export interface Category {
    id: number;
    title: string;
    subtitle: string;
    image: string;
    link: string;
    color: string;
    colSpan: string;
    order: number;
}

export async function getCategories(): Promise<Category[]> {
    try {
        const response = await fetch(`${STRAPI_URL}/api/categories?populate=*&sort=Order:asc`, {
            next: { revalidate: 60 }
        });

        if (!response.ok) return [];

        const data = await response.json();

        return data.data.map((item: any) => {
            const attrs = item.attributes || item;
            const colorValue = attrs.Color || attrs.color || 'from-blue-600 to-cyan-500';

            return {
                id: item.id,
                title: attrs.Name || '',
                subtitle: attrs.Subtitle || '',
                image: attrs.Image?.url ? (attrs.Image.url.startsWith('http') ? attrs.Image.url : `${STRAPI_URL}${attrs.Image.url}`) : '',
                link: attrs.Link || '#',
                color: colorValue,
                colSpan: attrs.ColSpan || 'md:col-span-2 lg:col-span-1',
                order: attrs.Order || 0
            };
        });
    } catch (error) {
        console.error("Error fetching categories:", error);
        return [];
    }
}

// Showroom Management API for Admin
export async function getShowroomsAdmin(token: string): Promise<any[]> {
    try {
        const response = await fetch(`${STRAPI_URL}/api/showrooms?populate=*&sort=createdAt:desc`, {
            headers: { Authorization: `Bearer ${token}` },
            cache: 'no-store'
        });
        if (!response.ok) return [];
        const data = await response.json();
        return data.data.map((item: any) => ({
            id: item.id,
            documentId: item.documentId,
            ...item
        }));
    } catch (error) {
        console.error("Error fetching admin showrooms:", error);
        return [];
    }
}

export async function createShowroom(token: string, data: any): Promise<boolean> {
    try {
        const response = await fetch(`${STRAPI_URL}/api/showrooms`, {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ data })
        });
        if (!response.ok) {
            console.error("Create Showroom Failed:", await response.text());
        }
        return response.ok;
    } catch (error) {
        console.error("Error creating showroom:", error);
        return false;
    }
}

export async function updateShowroom(token: string, documentId: string, data: any): Promise<boolean> {
    try {
        const response = await fetch(`${STRAPI_URL}/api/showrooms/${documentId}`, {
            method: 'PUT',
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ data })
        });
        return response.ok;
    } catch (error) {
        console.error("Error updating showroom:", error);
        return false;
    }
}

export async function deleteShowroom(token: string, documentId: string): Promise<boolean> {
    try {
        const response = await fetch(`${STRAPI_URL}/api/showrooms/${documentId}`, {
            method: 'DELETE',
            headers: { Authorization: `Bearer ${token}` }
        });
        return response.ok;
    } catch (error) {
        console.error("Error deleting showroom:", error);
        return false;
    }
}

// Hero Slides (Banner) Management API for Admin
export async function getHeroSlidesAdmin(token: string): Promise<any[]> {
    try {
        const response = await fetch(`${STRAPI_URL}/api/hero-slides?populate=*&sort=order:asc`, {
            headers: { Authorization: `Bearer ${token}` },
            cache: 'no-store'
        });
        if (!response.ok) return [];
        const data = await response.json();

        if (DEBUG_LOG) console.log("Hero Slides Raw Response:", JSON.stringify(data.data?.[0], null, 2));

        return data.data.map((item: any) => {
            // Strapi v5 flat structure - fields are at root level
            return {
                id: item.id,
                documentId: item.documentId,
                title: item.title,
                subtitle: item.subtitle,
                desc: item.desc,
                link: item.link,
                color: item.color,
                order: item.order,
                image: item.image // image should be populated object with { id, url, ... }
            };
        });
    } catch (error) {
        console.error("Error fetching admin hero slides:", error);
        return [];
    }
}

export async function createHeroSlide(token: string, data: any): Promise<boolean> {
    try {
        const response = await fetch(`${STRAPI_URL}/api/hero-slides`, {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ data })
        });
        if (!response.ok) {
            console.error("Create Hero Slide Failed:", await response.text());
        }
        return response.ok;
    } catch (error) {
        console.error("Error creating hero slide:", error);
        return false;
    }
}

export async function updateHeroSlide(token: string, documentId: string, data: any): Promise<boolean> {
    try {
        const response = await fetch(`${STRAPI_URL}/api/hero-slides/${documentId}`, {
            method: 'PUT',
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ data })
        });
        if (!response.ok) {
            console.error("Update Hero Slide Failed:", await response.text());
        }
        return response.ok;
    } catch (error) {
        console.error("Error updating hero slide:", error);
        return false;
    }
}

export async function deleteHeroSlide(token: string, documentId: string): Promise<boolean> {
    try {
        const response = await fetch(`${STRAPI_URL}/api/hero-slides/${documentId}`, {
            method: 'DELETE',
            headers: { Authorization: `Bearer ${token}` }
        });
        return response.ok;
    } catch (error) {
        console.error("Error deleting hero slide:", error);
        return false;
    }
}

// Article Management API
export async function getArticleCategories(token: string): Promise<any[]> {
    try {
        const response = await fetch(`${STRAPI_URL}/api/article-categories?sort=name:asc`, {
            headers: { Authorization: `Bearer ${token}` },
            cache: 'no-store'
        });
        if (!response.ok) return [];
        const data = await response.json();
        return data.data.map((item: any) => ({
            id: item.id,
            documentId: item.documentId,
            ...item
        }));
    } catch (error) {
        console.error("Error fetching article categories:", error);
        return [];
    }
}

export async function getArticlesAdmin(token: string): Promise<any[]> {
    try {
        const response = await fetch(`${STRAPI_URL}/api/articles?populate=Cover_image&populate=category&sort=Published_Date:desc`, {
            headers: { Authorization: `Bearer ${token}` },
            cache: 'no-store'
        });
        if (!response.ok) return [];
        const data = await response.json();
        return data.data.map((item: any) => ({
            id: item.id,
            documentId: item.documentId,
            ...item
        }));
    } catch (error) {
        console.error("Error fetching admin articles:", error);
        return [];
    }
}

export async function getArticleById(token: string, documentId: string): Promise<any> {
    try {
        const response = await fetch(`${STRAPI_URL}/api/articles/${documentId}?populate=*`, {
            headers: { Authorization: `Bearer ${token}` },
            cache: 'no-store'
        });
        if (!response.ok) return null;
        const data = await response.json();
        return {
            id: data.data.id,
            documentId: data.data.documentId,
            ...data.data
        };
    } catch (error) {
        console.error("Error fetching article by ID:", error);
        return null;
    }
}

export async function createArticle(token: string, data: any): Promise<boolean> {
    try {
        const response = await fetch(`${STRAPI_URL}/api/articles`, {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ data })
        });
        if (!response.ok) {
            console.error("Create Article Failed:", await response.text());
        }
        return response.ok;
    } catch (error) {
        console.error("Error creating article:", error);
        return false;
    }
}

export async function updateArticle(token: string, documentId: string, data: any): Promise<boolean> {
    try {
        const response = await fetch(`${STRAPI_URL}/api/articles/${documentId}`, {
            method: 'PUT',
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ data })
        });
        if (!response.ok) {
            console.error("Update Article Failed:", await response.text());
        }
        return response.ok;
    } catch (error) {
        console.error("Error updating article:", error);
        return false;
    }
}

export async function deleteArticle(token: string, documentId: string): Promise<boolean> {
    try {
        const response = await fetch(`${STRAPI_URL}/api/articles/${documentId}`, {
            method: 'DELETE',
            headers: { Authorization: `Bearer ${token}` }
        });
        return response.ok;
    } catch (error) {
        console.error("Error deleting article:", error);
        return false;
    }
}

export async function getAccessoryById(token: string, documentId: string): Promise<any> {
    try {
        const response = await fetch(`${STRAPI_URL}/api/accessories/${documentId}?populate=*`, {
            headers: { Authorization: `Bearer ${token}` },
            cache: 'no-store'
        });
        if (!response.ok) return null;
        const data = await response.json();
        const attrs = data.data.attributes || data.data;
        return {
            id: data.data.id,
            documentId: data.data.documentId,
            name: attrs.name || attrs.Name || '',
            slug: attrs.slug || attrs.Slug || '',
            price: Number(attrs.price || attrs.Price) || 0,
            category: attrs.category || attrs.Category || 'other',
            description: attrs.description || attrs.Description || '',
            isFeatured: attrs.isFeatured || attrs.IsFeatured || false,
            image: attrs.image || attrs.Image || null
        };
    } catch (error) {
        console.error("Error fetching accessory by ID:", error);
        return null;
    }
}

// Promotions Management API (Admin)
export async function getPromotionsAdmin(token: string): Promise<any[]> {
    try {
        const response = await fetch(`${STRAPI_URL}/api/promotions?populate=*&sort=createdAt:desc`, {
            headers: { Authorization: `Bearer ${token}` },
            cache: 'no-store'
        });
        if (!response.ok) return [];
        const data = await response.json();
        return data.data.map((item: any) => {
            const attrs = item.attributes || item; // Support V4 nested or V5 flat

            // Normalize Image
            let imageData = attrs.image || attrs.Image;
            if (imageData && imageData.data) {
                imageData = imageData.data.attributes || imageData.data;
            }
            if (Array.isArray(imageData) && imageData.length > 0) {
                imageData = imageData[0];
            }

            // Construct full URL
            if (imageData?.url) {
                imageData.url = imageData.url.startsWith('http')
                    ? imageData.url
                    : `${STRAPI_URL}${imageData.url}`;
            }

            return {
                id: item.id,
                documentId: item.documentId,
                title: attrs.title || attrs.Title || '',
                code: attrs.code || attrs.Code || '',
                discountPercent: Number(attrs.discountPercent || attrs.DiscountPercent) || 0,
                expiryDate: attrs.expiryDate || attrs.ExpiryDate || '',
                isActive: attrs.isActive !== undefined ? attrs.isActive : (attrs.IsActive !== undefined ? attrs.IsActive : true),
                description: attrs.description || attrs.Description || '',
                image: imageData || null
            };
        });
    } catch (error) {
        console.error("Error fetching admin promotions:", error);
        return [];
    }
}
export async function createPromotion(token: string, data: any): Promise<boolean> {
    try {
        const response = await fetch(`${STRAPI_URL}/api/promotions`, {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ data })
        });
        return response.ok;
    } catch (error) {
        console.error("Error creating promotion:", error);
        return false;
    }
}

export async function updatePromotion(token: string, documentId: string, data: any): Promise<boolean> {
    try {
        const response = await fetch(`${STRAPI_URL}/api/promotions/${documentId}`, {
            method: 'PUT',
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ data })
        });
        return response.ok;
    } catch (error) {
        console.error("Error updating promotion:", error);
        return false;
    }
}

export async function deletePromotion(token: string, documentId: string): Promise<boolean> {
    try {
        const response = await fetch(`${STRAPI_URL}/api/promotions/${documentId}`, {
            method: 'DELETE',
            headers: { Authorization: `Bearer ${token}` }
        });
        return response.ok;
    } catch (error) {
        console.error("Error deleting promotion:", error);
        return false;
    }
}

export async function getPromotionById(token: string, documentId: string): Promise<any> {
    try {
        const response = await fetch(`${STRAPI_URL}/api/promotions/${documentId}?populate=*`, {
            headers: { Authorization: `Bearer ${token}` },
            cache: 'no-store'
        });
        if (!response.ok) return null;
        const data = await response.json();
        const attrs = data.data.attributes || data.data;

        // Normalize Image
        let imageData = attrs.image || attrs.Image;
        if (imageData && imageData.data) {
            imageData = imageData.data.attributes || imageData.data;
        }
        if (Array.isArray(imageData) && imageData.length > 0) {
            imageData = imageData[0];
        }

        // Construct full URL
        if (imageData?.url) {
            imageData.url = imageData.url.startsWith('http')
                ? imageData.url
                : `${STRAPI_URL}${imageData.url}`;
        }

        return {
            id: data.data.id,
            documentId: data.data.documentId,
            title: attrs.title || attrs.Title || '',
            code: attrs.code || attrs.Code || '',
            discountPercent: Number(attrs.discountPercent || attrs.DiscountPercent) || 0,
            expiryDate: attrs.expiryDate || attrs.ExpiryDate || '',
            isActive: attrs.isActive !== undefined ? attrs.isActive : (attrs.IsActive !== undefined ? attrs.IsActive : true),
            description: attrs.description || attrs.Description || '',
            image: imageData || null
        };
    } catch (error) {
        console.error("Error fetching promotion by ID:", error);
        return null;
    }
}

// Product Categories Management API (Admin)
export async function getProductCategoriesAdmin(token: string): Promise<any[]> {
    try {
        const response = await fetch(`${STRAPI_URL}/api/categories?populate=*&locale=vi&sort=createdAt:desc`, {
            headers: { Authorization: `Bearer ${token}` },
            cache: 'no-store'
        });

        if (!response.ok) {
            console.error(`Fetch categories failed: ${response.status}`);
            return [];
        }

        const data = await response.json();
        return data.data.map((item: any) => {
            const attrs = item.attributes || item;

            // Normalize Image
            let imageData = attrs.image || attrs.Image;
            if (imageData?.data) {
                imageData = imageData.data.attributes || imageData.data;
            }
            if (Array.isArray(imageData) && imageData.length > 0) imageData = imageData[0];

            if (imageData?.url) {
                imageData.url = imageData.url.startsWith('http') ? imageData.url : `${STRAPI_URL}${imageData.url}`;
            }

            return {
                id: item.id,
                documentId: item.documentId,
                name: attrs.name || attrs.Name || '',
                slug: attrs.slug || attrs.Slug || '',
                description: attrs.description || attrs.Description || '',
                image: imageData || null,
                count: attrs.products?.data?.length || 0
            };
        });
    } catch (error) {
        console.warn("Product categories error:", error);
        return [];
    }
}

export async function getCategoryById(token: string, documentId: string): Promise<any> {
    try {
        const response = await fetch(`${STRAPI_URL}/api/categories/${documentId}?populate=*`, {
            headers: { Authorization: `Bearer ${token}` },
            cache: 'no-store'
        });
        if (!response.ok) return null;
        const data = await response.json();
        const attrs = data.data.attributes || data.data;

        // Normalize Image
        let imageData = attrs.image || attrs.Image;
        if (imageData?.data) {
            imageData = imageData.data.attributes || imageData.data;
        }
        if (Array.isArray(imageData)) imageData = imageData[0];
        if (imageData?.url) {
            imageData.url = imageData.url.startsWith('http') ? imageData.url : `${STRAPI_URL}${imageData.url}`;
        }

        return {
            id: data.data.id,
            documentId: data.data.documentId,
            name: attrs.name || attrs.Name || '',
            slug: attrs.slug || attrs.Slug || '',
            description: attrs.description || attrs.Description || '',
            image: imageData || null
        };
    } catch (error) {
        console.error("Error fetching category:", error);
        return null;
    }
}

export async function createProductCategory(token: string, data: any): Promise<boolean> {
    try {
        const response = await fetch(`${STRAPI_URL}/api/categories`, {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ data })
        });
        return response.ok;
    } catch (error) {
        console.error("Error creating category:", error);
        return false;
    }
}

export async function updateProductCategory(token: string, documentId: string, data: any): Promise<boolean> {
    try {
        const response = await fetch(`${STRAPI_URL}/api/categories/${documentId}`, {
            method: 'PUT',
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ data })
        });
        return response.ok;
    } catch (error) {
        console.error("Error updating category:", error);
        return false;
    }
}

export async function deleteProductCategory(token: string, documentId: string): Promise<boolean> {
    try {
        const response = await fetch(`${STRAPI_URL}/api/categories/${documentId}`, {
            method: 'DELETE',
            headers: { Authorization: `Bearer ${token}` }
        });
        return response.ok;
    } catch (error) {
        console.error("Error deleting category:", error);
        return false;
    }
}
