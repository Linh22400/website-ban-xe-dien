import ServiceBookingForm from '@/components/forms/ServiceBookingForm';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Đặt lịch bảo dưỡng - Xe Điện Việt',
  description: 'Đặt lịch bảo dưỡng, sửa chữa xe điện nhanh chóng và tiện lợi.',
};

export default function ServicesPage() {
  return (
    <main className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <ServiceBookingForm />
      </div>
    </main>
  );
}
