import TradeInList from '@/components/account/TradeInList';
import { Metadata } from 'next';
import Link from 'next/link';
import { Plus } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Yêu cầu thu cũ đổi mới - Tài khoản',
  description: 'Quản lý các yêu cầu thu cũ đổi mới của bạn',
};

export default function AccountTradeInsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Thu cũ đổi mới</h1>
          <p className="text-gray-600 mt-2">Quản lý các yêu cầu thu cũ đổi mới của bạn</p>
        </div>
        <Link
          href="/trade-in"
          className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold"
        >
          <Plus className="w-5 h-5" />
          Yêu cầu mới
        </Link>
      </div>

      <TradeInList />
    </div>
  );
}
