import { Filter, SortAsc } from "lucide-react";

export default function ProductListSkeleton() {
    return (
        <div className="container mx-auto px-4 py-8 mt-24">
            <div className="flex flex-col lg:flex-row gap-8">
                {/* Sidebar Filter Skeleton */}
                <div className="hidden lg:block w-72 flex-shrink-0">
                    <div className="sticky top-24 space-y-6">
                        <div className="h-8 w-32 bg-gray-200 dark:bg-zinc-800 rounded-lg animate-pulse" />
                        {[...Array(3)].map((_, i) => (
                            <div key={i} className="space-y-3">
                                <div className="h-5 w-24 bg-gray-200 dark:bg-zinc-800 rounded animate-pulse" />
                                <div className="space-y-2">
                                    <div className="h-10 w-full bg-gray-100 dark:bg-zinc-900 rounded-xl animate-pulse" />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Main Content Skeleton */}
                <div className="flex-1">
                    {/* Toolbar Skeleton */}
                    <div className="flex justify-between items-center mb-6">
                        <div className="h-8 w-40 bg-gray-200 dark:bg-zinc-800 rounded-lg animate-pulse" />
                        <div className="flex gap-2">
                            <div className="h-10 w-10 bg-gray-100 dark:bg-zinc-800 rounded-lg animate-pulse" />
                            <div className="h-10 w-32 bg-gray-100 dark:bg-zinc-800 rounded-lg animate-pulse" />
                        </div>
                    </div>

                    {/* Product Grid Skeleton */}
                    <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
                        {[...Array(8)].map((_, i) => (
                            <div key={i} className="aspect-[3/4] rounded-2xl bg-gray-100 dark:bg-zinc-900/50 animate-pulse border border-gray-200 dark:border-white/5 p-4 flex flex-col space-y-3">
                                <div className="w-full aspect-square rounded-xl bg-white dark:bg-zinc-800/80" />
                                <div className="h-4 w-3/4 bg-gray-200 dark:bg-zinc-800 rounded" />
                                <div className="h-3 w-1/2 bg-gray-200 dark:bg-zinc-800 rounded" />
                                <div className="mt-auto flex justify-between items-end">
                                    <div className="h-6 w-24 bg-primary/20 rounded" />
                                    <div className="h-8 w-8 rounded-full bg-gray-200 dark:bg-zinc-800" />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
