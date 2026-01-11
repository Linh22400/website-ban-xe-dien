import { Suspense } from 'react';
import { XCircle, Home, Phone } from 'lucide-react';
import Link from 'next/link';

function PaymentFailedContent() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 pt-24">
      <div className="container max-w-2xl mx-auto px-4 py-12">
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 text-center">
          {/* Error Icon */}
          <div className="w-24 h-24 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <XCircle className="w-12 h-12 text-red-500" />
          </div>

          {/* Error Message */}
          <h1 className="text-3xl font-bold text-white mb-4">
            Thanh toán không thành công
          </h1>
          <p className="text-lg text-gray-300 mb-8">
            Rất tiếc, thanh toán của bạn không thành công. Vui lòng thử lại hoặc liên hệ với chúng tôi để được hỗ trợ.
          </p>

          {/* Possible Reasons */}
          <div className="bg-white/5 rounded-lg p-6 mb-8 text-left">
            <h2 className="text-xl font-semibold text-white mb-4">Các nguyên nhân có thể:</h2>
            <ul className="space-y-2 text-gray-300 list-disc list-inside">
              <li>Tài khoản không đủ số dư</li>
              <li>Thông tin thanh toán không chính xác</li>
              <li>Đã hủy giao dịch</li>
              <li>Lỗi kết nối mạng</li>
            </ul>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/checkout"
              className="px-6 py-3 bg-primary text-black font-semibold rounded-lg hover:bg-primary/90 transition-colors"
            >
              Thử lại
            </Link>
            <Link
              href="/contact"
              className="px-6 py-3 bg-white/10 text-white font-semibold rounded-lg hover:bg-white/20 transition-colors inline-flex items-center gap-2"
            >
              <Phone className="w-5 h-5" />
              Liên hệ hỗ trợ
            </Link>
            <Link
              href="/"
              className="px-6 py-3 bg-white/5 text-white font-semibold rounded-lg hover:bg-white/10 transition-colors inline-flex items-center gap-2"
            >
              <Home className="w-5 h-5" />
              Về trang chủ
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function PaymentFailedPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 pt-24 flex items-center justify-center">
        <div className="text-white">Đang tải...</div>
      </div>
    }>
      <PaymentFailedContent />
    </Suspense>
  );
}
