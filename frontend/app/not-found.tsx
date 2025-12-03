import Link from "next/link";

export default function NotFound() {
    return (
        <main className="min-h-screen flex items-center justify-center px-6 bg-background">
            <div className="text-center max-w-2xl">
                <div className="mb-8">
                    <h1 className="text-9xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent mb-4">
                        404
                    </h1>
                    <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                        Không Tìm Thấy Trang
                    </h2>
                    <p className="text-muted-foreground text-lg mb-8">
                        Xin lỗi, trang bạn đang tìm kiếm không tồn tại hoặc đã được di chuyển.
                    </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Link
                        href="/"
                        className="px-8 py-4 bg-primary text-black font-bold rounded-full hover:bg-white transition-colors"
                    >
                        Về Trang Chủ
                    </Link>
                    <Link
                        href="/cars"
                        className="px-8 py-4 border border-white/20 text-white font-bold rounded-full hover:bg-white/10 transition-colors"
                    >
                        Xem Sản Phẩm
                    </Link>
                </div>

                {/* Decorative Elements */}
                <div className="mt-16 grid grid-cols-3 gap-4 opacity-20">
                    <div className="h-2 bg-gradient-to-r from-primary to-transparent rounded"></div>
                    <div className="h-2 bg-gradient-to-r from-accent to-transparent rounded"></div>
                    <div className="h-2 bg-gradient-to-r from-primary to-transparent rounded"></div>
                </div>
            </div>
        </main>
    );
}
