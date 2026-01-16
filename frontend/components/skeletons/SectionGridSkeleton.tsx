export default function SectionGridSkeleton({ count = 4, titleWidth = "w-64" }: { count?: number, titleWidth?: string }) {
    return (
        <section className="py-10 px-4">
            <div className="container mx-auto">
                {/* Header Skeleton */}
                <div className="flex flex-col md:flex-row justify-between items-end mb-8 gap-4">
                    <div className="space-y-3 w-full">
                        <div className={`h-8 ${titleWidth} bg-gray-200 dark:bg-zinc-800 rounded-lg animate-pulse`} />
                        <div className="h-4 w-48 bg-gray-100 dark:bg-zinc-900 rounded animate-pulse" />
                    </div>
                </div>

                {/* Grid Skeleton */}
                <div className="flex flex-nowrap overflow-x-auto snap-x snap-mandatory sm:grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6 pb-4 sm:pb-0 scrollbar-hide">
                    {[...Array(count)].map((_, i) => (
                        <div key={i} className="flex-shrink-0 w-[70vw] sm:w-auto snap-center bg-white dark:bg-card rounded-2xl overflow-hidden border-2 border-gray-200 dark:border-white/5 animate-pulse flex flex-col">
                            {/* Image Skeleton - Aspect 4/3 to match ProductCard */}
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
        </section>
    );
}
