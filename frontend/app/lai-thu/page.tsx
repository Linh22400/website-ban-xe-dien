import TestDriveForm from "@/components/forms/TestDriveForm";
import Link from "next/link";

export default function TestDrivePage() {
    return (
        <main className="min-h-screen bg-background pt-24 pb-20">
            {/* Hero Section */}
            <div className="relative bg-gradient-to-br from-primary/20 via-background to-accent/20 border-b border-white/5 py-16 mb-12 overflow-hidden">
                {/* Decorative Elements */}
                <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-primary/10 to-transparent blur-3xl" />
                <div className="absolute bottom-0 left-0 w-1/3 h-1/2 bg-gradient-to-tr from-accent/10 to-transparent blur-3xl" />

                <div className="container mx-auto px-6 relative z-10">
                    <div className="max-w-3xl mx-auto text-center">
                        <div className="inline-block px-4 py-2 bg-primary/10 border border-primary/20 rounded-full text-primary text-sm font-bold mb-6">
                            🚗 Trải Nghiệm Thực Tế
                        </div>
                        <h1 className="text-5xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6">
                            Đăng Ký Lái Thử <span className="text-primary">Miễn Phí</span>
                        </h1>
                        <p className="text-xl text-muted-foreground mb-4">
                            Cảm nhận sức mạnh và công nghệ hiện đại của xe điện. Đặt lịch ngay hôm nay!
                        </p>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground justify-center">
                            <Link href="/" className="hover:text-primary transition-colors">Trang Chủ</Link>
                            <span>/</span>
                            <span className="text-gray-900 dark:text-white">Lái Thử</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-6">
                <div className="grid lg:grid-cols-3 gap-12">
                    {/* Benefits Section */}
                    <div className="lg:col-span-1 space-y-6">
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Tại Sao Nên Lái Thử?</h2>

                        <div className="space-y-4">
                            {[
                                {
                                    icon: "⚡",
                                    title: "Cảm Nhận Sức Mạnh",
                                    desc: "Trải nghiệm gia tốc êm ái và mạnh mẽ của động cơ điện."
                                },
                                {
                                    icon: "🔇",
                                    title: "Vận Hành Êm Ái",
                                    desc: "Không tiếng ồn động cơ, chỉ có sự yên tĩnh tuyệt đối."
                                },
                                {
                                    icon: "🎛️",
                                    title: "Công Nghệ Thông Minh",
                                    desc: "Dùng thử các tính năng hiện đại như màn hình cảm ứng, kết nối điện thoại."
                                },
                                {
                                    icon: "💰",
                                    title: "Tiết Kiệm Chi Phí",
                                    desc: "So sánh chi phí vận hành với xe xăng truyền thống."
                                },
                                {
                                    icon: "🌱",
                                    title: "Thân Thiện Môi Trường",
                                    desc: "Góp phần bảo vệ không khí trong lành cho thành phố."
                                }
                            ].map((benefit, i) => (
                                <div key={i} className="flex gap-4 p-4 bg-card/30 rounded-xl border border-white/5 hover:border-primary/30 transition-colors">
                                    <div className="text-3xl">{benefit.icon}</div>
                                    <div>
                                        <h3 className="font-bold text-gray-900 dark:text-white mb-1">{benefit.title}</h3>
                                        <p className="text-sm text-muted-foreground">{benefit.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Trust Indicators */}
                        <div className="bg-gradient-to-br from-primary/10 to-accent/10 border border-white/5 rounded-2xl p-6 mt-8">
                            <h3 className="font-bold text-gray-900 dark:text-white mb-4">Cam Kết Của Chúng Tôi</h3>
                            <ul className="space-y-2 text-sm text-muted-foreground">
                                <li className="flex items-center gap-2">
                                    <span className="text-primary">✓</span> Hoàn toàn miễn phí
                                </li>
                                <li className="flex items-center gap-2">
                                    <span className="text-primary">✓</span> Nhân viên hướng dẫn chuyên nghiệp
                                </li>
                                <li className="flex items-center gap-2">
                                    <span className="text-primary">✓</span> Bảo hiểm đầy đủ
                                </li>
                                <li className="flex items-center gap-2">
                                    <span className="text-primary">✓</span> Linh hoạt thời gian
                                </li>
                            </ul>
                        </div>
                    </div>

                    {/* Form Section */}
                    <div className="lg:col-span-2">
                        <div className="bg-card/50 backdrop-blur-sm border border-white/5 rounded-3xl p-8">
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Đăng Ký Ngay</h2>
                            <TestDriveForm />
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}
