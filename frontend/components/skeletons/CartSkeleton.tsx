export default function CartSkeleton() {
    return (
        <div className="container mx-auto px-4 py-8 mt-20">
            <div className="h-10 w-48 bg-gray-200 dark:bg-zinc-800 rounded-lg animate-pulse mb-8" />

            <div className="flex flex-col lg:flex-row gap-8">
                {/* Cart Items List */}
                <div className="flex-1 space-y-4">
                    {[...Array(3)].map((_, i) => (
                        <div key={i} className="flex gap-4 p-4 border border-gray-100 dark:border-zinc-800 rounded-2xl animate-pulse">
                            <div className="w-24 h-24 bg-gray-200 dark:bg-zinc-800 rounded-xl" />
                            <div className="flex-1 space-y-3">
                                <div className="h-6 w-3/4 bg-gray-200 dark:bg-zinc-800 rounded" />
                                <div className="h-4 w-1/3 bg-gray-100 dark:bg-zinc-900 rounded" />
                                <div className="flex justify-between items-end mt-auto">
                                    <div className="h-5 w-20 bg-gray-200 dark:bg-zinc-800 rounded" />
                                    <div className="h-8 w-8 bg-gray-200 dark:bg-zinc-800 rounded-lg" />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Summary Sidebar */}
                <div className="w-full lg:w-96 space-y-6">
                    <div className="p-6 border border-gray-100 dark:border-zinc-800 rounded-2xl animate-pulse space-y-4">
                        <div className="h-6 w-1/2 bg-gray-200 dark:bg-zinc-800 rounded" />
                        <div className="flex justify-between">
                            <div className="h-4 w-20 bg-gray-100 dark:bg-zinc-900 rounded" />
                            <div className="h-4 w-20 bg-gray-100 dark:bg-zinc-900 rounded" />
                        </div>
                        <div className="h-px bg-gray-100 dark:bg-zinc-800 w-full" />
                        <div className="flex justify-between">
                            <div className="h-6 w-24 bg-gray-200 dark:bg-zinc-800 rounded" />
                            <div className="h-6 w-32 bg-primary/20 rounded" />
                        </div>
                        <div className="h-12 w-full bg-primary/20 rounded-xl mt-4" />
                    </div>
                </div>
            </div>
        </div>
    );
}
