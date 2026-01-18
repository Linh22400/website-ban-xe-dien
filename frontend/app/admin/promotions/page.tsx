"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
    Search,
    Filter,
    Plus,
    Edit2,
    Trash2,
    Tag,
    Calendar,
    Percent
} from "lucide-react";
import { getPromotionsAdmin, deletePromotion } from "@/lib/api";
import { useAuth } from "@/lib/auth-context";

export default function AdminPromotionsPage() {
    const { token } = useAuth();
    const [promotions, setPromotions] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [filterStatus, setFilterStatus] = useState("all");

    useEffect(() => {
        async function fetchPromotions() {
            if (token) {
                try {
                    setLoading(true);
                    const data = await getPromotionsAdmin(token);
                    setPromotions(data);
                } catch (error) {
                    console.error("Failed to fetch promotions", error);
                } finally {
                    setLoading(false);
                }
            }
        }
        fetchPromotions();
    }, [token]);

    const filteredPromotions = promotions.filter(promo => {
        const matchesSearch = promo.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            promo.code?.toLowerCase().includes(searchTerm.toLowerCase());

        const now = new Date();
        const expiry = new Date(promo.expiryDate);
        const isActive = promo.isActive && expiry > now;

        const matchesStatus = filterStatus === "all" ||
            (filterStatus === "active" && isActive) ||
            (filterStatus === "expired" && !isActive);

        return matchesSearch && matchesStatus;
    });

    const handleDelete = async (id: string, title: string) => {
        if (window.confirm(`Bạn có chắc chắn muốn xóa khuyến mãi "${title}" không?`)) {
            if (token) {
                const success = await deletePromotion(token, id);
                if (success) {
                    setPromotions(promotions.filter(p => p.documentId !== id));
                    alert("Đã xóa khuyến mãi thành công!");
                } else {
                    alert("Không thể xóa khuyến mãi. Vui lòng thử lại.");
                }
            }
        }
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-foreground mb-2">Quản Lý Khuyến Mãi</h1>
                    <p className="text-muted-foreground">Danh sách mã giảm giá và chương trình ưu đãi.</p>
                </div>
                <Link
                    href="/admin/promotions/new"
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
                        placeholder="Tìm tên chương trình, mã code..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full bg-background border border-border rounded-xl pl-12 pr-4 py-3 text-foreground focus:outline-none focus:border-primary transition-colors"
                    />
                </div>
                <div className="relative">
                    <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <select
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value)}
                        className="pl-10 pr-8 py-3 bg-background hover:bg-muted/50 text-foreground rounded-xl border border-border focus:outline-none focus:border-primary transition-colors appearance-none cursor-pointer min-w-[200px]"
                    >
                        <option value="all">Tất cả trạng thái</option>
                        <option value="active">Đang Diễn Ra</option>
                        <option value="expired">Đã Kết Thúc</option>
                    </select>
                </div>
            </div>

            {/* Table */}
            <div className="bg-card border border-border rounded-2xl overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-muted/50 border-b border-border text-sm text-muted-foreground uppercase tracking-wider">
                                <th className="p-4 pl-6 font-bold">Chương Trình</th>
                                <th className="p-4 font-bold">Mã Code</th>
                                <th className="p-4 font-bold">Giảm Giá</th>
                                <th className="p-4 font-bold">Thời Hạn</th>
                                <th className="p-4 font-bold">Trạng Thái</th>
                                <th className="p-4 font-bold text-right pr-6">Hành Động</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                            {loading ? (
                                <tr>
                                    <td colSpan={6} className="p-8 text-center text-muted-foreground">Đang tải dữ liệu...</td>
                                </tr>
                            ) : filteredPromotions.length > 0 ? (
                                filteredPromotions.map((promo) => {
                                    const now = new Date();
                                    const expiry = new Date(promo.expiryDate);
                                    const isActive = promo.isActive && expiry > now;

                                    return (
                                        <tr key={promo.id} className="hover:bg-muted/50 transition-colors group">
                                            <td className="p-4 pl-6">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-12 h-12 bg-muted/50 rounded-lg flex items-center justify-center text-muted-foreground overflow-hidden">
                                                        {promo.image?.url ? (
                                                            <img
                                                                src={promo.image.url}
                                                                alt={promo.title}
                                                                className="w-full h-full object-cover"
                                                            />
                                                        ) : (
                                                            <Tag className="w-5 h-5 text-primary" />
                                                        )}
                                                    </div>
                                                    <div>
                                                        <div className="font-bold text-foreground max-w-[200px] truncate" title={promo.title}>{promo.title}</div>
                                                        <div className="text-xs text-muted-foreground line-clamp-1 max-w-[200px]">{promo.description}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="p-4 text-sm font-mono text-primary font-bold">
                                                {promo.code || '---'}
                                            </td>
                                            <td className="p-4">
                                                <div className="flex items-center gap-1 font-bold text-foreground">
                                                    <Percent className="w-4 h-4 text-muted-foreground" />
                                                    {promo.discountPercent}%
                                                </div>
                                            </td>
                                            <td className="p-4 text-sm text-muted-foreground">
                                                <div className="flex items-center gap-2">
                                                    <Calendar className="w-4 h-4 text-muted-foreground" />
                                                    {new Date(promo.expiryDate).toLocaleDateString('vi-VN')}
                                                </div>
                                            </td>
                                            <td className="p-4">
                                                <span className={`px-2 py-1 rounded-full text-xs font-bold border ${isActive
                                                    ? 'bg-green-500/10 text-green-400 border-green-500/20'
                                                    : 'bg-red-500/10 text-red-400 border-red-500/20'}`}>
                                                    {isActive ? 'Đang chạy' : 'Kết thúc'}
                                                </span>
                                            </td>
                                            <td className="p-4 text-right pr-6">
                                                <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <Link
                                                        href={`/admin/promotions/new?id=${promo.documentId}`}
                                                        className="p-2 bg-muted hover:bg-primary hover:text-primary-foreground rounded-lg transition-colors inline-flex"
                                                        title="Sửa"
                                                    >
                                                        <Edit2 className="w-4 h-4" />
                                                    </Link>
                                                    <button
                                                        onClick={() => handleDelete(promo.documentId, promo.title)}
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
                                    <td colSpan={6} className="p-8 text-center text-muted-foreground">Không tìm thấy khuyến mãi nào.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
