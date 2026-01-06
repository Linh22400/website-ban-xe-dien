import ServiceBookingList from '@/components/account/ServiceBookingList';
import { Metadata } from 'next';
import Link from 'next/link';
import { Plus } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Lịch bảo dưỡng - Tài khoản',
  description: 'Quản lý lịch bảo dưỡng của bạn',
};

export default function AccountServicesPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Lịch bảo dưỡng</h1>
          <p className="text-gray-600 mt-2">Quản lý các lịch hẹn bảo dưỡng của bạn</p>
        </div>
        <Link
          href="/services"
          className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          <Plus className="w-5 h-5" />
          Đặt lịch mới
        </Link>
      </div>

      <ServiceBookingList />
    </div>
  );
}
