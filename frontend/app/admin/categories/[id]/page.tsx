"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Save, Loader2, Upload } from "lucide-react";
import { getCategoryById, updateProductCategory, uploadFile } from "@/lib/api";
import { useAuth } from "@/lib/auth-context";

export default function EditCategoryPage() {
    const router = useRouter();
    const params = useParams();
    const { token } = useAuth();
    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(true);

    // Image Upload State
    const [image, setImage] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [uploading, setUploading] = useState(false);

    const [formData, setFormData] = useState({
        name: "",
        slug: "",
        description: ""
    });

    useEffect(() => {
        async function fetchData() {
            if (token && params.id) {
                try {
                    const data = await getCategoryById(token, params.id as string);
                    if (data) {
                        setFormData({
                            name: data.name,
                            slug: data.slug,
                            description: data.description
                        });
                        if (data.image?.url) {
                            setImagePreview(data.image.url);
                        }
                    } else {
                        alert("Không tìm thấy danh mục!");
                        router.push("/admin/categories");
                    }
                } catch (error) {
                    console.error("Failed to fetch category", error);
                } finally {
                    setFetching(false);
                }
            }
        }
        fetchData();
    }, [token, params.id, router]);

    // Auto-generate slug from name
    const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const name = e.target.value;
        // Only auto-update slug if user hasn't manually edited it differently? 
        // For simplicity, we'll keep auto-generating for now, or maybe only if slug is empty.
        // Actually, user might want to simple fix a typo in name without changing slug.
        // Let's just update name, but provide a button or logic? 
        // Standard practice: Update name updates slug ONLY if it's a new record. 
        // For edit, usually we don't auto-update slug unless explicitly asked.
        // For now, I will NOT auto-update slug on edit to avoid breaking links.
        setFormData(prev => ({ ...prev, name }));
    };

    const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setImage(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            if (token) {
                let imageId = null;

                // 1. Upload Image if exists (new file selected)
                if (image) {
                    setUploading(true);
                    const uploadedFiles = await uploadFile(token, image);
                    if (uploadedFiles && uploadedFiles.length > 0) {
                        imageId = uploadedFiles[0].id;
                    }
                    setUploading(false);
                }

                // 2. Update Category
                const payload: any = {
                    ...formData,
                };
                if (imageId) {
                    payload.image = imageId;
                }

                const success = await updateProductCategory(token, params.id as string, payload);
                if (success) {
                    alert("Cập nhật danh mục thành công!");
                    router.push("/admin/categories");
                } else {
                    alert("Lỗi khi cập nhật danh mục. Vui lòng thử lại.");
                }
            }
        } catch (error) {
            console.error("Submission error:", error);
            alert("Đã có lỗi xảy ra.");
        } finally {
            setLoading(false);
            setUploading(false);
        }
    };

    if (fetching) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <div className="max-w-2xl mx-auto space-y-6">
            {/* Header */}
            <div className="flex items-center gap-4">
                <Link
                    href="/admin/categories"
                    className="p-2 rounded-xl bg-muted/50 hover:bg-muted text-foreground transition-colors"
                >
                    <ArrowLeft className="w-5 h-5" />
                </Link>
                <div>
                    <h1 className="text-2xl font-bold text-foreground">Chỉnh Sửa Danh Mục</h1>
                    <p className="text-muted-foreground">Cập nhật thông tin danh mục sản phẩm.</p>
                </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="bg-card border border-border rounded-2xl p-6 space-y-6">

                {/* Name */}
                <div className="space-y-2">
                    <label className="text-sm font-bold text-muted-foreground">Tên Danh Mục <span className="text-red-500">*</span></label>
                    <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={handleNameChange}
                        placeholder="Ví dụ: Xe Máy Điện..."
                        className="w-full bg-background border border-border rounded-xl px-4 py-3 text-foreground focus:outline-none focus:border-primary transition-colors"
                    />
                </div>

                {/* Slug */}
                <div className="space-y-2">
                    <label className="text-sm font-bold text-muted-foreground">Slug (Đường dẫn)</label>
                    <input
                        type="text"
                        required
                        value={formData.slug}
                        onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                        className="w-full bg-background border border-border rounded-xl px-4 py-3 text-muted-foreground focus:outline-none focus:border-primary transition-colors font-mono text-sm"
                    />
                    <p className="text-xs text-muted-foreground">URL: domain.com/danh-muc/{formData.slug || '...'}</p>
                </div>

                {/* Image Upload */}
                <div className="space-y-4">
                    <label className="text-sm font-bold text-muted-foreground">Hình Ảnh Danh Mục</label>

                    {imagePreview ? (
                        <div className="relative w-full aspect-[2/1] bg-background rounded-xl overflow-hidden group border border-border">
                            <img
                                src={imagePreview}
                                alt="Preview"
                                className="w-full h-full object-cover" // Changed to cover for better fit
                            />
                            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setImage(null);
                                        setImagePreview(null);
                                    }}
                                    className="px-4 py-2 bg-red-500 text-white rounded-lg font-medium hover:bg-red-600 transition-colors"
                                    disabled={uploading}
                                >
                                    Xóa ảnh
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div className="w-full aspect-[3/1] bg-background border-2 border-dashed border-border rounded-xl flex flex-col items-center justify-center gap-4 hover:border-primary/50 transition-colors cursor-pointer relative">
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleImageSelect}
                                className="absolute inset-0 opacity-0 cursor-pointer p-4"
                                disabled={uploading}
                            />
                            <div className="p-4 bg-muted/50 rounded-full text-primary">
                                {uploading ? <Loader2 className="w-6 h-6 animate-spin" /> : <Upload className="w-6 h-6" />}
                            </div>
                            <div className="text-center">
                                <p className="font-medium text-foreground">Thêm hình ảnh</p>
                                <p className="text-sm text-muted-foreground mt-1">Kéo thả hoặc click để tải lên</p>
                            </div>
                        </div>
                    )}
                </div>

                {/* Description */}
                <div className="space-y-2">
                    <label className="text-sm font-bold text-muted-foreground">Mô Tả</label>
                    <textarea
                        rows={4}
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        placeholder="Mô tả ngắn về danh mục này..."
                        className="w-full bg-background border border-border rounded-xl px-4 py-3 text-foreground focus:outline-none focus:border-primary transition-colors resize-none"
                    />
                </div>

                {/* Submit */}
                <div className="pt-4 border-t border-border flex justify-end">
                    <button
                        type="submit"
                        disabled={loading || uploading}
                        className="px-6 py-3 bg-primary text-primary-foreground font-bold rounded-xl hover:opacity-90 transition-opacity flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-primary/20"
                    >
                        {loading ? (
                            <>
                                <Loader2 className="w-5 h-5 animate-spin" />
                                Đang lưu...
                            </>
                        ) : (
                            <>
                                <Save className="w-5 h-5" />
                                Cập Nhật Danh Mục
                            </>
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
}
