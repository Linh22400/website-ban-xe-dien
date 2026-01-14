export default function GenericPageSkeleton() {
    return (
        <div className="container mx-auto px-4 py-8 mt-20 max-w-5xl">
            {/* Header */}
            <div className="mb-12">
                <div className="h-4 w-24 bg-primary/20 rounded-full animate-pulse mb-4" />
                <div className="h-10 md:h-14 w-2/3 md:w-1/2 bg-gray-200 dark:bg-zinc-800 rounded-lg animate-pulse" />
            </div>

            {/* Content Body */}
            <div className="space-y-8">
                <div className="h-4 w-full bg-gray-100 dark:bg-zinc-900 rounded animate-pulse" />
                <div className="h-4 w-full bg-gray-100 dark:bg-zinc-900 rounded animate-pulse" />
                <div className="h-4 w-3/4 bg-gray-100 dark:bg-zinc-900 rounded animate-pulse" />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 my-8">
                    <div className="aspect-video rounded-2xl bg-gray-200 dark:bg-zinc-800 animate-pulse" />
                    <div className="space-y-4">
                        <div className="h-6 w-3/4 bg-gray-200 dark:bg-zinc-800 rounded animate-pulse" />
                        <div className="h-4 w-full bg-gray-100 dark:bg-zinc-900 rounded animate-pulse" />
                        <div className="h-4 w-full bg-gray-100 dark:bg-zinc-900 rounded animate-pulse" />
                        <div className="h-4 w-5/6 bg-gray-100 dark:bg-zinc-900 rounded animate-pulse" />
                        <div className="h-12 w-48 bg-primary/20 rounded-lg mt-4 animate-pulse" />
                    </div>
                </div>

                {[...Array(6)].map((_, i) => (
                    <div key={i} className="h-4 w-full bg-gray-100 dark:bg-zinc-900 rounded animate-pulse" />
                ))}
            </div>
        </div>
    );
}
