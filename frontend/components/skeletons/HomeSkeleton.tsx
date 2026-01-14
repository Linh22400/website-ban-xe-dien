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

                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                    {[...Array(8)].map((_, i) => (
                        <div key={i} className="aspect-[3/4] rounded-2xl bg-gray-100 dark:bg-zinc-800/60 animate-pulse flex flex-col p-4 space-y-3 border border-transparent dark:border-white/5">
                            <div className="w-full aspect-square rounded-lg bg-white dark:bg-zinc-700/50" />
                            <div className="w-3/4 h-4 rounded bg-gray-200 dark:bg-zinc-700" />
                            <div className="w-1/2 h-4 rounded bg-gray-200 dark:bg-zinc-700" />
                            <div className="mt-auto flex justify-between items-end pt-2">
                                <div className="w-20 h-6 rounded bg-gray-200 dark:bg-zinc-700" />
                                <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-zinc-700" />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
