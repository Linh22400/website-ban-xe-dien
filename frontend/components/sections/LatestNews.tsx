import Link from 'next/link';
import { ArrowRight, Calendar, ChevronRight } from 'lucide-react';
import { getArticles } from '@/lib/api';
import Image from 'next/image';

export const revalidate = 3600; // 1 hour ISR

export default async function LatestNews() {
    let articles = [];
    try {
        const allArticles = await getArticles();
        articles = allArticles.slice(0, 3);
    } catch (error) {
        console.error("Failed to fetch news", error);
        return null;
    }

    if (articles.length === 0) {
        return null;
    }

    return (
        <section className="py-4 relative overflow-hidden bg-background">
            {/* Decorative Elements */}
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-orange-500/5 blur-[120px] rounded-full pointer-events-none" />

            <div className="container mx-auto px-4 relative z-10">
                {/* Header */}
                <div className="flex flex-col md:flex-row items-end justify-between mb-4 gap-6">
                    <div>
                        <div className="flex items-center gap-2 mb-3">
                            <span className="flex items-center justify-center w-8 h-8 rounded-full bg-orange-500/10 text-orange-500">
                                <Calendar className="w-4 h-4" />
                            </span>
                            <span className="text-sm font-bold text-orange-500 uppercase tracking-wider">Thông Tin & Sự Kiện</span>
                        </div>
                        <h2 className="text-4xl md:text-5xl font-black text-foreground tracking-tight">
                            Tin Tức <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-red-600">Mới Nhất</span>
                        </h2>
                        <p className="mt-4 text-muted-foreground text-lg max-w-xl">
                            Cập nhật những xu hướng mới nhất về xe điện, hướng dẫn sử dụng và các chương trình khuyến mãi hấp dẫn.
                        </p>
                    </div>

                    <Link
                        href="/blog"
                        className="group flex items-center gap-3 px-6 py-3 rounded-full border border-orange-500/20 hover:border-orange-500/50 bg-background/50 backdrop-blur-sm transition-all hover:bg-orange-500/5"
                    >
                        <span className="font-semibold text-sm">Xem tất cả tin tức</span>
                        <div className="w-8 h-8 rounded-full bg-orange-500/10 flex items-center justify-center group-hover:bg-orange-500 group-hover:text-white transition-all">
                            <ArrowRight className="w-4 h-4" />
                        </div>
                    </Link>
                </div>

                {/* Articles Grid */}
                <div className="flex flex-nowrap overflow-x-auto snap-x snap-mandatory md:grid md:grid-cols-3 gap-6 md:gap-8 pb-8 md:pb-0 scrollbar-hide -mx-4 px-4 md:mx-0 md:px-0">
                    {articles.map((article, index) => (
                        <Link
                            href={`/blog/${article.slug}`}
                            key={article.id}
                            className="flex-shrink-0 w-[85vw] md:w-auto snap-center group flex flex-col h-full bg-card rounded-3xl overflow-hidden shadow-sm hover:shadow-2xl hover:shadow-orange-500/10 transition-all duration-500 border border-border/50 hover:border-orange-500/30 hover:-translate-y-2"
                        >
                            {/* Image Container */}
                            <div className="relative aspect-[16/10] overflow-hidden">
                                <Image
                                    src={article.coverImage}
                                    alt={article.title}
                                    fill
                                    sizes="(min-width: 768px) 33vw, 85vw"
                                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-500"></div>

                                {/* Category Badge */}
                                {article.category && (
                                    <span className="absolute top-4 left-4 bg-white/90 dark:bg-black/80 backdrop-blur-md text-orange-600 dark:text-orange-400 text-xs font-bold px-3 py-1.5 rounded-full uppercase tracking-wider shadow-sm">
                                        {article.category.name}
                                    </span>
                                )}
                            </div>

                            {/* Content */}
                            <div className="flex flex-col flex-grow p-6 md:p-8 relative">
                                {/* Date */}
                                <div className="flex items-center gap-2 text-xs font-bold text-orange-500 mb-3 uppercase tracking-wide">
                                    <Calendar className="w-3.5 h-3.5" />
                                    {article.publishedDate ? new Date(article.publishedDate).toLocaleDateString('vi-VN') : 'Mới nhất'}
                                </div>

                                <h3 className="text-xl md:text-2xl font-bold text-foreground mb-3 leading-snug group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors line-clamp-2">
                                    {article.title}
                                </h3>

                                <p className="text-muted-foreground text-sm leading-relaxed line-clamp-3 mb-6 flex-grow">
                                    {article.excerpt}
                                </p>

                                <div className="flex items-center text-foreground font-bold text-sm mt-auto group/link">
                                    <span className="border-b-2 border-orange-500/30 group-hover:border-orange-500 transition-all pb-0.5">Đọc tiếp bài viết</span>
                                    <ChevronRight className="w-4 h-4 ml-1 text-orange-500 group-hover:translate-x-1 transition-transform" />
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
}
