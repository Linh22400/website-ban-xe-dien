import { Metadata } from 'next';
import ROICalculator from '@/components/calculators/ROICalculator';
import EnvironmentalImpact from '@/components/calculators/EnvironmentalImpact';

export const metadata: Metadata = {
  title: 'Máy Tính ROI - So Sánh Chi Phí Xe Điện & Xe Xăng | TAILG',
  description: 'Tính toán chi phí tổng thể (TCO) khi sử dụng xe điện so với xe xăng. Xem điểm hòa vốn, tiết kiệm chi phí và tác động môi trường.',
  keywords: 'máy tính ROI xe điện, so sánh xe điện xe xăng, chi phí xe điện, tiết kiệm xe điện, TCO xe điện',
};

export default function CalculatorPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Page Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Máy Tính Chi Phí Tổng Thể (TCO)
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            So sánh chi tiết chi phí sử dụng xe điện và xe xăng trong thời gian dài. 
            Tính toán điểm hòa vốn, tiết kiệm chi phí và lợi ích môi trường.
          </p>
        </div>

        {/* ROI Calculator */}
        <div className="mb-12">
          <ROICalculator />
        </div>

        {/* Environmental Impact (with default values) */}
        <div className="mb-12">
          <EnvironmentalImpact dailyKm={30} years={5} />
        </div>

        {/* Additional Info */}
        <div className="bg-blue-50 border-l-4 border-blue-500 p-6 rounded-r-lg">
          <h3 className="font-bold text-blue-900 text-lg mb-2">💡 Lưu ý</h3>
          <ul className="text-blue-800 space-y-2 text-sm">
            <li>• Các con số trên là ước tính dựa trên điều kiện sử dụng trung bình</li>
            <li>• Chi phí điện và xăng có thể thay đổi theo thời gian</li>
            <li>• Chi phí bảo dưỡng thực tế phụ thuộc vào cách sử dụng và bảo quản</li>
            <li>• Tác động môi trường tính dựa trên hệ số phát thải trung bình tại Việt Nam</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
