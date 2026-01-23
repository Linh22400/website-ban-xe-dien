'use client';

import { createContext, useContext, useState, ReactNode } from 'react';
import { OrderData, Order, OrderCustomerInfo } from '@/types/order';

interface CheckoutContextType {
    // Current step in checkout flow
    currentStep: number;
    setCurrentStep: (step: number) => void;

    // Selected vehicle and configuration
    selectedVehicle: any | null;
    setSelectedVehicle: (vehicle: any) => void;

    selectedColor: string;
    setSelectedColor: (color: string) => void;

    selectedBattery: string;
    setSelectedBattery: (battery: string) => void;

    selectedGifts: string[];
    setSelectedGifts: (gifts: string[]) => void;

    discountPercent: number;
    setDiscountPercent: (discount: number) => void;

    // Payment method
    paymentMethod: 'full_payment' | 'deposit' | 'installment';
    setPaymentMethod: (method: 'full_payment' | 'deposit' | 'installment') => void;

    installmentMonths: number;
    setInstallmentMonths: (months: number) => void;

    // Customer information
    customerInfo: Partial<OrderCustomerInfo>;
    setCustomerInfo: (info: Partial<OrderCustomerInfo>) => void;

    // Shipping method
    shippingMethod: 'delivery' | 'pickup';
    setShippingMethod: (method: 'delivery' | 'pickup') => void;

    // Showroom selection
    selectedShowroom: number | null;
    setSelectedShowroom: (showroomId: number | null) => void;

    appointmentDate: Date | null;
    setAppointmentDate: (date: Date | null) => void;

    // Notes
    notes: string;
    setNotes: (notes: string) => void;

    // Payment gateway
    preferredGateway: string;
    setPreferredGateway: (gateway: string) => void;

    // Created order
    createdOrder: Order | null;
    setCreatedOrder: (order: Order | null) => void;

    // Helper functions
    goToNextStep: () => void;
    goToPreviousStep: () => void;
    resetCheckout: () => void;
    getOrderData: () => OrderData;
}

const CheckoutContext = createContext<CheckoutContextType | undefined>(undefined);

export function CheckoutProvider({ children }: { children: ReactNode }) {
    const [currentStep, setCurrentStep] = useState(1);
    const [selectedVehicle, setSelectedVehicle] = useState<any | null>(null);
    const [selectedColor, setSelectedColor] = useState('');
    const [selectedBattery, setSelectedBattery] = useState('');
    const [selectedGifts, setSelectedGifts] = useState<string[]>([]);
    const [discountPercent, setDiscountPercent] = useState(0);
    const [paymentMethod, setPaymentMethod] = useState<'full_payment' | 'deposit' | 'installment'>('deposit');
    const [installmentMonths, setInstallmentMonths] = useState(12);
    const [shippingMethod, setShippingMethod] = useState<'delivery' | 'pickup'>('delivery');
    const [customerInfo, setCustomerInfo] = useState<Partial<OrderCustomerInfo>>({});
    const [selectedShowroom, setSelectedShowroom] = useState<number | null>(null);
    const [appointmentDate, setAppointmentDate] = useState<Date | null>(null);
    const [notes, setNotes] = useState('');
    const [preferredGateway, setPreferredGateway] = useState('momo');
    const [createdOrder, setCreatedOrder] = useState<Order | null>(null);

    const goToNextStep = () => {
        setCurrentStep((prev) => Math.min(prev + 1, 4));
    };

    const goToPreviousStep = () => {
        setCurrentStep((prev) => Math.max(prev - 1, 1));
    };

    const resetCheckout = () => {
        setCurrentStep(1);
        setSelectedVehicle(null);
        setSelectedColor('');
        setSelectedBattery('');
        setSelectedGifts([]);
        setDiscountPercent(0);
        setPaymentMethod('deposit');
        setInstallmentMonths(12);
        setShippingMethod('delivery');
        setCustomerInfo({});
        setSelectedShowroom(null);
        setAppointmentDate(null);
        setNotes('');
        setPreferredGateway('momo');
        setCreatedOrder(null);
    };

    const getOrderData = (): OrderData => {
        // For cart-based checkout, get vehicle from first cart item
        // TODO: In future, support multiple items in order
        const cartItems = typeof window !== 'undefined'
            ? JSON.parse(localStorage.getItem('cart') || '[]')
            : [];
        
        // Find first vehicle in cart (preferred) or fall back to first item (legacy behavior)
        // This ensures we don't accidentally send an Accessory ID as VehicleModel
        const vehicleItem = cartItems.find((item: any) => item.type === 'vehicle') || cartItems[0];
        
        // Prepare customer info based on shipping method
        const finalCustomerInfo = { ...customerInfo };
        if (shippingMethod === 'pickup') {
            finalCustomerInfo.DeliveryAddress = 'Nhận tại cửa hàng';
            finalCustomerInfo.City = undefined;
            finalCustomerInfo.District = undefined;
            finalCustomerInfo.Ward = undefined;
        }

        const notesWithShipping = `${notes ? notes + '\n' : ''}Phương thức nhận hàng: ${shippingMethod === 'delivery' ? 'Giao hàng tận nơi' : 'Nhận tại cửa hàng'}`;

        return {
            VehicleModel: selectedVehicle?.documentId || selectedVehicle?.id || vehicleItem?.id, // Fallback to cart item
            SelectedColor: selectedColor || vehicleItem?.colorName || '',
            SelectedBattery: selectedBattery,
            SelectedGifts: selectedGifts,
            OrderItems: cartItems,
            PaymentMethod: paymentMethod,
            CustomerInfo: finalCustomerInfo as OrderCustomerInfo,
            SelectedShowroom: shippingMethod === 'pickup' ? selectedShowroom || undefined : undefined,
            AppointmentDate: appointmentDate?.toISOString(),
            Notes: notesWithShipping,
            InstallmentPlan: paymentMethod === 'installment' ? {
                months: installmentMonths,
                monthlyPayment: 0, // Will be calculated on backend
                totalInterest: 0,
            } : undefined,
            PreferredGateway: preferredGateway as any,
        };
    };

    return (
        <CheckoutContext.Provider
            value={{
                currentStep,
                setCurrentStep,
                selectedVehicle,
                setSelectedVehicle,
                selectedColor,
                setSelectedColor,
                selectedBattery,
                setSelectedBattery,
                selectedGifts,
                setSelectedGifts,
                discountPercent,
                setDiscountPercent,
                paymentMethod,
                setPaymentMethod,
                installmentMonths,
                setInstallmentMonths,
                shippingMethod,
                setShippingMethod,
                customerInfo,
                setCustomerInfo,
                selectedShowroom,
                setSelectedShowroom,
                appointmentDate,
                setAppointmentDate,
                notes,
                setNotes,
                preferredGateway,
                setPreferredGateway,
                createdOrder,
                setCreatedOrder,
                goToNextStep,
                goToPreviousStep,
                resetCheckout,
                getOrderData,
            }}
        >
            {children}
        </CheckoutContext.Provider>
    );
}

export function useCheckout() {
    const context = useContext(CheckoutContext);
    if (context === undefined) {
        throw new Error('useCheckout must be used within a CheckoutProvider');
    }
    return context;
}
