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

    useEffect(() => {
        async function fetchCategories() {
            if (token) {
                try {
                    setLoading(true);
                    const data = await getProductCategoriesAdmin(token);
                    setCategories(data);
                } catch (error) {
                    console.error("Failed to fetch categories", error);
                } finally {
                    setLoading(false);
                }
            }
        }
        fetchCategories();
    }, [token]);

    const filteredCategories = categories.filter(cat =>
        cat.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        cat.slug.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleDelete = async (id: string, name: string) => {
        if (window.confirm(`Bạn có chắc chắn muốn xóa danh mục "${name}" không?`)) {
            if (token) {
                const success = await deleteProductCategory(token, id);
                if (success) {
                    setCategories(categories.filter(c => c.documentId !== id));
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
                    <h1 className="text-3xl font-bold text-white mb-2">Quản Lý Danh Mục</h1>
                    <p className="text-muted-foreground">Phân loại sản phẩm (Xe máy, Xe đạp, Phụ kiện...).</p>
                </div>
                <Link
                    href="/admin/categories/new"
                    className="px-4 py-2 bg-primary text-black font-bold rounded-xl hover:bg-white transition-colors flex items-center gap-2 shadow-lg shadow-primary/20"
                >
                    <Plus className="w-5 h-5" />
                    Thêm Mới
                </Link>
            </div>

            {/* Search */}
            <div className="bg-card border border-white/10 rounded-2xl p-4">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <input
                        type="text"
                        placeholder="Tìm kiếm danh mục..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-white focus:outline-none focus:border-primary transition-colors"
                    />
                </div>
            </div>

            {/* Table */}
            <div className="bg-card border border-white/10 rounded-2xl overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-white/5 border-b border-white/10 text-sm text-muted-foreground uppercase tracking-wider">
                                <th className="p-4 pl-6 font-bold w-20">Hình ảnh</th>
                                <th className="p-4 font-bold">Tên Danh Mục</th>
                                <th className="p-4 font-bold">Slug (Đường dẫn)</th>
                                <th className="p-4 font-bold">Mô Tả</th>
                                <th className="p-4 font-bold text-right pr-6">Hành Động</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {loading ? (
                                <tr>
                                    <td colSpan={5} className="p-8 text-center text-muted-foreground">Đang tải dữ liệu...</td>
                                </tr>
                            ) : filteredCategories.length > 0 ? (
                                filteredCategories.map((cat) => (
                                    <tr key={cat.id} className="hover:bg-white/5 transition-colors group">
                                        <td className="p-4 pl-6">
                                            {cat.image?.url ? (
                                                <img
                                                    src={cat.image.url}
                                                    alt={cat.name}
                                                    className="w-12 h-12 object-cover rounded-lg border border-white/10"
                                                />
                                            ) : (
                                                <div className="w-12 h-12 bg-white/5 rounded-lg flex items-center justify-center border border-white/10">
                                                    <Layers className="w-5 h-5 text-muted-foreground" />
                                                </div>
                                            )}
                                        </td>
                                        <td className="p-4 font-bold text-white">
                                            {cat.name}
                                        </td>
                                        <td className="p-4 text-sm font-mono text-gray-400">
                                            /{cat.slug}
                                        </td>
                                        <td className="p-4 text-sm text-gray-300 max-w-xs truncate" title={cat.description}>
                                            {cat.description || "---"}
                                        </td>
                                        <td className="p-4 text-right pr-6">
                                            <div className="flex items-center justify-end gap-2 opacity-50 group-hover:opacity-100 transition-opacity">
                                                <Link
                                                    href={`/admin/categories/${cat.documentId}`}
                                                    className="p-2 bg-white/5 hover:bg-white/10 text-blue-400 rounded-lg transition-colors"
                                                    title="Chỉnh sửa"
                                                >
                                                    <Edit2 className="w-4 h-4" />
                                                </Link>
                                                <button
                                                    onClick={() => handleDelete(cat.documentId, cat.name)}
                                                    className="p-2 bg-white/5 hover:bg-red-500/20 hover:text-red-500 text-gray-400 rounded-lg transition-colors"
                                                    title="Xóa"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={5} className="p-8 text-center text-muted-foreground">Không tìm thấy danh mục nào.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
