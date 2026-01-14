import { getCategories } from "@/lib/api";
import CategoryExplorerClient from "./CategoryExplorerClient";

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
