export default function AuthSkeleton() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-background px-4 py-20">
            <div className="w-full max-w-md bg-white dark:bg-zinc-900 rounded-3xl p-8 border border-gray-100 dark:border-zinc-800 shadow-xl space-y-8 animate-pulse">
                <div className="flex flex-col items-center">
                    <div className="h-12 w-12 rounded-xl bg-primary/20 mb-4" />
                    <div className="h-8 w-48 bg-gray-200 dark:bg-zinc-800 rounded" />
                </div>

                <div className="space-y-4">
                    <div className="h-12 w-full bg-gray-100 dark:bg-zinc-800 rounded-xl" />
                    <div className="h-12 w-full bg-gray-100 dark:bg-zinc-800 rounded-xl" />
                </div>

                <div className="h-12 w-full bg-primary/20 rounded-xl" />

                <div className="flex justify-between">
                    <div className="h-4 w-24 bg-gray-100 dark:bg-zinc-800 rounded" />
                    <div className="h-4 w-24 bg-gray-100 dark:bg-zinc-800 rounded" />
                </div>
            </div>
        </div>
    );
}
