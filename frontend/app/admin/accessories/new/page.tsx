"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import {
    ChevronLeft,
    Save,
    Loader2,
    ImagePlus,
    X,
    Upload
} from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { createAccessory, updateAccessory, getAccessoryById, uploadFile } from "@/lib/api";

const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || "http://localhost:1337";

function AccessoryForm() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const id = searchParams.get("id");
    const { token } = useAuth();

    const [loading, setLoading] = useState(!!id);
    const [saving, setSaving] = useState(false);
    const [uploading, setUploading] = useState(false);

    // Form State
    const [formData, setFormData] = useState({
        name: "",
        slug: "", // Will be auto-generated from name if empty
        price: 0,
        category: "other",
        description: "",
        isFeatured: false,
        image: null as any // Stores the Strapi media object or ID
    });

    // Preview for image
    const [imagePreview, setImagePreview] = useState<string | null>(null);

    // Fetch existing data if ID is present
    useEffect(() => {
        if (id && token) {
            getAccessoryById(token, id).then((data) => {
                if (data) {
                    setFormData({
                        name: data.name || "",
                        slug: data.slug || "",
                        price: data.price || 0,
                        category: data.category || "other",
                        description: data.description || "",
                        isFeatured: data.isFeatured || false,
                        image: data.image
                    });

                    // Set preview
                    if (data.image) {
                        const img = data.image.data || data.image; // Handle nested or flat
                        if (img && img.url) {
                            setImagePreview(img.url.startsWith('http') ? img.url : `${STRAPI_URL}${img.url}`);
                        }
                    }
                }
                setLoading(false);
            });
        }
    }, [id, token]);

    // Handle Image Upload
    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files || !e.target.files[0] || !token) return;

        const file = e.target.files[0];
        setUploading(true);

        try {
            const uploadedFiles = await uploadFile(token, file);
            if (uploadedFiles && uploadedFiles.length > 0) {
                const uploadedImage = uploadedFiles[0];
                setFormData(prev => ({ ...prev, image: uploadedImage }));
                setImagePreview(uploadedImage.url.startsWith('http') ? uploadedImage.url : `${STRAPI_URL}${uploadedImage.url}`);
            }
        } catch (error) {
            console.error("Upload failed", error);
            alert("Tải ảnh thất bại");
        } finally {
            setUploading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        try {
            // Generate slug if empty
            let submitData = { ...formData };
            if (!submitData.slug) {
                submitData.slug = submitData.name
                    .toLowerCase()
                    .normalize("NFD")
                    .replace(/[\u0300-\u036f]/g, "")
                    .replace(/đ/g, "d")
                    .replace(/[^a-z0-9]/g, "-");
            }

            // Only send image ID
            if (submitData.image && submitData.image.id) {
                // @ts-ignore
                submitData.image = submitData.image.id;
            } else {
                // @ts-ignore
                delete submitData.image; // Don't send object if not changed/valid ID
            }

            if (id) {
                await updateAccessory(token!, id, submitData);
            } else {
                await createAccessory(token!, submitData);
            }
            router.push("/admin/accessories");
            router.refresh();
        } catch (error) {
            console.error("Failed to save", error);
            alert("Lưu thất bại!");
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <div className="text-foreground p-8">Đang tải dữ liệu...</div>;

    return (
        <form onSubmit={handleSubmit} className="space-y-6 max-w-4xl">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Link
                        href="/admin/accessories"
                        className="p-2 hover:bg-muted/50 rounded-full transition-colors text-muted-foreground hover:text-foreground"
                    >
                        <ChevronLeft className="w-6 h-6" />
                    </Link>
                    <div>
                        <h1 className="text-3xl font-bold text-foreground">
                            {id ? "Chỉnh Sửa Phụ Kiện" : "Thêm Phụ Kiện Mới"}
                        </h1>
                        <p className="text-muted-foreground">Điền thông tin phụ kiện.</p>
                    </div>
                </div>
                <button
                    type="submit"
                    disabled={saving}
                    className="px-6 py-2 bg-primary text-black font-bold rounded-xl hover:bg-white transition-colors flex items-center gap-2 shadow-lg shadow-primary/20 disabled:opacity-50"
                >
                    {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                    {id ? "Cập Nhật" : "Tạo Mới"}
                </button>
            </div>

            {/* Main Content */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Column - Image */}
                <div className="lg:col-span-1 space-y-6">
                    <div className="bg-card border border-border rounded-2xl p-6">
                        <h3 className="font-bold text-lg text-foreground mb-4">Hình Ảnh</h3>
                        <div className="aspect-square bg-background rounded-xl border-2 border-dashed border-border flex flex-col items-center justify-center relative overflow-hidden group hover:border-primary/50 transition-colors">
                            {imagePreview ? (
                                <>
                                    <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                                    <div className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setImagePreview(null);
                                                setFormData(prev => ({ ...prev, image: null }));
                                            }}
                                            className="p-2 bg-red-500 rounded-full text-white hover:bg-red-600"
                                        >
                                            <X className="w-5 h-5" />
                                        </button>
                                    </div>
                                </>
                            ) : (
                                <div className="text-center p-4">
                                    <ImagePlus className="w-10 h-10 text-muted-foreground mx-auto mb-2" />
                                    <p className="text-sm text-muted-foreground">Tải ảnh lên</p>
                                </div>
                            )}

                            {!imagePreview && (
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageUpload}
                                    className="absolute inset-0 opacity-0 cursor-pointer"
                                />
                            )}

                            {uploading && (
                                <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                                    <Loader2 className="w-8 h-8 text-primary animate-spin" />
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Right Column - Details */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-card border border-border rounded-2xl p-6 space-y-4">
                        <h3 className="font-bold text-lg text-foreground mb-4">Thông Tin Cơ Bản</h3>

                        {/* Name */}
                        <div>
                            <label className="block text-sm font-medium text-muted-foreground mb-1">Tên Phụ Kiện</label>
                            <input
                                type="text"
                                required
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                className="w-full bg-background border border-border rounded-xl px-4 py-3 text-foreground focus:outline-none focus:border-primary"
                                placeholder="Ví dụ: Mũ Bảo Hiểm 3/4"
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            {/* Price */}
                            <div>
                                <label className="block text-sm font-medium text-muted-foreground mb-1">Giá Bán (VNĐ)</label>
                                <input
                                    type="number"
                                    required
                                    min="0"
                                    value={formData.price}
                                    onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                                    className="w-full bg-background border border-border rounded-xl px-4 py-3 text-foreground focus:outline-none focus:border-primary"
                                />
                            </div>

                            {/* Category */}
                            <div>
                                <label className="block text-sm font-medium text-muted-foreground mb-1">Danh Mục</label>
                                <select
                                    value={formData.category}
                                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                    className="w-full bg-background border border-border rounded-xl px-4 py-3 text-foreground focus:outline-none focus:border-primary appearance-none"
                                >
                                    <option value="helmet">Mũ Bảo Hiểm</option>
                                    <option value="charger">Sạc Xe</option>
                                    <option value="battery">Pin / Ắc Quy</option>
                                    <option value="motorConfig">Động Cơ</option>
                                    <option value="other">Khác</option>
                                </select>
                            </div>
                        </div>

                        {/* Slug */}
                        <div>
                            <label className="block text-sm font-medium text-muted-foreground mb-1">Slug (Link - Tự động tạo)</label>
                            <input
                                type="text"
                                value={formData.slug}
                                onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                                className="w-full bg-background border border-border rounded-xl px-4 py-3 text-muted-foreground focus:outline-none focus:border-primary text-sm"
                                placeholder="mu-bao-hiem-3-4"
                            />
                        </div>

                        {/* Description */}
                        <div>
                            <label className="block text-sm font-medium text-muted-foreground mb-1">Mô Tả</label>
                            <textarea
                                rows={4}
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                className="w-full bg-background border border-border rounded-xl px-4 py-3 text-foreground focus:outline-none focus:border-primary resize-none"
                                placeholder="Mô tả chi tiết sản phẩm..."
                            />
                        </div>

                        {/* Featured Toggle */}
                        <div className="flex items-center gap-3 pt-2">
                            <input
                                type="checkbox"
                                id="isFeatured"
                                checked={formData.isFeatured}
                                onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
                                className="w-5 h-5 rounded border-muted-foreground text-primary focus:ring-primary bg-transparent accent-primary"
                            />
                            <label htmlFor="isFeatured" className="text-foreground cursor-pointer select-none">
                                Đánh dấu là Phụ Kiện Nổi Bật
                            </label>
                        </div>
                    </div>
                </div>
            </div>
        </form>
    );
}

export default function NewAccessoryPage() {
    return (
        <Suspense fallback={<div className="text-foreground">Đang tải...</div>}>
            <AccessoryForm />
        </Suspense>
    );
}
