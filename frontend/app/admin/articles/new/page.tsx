"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import dynamic from 'next/dynamic';
import {
    ArrowLeft,
    Save,
    Image as ImageIcon,
    Upload,
    Calendar,
    Clock,
    User,
    Tag,
    FileText,
    type LucideIcon
} from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import {
    createArticle,
    updateArticle,
    getArticleById,
    getArticleCategories,
    uploadFile
} from "@/lib/api";

// Dynamic Import for BlockManager
const BlockManager = dynamic(() => import('@/components/admin/article/BlockManager'), { ssr: false });

function ArticleFormContent() {
    const router = useRouter();
    const searchParams = useSearchParams(); // Expect ?id=...
    const id = searchParams.get("id");
    const { token } = useAuth();

    // Fallback URL logic
    const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || "http://localhost:1337";

    const [loading, setLoading] = useState(false);
    const [categories, setCategories] = useState<any[]>([]);

    // Form State
    const [title, setTitle] = useState("");
    const [slug, setSlug] = useState("");
    const [excerpt, setExcerpt] = useState("");
    const [blocks, setBlocks] = useState<any[]>([]); // New state for blocks
    const [categoryId, setCategoryId] = useState("");
    const [author, setAuthor] = useState("Admin");
    const [publishedDate, setPublishedDate] = useState(new Date().toISOString().split('T')[0]);
    const [readingTime, setReadingTime] = useState(5);
    const [featured, setFeatured] = useState(false);
    const [tags, setTags] = useState("");

    // SEO
    const [seoTitle, setSeoTitle] = useState("");
    const [seoDesc, setSeoDesc] = useState("");

    // Images
    const [coverFile, setCoverFile] = useState<File | null>(null);
    const [coverPreview, setCoverPreview] = useState("");
    const [coverId, setCoverId] = useState<number | undefined>();

    useEffect(() => {
        if (token) {
            loadCategories();
            if (id) {
                loadArticle(id);
            }
        }
    }, [token, id]);

    // Auto-generate slug and SEO title from title if they are empty
    useEffect(() => {
        if (!id && title) {
            // Only auto-fill for new articles
            const generatedSlug = title.toLowerCase()
                .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
                .replace(/[đĐ]/g, "d")
                .replace(/[^a-z0-9\s-]/g, "")
                .replace(/\s+/g, "-");

            if (!slug) setSlug(generatedSlug);
            if (!seoTitle) setSeoTitle(title);
        }
    }, [title, id, slug, seoTitle]);

    const loadCategories = async () => {
        const data = await getArticleCategories(token!);
        setCategories(data);
        if (data.length > 0 && !categoryId) {
            setCategoryId(data[0].id); // Default to first category
        }
    };

    const loadArticle = async (documentId: string) => {
        setLoading(true);
        const data = await getArticleById(token!, documentId);
        if (data) {
            setTitle(data.Title);
            setSlug(data.Slug);
            setExcerpt(data.Excerpt);
            setCategoryId(data.category?.id || "");
            setAuthor(data.Author);
            setPublishedDate(data.Published_Date);
            setReadingTime(data.Reading_Time);
            setFeatured(data.Featured);
            setTags(data.Tags);
            setSeoTitle(data.seoTitle);
            setSeoDesc(data.seoDescription);

            // Handle content parsing from Dynamic Zone
            if (data.content && Array.isArray(data.content)) {
                setBlocks(data.content);
            } else {
                // Initialize with empty text block if no content
                setBlocks([{ __component: 'product.article-text', content: '', tempId: Date.now() }]);
            }

            if (data.Cover_image?.url) {
                const url = data.Cover_image.url.startsWith('http')
                    ? data.Cover_image.url
                    : `${STRAPI_URL}${data.Cover_image.url}`;
                setCoverPreview(url);
                setCoverId(data.Cover_image.id);
            }
        }
        setLoading(false);
    };

    const handleCoverSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setCoverFile(file);
            const reader = new FileReader();
            reader.onload = (ev) => {
                if (ev.target?.result) setCoverPreview(ev.target.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSave = async () => {
        if (!title || !slug || !excerpt || !categoryId) {
            alert("Vui lòng điền các thông tin bắt buộc (Tiêu đề, Slug, Tóm tắt, Danh mục)!");
            return;
        }

        setLoading(true);

        // Upload Cover Image
        let finalCoverId = coverId;
        if (coverFile) {
            const uploadedFiles = await uploadFile(token!, coverFile);
            if (uploadedFiles && uploadedFiles.length > 0) {
                finalCoverId = uploadedFiles[0].id;
            } else {
                alert("Lỗi khi tải ảnh bìa!");
                setLoading(false);
                return;
            }
        }

        if (!finalCoverId) {
            alert("Vui lòng chọn ảnh bìa!");
            setLoading(false);
            return;
        }

        // Process blocks for saving
        const processedBlocks = blocks.map(block => {
            const newBlock = { ...block };

            // Remove tempId
            delete newBlock.tempId;

            // Handle Two Column Block Images
            if (block.__component === 'product.article-two-column' && block.image) {
                // If it has ID, use it. Strapi needs ID for media in components usually?
                // Actually Strapi 4/5 might expect the file ID or the file object structure it sent.
                // Safest is often just sending the ID if it's a relation.
                // But for component media field, it's often treating it as a file association.

                // If we uploaded new file, we have { id: ..., url: ... }
                // If existing, we have { id: ..., url: ... }
                // We should pass the ID.
                newBlock.image = block.image.id;
            }

            // Handle Gallery Images
            if (block.__component === 'product.article-gallery' && block.images) {
                newBlock.images = block.images.map((img: any) => img.id);
            }

            return newBlock;
        });

        const payload: any = {
            Title: title,
            Slug: slug,
            Excerpt: excerpt,
            Tags: tags || "General",
            Author: author,
            Published_Date: publishedDate,
            Reading_Time: Number(readingTime),
            Featured: featured,
            seoTitle: seoTitle,
            seoDescription: seoDesc || excerpt,
            Cover_image: finalCoverId,
            category: categoryId,
            content: processedBlocks
        };

        let success = false;
        if (id) {
            success = await updateArticle(token!, id, payload);
        } else {
            success = await createArticle(token!, payload);
        }

        if (success) {
            alert(id ? "Cập nhật bài viết thành công!" : "Tạo bài viết mới thành công!");
            router.push("/admin/articles");
        } else {
            alert("Có lỗi xảy ra! Vui lòng kiểm tra lại.");
        }
        setLoading(false);
    };

    return (
        <div className="space-y-6 pb-20">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Link
                        href="/admin/articles"
                        className="p-2 bg-white/5 hover:bg-white/10 rounded-xl transition-colors"
                    >
                        <ArrowLeft className="w-5 h-5 text-white" />
                    </Link>
                    <div>
                        <h1 className="text-2xl font-bold text-white">
                            {id ? "Chỉnh Sửa Bài Viết" : "Viết Bài Mới"}
                        </h1>
                        <p className="text-muted-foreground text-sm">Điền thông tin bài viết và SEO.</p>
                    </div>
                </div>
                <button
                    onClick={handleSave}
                    disabled={loading}
                    className="px-6 py-2.5 bg-primary text-black font-bold rounded-xl hover:bg-white transition-colors flex items-center gap-2 shadow-lg shadow-primary/20 disabled:opacity-50"
                >
                    <Save className="w-5 h-5" />
                    {loading ? "Đang lưu..." : "Lưu Bài Viết"}
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main Content (Left) */}
                <div className="lg:col-span-2 space-y-6">
                    {/* General Info */}
                    <div className="bg-card border border-white/10 rounded-2xl p-6 space-y-4">
                        <h2 className="text-lg font-bold text-white mb-4">Thông Tin Chung</h2>

                        <div className="space-y-2">
                            <label className="text-sm font-bold text-gray-300">Tiêu Đề Bài Viết <span className="text-red-500">*</span></label>
                            <input
                                type="text"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary transition-colors"
                                placeholder="Nhập tiêu đề bài viết..."
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-bold text-gray-300">Đường Dẫn (Slug) <span className="text-red-500">*</span></label>
                            <input
                                type="text"
                                value={slug}
                                onChange={(e) => setSlug(e.target.value)}
                                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary transition-colors font-mono text-sm"
                                placeholder="tieu-de-bai-viet"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-bold text-gray-300">Tóm Tắt (Excerpt) <span className="text-red-500">*</span></label>
                            <textarea
                                value={excerpt}
                                onChange={(e) => setExcerpt(e.target.value)}
                                rows={3}
                                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary transition-colors"
                                placeholder="Mô tả ngắn gọn về bài viết..."
                            />
                        </div>
                    </div>

                    {/* Block Content Editor */}
                    <div className="space-y-4">
                        <h2 className="text-lg font-bold text-white">Nội Dung Bài Viết</h2>
                        <BlockManager
                            blocks={blocks}
                            onChange={setBlocks}
                        />
                    </div>

                    {/* SEO Info */}
                    <div className="bg-card border border-white/10 rounded-2xl p-6 space-y-4">
                        <h2 className="text-lg font-bold text-white mb-4">Cấu Hình SEO</h2>

                        <div className="space-y-2">
                            <label className="text-sm font-bold text-gray-300">SEO Title</label>
                            <input
                                type="text"
                                value={seoTitle}
                                onChange={(e) => setSeoTitle(e.target.value)}
                                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary transition-colors"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-bold text-gray-300">SEO Description</label>
                            <textarea
                                value={seoDesc}
                                onChange={(e) => setSeoDesc(e.target.value)}
                                rows={3}
                                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary transition-colors"
                            />
                        </div>
                    </div>
                </div>

                {/* Sidebar (Right) */}
                <div className="lg:col-span-1 space-y-6">
                    {/* Cover Image */}
                    <div className="bg-card border border-white/10 rounded-2xl p-6 space-y-4">
                        <h2 className="text-lg font-bold text-white mb-4">Ảnh Đại Diện</h2>
                        <div className="space-y-4">
                            {coverPreview && (
                                <div className="relative aspect-video rounded-xl overflow-hidden border border-white/10">
                                    <img src={coverPreview} alt="Cover Preview" className="w-full h-full object-cover" />
                                </div>
                            )}
                            <label className="flex w-full h-32 border-2 border-dashed border-white/10 rounded-xl flex-col items-center justify-center cursor-pointer hover:border-primary/50 hover:bg-white/5 transition-all">
                                <Upload className="w-8 h-8 text-muted-foreground mb-2" />
                                <span className="text-sm text-muted-foreground">Tải ảnh bìa lên</span>
                                <input type="file" accept="image/*" onChange={handleCoverSelect} className="hidden" />
                            </label>
                        </div>
                    </div>

                    {/* Metadata */}
                    <div className="bg-card border border-white/10 rounded-2xl p-6 space-y-4">
                        <h2 className="text-lg font-bold text-white mb-4">Thuộc Tính</h2>

                        <div className="space-y-2">
                            <label className="text-sm font-bold text-gray-300 flex items-center gap-2">
                                <Tag className="w-4 h-4" /> Danh Mục
                            </label>
                            <select
                                value={categoryId}
                                onChange={(e) => setCategoryId(e.target.value)}
                                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary transition-colors"
                            >
                                <option value="">Chọn danh mục...</option>
                                {categories.map(cat => (
                                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                                ))}
                            </select>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-bold text-gray-300 flex items-center gap-2">
                                <User className="w-4 h-4" /> Tác Giả
                            </label>
                            <input
                                type="text"
                                value={author}
                                onChange={(e) => setAuthor(e.target.value)}
                                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary transition-colors"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-bold text-gray-300 flex items-center gap-2">
                                <Calendar className="w-4 h-4" /> Ngày Đăng
                            </label>
                            <input
                                type="date"
                                value={publishedDate}
                                onChange={(e) => setPublishedDate(e.target.value)}
                                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary transition-colors [color-scheme:dark]"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-bold text-gray-300 flex items-center gap-2">
                                <Clock className="w-4 h-4" /> Thời Gian Đọc (phút)
                            </label>
                            <input
                                type="number"
                                value={readingTime}
                                onChange={(e) => setReadingTime(Number(e.target.value))}
                                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary transition-colors"
                            />
                        </div>

                        <div className="pt-2 flex items-center gap-3">
                            <input
                                type="checkbox"
                                id="featured"
                                checked={featured}
                                onChange={(e) => setFeatured(e.target.checked)}
                                className="w-5 h-5 rounded border-white/10 bg-white/5 text-primary focus:ring-primary"
                            />
                            <label htmlFor="featured" className="text-sm font-bold text-white cursor-pointer select-none">
                                Đánh dấu nổi bật (Featured)
                            </label>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function ArticleForm() {
    return (
        <Suspense fallback={<div className="text-center py-12 text-muted-foreground">Đang tải form...</div>}>
            <ArticleFormContent />
        </Suspense>
    );
}
