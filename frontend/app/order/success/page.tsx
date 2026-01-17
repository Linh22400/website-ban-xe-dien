import { Suspense } from 'react';
import { CheckCircle, Package, Truck } from 'lucide-react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

function OrderSuccessContent() {
  const searchParams = useSearchParams();
  const orderCode = searchParams.get('orderCode') || searchParams.get('orderId');

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 pt-24">
      <div className="container max-w-2xl mx-auto px-4 py-12">
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 text-center">
          {/* Success Icon */}
          <div className="w-24 h-24 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-12 h-12 text-green-500" />
          </div>

          {/* Success Message */}
          <h1 className="text-3xl font-bold text-white mb-4">
            Đặt hàng thành công!
          </h1>
          <p className="text-lg text-gray-300 mb-8">
            Cảm ơn bạn đã đặt hàng. Chúng tôi đã nhận được đơn hàng của bạn và sẽ xử lý trong thời gian sớm nhất.
          </p>

          {/* Order Info */}
          <div className="bg-white/5 rounded-lg p-6 mb-8 text-left">
            <h2 className="text-xl font-semibold text-white mb-4">Thông tin đơn hàng</h2>
            <div className="space-y-3 text-gray-300">
              <div className="flex items-center gap-3">
                <Package className="w-5 h-5 text-primary" />
                <span>
                    {orderCode ? (
                        <>Mã đơn hàng: <span className="text-primary font-bold">{orderCode}</span></>
                    ) : (
                        'Mã đơn hàng sẽ được gửi qua email và SMS'
                    )}
                </span>
              </div>
              <div className="flex items-center gap-3">
                <Truck className="w-5 h-5 text-primary" />
                <span>Thời gian giao hàng: 3-5 ngày làm việc</span>
              </div>
            </div>
          </div>

          {/* Next Steps */}
          <div className="bg-white/5 rounded-lg p-6 mb-8 text-left">
            <h2 className="text-xl font-semibold text-white mb-4">Bước tiếp theo</h2>
            <ul className="space-y-2 text-gray-300 list-disc list-inside">
              <li>Kiểm tra email để xác nhận đơn hàng</li>
              <li>Nhân viên sẽ liên hệ với bạn trong vòng 24h</li>
              <li>Theo dõi đơn hàng qua trang "Theo dõi đơn hàng"</li>
            </ul>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href={orderCode ? `/tracking?code=${orderCode}` : "/tracking"}
              className="px-6 py-3 bg-primary text-black font-semibold rounded-lg hover:bg-primary/90 transition-colors"
            >
              Theo dõi đơn hàng
            </Link>
            <Link
              href="/"
              className="px-6 py-3 bg-white/10 text-white font-semibold rounded-lg hover:bg-white/20 transition-colors"
            >
              Về trang chủ
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function OrderSuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 pt-24 flex items-center justify-center">
        <div className="text-white">Đang tải...</div>
      </div>
    }>
      <OrderSuccessContent />
    </Suspense>
  );
}
