export default function BlogListSkeleton() {
    return (
        <div className="container mx-auto px-4 py-8 mt-20">
            {/* Header */}
            <div className="mb-12 text-center">
                <div className="h-4 w-32 bg-gray-200 dark:bg-zinc-800 rounded-lg animate-pulse mx-auto mb-4" />
                <div className="h-10 w-64 bg-gray-200 dark:bg-zinc-800 rounded-lg animate-pulse mx-auto" />
            </div>

            {/* Featured Post */}
            <div className="mb-12 rounded-3xl overflow-hidden bg-gray-100 dark:bg-zinc-900 aspect-[21/9] animate-pulse relative">
                <div className="absolute bottom-0 left-0 p-8 w-full md:w-2/3 space-y-4">
                    <div className="h-6 w-32 bg-white/20 rounded animate-pulse" />
                    <div className="h-8 md:h-12 w-full bg-white/20 rounded animate-pulse" />
                </div>
            </div>

            {/* Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {[...Array(6)].map((_, i) => (
                    <div key={i} className="flex flex-col space-y-4">
                        <div className="aspect-[16/10] rounded-2xl bg-gray-200 dark:bg-zinc-800 animate-pulse" />
                        <div className="space-y-3">
                            <div className="h-4 w-24 bg-primary/20 rounded-full animate-pulse" />
                            <div className="h-6 w-full bg-gray-200 dark:bg-zinc-800 rounded animate-pulse" />
                            <div className="h-6 w-3/4 bg-gray-200 dark:bg-zinc-800 rounded animate-pulse" />
                            <div className="h-4 w-full bg-gray-100 dark:bg-zinc-900 rounded animate-pulse" />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
