import Link from "next/link";
import { getShowrooms } from "@/lib/order-api";

export const metadata = {
    title: "Về Chúng Tôi | Xe Điện Xanh",
    description: "Tìm hiểu về sứ mệnh và tầm nhìn của chúng tôi trong việc mang đến giải pháp giao thông xanh.",
};

export const revalidate = 300;

export default async function AboutPage() {
    const showrooms = await getShowrooms();
    const topShowrooms = showrooms.slice(0, 3);

    const mapsHref = (address: string, city: string, lat?: number, lng?: number) => {
        if (Number.isFinite(lat) && Number.isFinite(lng)) {
            return `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;
        }
        const q = encodeURIComponent([address, city].filter(Boolean).join(", "));
        return `https://www.google.com/maps/search/?api=1&query=${q}`;
    };

    return (
        <main className="min-h-screen pb-12 px-6 bg-background">
            <div className="container mx-auto max-w-6xl">
                {/* Hero Section */}
                <div className="text-center mb-16">
                    <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">
                        Về Chúng Tôi
                    </h1>
                    <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                        Chúng tôi tin rằng tương lai của giao thông là xanh, sạch và bền vững.
                    </p>
                </div>

                {/* Mission & Vision */}
                <div className="grid md:grid-cols-2 gap-12 mb-20">
                    <div className="bg-card p-8 rounded-2xl border border-border">
                        <div className="text-4xl mb-4">🎯</div>
                        <h2 className="text-2xl font-bold text-white mb-4">Sứ Mệnh</h2>
                        <p className="text-muted-foreground leading-relaxed">
                            Cung cấp các giải pháp di chuyển điện hóa chất lượng cao, giúp giảm thiểu ô nhiễm môi trường
                            và mang đến trải nghiệm di chuyển an toàn, tiện lợi cho mọi người dân Việt Nam.
                        </p>
                    </div>

                    <div className="bg-card p-8 rounded-2xl border border-border">
                        <div className="text-4xl mb-4">🌟</div>
                        <h2 className="text-2xl font-bold text-white mb-4">Tầm Nhìn</h2>
                        <p className="text-muted-foreground leading-relaxed">
                            Trở thành nhà cung cấp xe điện hàng đầu Việt Nam, góp phần xây dựng một tương lai
                            với không khí trong lành và giao thông bền vững cho thế hệ mai sau.
                        </p>
                    </div>
                </div>

                {/* Values */}
                <div className="mb-20">
                    <h2 className="text-3xl font-bold text-center mb-12">Giá Trị Cốt Lõi</h2>
                    <div className="grid md:grid-cols-3 gap-8">
                        {[
                            {
                                icon: "🌱",
                                title: "Bền Vững",
                                desc: "Cam kết bảo vệ môi trường qua từng sản phẩm"
                            },
                            {
                                icon: "💎",
                                title: "Chất Lượng",
                                desc: "Sản phẩm cao cấp với công nghệ tiên tiến"
                            },
                            {
                                icon: "🤝",
                                title: "Tận Tâm",
                                desc: "Đặt khách hàng làm trung tâm trong mọi hoạt động"
                            }
                        ].map((value, i) => (
                            <div key={i} className="text-center p-6 bg-secondary rounded-xl hover:bg-card transition-colors">
                                <div className="text-5xl mb-4">{value.icon}</div>
                                <h3 className="text-xl font-bold text-white mb-3">{value.title}</h3>
                                <p className="text-muted-foreground">{value.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Stats */}
                <div className="bg-gradient-to-r from-primary/10 to-accent/10 rounded-2xl p-12 mb-20 border border-primary/20">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
                        {[
                            { number: "10,000+", label: "Khách Hàng" },
                            { number: "50+", label: "Đại Lý" },
                            { number: "15+", label: "Mẫu Xe" },
                            { number: "99%", label: "Hài Lòng" }
                        ].map((stat, i) => (
                            <div key={i}>
                                <div className="text-4xl md:text-5xl font-bold text-primary mb-2">{stat.number}</div>
                                <div className="text-muted-foreground">{stat.label}</div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Showrooms */}
                <div className="mb-20">
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
                        <div>
                            <h2 className="text-3xl font-bold">Hệ Thống Showroom</h2>
                            <p className="text-muted-foreground mt-2 max-w-2xl">
                                Đến trực tiếp showroom để xem xe, lái thử và được tư vấn cấu hình phù hợp.
                            </p>
                        </div>
                        <Link
                            href="/showrooms"
                            className="inline-flex items-center justify-center px-6 py-3 bg-card border border-border rounded-full text-foreground font-bold hover:border-primary transition-colors"
                        >
                            Xem tất cả showroom
                        </Link>
                    </div>

                    {topShowrooms.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            {topShowrooms.map((s) => (
                                <div key={s.id} className="bg-card p-6 rounded-2xl border border-border">
                                    <div className="flex items-start justify-between gap-4">
                                        <div>
                                            <div className="text-lg font-bold text-foreground">{s.Name}</div>
                                            <div className="text-sm text-muted-foreground mt-1">
                                                {s.Address}{s.City ? `, ${s.City}` : ""}
                                            </div>
                                        </div>
                                        <span className="px-3 py-1 rounded-full text-xs font-bold bg-primary/10 text-primary border border-primary/20 whitespace-nowrap">
                                            Showroom
                                        </span>
                                    </div>

                                    <div className="mt-4 flex flex-wrap items-center gap-3">
                                        {s.Phone && (
                                            <a
                                                href={`tel:${s.Phone}`}
                                                className="px-4 py-2 rounded-full bg-secondary text-foreground font-semibold border border-border hover:border-primary transition-colors"
                                            >
                                                Gọi: {s.Phone}
                                            </a>
                                        )}
                                        <a
                                            href={mapsHref(s.Address, s.City, s.Latitude, s.Longitude)}
                                            target="_blank"
                                            rel="noreferrer"
                                            className="px-4 py-2 rounded-full bg-secondary text-foreground font-semibold border border-border hover:border-primary transition-colors"
                                        >
                                            Chỉ đường
                                        </a>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="bg-card p-8 rounded-2xl border border-border text-muted-foreground">
                            Chưa có dữ liệu showroom.
                        </div>
                    )}
                </div>

                {/* Team or Story */}
                <div className="text-center">
                    <h2 className="text-3xl font-bold mb-6">Câu Chuyện Của Chúng Tôi</h2>
                    <p className="text-muted-foreground max-w-3xl mx-auto leading-relaxed mb-8">
                        Bắt đầu từ năm 2020, chúng tôi nhận thấy nhu cầu ngày càng tăng về các phương tiện giao thông
                        thân thiện với môi trường tại Việt Nam. Với đam mê về công nghệ xanh và mong muốn đóng góp
                        vào việc cải thiện chất lượng không khí, chúng tôi đã thành lập Xe Điện Xanh - nơi mang đến
                        những sản phẩm xe đạp điện và xe máy điện chất lượng cao từ các thương hiệu uy tín trên thế giới.
                    </p>
                    <p className="text-muted-foreground max-w-3xl mx-auto leading-relaxed">
                        Ngày nay, chúng tôi tự hào là đối tác tin cậy của hàng nghìn gia đình Việt Nam trong hành trình
                        chuyển đổi sang giao thông xanh.
                    </p>
                </div>
            </div>
        </main>
    );
}
