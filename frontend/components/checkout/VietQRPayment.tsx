'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';

interface VietQRPaymentProps {
  orderId: string;
  amount: number;
  onPaymentConfirmed?: () => void;
}

export default function VietQRPayment({ orderId, amount, onPaymentConfirmed }: VietQRPaymentProps) {
  const [qrCodeUrl, setQrCodeUrl] = useState('');
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Thông tin ngân hàng (nên lấy từ API backend)
  const bankInfo = {
    accountNo: '0123456789', // Thay bằng số TK thật
    accountName: 'XE DIEN DUC DUY',
    bankId: '970422', // MB Bank
    bankName: 'MB Bank',
  };

  useEffect(() => {
    generateQRCode();
  }, [orderId, amount]);

  const generateQRCode = () => {
    setLoading(true);
    
    // Nội dung chuyển khoản: Mã đơn hàng
    const transferContent = `${orderId}`;
    
    // VietQR API - Miễn phí, không cần đăng ký
    // Format: https://img.vietqr.io/image/{BANK_ID}-{ACCOUNT_NO}-{TEMPLATE}.jpg?amount={AMOUNT}&addInfo={CONTENT}&accountName={ACCOUNT_NAME}
    const qrUrl = `https://img.vietqr.io/image/${bankInfo.bankId}-${bankInfo.accountNo}-compact2.jpg?amount=${amount}&addInfo=${encodeURIComponent(transferContent)}&accountName=${encodeURIComponent(bankInfo.accountName)}`;
    
    setQrCodeUrl(qrUrl);
    setLoading(false);
  };

  const copyToClipboard = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const formatCurrency = (value: number) => {
    return value.toLocaleString('vi-VN');
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('Vui lòng chọn file hình ảnh!');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('Kích thước file không được vượt quá 5MB!');
      return;
    }

    setUploading(true);

    try {
      // Upload to Cloudinary via backend
      const formData = new FormData();
      formData.append('files', file);

      const uploadResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:1337'}/api/upload`, {
        method: 'POST',
        body: formData,
      });

      if (!uploadResponse.ok) {
        throw new Error('Upload failed');
      }

      const uploadData = await uploadResponse.json();
      const imageUrl = uploadData[0].url;

      // Update order with payment proof
      const updateResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:1337'}/api/orders?filters[OrderCode][$eq]=${orderId}`, {
        method: 'GET',
      });

      const orderData = await updateResponse.json();
      const order = orderData.data[0];

      if (order) {
        await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:1337'}/api/orders/${order.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            data: {
              PaymentProof: imageUrl,
              PaymentStatus: 'pending_verification',
            },
          }),
        });
      }

      setUploadedImage(imageUrl);
      setUploadSuccess(true);
      
      // Auto call success callback after 2 seconds
      setTimeout(() => {
        if (onPaymentConfirmed) {
          onPaymentConfirmed();
        }
      }, 2000);

    } catch (error) {
      console.error('Upload error:', error);
      alert('Lỗi khi tải ảnh lên. Vui lòng thử lại!');
    } finally {
      setUploading(false);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 border-2 border-blue-200">
      <div className="text-center mb-6">
        <div className="inline-block bg-blue-100 p-3 rounded-full mb-3">
          <svg className="w-10 h-10 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
          </svg>
        </div>
        <h3 className="text-2xl font-bold text-gray-800 mb-2">
          Quét mã QR để thanh toán
        </h3>
        <p className="text-gray-600 text-sm">
          Hỗ trợ tất cả ứng dụng: MoMo, ZaloPay, Banking Apps
        </p>
      </div>

      {/* QR Code */}
      <div className="bg-white rounded-xl p-6 mb-6 shadow-lg">
        <div className="flex justify-center mb-4">
          {loading ? (
            <div className="w-64 h-64 bg-gray-100 rounded-lg animate-pulse flex items-center justify-center">
              <div className="text-gray-400">Đang tạo QR...</div>
            </div>
          ) : (
            <div className="relative">
              <Image
                src={qrCodeUrl}
                alt="VietQR Code"
                width={256}
                height={256}
                className="rounded-lg border-4 border-blue-500"
                unoptimized
              />
              <div className="absolute -bottom-2 -right-2 bg-blue-500 text-white px-3 py-1 rounded-full text-xs font-bold">
                VietQR
              </div>
            </div>
          )}
        </div>
        
        <div className="text-center">
          <p className="text-sm text-gray-600 mb-2">
            Mở app Banking/MoMo/ZaloPay → Quét QR
          </p>
          <p className="text-xs text-gray-500">
            Thông tin chuyển khoản sẽ tự động điền
          </p>
        </div>
      </div>

      {/* Thông tin chuyển khoản */}
      <div className="bg-white rounded-xl p-4 mb-4 space-y-3">
        <h4 className="font-bold text-gray-800 mb-3 flex items-center">
          <svg className="w-5 h-5 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Hoặc chuyển khoản thủ công:
        </h4>
        
        <div className="space-y-2">
          <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
            <div>
              <div className="text-xs text-gray-500">Ngân hàng</div>
              <div className="font-semibold text-gray-800">{bankInfo.bankName}</div>
            </div>
            <button
              onClick={() => copyToClipboard(bankInfo.bankName, 'bank')}
              className="px-3 py-1 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-lg text-xs font-semibold"
            >
              {copied ? '✓' : 'Copy'}
            </button>
          </div>

          <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
            <div>
              <div className="text-xs text-gray-500">Số tài khoản</div>
              <div className="font-semibold text-gray-800">{bankInfo.accountNo}</div>
            </div>
            <button
              onClick={() => copyToClipboard(bankInfo.accountNo, 'account')}
              className="px-3 py-1 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-lg text-xs font-semibold"
            >
              {copied ? '✓' : 'Copy'}
            </button>
          </div>

          <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
            <div>
              <div className="text-xs text-gray-500">Chủ tài khoản</div>
              <div className="font-semibold text-gray-800">{bankInfo.accountName}</div>
            </div>
            <button
              onClick={() => copyToClipboard(bankInfo.accountName, 'name')}
              className="px-3 py-1 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-lg text-xs font-semibold"
            >
              {copied ? '✓' : 'Copy'}
            </button>
          </div>

          <div className="flex justify-between items-center p-3 bg-yellow-50 rounded-lg border-2 border-yellow-300">
            <div>
              <div className="text-xs text-yellow-700 font-semibold">Số tiền</div>
              <div className="font-bold text-yellow-800 text-lg">{formatCurrency(amount)}đ</div>
            </div>
            <button
              onClick={() => copyToClipboard(amount.toString(), 'amount')}
              className="px-3 py-1 bg-yellow-200 hover:bg-yellow-300 text-yellow-800 rounded-lg text-xs font-semibold"
            >
              {copied ? '✓' : 'Copy'}
            </button>
          </div>

          <div className="flex justify-between items-center p-3 bg-red-50 rounded-lg border-2 border-red-300">
            <div className="flex-1">
              <div className="text-xs text-red-700 font-semibold flex items-center">
                Nội dung chuyển khoản
                <span className="ml-2 text-red-600">(BẮT BUỘC)</span>
              </div>
              <div className="font-bold text-red-800">{orderId}</div>
            </div>
            <button
              onClick={() => copyToClipboard(orderId, 'content')}
              className="px-3 py-1 bg-red-200 hover:bg-red-300 text-red-800 rounded-lg text-xs font-semibold"
            >
              {copied ? '✓' : 'Copy'}
            </button>
          </div>
        </div>
      </div>

      {/* Lưu ý quan trọng */}
      <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded mb-4">
        <div className="flex">
          <svg className="w-5 h-5 text-yellow-600 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <div className="text-sm text-yellow-800">
            <p className="font-bold mb-1">⚠️ Lưu ý quan trọng:</p>
            <ul className="list-disc list-inside space-y-1 text-xs">
              <li>Nhập <strong>ĐÚNG</strong> nội dung chuyển khoản: <strong className="text-red-600">{orderId}</strong></li>
              <li>Chuyển khoản <strong>ĐÚNG</strong> số tiền: <strong>{formatCurrency(amount)}đ</strong></li>
              <li>Sau khi chuyển khoản, chụp màn hình bill và tải lên bên dưới</li>
              <li>Đơn hàng sẽ được xử lý sau khi shop xác nhận đã nhận tiền</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Upload Bill Section */}
      <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 border-2 border-green-200">
        <div className="text-center mb-4">
          <div className="inline-block bg-green-100 p-3 rounded-full mb-2">
            <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <h4 className="font-bold text-gray-800 text-lg mb-1">
            📸 Tải lên bill chuyển khoản
          </h4>
          <p className="text-sm text-gray-600">
            Chụp màn hình bill và tải lên để shop xác nhận nhanh hơn
          </p>
        </div>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileSelect}
          className="hidden"
        />

        {!uploadedImage ? (
          <button
            onClick={triggerFileInput}
            disabled={uploading}
            className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-bold py-4 px-6 rounded-xl transition-all transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
          >
            {uploading ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                <span>Đang tải lên...</span>
              </>
            ) : (
              <>
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
                <span>Chọn ảnh bill chuyển khoản</span>
              </>
            )}
          </button>
        ) : (
          <div className="space-y-4">
            <div className="relative rounded-xl overflow-hidden border-4 border-green-500">
              <Image
                src={uploadedImage}
                alt="Payment Bill"
                width={400}
                height={300}
                className="w-full h-auto"
                unoptimized
              />
            </div>
            
            {uploadSuccess && (
              <div className="bg-green-100 border-2 border-green-500 rounded-xl p-4 text-center animate-pulse">
                <div className="flex items-center justify-center gap-2 text-green-700 font-bold">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>Đã tải lên thành công!</span>
                </div>
                <p className="text-sm text-green-600 mt-2">
                  Shop sẽ xác nhận trong vòng 5-30 phút
                </p>
              </div>
            )}

            <button
              onClick={triggerFileInput}
              className="w-full bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold py-3 px-6 rounded-xl transition-colors"
            >
              📷 Chọn ảnh khác
            </button>
          </div>
        )}

        <div className="mt-4 text-xs text-gray-600 text-center">
          <p>✓ Hỗ trợ: JPG, PNG, HEIC</p>
          <p>✓ Kích thước tối đa: 5MB</p>
        </div>
      </div>

      {/* Hướng dẫn */}
      <div className="mt-4 p-4 bg-blue-50 rounded-lg">
        <h4 className="font-bold text-blue-900 mb-2 text-sm">📱 Hướng dẫn thanh toán:</h4>
        <ol className="list-decimal list-inside space-y-1 text-xs text-blue-800">
          <li>Mở app Banking/MoMo/ZaloPay trên điện thoại</li>
          <li>Chọn chức năng <strong>"Quét mã QR"</strong></li>
          <li>Quét mã QR phía trên (thông tin tự động điền)</li>
          <li>Kiểm tra lại thông tin và xác nhận thanh toán</li>
          <li><strong className="text-red-600">Chụp màn hình bill và tải lên ngay tại trang này</strong></li>
          <li>Đợi shop xác nhận (thường 5-30 phút)</li>
        </ol>
      </div>
    </div>
  );
}
