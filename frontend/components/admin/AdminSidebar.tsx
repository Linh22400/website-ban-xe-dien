"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    LayoutDashboard,
    ShoppingCart,
    Package,
    Users,
    Settings,
    LogOut,
    Bike,
    MapPin,
    Image,
    FileText,
    PackageOpen,
    Tag,
    Inbox,
    Layers
} from "lucide-react";
import { useAuth } from "@/lib/auth-context";

const MENU_ITEMS = [
    {
        title: "Tổng Quan",
        icon: LayoutDashboard,
        href: "/admin",
    },
    {
        title: "Đơn Hàng",
        icon: ShoppingCart,
        href: "/admin/orders",
    },
    {
        title: "Sản Phẩm",
        icon: Package,
        href: "/admin/products",
    },
    {
        title: "Khách Hàng",
        icon: Users,
        href: "/admin/customers",
    },
    {
        title: "Cửa Hàng",
        icon: MapPin,
        href: "/admin/showrooms",
    },
    {
        title: "Banner & Slide",
        icon: Image,
        href: "/admin/marketing",
    },
    {
        title: "Tin Tức",
        icon: FileText,
        href: "/admin/articles",
    },
    {
        title: "Danh Mục",
        icon: Layers,
        href: "/admin/categories",
    },
    {
        title: "Phụ Kiện",
        icon: PackageOpen,
        href: "/admin/accessories",
    },
    {
        title: "Khuyến Mãi",
        icon: Tag,
        href: "/admin/promotions",
    },
    {
        title: "Yêu Cầu Khách Hàng",
        icon: Inbox,
        href: "/admin/leads",
    },
    {
        title: "Cấu Hình",
        icon: Settings,
        href: "/admin/settings",
    },
];

export default function AdminSidebar() {
    const pathname = usePathname();
    const { logout } = useAuth();

    return (
        <aside className="fixed left-0 top-0 w-64 h-screen bg-card border-r border-border flex flex-col z-50">
            {/* Logo */}
            <div className="p-6 border-b border-border flex items-center gap-3">
                <div className="w-10 h-10 bg-primary/20 rounded-xl flex items-center justify-center">
                    <Bike className="w-6 h-6 text-primary" />
                </div>
                <div>
                    <h1 className="font-bold text-lg text-foreground leading-none">Admin</h1>
                    <span className="text-xs text-muted-foreground">XE ĐIỆN ĐỨC DUY</span>
                </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
                {MENU_ITEMS.map((item) => {
                    const isActive = pathname === item.href;
                    const Icon = item.icon;

                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${isActive
                                ? "bg-primary text-primary-foreground font-bold shadow-lg shadow-primary/20"
                                : "text-muted-foreground hover:bg-muted hover:text-foreground"
                                }`}
                        >
                            <Icon className="w-5 h-5" />
                            {item.title}
                        </Link>
                    );
                })}
            </nav>

            {/* User & Logout */}
            <div className="p-4 border-t border-border">
                <button
                    onClick={logout}
                    className="flex items-center gap-3 px-4 py-3 w-full rounded-xl text-red-500 hover:bg-red-500/10 transition-colors"
                >
                    <LogOut className="w-5 h-5" />
                    Đăng Xuất
                </button>
            </div>
        </aside>
    );
}
