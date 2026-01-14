export default function BlogDetailSkeleton() {
    return (
        <div className="container mx-auto px-4 py-8 mt-20 max-w-4xl">
            {/* Header */}
            <div className="space-y-4 mb-8 text-center">
                <div className="h-4 w-32 bg-primary/20 rounded-full animate-pulse mx-auto" />
                <div className="h-10 md:h-14 w-full bg-gray-200 dark:bg-zinc-800 rounded-lg animate-pulse" />
                <div className="h-6 w-2/3 bg-gray-200 dark:bg-zinc-800 rounded-lg animate-pulse mx-auto" />
                <div className="flex items-center justify-center gap-4 mt-6">
                    <div className="h-10 w-10 rounded-full bg-gray-200 dark:bg-zinc-800 animate-pulse" />
                    <div className="h-4 w-32 bg-gray-200 dark:bg-zinc-800 rounded animate-pulse" />
                </div>
            </div>

            {/* Cover Image */}
            <div className="aspect-video w-full rounded-3xl bg-gray-200 dark:bg-zinc-800 animate-pulse mb-12" />

            {/* Content */}
            <div className="space-y-6">
                {[...Array(10)].map((_, i) => (
                    <div key={i} className={`h-4 bg-gray-100 dark:bg-zinc-900 rounded animate-pulse ${i % 2 === 0 ? 'w-full' : 'w-5/6'}`} />
                ))}

                <div className="h-64 rounded-xl bg-gray-50 dark:bg-zinc-900/50 animate-pulse my-8" />

                {[...Array(6)].map((_, i) => (
                    <div key={i} className={`h-4 bg-gray-100 dark:bg-zinc-900 rounded animate-pulse ${i % 3 === 0 ? 'w-full' : 'w-4/5'}`} />
                ))}
            </div>
        </div>
    );
}
