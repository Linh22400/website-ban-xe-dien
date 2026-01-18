"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
    MapPin,
    Phone,
    MoreVertical,
    Plus,
    Search,
    Edit,
    Trash2
} from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { getShowroomsAdmin, deleteShowroom } from "@/lib/api";

export default function AdminShowroomsPage() {
    const { token } = useAuth();
    const [showrooms, setShowrooms] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        loadShowrooms();
    }, [token]);

    const loadShowrooms = async () => {
        if (token) {
            setLoading(true);
            const data = await getShowroomsAdmin(token);
            setShowrooms(data);
            setLoading(false);
        }
    };

    const handleDelete = async (documentId: string, name: string) => {
        if (!confirm(`Bạn có chắc muốn xóa cửa hàng "${name}"? Hành động này không thể hoàn tác.`)) {
            return;
        }

        const success = await deleteShowroom(token!, documentId);
        if (success) {
            alert("Đã xóa cửa hàng thành công!");
            loadShowrooms();
        } else {
            alert("Lỗi khi xóa cửa hàng. Vui lòng thử lại.");
        }
    };

    const filteredShowrooms = showrooms.filter(s =>
        s.Name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.Address?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.City?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-foreground mb-2">Quản Lý Cửa Hàng</h1>
                    <p className="text-muted-foreground">Danh sách các showroom và chi nhánh trên toàn quốc.</p>
                </div>
                <Link
                    href="/admin/showrooms/new"
                    className="px-6 py-2.5 bg-primary text-primary-foreground font-bold rounded-xl hover:opacity-90 transition-opacity flex items-center gap-2 shadow-lg shadow-primary/20"
                >
                    <Plus className="w-5 h-5" />
                    Thêm Cửa Hàng
                </Link>
            </div>

            {/* Filters */}
            <div className="flex gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <input
                        type="text"
                        placeholder="Tìm kiếm theo tên, địa chỉ, thành phố..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full bg-card/50 border border-border rounded-xl pl-12 pr-4 py-3 text-foreground focus:outline-none focus:border-primary transition-colors"
                    />
                </div>
            </div>

            {/* List */}
            <div className="bg-card border border-border rounded-2xl overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-muted/50 border-b border-border text-sm text-muted-foreground uppercase tracking-wider">
                                <th className="p-4 pl-6 font-bold">Tên Cửa Hàng</th>
                                <th className="p-4 font-bold">Địa Chỉ</th>
                                <th className="p-4 font-bold">Liên Hệ</th>
                                <th className="p-4 font-bold">Trạng Thái</th>
                                <th className="p-4 font-bold text-right pr-6">Hành Động</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                            {loading ? (
                                <tr>
                                    <td colSpan={5} className="p-8 text-center text-muted-foreground">Đang tải dữ liệu...</td>
                                </tr>
                            ) : filteredShowrooms.length > 0 ? (
                                filteredShowrooms.map((showroom) => (
                                    <tr key={showroom.id} className="hover:bg-muted/50 transition-colors group">
                                        <td className="p-4 pl-6">
                                            <div className="font-bold text-foreground">{showroom.Name}</div>
                                            <div className="text-xs text-muted-foreground">{showroom.Code}</div>
                                        </td>
                                        <td className="p-4 text-sm text-muted-foreground max-w-xs">
                                            <div className="flex items-start gap-2">
                                                <MapPin className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                                                <span>
                                                    {showroom.Address}<br />
                                                    <span className="text-muted-foreground">{showroom.District}, {showroom.City}</span>
                                                </span>
                                            </div>
                                        </td>
                                        <td className="p-4 text-sm text-muted-foreground">
                                            <div className="flex items-center gap-2">
                                                <Phone className="w-3 h-3 text-muted-foreground" />
                                                {showroom.Phone}
                                            </div>
                                        </td>
                                        <td className="p-4">
                                            <span className={`px-2 py-1 rounded-full text-xs font-bold ${showroom.IsActive
                                                    ? 'bg-green-500/10 text-green-400 border border-green-500/20'
                                                    : 'bg-red-500/10 text-red-400 border border-red-500/20'
                                                }`}>
                                                {showroom.IsActive ? 'Hoạt động' : 'Tạm đóng'}
                                            </span>
                                        </td>
                                        <td className="p-4 text-right pr-6">
                                            <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <Link
                                                    href={`/admin/showrooms/new?id=${showroom.documentId}`}
                                                    className="p-2 bg-muted hover:bg-primary hover:text-primary-foreground rounded-lg transition-colors"
                                                    title="Chỉnh sửa"
                                                >
                                                    <Edit className="w-4 h-4" />
                                                </Link>
                                                <button
                                                    onClick={() => handleDelete(showroom.documentId, showroom.Name)}
                                                    className="p-2 bg-muted hover:bg-red-500 hover:text-white rounded-lg transition-colors"
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
                                    <td colSpan={5} className="p-8 text-center text-muted-foreground">
                                        Không tìm thấy cửa hàng nào.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
