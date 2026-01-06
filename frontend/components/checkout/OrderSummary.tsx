'use client';

import { useCheckout } from '@/contexts/CheckoutContext';
import { useCart } from '@/lib/cart-context';
import { formatCurrency } from '@/lib/utils';

export default function OrderSummary() {
    const { paymentMethod, installmentMonths } = useCheckout();
    const { items, total } = useCart();

    const item = items[0];
    if (!item) return null;

    // Giá hiển thị theo thực tế checkout hiện tại:
    // - Nếu có khuyến mãi: item.price là giá sau KM, item.originalPrice là giá trước KM
    // - Online chỉ thu (giá sau KM) + VAT 10%
    const basePrice = Number(item.originalPrice ?? item.price ?? total ?? 0);
    const priceAfterDiscount = Number(item.price ?? total ?? 0);
    const discountAmount = Math.max(0, basePrice - priceAfterDiscount);
    const vat = Math.round(priceAfterDiscount * 0.1);
    const totalAmount = priceAfterDiscount + vat;

    let depositAmount = 0;
    let remainingAmount = 0;

    if (paymentMethod === 'deposit') {
        depositAmount = 3000000;
        remainingAmount = totalAmount - depositAmount;
    } else if (paymentMethod === 'full_payment') {
        depositAmount = totalAmount;
        remainingAmount = 0;
    } else if (paymentMethod === 'installment') {
        depositAmount = totalAmount * 0.3;
        remainingAmount = totalAmount - depositAmount;
    }

    return (
        <div className="sticky top-24">
            <div className="bg-card/30 border border-border rounded-2xl p-6">
                {/* Header */}
                <h3 className="text-xl font-bold text-foreground mb-6">Tóm tắt đơn hàng</h3>

                {/* Product Info */}
                <div className="mb-6 pb-6 border-b border-border">
                    {item.image && (
                        <div className="relative h-32 mb-4 rounded-xl overflow-hidden bg-muted/20">
                            <img
                                src={(item.gallery?.[0] || item.image || '/placeholder-car.png')}
                                alt={item.name}
                                className="w-full h-full object-contain"
                            />
                        </div>
                    )}
                    <h4 className="font-bold text-foreground mb-2">{item.name}</h4>
                    <div className="space-y-1 text-sm text-muted-foreground">
                        {item.colorName && item.colorName !== 'Mặc định' && (
                            <p>Màu: <span className="text-foreground">{item.colorName}</span></p>
                        )}
                    </div>
                </div>

                {/* Pricing Breakdown */}
                <div className="space-y-3 mb-6 pb-6 border-b border-border">
                    <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Giá xe:</span>
                        <span className="text-foreground">{formatCurrency(basePrice)}</span>
                    </div>
                    {discountAmount > 0 && (
                        <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Khuyến mãi:</span>
                            <span className="text-red-500">-{formatCurrency(discountAmount)}</span>
                        </div>
                    )}
                    <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">VAT (10%):</span>
                        <span className="text-foreground">{formatCurrency(vat)}</span>
                    </div>
                </div>

                {/* Total */}
                <div className="flex justify-between items-center mb-6 pb-6 border-b border-border">
                    <span className="font-bold text-foreground">Tổng cộng:</span>
                    <span className="text-2xl font-bold text-primary">{formatCurrency(totalAmount)}</span>
                </div>

                {/* Payment Info */}
                {paymentMethod && (
                    <div className="space-y-3 mb-6">
                        <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">
                                {paymentMethod === 'deposit' && 'Đặt cọc:'}
                                {paymentMethod === 'full_payment' && 'Thanh toán đầy đủ:'}
                                {paymentMethod === 'installment' && 'Trả trước (30%):'}
                            </span>
                            <span className="text-foreground font-semibold">{formatCurrency(depositAmount)}</span>
                        </div>
                        {remainingAmount > 0 && (
                            <div className="flex justify-between text-sm">
                                <span className="text-muted-foreground">Còn lại:</span>
                                <span className="text-foreground">{formatCurrency(remainingAmount)}</span>
                            </div>
                        )}
                        {paymentMethod === 'installment' && installmentMonths > 0 && (
                            <div className="flex justify-between text-sm">
                                <span className="text-muted-foreground">Trả góp:</span>
                                <span className="text-foreground">{installmentMonths} tháng</span>
                            </div>
                        )}
                    </div>
                )}

                {/* Benefits */}
                <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <span className="text-primary">🛡️</span>
                        <span>Bảo hành theo chính sách hãng</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <span className="text-primary">🔧</span>
                        <span>Bảo dưỡng theo lịch hãng</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <span className="text-primary">🔋</span>
                        <span>Bảo hành pin theo chính sách</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
