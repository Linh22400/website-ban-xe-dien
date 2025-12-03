"use client";

import Link from "next/link";
import { useState } from "react";
import { useAuth } from "@/lib/auth-context";

export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false);
    const { isAuthenticated, user, logout } = useAuth();

    const navLinks = [
        { href: "/", label: "Trang Chủ" },
        { href: "/cars", label: "Sản Phẩm" },
        { href: "/compare", label: "So Sánh" },
        { href: "/promotions", label: "Khuyến Mãi" },
        { href: "/blog", label: "Tin Tức" },
        { href: "/about", label: "Về Chúng Tôi" },
        { href: "/contact", label: "Liên Hệ" },
        { href: "/tracking", label: "Tra Cứu Đơn Hàng" },
    ];

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-lg border-b border-white/5">
            <div className="container mx-auto px-6 py-4">
                <div className="flex items-center justify-between">
                    {/* Logo */}
                    <Link href="/" className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">
                        XE ĐIỆN XANH
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center gap-6">
                        {navLinks.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                className="text-muted-foreground hover:text-white transition-colors font-medium text-sm"
                            >
                                {link.label}
                            </Link>
                        ))}

                        {isAuthenticated ? (
                            <>
                                <Link
                                    href="/account"
                                    className="text-muted-foreground hover:text-white transition-colors font-medium text-sm"
                                >
                                    👤 {user?.username}
                                </Link>
                                <button
                                    onClick={logout}
                                    className="px-4 py-2 text-sm text-muted-foreground hover:text-white transition-colors"
                                >
                                    Đăng Xuất
                                </button>
                            </>
                        ) : (
                            <>
                                <Link
                                    href="/login"
                                    className="text-muted-foreground hover:text-white transition-colors font-medium text-sm"
                                >
                                    Đăng Nhập
                                </Link>
                                <Link
                                    href="/register"
                                    className="px-6 py-2 bg-primary text-black font-bold rounded-full hover:bg-white transition-colors"
                                >
                                    Đăng Ký
                                </Link>
                            </>
                        )}
                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        onClick={() => setIsOpen(!isOpen)}
                        className="md:hidden text-white p-2"
                        aria-label="Toggle menu"
                    >
                        <svg
                            className="w-6 h-6"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            {isOpen ? (
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M6 18L18 6M6 6l12 12"
                                />
                            ) : (
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M4 6h16M4 12h16M4 18h16"
                                />
                            )}
                        </svg>
                    </button>
                </div>

                {/* Mobile Menu */}
                {isOpen && (
                    <div className="md:hidden mt-4 pb-4 border-t border-white/5 pt-4">
                        <div className="flex flex-col gap-4">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    onClick={() => setIsOpen(false)}
                                    className="text-muted-foreground hover:text-white transition-colors font-medium"
                                >
                                    {link.label}
                                </Link>
                            ))}

                            {isAuthenticated ? (
                                <>
                                    <Link
                                        href="/account"
                                        onClick={() => setIsOpen(false)}
                                        className="text-white font-bold"
                                    >
                                        👤 {user?.username}
                                    </Link>
                                    <button
                                        onClick={() => {
                                            logout();
                                            setIsOpen(false);
                                        }}
                                        className="text-left text-muted-foreground hover:text-white transition-colors"
                                    >
                                        Đăng Xuất
                                    </button>
                                </>
                            ) : (
                                <>
                                    <Link
                                        href="/login"
                                        onClick={() => setIsOpen(false)}
                                        className="text-muted-foreground hover:text-white transition-colors"
                                    >
                                        Đăng Nhập
                                    </Link>
                                    <Link
                                        href="/register"
                                        onClick={() => setIsOpen(false)}
                                        className="px-6 py-2 bg-primary text-black font-bold rounded-full hover:bg-white transition-colors text-center"
                                    >
                                        Đăng Ký
                                    </Link>
                                </>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </nav>
    );
}
