'use client';

import { useCheckout } from '@/contexts/CheckoutContext';
import { useCart } from '@/lib/cart-context';
import { CheckCircle, Calendar, MapPin, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { formatCurrency } from '@/lib/utils';
import { SubHeading, SectionHeading, ThemeText } from '@/components/common/ThemeText';
import { useEffect, useState } from 'react';
import { getShowrooms } from '@/lib/order-api';

export default function OrderSuccess() {
    const { createdOrder, resetCheckout } = useCheckout();
    const { total } = useCart();
    const [showroomName, setShowroomName] = useState<string>('');

    useEffect(() => {
        const fetchShowroomName = async () => {
            if (createdOrder?.SelectedShowroom && typeof createdOrder.SelectedShowroom !== 'object') {
                try {
                    // Since we only have getShowrooms (list), we fetch all and find by ID.
                    // This is cached so it's efficient enough.
                    const showrooms = await getShowrooms();
                    const found = showrooms.find(s => s.id === Number(createdOrder.SelectedShowroom));
                    if (found) {
                        setShowroomName(found.Name);
                    }
                } catch (err) {
                    console.error("Failed to fetch showroom name:", err);
                }
            }
        };
        fetchShowroomName();
    }, [createdOrder?.SelectedShowroom]);

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
                <SubHeading className="mb-2">Đặt hàng thành công!</SubHeading>
                <p className="text-muted-foreground max-w-md mx-auto">
                    Cảm ơn bạn đã tin tưởng và lựa chọn Xe Điện Đức Duy.
                    Mã đơn hàng của bạn là <span className="text-primary font-bold">#{createdOrder.OrderCode}</span>
                </p>
            </div>

            <div className="bg-card/30 border border-white/10 rounded-2xl p-8 max-w-2xl mx-auto text-left">
                <SectionHeading className="mb-6 border-b border-white/10 pb-4">
                    Thông tin đơn hàng
                </SectionHeading>

                <div className="grid md:grid-cols-2 gap-8">
                    <div className="space-y-4">
                        <div>
                            <p className="text-sm text-muted-foreground mb-1">Khách hàng</p>
                            <ThemeText className="font-medium">{createdOrder.CustomerInfo?.FullName || 'N/A'}</ThemeText>
                            <p className="text-sm text-muted-foreground">{createdOrder.CustomerInfo?.Phone || 'N/A'}</p>
                            <p className="text-sm text-muted-foreground">{createdOrder.CustomerInfo?.Email || 'N/A'}</p>
                        </div>

                        <div>
                            <p className="text-sm text-muted-foreground mb-1">Phương thức thanh toán</p>
                            <ThemeText className="font-medium">
                                {createdOrder.PaymentMethod === 'deposit' ? 'Đặt cọc online' :
                                    createdOrder.PaymentMethod === 'full_payment' ? 'Thanh toán đầy đủ' : 'Trả góp'}
                            </ThemeText>
                            <p className="text-sm text-primary font-bold">
                                {formatCurrency(
                                    createdOrder.PaymentMethod === 'full_payment' 
                                        ? (createdOrder.TotalAmount ?? (total + total * 0.1)) 
                                        : (createdOrder.DepositAmount ?? 0)
                                )}
                            </p>
                            <p className="text-xs text-muted-foreground">
                                Tổng thanh toán (đã gồm VAT): {formatCurrency(createdOrder.TotalAmount ?? (total + total * 0.1))}
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
                                <ThemeText className="font-medium">
                                    {typeof createdOrder.SelectedShowroom === 'object'
                                        ? createdOrder.SelectedShowroom.Name
                                        : (showroomName || `Showroom #${createdOrder.SelectedShowroom}`)}
                                </ThemeText>
                            </div>
                        )}

                        {createdOrder.AppointmentDate && (
                            <div>
                                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                                    <Calendar className="w-4 h-4" />
                                    <span>Lịch hẹn</span>
                                </div>
                                <ThemeText className="font-medium">
                                    {new Date(createdOrder.AppointmentDate).toLocaleDateString('vi-VN')}
                                </ThemeText>
                            </div>
                        )}
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
        </div>
    );
}
