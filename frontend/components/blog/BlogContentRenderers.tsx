'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';

// Client-side Markdown Renderer with theme detection
export const MarkdownRenderer = ({ content }: { content: string }) => {
    const [isDark, setIsDark] = useState(false);

    useEffect(() => {
        // Check initial theme
        setIsDark(document.documentElement.classList.contains('dark'));

        // Watch for theme changes
        const observer = new MutationObserver(() => {
            setIsDark(document.documentElement.classList.contains('dark'));
        });

        observer.observe(document.documentElement, {
            attributes: true,
            attributeFilter: ['class']
        });

        return () => observer.disconnect();
    }, []);

    if (!content) return null;

    const paragraphs = content.split(/\n\n+/);

    const getTextStyle = (type: 'heading' | 'body' | 'bold') => {
        if (type === 'heading') {
            return { color: isDark ? '#ffffff' : '#111827' };
        } else if (type === 'bold') {
            return { color: isDark ? '#ffffff' : '#111827', fontWeight: 'bold' as const };
        } else {
            return { color: isDark ? '#d1d5db' : '#374151' };
        }
    };

    return (
        <div className="prose prose-lg max-w-none">
            {paragraphs.map((paragraph, index) => {
                if (paragraph.startsWith('# ')) return <h1 key={index} className="text-3xl font-bold mt-8 mb-4" style={getTextStyle('heading')}>{paragraph.replace('# ', '')}</h1>;
                if (paragraph.startsWith('## ')) return <h2 key={index} className="text-2xl font-bold mt-8 mb-4" style={getTextStyle('heading')}>{paragraph.replace('## ', '')}</h2>;
                if (paragraph.startsWith('### ')) return <h3 key={index} className="text-xl font-bold mt-6 mb-3" style={getTextStyle('heading')}>{paragraph.replace('### ', '')}</h3>;

                if (paragraph.trim().startsWith('- ') || paragraph.trim().startsWith('* ')) {
                    const items = paragraph.split('\n').map(line => line.replace(/^[-*]\s/, ''));
                    return (
                        <ul key={index} className="list-disc list-inside mb-4 space-y-2" style={getTextStyle('body')}>
                            {items.map((item, i) => <li key={i}>{item}</li>)}
                        </ul>
                    );
                }

                const formattedText = paragraph.split(/(\*\*.*?\*\*)/).map((part, i) => {
                    if (part.startsWith('**') && part.endsWith('**')) {
                        return <strong key={i} style={getTextStyle('bold')}>{part.slice(2, -2)}</strong>;
                    }
                    return part;
                });

                return <p key={index} className="mb-4 leading-relaxed" style={getTextStyle('body')}>{formattedText}</p>;
            })}
        </div>
    );
};

export const ImageRenderer = ({ data }: { data: any }) => {
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

export const SectionRenderer = ({ data }: { data: any }) => {
    const [isDark, setIsDark] = useState(false);

    useEffect(() => {
        setIsDark(document.documentElement.classList.contains('dark'));
        const observer = new MutationObserver(() => {
            setIsDark(document.documentElement.classList.contains('dark'));
        });
        observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
        return () => observer.disconnect();
    }, []);

    return (
        <div className="my-12">
            {data.title && (
                <h2
                    className="text-2xl md:text-3xl font-bold mb-6"
                    style={{ color: isDark ? '#ffffff' : '#111827' }}
                >
                    {data.title}
                </h2>
            )}
            {data.description && <MarkdownRenderer content={data.description} />}
        </div>
    );
};

export const GalleryRenderer = ({ data }: { data: any }) => {
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

export const TwoColumnRenderer = ({ data }: { data: any }) => {
    const isRightImage = data.layout === 'right-image';

    return (
        <div className={`my-12 flex flex-col lg:flex-row gap-8 items-center ${isRightImage ? 'lg:flex-row-reverse' : ''}`}>
            <div className="w-full lg:w-1/2">
                <ImageRenderer data={data} />
            </div>
            <div className="w-full lg:w-1/2">
                <MarkdownRenderer content={data.content} />
            </div>
        </div>
    );
};
