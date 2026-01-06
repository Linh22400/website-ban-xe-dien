"use client";

import { useState } from "react";

export default function ContactPage() {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        type: "test-drive", // test-drive, deposit, consultation
        model: "xe-dap-dien-giant",
        message: "",
    });

    const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus("submitting");
        setErrorMessage(null);

        try {
            const { submitLead } = await import("@/lib/api");
            await submitLead(formData);
            setStatus("success");
            // Reset form
            setFormData({
                name: "",
                email: "",
                phone: "",
                type: "test-drive",
                model: "xe-dap-dien-giant",
                message: "",
            });
        } catch (error) {
            console.error("Submit error:", error);
            setStatus("error");
            setErrorMessage(error instanceof Error ? error.message : "Vui lòng thử lại sau hoặc liên hệ trực tiếp qua hotline.");
        }
    };

    return (
        <main className="min-h-screen pt-24 pb-12 px-6 bg-background flex items-center justify-center">
            <div className="w-full max-w-2xl bg-card border border-border rounded-2xl p-8 md:p-12 shadow-[0_0_50px_rgba(0,0,0,0.5)]">
                <div className="text-center mb-10">
                    <h1 className="text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">
                        Liên Hệ Với Chúng Tôi
                    </h1>
                    <p className="text-muted-foreground">
                        Đăng ký lái thử hoặc yêu cầu tư vấn từ chuyên gia của chúng tôi.
                    </p>
                </div>

                {status === "success" ? (
                    <div className="text-center py-10">
                        <div className="w-20 h-20 bg-primary/20 text-primary rounded-full flex items-center justify-center mx-auto mb-6 text-4xl">
                            ✓
                        </div>
                        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Đã Nhận Yêu Cầu!</h3>
                        <p className="text-muted-foreground">
                            Chúng tôi sẽ liên hệ với bạn trong thời gian sớm nhất để xác nhận lịch hẹn.
                        </p>
                        <button
                            onClick={() => setStatus("idle")}
                            className="mt-8 px-6 py-2 text-primary hover:text-white transition-colors"
                        >
                            Gửi yêu cầu khác
                        </button>
                    </div>
                ) : status === "error" ? (
                    <div className="text-center py-10">
                        <div className="w-20 h-20 bg-red-500/20 text-red-500 rounded-full flex items-center justify-center mx-auto mb-6 text-4xl">
                            ✕
                        </div>
                        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Có Lỗi Xảy Ra!</h3>
                        <p className="text-muted-foreground">
                            {errorMessage || "Vui lòng thử lại sau hoặc liên hệ trực tiếp qua hotline."}
                        </p>
                        <button
                            onClick={() => setStatus("idle")}
                            className="mt-8 px-6 py-2 text-primary hover:text-white transition-colors"
                        >
                            Thử lại
                        </button>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-muted-foreground">Họ và Tên</label>
                                <input
                                    type="text"
                                    required
                                    className="w-full bg-secondary border border-border rounded-lg px-4 py-3 text-gray-900 dark:text-white focus:outline-none focus:border-primary transition-colors"
                                    placeholder="Nguyễn Văn A"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-muted-foreground">Số Điện Thoại</label>
                                <input
                                    type="tel"
                                    required
                                    className="w-full bg-secondary border border-border rounded-lg px-4 py-3 text-gray-900 dark:text-white focus:outline-none focus:border-primary transition-colors"
                                    placeholder="0901 234 567"
                                    value={formData.phone}
                                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-muted-foreground">Email</label>
                            <input
                                type="email"
                                required
                                className="w-full bg-secondary border border-border rounded-lg px-4 py-3 text-gray-900 dark:text-white focus:outline-none focus:border-primary transition-colors"
                                placeholder="email@example.com"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-muted-foreground">Loại Yêu Cầu</label>
                                <select
                                    className="w-full bg-secondary border border-border rounded-lg px-4 py-3 text-gray-900 dark:text-white focus:outline-none focus:border-primary transition-colors"
                                    value={formData.type}
                                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                                >
                                    <option value="test-drive">Lái Thử</option>
                                    <option value="consultation">Tư Vấn</option>
                                    <option value="deposit">Đặt Cọc</option>
                                </select>
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-muted-foreground">Sản Phẩm Quan Tâm</label>
                                <select
                                    className="w-full bg-secondary border border-border rounded-lg px-4 py-3 text-gray-900 dark:text-white focus:outline-none focus:border-primary transition-colors"
                                    value={formData.model}
                                    onChange={(e) => setFormData({ ...formData, model: e.target.value })}
                                >
                                    <option value="xe-dap-dien-giant">Giant E-Bike Pro</option>
                                    <option value="xe-may-dien-vinfast-klara">VinFast Klara S</option>
                                    <option value="xe-dap-dien-trek">Trek Verve+ 3</option>
                                    <option value="xe-may-dien-yadea">Yadea G5</option>
                                    <option value="other">Khác</option>
                                </select>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-muted-foreground">Lời Nhắn (Tùy chọn)</label>
                            <textarea
                                className="w-full bg-secondary border border-border rounded-lg px-4 py-3 text-gray-900 dark:text-white focus:outline-none focus:border-primary transition-colors min-h-[120px]"
                                placeholder="Yêu cầu hoặc câu hỏi cụ thể..."
                                value={formData.message}
                                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={status === "submitting"}
                            className="w-full py-4 bg-primary text-black font-bold rounded-xl hover:bg-white transition-all disabled:opacity-50 disabled:cursor-not-allowed mt-4"
                        >
                            {status === "submitting" ? "Đang Gửi..." : "Gửi Yêu Cầu"}
                        </button>
                    </form>
                )}
            </div>
        </main>
    );
}
