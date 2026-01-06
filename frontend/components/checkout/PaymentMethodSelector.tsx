'use client';

import { useCheckout } from '@/contexts/CheckoutContext';
import { useCart } from '@/lib/cart-context';
import { useState } from 'react';
import { Check, CreditCard, Wallet, Building2, Calculator } from 'lucide-react';
import { calculateInstallment } from '@/lib/order-api';
import { ThemeText } from '@/components/common/ThemeText';

export default function PaymentMethodSelector() {
    const {
        paymentMethod,
        setPaymentMethod,
        installmentMonths,
        setInstallmentMonths,
        goToNextStep
    } = useCheckout();

    const { total } = useCart();

    const [showCalculator, setShowCalculator] = useState(false);

    // Calculate total amount (cart total + VAT + shipping)
    const basePrice = total;
    const vat = basePrice * 0.1;
    const shipping = 0; // FREE SHIPPING
    const totalAmount = basePrice + vat + shipping;

    const installmentOptions = [6, 12, 18, 24];

    const handleContinue = () => {
        goToNextStep();
    };

    return (
        <div className="space-y-6">
            <ThemeText className="text-2xl font-bold text-white mb-6">Chọn hình thức thanh toán</ThemeText>

            {/* Full Payment */}
            <div
                onClick={() => setPaymentMethod('full_payment')}
                className={`
          relative bg-card/30 border-2 rounded-2xl p-6 cursor-pointer transition-all
          hover:border-primary/50
          ${paymentMethod === 'full_payment' ? 'border-primary shadow-[0_0_20px_rgba(0,255,148,0.3)]' : 'border-white/10'}
        `}
            >
                {paymentMethod === 'full_payment' && (
                    <div className="absolute top-4 right-4">
                        <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center">
                            <Check className="w-4 h-4 text-black" />
                        </div>
                    </div>
                )}

                <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-primary/20 rounded-xl flex items-center justify-center shrink-0">
                        <CreditCard className="w-6 h-6 text-primary" />
                    </div>
                    <div className="flex-1">
                        <ThemeText className="text-xl font-bold text-white mb-2">Thanh toán đầy đủ</ThemeText>
                        <p className="text-3xl font-bold text-primary mb-3">
                            {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(totalAmount)}
                        </p>
                        <ul className="space-y-2">
                            <li className="flex items-center gap-2 text-sm text-muted-foreground">
                                <Check className="w-4 h-4 text-primary" />
                                <span>Ưu đãi theo chương trình hiện hành (nếu có)</span>
                            </li>
                            <li className="flex items-center gap-2 text-sm text-muted-foreground">
                                <Check className="w-4 h-4 text-primary" />
                                <span>Nhận xe ngay trong 3 ngày</span>
                            </li>
                            <li className="flex items-center gap-2 text-sm text-muted-foreground">
                                <Check className="w-4 h-4 text-primary" />
                                <span>Tặng bộ phụ kiện cao cấp</span>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>

            {/* Deposit */}
            <div
                onClick={() => setPaymentMethod('deposit')}
                className={`
          relative bg-card/30 border-2 rounded-2xl p-6 cursor-pointer transition-all
          hover:border-primary/50
          ${paymentMethod === 'deposit' ? 'border-primary shadow-[0_0_20px_rgba(0,255,148,0.3)]' : 'border-white/10'}
        `}
            >
                {paymentMethod === 'deposit' && (
                    <div className="absolute top-4 right-4">
                        <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center">
                            <Check className="w-4 h-4 text-black" />
                        </div>
                    </div>
                )}

                <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-primary/20 rounded-xl flex items-center justify-center shrink-0">
                        <Wallet className="w-6 h-6 text-primary" />
                    </div>
                    <div className="flex-1">
                        <ThemeText className="text-xl font-bold text-white mb-2">Đặt cọc online</ThemeText>
                        <div className="flex items-baseline gap-2 mb-3">
                            <p className="text-3xl font-bold text-primary">3,000,000₫</p>
                            <span className="text-sm text-muted-foreground">(Cọc)</span>
                        </div>
                        <ul className="space-y-2">
                            <li className="flex items-center gap-2 text-sm text-muted-foreground">
                                <Check className="w-4 h-4 text-primary" />
                                <span>Giữ xe trong 7 ngày</span>
                            </li>
                            <li className="flex items-center gap-2 text-sm text-muted-foreground">
                                <Check className="w-4 h-4 text-primary" />
                                <span>Hoàn tiền 100% nếu hủy trong 48h</span>
                            </li>
                            <li className="flex items-center gap-2 text-sm text-muted-foreground">
                                <Check className="w-4 h-4 text-primary" />
                                <span>Còn lại: {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(totalAmount - 3000000)}</span>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>

            {/* Installment */}
            <div
                onClick={() => setPaymentMethod('installment')}
                className={`
          relative bg-card/30 border-2 rounded-2xl p-6 cursor-pointer transition-all
          hover:border-primary/50
          ${paymentMethod === 'installment' ? 'border-primary shadow-[0_0_20px_rgba(0,255,148,0.3)]' : 'border-white/10'}
        `}
            >
                {paymentMethod === 'installment' && (
                    <div className="absolute top-4 right-4">
                        <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center">
                            <Check className="w-4 h-4 text-black" />
                        </div>
                    </div>
                )}

                <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-primary/20 rounded-xl flex items-center justify-center shrink-0">
                        <Building2 className="w-6 h-6 text-primary" />
                    </div>
                    <div className="flex-1">
                        <ThemeText className="text-xl font-bold text-white mb-2">Trả góp 0% lãi suất</ThemeText>
                        <div className="flex items-center gap-2 mb-4">
                            <Calculator className="w-5 h-5 text-primary" />
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setShowCalculator(!showCalculator);
                                }}
                                className="text-primary text-sm hover:underline"
                            >
                                Xem chi tiết trả góp
                            </button>
                        </div>

                        {showCalculator && paymentMethod === 'installment' && (
                            <div className="bg-white/5 rounded-xl p-4 mb-4 space-y-3">
                                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                                    {installmentOptions.map((months) => {
                                        const plan = calculateInstallment(totalAmount, months);
                                        return (
                                            <button
                                                key={months}
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    setInstallmentMonths(months);
                                                }}
                                                className={`
                          p-3 rounded-lg border-2 transition-all text-center
                          ${installmentMonths === months
                                                        ? 'border-primary bg-primary/10'
                                                        : 'border-white/10 hover:border-primary/50'
                                                    }
                        `}
                                            >
                                                <div className="text-sm font-bold text-white">{months} tháng</div>
                                                <div className="text-xs text-muted-foreground mt-1">
                                                    {new Intl.NumberFormat('vi-VN').format(plan.monthlyPayment)}₫
                                                </div>
                                            </button>
                                        );
                                    })}
                                </div>

                                {installmentMonths > 0 && (
                                    <div className="border-t border-white/10 pt-3 space-y-2 text-sm">
                                        <div className="flex justify-between">
                                            <span className="text-muted-foreground">Trả trước (30%):</span>
                                            <span className="text-white font-semibold">
                                                {new Intl.NumberFormat('vi-VN').format(totalAmount * 0.3)}₫
                                            </span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-muted-foreground">Góp/tháng:</span>
                                            <span className="text-primary font-bold">
                                                {new Intl.NumberFormat('vi-VN').format(calculateInstallment(totalAmount, installmentMonths).monthlyPayment)}₫
                                            </span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-muted-foreground">Lãi suất:</span>
                                            <span className="text-white">
                                                {installmentMonths <= 12 ? '0%' : installmentMonths === 18 ? '5%' : '10%'}
                                            </span>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}

                        <ul className="space-y-2">
                            <li className="flex items-center gap-2 text-sm text-muted-foreground">
                                <Check className="w-4 h-4 text-primary" />
                                <span>Lãi suất 0% cho kỳ hạn 6-12 tháng</span>
                            </li>
                            <li className="flex items-center gap-2 text-sm text-muted-foreground">
                                <Check className="w-4 h-4 text-primary" />
                                <span>Duyệt hồ sơ trong 15 phút</span>
                            </li>
                            <li className="flex items-center gap-2 text-sm text-muted-foreground">
                                <Check className="w-4 h-4 text-primary" />
                                <span>Đối tác: VPBank, FE Credit, Home Credit</span>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>

            {/* Continue Button */}
            <button
                onClick={handleContinue}
                disabled={!paymentMethod}
                className="w-full bg-primary text-black px-8 py-4 rounded-full font-bold 
                   hover:bg-primary-dark transition-all hover:shadow-glow
                   disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-none"
            >
                Tiếp tục
            </button>
        </div>
    );
}
