"use client";

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { CheckCircle, XCircle, Loader2 } from 'lucide-react';

export default function VNPayReturnPage() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const [status, setStatus] = useState<'processing' | 'success' | 'failed'>('processing');
    const [message, setMessage] = useState('Đang xử lý kết quả thanh toán...');

    useEffect(() => {
        // Get all VNPay response parameters
        const vnpParams: any = {};
        searchParams.forEach((value, key) => {
            vnpParams[key] = value;
        });

        const responseCode = vnpParams['vnp_ResponseCode'];
        const txnRef = vnpParams['vnp_TxnRef'];
        const orderCode = txnRef?.split('_')[0];

        // VNPay response codes
        // 00: Success
        // 07: Trừ tiền thành công. Giao dịch bị nghi ngờ (liên quan tới lừa đảo, giao dịch bất thường).
        // 09: Giao dịch không thành công do: Thẻ/Tài khoản của khách hàng chưa đăng ký dịch vụ InternetBanking tại ngân hàng.
        // 10: Giao dịch không thành công do: Khách hàng xác thực thông tin thẻ/tài khoản không đúng quá 3 lần
        // 11: Giao dịch không thành công do: Đã hết hạn chờ thanh toán. Xin quý khách vui lòng thực hiện lại giao dịch.
        // 12: Giao dịch không thành công do: Thẻ/Tài khoản của khách hàng bị khóa.
        // 13: Giao dịch không thành công do Quý khách nhập sai mật khẩu xác thực giao dịch (OTP). Xin quý khách vui lòng thực hiện lại giao dịch.
        // 24: Giao dịch không thành công do: Khách hàng hủy giao dịch
        // 51: Giao dịch không thành công do: Tài khoản của quý khách không đủ số dư để thực hiện giao dịch.
        // 65: Giao dịch không thành công do: Tài khoản của Quý khách đã vượt quá hạn mức giao dịch trong ngày.
        // 75: Ngân hàng thanh toán đang bảo trì.
        // 79: Giao dịch không thành công do: KH nhập sai mật khẩu thanh toán quá số lần quy định. Xin quý khách vui lòng thực hiện lại giao dịch
        // 99: Các lỗi khác (lỗi còn lại, không có trong danh sách mã lỗi đã liệt kê)

        if (responseCode === '00') {
            setStatus('success');
            setMessage('Thanh toán thành công!');
            // Redirect to success page after 2 seconds
            setTimeout(() => {
                router.push(`/order/success?orderId=${orderCode}`);
            }, 2000);
        } else {
            setStatus('failed');
            const errorMessages: { [key: string]: string } = {
                '07': 'Giao dịch bị nghi ngờ. Vui lòng liên hệ ngân hàng.',
                '09': 'Thẻ/Tài khoản chưa đăng ký dịch vụ Internet Banking.',
                '10': 'Xác thực thông tin không đúng quá 3 lần.',
                '11': 'Hết hạn chờ thanh toán.',
                '12': 'Thẻ/Tài khoản bị khóa.',
                '13': 'Nhập sai mật khẩu OTP.',
                '24': 'Khách hàng hủy giao dịch.',
                '51': 'Tài khoản không đủ số dư.',
                '65': 'Vượt quá hạn mức giao dịch trong ngày.',
                '75': 'Ngân hàng đang bảo trì.',
                '79': 'Nhập sai mật khẩu quá số lần quy định.',
                '99': 'Có lỗi xảy ra trong quá trình xử lý.',
            };
            setMessage(errorMessages[responseCode] || 'Thanh toán không thành công.');
            // Redirect to failed page after 3 seconds
            setTimeout(() => {
                router.push(`/checkout/payment-failed?orderId=${orderCode}&code=${responseCode}`);
            }, 3000);
        }
    }, [searchParams, router]);

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 flex items-center justify-center p-4">
            <div className="max-w-md w-full bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8 text-center">
                {status === 'processing' && (
                    <>
                        <Loader2 className="w-16 h-16 text-primary mx-auto mb-4 animate-spin" />
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                            Đang xử lý...
                        </h1>
                        <p className="text-gray-600 dark:text-gray-400">{message}</p>
                    </>
                )}

                {status === 'success' && (
                    <>
                        <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                            Thành công!
                        </h1>
                        <p className="text-gray-600 dark:text-gray-400">{message}</p>
                        <p className="text-sm text-gray-500 dark:text-gray-500 mt-4">
                            Đang chuyển hướng...
                        </p>
                    </>
                )}

                {status === 'failed' && (
                    <>
                        <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                            Thanh toán thất bại
                        </h1>
                        <p className="text-gray-600 dark:text-gray-400">{message}</p>
                        <p className="text-sm text-gray-500 dark:text-gray-500 mt-4">
                            Đang chuyển hướng...
                        </p>
                    </>
                )}
            </div>
        </div>
    );
}
