"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
    Search,
    Filter,
    Plus,
    Edit2,
    Trash2,
    Bike,
    MoreVertical
} from "lucide-react";
import { getCarsWithMeta, deleteCar, Car } from "@/lib/api";
import { useAuth } from "@/lib/auth-context";

export default function AdminProductsPage() {
    const { token: authToken } = useAuth();
    // Product Data State
    const [products, setProducts] = useState<Car[]>([]);
    const [loading, setLoading] = useState(true);
    const [pagination, setPagination] = useState({
        page: 1,
        pageSize: 10,
        pageCount: 1,
        total: 0
    });

    // Filter State
    const [searchTerm, setSearchTerm] = useState("");
    const [filterCategory, setFilterCategory] = useState("all");

    // Fetch Products
    useEffect(() => {
        async function fetchProducts() {
            setLoading(true);
            try {
                const { cars, pagination: meta } = await getCarsWithMeta({
                    page: pagination.page,
                    pageSize: pagination.pageSize,
                    search: searchTerm,
                    type: filterCategory !== 'all' ? (filterCategory === 'Xe Máy Điện' ? 'motorcycle' : 'bicycle') : undefined
                });
                
                setProducts(cars);
                if (meta) {
                    setPagination(prev => ({
                        ...prev,
                        page: meta.page,
                        pageSize: meta.pageSize,
                        pageCount: meta.pageCount,
                        total: meta.total
                    }));
                }
            } catch (error) {
                console.error("Failed to fetch products", error);
            } finally {
                setLoading(false);
            }
        }
        
        // Debounce search
        const timeoutId = setTimeout(() => {
            fetchProducts();
        }, 300);
        
        return () => clearTimeout(timeoutId);
    }, [pagination.page, pagination.pageSize, searchTerm, filterCategory]);

    // Reset page when filters change
    useEffect(() => {
        setPagination(prev => ({ ...prev, page: 1 }));
    }, [searchTerm, filterCategory]);

    // Delete Handler
    const handleDelete = async (id: string, name: string) => {
        if (window.confirm(`Bạn có chắc chắn muốn xóa sản phẩm "${name}" không?`)) {
            // Use real token if available (or empty if public access enabled)
            const token = authToken || "";

            const success = await deleteCar(token, id);
            if (success) {
                // Refresh data
                const { cars, pagination: meta } = await getCarsWithMeta({
                    page: pagination.page,
                    pageSize: pagination.pageSize,
                    search: searchTerm,
                    type: filterCategory !== 'all' ? (filterCategory === 'Xe Máy Điện' ? 'motorcycle' : 'bicycle') : undefined
                });
                setProducts(cars);
                if (meta) {
                    setPagination(prev => ({
                        ...prev,
                        page: meta.page,
                        pageSize: meta.pageSize,
                        pageCount: meta.pageCount,
                        total: meta.total
                    }));
                }
                alert("Đã xóa sản phẩm thành công!");
            } else {
                alert("Không thể xóa sản phẩm. Vui lòng thử lại.");
            }
        }
    };

    const handlePageChange = (newPage: number) => {
        if (newPage >= 1 && newPage <= pagination.pageCount) {
            setPagination(prev => ({ ...prev, page: newPage }));
        }
    };

    // Helper for category badges
    const getCategoryBadge = (type: string) => {
        switch (type) {
            case 'bicycle':
                return <span className="px-2 py-1 bg-green-500/10 text-green-400 border border-green-500/20 rounded-full text-xs font-bold">Xe Đạp Điện</span>;
            case 'motorcycle':
                return <span className="px-2 py-1 bg-blue-500/10 text-blue-400 border border-blue-500/20 rounded-full text-xs font-bold">Xe Máy Điện</span>;
            default:
                return <span className="px-2 py-1 bg-gray-500/10 text-gray-400 border border-gray-500/20 rounded-full text-xs font-bold">Khác</span>;
        }
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-foreground mb-2">Quản Lý Sản Phẩm</h1>
                    <p className="text-muted-foreground">Quản lý danh sách xe và phụ kiện.</p>
                </div>
                <Link
                    href="/admin/products/new"
                    className="px-4 py-2 bg-primary text-primary-foreground font-bold rounded-xl hover:bg-primary/90 transition-colors flex items-center gap-2 shadow-lg shadow-primary/20"
                >
                    <Plus className="w-5 h-5" />
                    Thêm Mới
                </Link>
            </div>

            {/* Filters */}
            <div className="flex flex-col md:flex-row gap-4">
                {/* Search */}
                <div className="relative flex-1">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <input
                        type="text"
                        placeholder="Tìm tên xe, mã sản phẩm..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full bg-card/50 border border-border rounded-xl pl-12 pr-4 py-3 text-foreground focus:outline-none focus:border-primary transition-colors"
                    />
                </div>

                {/* Category Filter */}
                <div className="relative">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none">
                        <Filter className="w-4 h-4 text-muted-foreground" />
                    </div>
                    <select
                        value={filterCategory}
                        onChange={(e) => setFilterCategory(e.target.value)}
                        className="appearance-none bg-card/50 border border-border rounded-xl pl-10 pr-10 py-3 text-foreground focus:outline-none focus:border-primary transition-colors h-full cursor-pointer min-w-[200px]"
                    >
                        <option value="all">Tất cả danh mục</option>
                        <option value="Xe Máy Điện">Xe Máy Điện</option>
                        <option value="Xe Đạp Điện">Xe Đạp Điện</option>
                    </select>
                </div>
            </div>

            {/* Product Grid / List */}
            <div className="bg-card border border-border rounded-2xl overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-muted/50 border-b border-border text-sm text-muted-foreground uppercase tracking-wider">
                                <th className="p-4 pl-6 font-bold">Tên Sản Phẩm</th>
                                <th className="p-4 font-bold">Danh Mục</th>
                                <th className="p-4 font-bold">Giá Bán</th>
                                <th className="p-4 font-bold">Tồn Kho</th>
                                <th className="p-4 font-bold">Trạng Thái</th>
                                <th className="p-4 font-bold text-right pr-6">Hành Động</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                            {loading ? (
                                <tr>
                                    <td colSpan={6} className="p-8 text-center text-muted-foreground">
                                        Đang tải dữ liệu...
                                    </td>
                                </tr>
                            ) : products.length > 0 ? (
                                products.map((product) => (
                                    <tr key={product.id} className="hover:bg-muted/50 transition-colors group">
                                        <td className="p-4 pl-6">
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-12 bg-muted/50 rounded-lg flex items-center justify-center text-muted-foreground overflow-hidden">
                                                    {product.thumbnail ? (
                                                        <img src={product.thumbnail} alt={product.name} className="w-full h-full object-cover" />
                                                    ) : (
                                                        <Bike className="w-6 h-6" />
                                                    )}
                                                </div>
                                                <div>
                                                    <div className="font-bold text-foreground">{product.name}</div>
                                                    <div className="text-xs text-muted-foreground">SKU: SP-{String(product.id).slice(-4)}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="p-4 text-sm text-muted-foreground">
                                            {getCategoryBadge(product.type)}
                                        </td>
                                        <td className="p-4 font-bold text-foreground">
                                            {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(product.price)}
                                        </td>
                                        <td className="p-4 text-sm font-bold text-muted-foreground">
                                            <span className={`${product.stock && product.stock > 0 ? 'text-foreground' : 'text-red-400'}`}>
                                                {product.stock || 0}
                                            </span>
                                        </td>
                                        <td className="p-4">
                                            <span className={`px-2 py-1 rounded-full text-xs font-bold border ${product.price > 0
                                                ? 'bg-green-500/10 text-green-400 border-green-500/20'
                                                : 'bg-red-500/10 text-red-400 border-red-500/20'
                                                }`}>
                                                {product.price > 0 ? 'Đang bán' : 'Hết hàng'}
                                            </span>
                                        </td>
                                        <td className="p-4 text-right pr-6">
                                            <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <Link
                                                    href={`/admin/products/new?id=${product.documentId}`}
                                                    className="p-2 bg-muted/50 hover:bg-primary hover:text-primary-foreground rounded-lg transition-colors inline-flex"
                                                    title="Sửa"
                                                >
                                                    <Edit2 className="w-4 h-4" />
                                                </Link>
                                                <button
                                                    onClick={() => handleDelete(product.documentId, product.name)}
                                                    className="p-2 bg-muted/50 hover:bg-red-500 hover:text-white rounded-lg transition-colors"
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
                                    <td colSpan={6} className="p-8 text-center text-muted-foreground">
                                        Không tìm thấy sản phẩm nào.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                <div className="p-4 border-t border-border flex items-center justify-between text-sm text-muted-foreground">
                    <div>Hiển thị {products.length} trên tổng số {pagination.total} kết quả</div>
                    <div className="flex gap-2">
                        <button 
                            onClick={() => handlePageChange(pagination.page - 1)}
                            disabled={pagination.page <= 1}
                            className="px-3 py-1 bg-card border border-border rounded hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                            Trước
                        </button>
                        <span className="px-3 py-1 bg-primary text-primary-foreground font-bold rounded flex items-center">
                            {pagination.page} / {pagination.pageCount}
                        </span>
                        <button 
                            onClick={() => handlePageChange(pagination.page + 1)}
                            disabled={pagination.page >= pagination.pageCount}
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
