'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/auth-context';
import { Calendar, Clock } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function ServiceBookingForm() {
  const { user, token } = useAuth();
  const router = useRouter();
  
  const [formData, setFormData] = useState({
    ServiceType: 'maintenance',
    AppointmentDate: '',
    VehicleBrand: '',
    VehicleModel: '',
    VehiclePlateNumber: '',
    IssueDescription: '',
    Priority: 'medium',
    ContactPhone: '',
    ContactEmail: user?.email || '',
    PreferredShowroom: ''
  });

  const [showrooms, setShowrooms] = useState<any[]>([]);
  const [availableSlots, setAvailableSlots] = useState<string[]>([]);
  const [selectedDate, setSelectedDate] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchShowrooms();
  }, []);

  const fetchShowrooms = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_STRAPI_URL}/api/showrooms`);
      const data = await response.json();
      setShowrooms(data.data || []);
    } catch (error) {
      console.error('Error fetching showrooms:', error);
    }
  };

  const fetchAvailableSlots = async (date: string, showroomId: string) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_STRAPI_URL}/api/service-bookings/available-slots?date=${date}&showroomId=${showroomId}`
      );
      const data = await response.json();
      setAvailableSlots(data.data.availableSlots || []);
    } catch (error) {
      console.error('Error fetching slots:', error);
    }
  };

  const handleDateChange = (date: string) => {
    setSelectedDate(date);
    if (formData.PreferredShowroom) {
      fetchAvailableSlots(date, formData.PreferredShowroom);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) {
      setError('Vui lòng đăng nhập');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_STRAPI_URL}/api/service-bookings`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ data: formData }),
        }
      );

      if (!response.ok) {
        throw new Error('Lỗi khi đặt lịch');
      }

      alert('Đặt lịch bảo dưỡng thành công! Chúng tôi sẽ liên hệ xác nhận.');
      router.push('/account/services');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow p-8 text-center">
        <h2 className="text-2xl font-bold mb-4">Đặt lịch bảo dưỡng</h2>
        <p className="text-gray-600 mb-6">Vui lòng đăng nhập để đặt lịch</p>
        <a href="/login" className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
          Đăng nhập
        </a>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto bg-white rounded-lg shadow p-8">
      <h2 className="text-3xl font-bold mb-6">Đặt lịch bảo dưỡng</h2>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Loại dịch vụ *</label>
            <select
              value={formData.ServiceType}
              onChange={(e) => setFormData({...formData, ServiceType: e.target.value})}
              required
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="maintenance">Bảo dưỡng định kỳ</option>
              <option value="repair">Sửa chữa</option>
              <option value="battery-replacement">Thay pin</option>
              <option value="inspection">Kiểm tra</option>
              <option value="warranty">Bảo hành</option>
              <option value="emergency">Khẩn cấp</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Showroom *</label>
            <select
              value={formData.PreferredShowroom}
              onChange={(e) => {
                setFormData({...formData, PreferredShowroom: e.target.value});
                if (selectedDate) fetchAvailableSlots(selectedDate, e.target.value);
              }}
              required
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Chọn showroom</option>
              {showrooms.map((sr) => (
                <option key={sr.id} value={sr.id}>
                  {sr.attributes.Name} - {sr.attributes.City}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Ngày hẹn *</label>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => handleDateChange(e.target.value)}
              min={new Date().toISOString().split('T')[0]}
              required
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Giờ hẹn *</label>
            <select
              value={formData.AppointmentDate}
              onChange={(e) => setFormData({...formData, AppointmentDate: e.target.value})}
              required
              disabled={!selectedDate || availableSlots.length === 0}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
            >
              <option value="">Chọn giờ</option>
              {availableSlots.map((slot) => (
                <option key={slot} value={slot}>
                  {new Date(slot).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Hãng xe *</label>
            <input
              type="text"
              value={formData.VehicleBrand}
              onChange={(e) => setFormData({...formData, VehicleBrand: e.target.value})}
              required
              placeholder="VD: TAILG"
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Dòng xe *</label>
            <input
              type="text"
              value={formData.VehicleModel}
              onChange={(e) => setFormData({...formData, VehicleModel: e.target.value})}
              required
              placeholder="VD: Flyer X"
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Biển số xe</label>
            <input
              type="text"
              value={formData.VehiclePlateNumber}
              onChange={(e) => setFormData({...formData, VehiclePlateNumber: e.target.value})}
              placeholder="29A-12345"
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Số điện thoại *</label>
            <input
              type="tel"
              value={formData.ContactPhone}
              onChange={(e) => setFormData({...formData, ContactPhone: e.target.value})}
              required
              placeholder="0987654321"
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">Mô tả vấn đề *</label>
            <textarea
              value={formData.IssueDescription}
              onChange={(e) => setFormData({...formData, IssueDescription: e.target.value})}
              required
              rows={4}
              placeholder="Mô tả chi tiết vấn đề của xe..."
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        <div className="flex gap-4">
          <button
            type="button"
            onClick={() => router.back()}
            className="flex-1 px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            Hủy
          </button>
          <button
            type="submit"
            disabled={loading}
            className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? 'Đang xử lý...' : 'Đặt lịch'}
          </button>
        </div>
      </form>
    </div>
  );
}
