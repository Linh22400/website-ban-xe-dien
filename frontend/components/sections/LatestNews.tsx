"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowRight, Calendar, Clock, ChevronRight } from 'lucide-react';
import { getArticles, Article } from '@/lib/api';

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
        <section className="py-20 bg-zinc-50 border-t border-zinc-200">
            <div className="container mx-auto px-4">
                {/* Section Header */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
                    <div className="max-w-2xl">
                        <span className="text-primary font-bold tracking-wider uppercase text-sm mb-2 block">Cập Nhật Mới Nhất</span>
                        <h2 className="text-3xl md:text-4xl font-black text-zinc-900 uppercase leading-tight">
                            Tin Tức & <span className="text-primary">Sự Kiện</span>
                        </h2>
                        <div className="h-1 w-20 bg-primary mt-4 rounded-full"></div>
                    </div>

                    <Link
                        href="/tin-tuc"
                        className="group flex items-center gap-2 text-zinc-600 font-bold hover:text-primary transition-colors pb-1 border-b-2 border-transparent hover:border-primary"
                    >
                        Xem tất cả tin tức
                        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </Link>
                </div>

                {/* Articles Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {loading ? (
                        // Loading Skeletons
                        [1, 2, 3].map((i) => (
                            <div key={i} className="animate-pulse">
                                <div className="bg-zinc-200 aspect-[4/3] rounded-2xl mb-4"></div>
                                <div className="h-4 bg-zinc-200 w-1/3 mb-3 rounded"></div>
                                <div className="h-6 bg-zinc-200 w-3/4 mb-3 rounded"></div>
                                <div className="h-20 bg-zinc-200 w-full rounded"></div>
                            </div>
                        ))
                    ) : (
                        articles.map((article) => (
                            <Link
                                href={`/tin-tuc/${article.slug}`}
                                key={article.id}
                                className="group flex flex-col h-full bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-zinc-100 ring-1 ring-zinc-900/5 hover:-translate-y-1"
                            >
                                {/* Image Container */}
                                <div className="relative aspect-[4/3] overflow-hidden">
                                    <div className="absolute inset-0 bg-zinc-200 animate-pulse"></div>
                                    <img
                                        src={article.coverImage}
                                        alt={article.title}
                                        className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                        loading="lazy"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                                    {/* Category Badge */}
                                    {article.category && (
                                        <span className="absolute top-4 left-4 bg-white/90 backdrop-blur text-zinc-900 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-lg">
                                            {article.category.name}
                                        </span>
                                    )}
                                </div>

                                {/* Content */}
                                <div className="flex flex-col flex-grow p-6">
                                    {/* Meta Info */}
                                    <div className="flex items-center gap-4 text-xs text-zinc-500 mb-3 font-medium">
                                        {article.publishedDate && (
                                            <div className="flex items-center gap-1.5">
                                                <Calendar className="w-3.5 h-3.5 text-primary" />
                                                {new Date(article.publishedDate).toLocaleDateString('vi-VN')}
                                            </div>
                                        )}
                                        {article.readingTime && (
                                            <div className="flex items-center gap-1.5">
                                                <Clock className="w-3.5 h-3.5 text-primary" />
                                                {article.readingTime} phút đọc
                                            </div>
                                        )}
                                    </div>

                                    <h3 className="text-xl font-bold text-zinc-900 mb-3 line-clamp-2 leading-tight group-hover:text-primary transition-colors">
                                        {article.title}
                                    </h3>

                                    <p className="text-zinc-500 text-sm line-clamp-3 mb-6 flex-grow">
                                        {article.excerpt}
                                    </p>

                                    <div className="flex items-center text-primary font-bold text-sm mt-auto">
                                        Đọc tiếp
                                        <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
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
