"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
    FileText,
    Plus,
    Edit,
    Trash2,
    Calendar,
    User,
    Tag,
    Eye,
    Search
} from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { getArticlesAdmin, deleteArticle } from "@/lib/api";

export default function AdminArticlesPage() {
    const { token } = useAuth();
    const [articles, setArticles] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [pagination, setPagination] = useState({
        page: 1,
        pageSize: 10,
        pageCount: 1,
        total: 0
    });

    // Fallback URL logic
    const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || "http://localhost:1337";

    // Debounce search
    useEffect(() => {
        const timer = setTimeout(() => {
            setPagination(prev => ({ ...prev, page: 1 }));
        }, 500);
        return () => clearTimeout(timer);
    }, [searchTerm]);

    useEffect(() => {
        if (token) {
            loadArticles();
        }
    }, [token, pagination.page, pagination.pageSize, searchTerm]);

    const loadArticles = async () => {
        setLoading(true);
        try {
            const { data, meta } = await getArticlesAdmin(token!, {
                page: pagination.page,
                pageSize: pagination.pageSize,
                search: searchTerm
            });
            setArticles(data);
            if (meta) {
                setPagination(prev => ({
                    ...prev,
                    pageCount: meta.pageCount || 1,
                    total: meta.total || 0
                }));
            }
        } catch (error) {
            console.error("Failed to load articles", error);
        } finally {
            setLoading(false);
        }
    };

    const handlePageChange = (newPage: number) => {
        if (newPage >= 1 && newPage <= pagination.pageCount) {
            setPagination(prev => ({ ...prev, page: newPage }));
        }
    };

    const handleDelete = async (documentId: string, title: string) => {
        if (!confirm(`Bạn có chắc muốn xóa bài viết "${title}"?`)) {
            return;
        }

        const success = await deleteArticle(token!, documentId);
        if (success) {
            alert("Đã xóa bài viết thành công!");
            // Refresh current page
            loadArticles();
        } else {
            alert("Lỗi khi xóa bài viết!");
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-foreground mb-2">Quản Lý Tin Tức</h1>
                    <p className="text-muted-foreground">Tạo và quản lý các bài viết tin tức, blog.</p>
                </div>
                <Link
                    href="/admin/articles/new"
                    className="px-6 py-2.5 bg-primary text-primary-foreground font-bold rounded-xl hover:bg-primary/90 transition-colors flex items-center gap-2 shadow-lg shadow-primary/20"
                >
                    <Plus className="w-5 h-5" />
                    Viết Bài Mới
                </Link>
            </div>

            {/* Search */}
            <div className="bg-card border border-border rounded-2xl p-4">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <input
                        type="text"
                        placeholder="Tìm kiếm bài viết theo tiêu đề, tác giả..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full bg-muted/50 border border-border rounded-xl pl-10 pr-4 py-3 text-foreground focus:outline-none focus:border-primary transition-colors"
                    />
                </div>
            </div>

            {/* Articles Table */}
            <div className="bg-card border border-border rounded-2xl overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-border bg-muted/50">
                                <th className="px-6 py-4 text-left text-sm font-bold text-muted-foreground">Bài Viết</th>
                                <th className="px-6 py-4 text-left text-sm font-bold text-muted-foreground">Danh Mục</th>
                                <th className="px-6 py-4 text-left text-sm font-bold text-muted-foreground">Tác Giả</th>
                                <th className="px-6 py-4 text-left text-sm font-bold text-muted-foreground">Ngày Đăng</th>
                                <th className="px-6 py-4 text-right text-sm font-bold text-muted-foreground">Hành Động</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                            {loading ? (
                                <tr>
                                    <td colSpan={5} className="px-6 py-8 text-center text-muted-foreground">
                                        Đang tải dữ liệu...
                                    </td>
                                </tr>
                            ) : articles.length > 0 ? (
                                articles.map((article) => {
                                    // Handle image URL safely
                                    const coverUrl = article.Cover_image?.url
                                        ? (article.Cover_image.url.startsWith('http') ? article.Cover_image.url : `${STRAPI_URL}${article.Cover_image.url}`)
                                        : null;

                                    return (
                                        <tr key={article.id} className="hover:bg-muted/50 transition-colors group">
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-16 h-12 rounded-lg bg-muted/50 overflow-hidden shrink-0">
                                                        {coverUrl ? (
                                                            <img
                                                                src={coverUrl}
                                                                alt={article.Title}
                                                                className="w-full h-full object-cover"
                                                            />
                                                        ) : (
                                                            <div className="w-full h-full flex items-center justify-center">
                                                                <FileText className="w-6 h-6 text-muted-foreground" />
                                                            </div>
                                                        )}
                                                    </div>
                                                    <div>
                                                        <h3 className="font-bold text-foreground group-hover:text-primary transition-colors line-clamp-1">
                                                            {article.Title}
                                                        </h3>
                                                        <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                                                            {article.Featured && (
                                                                <span className="text-yellow-500 font-bold flex items-center gap-1">
                                                                    ★ Nổi Bật
                                                                </span>
                                                            )}
                                                            <span>Slug: {article.Slug}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                {article.category ? (
                                                    <span className="px-3 py-1 bg-blue-500/10 text-blue-600 dark:text-blue-400 rounded-full text-xs border border-blue-500/20">
                                                        {article.category.name}
                                                    </span>
                                                ) : (
                                                    <span className="text-muted-foreground text-sm">-</span>
                                                )}
                                            </td>
                                            <td className="px-6 py-4 text-foreground text-sm">
                                                <div className="flex items-center gap-2">
                                                    <User className="w-4 h-4 text-muted-foreground" />
                                                    {article.Author}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-muted-foreground text-sm">
                                                <div className="flex items-center gap-2">
                                                    <Calendar className="w-4 h-4" />
                                                    {new Date(article.Published_Date).toLocaleDateString('vi-VN')}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <div className="flex items-center justify-end gap-2 text-foreground">
                                                    <Link
                                                        href={`/admin/articles/new?id=${article.documentId}`}
                                                        className="p-2 bg-muted/50 hover:bg-primary hover:text-primary-foreground rounded-lg transition-colors"
                                                        title="Chỉnh sửa"
                                                    >
                                                        <Edit className="w-4 h-4" />
                                                    </Link>
                                                    <button
                                                        onClick={() => handleDelete(article.documentId, article.Title)}
                                                        className="p-2 bg-muted/50 hover:bg-red-500 hover:text-white rounded-lg transition-colors"
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
                                    <td colSpan={5} className="px-6 py-12 text-center text-muted-foreground">
                                        Không tìm thấy bài viết nào.
                                    </td>
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
