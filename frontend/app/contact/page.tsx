"use client";

import { useState, useEffect } from "react";
import { getCars } from "@/lib/api";

export default function ContactPage() {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        type: "test-drive", // test-drive, deposit, consultation
        model: "",
        message: "",
    });

    const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [carOptions, setCarOptions] = useState<{ label: string; value: string }[]>([]);

    useEffect(() => {
        async function fetchCars() {
            try {
                // Fetch all cars for the dropdown
                const cars = await getCars({ pageSize: 100, sort: "name:asc" });
                const options = cars.map(car => ({
                    label: car.name,
                    value: car.slug
                }));
                setCarOptions(options);
                
                // Set default model if not set and options exist
                if (options.length > 0 && !formData.model) {
                    setFormData(prev => ({ ...prev, model: options[0].value }));
                }
            } catch (error) {
                console.error("Failed to fetch car options:", error);
            }
        }
        fetchCars();
    }, []);

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
                model: carOptions.length > 0 ? carOptions[0].value : "",
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
                        <h3 className="text-2xl font-bold text-foreground mb-2">Đã Nhận Yêu Cầu!</h3>
                        <p className="text-muted-foreground">
                            Chúng tôi sẽ liên hệ với bạn trong thời gian sớm nhất để xác nhận lịch hẹn.
                        </p>
                        <button
                            onClick={() => setStatus("idle")}
                            className="mt-8 px-6 py-2 text-primary hover:text-primary/80 transition-colors"
                        >
                            Gửi yêu cầu khác
                        </button>
                    </div>
                ) : status === "error" ? (
                    <div className="text-center py-10">
                        <div className="w-20 h-20 bg-red-500/20 text-red-500 rounded-full flex items-center justify-center mx-auto mb-6 text-4xl">
                            ✕
                        </div>
                        <h3 className="text-2xl font-bold text-foreground mb-2">Có Lỗi Xảy Ra!</h3>
                        <p className="text-muted-foreground">
                            {errorMessage || "Vui lòng thử lại sau hoặc liên hệ trực tiếp qua hotline."}
                        </p>
                        <button
                            onClick={() => setStatus("idle")}
                            className="mt-8 px-6 py-2 text-primary hover:text-primary/80 transition-colors"
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
                                    className="w-full bg-secondary border border-border rounded-lg px-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors"
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
                                    className="w-full bg-secondary border border-border rounded-lg px-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors"
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
                                className="w-full bg-secondary border border-border rounded-lg px-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors"
                                placeholder="email@example.com"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-muted-foreground">Loại Yêu Cầu</label>
                                <select
                                    className="w-full bg-secondary border border-border rounded-lg px-4 py-3 text-foreground focus:outline-none focus:border-primary transition-colors"
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
                                    className="w-full bg-secondary border border-border rounded-lg px-4 py-3 text-foreground focus:outline-none focus:border-primary transition-colors"
                                    value={formData.model}
                                    onChange={(e) => setFormData({ ...formData, model: e.target.value })}
                                >
                                    {carOptions.length > 0 ? (
                                        carOptions.map((option) => (
                                            <option key={option.value} value={option.value}>
                                                {option.label}
                                            </option>
                                        ))
                                    ) : (
                                        <option value="" disabled>Đang tải danh sách xe...</option>
                                    )}
                                    <option value="other">Khác</option>
                                </select>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-muted-foreground">Lời Nhắn (Tùy chọn)</label>
                            <textarea
                                className="w-full bg-secondary border border-border rounded-lg px-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors min-h-[120px]"
                                placeholder="Yêu cầu hoặc câu hỏi cụ thể..."
                                value={formData.message}
                                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={status === "submitting"}
                            className="w-full py-4 bg-primary text-primary-foreground font-bold rounded-xl hover:opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed mt-4"
                        >
                            {status === "submitting" ? "Đang Gửi..." : "Gửi Yêu Cầu"}
                        </button>
                    </form>
                )}
            </div>
        </main>
    );
}
