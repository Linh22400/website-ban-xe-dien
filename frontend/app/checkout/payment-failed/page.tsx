"use client";

import { useRouter } from 'next/navigation';
import { XCircle } from 'lucide-react';

export default function PaymentFailedPage() {
    const router = useRouter();

    return (
        <div className="min-h-screen bg-background flex items-center justify-center p-4">
            <div className="max-w-md w-full bg-card border border-border rounded-2xl p-8 text-center shadow-lg">
                <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
                    <XCircle className="w-10 h-10 text-red-500" />
                </div>
                <h1 className="text-2xl font-bold mb-2 text-red-500">Thanh toán bị hủy</h1>
                <p className="text-muted-foreground mb-6">Bạn đã hủy giao dịch hoặc có lỗi xảy ra trong quá trình thanh toán.</p>
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
            </div>
        </div>
    );
}
