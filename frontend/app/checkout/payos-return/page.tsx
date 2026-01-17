"use client";

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { CheckCircle, XCircle, Loader2 } from 'lucide-react';

function PayOSReturnContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const [status, setStatus] = useState<'loading' | 'success' | 'failed'>('loading');

    useEffect(() => {
        const code = searchParams.get('code');
        const cancel = searchParams.get('cancel');
        const statusParam = searchParams.get('status');
        const orderCode = searchParams.get('orderCode');

        if (cancel === 'true' || statusParam === 'CANCELLED') {
            setStatus('failed');
            return;
        }

        if (code === '00' || statusParam === 'PAID') {
            setStatus('success');
            // Resolve real order code from backend
            const resolveOrderCode = async () => {
                try {
                    const apiUrl = process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337';
                    const res = await fetch(`${apiUrl}/api/payment/payos/resolve/${orderCode}`);
                    if (res.ok) {
                        const data = await res.json();
                        if (data.data && data.data.orderCode) {
                            return data.data.orderCode;
                        }
                    }
                } catch (err) {
                    console.error('Failed to resolve order code', err);
                }
                return orderCode; // Fallback to numeric code
            };

            resolveOrderCode().then((finalCode) => {
                 setTimeout(() => {
                    router.push(`/order/success?orderCode=${finalCode}`);
                }, 3000);
            });
        } else {
            // Unknown status, maybe pending
             setStatus('failed');
        }
    }, [searchParams, router]);

    return (
        <div className="min-h-screen bg-background flex items-center justify-center p-4">
            <div className="max-w-md w-full bg-card border border-border rounded-2xl p-8 text-center shadow-lg">
                {status === 'loading' && (
                    <>
                        <Loader2 className="w-16 h-16 text-primary mx-auto mb-6 animate-spin" />
                        <h1 className="text-2xl font-bold mb-2">Đang xử lý...</h1>
                        <p className="text-muted-foreground">Vui lòng đợi trong giây lát để chúng tôi xác nhận giao dịch.</p>
                    </>
                )}

                {status === 'success' && (
                    <>
                        <div className="w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
                            <CheckCircle className="w-10 h-10 text-green-500" />
                        </div>
                        <h1 className="text-2xl font-bold mb-2 text-green-500">Thanh toán thành công!</h1>
                        <p className="text-muted-foreground mb-6">Cảm ơn bạn đã mua hàng. Đang chuyển hướng...</p>
                        <button 
                            onClick={() => router.push('/order/success')}
                            className="w-full bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2 inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors"
                        >
                            Chi tiết đơn hàng
                        </button>
                    </>
                )}

                {status === 'failed' && (
                    <>
                        <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
                            <XCircle className="w-10 h-10 text-red-500" />
                        </div>
                        <h1 className="text-2xl font-bold mb-2 text-red-500">Thanh toán thất bại</h1>
                        <p className="text-muted-foreground mb-6">Giao dịch đã bị hủy hoặc xảy ra lỗi.</p>
                        <div className="space-y-3">
                            <button 
                                onClick={() => router.push('/checkout')}
                                className="w-full bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2 inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors"
                            >
                                Thử lại
                            </button>
                            <button 
                                onClick={() => router.push('/')}
                                className="w-full border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2 inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors"
                            >
                                Về trang chủ
                            </button>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}

export default function PayOSReturnPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen bg-background flex items-center justify-center p-4">
                <Loader2 className="w-16 h-16 text-primary mx-auto animate-spin" />
            </div>
        }>
            <PayOSReturnContent />
        </Suspense>
    );
}