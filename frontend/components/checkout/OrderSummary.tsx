'use client';

import { useCheckout } from '@/contexts/CheckoutContext';
import { formatCurrency } from '@/lib/utils';

export default function OrderSummary() {
    const { selectedVehicle, selectedColor, selectedBattery, paymentMethod, installmentMonths, discountPercent } = useCheckout();

    if (!selectedVehicle) return null;

    const basePrice = selectedVehicle.price || 0;
    const discountAmount = discountPercent > 0 ? basePrice * (discountPercent / 100) : 0;
    const priceAfterDiscount = basePrice - discountAmount;
    // Registration fee calculated on original price (legal requirement)
    const registrationFee = basePrice * 0.1;
    const licensePlateFee = 1500000;
    const totalAmount = priceAfterDiscount + registrationFee + licensePlateFee;

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
            <div className="bg-card/30 border border-white/10 rounded-2xl p-6 backdrop-blur-sm">
                {/* Header */}
                <h3 className="text-xl font-bold text-white mb-6">Tóm tắt đơn hàng</h3>

                {/* Product Info */}
                <div className="mb-6 pb-6 border-b border-white/10">
                    {selectedVehicle.thumbnail && (
                        <div className="relative h-32 mb-4 rounded-xl overflow-hidden bg-white/5">
                            <img
                                src={(() => {
                                    // Try to find image for selected color
                                    const colorData = selectedColor
                                        ? selectedVehicle.colors?.find((c: any) => c.name === selectedColor)
                                        : null;

                                    // Use first image from gallery if available, otherwise fallback to thumbnail
                                    const colorImage = colorData?.images?.[0] || colorData?.image; // Handle both new and legacy structure
                                    const imageUrl = colorImage || selectedVehicle.thumbnail;

                                    return imageUrl?.startsWith('http')
                                        ? imageUrl
                                        : `${process.env.NEXT_PUBLIC_STRAPI_URL}${imageUrl}`;
                                })()}
                                alt={selectedVehicle.name}
                                className="w-full h-full object-contain"
                            />
                        </div>
                    )}
                    <h4 className="font-bold text-white mb-2">{selectedVehicle.name}</h4>
                    <div className="space-y-1 text-sm text-muted-foreground">
                        {selectedColor && <p>Màu: <span className="text-white">{selectedColor}</span></p>}
                        {selectedBattery && <p>Pin: <span className="text-white">{selectedBattery}</span></p>}
                    </div>
                </div>

                {/* Pricing Breakdown */}
                <div className="space-y-3 mb-6 pb-6 border-b border-white/10">
                    <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Giá xe:</span>
                        <span className="text-white">{formatCurrency(basePrice)}</span>
                    </div>
                    {discountPercent > 0 && (
                        <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Giảm giá ({discountPercent}%):</span>
                            <span className="text-red-500">-{formatCurrency(discountAmount)}</span>
                        </div>
                    )}
                    <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Phí trước bạ (10%):</span>
                        <span className="text-white">{formatCurrency(registrationFee)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Phí biển số:</span>
                        <span className="text-white">{formatCurrency(licensePlateFee)}</span>
                    </div>
                </div>

                {/* Total */}
                <div className="flex justify-between items-center mb-6 pb-6 border-b border-white/10">
                    <span className="font-bold text-white">Tổng cộng:</span>
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
                            <span className="text-white font-semibold">{formatCurrency(depositAmount)}</span>
                        </div>
                        {remainingAmount > 0 && (
                            <div className="flex justify-between text-sm">
                                <span className="text-muted-foreground">Còn lại:</span>
                                <span className="text-white">{formatCurrency(remainingAmount)}</span>
                            </div>
                        )}
                        {paymentMethod === 'installment' && installmentMonths > 0 && (
                            <div className="flex justify-between text-sm">
                                <span className="text-muted-foreground">Trả góp:</span>
                                <span className="text-white">{installmentMonths} tháng</span>
                            </div>
                        )}
                    </div>
                )}

                {/* Benefits */}
                <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <span className="text-primary">🛡️</span>
                        <span>{selectedVehicle.warranty?.warrantyPeriod || 'Bảo hành 3 năm'}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <span className="text-primary">🔧</span>
                        <span>{selectedVehicle.warranty?.maintenance || 'Bảo dưỡng miễn phí 2 năm'}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <span className="text-primary">🔋</span>
                        <span>{selectedVehicle.warranty?.batteryWarranty || 'Bảo hành pin 5 năm'}</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
