export default function CartSkeleton() {
    return (
        <main className="min-h-screen bg-background pt-32 pb-20">
            <div className="container mx-auto px-4">
                <div className="max-w-6xl mx-auto">
                    {/* Header */}
                    <div className="mb-8 space-y-2">
                        <div className="h-10 w-64 bg-gray-200 dark:bg-zinc-800 rounded-lg animate-pulse" />
                        <div className="h-5 w-40 bg-gray-200 dark:bg-zinc-800 rounded animate-pulse" />
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Cart Items */}
                        <div className="lg:col-span-2 space-y-4">
                            {[...Array(3)].map((_, i) => (
                                <div key={i} className="bg-card border border-white/10 rounded-xl p-6 animate-pulse">
                                    <div className="flex flex-col sm:flex-row gap-6">
                                        {/* Image */}
                                        <div className="w-full sm:w-32 h-32 bg-gray-200 dark:bg-zinc-800 rounded-lg shrink-0" />

                                        {/* Details */}
                                        <div className="flex-1 space-y-3">
                                            <div className="h-6 w-3/4 bg-gray-200 dark:bg-zinc-800 rounded" />
                                            <div className="h-5 w-24 bg-primary/10 rounded-full" />
                                            
                                            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 mt-2">
                                                <div className="space-y-2">
                                                    <div className="h-7 w-32 bg-gray-200 dark:bg-zinc-800 rounded" />
                                                </div>

                                                {/* Quantity Controls Mock */}
                                                <div className="flex items-center gap-4">
                                                    <div className="h-10 w-24 bg-gray-200 dark:bg-zinc-800 rounded-lg" />
                                                    <div className="h-10 w-10 bg-gray-200 dark:bg-zinc-800 rounded-lg" />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Order Summary */}
                        <div className="lg:col-span-1">
                            <div className="bg-card border border-white/10 rounded-xl p-6 sticky top-32 animate-pulse">
                                <div className="h-7 w-40 bg-gray-200 dark:bg-zinc-800 rounded mb-6" />

                                <div className="space-y-4 mb-6">
                                    <div className="flex justify-between">
                                        <div className="h-5 w-20 bg-gray-200 dark:bg-zinc-800 rounded" />
                                        <div className="h-5 w-24 bg-gray-200 dark:bg-zinc-800 rounded" />
                                    </div>
                                    <div className="flex justify-between">
                                        <div className="h-5 w-24 bg-gray-200 dark:bg-zinc-800 rounded" />
                                        <div className="h-5 w-16 bg-primary/20 rounded" />
                                    </div>
                                    <div className="h-px bg-white/10 my-4" />
                                    <div className="flex justify-between">
                                        <div className="h-6 w-24 bg-gray-200 dark:bg-zinc-800 rounded" />
                                        <div className="h-6 w-32 bg-primary/20 rounded" />
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <div className="h-12 w-full bg-gray-200 dark:bg-zinc-800 rounded-full" />
                                    <div className="h-12 w-full bg-transparent border-2 border-white/10 rounded-full" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}
