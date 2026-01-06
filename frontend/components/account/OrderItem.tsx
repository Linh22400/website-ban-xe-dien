'use client';

import { Order } from '@/types/order';
import { formatCurrency } from '@/lib/utils';
import { Calendar, MapPin } from 'lucide-react';
import CartImageGallery from '@/components/cart/CartImageGallery';
import { SectionHeading, ThemeText } from '@/components/common/ThemeText';

interface OrderItemProps {
    order: Order;
}

export default function OrderItem({ order }: OrderItemProps) {
    const getStatusColor = (status: string) => {
        switch (status) {
            case 'completed':
                return 'text-green-500 bg-green-500/10';
            case 'processing':
            case 'ready_for_pickup':
                return 'text-blue-500 bg-blue-500/10';
            case 'cancelled':
                return 'text-red-500 bg-red-500/10';
            default:
                return 'text-yellow-500 bg-yellow-500/10';
        }
    };

    const getStatusText = (status: string) => {
        switch (status) {
            case 'pending_payment': return 'Chờ thanh toán';
            case 'deposit_paid': return 'Đã đặt cọc';
            case 'processing': return 'Đang xử lý';
            case 'ready_for_pickup': return 'Sẵn sàng giao xe';
            case 'completed': return 'Hoàn thành';
            case 'cancelled': return 'Đã hủy';
            case 'refunded': return 'Đã hoàn tiền';
            default: return status;
        }
    };

    // Get payment method badge (more accurate than backend status)
    const getPaymentMethodBadge = () => {
        const method = order.PaymentMethod;
        if (method === 'full_payment') {
            return { text: 'Thanh toán đủ', color: 'text-green-500 bg-green-500/10' };
        } else if (method === 'deposit') {
            return { text: 'Đặt cọc', color: 'text-yellow-500 bg-yellow-500/10' };
        } else if (method === 'installment') {
            return { text: 'Trả góp', color: 'text-blue-500 bg-blue-500/10' };
        }
        return { text: getStatusText(order.Statuses), color: getStatusColor(order.Statuses) };
    };

    // Safely handle VehicleModel rendering
    const vehicleName = order.VehicleModel?.name || 'Xe điện';

    // Fallback Strapi URL if env variable is not set
    const strapiUrl = process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337';

    // Find the selected color's images (backend uses PascalCase: SelectedColor)
    const selectedColorData = order.VehicleModel?.color?.find(
        (c: any) => c.name === (order as any).SelectedColor
    );

    // Get all images from selected color for gallery
    const colorImages = selectedColorData?.images || (selectedColorData?.image ? [selectedColorData.image] : []);
    const galleryUrls = colorImages.map((img: any) =>
        img.url ? `${strapiUrl}${img.url}` : ''
    ).filter(Boolean);

    // Fallback to thumbnail if no color images
    if (galleryUrls.length === 0 && order.VehicleModel?.thumbnail?.url) {
        galleryUrls.push(`${strapiUrl}${order.VehicleModel.thumbnail.url}`);
    }

    // Final fallback
    if (galleryUrls.length === 0) {
        galleryUrls.push('/placeholder-car.png');
    }

    // Ưu tiên dùng số liệu backend đã tính để hiển thị đúng thực tế.
    const displayPaidAmount = Number(order.DepositAmount ?? 0);

    const paymentBadge = getPaymentMethodBadge();

    return (
        <div className="bg-card/30 border border-white/10 rounded-xl overflow-hidden hover:border-primary/50 transition-all group">
            <div className="p-6">
                <div className="flex flex-col md:flex-row gap-6">
                    {/* Image Gallery */}
                    <CartImageGallery
                        images={galleryUrls}
                        productName={vehicleName}
                        size="large"
                        onImageClick={() => { }} // No modal for now
                    />

                    {/* Content */}
                    <div className="flex-1 space-y-4">
                        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                            <div>
                                <div className="flex items-center gap-3 mb-1">
                                    <SectionHeading className="text-lg">{vehicleName}</SectionHeading>
                                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${paymentBadge.color}`}>
                                        {paymentBadge.text}
                                    </span>
                                </div>
                                <p className="text-sm text-muted-foreground">
                                    Mã đơn: <ThemeText className="font-mono">{order.OrderCode}</ThemeText>
                                </p>
                                {/* Display selected color */}
                                {(order as any).SelectedColor && (
                                    <p className="text-sm text-muted-foreground mt-1">
                                        Màu: <ThemeText className="font-medium">{(order as any).SelectedColor}</ThemeText>
                                    </p>
                                )}
                            </div>
                            <div className="text-right">
                                <p className="text-lg font-bold text-primary">
                                    {formatCurrency(displayPaidAmount)}
                                </p>
                                <p className="text-sm text-muted-foreground">
                                    {order.PaymentMethod === 'deposit' ? 'Đặt cọc' :
                                        order.PaymentMethod === 'full_payment' ? 'Thanh toán đủ' : 'Trả góp'}
                                </p>
                            </div>
                        </div>

                        <div className="flex flex-wrap gap-4 text-sm text-muted-foreground pt-4 border-t border-white/10">
                            <div className="flex items-center gap-2">
                                <Calendar className="w-4 h-4" />
                                <span>
                                    {new Date(order.createdAt).toLocaleDateString('vi-VN')}
                                </span>
                            </div>
                            {order.SelectedShowroom && (
                                <div className="flex items-center gap-2">
                                    <MapPin className="w-4 h-4" />
                                    <span>
                                        {typeof order.SelectedShowroom === 'object'
                                            ? order.SelectedShowroom.Name
                                            : `Showroom #${order.SelectedShowroom}`}
                                    </span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
