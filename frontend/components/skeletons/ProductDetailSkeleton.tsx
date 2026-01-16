export default function ProductDetailSkeleton() {
    return (
        <section className="relative min-h-[90vh] pt-20 pb-12 overflow-hidden">
            <div className="container mx-auto px-6 max-w-7xl relative z-10">
                {/* Breadcrumb Skeleton */}
                <div className="flex gap-2 mb-6">
                    <div className="h-4 w-16 bg-gray-200 dark:bg-zinc-800 rounded animate-pulse" />
                    <div className="h-4 w-4 bg-gray-200 dark:bg-zinc-800 rounded animate-pulse" />
                    <div className="h-4 w-32 bg-gray-200 dark:bg-zinc-800 rounded animate-pulse" />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-10 items-start">
                    {/* Left: Product Info Skeleton */}
                    <div className="space-y-8 order-2 lg:order-1">
                        {/* Header Tags */}
                        <div className="flex items-center gap-3">
                            <div className="h-8 w-24 bg-primary/20 rounded-full animate-pulse" />
                            <div className="h-5 w-20 bg-gray-200 dark:bg-zinc-800 rounded animate-pulse" />
                            <div className="h-6 w-20 bg-gray-200 dark:bg-zinc-800 rounded-full animate-pulse" />
                        </div>

                        {/* Trust Signals */}
                        <div className="flex gap-4 px-4 py-3 rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/5 w-fit">
                            <div className="h-5 w-24 bg-gray-200 dark:bg-zinc-800 rounded animate-pulse" />
                            <div className="h-5 w-24 bg-gray-200 dark:bg-zinc-800 rounded animate-pulse" />
                            <div className="h-5 w-24 bg-gray-200 dark:bg-zinc-800 rounded animate-pulse" />
                        </div>

                        {/* Heading */}
                        <div className="h-12 md:h-16 w-3/4 bg-gray-200 dark:bg-zinc-800 rounded-lg animate-pulse" />

                        {/* Social Share Skeleton */}
                        <div className="flex gap-3">
                            <div className="h-8 w-8 bg-gray-200 dark:bg-zinc-800 rounded-full animate-pulse" />
                            <div className="h-8 w-8 bg-gray-200 dark:bg-zinc-800 rounded-full animate-pulse" />
                            <div className="h-8 w-8 bg-gray-200 dark:bg-zinc-800 rounded-full animate-pulse" />
                        </div>

                        {/* Description */}
                        <div className="space-y-2">
                            <div className="h-4 w-full bg-gray-100 dark:bg-zinc-900 rounded animate-pulse" />
                            <div className="h-4 w-5/6 bg-gray-100 dark:bg-zinc-900 rounded animate-pulse" />
                            <div className="h-4 w-4/6 bg-gray-100 dark:bg-zinc-900 rounded animate-pulse" />
                        </div>

                        {/* Key Stats Grid */}
                        <div className="grid grid-cols-3 gap-6 py-8 border-y border-gray-100 dark:border-white/5">
                            {[...Array(3)].map((_, i) => (
                                <div key={i} className="space-y-2">
                                    <div className="h-8 w-16 bg-gray-200 dark:bg-zinc-800 rounded animate-pulse" />
                                    <div className="h-3 w-20 bg-gray-100 dark:bg-zinc-900 rounded animate-pulse" />
                                </div>
                            ))}
                        </div>

                        {/* Price & CTA Block */}
                        <div className="space-y-5">
                            {/* Options (Battery/Version) */}
                            <div className="space-y-4">
                                <div className="h-4 w-32 bg-gray-200 dark:bg-zinc-800 rounded animate-pulse" />
                                <div className="flex flex-wrap gap-3">
                                    <div className="h-10 w-32 bg-gray-100 dark:bg-zinc-900 rounded-lg animate-pulse" />
                                    <div className="h-10 w-40 bg-gray-100 dark:bg-zinc-900 rounded-lg animate-pulse" />
                                </div>
                            </div>

                            {/* Price */}
                            <div className="space-y-2">
                                <div className="h-4 w-16 bg-gray-100 dark:bg-zinc-900 rounded animate-pulse" />
                                <div className="h-12 w-48 bg-gray-200 dark:bg-zinc-700 rounded-lg animate-pulse" />
                            </div>

                            {/* Action Buttons */}
                            <div className="flex gap-4 max-w-md">
                                <div className="h-14 flex-1 rounded-full bg-gray-200 dark:bg-zinc-800 animate-pulse" />
                                <div className="h-14 flex-1 rounded-full bg-primary/20 animate-pulse" />
                            </div>

                            {/* Commerce Info */}
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                {[...Array(3)].map((_, i) => (
                                    <div key={i} className="h-24 rounded-xl bg-gray-50 dark:bg-white/5 animate-pulse" />
                                ))}
                            </div>
                            
                            {/* Customer Support */}
                             <div className="h-20 w-full bg-gray-50 dark:bg-white/5 rounded-xl animate-pulse" />
                        </div>
                    </div>

                    {/* Right: Gallery Skeleton */}
                    <div className="space-y-6 order-1 lg:order-2">
                        {/* Main Image - Square aspect ratio matching ProductGallery */}
                        <div className="w-full aspect-square rounded-3xl bg-gray-200 dark:bg-zinc-800/50 animate-pulse border border-white/10" />
                        
                        {/* Thumbnails */}
                        <div className="flex gap-3 overflow-hidden">
                            {[...Array(4)].map((_, i) => (
                                <div key={i} className="w-20 h-20 rounded-xl bg-gray-100 dark:bg-zinc-900 animate-pulse flex-shrink-0" />
                            ))}
                        </div>

                        {/* Color Selector */}
                        <div className="space-y-3 pt-2">
                            <div className="flex justify-between">
                                <div className="h-4 w-20 bg-gray-200 dark:bg-zinc-800 rounded animate-pulse" />
                                <div className="h-4 w-24 bg-gray-200 dark:bg-zinc-800 rounded animate-pulse" />
                            </div>
                            <div className="flex gap-3">
                                {[...Array(4)].map((_, i) => (
                                    <div key={i} className="w-8 h-8 rounded-full bg-gray-200 dark:bg-zinc-800 animate-pulse" />
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
