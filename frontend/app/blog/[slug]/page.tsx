import { getArticleBySlug } from "@/lib/api";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
    MarkdownRenderer,
    ImageRenderer,
    SectionRenderer,
    GalleryRenderer,
    TwoColumnRenderer
} from "@/components/blog/BlogContentRenderers";
import { BlogSidebarHeading } from "@/components/blog/BlogSidebarHeading";

export const dynamic = 'force-dynamic';

interface PageProps {
    params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps) {
    const resolvedParams = await params;
    const article = await getArticleBySlug(resolvedParams.slug);

    if (!article) {
        return {
            title: "Bài viết không tồn tại",
        };
    }

    return {
        title: `${article.title} | Xe Điện Xanh`,
        description: article.excerpt,
    };
}

// Dynamic Zone Renderer
const DynamicZoneRenderer = ({ content }: { content: any[] }) => {
    if (!content || !Array.isArray(content)) return null;

    return (
        <div className="space-y-2">
            {content.map((block, index) => {
                // Check component type (handling potential naming variations)
                const componentName = block.__component || '';

                if (componentName.endsWith('article-text')) {
                    return <MarkdownRenderer key={index} content={block.content} />;
                }

                if (componentName.endsWith('article-image')) {
                    return <ImageRenderer key={index} data={block} />;
                }

                if (componentName.endsWith('article-section')) {
                    return <SectionRenderer key={index} data={block} />;
                }

                if (componentName.endsWith('article-gallery')) {
                    return <GalleryRenderer key={index} data={block} />;
                }

                if (componentName.endsWith('article-two-column')) {
                    return <TwoColumnRenderer key={index} data={block} />;
                }

                return null;
            })}
        </div>
    );
};

export default async function BlogDetailPage({ params }: PageProps) {
    const resolvedParams = await params;
    const article = await getArticleBySlug(resolvedParams.slug);

    if (!article) {
        notFound();
    }

    return (
        <main className="min-h-screen pt-24 pb-20 bg-background">
            {/* Hero Section */}
            <div className="relative h-[400px] w-full">
                {article.coverImage ? (
                    <Image
                        src={article.coverImage}
                        alt={article.title}
                        fill
                        className="object-cover"
                        priority
                    />
                ) : (
                    <div className="w-full h-full bg-gray-900" />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />

                <div className="absolute bottom-0 left-0 w-full p-6 md:p-12">
                    <div className="container mx-auto">
                        <div className="max-w-4xl">
                            {article.category && (
                                <span className="inline-block px-3 py-1 mb-4 text-xs font-bold bg-primary rounded-full">
                                    {article.category.name}
                                </span>
                            )}
                            <h1 className="text-3xl md:text-5xl font-bold text-gray mb-4 leading-tight">
                                {article.title}
                            </h1>
                            <div className="flex items-center gap-6 text-sm text-gray-500">
                                {article.author && (
                                    <div className="flex items-center gap-2">
                                        <span>✍️ {article.author}</span>
                                    </div>
                                )}
                                <div>📅 {article.publishedDate || "Mới cập nhật"}</div>
                                {article.readingTime && (
                                    <div>⏱️ {article.readingTime} phút đọc</div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="container mx-auto px-6 mt-12">
                <div className="flex flex-col lg:flex-row gap-12">
                    {/* Main Content */}
                    <div className="w-full lg:w-2/3">
                        <div className="bg-card/30 border border-white/5 rounded-2xl p-6 md:p-10">
                            <p className="text-xl text-gray-500 mb-8 font-medium italic border-l-4 border-primary pl-4">
                                {article.excerpt}
                            </p>

                            <DynamicZoneRenderer content={article.content} />
                        </div>
                    </div>

                    {/* Sidebar */}
                    <div className="w-full lg:w-1/3 space-y-8">
                        {/* Share */}
                        <div className="bg-card/30 border border-white/5 rounded-2xl p-6">
                            <BlogSidebarHeading>Chia sẻ bài viết</BlogSidebarHeading>
                            <div className="flex gap-2">
                                <button className="flex-1 bg-[#1877F2] text-white py-2 rounded-lg font-bold hover:opacity-90 transition-opacity">
                                    Facebook
                                </button>
                                <button className="flex-1 bg-[#1DA1F2] text-white py-2 rounded-lg font-bold hover:opacity-90 transition-opacity">
                                    Twitter
                                </button>
                            </div>
                        </div>

                        {/* Newsletter */}
                        <div className="bg-gradient-to-br from-primary/20 to-blue-600/20 border border-primary/20 rounded-2xl p-6 text-center">
                            <BlogSidebarHeading>Đăng ký nhận tin</BlogSidebarHeading>
                            <p className="text-sm text-muted-foreground mb-4">
                                Nhận thông tin mới nhất về xe điện và ưu đãi độc quyền.
                            </p>
                            <input
                                type="email"
                                placeholder="Email của bạn"
                                className="w-full bg-background/50 border border-white/10 rounded-lg px-4 py-2 text-gray-900 dark:text-white mb-3 focus:outline-none focus:border-primary"
                            />
                            <button className="w-full bg-primary text-black font-bold py-2 rounded-lg hover:bg-white transition-colors">
                                Đăng Ký Ngay
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}
