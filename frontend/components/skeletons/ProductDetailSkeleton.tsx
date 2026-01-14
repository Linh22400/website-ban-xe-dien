export default function ProductDetailSkeleton() {
    return (
        <div className="container mx-auto px-4 py-8 mt-20">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
                {/* Left: Gallery Skeleton */}
                <div className="space-y-4">
                    <div className="w-full aspect-[4/3] rounded-3xl bg-gray-200 dark:bg-zinc-800 animate-pulse" />
                    <div className="grid grid-cols-4 gap-4">
                        {[...Array(4)].map((_, i) => (
                            <div key={i} className="aspect-square rounded-xl bg-gray-100 dark:bg-zinc-900 animate-pulse" />
                        ))}
                    </div>
                </div>

                {/* Right: Info Skeleton */}
                <div className="space-y-6">
                    <div className="space-y-2">
                        <div className="h-4 w-24 bg-primary/20 rounded-full animate-pulse" />
                        <div className="h-10 w-3/4 bg-gray-200 dark:bg-zinc-800 rounded-lg animate-pulse" />
                    </div>

                    <div className="h-12 w-48 bg-gray-200 dark:bg-zinc-800 rounded-lg animate-pulse" />

                    {/* Specs Grid Mock */}
                    <div className="grid grid-cols-2 gap-4 py-6 border-y border-gray-100 dark:border-white/5">
                        {[...Array(4)].map((_, i) => (
                            <div key={i} className="h-16 rounded-xl bg-gray-50 dark:bg-zinc-900 animate-pulse" />
                        ))}
                    </div>

                    <div className="space-y-4">
                        <div className="h-12 w-full bg-primary/20 rounded-xl animate-pulse" />
                        <div className="grid grid-cols-2 gap-4">
                            <div className="h-12 w-full bg-gray-100 dark:bg-zinc-900 rounded-xl animate-pulse" />
                            <div className="h-12 w-full bg-gray-100 dark:bg-zinc-900 rounded-xl animate-pulse" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
