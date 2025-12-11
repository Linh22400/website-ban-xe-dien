'use client';

import { useEffect, useState } from 'react';
import { getUserOrders } from '@/lib/order-api';
import { Order } from '@/types/order';
import OrderList from '@/components/account/OrderList';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function OrdersPage() {
    const [orders, setOrders] = useState<Order[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        async function fetchOrders() {
            try {
                // In a real app, you'd get the token from auth context or storage
                // For this demo, we might need to handle the token differently or assume it's available
                const token = localStorage.getItem('token') || '';

                if (!token) {
                    // Redirect to login or show empty state if no token
                    // For now, we'll just try to fetch (api might handle public access or we mock it)
                    console.log('No token found, user might need to login');
                }

                const data = await getUserOrders(token);
                // Sort orders by newest first
                const sortedOrders = data.sort((a, b) =>
                    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
                );
                setOrders(sortedOrders);
            } catch (error) {
                console.error('Failed to fetch orders:', error);
            } finally {
                setIsLoading(false);
            }
        }

        fetchOrders();
    }, []);

    return (
        <div className="min-h-screen bg-black pt-24 pb-12">
            <div className="container mx-auto px-4">
                <div className="max-w-4xl mx-auto">
                    {/* Header */}
                    <div className="flex items-center gap-4 mb-8">
                        <Link
                            href="/account"
                            className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-white/10 transition-colors"
                        >
                            <ArrowLeft className="w-5 h-5 text-gray-900 dark:text-white" />
                        </Link>
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Đơn hàng của tôi</h1>
                            <p className="text-muted-foreground">Theo dõi và quản lý lịch sử mua hàng</p>
                        </div>
                    </div>

                    {/* Order List */}
                    <OrderList orders={orders} isLoading={isLoading} />
                </div>
            </div>
        </div>
    );
}
