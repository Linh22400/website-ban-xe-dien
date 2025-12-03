import Link from "next/link";
import Image from "next/image";
import { getArticles } from "@/lib/api";

export const metadata = {
    title: "Tin Tức & Bài Viết | Xe Điện Xanh",
    description: "Cập nhật tin tức và xu hướng mới nhất về xe điện tại Việt Nam.",
};

export const dynamic = 'force-dynamic';

export default async function BlogPage() {
    const articles = await getArticles();

    return (
        <main className="min-h-screen pt-24 pb-12 px-6 bg-background">
            <div className="container mx-auto">
                <div className="text-center mb-16">
                    <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">
                        Tin Tức & Bài Viết
                    </h1>
                    <p className="text-muted-foreground max-w-2xl mx-auto">
                        Cập nhật xu hướng mới nhất, đột phá công nghệ và tin tức từ thế giới xe điện.
                    </p>
                </div>

                {articles.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {articles.map((post) => (
                            <Link href={`/blog/${post.slug}`} key={post.id} className="group flex flex-col bg-card border border-border rounded-2xl overflow-hidden hover:border-primary/50 transition-all duration-300">
                                <div className="aspect-[16/9] relative overflow-hidden bg-gray-900">
                                    {post.coverImage ? (
                                        <Image
                                            src={post.coverImage}
                                            alt={post.title}
                                            fill
                                            className="object-cover transition-transform duration-500 group-hover:scale-110"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-gray-700">
                                            No Image
                                        </div>
                                    )}
                                    {post.category && (
                                        <div className="absolute top-4 left-4 bg-black/50 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold text-white border border-white/10">
                                            {post.category.name}
                                        </div>
                                    )}
                                </div>

                                <div className="p-6 flex flex-col flex-grow">
                                    <div className="flex items-center justify-between mb-3">
                                        <div className="text-sm text-primary">{post.publishedDate || "Mới cập nhật"}</div>
                                        {post.readingTime && (
                                            <div className="text-xs text-muted-foreground">{post.readingTime} phút đọc</div>
                                        )}
                                    </div>
                                    <h2 className="text-xl font-bold text-white mb-3 group-hover:text-primary transition-colors line-clamp-2">
                                        {post.title}
                                    </h2>
                                    <p className="text-muted-foreground text-sm line-clamp-3 mb-4 flex-grow">
                                        {post.excerpt}
                                    </p>
                                    <div className="flex items-center text-sm font-bold text-white group-hover:text-primary transition-colors">
                                        Đọc Bài Viết <span className="ml-2">→</span>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20 text-muted-foreground">
                        Chưa có bài viết nào.
                    </div>
                )}
            </div>
        </main>
    );
}
