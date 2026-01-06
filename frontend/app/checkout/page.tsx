'use client';

import { CheckoutProvider, useCheckout } from '@/contexts/CheckoutContext';
import ProgressStepper from '@/components/checkout/ProgressStepper';
import OrderSummary from '@/components/checkout/OrderSummary';
import PaymentMethodSelector from '@/components/checkout/PaymentMethodSelector';
import CustomerInfoForm from '@/components/checkout/CustomerInfoForm';
import ShowroomSelector from '@/components/checkout/ShowroomSelector';
import PaymentGatewaySelector from '@/components/checkout/PaymentGatewaySelector';
import OrderSuccess from '@/components/checkout/OrderSuccess';
import CartImageGallery from '@/components/cart/CartImageGallery';
import ImageModal from '@/components/cart/ImageModal';
import Link from 'next/link';
import { ArrowLeft, Loader2, ShoppingCart } from 'lucide-react';
import { PageHeading, SubHeading, SectionHeading, ThemeText, ThemeDiv } from '@/components/common/ThemeText';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '@/lib/cart-context';
import { getPromotions } from '@/lib/api';

export default function CheckoutPage() {
    return (
        <CheckoutProvider>
            <CheckoutContent />
        </CheckoutProvider>
    );
}

function CheckoutContent() {
    const { items, total } = useCart();
    const { currentStep, goToNextStep } = useCheckout();
    const router = useRouter();
    const [modalState, setModalState] = useState<{ isOpen: boolean; images: string[]; index: number; name: string }>({
        isOpen: false,
        images: [],
        index: 0,
        name: ""
    });
    const [discountMap, setDiscountMap] = useState<Record<string, number>>({});
    const [originalTotal, setOriginalTotal] = useState(0);

    // Fetch promotions on mount
    useEffect(() => {
        async function fetchPromotions() {
            try {
                const promos = await getPromotions();

                // Create discount map: car ID -> discount percent
                const map: Record<string, number> = {};
                promos.forEach((promo: any) => {
                    if (promo.isActive && promo.discountPercent && promo.car_models) {
                        promo.car_models.forEach((car: any) => {
                            map[car.id] = promo.discountPercent;
                            if (car.documentId) map[car.documentId] = promo.discountPercent;
                        });
                    }
                });
                setDiscountMap(map);
            } catch (error) {
                console.error('Failed to fetch promotions:', error);
            }
        }
        fetchPromotions();
    }, []);

    // Calculate original total when discount map or items change
    useEffect(() => {
        const calcOriginal = items.reduce((sum, item) => {
            const discount = discountMap[item.id] || 0;
            const originalPrice = discount > 0 ? item.price / (1 - discount / 100) : item.price;
            return sum + originalPrice * item.quantity;
        }, 0);
        setOriginalTotal(calcOriginal);
    }, [items, discountMap]);

    // Redirect to cart if empty
    useEffect(() => {
        if (items.length === 0) {
            router.push('/cart');
        }
    }, [items, router]);

    // Flow hiện tại chỉ hỗ trợ 1 xe / 1 đơn.
    // Nếu dữ liệu cũ có nhiều xe trong giỏ, đưa về trang giỏ để người dùng xử lý.
    useEffect(() => {
        if (items.length > 1) {
            router.push('/cart');
        }
    }, [items, router]);

    if (items.length === 0 || items.length > 1) {
        return null; // Will redirect
    }

    return (
        <main className="min-h-screen bg-background pt-24 pb-20">
            <div className="bg-secondary/30 border-b border-white/5 py-8 mb-12">
                <div className="container mx-auto px-6">
                    <div className="flex items-center gap-4 mb-4">
                        <Link href="/cart" className="text-muted-foreground hover:text-primary transition-colors">
                            <ArrowLeft className="w-5 h-5" />
                        </Link>
                        <PageHeading className="mb-4">
                            Đặt cọc / Mua xe
                        </PageHeading>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Link href="/" className="hover:text-primary transition-colors">Trang chủ</Link>
                        <span>/</span>
                        <Link href="/cart" className="hover:text-primary transition-colors">Giỏ hàng</Link>
                        <span>/</span>
                        <ThemeText>Thanh toán</ThemeText>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-6">
                <ProgressStepper />

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2">
                        <div className="bg-card/30 border border-white/10 rounded-2xl p-8">
                            <StepContent
                                items={items}
                                total={total}
                                currentStep={currentStep}
                                goToNextStep={goToNextStep}
                                onImageClick={(images, name) => setModalState({
                                    isOpen: true,
                                    images,
                                    index: 0,
                                    name
                                })}
                            />
                        </div>
                    </div>

                    <div className="lg:col-span-1">
                        <OrderSummary />
                    </div>
                </div>
            </div>

            {/* Image Modal */}
            <ImageModal
                images={modalState.images}
                initialIndex={modalState.index}
                isOpen={modalState.isOpen}
                onClose={() => setModalState(prev => ({ ...prev, isOpen: false }))}
                productName={modalState.name}
            />
        </main>
    );
}

interface StepContentProps {
    items: any[];
    total: number;
    currentStep: number;
    goToNextStep: () => void;
    onImageClick: (images: string[], name: string) => void;
}

function StepContent({ items, total, currentStep, goToNextStep, onImageClick }: StepContentProps) {
    if (currentStep === 1) {
        return (
            <div className="space-y-6">
                <SubHeading className="mb-6">Xác Nhận Đơn Hàng</SubHeading>

                {/* Cart Items Review */}
                <div className="space-y-4">
                    {items.map((item) => (
                        <div
                            key={item.id}
                            className="bg-card border border-white/10 rounded-xl p-6 hover:border-primary/30 transition-all"
                        >
                            <div className="flex flex-col sm:flex-row gap-6">
                                {/* Gallery */}
                                <CartImageGallery
                                    images={item.gallery || [item.image]}
                                    productName={item.name}
                                    size="large"
                                    onImageClick={() => onImageClick(item.gallery || [item.image], item.name)}
                                />

                                {/* Details */}
                                <div className="flex-1">
                                    <SectionHeading>
                                        {item.name}
                                    </SectionHeading>

                                    {/* Color Badge */}
                                    {item.colorName && item.colorName !== "Mặc định" && (
                                        <div className="flex items-center gap-2 mt-2">
                                            <span className="text-sm text-muted-foreground">Màu:</span>
                                            <span className="px-3 py-1 bg-primary/20 border border-primary/30 rounded-full text-sm font-semibold text-primary">
                                                {item.colorName}
                                            </span>
                                        </div>
                                    )}

                                    <div className="mt-4 space-y-2">
                                        <div className="flex justify-between text-sm">
                                            <span className="text-muted-foreground">Đơn giá:</span>
                                            <ThemeText className="font-semibold">
                                                {item.price.toLocaleString("vi-VN")} VNĐ
                                            </ThemeText>
                                        </div>
                                        <div className="flex justify-between text-sm">
                                            <span className="text-muted-foreground">Số lượng:</span>
                                            <ThemeText className="font-semibold">
                                                {item.quantity}
                                            </ThemeText>
                                        </div>
                                        <div className="flex justify-between text-base pt-2 border-t border-white/10">
                                            <ThemeText className="font-bold">Tổng:</ThemeText>
                                            <span className="text-primary font-bold">
                                                {(item.price * item.quantity).toLocaleString("vi-VN")} VNĐ
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Total Summary with Breakdown */}
                <div className="bg-gradient-to-br from-primary/10 to-accent/10 border border-primary/30 rounded-xl p-6 space-y-3">
                    <SectionHeading className="mb-3">Chi Tiết Thanh Toán</SectionHeading>

                    {/* Original Price (if items have originalPrice) */}
                    {items.some(item => item.originalPrice) && (
                        <>
                            <div className="flex justify-between text-sm">
                                <span className="text-muted-foreground">Giá gốc:</span>
                                <span className="text-gray-500 line-through font-semibold">
                                    {items.reduce((sum, item) => {
                                        const original = item.originalPrice || item.price;
                                        return sum + original * item.quantity;
                                    }, 0).toLocaleString("vi-VN")} VNĐ
                                </span>
                            </div>

                            {/* Discount from promotions */}
                            <div className="flex justify-between text-sm">
                                <span className="text-muted-foreground">Khuyến mãi:</span>
                                <span className="text-red-500 font-bold">
                                    -{items.reduce((sum, item) => {
                                        if (item.originalPrice) {
                                            return sum + (item.originalPrice - item.price) * item.quantity;
                                        }
                                        return sum;
                                    }, 0).toLocaleString("vi-VN")} VNĐ
                                </span>
                            </div>
                        </>
                    )}


                    {/* Subtotal after discount */}
                    <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">
                            Tạm tính ({items.length} sản phẩm):
                        </span>
                        <ThemeText className="font-semibold">
                            {total.toLocaleString("vi-VN")} VNĐ
                        </ThemeText>
                    </div>

                    {/* VAT */}
                    <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">VAT (10%):</span>
                        <ThemeText className="font-semibold">
                            {(total * 0.1).toLocaleString("vi-VN")} VNĐ
                        </ThemeText>
                    </div>

                    {/* Shipping - FREE */}
                    <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Phí vận chuyển:</span>
                        <span className="text-primary font-bold">
                            MIỄN PHÍ
                        </span>
                    </div>

                    {/* Divider */}
                    <div className="border-t border-white/20 pt-3 mt-3">
                        <div className="flex justify-between items-center">
                            <div>
                                <p className="text-sm text-muted-foreground mb-1">Tổng thanh toán</p>
                                <ThemeText className="text-3xl font-bold">
                                    {(total + total * 0.1).toLocaleString("vi-VN")} VNĐ
                                </ThemeText>
                                {items.some(item => item.originalPrice) && (
                                    <p className="text-xs text-primary mt-1">
                                        Tiết kiệm: {items.reduce((sum, item) => {
                                            if (item.originalPrice) {
                                                const savings = (item.originalPrice - item.price) * item.quantity;
                                                return sum + savings + savings * 0.1;
                                            }
                                            return sum;
                                        }, 0).toLocaleString("vi-VN")} VNĐ
                                    </p>
                                )}
                            </div>
                            <ShoppingCart className="w-12 h-12 text-primary/50" />
                        </div>
                    </div>

                    {/* Legal notes */}
                    <div className="space-y-1 mt-3">
                        <p className="text-xs text-muted-foreground italic">
                            * Giá đã bao gồm VAT 10%
                        </p>
                        <p className="text-xs text-muted-foreground italic">
                            * Phí trước bạ (nếu có) thanh toán riêng khi đăng ký xe
                        </p>
                    </div>
                </div>

                <button
                    onClick={goToNextStep}
                    className="w-full bg-gradient-to-r from-primary to-accent text-black px-8 py-4 rounded-full font-bold hover:shadow-lg hover:shadow-primary/30 transition-all"
                >
                    Tiếp Tục
                </button>
            </div>
        );
    }

    if (currentStep === 2) return <PaymentMethodSelector />;
    if (currentStep === 3) return <CustomerInfoForm />;
    if (currentStep === 4) return <ShowroomSelector />;
    if (currentStep === 5) return <PaymentGatewaySelector />;

    if (currentStep === 6) {
        return (
            <div className="text-center py-12">
                <div className="inline-block p-4 rounded-full bg-primary/10 mb-4">
                    <Loader2 className="w-8 h-8 text-primary animate-spin" />
                </div>
                <SubHeading className="mb-2">Đang xử lý đơn hàng...</SubHeading>
                <p className="text-muted-foreground">Vui lòng không tắt trình duyệt</p>
            </div>
        );
    }

    if (currentStep === 7) return <OrderSuccess />;

    return null;
}
