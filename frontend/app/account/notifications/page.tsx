import NotificationCenter from '@/components/account/NotificationCenter';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Thông báo - Tài khoản',
  description: 'Quản lý thông báo của bạn',
};

export default function AccountNotificationsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Thông báo</h1>
        <p className="text-gray-600 mt-2">Xem và quản lý các thông báo của bạn</p>
      </div>

      <NotificationCenter />
    </div>
  );
}
