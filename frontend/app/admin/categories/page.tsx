"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
    Search,
    Plus,
    Edit2,
    Trash2,
    Layers,
    Package
} from "lucide-react";
import { getProductCategoriesAdmin, deleteProductCategory } from "@/lib/api";
import { useAuth } from "@/lib/auth-context";

export default function AdminCategoriesPage() {
    const { token } = useAuth();
    const [categories, setCategories] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [pagination, setPagination] = useState({
        page: 1,
        pageSize: 10,
        pageCount: 1,
        total: 0
    });

    // Debounce search
    useEffect(() => {
        const timer = setTimeout(() => {
            setPagination(prev => ({ ...prev, page: 1 }));
        }, 500);
        return () => clearTimeout(timer);
    }, [searchTerm]);

    useEffect(() => {
        async function fetchCategories() {
            if (token) {
                try {
                    setLoading(true);
                    const { data, meta } = await getProductCategoriesAdmin(token, {
                        page: pagination.page,
                        pageSize: pagination.pageSize,
                        search: searchTerm
                    });
                    setCategories(data);
                    if (meta) {
                        setPagination(prev => ({
                            ...prev,
                            pageCount: meta.pageCount || 1,
                            total: meta.total || 0
                        }));
                    }
                } catch (error) {
                    console.error("Failed to fetch categories", error);
                } finally {
                    setLoading(false);
                }
            }
        }
        fetchCategories();
    }, [token, pagination.page, pagination.pageSize, searchTerm]);

    const handlePageChange = (newPage: number) => {
        if (newPage >= 1 && newPage <= pagination.pageCount) {
            setPagination(prev => ({ ...prev, page: newPage }));
        }
    };

    const handleDelete = async (id: string, name: string) => {
        if (window.confirm(`Bạn có chắc chắn muốn xóa danh mục "${name}" không?`)) {
            if (token) {
                const success = await deleteProductCategory(token, id);
                if (success) {
                    // Refresh data
                    const { data, meta } = await getProductCategoriesAdmin(token, {
                        page: pagination.page,
                        pageSize: pagination.pageSize,
                        search: searchTerm
                    });
                    setCategories(data);
                    if (meta) {
                        setPagination(prev => ({
                            ...prev,
                            pageCount: meta.pageCount || 1,
                            total: meta.total || 0
                        }));
                    }
                    alert("Đã xóa danh mục thành công!");
                } else {
                    alert("Không thể xóa danh mục. Vui lòng kiểm tra lại (có thể danh mục này đang chứa sản phẩm).");
                }
            }
        }
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-foreground mb-2">Quản Lý Danh Mục</h1>
                    <p className="text-muted-foreground">Phân loại sản phẩm (Xe máy, Xe đạp, Phụ kiện...).</p>
                </div>
                <Link
                    href="/admin/categories/new"
                    className="px-4 py-2 bg-primary text-primary-foreground font-bold rounded-xl hover:opacity-90 transition-opacity flex items-center gap-2 shadow-lg shadow-primary/20"
                >
                    <Plus className="w-5 h-5" />
                    Thêm Mới
                </Link>
            </div>

            {/* Search */}
            <div className="bg-card border border-border rounded-2xl p-4">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <input
                        type="text"
                        placeholder="Tìm kiếm danh mục..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full bg-muted/50 border border-border rounded-xl pl-10 pr-4 py-3 text-foreground focus:outline-none focus:border-primary transition-colors"
                    />
                </div>
            </div>

            {/* Table */}
            <div className="bg-card border border-border rounded-2xl overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-muted/50 border-b border-border text-sm text-muted-foreground uppercase tracking-wider">
                                <th className="p-4 pl-6 font-bold w-20">Hình ảnh</th>
                                <th className="p-4 font-bold">Tên Danh Mục</th>
                                <th className="p-4 font-bold">Slug (Đường dẫn)</th>
                                <th className="p-4 font-bold">Mô Tả</th>
                                <th className="p-4 font-bold text-right pr-6">Hành Động</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                            {loading ? (
                                <tr>
                                    <td colSpan={5} className="p-8 text-center text-muted-foreground">Đang tải dữ liệu...</td>
                                </tr>
                            ) : categories.length > 0 ? (
                                categories.map((cat) => {
                                    const imgUrl = cat.image?.url
                                        ? (cat.image.url.startsWith('http') ? cat.image.url : `${process.env.NEXT_PUBLIC_STRAPI_URL || "http://localhost:1337"}${cat.image.url}`)
                                        : null;

                                    return (
                                        <tr key={cat.id} className="hover:bg-muted/50 transition-colors group">
                                            <td className="p-4 pl-6">
                                                {imgUrl ? (
                                                    <img
                                                        src={imgUrl}
                                                        alt={cat.name}
                                                        className="w-12 h-12 object-cover rounded-lg border border-border"
                                                    />
                                                ) : (
                                                    <div className="w-12 h-12 bg-muted/50 rounded-lg flex items-center justify-center border border-border">
                                                        <Layers className="w-5 h-5 text-muted-foreground" />
                                                    </div>
                                                )}
                                            </td>
                                            <td className="p-4 font-bold text-foreground">
                                                {cat.name}
                                            </td>
                                            <td className="p-4 text-sm font-mono text-muted-foreground">
                                                /{cat.slug}
                                            </td>
                                            <td className="p-4 text-sm text-muted-foreground max-w-xs truncate" title={cat.description}>
                                                {cat.description || "---"}
                                            </td>
                                            <td className="p-4 text-right pr-6">
                                                <div className="flex items-center justify-end gap-2 opacity-50 group-hover:opacity-100 transition-opacity">
                                                    <Link
                                                        href={`/admin/categories/${cat.documentId}`}
                                                        className="p-2 bg-muted hover:bg-muted/80 text-blue-600 dark:text-blue-400 rounded-lg transition-colors"
                                                        title="Chỉnh sửa"
                                                    >
                                                        <Edit2 className="w-4 h-4" />
                                                    </Link>
                                                    <button
                                                        onClick={() => handleDelete(cat.documentId, cat.name)}
                                                        className="p-2 bg-muted hover:bg-red-500/20 hover:text-red-500 text-muted-foreground rounded-lg transition-colors"
                                                        title="Xóa"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })
                            ) : (
                                <tr>
                                    <td colSpan={5} className="p-8 text-center text-muted-foreground">Không tìm thấy danh mục nào.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
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
        </div>
    );
}
