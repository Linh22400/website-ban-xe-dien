'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/lib/auth-context';
import Image from 'next/image';
import { Calendar, CheckCircle, Clock, XCircle } from 'lucide-react';

interface TradeIn {
  id: number;
  attributes: {
    VehicleBrand: string;
    VehicleModel: string;
    VehicleYear: number;
    VehicleType: string;
    Condition: string;
    Mileage: number;
    BatteryHealth: number;
    EstimatedValue: number;
    AppraisedValue?: number;
    Status: 'pending' | 'appraised' | 'accepted' | 'rejected' | 'completed';
    AppraisalNotes?: string;
    InspectionDate?: string;
    createdAt: string;
    Photos?: {
      data: Array<{
        id: number;
        attributes: {
          url: string;
        };
      }>;
    };
  };
}

export default function TradeInList() {
  const { token } = useAuth();
  const [tradeIns, setTradeIns] = useState<TradeIn[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (token) {
      fetchTradeIns();
    }
  }, [token]);

  const fetchTradeIns = async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/trade-ins/user/my-requests`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();
      setTradeIns(data.data || []);
    } catch (error) {
      console.error('Error fetching trade-ins:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const badges = {
      pending: { label: 'Đang chờ', color: 'bg-yellow-100 text-yellow-800', icon: Clock },
      appraised: { label: 'Đã định giá', color: 'bg-blue-100 text-blue-800', icon: CheckCircle },
      accepted: { label: 'Đã chấp nhận', color: 'bg-green-100 text-green-800', icon: CheckCircle },
      rejected: { label: 'Đã từ chối', color: 'bg-red-100 text-red-800', icon: XCircle },
      completed: { label: 'Hoàn thành', color: 'bg-gray-100 text-gray-800', icon: CheckCircle },
    };

    const badge = badges[status as keyof typeof badges] || badges.pending;
    const Icon = badge.icon;

    return (
      <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${badge.color}`}>
        <Icon className="w-4 h-4" />
        {badge.label}
      </span>
    );
  };

  const getConditionLabel = (condition: string) => {
    const labels = {
      excellent: 'Xuất sắc',
      good: 'Tốt',
      fair: 'Khá',
      poor: 'Kém'
    };
    return labels[condition as keyof typeof labels] || condition;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (tradeIns.length === 0) {
    return (
      <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
        <p className="text-gray-500 mb-4">Bạn chưa có yêu cầu thu cũ đổi mới nào</p>
        <a
          href="/trade-in"
          className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold"
        >
          Gửi yêu cầu mới
        </a>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {tradeIns.map((tradeIn) => {
        const photos = tradeIn.attributes.Photos?.data || [];
        const firstPhoto = photos[0];

        return (
          <div key={tradeIn.id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex gap-4">
                  {firstPhoto && (
                    <div className="relative w-24 h-24 rounded-lg overflow-hidden flex-shrink-0">
                      <Image
                        src={`${process.env.NEXT_PUBLIC_API_URL}${firstPhoto.attributes.url}`}
                        alt="Vehicle"
                        fill
                        className="object-cover"
                      />
                    </div>
                  )}
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 mb-1">
                      {tradeIn.attributes.VehicleBrand} {tradeIn.attributes.VehicleModel}
                    </h3>
                    <p className="text-sm text-gray-600 mb-2">
                      Năm {tradeIn.attributes.VehicleYear} • {tradeIn.attributes.Mileage.toLocaleString('vi-VN')} km
                    </p>
                    <div className="flex items-center gap-2">
                      {getStatusBadge(tradeIn.attributes.Status)}
                      <span className="text-sm text-gray-500">
                        {getConditionLabel(tradeIn.attributes.Condition)}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <p className="text-sm text-gray-500 mb-1">Giá ước tính</p>
                  <p className="text-xl font-bold text-gray-900">
                    {tradeIn.attributes.EstimatedValue.toLocaleString('vi-VN')} ₫
                  </p>
                  {tradeIn.attributes.AppraisedValue && (
                    <>
                      <p className="text-sm text-gray-500 mt-2 mb-1">Giá định giá</p>
                      <p className="text-2xl font-bold text-blue-600">
                        {tradeIn.attributes.AppraisedValue.toLocaleString('vi-VN')} ₫
                      </p>
                    </>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4 text-sm">
                <div>
                  <p className="text-gray-500">Loại xe</p>
                  <p className="font-medium text-gray-900 capitalize">{tradeIn.attributes.VehicleType}</p>
                </div>
                <div>
                  <p className="text-gray-500">Sức khỏe pin</p>
                  <p className="font-medium text-gray-900">{tradeIn.attributes.BatteryHealth}%</p>
                </div>
                <div>
                  <p className="text-gray-500">Ngày gửi</p>
                  <p className="font-medium text-gray-900">
                    {new Date(tradeIn.attributes.createdAt).toLocaleDateString('vi-VN')}
                  </p>
                </div>
                {tradeIn.attributes.InspectionDate && (
                  <div>
                    <p className="text-gray-500">Ngày kiểm tra</p>
                    <p className="font-medium text-gray-900 flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      {new Date(tradeIn.attributes.InspectionDate).toLocaleDateString('vi-VN')}
                    </p>
                  </div>
                )}
              </div>

              {tradeIn.attributes.AppraisalNotes && (
                <div className="bg-blue-50 border-l-4 border-blue-500 p-4">
                  <p className="text-sm font-semibold text-blue-900 mb-1">Ghi chú định giá</p>
                  <p className="text-sm text-blue-800">{tradeIn.attributes.AppraisalNotes}</p>
                </div>
              )}
            </div>

            {photos.length > 1 && (
              <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
                <div className="flex gap-2 overflow-x-auto">
                  {photos.slice(1, 5).map((photo) => (
                    <div key={photo.id} className="relative w-20 h-20 rounded-lg overflow-hidden flex-shrink-0">
                      <Image
                        src={`${process.env.NEXT_PUBLIC_API_URL}${photo.attributes.url}`}
                        alt="Vehicle"
                        fill
                        className="object-cover"
                      />
                    </div>
                  ))}
                  {photos.length > 5 && (
                    <div className="w-20 h-20 rounded-lg bg-gray-200 flex items-center justify-center text-gray-600 font-semibold flex-shrink-0">
                      +{photos.length - 5}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
