"use client";

import { useAuth } from "@/lib/auth-context";
import { Bell, Search, User, Package, ShoppingCart, Users, X } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { MOCK_ORDERS, MOCK_PRODUCTS, MOCK_CUSTOMERS } from "@/lib/mock-data";
import Link from "next/link";

interface Notification {
    id: number;
    title: string;
    time: string;
    read: boolean;
    link: string;
}

export default function AdminHeader() {
    const { user } = useAuth();
    const router = useRouter();
    const [searchQuery, setSearchQuery] = useState("");
    const [showNotifications, setShowNotifications] = useState(false);
    const [showSearchDropdown, setShowSearchDropdown] = useState(false);
    const searchRef = useRef<HTMLDivElement>(null);

    const [notifications, setNotifications] = useState<Notification[]>([]);

    // Generate dynamic notifications from mock data
    useEffect(() => {
        const newOrders = MOCK_ORDERS
            .filter(o => o.status === 'pending')
            .map(o => ({
                id: 100 + o.id,
                title: `Đơn hàng mới ${o.code}`,
                time: "Vừa xong",
                read: false,
                link: `/admin/orders/${o.id}`
            }));

        const lowStock = MOCK_PRODUCTS
            .filter(p => p.stock < 5 && p.stock > 0)
            .map(p => ({
                id: 200 + p.id,
                title: `Sắp hết hàng: ${p.name}`,
                time: "Trong ngày",
                read: false,
                link: `/admin/products/new?id=${p.id}`
            }));

        setNotifications([...newOrders, ...lowStock]);
    }, []);

    const unreadCount = notifications.filter(n => !n.read).length;

    // Search Logic
    const filteredResults = {
        products: MOCK_PRODUCTS.filter(p =>
            p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            `SP-${p.id}00`.toLowerCase().includes(searchQuery.toLowerCase())
        ),
        orders: MOCK_ORDERS.filter(o =>
            o.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
            o.customerName.toLowerCase().includes(searchQuery.toLowerCase())
        ),
        customers: MOCK_CUSTOMERS.filter(c =>
            c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            c.phone.includes(searchQuery)
        )
    };

    const hasResults = filteredResults.products.length > 0 || filteredResults.orders.length > 0 || filteredResults.customers.length > 0;

    // Close search dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
                setShowSearchDropdown(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleSearchInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(e.target.value);
        setShowSearchDropdown(e.target.value.length > 0);
    };

    const handleResultClick = (path: string) => {
        router.push(path);
        setShowSearchDropdown(false);
        setSearchQuery("");
    };

    const markAllRead = () => {
        setNotifications(notifications.map(n => ({ ...n, read: true })));
    };

    const handleNotificationClick = (path: string) => {
        if (!path) return;
        router.push(path);
        setShowNotifications(false);
    };

    return (
        <header className="h-20 bg-card/50 backdrop-blur-sm border-b border-border px-8 flex items-center justify-between sticky top-0 z-40">
            {/* Search Bar */}
            <div className="flex-1 max-w-xl relative" ref={searchRef}>
                <div className="relative z-50">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <input
                        type="text"
                        placeholder="Tìm đơn hàng, sản phẩm, khách hàng..."
                        value={searchQuery}
                        onChange={handleSearchInput}
                        onFocus={() => searchQuery.length > 0 && setShowSearchDropdown(true)}
                        className="w-full bg-muted/50 border border-border rounded-xl pl-10 pr-10 py-2 text-sm focus:outline-none focus:border-primary transition-colors text-foreground placeholder:text-muted-foreground"
                    />
                    {searchQuery && (
                        <button
                            onClick={() => { setSearchQuery(""); setShowSearchDropdown(false); }}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    )}
                </div>

                {/* Search Dropdown */}
                {showSearchDropdown && (
                    <div className="absolute top-full left-0 right-0 mt-2 bg-card border border-border rounded-xl shadow-2xl overflow-hidden max-h-[80vh] overflow-y-auto">
                        {hasResults ? (
                            <div className="divide-y divide-border">
                                {/* Orders */}
                                {filteredResults.orders.length > 0 && (
                                    <div className="p-2">
                                        <div className="text-xs font-bold text-muted-foreground uppercase px-2 py-1 mb-1">Đơn Hàng</div>
                                        {filteredResults.orders.map(order => (
                                            <div
                                                key={`order-${order.id}`}
                                                onClick={() => handleResultClick(`/admin/orders/${order.id}`)}
                                                className="flex items-center gap-3 p-2 hover:bg-muted/50 rounded-lg cursor-pointer group"
                                            >
                                                <div className="p-2 bg-blue-500/10 text-blue-500 rounded-lg group-hover:bg-blue-500/20">
                                                    <ShoppingCart className="w-4 h-4" />
                                                </div>
                                                <div>
                                                    <div className="text-sm font-bold text-foreground">{order.code}</div>
                                                    <div className="text-xs text-muted-foreground">{order.customerName} - {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(order.total)}</div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}

                                {/* Products */}
                                {filteredResults.products.length > 0 && (
                                    <div className="p-2">
                                        <div className="text-xs font-bold text-muted-foreground uppercase px-2 py-1 mb-1">Sản Phẩm</div>
                                        {filteredResults.products.map(product => (
                                            <div
                                                key={`product-${product.id}`}
                                                onClick={() => handleResultClick(`/admin/products/new?id=${product.id}`)}
                                                className="flex items-center gap-3 p-2 hover:bg-muted/50 rounded-lg cursor-pointer group"
                                            >
                                                <div className="p-2 bg-green-500/10 text-green-500 rounded-lg group-hover:bg-green-500/20">
                                                    <Package className="w-4 h-4" />
                                                </div>
                                                <div>
                                                    <div className="text-sm font-bold text-foreground">{product.name}</div>
                                                    <div className="text-xs text-muted-foreground">SKU: SP-{product.id}00 - {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(product.price)}</div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}

                                {/* Customers */}
                                {filteredResults.customers.length > 0 && (
                                    <div className="p-2">
                                        <div className="text-xs font-bold text-muted-foreground uppercase px-2 py-1 mb-1">Khách Hàng</div>
                                        {filteredResults.customers.map(customer => (
                                            <div
                                                key={`customer-${customer.id}`}
                                                onClick={() => handleResultClick(`/admin/customers`)}
                                                className="flex items-center gap-3 p-2 hover:bg-muted/50 rounded-lg cursor-pointer group"
                                            >
                                                <div className="p-2 bg-purple-500/10 text-purple-500 rounded-lg group-hover:bg-purple-500/20">
                                                    <Users className="w-4 h-4" />
                                                </div>
                                                <div>
                                                    <div className="text-sm font-bold text-foreground">{customer.name}</div>
                                                    <div className="text-xs text-muted-foreground">{customer.phone} - {customer.email}</div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="p-8 text-center text-muted-foreground">
                                <Search className="w-8 h-8 mx-auto mb-2 opacity-20" />
                                <p>Không tìm thấy kết quả nào cho "{searchQuery}"</p>
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Right Actions */}
            <div className="flex items-center gap-6 ml-4">
                {/* Notifications */}
                <div className="relative">
                    <button
                        onClick={() => setShowNotifications(!showNotifications)}
                        className="relative p-2 hover:bg-muted/50 rounded-full transition-colors"
                    >
                        <Bell className="w-5 h-5 text-muted-foreground" />
                        {unreadCount > 0 && (
                            <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-card animate-pulse"></span>
                        )}
                    </button>

                    {/* Notification Dropdown */}
                    {showNotifications && (
                        <>
                            <div
                                className="fixed inset-0 z-40"
                                onClick={() => setShowNotifications(false)}
                            />
                            <div className="absolute right-0 top-full mt-2 w-80 bg-card border border-border rounded-xl shadow-2xl z-50 overflow-hidden">
                                <div className="p-4 border-b border-border flex justify-between items-center bg-muted/50">
                                    <h3 className="font-bold text-foreground">Thông Báo</h3>
                                    <button
                                        onClick={markAllRead}
                                        className="text-xs text-primary hover:underline"
                                    >
                                        Đánh dấu đã đọc
                                    </button>
                                </div>
                                <div className="max-h-64 overflow-y-auto">
                                    {notifications.length > 0 ? (
                                        notifications.map((notif) => (
                                            <div
                                                key={notif.id}
                                                onClick={() => handleNotificationClick(notif.link)}
                                                className={`p-4 border-b border-border hover:bg-muted/50 transition-colors cursor-pointer ${!notif.read ? 'bg-primary/5' : ''}`}
                                            >
                                                <p className={`text-sm mb-1 ${!notif.read ? 'font-bold text-foreground' : 'text-muted-foreground'}`}>
                                                    {notif.title}
                                                </p>
                                                <span className="text-xs text-muted-foreground">{notif.time}</span>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="p-8 text-center text-muted-foreground">
                                            Không có thông báo nào
                                        </div>
                                    )}
                                </div>
                                <div className="p-3 text-center border-t border-border bg-muted/50">
                                    <button
                                        onClick={() => alert("Trang quản lý thông báo chi tiết đang được phát triển!")}
                                        className="text-xs text-muted-foreground hover:text-foreground transition-colors"
                                    >
                                        Xem tất cả
                                    </button>
                                </div>
                            </div>
                        </>
                    )}
                </div>

                {/* Profile */}
                <div className="flex items-center gap-3 pl-6 border-l border-border">
                    <div className="text-right hidden md:block">
                        <div className="text-sm font-bold text-foreground">
                            {user?.username || "Admin"}
                        </div>
                        <div className="text-xs text-muted-foreground">
                            {user ? "Quản trị viên" : "Staff"}
                        </div>
                    </div>
                    <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center border border-border overflow-hidden">
                        <User className="w-5 h-5 text-primary" />
                    </div>
                </div>
            </div>
        </header>
    );
}
