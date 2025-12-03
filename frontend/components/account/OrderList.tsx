'use client';

import { Order } from '@/types/order';
import OrderItem from './OrderItem';
import { PackageX } from 'lucide-react';
import Link from 'next/link';

interface OrderListProps {
    orders: Order[];
    isLoading?: boolean;
}

export default function OrderList({ orders, isLoading }: OrderListProps) {
    if (isLoading) {
        return (
            <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                    <div key={i} className="h-48 bg-white/5 rounded-xl animate-pulse" />
                ))}
            </div>
        );
    }

    if (orders.length === 0) {
        return (
            <div className="text-center py-16 bg-card/30 border border-white/10 rounded-2xl">
                <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4">
                    <PackageX className="w-8 h-8 text-muted-foreground" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Chưa có đơn hàng nào</h3>
                <p className="text-muted-foreground mb-6">
                    Bạn chưa thực hiện đơn hàng nào. Hãy khám phá các mẫu xe của chúng tôi nhé!
                </p>
                <Link
                    href="/products"
                    className="inline-flex items-center justify-center px-6 py-3 rounded-full bg-primary text-black font-bold hover:bg-primary-dark transition-all"
                >
                    Xem sản phẩm
                </Link>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {orders.map((order) => (
                <OrderItem key={order.id} order={order} />
            ))}
        </div>
    );
}
