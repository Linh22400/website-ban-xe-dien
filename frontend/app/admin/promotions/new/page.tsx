"use client";

import { useState, useEffect, Suspense, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import {
    ChevronLeft,
    Save,
    Loader2,
    Image as ImageIcon,
    X,
    UploadCloud
} from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { createPromotion, updatePromotion, getPromotionById, uploadFile } from "@/lib/api";

function PromotionForm() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const id = searchParams.get("id");
    const { token } = useAuth();
    const fileInputRef = useRef<HTMLInputElement>(null);

    const [loading, setLoading] = useState(!!id);
    const [saving, setSaving] = useState(false);
    const [uploading, setUploading] = useState(false);

    // Form State
    const [formData, setFormData] = useState({
        title: "",
        code: "",
        discountPercent: 0,
        expiryDate: "",
        description: "",
        isActive: true,
        image: null as any // Store full image object or ID
    });

    const [previewUrl, setPreviewUrl] = useState<string>("");

    // Fetch existing data if ID is present
    useEffect(() => {
        if (id && token) {
            getPromotionById(token, id).then((data) => {
                if (data) {
                    setFormData({
                        title: data.title || "",
                        code: data.code || "",
                        discountPercent: data.discountPercent || 0,
                        expiryDate: data.expiryDate ? data.expiryDate.split('T')[0] : "",
                        description: data.description || "",
                        isActive: data.isActive !== undefined ? data.isActive : true,
                        image: data.image
                    });
                    if (data.image?.url) {
                        setPreviewUrl(data.image.url);
                    }
                }
                setLoading(false);
            });
        }
    }, [id, token]);

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file || !token) return;

        setUploading(true);
        try {
            const uploadedFiles = await uploadFile(token, file);
            if (uploadedFiles && uploadedFiles.length > 0) {
                const uploadedFile = uploadedFiles[0];
                setFormData(prev => ({ ...prev, image: uploadedFile })); // Save full object
                setPreviewUrl(uploadedFile.url.startsWith('http') ? uploadedFile.url : `${process.env.NEXT_PUBLIC_STRAPI_URL}${uploadedFile.url}`);
            }
        } catch (error) {
            console.error("Upload failed", error);
            alert("Upload ảnh thất bại");
        } finally {
            setUploading(false);
        }
    };

    const removeImage = () => {
        setFormData(prev => ({ ...prev, image: null }));
        setPreviewUrl("");
        if (fileInputRef.current) fileInputRef.current.value = "";
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        try {
            // Prepare payload - Strapi expects ID for relations
            const payload = {
                ...formData,
                image: formData.image?.id || null
            };

            if (id) {
                await updatePromotion(token!, id, payload);
            } else {
                await createPromotion(token!, payload);
            }
            router.push("/admin/promotions");
            router.refresh();
        } catch (error) {
            console.error("Failed to save", error);
            alert("Lưu thất bại!");
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <div className="text-white p-8">Đang tải dữ liệu...</div>;

    return (
        <form onSubmit={handleSubmit} className="space-y-6 max-w-5xl">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Link
                        href="/admin/promotions"
                        className="p-2 hover:bg-white/10 rounded-full transition-colors text-muted-foreground hover:text-white"
                    >
                        <ChevronLeft className="w-6 h-6" />
                    </Link>
                    <div>
                        <h1 className="text-3xl font-bold text-white">
                            {id ? "Sửa Khuyến Mãi" : "Tạo Mới Khuyến Mãi"}
                        </h1>
                        <p className="text-muted-foreground">Thiết lập mã giảm giá và banner chương trình.</p>
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

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Column: Image Upload */}
                <div className="lg:col-span-1 space-y-6">
                    <div className="bg-card border border-white/10 rounded-2xl p-6">
                        <label className="block text-sm font-medium text-gray-400 mb-4">Ảnh Banner (1200x600)</label>

                        <div className="relative aspect-video rounded-xl border-2 border-dashed border-white/20 bg-white/5 overflow-hidden group hover:border-primary/50 transition-colors">
                            {previewUrl ? (
                                <>
                                    <img
                                        src={previewUrl}
                                        alt="Preview"
                                        className="w-full h-full object-cover"
                                    />
                                    <button
                                        type="button"
                                        onClick={removeImage}
                                        className="absolute top-2 right-2 p-1.5 bg-black/50 text-white rounded-full hover:bg-red-500 transition-colors opacity-0 group-hover:opacity-100"
                                    >
                                        <X className="w-4 h-4" />
                                    </button>
                                </>
                            ) : (
                                <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-400 gap-2">
                                    <ImageIcon className="w-8 h-8" />
                                    <span className="text-sm">Chưa có ảnh</span>
                                </div>
                            )}

                            {uploading && (
                                <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                                    <Loader2 className="w-8 h-8 text-primary animate-spin" />
                                </div>
                            )}

                            <input
                                ref={fileInputRef}
                                type="file"
                                accept="image/*"
                                onChange={handleImageUpload}
                                className="absolute inset-0 opacity-0 cursor-pointer"
                                disabled={uploading}
                            />
                        </div>
                        <div className="mt-4 flex justify-center">
                            <button
                                type="button"
                                onClick={() => fileInputRef.current?.click()}
                                className="flex items-center gap-2 text-sm text-primary hover:text-white transition-colors"
                            >
                                <UploadCloud className="w-4 h-4" />
                                Tải ảnh lên
                            </button>
                        </div>
                    </div>
                </div>

                {/* Right Column: Form Fields */}
                <div className="lg:col-span-2 bg-card border border-white/10 rounded-2xl p-6 space-y-6">
                    {/* Title & Code */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-1">Tên Chương Trình</label>
                            <input
                                type="text"
                                required
                                value={formData.title}
                                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary"
                                placeholder="Ví dụ: Giảm giá hè 2024"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-1">Mã Code (Coupon)</label>
                            <input
                                type="text"
                                value={formData.code}
                                onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white font-mono uppercase focus:outline-none focus:border-primary"
                                placeholder="SUMMER2024"
                            />
                        </div>
                    </div>

                    {/* Discount & Date */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-1">Giảm Giá (%)</label>
                            <input
                                type="number"
                                required
                                min="0"
                                max="100"
                                value={formData.discountPercent}
                                onChange={(e) => setFormData({ ...formData, discountPercent: Number(e.target.value) })}
                                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-1">Ngày Hết Hạn</label>
                            <input
                                type="date"
                                required
                                value={formData.expiryDate}
                                onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })}
                                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary [color-scheme:dark]"
                            />
                        </div>
                    </div>

                    {/* Description */}
                    <div>
                        <label className="block text-sm font-medium text-gray-400 mb-1">Mô Tả Chi Tiết</label>
                        <textarea
                            rows={4}
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary resize-none"
                            placeholder="Điều kiện áp dụng..."
                        />
                    </div>

                    {/* Status Toggle */}
                    <div className="flex items-center gap-3 pt-2">
                        <input
                            type="checkbox"
                            id="isActive"
                            checked={formData.isActive}
                            onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                            className="w-5 h-5 rounded border-gray-400 text-primary focus:ring-primary bg-transparent"
                        />
                        <label htmlFor="isActive" className="text-white cursor-pointer select-none">
                            Kích Hoạt Chương Trình
                        </label>
                    </div>
                </div>
            </div>
        </form>
    );
}

export default function NewPromotionPage() {
    return (
        <Suspense fallback={<div className="text-white">Đang tải...</div>}>
            <PromotionForm />
        </Suspense>
    );
}
