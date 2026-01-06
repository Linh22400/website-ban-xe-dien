"use client";

import { useState, useEffect } from "react";
import { getCars, submitLead, Car } from "@/lib/api";
import { useAuth } from "@/lib/auth-context";
import Link from "next/link";

export default function TestDriveForm() {
    const { user, isAuthenticated } = useAuth();
    const [cars, setCars] = useState<Car[]>([]);
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        carSlug: "",
        showroom: "",
        preferredDate: "",
        preferredTime: "",
        notes: ""
    });

    useEffect(() => {
        // Fetch available cars
        getCars({ pageSize: 100 }).then(setCars);
    }, []);

    // Auto-fill form if user is logged in
    useEffect(() => {
        if (user) {
            setFormData(prev => ({
                ...prev,
                name: user.username,
                email: user.email
            }));
        }
    }, [user]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setErrorMessage(null);

        const selectedCar = cars.find(c => c.slug === formData.carSlug);

        // Pack test drive info into message field
        const message = `[Yêu cầu lái thử]
Showroom: ${formData.showroom}
Ngày mong muốn: ${formData.preferredDate}
Giờ mong muốn: ${formData.preferredTime}
Ghi chú: ${formData.notes || "Không có"}`;

        try {
            await submitLead({
                name: formData.name,
                email: formData.email,
                phone: formData.phone,
                type: "test-drive",
                model: selectedCar?.name || formData.carSlug,
                message,
                users_permissions_user: user?.id // Link to user if logged in
            });
            setSuccess(true);
            setFormData({
                name: user?.username || "",
                email: user?.email || "",
                phone: "",
                carSlug: "",
                showroom: "",
                preferredDate: "",
                preferredTime: "",
                notes: ""
            });

            // Reset success message after 5 seconds
            setTimeout(() => setSuccess(false), 5000);
        } catch (error) {
            console.error('submitLead failed:', error);
            setErrorMessage(error instanceof Error ? error.message : 'Có lỗi xảy ra. Vui lòng thử lại sau.');
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        setFormData(prev => ({
            ...prev,
            [e.target.name]: e.target.value
        }));
    };

    // Show login requirement if not authenticated
    if (!isAuthenticated) {
        return (
            <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-2xl p-8 text-center">
                <div className="text-5xl mb-4">🔒</div>
                <h3 className="text-2xl font-bold text-white mb-2">Yêu Cầu Đăng Nhập</h3>
                <p className="text-muted-foreground mb-6">
                    Bạn cần đăng nhập để đăng ký lái thử. Điều này giúp chúng tôi theo dõi và phản hồi yêu cầu của bạn tốt hơn.
                </p>
                <div className="flex gap-4 justify-center">
                    <Link
                        href="/login"
                        className="px-6 py-3 bg-primary text-black font-bold rounded-full hover:bg-white transition-all"
                    >
                        Đăng Nhập
                    </Link>
                    <Link
                        href="/register"
                        className="px-6 py-3 border border-white/20 text-white font-bold rounded-full hover:bg-white/10 transition-all"
                    >
                        Đăng Ký
                    </Link>
                </div>
            </div>
        );
    }

    if (success) {
        return (
            <div className="bg-green-500/10 border border-green-500/30 rounded-2xl p-8 text-center">
                <div className="text-5xl mb-4">✅</div>
                <h3 className="text-2xl font-bold text-white mb-2">Đăng Ký Thành Công!</h3>
                <p className="text-muted-foreground mb-6">
                    Cảm ơn bạn đã đăng ký lái thử. Chúng tôi sẽ liên hệ với bạn trong thời gian sớm nhất.
                </p>
                <button
                    onClick={() => setSuccess(false)}
                    className="px-6 py-3 bg-primary text-black font-bold rounded-full hover:bg-white transition-all"
                >
                    Đăng Ký Lại
                </button>
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
                {/* Name */}
                <div>
                    <label className="block text-sm font-bold text-white mb-2">
                        Họ và Tên <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="text"
                        name="name"
                        required
                        value={formData.name}
                        onChange={handleChange}
                        className="w-full bg-background border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary"
                        placeholder="Nguyễn Văn A"
                    />
                </div>

                {/* Email */}
                <div>
                    <label className="block text-sm font-bold text-white mb-2">
                        Email <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="email"
                        name="email"
                        required
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full bg-background border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary"
                        placeholder="email@example.com"
                    />
                </div>

                {/* Phone */}
                <div>
                    <label className="block text-sm font-bold text-white mb-2">
                        Số Điện Thoại <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="tel"
                        name="phone"
                        required
                        value={formData.phone}
                        onChange={handleChange}
                        className="w-full bg-background border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary"
                        placeholder="0901234567"
                    />
                </div>

                {/* Car Model */}
                <div>
                    <label className="block text-sm font-bold text-white mb-2">
                        Mẫu Xe Muốn Thử <span className="text-red-500">*</span>
                    </label>
                    <select
                        name="carSlug"
                        required
                        value={formData.carSlug}
                        onChange={handleChange}
                        className="w-full bg-background border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary"
                    >
                        <option value="">-- Chọn mẫu xe --</option>
                        {cars.map(car => (
                            <option key={car.id} value={car.slug}>
                                {car.name} ({car.brand})
                            </option>
                        ))}
                    </select>
                </div>

                {/* Showroom */}
                <div>
                    <label className="block text-sm font-bold text-white mb-2">
                        Showroom <span className="text-red-500">*</span>
                    </label>
                    <select
                        name="showroom"
                        required
                        value={formData.showroom}
                        onChange={handleChange}
                        className="w-full bg-background border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary"
                    >
                        <option value="">-- Chọn showroom --</option>
                        <option value="Hà Nội">Hà Nội</option>
                        <option value="TP. Hồ Chí Minh">TP. Hồ Chí Minh</option>
                        <option value="Đà Nẵng">Đà Nẵng</option>
                        <option value="Cần Thơ">Cần Thơ</option>
                        <option value="Hải Phòng">Hải Phòng</option>
                    </select>
                </div>

                {/* Preferred Date */}
                <div>
                    <label className="block text-sm font-bold text-white mb-2">
                        Ngày Mong Muốn <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="date"
                        name="preferredDate"
                        required
                        value={formData.preferredDate}
                        onChange={handleChange}
                        className="w-full bg-background border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary"
                    />
                </div>

                {/* Preferred Time */}
                <div>
                    <label className="block text-sm font-bold text-white mb-2">
                        Giờ Mong Muốn <span className="text-red-500">*</span>
                    </label>
                    <select
                        name="preferredTime"
                        required
                        value={formData.preferredTime}
                        onChange={handleChange}
                        className="w-full bg-background border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary"
                    >
                        <option value="">-- Chọn giờ --</option>
                        <option value="08:00 - 10:00">08:00 - 10:00</option>
                        <option value="10:00 - 12:00">10:00 - 12:00</option>
                        <option value="14:00 - 16:00">14:00 - 16:00</option>
                        <option value="16:00 - 18:00">16:00 - 18:00</option>
                    </select>
                </div>
            </div>

            {/* Notes */}
            <div>
                <label className="block text-sm font-bold text-white mb-2">
                    Ghi Chú
                </label>
                <textarea
                    name="notes"
                    value={formData.notes}
                    onChange={handleChange}
                    rows={4}
                    className="w-full bg-background border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary resize-none"
                    placeholder="Thông tin bổ sung (nếu có)..."
                />
            </div>

            {/* Submit Button */}
            <button
                type="submit"
                disabled={loading}
                className="w-full py-4 bg-primary text-black font-bold rounded-xl hover:bg-white transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
                {loading ? "Đang Gửi..." : "Đăng Ký Lái Thử Ngay"}
            </button>

            {errorMessage && (
                <div className="text-sm text-red-500">
                    {errorMessage}
                </div>
            )}
        </form>
    );
}
