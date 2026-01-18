"use client";

import { Save } from "lucide-react";

export default function AdminSettingsPage() {
    return (
        <div className="max-w-2xl space-y-6">
            <div>
                <h1 className="text-3xl font-bold text-foreground mb-2">Cấu Hình Hệ Thống</h1>
                <p className="text-muted-foreground">Điều chỉnh các thông số chung của website.</p>
            </div>

            <div className="bg-card border border-border rounded-2xl p-6 space-y-6">
                <div className="space-y-4">
                    <h2 className="font-bold text-foreground border-b border-border pb-2">Thông Tin Cửa Hàng</h2>

                    <div className="space-y-2">
                        <label className="text-sm font-bold text-muted-foreground">Tên Cửa Hàng</label>
                        <input
                            type="text"
                            defaultValue="XE ĐIỆN XANH"
                            className="w-full bg-muted/50 border border-border rounded-xl px-4 py-3 text-foreground focus:outline-none focus:border-primary transition-colors"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-bold text-muted-foreground">Hotline</label>
                        <input
                            type="text"
                            defaultValue="0987.654.321"
                            className="w-full bg-muted/50 border border-border rounded-xl px-4 py-3 text-foreground focus:outline-none focus:border-primary transition-colors"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-bold text-muted-foreground">Địa chỉ</label>
                        <textarea
                            rows={3}
                            defaultValue="123 Đường ABC, Quận XYZ, TP.HCM"
                            className="w-full bg-muted/50 border border-border rounded-xl px-4 py-3 text-foreground focus:outline-none focus:border-primary transition-colors resize-none"
                        />
                    </div>
                </div>

                <div className="pt-4 flex justify-end">
                    <button className="px-6 py-2.5 bg-primary text-primary-foreground font-bold rounded-xl hover:bg-primary/90 transition-colors flex items-center gap-2 shadow-lg shadow-primary/20">
                        <Save className="w-4 h-4" />
                        Lưu Cấu Hình
                    </button>
                </div>
            </div>
        </div>
    );
}
