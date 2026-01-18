"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
    ArrowLeft,
    Printer,
    CheckCircle,
    Truck,
    MapPin,
    Phone,
    Mail,
    User,
    Package,
    ArrowUpDown,
    XCircle,
    RefreshCcw
} from "lucide-react";
import { getOrderById, updateOrderStatus, syncOrderPaymentStatus } from "@/lib/order-api";
import { useAuth } from "@/lib/auth-context";
import { Order } from "@/types/order";

export default function OrderDetailPage() {
    const params = useParams();
    const orderId = params?.id as string; // Strapi V5 uses string documentId

    const { token: authToken } = useAuth(); // Get auth token

    const [order, setOrder] = useState<Order | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [status, setStatus] = useState('pending'); // Local status state for optimistic updates

    const [activeVehicleImage, setActiveVehicleImage] = useState<string | null>(null);

    const vehicle = order?.VehicleModel;

    // Compute gallery images
    const galleryImages: string[] = (() => {
        if (!vehicle) return [];

        let images: string[] = [];
        let defaultImage = vehicle.thumbnail?.url;

        // Normalize default image
        if (defaultImage && !defaultImage.startsWith('http')) {
            defaultImage = `${process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337'}${defaultImage}`;
        }

        if (order?.SelectedColor && Array.isArray(vehicle.color)) {
            const selectedColorData = vehicle.color.find((c: any) => c.name === order.SelectedColor);
            if (selectedColorData) {
                if (selectedColorData.images && Array.isArray(selectedColorData.images)) {
                    images = selectedColorData.images.map((img: any) => {
                        const url = img.url;
                        return url.startsWith('http') ? url : `${process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337'}${url}`;
                    });
                } else if (selectedColorData.image?.url) {
                    // Fallback for older structure
                    const url = selectedColorData.image.url;
                    images = [url.startsWith('http') ? url : `${process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337'}${url}`];
                }
            }
        }

        // If no specifically colored images found, fall back to default thumbnail
        if (images.length === 0 && defaultImage) {
            images = [defaultImage];
        }

        return images;
    })();

    // Set initial active image
    useEffect(() => {
        if (galleryImages.length > 0 && !activeVehicleImage) {
            setActiveVehicleImage(galleryImages[0]);
        } else if (galleryImages.length > 0 && !galleryImages.includes(activeVehicleImage || '')) {
            // Reset if the current active image is no longer in the valid list (e.g. order changed)
            setActiveVehicleImage(galleryImages[0]);
        }
    }, [galleryImages, activeVehicleImage]);

    useEffect(() => {
        async function fetchOrder() {
            setLoading(true);
            setError(null);
            try {
                // Use real token or empty string
                const token = authToken || "";
                const data = await getOrderById(token, orderId);
                if (data) {
                    console.log('=== ORDER DETAIL DEBUG ===');
                    console.log('Order data:', data);
                    console.log('VehicleModel:', data.VehicleModel);
                    console.log('VehicleModel type:', typeof data.VehicleModel);
                    console.log('==========================');
                    setOrder(data);
                    setStatus(data.Statuses || 'pending');
                }
            } catch (error: any) {
                console.error("Failed to fetch order:", error);
                setError(error.message || "Không thể tải thông tin đơn hàng");
            } finally {
                setLoading(false);
            }
        }
        if (orderId) fetchOrder();
    }, [orderId, authToken]);

    const handlePrint = () => {
        window.print();
    };

    const handleSync = async () => {
        if (!confirm("Bạn có muốn kiểm tra và đồng bộ trạng thái thanh toán từ PayOS?")) return;
        
        const result = await syncOrderPaymentStatus(authToken || "", orderId);
        if (result.success) {
            alert(result.message);
            if (result.status === 'completed') {
                setStatus('completed');
                setOrder(prev => prev ? { ...prev, PaymentStatus: 'completed', Statuses: 'processing' } : null);
            }
        } else {
            alert(result.message);
        }
    };

    const updateStatus = async (newStatus: string) => {
        if (!confirm(`Bạn có chắc chắn muốn chuyển trạng thái đơn hàng sang "${newStatus}"?`)) return;

        const token = authToken || "";
        const success = await updateOrderStatus(token, orderId, newStatus);

        if (success) {
            setStatus(newStatus);
            let message = "";
            switch (newStatus) {
                case 'confirmed': message = "Đã xác nhận đơn hàng! Chuyển sang xử lý."; break;
                case 'shipping': message = "Đơn hàng đã bắt đầu giao!"; break;
                case 'completed': message = "Đơn hàng đã hoàn thành!"; break;
                case 'cancelled': message = "Đã hủy đơn hàng."; break;
                default: message = "Đã cập nhật trạng thái.";
            }
            alert(message);
        } else {
            alert("Cập nhật trạng thái thất bại. Vui lòng thử lại.");
        }
    };

    if (loading) {
        return (
            <div className="p-8 text-center text-foreground">
                <h1 className="text-2xl font-bold mb-4">Đang tải đơn hàng...</h1>
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-8 text-center text-foreground">
                <h1 className="text-2xl font-bold mb-4 text-red-500">Đã xảy ra lỗi!</h1>
                <p className="mb-4 text-muted-foreground">{error}</p>
                <Link href="/admin/orders" className="text-primary hover:underline">Quay lại danh sách</Link>
            </div>
        );
    }

    if (!order) {
        return (
            <div className="p-8 text-center text-foreground">
                <h1 className="text-2xl font-bold mb-4">Không tìm thấy đơn hàng #{params.id}</h1>
                <Link href="/admin/orders" className="text-primary hover:underline">Quay lại danh sách</Link>
            </div>
        );
    }

    const customerInfo = order.CustomerInfo || {};

    return (
        <div className="space-y-6 pb-20">
            {/* Header & Actions */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                        <Link
                            href="/admin/orders"
                            className="p-2 bg-muted/50 rounded-full hover:bg-muted transition-colors"
                        >
                            <ArrowLeft className="w-5 h-5 text-foreground" />
                        </Link>
                        <div>
                            <div className="flex items-center gap-3">
                                <h1 className="text-2xl font-bold text-foreground">Đơn Hàng {order.OrderCode}</h1>
                                <span className={`px-2 py-0.5 rounded text-xs font-bold uppercase border ${status === 'pending_payment' ? 'bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 border-yellow-500/20' :
                                    status === 'deposit_paid' ? 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20' :
                                        status === 'processing' ? 'bg-orange-500/10 text-orange-600 dark:text-orange-400 border-orange-500/20' :
                                            status === 'ready_for_pickup' ? 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20' :
                                                status === 'completed' ? 'bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/20' :
                                                    status === 'cancelled' ? 'bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20' :
                                                        'bg-gray-500/10 text-gray-600 dark:text-gray-400 border-gray-500/20'
                                    }`}>
                                    {status === 'pending_payment' ? 'Chờ Thanh Toán' :
                                        status === 'deposit_paid' ? 'Đã Cọc' :
                                            status === 'processing' ? 'Đang Xử Lý' :
                                                status === 'ready_for_pickup' ? 'Chờ Lấy' :
                                                    status === 'completed' ? 'Hoàn Thành' :
                                                        status === 'cancelled' ? 'Đã Hủy' : status}
                                </span>
                            </div>
                            <p className="text-sm text-muted-foreground">Đặt ngày {new Date(order.createdAt).toLocaleDateString('vi-VN')}</p>
                        </div>
                    </div>

                    <div className="flex gap-3">
                        <button
                            onClick={handleSync}
                            className="px-4 py-2 bg-blue-500/10 hover:bg-blue-500/20 text-blue-600 dark:text-blue-400 rounded-xl border border-blue-500/20 flex items-center gap-2 transition-colors"
                            title="Đồng bộ trạng thái thanh toán từ PayOS"
                        >
                            <RefreshCcw className="w-4 h-4" />
                            Check PayOS
                        </button>

                        <button
                            onClick={handlePrint}
                            className="px-4 py-2 bg-muted/50 hover:bg-muted text-foreground rounded-xl border border-border flex items-center gap-2 transition-colors"
                        >
                            <Printer className="w-4 h-4" />
                            In Hóa Đơn
                        </button>

                    {/* Status Actions based on Current Status */}
                    {/* Simplified Logic for Demo: Valid transitions logic would typically be more complex */}
                    {status === 'pending_payment' && (
                        <button
                            onClick={() => updateStatus('cancelled')}
                            className="px-4 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 font-bold rounded-xl flex items-center gap-2 transition-colors border border-red-500/20"
                        >
                            <XCircle className="w-4 h-4" /> Hủy Đơn
                        </button>
                    )}

                    {['pending_payment', 'deposit_paid'].includes(status) && (
                        <button
                            onClick={() => updateStatus('processing')}
                            className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white font-bold rounded-xl flex items-center gap-2 transition-colors shadow-lg shadow-blue-500/20"
                        >
                            <CheckCircle className="w-4 h-4" /> Xử Lý Đơn
                        </button>
                    )}

                    {status === 'processing' && (
                        <button
                            onClick={() => updateStatus('ready_for_pickup')}
                            className="px-4 py-2 bg-purple-500 hover:bg-purple-600 text-white font-bold rounded-xl flex items-center gap-2 transition-colors shadow-lg shadow-purple-500/20"
                        >
                            <Package className="w-4 h-4" /> Sẵn Sàng Giao
                        </button>
                    )}

                    {['ready_for_pickup', 'shipping'].includes(status) && (
                        <button
                            onClick={() => updateStatus('completed')}
                            className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white font-bold rounded-xl flex items-center gap-2 transition-colors shadow-lg shadow-green-500/20"
                        >
                            <CheckCircle className="w-4 h-4" /> Hoàn Thành
                        </button>
                    )}
                </div>
            </div>

            <div className="grid lg:grid-cols-3 gap-6">
                {/* Main: Items */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Customer Info (Mobile View / Top) */}
                    <div className="bg-card border border-border rounded-2xl p-6 lg:hidden">
                        <h2 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2">
                            <User className="w-5 h-5 text-primary" />
                            Thông Tin Khách Hàng
                        </h2>
                        <div className="space-y-4">
                            <div className="flex items-start gap-3">
                                <User className="w-4 h-4 text-muted-foreground mt-1" />
                                <div>
                                    <div className="font-bold text-foreground">{customerInfo.FullName}</div>
                                    <div className="text-sm text-muted-foreground">Khách lẻ</div>
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <Phone className="w-4 h-4 text-muted-foreground mt-1" />
                                <div className="text-muted-foreground">{customerInfo.Phone}</div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-card border border-border rounded-2xl overflow-hidden">
                        <div className="p-6 border-b border-border">
                            <h2 className="text-lg font-bold text-foreground">Chi Tiết Sản Phẩm</h2>
                        </div>
                        <div className="p-6 space-y-6">
                            {vehicle ? (
                                <div className="flex flex-col md:flex-row gap-4">
                                    {/* Image Gallery */}
                                    <div className="flex flex-col gap-2 w-full md:w-1/3 lg:w-1/4">
                                        <div className="w-full aspect-square bg-muted/50 rounded-lg flex items-center justify-center text-muted-foreground overflow-hidden relative">
                                            {activeVehicleImage ? (
                                                <img
                                                    src={activeVehicleImage}
                                                    alt={vehicle.name}
                                                    className="w-full h-full object-cover"
                                                />
                                            ) : (
                                                <Package className="w-12 h-12 opacity-50" />
                                            )}
                                        </div>
                                        {galleryImages.length > 1 && (
                                            <div className="flex gap-2 overflow-x-auto pb-2">
                                                {galleryImages.map((imgUrl, index) => (
                                                    <button
                                                        key={index}
                                                        onClick={() => setActiveVehicleImage(imgUrl)}
                                                        className={`w-16 h-16 flex-shrink-0 bg-muted/50 rounded-lg overflow-hidden border-2 ${activeVehicleImage === imgUrl ? 'border-primary' : 'border-transparent'} hover:border-primary transition-colors`}
                                                    >
                                                        <img
                                                            src={imgUrl}
                                                            alt={`${vehicle.name} thumbnail ${index + 1}`}
                                                            className="w-full h-full object-cover"
                                                        />
                                                    </button>
                                                ))}
                                            </div>
                                        )}
                                    </div>

                                    {/* Product Details */}
                                    <div className="flex-1">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <h3 className="font-bold text-foreground text-lg">{vehicle.name}</h3>
                                                <div className="flex items-center gap-2 mt-1">
                                                    <p className="text-sm text-muted-foreground">Loại: {vehicle.type === 'bicycle' ? 'Xe Đạp Điện' : 'Xe Máy Điện'}</p>
                                                    {order.SelectedColor && (
                                                        <span className="text-sm text-muted-foreground border-l border-border pl-2">
                                                            Màu: <span className="text-foreground">{order.SelectedColor}</span>
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <div className="font-bold text-foreground text-lg">
                                                    {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(order.TotalAmount)}
                                                </div>
                                                <div className="text-xs text-muted-foreground mt-1">
                                                    x 1
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div className="text-center text-muted-foreground p-4 bg-muted/50 rounded-lg border border-border border-dashed">
                                    Không có thông tin xe
                                </div>
                            )}
                        </div>
                        <div className="bg-muted/50 p-6 space-y-3">
                            <div className="flex justify-between text-sm text-muted-foreground">
                                <span>Tạm tính</span>
                                <span>{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(order.TotalAmount)}</span>
                            </div>
                            <div className="flex justify-between text-sm text-muted-foreground">
                                <span>Phí vận chuyển</span>
                                <span>Miễn phí</span>
                            </div>
                            <div className="flex justify-between text-lg font-bold text-foreground border-t border-border pt-3 mt-3">
                                <span>Tổng cộng</span>
                                <span className="text-primary">{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(order.TotalAmount)}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Sidebar: Customer & Notes */}
                <div className="lg:col-span-1 space-y-6">
                    <div className="bg-card border border-border rounded-2xl p-6 hidden lg:block">
                        <h2 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2">
                            <User className="w-5 h-5 text-primary" />
                            Thông Tin Khách Hàng
                        </h2>
                        <div className="space-y-4">
                            <div className="flex items-start gap-3">
                                <User className="w-4 h-4 text-muted-foreground mt-1" />
                                <div>
                                    <div className="font-bold text-foreground">{customerInfo.FullName}</div>
                                    <div className="text-sm text-muted-foreground">Khách lẻ</div>
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <Phone className="w-4 h-4 text-muted-foreground mt-1" />
                                <div className="text-muted-foreground">{customerInfo.Phone}</div>
                            </div>
                            <div className="flex items-start gap-3">
                                <Mail className="w-4 h-4 text-muted-foreground mt-1" />
                                <div className="text-muted-foreground">customer@example.com</div>
                            </div>
                            <div className="flex items-start gap-3">
                                <MapPin className="w-4 h-4 text-muted-foreground mt-1" />
                                <div className="text-muted-foreground">Hà Nội, Việt Nam</div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-card border border-border rounded-2xl p-6">
                        <h2 className="text-lg font-bold text-foreground mb-4">Thanh Toán</h2>
                        <div className="p-3 rounded-xl bg-green-500/10 border border-green-500/20 text-green-400 text-sm font-bold flex items-center gap-2">
                            <CheckCircle className="w-4 h-4" />
                            {order.PaymentMethod || 'COD'}
                        </div>
                    </div>
                </div>
            </div>

            {/* Print Styles */}
            <style jsx global>{`
                @media print {
                    @page { margin: 0; }
                    body * { visibility: hidden; }
                    .bg-card, .bg-card * { visibility: visible; color: black !important; background: white !important; border-color: #ddd !important; }
                    .bg-card { position: absolute; left: 0; top: 0; width: 100%; box-shadow: none !important; }
                    button, a, header, aside { display: none !important; }
                }
            `}</style>
        </div>
    );
}
