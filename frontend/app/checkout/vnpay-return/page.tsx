"use client";

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { CheckCircle, XCircle, Loader2 } from 'lucide-react';

export default function VNPayReturnPage() {
    const searchParams = useSearchParams();
    const router = useRouter();

    useEffect(() => {
        // Forward the entire query string to the backend for verification & processing
        // This ensures:
        // 1. Signature check (Security)
        // 2. Database update (Order Status)
        // 3. Avoids Frontend ChunkLoadError by performing a hard redirect chain
        if (searchParams.toString()) {
            const backendUrl = process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337';
            window.location.href = `${backendUrl}/api/payment/vnpay/return?${searchParams.toString()}`;
        }
    }, [searchParams]);

    return (
        <div className="min-h-screen bg-white dark:bg-gray-900 flex items-center justify-center">
            <div className="text-center">
                <Loader2 className="w-12 h-12 text-primary mx-auto mb-4 animate-spin" />
                <p className="text-lg text-gray-600 dark:text-gray-300">Đang xác thực giao dịch...</p>
            </div>
        </div>
    );
}
