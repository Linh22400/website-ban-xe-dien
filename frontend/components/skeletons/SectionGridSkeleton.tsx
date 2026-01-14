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
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                    {[...Array(count)].map((_, i) => (
                        <div key={i} className="aspect-[3/4] rounded-2xl bg-gray-100 dark:bg-zinc-800/50 animate-pulse border border-transparent dark:border-white/5 flex flex-col p-4 space-y-3">
                            <div className="w-full aspect-square rounded-xl bg-white dark:bg-zinc-700/50" />
                            <div className="h-4 w-3/4 bg-gray-200 dark:bg-zinc-700 rounded" />
                            <div className="h-4 w-1/2 bg-gray-200 dark:bg-zinc-700 rounded" />
                            <div className="mt-auto flex justify-between items-end">
                                <div className="h-6 w-24 bg-gray-200 dark:bg-zinc-700 rounded" />
                                <div className="h-8 w-8 rounded-full bg-gray-200 dark:bg-zinc-700" />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
