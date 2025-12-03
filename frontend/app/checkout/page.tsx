'use client';

import { CheckoutProvider, useCheckout } from '@/contexts/CheckoutContext';
import ProgressStepper from '@/components/checkout/ProgressStepper';
import OrderSummary from '@/components/checkout/OrderSummary';
import PaymentMethodSelector from '@/components/checkout/PaymentMethodSelector';
import CustomerInfoForm from '@/components/checkout/CustomerInfoForm';
import ShowroomSelector from '@/components/checkout/ShowroomSelector';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { getCarById } from '@/lib/api';

export default function CheckoutPage() {
    return (
        <CheckoutProvider>
            <CheckoutContent />
        </CheckoutProvider>
    );
}

function CheckoutContent() {
    const { setSelectedVehicle, selectedVehicle, setSelectedColor, setDiscountPercent } = useCheckout();
    const searchParams = useSearchParams();
    const vehicleId = searchParams?.get('vehicle');
    const colorParam = searchParams?.get('color');
    const discountParam = searchParams?.get('discount');

    useEffect(() => {
        if (vehicleId) {
            async function fetchVehicle() {
                try {
                    console.log('Loading vehicle ID:', vehicleId);
                    const car = await getCarById(parseInt(vehicleId!));
                    console.log('Found car:', car);
                    if (car) {
                        setSelectedVehicle(car);
                        // Set selected color from URL if available
                        if (colorParam) {
                            setSelectedColor(colorParam);
                        }
                        // Set discount from URL if available
                        if (discountParam) {
                            setDiscountPercent(parseFloat(discountParam));
                        }
                    }
                } catch (error) {
                    console.error('Error loading vehicle:', error);
                }
            }
            fetchVehicle();
        }
    }, [vehicleId, colorParam, discountParam, setSelectedVehicle, setSelectedColor, setDiscountPercent]);

    return (
        <main className="min-h-screen bg-background pt-24 pb-20">
            <div className="bg-secondary/30 border-b border-white/5 py-8 mb-12">
                <div className="container mx-auto px-6">
                    <div className="flex items-center gap-4 mb-4">
                        <Link href="/cars" className="text-muted-foreground hover:text-primary transition-colors">
                            <ArrowLeft className="w-5 h-5" />
                        </Link>
                        <h1 className="text-3xl md:text-4xl font-bold text-white">
                            Đặt cọc / Mua xe
                        </h1>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Link href="/" className="hover:text-primary transition-colors">Trang chủ</Link>
                        <span>/</span>
                        <Link href="/cars" className="hover:text-primary transition-colors">Sản phẩm</Link>
                        <span>/</span>
                        <span className="text-white">Thanh toán</span>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-6">
                <ProgressStepper />

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2">
                        <div className="bg-card/30 border border-white/10 rounded-2xl p-8 backdrop-blur-sm">
                            {!selectedVehicle ? (
                                <div className="text-center py-12">
                                    <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mb-4"></div>
                                    <p className="text-muted-foreground">Đang tải thông tin xe...</p>
                                </div>
                            ) : (
                                <StepContent />
                            )}
                        </div>
                    </div>

                    <div className="lg:col-span-1">
                        <OrderSummary />
                    </div>
                </div>
            </div>
        </main>
    );
}

import PaymentGatewaySelector from '@/components/checkout/PaymentGatewaySelector';
import OrderSuccess from '@/components/checkout/OrderSuccess';
import { Loader2 } from 'lucide-react';

// ... (existing imports)

// ... (CheckoutPage and CheckoutContent components remain same)

function StepContent() {
    const { currentStep, selectedVehicle, goToNextStep } = useCheckout();
    const searchParams = useSearchParams();
    const colorParam = searchParams.get('color');

    if (!selectedVehicle) return null;

    if (currentStep === 1) {
        // ... (existing Step 1 code)
        // Determine which image to show based on selected color
        const selectedColorData = colorParam
            ? selectedVehicle.colors?.find((c: any) => c.name === colorParam)
            : null;

        const displayImage = selectedColorData?.image || selectedVehicle.thumbnail;

        return (
            <div className="text-center py-8">
                <h2 className="text-2xl font-bold text-white mb-4">Xe đã chọn</h2>
                <div className="bg-white/5 border border-white/10 rounded-xl p-6 max-w-md mx-auto mb-8">
                    {displayImage && (
                        <img
                            src={displayImage}
                            alt={selectedVehicle.name}
                            className="w-full h-40 object-contain rounded-lg mb-4"
                        />
                    )}
                    <h3 className="text-xl font-bold text-white">{selectedVehicle.name}</h3>
                    {selectedColorData && (
                        <p className="text-sm text-muted-foreground mt-1">Màu: {selectedColorData.name}</p>
                    )}
                    <p className="text-2xl font-bold text-primary mt-2">
                        {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(selectedVehicle.price)}
                    </p>
                </div>
                <button
                    onClick={goToNextStep}
                    className="bg-primary text-black px-8 py-4 rounded-full font-bold hover:bg-primary-dark transition-all hover:shadow-glow"
                >
                    Tiếp tục
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
                <h2 className="text-2xl font-bold text-white mb-2">Đang xử lý đơn hàng...</h2>
                <p className="text-muted-foreground">Vui lòng không tắt trình duyệt</p>
            </div>
        );
    }

    if (currentStep === 7) return <OrderSuccess />;

    return null;
}
