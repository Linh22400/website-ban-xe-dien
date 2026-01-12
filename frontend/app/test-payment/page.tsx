'use client';

import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';

export default function TestPaymentPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [bookmarkletCode, setBookmarkletCode] = useState('');
  
  const orderId = searchParams.get('orderId') || 'DH432079672';
  const amount = searchParams.get('amount') || '20350000';

  useEffect(() => {
    const code = `javascript:(function(){var btn=document.createElement('button');btn.innerHTML='✅ XÁC NHẬN THANH TOÁN (TEST)';btn.style.cssText='position:fixed;top:20px;right:20px;z-index:99999;background:linear-gradient(135deg,#10b981,#059669);color:white;font-size:18px;font-weight:bold;padding:20px 30px;border:none;border-radius:12px;cursor:pointer;box-shadow:0 10px 30px rgba(16,185,129,0.4);animation:pulse 2s infinite;';btn.onclick=function(){var url=window.location.href;var params=new URLSearchParams(url.split('?')[1]);var orderId=params.get('orderId')||'${orderId}';var amount=params.get('amount')||'${amount}';window.location.href='https://www.xedienducduy.id.vn/test-payment?orderId='+orderId+'&amount='+amount+'&auto=success';};document.body.appendChild(btn);var style=document.createElement('style');style.innerHTML='@keyframes pulse{0%,100%{transform:scale(1)}50%{transform:scale(1.05)}}';document.head.appendChild(style);})();`;
    setBookmarkletCode(code);
  }, [orderId, amount]);

  const hmacSHA256 = async (message: string, secret: string): Promise<string> => {
    const encoder = new TextEncoder();
    const keyData = encoder.encode(secret);
    const messageData = encoder.encode(message);
    
    const key = await crypto.subtle.importKey(
      'raw',
      keyData,
      { name: 'HMAC', hash: 'SHA-256' },
      false,
      ['sign']
    );
    
    const signature = await crypto.subtle.sign('HMAC', key, messageData);
    const hashArray = Array.from(new Uint8Array(signature));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  };

  const simulatePayment = async (success: boolean) => {
    setLoading(true);
    
    const backendUrl = process.env.NEXT_PUBLIC_API_URL || 'https://website-ban-xe-dien.onrender.com';
    const accessKey = 'F8BBA842ECF85';
    const secretKey = 'K951B6PE1waDMi640xX08PD3vg6EkVlz';
    
    const partnerCode = 'MOMO';
    const requestId = `${orderId}_${Date.now()}`;
    const orderInfo = `Thanh toan don hang ${orderId}`;
    const orderType = 'momo_wallet';
    const transId = Date.now().toString();
    const resultCode = success ? '0' : '1004';
    const message = success ? 'Successful.' : 'Transaction failed.';
    const payType = 'qr';
    const responseTime = Date.now().toString();
    const extraData = '';

    const rawSignature = `accessKey=${accessKey}&amount=${amount}&extraData=${extraData}&message=${message}&orderId=${orderId}&orderInfo=${orderInfo}&orderType=${orderType}&partnerCode=${partnerCode}&payType=${payType}&requestId=${requestId}&responseTime=${responseTime}&resultCode=${resultCode}&transId=${transId}`;
    
    const signature = await hmacSHA256(rawSignature, secretKey);

    const params = new URLSearchParams({
      partnerCode,
      orderId,
      requestId,
      amount,
      orderInfo,
      orderType,
      transId,
      resultCode,
      message,
      payType,
      responseTime,
      extraData,
      signature,
    });

    window.location.href = `${backendUrl}/api/payment/momo/return?${params.toString()}`;
  };

  useEffect(() => {
    const auto = searchParams.get('auto');
    if (auto === 'success') {
      simulatePayment(true);
    } else if (auto === 'failed') {
      simulatePayment(false);
    }
  }, [searchParams]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-500 to-purple-600 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full">
        <div className="text-center mb-8">
          <div className="inline-block bg-pink-100 p-4 rounded-full mb-4">
            <svg className="w-16 h-16 text-pink-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            🧪 Test Thanh Toán MoMo
          </h1>
          <p className="text-gray-600">
            Simulate callback từ MoMo nhanh chóng
          </p>
        </div>

        <div className="bg-gray-50 rounded-lg p-4 mb-6 space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Mã đơn hàng:</span>
            <span className="font-semibold text-gray-800">{orderId}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Số tiền:</span>
            <span className="font-semibold text-gray-800">
              {parseInt(amount).toLocaleString('vi-VN')}đ
            </span>
          </div>
        </div>

        <div className="mb-6 p-5 bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-xl">
          <div className="flex items-start space-x-3">
            <div className="bg-blue-500 text-white p-2 rounded-lg flex-shrink-0">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-gray-800 mb-2">🚀 Cách sử dụng nhanh:</h3>
              <ol className="text-sm text-gray-700 space-y-1 mb-3">
                <li><strong>Bước 1:</strong> Kéo nút màu xanh bên dưới vào thanh Bookmarks</li>
                <li><strong>Bước 2:</strong> Khi ở trang MoMo, click bookmark đó</li>
                <li><strong>Bước 3:</strong> Nút xác nhận sẽ xuất hiện góc phải màn hình!</li>
              </ol>
              <a
                href={bookmarkletCode}
                className="inline-block bg-gradient-to-r from-blue-500 to-blue-600 text-white font-bold py-3 px-6 rounded-lg hover:from-blue-600 hover:to-blue-700 transform hover:scale-105 transition-all duration-200 shadow-lg cursor-move"
                onClick={(e) => {
                  e.preventDefault();
                  alert('Kéo nút này vào thanh Bookmarks (không click)!\n\nCách làm:\n1. Hiển thị thanh Bookmarks: Ctrl+Shift+B (Chrome)\n2. Kéo nút này lên thanh Bookmarks\n3. Vào trang MoMo và click bookmark');
                }}
              >
                ⚡ XÁC NHẬN MoMo NHANH
              </a>
              <p className="text-xs text-gray-600 mt-2">
                💡 Kéo nút này lên thanh Bookmarks để sử dụng
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <button
            onClick={() => simulatePayment(true)}
            disabled={loading}
            className="w-full bg-gradient-to-r from-green-500 to-green-600 text-white font-semibold py-4 px-6 rounded-xl hover:from-green-600 hover:to-green-700 transform hover:scale-[1.02] transition-all duration-200 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <span>✅ Thanh Toán Thành Công</span>
          </button>

          <button
            onClick={() => simulatePayment(false)}
            disabled={loading}
            className="w-full bg-gradient-to-r from-red-500 to-red-600 text-white font-semibold py-4 px-6 rounded-xl hover:from-red-600 hover:to-red-700 transform hover:scale-[1.02] transition-all duration-200 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
            <span>❌ Thanh Toán Thất Bại</span>
          </button>

          <button
            onClick={() => router.push('/checkout')}
            className="w-full bg-gray-200 text-gray-700 font-semibold py-3 px-6 rounded-xl hover:bg-gray-300 transition-all duration-200"
          >
            ← Quay lại Checkout
          </button>
        </div>

        {loading && (
          <div className="mt-4 text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-pink-500 border-t-transparent"></div>
            <p className="text-gray-600 mt-2">Đang xử lý...</p>
          </div>
        )}

        <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <p className="text-xs text-yellow-800">
            ⚠️ <strong>Chỉ dùng cho testing!</strong> Trang này simulate callback từ MoMo với signature hợp lệ.
          </p>
        </div>
      </div>
    </div>
  );
}
