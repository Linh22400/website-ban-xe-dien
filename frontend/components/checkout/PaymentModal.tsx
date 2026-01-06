'use client';

import { useState, useEffect, useRef } from 'react';
import { Loader2, CheckCircle2, AlertCircle, X } from 'lucide-react';
import QRCodeDisplay from './QRCodeDisplay';
import { createPaymentForOrder, checkPaymentStatus, mockConfirmPayment } from '@/lib/order-api';
import { formatCurrency } from '@/lib/utils';

interface PaymentModalProps {
    isOpen: boolean;
    onClose: () => void;
    orderCode: string;
    phone: string;
    amount: number;
    onSuccess: () => void;
}

export default function PaymentModal({ isOpen, onClose, orderCode, phone, amount, onSuccess }: PaymentModalProps) {
    const [status, setStatus] = useState<'loading' | 'pending' | 'paid' | 'error'>('loading');
    const [paymentData, setPaymentData] = useState<any>(null);
    const [error, setError] = useState('');
    const initializingRef = useRef(false);
    const initializedRef = useRef(false);

    // Create payment on mount - ONLY ONCE
    useEffect(() => {
        if (isOpen && orderCode && phone && !initializedRef.current && !initializingRef.current) {
            initializePayment();
        }
    }, [isOpen, orderCode, phone]);

    // Poll status
    useEffect(() => {
        let interval: NodeJS.Timeout;

        if (status === 'pending' && paymentData?.id) {
            interval = setInterval(async () => {
                try {
                    const result = await checkPaymentStatus(paymentData.id, orderCode, phone);
                    if (result.data.status === 'PAID') {
                        setStatus('paid');
                        setTimeout(() => {
                            onSuccess();
                        }, 2000); // Wait 2s to show success state
                    }
                } catch (err) {
                    console.error('Polling error:', err);
                }
            }, 3000);
        }

        return () => clearInterval(interval);
    }, [status, paymentData]);

    const initializePayment = async () => {
        if (initializingRef.current || initializedRef.current) {
            console.log('Already initializing or initialized, skipping...');
            return;
        }
        
        try {
            initializingRef.current = true;
            setStatus('loading');
            setError('');
            const result = await createPaymentForOrder(orderCode, phone);
            console.log('Payment result:', result);
            console.log('QR URL:', result.data?.qrUrl);
            
            if (result.error) {
                setStatus('error');
                setError(result.error.message || 'Không thể tạo thanh toán. Vui lòng thử lại.');
            } else {
                setPaymentData(result.data);
                setStatus('pending');
                initializedRef.current = true;
            }
        } catch (err) {
            console.error('Payment error:', err);
            setStatus('error');
            setError('Không thể tạo thanh toán. Vui lòng thử lại.');
        } finally {
            initializingRef.current = false;
        }
    };

    const handleMockConfirm = async () => {
        if (!paymentData?.id) return;
        try {
            await mockConfirmPayment(paymentData.id, orderCode, phone);
            // Polling will catch the update
        } catch (err) {
            console.error(err);
        }
    };

    const handleRetry = () => {
        // Reset refs để cho phép retry
        initializedRef.current = false;
        initializingRef.current = false;
        initializePayment();
    };

    const canUseMockConfirm = process.env.NODE_ENV !== 'production';

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4">
            <div className="relative w-full max-w-md bg-card border border-border rounded-xl shadow-2xl overflow-hidden">
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b border-border">
                    <h2 className="text-xl font-bold text-foreground">Thanh toán đơn hàng</h2>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-white/10 rounded-full transition-colors"
                    >
                        <X className="w-5 h-5 text-muted-foreground" />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6 flex flex-col items-center justify-center space-y-6 min-h-[300px]">
                    {status === 'loading' && (
                        <div className="flex flex-col items-center gap-4">
                            <Loader2 className="w-12 h-12 animate-spin text-primary" />
                            <p className="text-muted-foreground">Đang tạo mã QR...</p>
                        </div>
                    )}

                    {status === 'error' && (
                        <div className="flex flex-col items-center gap-4 text-center">
                            <AlertCircle className="w-12 h-12 text-red-500" />
                            <p className="text-red-400">{error}</p>
                            <button
                                onClick={handleRetry}
                                className="px-4 py-2 bg-muted hover:bg-muted/80 rounded-lg text-foreground transition-colors"
                            >
                                Thử lại
                            </button>
                        </div>
                    )}

                    {status === 'pending' && paymentData && (
                        <>
                            <div className="text-center space-y-2">
                                <p className="text-sm text-muted-foreground">Quét mã QR để thanh toán</p>
                                <p className="text-2xl font-bold text-primary">
                                    {formatCurrency(amount)}
                                </p>
                            </div>

                            {/* Debug info */}
                            {process.env.NODE_ENV !== 'production' && (
                                <div className="text-xs text-yellow-500 bg-yellow-500/10 p-2 rounded max-w-full overflow-auto">
                                    QR URL: {paymentData.qrUrl || 'EMPTY'}
                                </div>
                            )}

                            <QRCodeDisplay value={paymentData.qrUrl || ''} size={240} />

                            <div className="text-center text-sm text-muted-foreground animate-pulse">
                                Đang chờ xác nhận thanh toán...
                            </div>

                            {/* Mock Button for Dev */}
                            {canUseMockConfirm && paymentData.provider === 'mock' && (
                                <button
                                    onClick={handleMockConfirm}
                                    className="w-full py-3 px-4 bg-yellow-500/10 text-yellow-500 hover:bg-yellow-500/20 border border-yellow-500/50 rounded-lg transition-colors mt-4 font-medium"
                                >
                                    [DEV] Giả lập thanh toán thành công
                                </button>
                            )}
                        </>
                    )}

                    {status === 'paid' && (
                        <div className="flex flex-col items-center gap-4 animate-in fade-in zoom-in duration-300">
                            <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center">
                                <CheckCircle2 className="w-10 h-10 text-green-500" />
                            </div>
                            <div className="text-center">
                                <p className="text-2xl font-bold text-green-500 mb-2">Thanh toán thành công!</p>
                                <p className="text-sm text-muted-foreground">Đang chuyển hướng...</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
