'use client';

import { useState, useEffect } from 'react';
import TrackingForm from '@/components/tracking/TrackingForm';
import OtpLoginForm from '@/components/tracking/OtpLoginForm';
import { Search, User } from 'lucide-react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { PageHeading, SubHeading, ThemeHoverButton } from '@/components/common/ThemeText';

export default function TrackingPage() {
    const [activeTab, setActiveTab] = useState<'guest' | 'member'>('guest');

    return (
        <div className="min-h-screen bg-background pt-24 pb-12">
            <div className="container mx-auto px-4">
                <div className="max-w-4xl mx-auto">
                    {/* Header */}
                    <div className="flex items-center gap-4 mb-8">
                        <Link
                            href="/"
                            className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-white/10 transition-colors"
                        >
                            <ArrowLeft className="w-5 h-5 text-white" />
                        </Link>
                        <div>
                            <PageHeading className="text-3xl">Tra cứu đơn hàng</PageHeading>
                            <p className="text-muted-foreground">Theo dõi hành trình đơn hàng của bạn</p>
                        </div>
                    </div>

                    {/* Tabs */}
                    <div className="flex justify-center mb-8">
                        <div className="bg-white/5 p-1 rounded-xl inline-flex">
                            <ThemeHoverButton
                                onClick={() => setActiveTab('guest')}
                                isActive={activeTab === 'guest'}
                                className="px-6 py-2.5 rounded-lg text-sm font-medium transition-all flex items-center gap-2"
                            >
                                <Search className="w-4 h-4" />
                                Tra cứu nhanh
                            </ThemeHoverButton>
                            <ThemeHoverButton
                                onClick={() => setActiveTab('member')}
                                isActive={activeTab === 'member'}
                                className="px-6 py-2.5 rounded-lg text-sm font-medium transition-all flex items-center gap-2"
                            >
                                <User className="w-4 h-4" />
                                Thành viên
                            </ThemeHoverButton>
                        </div>
                    </div>

                    {/* Content */}
                    <div className="animate-in fade-in zoom-in-95 duration-300">
                        {activeTab === 'guest' ? (
                            <div>
                                <div className="text-center mb-8">
                                    <SubHeading className="mb-2">Tra cứu đơn hàng lẻ</SubHeading>
                                    <p className="text-muted-foreground">
                                        Nhập mã đơn hàng và số điện thoại để xem chi tiết đơn hàng của bạn
                                    </p>
                                </div>
                                <TrackingForm />
                            </div>
                        ) : (
                            <div>
                                <div className="text-center mb-8">
                                    <SubHeading className="mb-2">Đăng nhập thành viên</SubHeading>
                                    <p className="text-muted-foreground">
                                        Đăng nhập bằng số điện thoại để xem tất cả lịch sử đơn hàng
                                    </p>
                                </div>
                                <OtpLoginForm />
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
