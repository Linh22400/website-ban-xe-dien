export default function HomeSkeleton() {
    return (
        <div className="min-h-screen bg-background w-full overflow-hidden">
            {/* Hero Section Skeleton */}
            <div className="w-full h-[60vh] md:h-[80vh] bg-gray-200 dark:bg-zinc-800/50 animate-pulse relative">
                {/* Simulated Content in Hero */}
                <div className="absolute bottom-1/3 left-4 md:left-20 space-y-4">
                    <div className="w-48 md:w-80 h-8 md:h-12 bg-white/20 rounded-lg" />
                    <div className="w-32 md:w-48 h-6 md:h-8 bg-white/20 rounded-lg" />
                </div>
            </div>

            {/* Quick Finder Skeleton (Floating Overlap) */}
            <div className="container mx-auto px-4 -mt-16 md:-mt-24 relative z-10 transition-all">
                <div className="w-full h-auto min-h-[250px] bg-white dark:bg-zinc-900 rounded-3xl border border-gray-100 dark:border-zinc-800 shadow-xl p-6 md:p-8 animate-pulse space-y-6">
                    {/* Header Line */}
                    <div className="flex flex-col items-center gap-3 mb-6">
                        <div className="w-14 h-14 rounded-2xl bg-gray-200 dark:bg-zinc-800" />
                        <div className="w-48 h-8 rounded-lg bg-gray-200 dark:bg-zinc-800" />
                    </div>
                    {/* Input Rows */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="h-12 rounded-xl bg-gray-100 dark:bg-zinc-800" />
                        <div className="h-12 rounded-xl bg-gray-100 dark:bg-zinc-800" />
                    </div>
                    <div className="h-12 rounded-xl bg-gray-100 dark:bg-zinc-800 w-full" />
                </div>
            </div>

            {/* Category Explorer Skeleton */}
            <div className="container mx-auto px-4 mt-12 md:mt-16">
                <div className="flex gap-4 overflow-hidden mask-linear-fade">
                    {[...Array(6)].map((_, i) => (
                        <div key={i} className="w-28 md:w-40 h-10 md:h-14 rounded-full bg-gray-200 dark:bg-zinc-800/50 flex-shrink-0 animate-pulse" style={{ animationDelay: `${i * 100}ms` }} />
                    ))}
                </div>
            </div>

            {/* Product Grid Skeleton */}
            <div className="container mx-auto px-4 mt-16 mb-12">
                <div className="flex flex-col items-center mb-8 gap-3">
                    <div className="w-16 h-16 rounded-full bg-gray-100 dark:bg-zinc-800 animate-pulse" />
                    <div className="w-64 h-10 rounded-lg bg-gray-200 dark:bg-zinc-800 animate-pulse" />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                    {[...Array(8)].map((_, i) => (
                        <div key={i} className="bg-white dark:bg-card rounded-2xl overflow-hidden border-2 border-gray-200 dark:border-white/5 animate-pulse flex flex-col">
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
    );
}
