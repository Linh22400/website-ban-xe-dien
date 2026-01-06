'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/lib/auth-context';
import { Calendar, Clock, CheckCircle, XCircle, Star } from 'lucide-react';

interface ServiceBooking {
  id: number;
  attributes: {
    ServiceType: string;
    AppointmentDate: string;
    VehicleBrand: string;
    VehicleModel: string;
    Status: string;
    EstimatedCost: number;
    ActualCost?: number;
    TechnicianNotes?: string;
    CompletionNotes?: string;
    Rating?: number;
    createdAt: string;
  };
}

export default function ServiceBookingList() {
  const { token } = useAuth();
  const [bookings, setBookings] = useState<ServiceBooking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (token) fetchBookings();
  }, [token]);

  const fetchBookings = async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/service-bookings/user/my-bookings`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const data = await response.json();
      setBookings(data.data || []);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const getServiceTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      maintenance: 'Bảo dưỡng',
      repair: 'Sửa chữa',
      'battery-replacement': 'Thay pin',
      inspection: 'Kiểm tra',
      warranty: 'Bảo hành',
      emergency: 'Khẩn cấp'
    };
    return labels[type] || type;
  };

  const getStatusBadge = (status: string) => {
    const badges: Record<string, any> = {
      pending: { label: 'Chờ xác nhận', color: 'bg-yellow-100 text-yellow-800', icon: Clock },
      confirmed: { label: 'Đã xác nhận', color: 'bg-blue-100 text-blue-800', icon: CheckCircle },
      'in-progress': { label: 'Đang thực hiện', color: 'bg-purple-100 text-purple-800', icon: Clock },
      completed: { label: 'Hoàn thành', color: 'bg-green-100 text-green-800', icon: CheckCircle },
      cancelled: { label: 'Đã hủy', color: 'bg-red-100 text-red-800', icon: XCircle }
    };
    const badge = badges[status] || badges.pending;
    const Icon = badge.icon;
    return (
      <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm ${badge.color}`}>
        <Icon className="w-4 h-4" />
        {badge.label}
      </span>
    );
  };

  if (loading) {
    return <div className="flex justify-center py-12"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div></div>;
  }

  if (bookings.length === 0) {
    return (
      <div className="text-center py-12 bg-white rounded-lg border">
        <p className="text-gray-500 mb-4">Chưa có lịch bảo dưỡng nào</p>
        <a href="/services" className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
          Đặt lịch ngay
        </a>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {bookings.map((booking) => (
        <div key={booking.id} className="bg-white rounded-lg shadow border p-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-1">
                {getServiceTypeLabel(booking.attributes.ServiceType)}
              </h3>
              <p className="text-sm text-gray-600">
                {booking.attributes.VehicleBrand} {booking.attributes.VehicleModel}
              </p>
              <div className="flex items-center gap-2 mt-2">
                {getStatusBadge(booking.attributes.Status)}
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-500">Chi phí ước tính</p>
              <p className="text-xl font-bold text-gray-900">
                {booking.attributes.EstimatedCost.toLocaleString('vi-VN')} ₫
              </p>
              {booking.attributes.ActualCost && (
                <>
                  <p className="text-sm text-gray-500 mt-2">Chi phí thực tế</p>
                  <p className="text-xl font-bold text-blue-600">
                    {booking.attributes.ActualCost.toLocaleString('vi-VN')} ₫
                  </p>
                </>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 text-sm mb-4">
            <div>
              <p className="text-gray-500">Ngày hẹn</p>
              <p className="font-medium flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                {new Date(booking.attributes.AppointmentDate).toLocaleDateString('vi-VN')}
              </p>
            </div>
            <div>
              <p className="text-gray-500">Giờ hẹn</p>
              <p className="font-medium flex items-center gap-1">
                <Clock className="w-4 h-4" />
                {new Date(booking.attributes.AppointmentDate).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}
              </p>
            </div>
          </div>

          {booking.attributes.TechnicianNotes && (
            <div className="bg-blue-50 border-l-4 border-blue-500 p-3 mb-4">
              <p className="text-sm font-semibold text-blue-900">Ghi chú từ kỹ thuật viên</p>
              <p className="text-sm text-blue-800">{booking.attributes.TechnicianNotes}</p>
            </div>
          )}

          {booking.attributes.CompletionNotes && (
            <div className="bg-green-50 border-l-4 border-green-500 p-3">
              <p className="text-sm font-semibold text-green-900">Kết quả hoàn thành</p>
              <p className="text-sm text-green-800">{booking.attributes.CompletionNotes}</p>
            </div>
          )}

          {booking.attributes.Rating && (
            <div className="flex items-center gap-2 mt-4 text-sm">
              <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
              <span className="font-medium">{booking.attributes.Rating}/5</span>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
