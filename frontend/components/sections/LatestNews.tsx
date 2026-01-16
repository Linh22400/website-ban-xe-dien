"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowRight, Calendar, Clock, ChevronRight } from 'lucide-react';
import { getArticles, Article } from '@/lib/api';
import Image from 'next/image';

export default function LatestNews() {
    const [articles, setArticles] = useState<Article[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchNews = async () => {
            try {
                // Fetch articles using existing API
                // Assuming getArticles() sorts by date desc by default
                const allArticles = await getArticles();
                setArticles(allArticles.slice(0, 3)); // Take top 3
            } catch (error) {
                console.error("Failed to fetch news", error);
            } finally {
                setLoading(false);
            }
        };

        fetchNews();
    }, []);

    if (!loading && articles.length === 0) {
        return null;
    }

    return (
        <section className="py-10 bg-background border-t border-border">
            <div className="container mx-auto px-4">
                {/* Section Header */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
                    <div className="max-w-2xl">
                        <span className="text-primary font-bold tracking-wider uppercase text-sm mb-2 block">Cập Nhật Mới Nhất</span>
                        <h2 className="text-3xl md:text-4xl font-black text-foreground uppercase leading-tight">
                            Tin Tức & <span className="text-primary">Sự Kiện</span>
                        </h2>
                        <div className="h-1 w-20 bg-primary mt-4 rounded-full"></div>
                    </div>

                    <Link
                        // Route tin tức của project đang là /blog (không phải /tin-tuc)
                        href="/blog"
                        className="group flex items-center gap-2 text-muted-foreground font-bold hover:text-primary transition-colors pb-1 border-b-2 border-transparent hover:border-primary"
                    >
                        Xem tất cả tin tức
                        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </Link>
                </div>

                {/* Articles Grid */}
                <div className="flex flex-nowrap overflow-x-auto snap-x snap-mandatory md:grid md:grid-cols-3 gap-3 md:gap-8 pb-4 md:pb-0 scrollbar-hide">
                    {loading ? (
                        // Loading Skeletons
                        [1, 2, 3].map((i) => (
                            <div key={i} className="flex-shrink-0 w-[80vw] md:w-auto snap-center animate-pulse">
                                <div className="bg-muted aspect-[4/3] rounded-2xl mb-4"></div>
                                <div className="h-4 bg-muted w-1/3 mb-3 rounded"></div>
                                <div className="h-6 bg-muted w-3/4 mb-3 rounded"></div>
                                <div className="h-20 bg-muted w-full rounded"></div>
                            </div>
                        ))
                    ) : (
                        articles.map((article) => (
                            <Link
                                // Route chi tiết bài viết: /blog/[slug]
                                href={`/blog/${article.slug}`}
                                key={article.id}
                                className="flex-shrink-0 w-[80vw] md:w-auto snap-center group flex flex-col h-full bg-card rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-border ring-1 ring-black/5 dark:ring-white/10 hover:-translate-y-1"
                            >
                                {/* Image Container */}
                                <div className="relative aspect-[4/3] overflow-hidden">
                                    <div className="absolute inset-0 bg-muted animate-pulse"></div>
                                    <Image
                                        src={article.coverImage}
                                        alt={article.title}
                                        fill
                                        sizes="(min-width: 768px) 33vw, 50vw"
                                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                                    {/* Category Badge - Condensed for Mobile */}
                                    {article.category && (
                                        <span className="absolute top-2 left-2 md:top-4 md:left-4 bg-background/90 text-foreground text-[10px] md:text-xs font-bold px-2 py-0.5 md:px-3 md:py-1 rounded-full uppercase tracking-wider shadow-lg">
                                            {article.category.name}
                                        </span>
                                    )}
                                </div>

                                {/* Content */}
                                <div className="flex flex-col flex-grow p-3 md:p-6">
                                    {/* Meta Info */}
                                    <div className="flex flex-wrap items-center gap-2 md:gap-4 text-[10px] md:text-xs text-muted-foreground mb-2 md:mb-3 font-medium">
                                        {article.publishedDate && (
                                            <div className="flex items-center gap-1">
                                                <Calendar className="w-3 h-3 text-primary" />
                                                {new Date(article.publishedDate).toLocaleDateString('vi-VN')}
                                            </div>
                                        )}
                                    </div>

                                    <h3 className="text-sm md:text-xl font-bold text-card-foreground mb-2 md:mb-3 line-clamp-2 leading-tight group-hover:text-primary transition-colors">
                                        {article.title}
                                    </h3>

                                    <p className="text-muted-foreground text-sm line-clamp-2 mb-3 md:mb-6 flex-grow hidden md:block">
                                        {article.excerpt}
                                    </p>

                                    <div className="flex items-center text-primary font-bold text-xs md:text-sm mt-auto">
                                        Đọc tiếp
                                        <ChevronRight className="w-3 h-3 md:w-4 md:h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                                    </div>
                                </div>
                            </Link>
                        ))
                    )}
                </div>
            </div>
        </section>
    );
}
