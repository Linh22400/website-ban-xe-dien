import { getAccessories } from "@/lib/api";
import FeaturedAccessoriesClient from "./FeaturedAccessoriesClient";

export const revalidate = 3600; // 1 hour ISR

export default async function FeaturedAccessories() {
    try {
        const accessories = await getAccessories();
        // Get first 4 accessories
        const featuredAccessories = accessories.slice(0, 4);
        
        return <FeaturedAccessoriesClient initialAccessories={featuredAccessories} />;
    } catch (error) {
        console.error("Failed to fetch accessories", error);
        return null;
    }
}
