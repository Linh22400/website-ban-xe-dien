"use client";

import { useState } from "react";
import { useAuth } from "@/lib/auth-context";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { PageHeading, FormLabel, ThemeInput } from "@/components/common/ThemeText";

export default function LoginPage() {
    const { login } = useAuth();
    const router = useRouter();
    const [formData, setFormData] = useState({
        identifier: "",
        password: ""
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [showPassword, setShowPassword] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        const success = await login(formData);

        if (success) {
            router.push("/account");
        } else {
            setError("Email hoặc mật khẩu không đúng. Vui lòng thử lại.");
        }

        setLoading(false);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData(prev => ({
            ...prev,
            [e.target.name]: e.target.value
        }));
    };

    return (
        <main className="min-h-screen bg-background pt-24 pb-20">
            <div className="container mx-auto px-6">
                <div className="max-w-md mx-auto">
                    {/* Header */}
                    <div className="text-center mb-8">
                        <PageHeading className="mb-4">Đăng Nhập</PageHeading>
                        <p className="text-muted-foreground">
                            Chào mừng bạn quay lại! Đăng nhập để quản lý tài khoản.
                        </p>
                    </div>

                    {/* Form */}
                    <div className="bg-card/50 border border-white/5 rounded-3xl p-8">
                        <form onSubmit={handleSubmit} className="space-y-6">
                            {error && (
                                <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 text-red-400 text-sm">
                                    {error}
                                </div>
                            )}

                            {/* Email */}
                            <div>
                                <FormLabel>
                                    Email
                                </FormLabel>
                                <ThemeInput
                                    type="email"
                                    name="identifier"
                                    required
                                    value={formData.identifier}
                                    onChange={handleChange}
                                    className="w-full bg-background border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-primary"
                                    placeholder="email@example.com"
                                />
                            </div>

                            {/* Password */}
                            <div>
                                <FormLabel>
                                    Mật Khẩu
                                </FormLabel>
                                <div className="relative">
                                    <ThemeInput
                                        type={showPassword ? "text" : "password"}
                                        name="password"
                                        required
                                        value={formData.password}
                                        onChange={handleChange}
                                        className="w-full bg-background border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-primary pr-12"
                                        placeholder="••••••••"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-white transition-colors"
                                    >
                                        {showPassword ? (
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                                            </svg>
                                        ) : (
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                            </svg>
                                        )}
                                    </button>
                                </div>
                            </div>

                            {/* Submit */}
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full py-4 bg-primary text-black font-bold rounded-xl hover:bg-white transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {loading ? "Đang Đăng Nhập..." : "Đăng Nhập"}
                            </button>
                        </form>

                        {/* Links */}
                        <div className="mt-6 text-center space-y-3">
                            <div className="text-sm text-muted-foreground">
                                Chưa có tài khoản?{" "}
                                <Link href="/register" className="text-primary hover:underline font-bold">
                                    Đăng ký ngay
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}
