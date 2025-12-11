'use client';

import { useState, useEffect } from 'react';
import { sendOtp, verifyOtp, getUserOrders } from '@/lib/order-api';
import { Order } from '@/types/order';
import { Loader2, Send, Lock, Phone, LogOut } from 'lucide-react';
import OrderList from '@/components/account/OrderList';
import { SectionHeading, ThemeText, ThemeInput } from '@/components/common/ThemeText';

export default function OtpLoginForm() {
    const [step, setStep] = useState<'phone' | 'otp' | 'orders'>('phone');
    const [phone, setPhone] = useState('');
    const [otp, setOtp] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [orders, setOrders] = useState<Order[]>([]);
    const [user, setUser] = useState<any>(null);

    // Check for existing session
    useEffect(() => {
        const token = localStorage.getItem('authToken');
        const savedUser = localStorage.getItem('user');
        if (token && savedUser) {
            setUser(JSON.parse(savedUser));
            fetchOrders(token);
        }
    }, []);

    const fetchOrders = async (token: string) => {
        setIsLoading(true);
        try {
            const data = await getUserOrders(token);
            // Sort by newest
            setOrders(data.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
            setStep('orders');
        } catch (err) {
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSendOtp = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            const success = await sendOtp(phone);
            if (success) {
                setStep('otp');
            } else {
                setError('Không thể gửi OTP. Vui lòng kiểm tra lại số điện thoại.');
            }
        } catch (err) {
            setError('Có lỗi xảy ra. Vui lòng thử lại.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleVerifyOtp = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            const result = await verifyOtp(phone, otp);
            if (result) {
                localStorage.setItem('authToken', result.token);
                localStorage.setItem('user', JSON.stringify(result.user));
                setUser(result.user);
                await fetchOrders(result.token);
            } else {
                setError('Mã OTP không chính xác.');
            }
        } catch (err) {
            setError('Có lỗi xảy ra. Vui lòng thử lại.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('authToken');
        localStorage.removeItem('user');
        setUser(null);
        setOrders([]);
        setStep('phone');
        setPhone('');
        setOtp('');
    };

    if (step === 'orders') {
        return (
            <div className="space-y-6">
                <div className="flex items-center justify-between bg-white/5 p-4 rounded-xl border border-white/10">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">
                            {user?.name?.[0] || 'U'}
                        </div>
                        <div>
                            <ThemeText className="font-medium">{user?.name || 'Khách hàng'}</ThemeText>
                            <p className="text-sm text-muted-foreground">{user?.phone || phone}</p>
                        </div>
                    </div>
                    <button
                        onClick={handleLogout}
                        className="p-2 hover:bg-white/10 rounded-lg transition-colors text-muted-foreground hover:text-white"
                        title="Đăng xuất"
                    >
                        <LogOut className="w-5 h-5" />
                    </button>
                </div>

                <SectionHeading>Lịch sử đơn hàng ({orders.length})</SectionHeading>
                <OrderList orders={orders} isLoading={isLoading} />
            </div>
        );
    }

    return (
        <div className="bg-card/30 border border-white/10 rounded-2xl p-8 backdrop-blur-sm max-w-xl mx-auto">
            <SectionHeading className="mb-6 text-center">
                {step === 'phone' ? 'Đăng nhập bằng SĐT' : 'Nhập mã xác thực'}
            </SectionHeading>

            {step === 'phone' ? (
                <form onSubmit={handleSendOtp} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-muted-foreground mb-1">
                            Số điện thoại
                        </label>
                        <div className="relative">
                            <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                            <ThemeInput
                                type="tel"
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                                placeholder="Nhập số điện thoại của bạn"
                                className="w-full bg-white/5 border rounded-lg pl-10 pr-4 py-3 placeholder:text-gray-500 focus:outline-none focus:border-primary transition-colors"
                                required
                            />
                        </div>
                    </div>

                    {error && (
                        <div className="text-red-500 text-sm text-center bg-red-500/10 p-2 rounded">
                            {error}
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full bg-primary text-black font-bold py-3 rounded-lg hover:bg-primary-dark transition-all hover:shadow-glow flex items-center justify-center gap-2"
                    >
                        {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
                        Gửi mã OTP
                    </button>
                </form>
            ) : (
                <form onSubmit={handleVerifyOtp} className="space-y-4">
                    <div className="text-center mb-4">
                        <p className="text-muted-foreground text-sm">
                            Mã OTP đã được gửi đến số <ThemeText className="font-bold">{phone}</ThemeText>
                        </p>
                        <button
                            type="button"
                            onClick={() => setStep('phone')}
                            className="text-primary text-xs hover:underline mt-1"
                        >
                            Thay đổi số điện thoại
                        </button>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-muted-foreground mb-1">
                            Mã OTP (Nhập 123456)
                        </label>
                        <div className="relative">
                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                            <ThemeInput
                                type="text"
                                value={otp}
                                onChange={(e) => setOtp(e.target.value)}
                                placeholder="Nhập mã 6 số"
                                className="w-full bg-white/5 border rounded-lg pl-10 pr-4 py-3 placeholder:text-gray-500 focus:outline-none focus:border-primary transition-colors tracking-widest text-center font-bold text-lg"
                                required
                                maxLength={6}
                            />
                        </div>
                    </div>

                    {error && (
                        <div className="text-red-500 text-sm text-center bg-red-500/10 p-2 rounded">
                            {error}
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full bg-primary text-black font-bold py-3 rounded-lg hover:bg-primary-dark transition-all hover:shadow-glow flex items-center justify-center gap-2"
                    >
                        {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Xác thực & Đăng nhập'}
                    </button>
                </form>
            )}
        </div>
    );
}
