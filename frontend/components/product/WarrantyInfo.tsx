"use client";

import { Warranty } from "@/lib/api";
import { Shield, Battery, Wrench, RefreshCw, FileCheck, AlertCircle } from "lucide-react";
import { useState } from "react";

interface WarrantyInfoProps {
    warranty?: Warranty;
}

export default function WarrantyInfo({ warranty }: WarrantyInfoProps) {
    const [activeTab, setActiveTab] = useState<'overview' | 'details'>('overview');

    if (!warranty) return null;

    const warrantyItems = [
        {
            icon: Shield,
            label: "Bảo hành tổng thể",
            value: warranty.warrantyPeriod,
            color: "text-blue-400"
        },
        {
            icon: Battery,
            label: "Bảo hành pin",
            value: warranty.batteryWarranty,
            color: "text-green-400"
        },
        {
            icon: Wrench,
            label: "Bảo hành động cơ",
            value: warranty.motorWarranty,
            color: "text-purple-400"
        },
        {
            icon: RefreshCw,
            label: "Bảo dưỡng miễn phí",
            value: warranty.maintenance,
            color: "text-cyan-400"
        }
    ].filter(item => item.value);

    return (
        <section className="py-20 bg-gradient-to-b from-background to-secondary/20">
            <div className="container mx-auto px-4">
                <div className="max-w-5xl mx-auto">
                    {/* Header */}
                    <div className="text-center mb-12">
                        <div className="inline-flex items-center gap-2 mb-4 px-4 py-2 bg-primary/10 border border-primary/20 rounded-full">
                            <Shield className="w-5 h-5 text-primary" />
                            <span className="text-sm font-semibold text-primary">Cam Kết Chất Lượng</span>
                        </div>
                        <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-3">
                            Chính Sách Bảo Hành
                        </h2>
                        <p className="text-muted-foreground max-w-2xl mx-auto">
                            Yên tâm sử dụng với chính sách bảo hành toàn diện và dịch vụ hỗ trợ chuyên nghiệp
                        </p>
                    </div>

                    {/* Tab Navigation */}
                    <div className="flex justify-center gap-4 mb-8">
                        <button
                            onClick={() => setActiveTab('overview')}
                            className={`px-6 py-3 rounded-xl font-semibold transition-all ${activeTab === 'overview'
                                ? 'bg-primary text-black shadow-lg shadow-primary/30'
                                : 'bg-card/30 text-muted-foreground hover:bg-card/50'
                                }`}
                        >
                            Tổng Quan
                        </button>
                        <button
                            onClick={() => setActiveTab('details')}
                            className={`px-6 py-3 rounded-xl font-semibold transition-all ${activeTab === 'details'
                                ? 'bg-primary text-black shadow-lg shadow-primary/30'
                                : 'bg-card/30 text-muted-foreground hover:bg-card/50'
                                }`}
                        >
                            Chi Tiết
                        </button>
                    </div>

                    {/* Tab Content */}
                    {activeTab === 'overview' ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Warranty Items */}
                            {warrantyItems.map((item, index) => (
                                <div
                                    key={index}
                                    className="bg-card/30 backdrop-blur-sm border border-white/10 rounded-2xl p-6 hover:border-primary/30 transition-all hover:shadow-lg hover:shadow-primary/10"
                                >
                                    <div className="flex items-start gap-4">
                                        <div className={`p-3 rounded-xl bg-gradient-to-br from-${item.color.split('-')[1]}-500/10 to-${item.color.split('-')[1]}-600/5 border border-${item.color.split('-')[1]}-500/20`}>
                                            <item.icon className={`w-6 h-6 ${item.color}`} />
                                        </div>
                                        <div className="flex-1">
                                            <h3 className="text-sm font-medium text-muted-foreground mb-2">
                                                {item.label}
                                            </h3>
                                            <p className="text-lg font-bold text-foreground leading-relaxed">
                                                {item.value}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            ))}

                            {/* Return Policy */}
                            {warranty.returnPolicy && (
                                <div className="md:col-span-2 bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20 rounded-2xl p-6">
                                    <div className="flex items-start gap-4">
                                        <div className="p-3 rounded-xl bg-primary/20 border border-primary/30">
                                            <RefreshCw className="w-6 h-6 text-primary" />
                                        </div>
                                        <div className="flex-1">
                                            <h3 className="text-sm font-semibold text-primary mb-2">
                                                Chính Sách Đổi Trả
                                            </h3>
                                            <p className="text-foreground leading-relaxed">
                                                {warranty.returnPolicy}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="space-y-6">
                            {/* Conditions */}
                            {warranty.conditions && (
                                <div className="bg-card/30 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
                                    <div className="flex items-center gap-3 mb-4">
                                        <div className="p-2 rounded-lg bg-blue-500/10 border border-blue-500/20">
                                            <FileCheck className="w-5 h-5 text-blue-400" />
                                        </div>
                                        <h3 className="text-xl font-bold text-foreground">Điều Kiện Bảo Hành</h3>
                                    </div>
                                    <div
                                        className="text-muted-foreground leading-relaxed prose prose-invert max-w-none"
                                        dangerouslySetInnerHTML={{ __html: warranty.conditions }}
                                    />
                                </div>
                            )}

                            {/* Exclusions */}
                            {warranty.exclusions && (
                                <div className="bg-card/30 backdrop-blur-sm border border-red-500/20 rounded-2xl p-6">
                                    <div className="flex items-center gap-3 mb-4">
                                        <div className="p-2 rounded-lg bg-red-500/10 border border-red-500/20">
                                            <AlertCircle className="w-5 h-5 text-red-400" />
                                        </div>
                                        <h3 className="text-xl font-bold text-foreground">Trường Hợp Không Bảo Hành</h3>
                                    </div>
                                    <div
                                        className="text-muted-foreground leading-relaxed prose prose-invert max-w-none"
                                        dangerouslySetInnerHTML={{ __html: warranty.exclusions }}
                                    />
                                </div>
                            )}

                            {/* Process */}
                            {warranty.process && (
                                <div className="bg-card/30 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
                                    <div className="flex items-center gap-3 mb-4">
                                        <div className="p-2 rounded-lg bg-green-500/10 border border-green-500/20">
                                            <Shield className="w-5 h-5 text-green-400" />
                                        </div>
                                        <h3 className="text-xl font-bold text-foreground">Quy Trình Bảo Hành</h3>
                                    </div>
                                    <div
                                        className="text-muted-foreground leading-relaxed prose prose-invert max-w-none"
                                        dangerouslySetInnerHTML={{ __html: warranty.process }}
                                    />
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
}
