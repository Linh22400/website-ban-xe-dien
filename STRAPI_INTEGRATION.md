# Code Examples - Integrating Strapi with Frontend

## 1. Fetching Cars from Strapi API

Replace the mock data in `lib/api.ts` with real Strapi API calls:

```typescript
// lib/api.ts
const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337';

export interface Car {
  id: string;
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
  colors: { name: string; hex: string }[];
}

export async function getCars(): Promise<Car[]> {
  try {
    const res = await fetch(`${STRAPI_URL}/api/car-models?populate=*`, {
      next: { revalidate: 60 } // ISR: revalidate every 60 seconds
    });
    
    if (!res.ok) throw new Error('Failed to fetch cars');
    
    const data = await res.json();
    
    // Transform Strapi response to our Car interface
    return data.data.map((item: any) => ({
      id: item.id.toString(),
      slug: item.attributes.slug,
      name: item.attributes.name,
      brand: item.attributes.brand,
      price: item.attributes.versions?.[0]?.price || 0,
      range: item.attributes.versions?.[0]?.range || 0,
      topSpeed: item.attributes.versions?.[0]?.topSpeed || 0,
      acceleration: item.attributes.versions?.[0]?.acceleration || 0,
      description: item.attributes.description,
      thumbnail: item.attributes.thumbnail?.data?.attributes?.url 
        ? `${STRAPI_URL}${item.attributes.thumbnail.data.attributes.url}`
        : 'https://via.placeholder.com/800x600',
      colors: item.attributes.versions?.[0]?.colors?.map((c: any) => ({
        name: c.name,
        hex: c.hexCode
      })) || []
    }));
  } catch (error) {
    console.error('Error fetching cars:', error);
    return [];
  }
}

export async function getCarBySlug(slug: string): Promise<Car | undefined> {
  try {
    const res = await fetch(
      `${STRAPI_URL}/api/car-models?filters[slug][$eq]=${slug}&populate=*`,
      { next: { revalidate: 60 } }
    );
    
    if (!res.ok) throw new Error('Failed to fetch car');
    
    const data = await res.json();
    
    if (data.data.length === 0) return undefined;
    
    const item = data.data[0];
    return {
      id: item.id.toString(),
      slug: item.attributes.slug,
      name: item.attributes.name,
      brand: item.attributes.brand,
      price: item.attributes.versions?.[0]?.price || 0,
      range: item.attributes.versions?.[0]?.range || 0,
      topSpeed: item.attributes.versions?.[0]?.topSpeed || 0,
      acceleration: item.attributes.versions?.[0]?.acceleration || 0,
      description: item.attributes.description,
      thumbnail: item.attributes.thumbnail?.data?.attributes?.url 
        ? `${STRAPI_URL}${item.attributes.thumbnail.data.attributes.url}`
        : 'https://via.placeholder.com/800x600',
      colors: item.attributes.versions?.[0]?.colors?.map((c: any) => ({
        name: c.name,
        hex: c.hexCode
      })) || []
    };
  } catch (error) {
    console.error('Error fetching car:', error);
    return undefined;
  }
}
```

## 2. Environment Variables

Create `.env.local` in the frontend directory:

```bash
NEXT_PUBLIC_STRAPI_URL=http://localhost:1337
```

For production (Vercel):
```bash
NEXT_PUBLIC_STRAPI_URL=https://your-strapi-backend.onrender.com
```

## 3. Submitting Contact Form to Strapi

Update `app/contact/page.tsx`:

```typescript
const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setStatus("submitting");
  
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_STRAPI_URL}/api/leads`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        data: {
          fullName: formData.name,
          email: formData.email,
          phone: formData.phone,
          type: formData.type,
          message: formData.message,
        }
      })
    });
    
    if (!res.ok) throw new Error('Failed to submit');
    
    setStatus("success");
  } catch (error) {
    console.error('Error submitting form:', error);
    setStatus("error");
  }
};
```

## 4. Loading 3D Models from Cloudinary

If you upload GLB files to Cloudinary via Strapi, the URL will be in the format:
```
https://res.cloudinary.com/your-cloud-name/raw/upload/v1234567890/model.glb
```

Pass this URL to the `CarViewer` component:
```tsx
<CarViewer modelUrl={car.modelUrl} color={selectedColor.hex} />
```
