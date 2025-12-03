'use client';

import { Order } from '@/types/order';
import { formatCurrency } from '@/lib/utils';
import { Calendar, MapPin } from 'lucide-react';
import Image from 'next/image';

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

    // Safely handle VehicleModel rendering
    const vehicleName = order.VehicleModel?.name || 'Xe điện';

    // Fallback Strapi URL if env variable is not set
    const strapiUrl = process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337';

    // Find the selected color's image (backend uses PascalCase: SelectedColor)
    const selectedColorData = order.VehicleModel?.color?.find(
        (c: any) => c.name === (order as any).SelectedColor
    );

    // Use color-specific image if available, otherwise fall back to thumbnail
    const vehicleImage = selectedColorData?.image?.url
        ? `${strapiUrl}${selectedColorData.image.url}`
        : order.VehicleModel?.thumbnail?.url
            ? `${strapiUrl}${order.VehicleModel.thumbnail.url}`
            : '/placeholder-car.png';

    return (
        <div className="bg-card/30 border border-white/10 rounded-xl overflow-hidden hover:border-primary/50 transition-all group">
            <div className="p-6">
                <div className="flex flex-col md:flex-row gap-6">
                    {/* Image */}
                    <div className="w-full md:w-32 h-24 bg-white/5 rounded-lg relative overflow-hidden shrink-0">
                        <Image
                            src={vehicleImage}
                            alt={vehicleName}
                            fill
                            className="object-cover"
                        />
                    </div>

                    {/* Content */}
                    <div className="flex-1 space-y-4">
                        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                            <div>
                                <div className="flex items-center gap-3 mb-1">
                                    <h3 className="font-bold text-lg text-white">{vehicleName}</h3>
                                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(order.Statuses)}`}>
                                        {getStatusText(order.Statuses)}
                                    </span>
                                </div>
                                <p className="text-sm text-muted-foreground">
                                    Mã đơn: <span className="font-mono text-white">{order.OrderCode}</span>
                                </p>
                            </div>
                            <div className="text-right">
                                <p className="text-lg font-bold text-primary">
                                    {formatCurrency(order.TotalAmount)}
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
