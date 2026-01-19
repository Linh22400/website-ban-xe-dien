'use client';

import { useCheckout } from '@/contexts/CheckoutContext';
import { useCart } from '@/lib/cart-context';
import { formatCurrency } from '@/lib/utils';

export default function OrderSummary() {
    const { paymentMethod, installmentMonths, shippingMethod } = useCheckout();
    const { items, total } = useCart();

    if (items.length === 0) return null;

    // Calculate totals across all items
    const basePrice = items.reduce((sum, item) => {
        const itemBase = Number(item.originalPrice ?? item.price ?? 0);
        return sum + (itemBase * item.quantity);
    }, 0);
    
    const priceAfterDiscount = total; // total from context is sum(price * quantity)
    const discountAmount = Math.max(0, basePrice - priceAfterDiscount);
    const vat = Math.round(priceAfterDiscount * 0.1);
    const totalAmount = priceAfterDiscount + vat;

    let depositAmount = 0;
    let remainingAmount = 0;

    if (paymentMethod === 'deposit') {
        depositAmount = totalAmount * 0.2;
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
                <h3 className="text-xl font-bold text-foreground mb-6">Tóm tắt đơn hàng ({items.length} sản phẩm)</h3>

                {/* Product List */}
                <div className="mb-6 pb-6 border-b border-border space-y-4 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                    {items.map((item, index) => (
                        <div key={`${item.id}-${item.colorName}-${index}`} className="flex gap-4">
                            {/* Image */}
                            <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-muted/20 shrink-0">
                                {item.image ? (
                                    <img
                                        src={(item.gallery?.[0] || item.image || '/placeholder-car.png')}
                                        alt={item.name}
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <div className="w-full h-full bg-secondary flex items-center justify-center text-xs">No img</div>
                                )}
                            </div>
                            
                            {/* Info */}
                            <div className="flex-1 min-w-0">
                                <h4 className="font-bold text-foreground text-sm truncate">{item.name}</h4>
                                <div className="space-y-1 text-xs text-muted-foreground">
                                    {item.colorName && item.colorName !== 'Mặc định' && (
                                        <p>Màu: <span className="text-foreground">{item.colorName}</span></p>
                                    )}
                                    <div className="flex justify-between items-center mt-1">
                                        <span>SL: <span className="text-foreground font-medium">{item.quantity}</span></span>
                                        <span className="text-foreground font-medium">{formatCurrency(item.price * item.quantity)}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
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
                    <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Phí vận chuyển:</span>
                        <span className="text-primary font-bold">
                            {shippingMethod === 'delivery' ? 'MIỄN PHÍ' : 'MIỄN PHÍ (Nhận tại cửa hàng)'}
                        </span>
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
                            {paymentMethod === 'deposit' && 'Đặt cọc (20%):'}
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
