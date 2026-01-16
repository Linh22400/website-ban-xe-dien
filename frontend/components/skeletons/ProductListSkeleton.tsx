export default function ProductListSkeleton() {
    return (
        <main className="min-h-screen bg-background pt-24 pb-20">
            {/* Header Skeleton */}
            <div className="bg-secondary/30 border-b border-white/5 py-12 mb-8">
                <div className="container mx-auto px-6">
                    <div className="h-10 w-64 bg-gray-200 dark:bg-zinc-800 rounded-lg animate-pulse mb-3" />
                    <div className="h-5 w-40 bg-gray-200 dark:bg-zinc-800 rounded animate-pulse" />
                </div>
            </div>

            <div className="container mx-auto px-6">
                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Sidebar Filter Skeleton */}
                    <div className="hidden lg:block w-64 shrink-0">
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
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {[...Array(6)].map((_, i) => (
                                <div key={i} className="bg-card/30 rounded-2xl overflow-hidden border border-white/5 animate-pulse flex flex-col">
                                    {/* Image Skeleton */}
                                    <div className="w-full aspect-[4/3] bg-gray-200 dark:bg-zinc-800" />
                                    
                                    <div className="p-5 flex flex-col flex-1">
                                        {/* Brand */}
                                        <div className="h-3 w-20 bg-gray-100 dark:bg-zinc-800 rounded mb-2" />
                                        
                                        {/* Name */}
                                        <div className="h-6 w-3/4 bg-gray-200 dark:bg-zinc-700 rounded mb-3" />
                                        
                                        {/* Color Picker Mock */}
                                        <div className="flex gap-2 mb-4">
                                            {[...Array(4)].map((_, j) => (
                                                <div key={j} className="w-4 h-4 rounded-full bg-gray-100 dark:bg-zinc-800" />
                                            ))}
                                        </div>
                                        
                                        {/* Price and Actions */}
                                        <div className="mt-auto flex justify-between items-end pt-2">
                                            <div className="space-y-1">
                                                <div className="h-6 w-24 bg-gray-200 dark:bg-zinc-700 rounded" />
                                                <div className="h-3 w-16 bg-gray-100 dark:bg-zinc-800 rounded" />
                                            </div>
                                            
                                            <div className="flex gap-2">
                                                <div className="w-9 h-9 rounded-full bg-gray-100 dark:bg-zinc-800" />
                                                <div className="w-9 h-9 rounded-full bg-gray-100 dark:bg-zinc-800" />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}
