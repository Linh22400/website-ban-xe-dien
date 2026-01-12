'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/auth-context';
import { Check, Trash2, Bell, Package, Wrench, RefreshCw, MessageSquare, Calendar } from 'lucide-react';
import Link from 'next/link';

interface Notification {
  id: number;
  attributes: {
    Type: string;
    Title: string;
    Message: string;
    IsRead: boolean;
    Link?: string;
    createdAt: string;
  };
}

export default function NotificationCenter() {
  const { token } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [filter, setFilter] = useState<'all' | 'unread'>('all');

  useEffect(() => {
    if (token) {
      fetchNotifications();
    }
  }, [token, page, filter]);

  const fetchNotifications = async () => {
    if (!token) return;
    setLoading(true);
    try {
      const unreadParam = filter === 'unread' ? '&unreadOnly=true' : '';
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_STRAPI_URL}/api/notifications/user/my-notifications?page=${page}&pageSize=20${unreadParam}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const data = await response.json();
      setNotifications(data.data || []);
      setTotalPages(data.meta?.pagination?.pageCount || 1);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (id: number) => {
    if (!token) return;
    try {
      await fetch(
        `${process.env.NEXT_PUBLIC_STRAPI_URL}/api/notifications/${id}/read`,
        {
          method: 'PUT',
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      fetchNotifications();
    } catch (error) {
      console.error('Error marking as read:', error);
    }
  };

  const markAllAsRead = async () => {
    if (!token) return;
    try {
      await fetch(
        `${process.env.NEXT_PUBLIC_STRAPI_URL}/api/notifications/user/mark-all-read`,
        {
          method: 'PUT',
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      fetchNotifications();
    } catch (error) {
      console.error('Error marking all as read:', error);
    }
  };

  const deleteNotification = async (id: number) => {
    if (!token) return;
    try {
      await fetch(
        `${process.env.NEXT_PUBLIC_STRAPI_URL}/api/notifications/${id}`,
        {
          method: 'DELETE',
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      fetchNotifications();
    } catch (error) {
      console.error('Error deleting notification:', error);
    }
  };

  const getNotificationIcon = (type: string) => {
    const iconMap: Record<string, any> = {
      'order-created': Package,
      'order-confirmed': Check,
      'order-shipped': Package,
      'order-delivered': Check,
      'service-confirmed': Wrench,
      'service-reminder': Calendar,
      'service-completed': Check,
      'trade-in-appraised': RefreshCw,
      'trade-in-accepted': Check,
      'review-response': MessageSquare,
      'maintenance-reminder': Calendar,
      'promotion': Bell,
    };
    const Icon = iconMap[type] || Bell;
    return <Icon className="w-5 h-5" />;
  };

  const getNotificationColor = (type: string) => {
    if (type.includes('order')) return 'text-blue-600 bg-blue-100';
    if (type.includes('service')) return 'text-emerald-600 bg-emerald-100';
    if (type.includes('trade-in')) return 'text-green-600 bg-green-100';
    if (type.includes('reminder')) return 'text-orange-600 bg-orange-100';
    return 'text-gray-600 bg-gray-100';
  };

  if (loading && notifications.length === 0) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              filter === 'all'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Tất cả
          </button>
          <button
            onClick={() => setFilter('unread')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              filter === 'unread'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Chưa đọc
          </button>
        </div>
        <button
          onClick={markAllAsRead}
          className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors flex items-center gap-2"
        >
          <Check className="w-4 h-4" />
          Đọc tất cả
        </button>
      </div>

      {/* Notifications List */}
      {notifications.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
          <Bell className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500">Không có thông báo</p>
        </div>
      ) : (
        <div className="space-y-3">
          {notifications.map((notification) => (
            <div
              key={notification.id}
              className={`bg-white rounded-lg border shadow-sm p-4 transition-colors ${
                !notification.attributes.IsRead
                  ? 'border-blue-300 bg-blue-50'
                  : 'border-gray-200'
              }`}
            >
              <div className="flex gap-4">
                {/* Icon */}
                <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${getNotificationColor(notification.attributes.Type)}`}>
                  {getNotificationIcon(notification.attributes.Type)}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <h3 className="text-base font-semibold text-gray-900">
                        {notification.attributes.Title}
                      </h3>
                      <p className="text-sm text-gray-600 mt-1">
                        {notification.attributes.Message}
                      </p>
                      <div className="flex items-center gap-4 mt-3">
                        <span className="text-xs text-gray-500">
                          {new Date(notification.attributes.createdAt).toLocaleString('vi-VN')}
                        </span>
                        {notification.attributes.Link && (
                          <Link
                            href={notification.attributes.Link}
                            className="text-xs text-blue-600 hover:text-blue-700 font-medium"
                            onClick={() => markAsRead(notification.id)}
                          >
                            Xem chi tiết →
                          </Link>
                        )}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2">
                      {!notification.attributes.IsRead && (
                        <button
                          onClick={() => markAsRead(notification.id)}
                          className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
                          title="Đánh dấu đã đọc"
                        >
                          <Check className="w-4 h-4" />
                        </button>
                      )}
                      <button
                        onClick={() => deleteNotification(notification.id)}
                        className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors"
                        title="Xóa"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center gap-2">
          <button
            onClick={() => setPage(p => Math.max(1, p - 1))}
            disabled={page === 1}
            className="px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Trước
          </button>
          <span className="px-4 py-2 bg-white border border-gray-300 rounded-lg">
            Trang {page} / {totalPages}
          </span>
          <button
            onClick={() => setPage(p => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Sau
          </button>
        </div>
      )}
    </div>
  );
}
