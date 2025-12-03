export function CarCardSkeleton() {
    return (
        <div className="bg-card rounded-2xl overflow-hidden border border-border animate-pulse">
            <div className="aspect-video bg-secondary"></div>
            <div className="p-6 space-y-4">
                <div className="h-6 bg-secondary rounded w-3/4"></div>
                <div className="h-4 bg-secondary rounded w-1/2"></div>
                <div className="grid grid-cols-2 gap-4 pt-4">
                    <div className="h-12 bg-secondary rounded"></div>
                    <div className="h-12 bg-secondary rounded"></div>
                </div>
            </div>
        </div>
    );
}

export function BlogCardSkeleton() {
    return (
        <div className="bg-card rounded-2xl overflow-hidden border border-border animate-pulse">
            <div className="aspect-[16/9] bg-secondary"></div>
            <div className="p-6 space-y-3">
                <div className="h-4 bg-secondary rounded w-1/4"></div>
                <div className="h-6 bg-secondary rounded w-full"></div>
                <div className="h-4 bg-secondary rounded w-full"></div>
                <div className="h-4 bg-secondary rounded w-3/4"></div>
            </div>
        </div>
    );
}

export function ProductDetailSkeleton() {
    return (
        <div className="flex flex-col lg:flex-row h-screen">
            <div className="w-full lg:w-2/3 h-[50vh] lg:h-full bg-secondary animate-pulse"></div>
            <div className="w-full lg:w-1/3 p-8 space-y-6">
                <div className="h-8 bg-secondary rounded w-3/4 animate-pulse"></div>
                <div className="h-4 bg-secondary rounded w-1/2 animate-pulse"></div>
                <div className="space-y-4 mt-8">
                    {[1, 2, 3, 4].map((i) => (
                        <div key={i} className="h-16 bg-secondary rounded animate-pulse"></div>
                    ))}
                </div>
            </div>
        </div>
    );
}
