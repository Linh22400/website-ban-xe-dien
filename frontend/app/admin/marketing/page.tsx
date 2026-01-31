"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
    Search,
    Image as ImageIcon,
    Plus,
    Edit,
    Trash2,
    Save,
    X,
    Upload,
    ArrowUp,
    ArrowDown
} from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { getHeroSlidesAdmin, createHeroSlide, updateHeroSlide, deleteHeroSlide, uploadFile } from "@/lib/api";
import SmartBannerLinkInput from "@/components/admin/SmartBannerLinkInput";

export default function AdminMarketingPage() {
    const { token } = useAuth();
    const [slides, setSlides] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [showAddForm, setShowAddForm] = useState(false);
    const [pagination, setPagination] = useState({
        page: 1,
        pageSize: 10,
        pageCount: 1,
        total: 0
    });
    const [searchTerm, setSearchTerm] = useState("");

    // Form state
    const [formTitle, setFormTitle] = useState("");
    const [formSubtitle, setFormSubtitle] = useState("");
    const [formDesc, setFormDesc] = useState("");
    const [formLink, setFormLink] = useState("");
    const [formColor, setFormColor] = useState("from-emerald-600 to-green-500");
    const [formOrder, setFormOrder] = useState("");
    const [formImageFile, setFormImageFile] = useState<File | null>(null);
    const [formImagePreview, setFormImagePreview] = useState("");
    const [formImageId, setFormImageId] = useState<number | undefined>();

    // Debounce search
    useEffect(() => {
        const timer = setTimeout(() => {
            setPagination(prev => ({ ...prev, page: 1 }));
        }, 500);
        return () => clearTimeout(timer);
    }, [searchTerm]);

    useEffect(() => {
        loadSlides();
    }, [token, pagination.page, pagination.pageSize, searchTerm]);

    const loadSlides = async () => {
        if (token) {
            setLoading(true);
            try {
                const { data, meta } = await getHeroSlidesAdmin(token, {
                    page: pagination.page,
                    pageSize: pagination.pageSize,
                    search: searchTerm
                });
                setSlides(data);
                if (meta) {
                    setPagination(prev => ({
                        ...prev,
                        pageCount: meta.pageCount || 1,
                        total: meta.total || 0
                    }));
                }
            } catch (error) {
                console.error("Failed to fetch slides", error);
            } finally {
                setLoading(false);
            }
        }
    };

    const handlePageChange = (newPage: number) => {
        if (newPage >= 1 && newPage <= pagination.pageCount) {
            setPagination(prev => ({ ...prev, page: newPage }));
        }
    };

    const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setFormImageFile(file);

            const reader = new FileReader();
            reader.onload = (ev) => {
                if (ev.target?.result) {
                    setFormImagePreview(ev.target.result as string);
                }
            };
            reader.readAsDataURL(file);
        }
    };

    const resetForm = () => {
        setFormTitle("");
        setFormSubtitle("");
        setFormDesc("");
        setFormLink("");
        setFormColor("from-emerald-600 to-green-500");
        setFormOrder("");
        setFormImageFile(null);
        setFormImagePreview("");
        setFormImageId(undefined);
        setEditingId(null);
        setShowAddForm(false);
    };

    const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || "http://localhost:1337";

    const handleEdit = (slide: any) => {
        setEditingId(slide.documentId);
        setFormTitle(slide.title || "");
        setFormSubtitle(slide.subtitle || "");
        setFormDesc(slide.desc || "");
        setFormLink(slide.link || "");
        setFormColor(slide.color || "from-emerald-600 to-green-500");
        setFormOrder(slide.order?.toString() || "");

        if (slide.image?.url) {
            const imageUrl = slide.image.url.startsWith('http')
                ? slide.image.url
                : `${STRAPI_URL}${slide.image.url}`;
            setFormImagePreview(imageUrl);
            setFormImageId(slide.image.id);
        }
    };


    const handleSave = async () => {
        if (!formLink) {
            alert("Vui lòng nhập Link!");
            return;
        }

        setLoading(true);

        // Upload image if new
        let finalImageId = formImageId;
        if (formImageFile) {
            // uploadFile trả về danh sách file đã upload (Strapi trả array), ta lấy id của file đầu tiên.
            const uploadedFiles = await uploadFile(token!, formImageFile);
            const uploadedFileId = Array.isArray(uploadedFiles) ? uploadedFiles[0]?.id : undefined;

            if (uploadedFileId) {
                finalImageId = uploadedFileId;
            } else {
                alert("Lỗi khi tải ảnh lên!");
                setLoading(false);
                return;
            }
        }

        if (!finalImageId) {
            alert("Vui lòng chọn ảnh banner!");
            setLoading(false);
            return;
        }

        const payload = {
            title: formTitle.trim() || undefined,
            subtitle: formSubtitle.trim() || undefined,
            desc: formDesc.trim() || undefined,
            link: formLink,
            color: formColor,
            order: formOrder ? parseInt(formOrder) : undefined,
            image: finalImageId
        };

        let success = false;
        if (editingId) {
            success = await updateHeroSlide(token!, editingId, payload);
        } else {
            success = await createHeroSlide(token!, payload);
        }

        if (success) {
            alert(editingId ? "Cập nhật thành công!" : "Thêm banner thành công!");
            resetForm();
            loadSlides();
        } else {
            alert("Có lỗi xảy ra!");
            setLoading(false);
        }
    };

    const handleDelete = async (documentId: string, title: string) => {
        if (!confirm(`Bạn có chắc muốn xóa banner "${title || 'này'}"?`)) {
            return;
        }

        const success = await deleteHeroSlide(token!, documentId);
        if (success) {
            alert("Đã xóa thành công!");
            loadSlides();
        } else {
            alert("Lỗi khi xóa!");
        }
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-foreground mb-2">Quản Lý Banner & Slide</h1>
                    <p className="text-muted-foreground">Quản lý các banner hiển thị trên trang chủ.</p>
                </div>
                <button
                    onClick={() => setShowAddForm(true)}
                    className="px-6 py-2.5 bg-primary text-primary-foreground font-bold rounded-xl hover:opacity-90 transition-opacity flex items-center gap-2 shadow-lg shadow-primary/20"
                >
                    <Plus className="w-5 h-5" />
                    Thêm Banner
                </button>
            </div>

            {/* Search */}
            <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <input
                    type="text"
                    placeholder="Tìm kiếm banner theo tiêu đề..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full bg-card/50 border border-border rounded-xl pl-12 pr-4 py-3 text-foreground focus:outline-none focus:border-primary transition-colors"
                />
            </div>

            {/* Add/Edit Form */}
            {(showAddForm || editingId) && (
                <div className="bg-card border border-border rounded-2xl p-6 space-y-4">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl font-bold text-foreground">
                            {editingId ? "Chỉnh Sửa Banner" : "Thêm Banner Mới"}
                        </h2>
                        <button onClick={resetForm} className="p-2 hover:bg-muted rounded-lg transition-colors">
                            <X className="w-5 h-5 text-foreground" />
                        </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Image Upload */}
                        <div className="md:col-span-2">
                            <label className="text-sm font-bold text-muted-foreground mb-2 block">
                                Hình Ảnh Banner <span className="text-red-500">*</span>
                            </label>
                            <div className="flex gap-4">
                                {formImagePreview && (
                                    <div className="relative w-48 h-32 rounded-xl overflow-hidden border border-border">
                                        <img src={formImagePreview} alt="Preview" className="w-full h-full object-cover" />
                                    </div>
                                )}
                                <label className="flex-1 h-32 border-2 border-dashed border-border rounded-xl flex flex-col items-center justify-center cursor-pointer hover:border-primary/50 hover:bg-muted/50 transition-all">
                                    <Upload className="w-8 h-8 text-muted-foreground mb-2" />
                                    <span className="text-sm text-muted-foreground">Click để chọn ảnh</span>
                                    <input type="file" accept="image/*" onChange={handleImageSelect} className="hidden" />
                                </label>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-bold text-muted-foreground">Tiêu Đề</label>
                            <input
                                type="text"
                                placeholder="Ví dụ: Khuyến mãi cuối năm"
                                value={formTitle}
                                onChange={(e) => setFormTitle(e.target.value)}
                                className="w-full bg-card/50 border border-border rounded-xl px-4 py-3 text-foreground focus:outline-none focus:border-primary transition-colors"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-bold text-muted-foreground">Phụ Đề</label>
                            <input
                                type="text"
                                placeholder="Giảm giá đến 30%"
                                value={formSubtitle}
                                onChange={(e) => setFormSubtitle(e.target.value)}
                                className="w-full bg-card/50 border border-border rounded-xl px-4 py-3 text-foreground focus:outline-none focus:border-primary transition-colors"
                            />
                        </div>

                        <div className="md:col-span-2 space-y-2">
                            <label className="text-sm font-bold text-muted-foreground">Mô Tả</label>
                            <textarea
                                placeholder="Mô tả chi tiết về khuyến mãi..."
                                value={formDesc}
                                onChange={(e) => setFormDesc(e.target.value)}
                                rows={3}
                                className="w-full bg-card/50 border border-border rounded-xl px-4 py-3 text-foreground focus:outline-none focus:border-primary transition-colors"
                            />
                        </div>

                        {/* Smart Link Input */}
                        <div className="md:col-span-2">
                            <SmartBannerLinkInput
                                value={formLink}
                                onChange={setFormLink}
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-bold text-muted-foreground">Thứ Tự (Order)</label>
                            <input
                                type="number"
                                placeholder="0"
                                value={formOrder}
                                onChange={(e) => setFormOrder(e.target.value)}
                                className="w-full bg-card/50 border border-border rounded-xl px-4 py-3 text-foreground focus:outline-none focus:border-primary transition-colors"
                            />
                        </div>

                        <div className="md:col-span-2 space-y-2">
                            <label className="text-sm font-bold text-muted-foreground">Màu Gradient</label>
                            <select
                                value={formColor}
                                onChange={(e) => setFormColor(e.target.value)}
                                className="w-full bg-card/50 border border-border rounded-xl px-4 py-3 text-foreground focus:outline-none focus:border-primary transition-colors"
                            >
                                <option value="from-emerald-600 to-green-500">Xanh Lá (TAILG)</option>
                                <option value="from-rose-600 to-red-500">Hồng - Đỏ (Dưc Duy)</option>
                                <option value="from-blue-600 to-cyan-500">Xanh Dương (Phụ kiện)</option>
                                <option value="from-orange-600 to-red-500">Cam - Đỏ</option>
                                <option value="from-gray-800 to-gray-600">Xám Đen</option>
                            </select>
                        </div>
                    </div>

                    <div className="flex gap-3 pt-4">
                        <button
                            onClick={handleSave}
                            disabled={loading}
                            className="flex-1 px-6 py-3 bg-primary text-primary-foreground font-bold rounded-xl hover:opacity-90 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                        >
                            <Save className="w-5 h-5" />
                            {loading ? "Đang xử lý..." : (editingId ? "Cập Nhật" : "Thêm Mới")}
                        </button>
                        <button
                            onClick={resetForm}
                            className="px-6 py-3 bg-muted text-foreground font-bold rounded-xl hover:bg-muted/80 transition-colors"
                        >
                            Hủy
                        </button>
                    </div>
                </div>
            )}

            {/* Slides List */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {loading && slides.length === 0 ? (
                    <div className="col-span-2 text-center py-8 text-muted-foreground">Đang tải dữ liệu...</div>
                ) : slides.length > 0 ? (
                    slides.map((slide) => {
                        const imageUrl = slide.image?.url
                            ? (slide.image.url.startsWith('http') ? slide.image.url : `${STRAPI_URL}${slide.image.url}`)
                            : '';

                        return (
                            <div key={slide.id} className="bg-card border border-border rounded-2xl overflow-hidden hover:border-primary/50 transition-all group">
                                <div className="relative h-48">
                                    {imageUrl ? (
                                        <img src={imageUrl} alt={slide.title} className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="w-full h-full bg-muted/50 flex items-center justify-center">
                                            <ImageIcon className="w-12 h-12 text-muted-foreground" />
                                        </div>
                                    )}
                                    <div className={`absolute inset-0 bg-gradient-to-r ${slide.color || 'from-emerald-600 to-green-500'} opacity-20`}></div>
                                </div>
                                <div className="p-4 space-y-3">
                                    <div>
                                        <h3 className="font-bold text-foreground text-lg">{slide.title || "Không có tiêu đề"}</h3>
                                        {slide.subtitle && <p className="text-sm text-muted-foreground">{slide.subtitle}</p>}
                                    </div>
                                    {slide.desc && <p className="text-sm text-muted-foreground line-clamp-2">{slide.desc}</p>}
                                    <div className="flex items-center justify-between pt-2 border-t border-border">
                                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                            <span className="px-2 py-1 bg-muted rounded">Order: {slide.order || 0}</span>
                                            <span className="px-2 py-1 bg-muted rounded truncate max-w-[150px]">{slide.link}</span>
                                        </div>
                                        <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button
                                                onClick={() => handleEdit(slide)}
                                                className="p-2 bg-muted hover:bg-primary hover:text-primary-foreground rounded-lg transition-colors"
                                                title="Chỉnh sửa"
                                            >
                                                <Edit className="w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(slide.documentId, slide.title)}
                                                className="p-2 bg-muted hover:bg-red-500 hover:text-white rounded-lg transition-colors"
                                                title="Xóa"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })
                ) : (
                    <div className="col-span-2 text-center py-12 text-muted-foreground">
                        Chưa có banner nào. Nhấn "Thêm Banner" để bắt đầu.
                    </div>
                )}
            </div>

            {/* Pagination */}
            <div className="p-4 border-t border-border flex items-center justify-between text-sm text-muted-foreground">
                <div>Trang {pagination.page} / {pagination.pageCount} (Tổng {pagination.total} kết quả)</div>
                <div className="flex gap-2">
                    <button 
                        onClick={() => handlePageChange(pagination.page - 1)}
                        disabled={pagination.page <= 1 || loading}
                        className="px-3 py-1 bg-card border border-border rounded hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                        Trước
                    </button>
                    <span className="px-3 py-1 bg-primary text-primary-foreground font-bold rounded flex items-center">
                        {pagination.page}
                    </span>
                    <button 
                        onClick={() => handlePageChange(pagination.page + 1)}
                        disabled={pagination.page >= pagination.pageCount || loading}
                        className="px-3 py-1 bg-card border border-border rounded hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                        Sau
                    </button>
                </div>
            </div>
        </div>
    );
}
