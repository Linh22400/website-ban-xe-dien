import TradeInForm from '@/components/forms/TradeInForm';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Thu cũ đổi mới - Xe Điện Việt',
  description: 'Đổi xe cũ lấy xe mới với giá trị tốt nhất. Quy trình nhanh chóng, minh bạch.',
};

export default function TradeInPage() {
  return (
    <main className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <TradeInForm />
      </div>
    </main>
  );
}
