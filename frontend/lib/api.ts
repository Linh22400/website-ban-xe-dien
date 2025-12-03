import qs from "qs";

export interface Car {
    id: string;
    documentId?: string;
    slug: string;
    name: string;
    brand: string;
    price: number;
    range: number;
    topSpeed: number;
    acceleration: number;
    description: string;
    thumbnail: string;
    modelUrl?: string;
    colors: { name: string; hex: string; images: string[] }[];
    type: 'bicycle' | 'motorcycle';
    isFeatured?: boolean;
    features?: { icon: string; title: string; desc: string; bg?: string }[];
    specifications?: { label: string; value: string }[];
    technicalImage?: string;
    warranty?: Warranty;
}

export interface Warranty {
    warrantyPeriod?: string;
    batteryWarranty?: string;
    motorWarranty?: string;
    maintenance?: string;
    returnPolicy?: string;
    conditions?: any; // Rich text
    exclusions?: any; // Rich text
    process?: any; // Rich text
}

export interface LeadData {
    name: string;
    email: string;
    phone: string;
    type: string;
    model?: string;
    message?: string;
    users_permissions_user?: number; // User ID for authenticated users
}

export interface User {
    id: number;
    username: string;
    email: string;
    blocked: boolean;
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
    identifier: string; // email or username
    password: string;
}

const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337';

// Fallback images for each product type
const FALLBACK_IMAGES: Record<string, string> = {
    'bicycle': 'https://images.unsplash.com/photo-1571333250630-f0230c320b6d?auto=format&fit=crop&q=80&w=1000',
    'motorcycle': 'https://images.unsplash.com/photo-1558981806-ec527fa84c39?auto=format&fit=crop&q=80&w=1000'
};

// Transform Strapi response to our Car interface
function transformStrapiCar(strapiCar: any): Car {
    // Strapi v5 flat structure - no nested attributes
    const slug = strapiCar.slug || strapiCar.name?.toLowerCase().replace(/\s+/g, '-') || '';
    const type = strapiCar.type || 'bicycle';

    // Get thumbnail URL - Strapi v5 returns thumbnail directly
    let thumbnailUrl = FALLBACK_IMAGES[type] || FALLBACK_IMAGES['bicycle'];

    if (strapiCar.thumbnail?.url) {
        const imageUrl = strapiCar.thumbnail.url;
        thumbnailUrl = imageUrl.startsWith('http')
            ? imageUrl
            : `${STRAPI_URL}${imageUrl}`;
    }

    // Get Technical Image URL
    let technicalImageUrl = undefined;
    if (strapiCar.technicalImage?.url) {
        const techUrl = strapiCar.technicalImage.url;
        technicalImageUrl = techUrl.startsWith('http')
            ? techUrl
            : `${STRAPI_URL}${techUrl}`;
    }

    return {
        id: strapiCar.id?.toString() || strapiCar.documentId || String(Math.random()),
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
        isFeatured: strapiCar.isFeatured || false,
        modelUrl: strapiCar.model3D?.url
            ? `${STRAPI_URL}${strapiCar.model3D.url}`
            : undefined,
        colors: Array.isArray(strapiCar.color)
            ? strapiCar.color.map((c: any) => {
                // Handle multiple images
                let images: string[] = [];

                if (c.images && Array.isArray(c.images)) {
                    images = c.images.map((img: any) =>
                        img.url ? (img.url.startsWith('http') ? img.url : `${STRAPI_URL}${img.url}`) : ''
                    ).filter(Boolean);
                } else if (c.image?.url) {
                    // Fallback for single image legacy data
                    const imgUrl = c.image.url.startsWith('http') ? c.image.url : `${STRAPI_URL}${c.image.url}`;
                    images = [imgUrl];
                }

                return {
                    name: c.name || 'Unknown',
                    hex: c.hex || '#000000',
                    images: images
                };
            })
            : [],
        features: strapiCar.features || [],
        specifications: strapiCar.specifications || [],
        technicalImage: technicalImageUrl,
        warranty: strapiCar.warranty || undefined
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
        const response = await fetch(`${STRAPI_URL}/api/articles?populate[0]=Cover_image&populate[1]=category&sort=createdAt:desc`, {
            next: { revalidate: 60 }
        });

        if (!response.ok) return [];

        const data = await response.json();
        return data.data.map((item: any) => transformStrapiArticle(item));
    } catch (error) {
        console.error("Error fetching articles:", error);
        return [];
    }
}

export async function getArticleBySlug(slug: string): Promise<Article | undefined> {
    try {
        console.log("getArticleBySlug called with:", slug);
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
            encodeValuesOnly: false, // Ensure full encoding
        });

        const url = `${STRAPI_URL}/api/articles?${query}`;
        console.log("Fetching article with URL:", url);

        const response = await fetch(url, { cache: 'no-store' });

        console.log("Article fetch status:", response.status);

        if (!response.ok) {
            console.error("Article fetch failed:", await response.text());
            return undefined;
        }

        const data = await response.json();
        console.log("Article data found:", data.data.length);

        if (data.data.length === 0) return undefined;

        return transformStrapiArticle(data.data[0]);
    } catch (error) {
        console.error("Error fetching article:", error);
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
        const response = await fetch(`${STRAPI_URL}/api/promotions?filters[isActive][$eq]=true&populate[0]=image&populate[1]=car_models&sort=createdAt:desc`, {
            next: { revalidate: 60 }
        });

        if (!response.ok) return [];

        const data = await response.json();
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
        console.error("Error fetching promotions:", error);
        return [];
    }
}

export async function getHeroSlides(): Promise<HeroSlide[]> {
    try {
        const response = await fetch(`${STRAPI_URL}/api/hero-slides?populate=*&sort=order:asc`, {
            next: { revalidate: 60 }
        });

        if (!response.ok) return [];

        const data = await response.json();
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
        const response = await fetch(`${STRAPI_URL}/api/car-models?filters[isFeatured][$eq]=true&populate=*`, {
            next: { revalidate: 60 } // Revalidate every minute
        });

        if (!response.ok) return [];

        const data = await response.json();
        return data.data.map(transformStrapiCar);
    } catch (error) {
        console.error("Error fetching featured cars:", error);
        return [];
    }
}


export interface GetCarsParams {
    type?: string;
    brand?: string;
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

export async function getCars(params: GetCarsParams = {}): Promise<Car[]> {
    try {
        const { type, brand, minPrice, maxPrice, sort, page = 1, pageSize = 12 } = params;

        // Build query parts
        const queryParts = [
            'populate[0]=thumbnail',
            'populate[1]=model3D',
            'populate[2]=color.images',
            `pagination[page]=${page}`,
            `pagination[pageSize]=${pageSize}`
        ];

        // Add filters
        if (type) queryParts.push(`filters[type][$eq]=${type}`);
        if (brand) queryParts.push(`filters[brand][$eq]=${brand}`);
        if (minPrice) queryParts.push(`filters[price][$gte]=${minPrice}`);
        if (maxPrice) queryParts.push(`filters[price][$lte]=${maxPrice}`);

        // Add range filters
        if (params.minRange) queryParts.push(`filters[range][$gte]=${params.minRange}`);
        if (params.maxRange) queryParts.push(`filters[range][$lte]=${params.maxRange}`);

        // Add speed filters
        if (params.minSpeed) queryParts.push(`filters[topSpeed][$gte]=${params.minSpeed}`);
        if (params.maxSpeed) queryParts.push(`filters[topSpeed][$lte]=${params.maxSpeed}`);

        // Add sort
        if (sort) {
            queryParts.push(`sort=${sort}`);
        } else {
            queryParts.push('sort=createdAt:desc'); // Default sort
        }

        const queryString = queryParts.join('&');
        const url = `${STRAPI_URL}/api/car-models?${queryString}`;

        console.log('Fetching cars with URL:', url);

        const response = await fetch(url, {
            cache: 'no-store'
        });

        if (!response.ok) {
            throw new Error('Failed to fetch cars');
        }

        const data = await response.json();
        return data.data.map(transformStrapiCar);
    } catch (error) {
        console.error('Error fetching cars:', error);
        return [];
    }
}

export async function getCarById(id: number): Promise<Car | undefined> {
    try {
        // Use filters instead of direct ID endpoint to avoid 404 if findOne permission is missing
        const response = await fetch(
            `${STRAPI_URL}/api/car-models?filters[id][$eq]=${id}&populate[0]=thumbnail&populate[1]=model3D&populate[2]=color.images&populate[3]=warranty`,
            { cache: 'no-store' }
        );

        if (!response.ok) {
            return undefined;
        }

        const data = await response.json();

        if (data.data && data.data.length > 0) {
            return transformStrapiCar(data.data[0]);
        }

        return undefined;
    } catch (error) {
        console.error('Error fetching car by ID:', error);
        return undefined;
    }
}

export async function getCarBySlug(slug: string): Promise<Car | undefined> {
    try {
        const response = await fetch(
            `${STRAPI_URL}/api/car-models?filters[slug][$eq]=${slug}&populate[0]=thumbnail&populate[1]=model3D&populate[2]=color.images&populate[3]=technicalImage&populate[4]=warranty`,
            { cache: 'no-store' }
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
            `${STRAPI_URL}/api/car-models?filters[slug][$ne]=${currentSlug}&filters[type][$eq]=${type}&pagination[limit]=${limit}&populate[0]=thumbnail&populate[1]=model3D&populate[2]=color.images`,
            { cache: 'no-store' }
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
            `${STRAPI_URL}/api/car-models?${slugFilters}&populate[0]=thumbnail&populate[1]=model3D&populate[2]=color.images`,
            { cache: 'no-store' }
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
            const errorText = await response.text();
            console.error('Failed to submit lead. Status:', response.status);
            console.error('Error response:', errorText);
            throw new Error(`Failed to submit lead: ${response.status} - ${errorText}`);
        }

        return true;
    } catch (error) {
        console.error('Error submitting lead:', error);
        return false;
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


export interface Accessory {
    id: number;
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

        console.log("Fetching accessories from:", url);
        const response = await fetch(url, {
            next: { revalidate: 60 }
        });

        if (!response.ok) return [];

        const data = await response.json();
        console.log("Accessories raw data sample:", JSON.stringify(data.data?.[0], null, 2));

        const allAccessories = data.data.map((item: any) => {
            // Handle Strapi v4 nested attributes if present
            const attributes = item.attributes || item;
            const id = item.id;

            // Handle image mapping (check both direct and nested)
            const imageField = attributes.image || attributes.Image;
            const imageData = imageField?.data || imageField;

            const imageUrl = imageData?.url
                ? (imageData.url.startsWith('http') ? imageData.url : `${STRAPI_URL}${imageData.url}`)
                : 'https://images.unsplash.com/photo-1620802051782-48f874814d0a?auto=format&fit=crop&q=80&w=800';

            return {
                id: id,
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
        console.log("getAccessoryBySlug called with:", slug);

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
        console.log("Fetching accessory from:", url);

        const response = await fetch(url, { cache: 'no-store' });

        if (!response.ok) {
            console.error("Accessory fetch failed:", response.status, response.statusText);
            return undefined;
        }

        const data = await response.json();
        console.log("Accessory API response:", JSON.stringify(data.data?.[0], null, 2));

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
            : 'https://images.unsplash.com/photo-1620802051782-48f874814d0a?auto=format&fit=crop&q=80&w=800';

        return {
            id: item.id,
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
        console.log('Raw Strapi categories response:', data); // Debug
        return data.data.map((item: any) => {
            const attrs = item.attributes || item;
            const colorValue = attrs.Color || attrs.color || 'from-blue-600 to-cyan-500';
            console.log('Category color value:', { title: attrs.Name, color: colorValue }); // Debug
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
