import { getArticleBySlug } from "@/lib/api";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

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

// Simple Markdown Renderer
const MarkdownRenderer = ({ content }: { content: string }) => {
    if (!content) return null;

    // Split by double newline to separate paragraphs
    const paragraphs = content.split(/\n\n+/);

    return (
        <div className="prose prose-invert prose-lg max-w-none text-gray-300">
            {paragraphs.map((paragraph, index) => {
                // Headers
                if (paragraph.startsWith('# ')) return <h1 key={index} className="text-3xl font-bold text-white mt-8 mb-4">{paragraph.replace('# ', '')}</h1>;
                if (paragraph.startsWith('## ')) return <h2 key={index} className="text-2xl font-bold text-white mt-8 mb-4">{paragraph.replace('## ', '')}</h2>;
                if (paragraph.startsWith('### ')) return <h3 key={index} className="text-xl font-bold text-white mt-6 mb-3">{paragraph.replace('### ', '')}</h3>;

                // Lists (simple support for unordered lists)
                if (paragraph.trim().startsWith('- ') || paragraph.trim().startsWith('* ')) {
                    const items = paragraph.split('\n').map(line => line.replace(/^[-*]\s/, ''));
                    return (
                        <ul key={index} className="list-disc list-inside mb-4 space-y-2">
                            {items.map((item, i) => <li key={i}>{item}</li>)}
                        </ul>
                    );
                }

                // Basic formatting (Bold) - very simple regex replacement for display
                const formattedText = paragraph.split(/(\*\*.*?\*\*)/).map((part, i) => {
                    if (part.startsWith('**') && part.endsWith('**')) {
                        return <strong key={i} className="text-white">{part.slice(2, -2)}</strong>;
                    }
                    return part;
                });

                return <p key={index} className="mb-4 leading-relaxed">{formattedText}</p>;
            })}
        </div>
    );
};

const ImageRenderer = ({ data }: { data: any }) => {
    if (!data.image?.url) return null;

    const imageUrl = data.image.url.startsWith('http')
        ? data.image.url
        : `${process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337'}${data.image.url}`;

    return (
        <div className="my-8 relative aspect-video rounded-xl overflow-hidden bg-gray-900">
            <Image
                src={imageUrl}
                alt={data.image.alternativeText || data.caption || 'Article Image'}
                fill
                className="object-cover"
            />
            {data.caption && (
                <div className="absolute bottom-0 left-0 right-0 bg-black/50 p-2 text-center text-sm text-white backdrop-blur-sm">
                    {data.caption}
                </div>
            )}
        </div>
    );
};

const SectionRenderer = ({ data }: { data: any }) => {
    return (
        <div className="my-12">
            {data.title && <h2 className="text-2xl md:text-3xl font-bold text-white mb-6">{data.title}</h2>}
            {data.description && <MarkdownRenderer content={data.description} />}
        </div>
    );
};

const GalleryRenderer = ({ data }: { data: any }) => {
    const images = data.images?.data || data.images || [];
    if (!Array.isArray(images) || images.length === 0) return null;

    return (
        <div className="my-12 grid grid-cols-1 md:grid-cols-2 gap-4">
            {images.map((img: any, index: number) => {
                const imageUrl = img.attributes?.url || img.url;
                if (!imageUrl) return null;

                const finalUrl = imageUrl.startsWith('http') ? imageUrl : `${process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337'}${imageUrl}`;

                return (
                    <div key={index} className="relative aspect-video rounded-xl overflow-hidden bg-gray-900 group">
                        <Image
                            src={finalUrl}
                            alt={img.attributes?.alternativeText || img.alternativeText || `Gallery Image ${index + 1}`}
                            fill
                            className="object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                    </div>
                );
            })}
        </div>
    );
};

const TwoColumnRenderer = ({ data }: { data: any }) => {
    const isRightImage = data.layout === 'right-image';

    return (
        <div className={`my-12 flex flex-col lg:flex-row gap-8 items-center ${isRightImage ? 'lg:flex-row-reverse' : ''}`}>
            {/* Image Side */}
            <div className="w-full lg:w-1/2">
                <ImageRenderer data={data} />
            </div>

            {/* Content Side */}
            <div className="w-full lg:w-1/2">
                <MarkdownRenderer content={data.content} />
            </div>
        </div>
    );
};

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
                                <span className="inline-block px-3 py-1 mb-4 text-xs font-bold text-white bg-primary rounded-full">
                                    {article.category.name}
                                </span>
                            )}
                            <h1 className="text-3xl md:text-5xl font-bold text-white mb-4 leading-tight">
                                {article.title}
                            </h1>
                            <div className="flex items-center gap-6 text-sm text-gray-300">
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
                            <p className="text-xl text-gray-300 mb-8 font-medium italic border-l-4 border-primary pl-4">
                                {article.excerpt}
                            </p>

                            <DynamicZoneRenderer content={article.content} />
                        </div>
                    </div>

                    {/* Sidebar */}
                    <div className="w-full lg:w-1/3 space-y-8">
                        {/* Share */}
                        <div className="bg-card/30 border border-white/5 rounded-2xl p-6">
                            <h3 className="text-lg font-bold text-white mb-4">Chia sẻ bài viết</h3>
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
                            <h3 className="text-xl font-bold text-white mb-2">Đăng ký nhận tin</h3>
                            <p className="text-sm text-muted-foreground mb-4">
                                Nhận thông tin mới nhất về xe điện và ưu đãi độc quyền.
                            </p>
                            <input
                                type="email"
                                placeholder="Email của bạn"
                                className="w-full bg-background/50 border border-white/10 rounded-lg px-4 py-2 text-white mb-3 focus:outline-none focus:border-primary"
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
