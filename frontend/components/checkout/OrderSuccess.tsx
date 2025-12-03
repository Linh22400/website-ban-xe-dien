'use client';

import { useCheckout } from '@/contexts/CheckoutContext';
import { CheckCircle, Calendar, MapPin, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { formatCurrency } from '@/lib/utils';

export default function OrderSuccess() {
    const { createdOrder, resetCheckout } = useCheckout();

    if (!createdOrder) {
        return (
            <div className="text-center py-12">
                <p className="text-muted-foreground">Không tìm thấy thông tin đơn hàng.</p>
                <Link href="/" className="text-primary hover:underline mt-4 inline-block">
                    Về trang chủ
                </Link>
            </div>
        );
    }

    return (
        <div className="text-center space-y-8">
            <div className="flex flex-col items-center justify-center">
                <div className="w-20 h-20 bg-primary/20 rounded-full flex items-center justify-center mb-6 animate-bounce">
                    <CheckCircle className="w-10 h-10 text-primary" />
                </div>
                <h2 className="text-3xl font-bold text-white mb-2">Đặt hàng thành công!</h2>
                <p className="text-muted-foreground max-w-md mx-auto">
                    Cảm ơn bạn đã tin tưởng và lựa chọn Xe Điện Xanh.
                    Mã đơn hàng của bạn là <span className="text-primary font-bold">#{createdOrder.OrderCode}</span>
                </p>
            </div>

            <div className="bg-card/30 border border-white/10 rounded-2xl p-8 backdrop-blur-sm max-w-2xl mx-auto text-left">
                <h3 className="text-xl font-bold text-white mb-6 border-b border-white/10 pb-4">
                    Thông tin đơn hàng
                </h3>

                <div className="grid md:grid-cols-2 gap-8">
                    <div className="space-y-4">
                        <div>
                            <p className="text-sm text-muted-foreground mb-1">Khách hàng</p>
                            <p className="font-medium text-white">{createdOrder.CustomerInfo?.FullName || 'N/A'}</p>
                            <p className="text-sm text-white/70">{createdOrder.CustomerInfo?.Phone || 'N/A'}</p>
                            <p className="text-sm text-white/70">{createdOrder.CustomerInfo?.Email || 'N/A'}</p>
                        </div>

                        <div>
                            <p className="text-sm text-muted-foreground mb-1">Phương thức thanh toán</p>
                            <p className="font-medium text-white">
                                {createdOrder.PaymentMethod === 'deposit' ? 'Đặt cọc online' :
                                    createdOrder.PaymentMethod === 'full_payment' ? 'Thanh toán đầy đủ' : 'Trả góp'}
                            </p>
                            <p className="text-sm text-primary font-bold">
                                {formatCurrency(createdOrder.TotalAmount)}
                            </p>
                        </div>
                    </div>

                    <div className="space-y-4">
                        {createdOrder.SelectedShowroom && (
                            <div>
                                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                                    <MapPin className="w-4 h-4" />
                                    <span>Nơi nhận xe</span>
                                </div>
                                <p className="font-medium text-white">
                                    {typeof createdOrder.SelectedShowroom === 'object'
                                        ? createdOrder.SelectedShowroom.Name
                                        : `Showroom #${createdOrder.SelectedShowroom}`}
                                </p>
                            </div>
                        )}

                        {createdOrder.AppointmentDate && (
                            <div>
                                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                                    <Calendar className="w-4 h-4" />
                                    <span>Lịch hẹn</span>
                                </div>
                                <p className="font-medium text-white">
                                    {new Date(createdOrder.AppointmentDate).toLocaleDateString('vi-VN')}
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link
                    href="/"
                    onClick={resetCheckout}
                    className="px-8 py-3 rounded-full border border-white/10 hover:bg-white/5 transition-colors text-white font-medium"
                >
                    Về trang chủ
                </Link>
                <Link
                    href={`/tracking?code=${encodeURIComponent(createdOrder.OrderCode)}&phone=${encodeURIComponent(createdOrder.CustomerInfo?.Phone || '')}`}
                    onClick={resetCheckout}
                    className="px-8 py-3 rounded-full bg-primary text-black font-bold hover:bg-primary-dark transition-all hover:shadow-glow flex items-center gap-2"
                >
                    Theo dõi đơn hàng
                    <ArrowRight className="w-4 h-4" />
                </Link>
            </div>
        </div>
    );
}
