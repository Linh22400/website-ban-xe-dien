'use client';

import { useCheckout } from '@/contexts/CheckoutContext';
import { useCart } from '@/lib/cart-context';
import { useState } from 'react';
import { CreditCard, Smartphone, Building2, Check, Loader2, Banknote, MapPin } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';
import { createOrder } from '@/lib/order-api';
import { SubHeading, SectionHeading } from '@/components/common/ThemeText';
import { createVNPayPayment } from '@/lib/vnpay';
import { createMoMoPayment } from '@/lib/momo';

import PaymentModal from './PaymentModal';
import BankTransferForm from './BankTransferForm';

export default function PaymentGatewaySelector() {
    const {
        paymentMethod,
        installmentMonths,
        customerInfo,
        selectedShowroom,
        goToNextStep,
        setCreatedOrder,
        getOrderData
    } = useCheckout();

    const { total } = useCart();

    const isProduction = process.env.NODE_ENV === 'production';

    // Hiện tại backend mới hỗ trợ flow mock/verify; chưa tích hợp MoMo/VNPay thật.
    // Để tránh người dùng production chọn nhầm rồi lỗi, chỉ bật chuyển khoản ở production.
    const [selectedGateway, setSelectedGateway] = useState(isProduction ? 'bank_transfer' : 'momo');
    const [isProcessing, setIsProcessing] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [showPaymentModal, setShowPaymentModal] = useState(false);
    const [createdOrderRef, setCreatedOrderRef] = useState<{ orderCode: string; phone: string; amount: number } | null>(null);
    const [showBankTransferForm, setShowBankTransferForm] = useState(false);
    const [orderForBankTransfer, setOrderForBankTransfer] = useState<{ orderId: string; amount: number } | null>(null);

    // Calculate totals from cart
    const basePrice = total;
    const vat = basePrice * 0.1;
    const totalAmount = basePrice + vat; // No shipping fee (FREE)

    let depositAmount = 0;
    if (paymentMethod === 'deposit') {
        depositAmount = 3000000;
    } else if (paymentMethod === 'full_payment') {
        depositAmount = totalAmount;
    } else if (paymentMethod === 'installment') {
        depositAmount = totalAmount * 0.3;
    }

    const handlePlaceOrder = async () => {
        setIsProcessing(true);
        setErrorMessage(null);
        try {
            const orderData = getOrderData();
            // Override preferred gateway with locally selected one
            orderData.PreferredGateway = selectedGateway as any;

            if (!isProduction) {
                console.log('Submitting order:', orderData);
            }
            const result = await createOrder(orderData);

            if (result.data) {
                setCreatedOrder(result.data);

                const backendDepositAmount = Number(
                    (result as any)?.data?.DepositAmount ??
                    (result as any)?.meta?.pricing?.depositAmount ??
                    depositAmount
                );
                const finalAmount = Number.isFinite(backendDepositAmount) ? backendDepositAmount : depositAmount;

                // Handle VNPay - Redirect to VNPay payment page
                if (selectedGateway === 'vnpay') {
                    try {
                        const vnpayData = await createVNPayPayment(
                            result.data.OrderCode,
                            finalAmount,
                            `Thanh toan don hang ${result.data.OrderCode}`
                        );
                        // Redirect to VNPay payment page
                        window.location.href = vnpayData.paymentUrl;
                        return;
                    } catch (error) {
                        console.error('VNPay payment creation failed:', error);
                        setErrorMessage('Không thể tạo thanh toán VNPay. Vui lòng thử lại.');
                        setIsProcessing(false);
                        return;
                    }
                }

                // Handle MoMo - Redirect to MoMo payment page
                if (selectedGateway === 'momo') {
                    try {
                        const momoData = await createMoMoPayment(
                            result.data.OrderCode,
                            finalAmount,
                            `Thanh toan don hang ${result.data.OrderCode}`
                        );
                        // Redirect to MoMo payment page
                        window.location.href = momoData.paymentUrl;
                        return;
                    } catch (error) {
                        console.error('MoMo payment creation failed:', error);
                        setErrorMessage('Không thể tạo thanh toán MoMo. Vui lòng thử lại.');
                        setIsProcessing(false);
                        return;
                    }
                }

                // Handle Bank Transfer - Show upload form
                if (selectedGateway === 'bank_transfer') {
                    setOrderForBankTransfer({
                        orderId: result.data.OrderCode,
                        amount: finalAmount,
                    });
                    setShowBankTransferForm(true);
                    setIsProcessing(false);
                    return;
                }

                // Handle COD - Go to success page directly
                if (selectedGateway === 'cod') {
                    goToNextStep();
                    setTimeout(() => {
                        goToNextStep();
                    }, 1500);
                    return;
                }

                // Default flow
                goToNextStep();
                setTimeout(() => {
                    goToNextStep();
                }, 1500);
            }
        } catch (error) {
            console.error('Order creation failed:', error);
            const message = error instanceof Error ? error.message : 'Có lỗi xảy ra khi tạo đơn hàng. Vui lòng thử lại.';
            setErrorMessage(message);
        } finally {
            setIsProcessing(false);
        }
    };

    const handlePaymentSuccess = () => {
        setShowPaymentModal(false);
        goToNextStep();
        setTimeout(() => {
            goToNextStep();
        }, 1500);
    };

    const handleBankTransferSuccess = () => {
        setShowBankTransferForm(false);
        goToNextStep();
        setTimeout(() => {
            goToNextStep();
        }, 1500);
    };

    // Show bank transfer form if triggered
    if (showBankTransferForm && orderForBankTransfer) {
        return (
            <div className="space-y-8">
                <div className="text-center">
                    <SubHeading className="mb-2">Chuyển khoản ngân hàng</SubHeading>
                    <p className="text-muted-foreground">
                        Vui lòng chuyển khoản theo thông tin bên dưới
                    </p>
                </div>
                <BankTransferForm
                    orderId={orderForBankTransfer.orderId}
                    amount={orderForBankTransfer.amount}
                    onSuccess={handleBankTransferSuccess}
                />
            </div>
        );
    }

    return (
        <div className="space-y-8">
            <div className="text-center">
                <SubHeading className="mb-2">Thanh toán</SubHeading>
                <p className="text-muted-foreground">
                    Vui lòng chọn cổng thanh toán để hoàn tất đơn hàng
                </p>
            </div>

            <div className="bg-card/30 border border-white/10 rounded-2xl p-6">
                <div className="flex justify-between items-center mb-6 pb-6 border-b border-white/10">
                    <span className="text-muted-foreground">Số tiền cần thanh toán:</span>
                    <span className="text-3xl font-bold text-primary">
                        {formatCurrency(depositAmount)}
                    </span>
                </div>

                <div className="space-y-4">
                    {/* MoMo */}
                    {!isProduction && (
                        <div
                            onClick={() => setSelectedGateway('momo')}
                            className={`
                                relative flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all
                                ${selectedGateway === 'momo'
                                    ? 'border-primary bg-primary/10'
                                    : 'border-white/10 hover:border-white/30 bg-white/5'
                                }
                            `}
                        >
                            <div className="w-12 h-12 bg-[#A50064] rounded-lg flex items-center justify-center shrink-0">
                                <Smartphone className="w-6 h-6 text-white" />
                            </div>
                            <div className="flex-1">
                                <SectionHeading>Ví MoMo</SectionHeading>
                                <p className="text-sm text-muted-foreground">Thanh toán qua ứng dụng MoMo</p>
                            </div>
                            {selectedGateway === 'momo' && (
                                <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                                    <Check className="w-4 h-4 text-black" />
                                </div>
                            )}
                        </div>
                    )}

                    {/* COD - Cash on Delivery */}
                    <div
                        onClick={() => setSelectedGateway('cod')}
                        className={`
                            relative flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all
                            ${selectedGateway === 'cod'
                                ? 'border-primary bg-primary/10'
                                : 'border-white/10 hover:border-white/30 bg-white/5'
                            }
                        `}
                    >
                        <div className="w-12 h-12 bg-amber-600 rounded-lg flex items-center justify-center shrink-0">
                            <Banknote className="w-6 h-6 text-white" />
                        </div>
                        <div className="flex-1">
                            <div className="flex items-center gap-2">
                                <SectionHeading>Thanh toán khi nhận xe (COD)</SectionHeading>
                                <span className="text-xs bg-green-500 text-white px-2 py-0.5 rounded-full font-semibold">
                                    MIỄN PHÍ
                                </span>
                            </div>
                            <p className="text-sm text-muted-foreground">Thanh toán tiền mặt/thẻ tại showroom</p>
                        </div>
                        {selectedGateway === 'cod' && (
                            <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                                <Check className="w-4 h-4 text-black" />
                            </div>
                        )}
                    </div>

                    {/* VNPay - Now integrated with real payment */}
                    <div
                        onClick={() => setSelectedGateway('vnpay')}
                        className={`
                            relative flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all
                            ${selectedGateway === 'vnpay'
                                ? 'border-primary bg-primary/10'
                                : 'border-white/10 hover:border-white/30 bg-white/5'
                            }
                        `}
                    >
                        <div className="w-12 h-12 bg-[#005BAA] rounded-lg flex items-center justify-center shrink-0">
                            <CreditCard className="w-6 h-6 text-white" />
                        </div>
                        <div className="flex-1">
                            <SectionHeading>VNPay QR</SectionHeading>
                            <p className="text-sm text-muted-foreground">Quét mã QR qua ứng dụng ngân hàng</p>
                        </div>
                        {selectedGateway === 'vnpay' && (
                            <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                                <Check className="w-4 h-4 text-black" />
                            </div>
                        )}
                    </div>

                    {/* Bank Transfer */}
                    <div
                        onClick={() => setSelectedGateway('bank_transfer')}
                        className={`
                            relative flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all
                            ${selectedGateway === 'bank_transfer'
                                ? 'border-primary bg-primary/10'
                                : 'border-white/10 hover:border-white/30 bg-white/5'
                            }
                        `}
                    >
                        <div className="w-12 h-12 bg-emerald-600 rounded-lg flex items-center justify-center shrink-0">
                            <Building2 className="w-6 h-6 text-white" />
                        </div>
                        <div className="flex-1">
                            <div className="flex items-center gap-2">
                                <SectionHeading>Chuyển khoản ngân hàng</SectionHeading>
                                <span className="text-xs bg-green-500 text-white px-2 py-0.5 rounded-full font-semibold">
                                    MIỄN PHÍ
                                </span>
                            </div>
                            <p className="text-sm text-muted-foreground">Chuyển khoản trực tiếp 24/7</p>
                        </div>
                        {selectedGateway === 'bank_transfer' && (
                            <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                                <Check className="w-4 h-4 text-black" />
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <button
                onClick={handlePlaceOrder}
                disabled={isProcessing}
                className="w-full bg-primary text-black px-8 py-4 rounded-full font-bold 
                   hover:bg-primary-dark transition-all hover:shadow-glow
                   disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
                {isProcessing ? (
                    <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Đang xử lý...
                    </>
                ) : (
                    'Thanh toán & Hoàn tất'
                )}
            </button>

            {errorMessage && (
                <div className="text-sm text-red-500 text-center">
                    {errorMessage}
                </div>
            )}

            {/* Payment Modal */}
            {createdOrderRef && (
                <PaymentModal
                    isOpen={showPaymentModal}
                    onClose={() => setShowPaymentModal(false)}
                    orderCode={createdOrderRef.orderCode}
                    phone={createdOrderRef.phone}
                    amount={createdOrderRef.amount}
                    onSuccess={handlePaymentSuccess}
                />
            )}
        </div>
    );
}
