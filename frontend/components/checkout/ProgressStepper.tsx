'use client';

import { useCheckout } from '@/contexts/CheckoutContext';
import { Check } from 'lucide-react';
import { ThemeText } from '@/components/common/ThemeText';

const steps = [
    { number: 1, label: 'Chọn xe' },
    { number: 2, label: 'Hình thức' },
    { number: 3, label: 'Thông tin' },
    { number: 4, label: 'Đại lý' },
    { number: 5, label: 'Thanh toán' },
    { number: 6, label: 'Xác nhận' },
    { number: 7, label: 'Hoàn thành' },
];

export default function ProgressStepper() {
    const { currentStep } = useCheckout();

    return (
        <div className="mb-12">
            <div className="flex items-center justify-between max-w-4xl mx-auto">
                {steps.map((step, index) => (
                    <div key={step.number} className="flex-1 relative">
                        {/* Step indicator */}
                        <div className="flex flex-col items-center">
                            <div
                                className={`
                  w-12 h-12 rounded-full flex items-center justify-center font-bold text-sm
                  transition-all duration-300 z-10
                  ${currentStep > step.number
                                        ? 'bg-primary text-black shadow-[0_0_20px_rgba(0,255,148,0.5)]'
                                        : currentStep === step.number
                                            ? 'bg-transparent border-2 border-primary text-primary animate-pulse'
                                            : 'bg-white/5 border-2 border-white/10 text-muted-foreground'
                                    }
                `}
                            >
                                {currentStep > step.number ? (
                                    <Check className="w-6 h-6" />
                                ) : (
                                    step.number
                                )}
                            </div>
                            <ThemeText
                                className={`
                  mt-2 text-xs font-medium whitespace-nowrap
                  ${currentStep >= step.number
                                        ? ''
                                        : 'text-muted-foreground'
                                    }
                `}
                            >
                                {step.label}
                            </ThemeText>
                        </div>

                        {/* Connector line */}
                        {index < steps.length - 1 && (
                            <div
                                className="absolute top-6 left-1/2 w-full h-0.5 -z-10"
                                style={{
                                    background:
                                        currentStep > step.number
                                            ? 'linear-gradient(90deg, #00FF94 0%, #00D4FF 100%)'
                                            : 'rgba(255, 255, 255, 0.1)',
                                }}
                            />
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}
