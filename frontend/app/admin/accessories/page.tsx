"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
    Search,
    Filter,
    Plus,
    Edit2,
    Trash2,
    PackageOpen
} from "lucide-react";
import { getAccessoriesAdmin, deleteAccessory } from "@/lib/api";
import { useAuth } from "@/lib/auth-context";

export default function AdminAccessoriesPage() {
    const { token } = useAuth();
    const [accessories, setAccessories] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [filterCategory, setFilterCategory] = useState("all");
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
    }, [searchTerm, filterCategory]);

    useEffect(() => {
        async function fetchAccessories() {
            if (token) {
                try {
                    setLoading(true);
                    const { data, meta } = await getAccessoriesAdmin(token, {
                        page: pagination.page,
                        pageSize: pagination.pageSize,
                        search: searchTerm,
                        category: filterCategory
                    });
                    setAccessories(data);
                    if (meta) {
                        setPagination(prev => ({
                            ...prev,
                            pageCount: meta.pageCount || 1,
                            total: meta.total || 0
                        }));
                    }
                } catch (error) {
                    console.error("Failed to fetch accessories", error);
                } finally {
                    setLoading(false);
                }
            }
        }
        fetchAccessories();
    }, [token, pagination.page, pagination.pageSize, searchTerm, filterCategory]);

    const handlePageChange = (newPage: number) => {
        if (newPage >= 1 && newPage <= pagination.pageCount) {
            setPagination(prev => ({ ...prev, page: newPage }));
        }
    };

    const handleDelete = async (id: string, name: string) => {
        if (window.confirm(`Bạn có chắc chắn muốn xóa phụ kiện "${name}" không?`)) {
            if (token) {
                const success = await deleteAccessory(token, id);
                if (success) {
                    // Refresh data
                    const { data, meta } = await getAccessoriesAdmin(token, {
                        page: pagination.page,
                        pageSize: pagination.pageSize,
                        search: searchTerm,
                        category: filterCategory
                    });
                    setAccessories(data);
                    if (meta) {
                        setPagination(prev => ({
                            ...prev,
                            pageCount: meta.pageCount || 1,
                            total: meta.total || 0
                        }));
                    }
                    alert("Đã xóa phụ kiện thành công!");
                } else {
                    alert("Không thể xóa phụ kiện. Vui lòng thử lại.");
                }
            }
        }
    };

    const getCategoryBadge = (category: string) => {
        switch (category) {
            case 'helmet':
                return <span className="px-2 py-1 bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 rounded-full text-xs font-bold">Mũ Bảo Hiểm</span>;
            case 'charger':
                return <span className="px-2 py-1 bg-yellow-500/10 text-yellow-400 border border-yellow-500/20 rounded-full text-xs font-bold">Sạc Xe</span>;
            case 'battery':
                return <span className="px-2 py-1 bg-green-500/10 text-green-400 border border-green-500/20 rounded-full text-xs font-bold">Pin / Ắc Quy</span>;
            case 'motorConfig':
                return <span className="px-2 py-1 bg-blue-500/10 text-blue-400 border border-blue-500/20 rounded-full text-xs font-bold">Động Cơ</span>;
            default:
                return <span className="px-2 py-1 bg-gray-500/10 text-gray-400 border border-gray-500/20 rounded-full text-xs font-bold">Khác</span>;
        }
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-foreground mb-2">Quản Lý Phụ Kiện</h1>
                    <p className="text-muted-foreground">Danh sách mũ bảo hiểm, sạc, pin và phụ tùng khác.</p>
                </div>
                <Link
                    href="/admin/accessories/new"
                    className="px-4 py-2 bg-primary text-primary-foreground font-bold rounded-xl hover:bg-primary/90 transition-colors flex items-center gap-2 shadow-lg shadow-primary/20"
                >
                    <Plus className="w-5 h-5" />
                    Thêm Mới
                </Link>
            </div>

            {/* Filters */}
            <div className="flex flex-col md:flex-row gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <input
                        type="text"
                        placeholder="Tìm tên phụ kiện..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full bg-background border border-border rounded-xl pl-12 pr-4 py-3 text-foreground focus:outline-none focus:border-primary transition-colors"
                    />
                </div>
                <div className="relative">
                    <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <select
                        value={filterCategory}
                        onChange={(e) => setFilterCategory(e.target.value)}
                        className="pl-10 pr-8 py-3 bg-background hover:bg-muted/50 text-foreground rounded-xl border border-border focus:outline-none focus:border-primary transition-colors appearance-none cursor-pointer min-w-[200px]"
                    >
                        <option value="all">Tất cả danh mục</option>
                        <option value="helmet">Mũ Bảo Hiểm</option>
                        <option value="charger">Sạc Xe</option>
                        <option value="battery">Pin / Ắc Quy</option>
                        <option value="other">Khác</option>
                    </select>
                </div>
            </div>

            {/* Table */}
            <div className="bg-card border border-border rounded-2xl overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-muted/50 border-b border-border text-sm text-muted-foreground uppercase tracking-wider">
                                <th className="p-4 pl-6 font-bold">Sản Phẩm</th>
                                <th className="p-4 font-bold">Danh Mục</th>
                                <th className="p-4 font-bold">Giá Bán</th>
                                <th className="p-4 font-bold">Nổi Bật</th>
                                <th className="p-4 font-bold text-right pr-6">Hành Động</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                            {loading ? (
                                <tr>
                                    <td colSpan={5} className="p-8 text-center text-muted-foreground">Đang tải dữ liệu...</td>
                                </tr>
                            ) : accessories.length > 0 ? (
                                accessories.map((acc) => {
                                    // Handle image URL
                                    let imgUrl = "";
                                    if (acc.image?.url) {
                                        imgUrl = acc.image.url.startsWith('http')
                                            ? acc.image.url
                                            : `${process.env.NEXT_PUBLIC_STRAPI_URL || "http://localhost:1337"}${acc.image.url}`;
                                    }

                                    return (
                                        <tr key={acc.id} className="hover:bg-muted/50 transition-colors group">
                                            <td className="p-4 pl-6">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-12 h-12 bg-muted/50 rounded-lg flex items-center justify-center text-muted-foreground overflow-hidden">
                                                        {imgUrl ? (
                                                            <img src={imgUrl} alt={acc.name} className="w-full h-full object-cover" />
                                                        ) : (
                                                            <PackageOpen className="w-6 h-6" />
                                                        )}
                                                    </div>
                                                    <div>
                                                        <div className="font-bold text-foreground">{acc.name}</div>
                                                        <div className="text-xs text-muted-foreground">ID: {acc.id}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="p-4 text-sm text-muted-foreground">
                                                {getCategoryBadge(acc.category)}
                                            </td>
                                            <td className="p-4 font-bold text-foreground">
                                                {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(acc.price || 0)}
                                            </td>
                                            <td className="p-4">
                                                {acc.isFeatured && (
                                                    <span className="px-2 py-1 bg-yellow-500/10 text-yellow-400 border border-yellow-500/20 rounded-full text-xs font-bold">
                                                        Nổi Bật
                                                    </span>
                                                )}
                                            </td>
                                            <td className="p-4 text-right pr-6">
                                                <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <Link
                                                        href={`/admin/accessories/new?id=${acc.documentId}`}
                                                        className="p-2 bg-muted hover:bg-primary hover:text-primary-foreground rounded-lg transition-colors inline-flex"
                                                        title="Sửa"
                                                    >
                                                        <Edit2 className="w-4 h-4" />
                                                    </Link>
                                                    <button
                                                        onClick={() => handleDelete(acc.documentId, acc.name)}
                                                        className="p-2 bg-muted hover:bg-red-500 hover:text-white rounded-lg transition-colors"
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
                                    <td colSpan={5} className="p-8 text-center text-muted-foreground">Không tìm thấy phụ kiện nào.</td>
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
