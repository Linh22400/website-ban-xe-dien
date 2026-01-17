'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { trackOrder } from '@/lib/order-api';
import { Order } from '@/types/order';
import { Search, Loader2 } from 'lucide-react';
import OrderItem from '@/components/account/OrderItem';
import { SectionHeading, ThemeInput } from '@/components/common/ThemeText';

export default function TrackingForm() {
    const searchParams = useSearchParams();
    const [orderCode, setOrderCode] = useState('');
    const [phone, setPhone] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [foundOrder, setFoundOrder] = useState<Order | null>(null);

    // Auto-fill and submit if URL params exist or fallback to localStorage
    useEffect(() => {
        const codeParam = searchParams?.get('code');
        const phoneParam = searchParams?.get('phone');

        let targetPhone = phoneParam;

        if (codeParam) {
            setOrderCode(codeParam);
            
            // Fallback: Check localStorage if phoneParam is missing
            if (!targetPhone) {
                const savedPhone = localStorage.getItem(`lastOrderPhone_${codeParam}`);
                if (savedPhone) {
                    targetPhone = savedPhone;
                    setPhone(savedPhone);
                }
            }
        }
        
        if (phoneParam) setPhone(phoneParam);

        if (codeParam && targetPhone) {
            // Auto-submit after a short delay
            setTimeout(() => {
                handleTrack(codeParam, targetPhone!);
            }, 500);
        }
    }, [searchParams]);

    const handleTrack = async (code: string, phoneNumber: string) => {
        setError('');
        setFoundOrder(null);
        setIsLoading(true);

        try {
            const order = await trackOrder(code, phoneNumber);
            if (order) {
                setFoundOrder(order);
            } else {
                setError('Không tìm thấy đơn hàng hoặc thông tin không chính xác.');
            }
        } catch (err: any) {
            setError(err.message || 'Có lỗi xảy ra, vui lòng thử lại sau.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        handleTrack(orderCode, phone);
    };

    return (
        <div className="space-y-8">
            <div className="bg-card/80 border border-white/10 rounded-2xl p-8 max-w-xl mx-auto">
                <SectionHeading className="mb-6 text-center">Tra cứu đơn hàng</SectionHeading>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-muted-foreground mb-1">
                            Mã đơn hàng
                        </label>
                        <ThemeInput
                            type="text"
                            value={orderCode}
                            onChange={(e) => setOrderCode(e.target.value.toUpperCase())}
                            placeholder="VD: DH123456"
                            className="w-full bg-white/5 border rounded-lg px-4 py-3 placeholder:text-gray-500 focus:outline-none focus:border-primary transition-colors"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-muted-foreground mb-1">
                            Số điện thoại đặt hàng
                        </label>
                        <ThemeInput
                            type="tel"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            placeholder="Nhập số điện thoại"
                            className="w-full bg-white/5 border rounded-lg px-4 py-3 placeholder:text-gray-500 focus:outline-none focus:border-primary transition-colors"
                            required
                        />
                    </div>

                    {error && (
                        <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-500 text-sm text-center">
                            {error}
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full bg-primary text-black font-bold py-3 rounded-lg hover:bg-primary-dark transition-colors hover:shadow-glow flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isLoading ? (
                            <Loader2 className="w-5 h-5 animate-spin" />
                        ) : (
                            <Search className="w-5 h-5" />
                        )}
                        Tra cứu ngay
                    </button>
                </form>
            </div>

            {foundOrder && (
                <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <SectionHeading className="mb-4">Kết quả tra cứu</SectionHeading>
                    <OrderItem order={foundOrder} />
                </div>
            )}
        </div>
    );
}
