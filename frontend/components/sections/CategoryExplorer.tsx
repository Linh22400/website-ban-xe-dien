import { getCategories } from "@/lib/api";
import dynamic from "next/dynamic";

const CategoryExplorerClient = dynamic(() => import("./CategoryExplorerClient"));

export const revalidate = 3600; // Cache for 1 hour

export default async function CategoryExplorer() {
    try {
        const categories = await getCategories();

        return <CategoryExplorerClient categories={categories} />;
    } catch (error) {
        console.error("Failed to fetch categories", error);
        return null; // Or return a fallback UI
    }
}
