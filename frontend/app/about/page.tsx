import Link from "next/link";
import Image from "next/image";
import { getShowrooms } from "@/lib/order-api";
import { 
    MapPin, 
    Phone, 
    Award, 
    ShieldCheck, 
    Truck, 
    Users, 
    Target, 
    Zap, 
    Leaf,
    Store
} from "lucide-react";

export const metadata = {
    title: "Về Xe Điện Đức Duy | Đối Tác Chính Hãng TAILG Tại Việt Nam",
    description: "Xe Điện Đức Duy - Hệ thống phân phối xe máy điện, xe đạp điện TAILG chính hãng hàng đầu Việt Nam. Cam kết chất lượng, giá tốt nhất, bảo hành 3 năm.",
    openGraph: {
        title: "Về Xe Điện Đức Duy | Uy Tín - Chất Lượng - Tận Tâm",
        description: "Khám phá hành trình phát triển và sứ mệnh của Xe Điện Đức Duy trong việc mang đến giải pháp giao thông xanh cho người Việt.",
        images: ['/images/showroom1.png'],
    }
};

export const revalidate = 300;

export default async function AboutPage() {
    // Fallback data nếu fetch timeout hoặc failed (cho build process)
    let showrooms: any[] = [];
    try {
        // Timeout after 10s để tránh build hang
        showrooms = await Promise.race([
            getShowrooms(),
            new Promise<never>((_, reject) => 
                setTimeout(() => reject(new Error('Fetch timeout')), 10000)
            )
        ]);
    } catch (error) {
        console.warn('Showrooms fetch failed during build, using empty fallback');
        showrooms = [];
    }
    
    const topShowrooms = showrooms.slice(0, 3);

    const mapsHref = (address: string, city: string, lat?: number, lng?: number) => {
        if (Number.isFinite(lat) && Number.isFinite(lng)) {
            return `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;
        }
        const q = encodeURIComponent([address, city].filter(Boolean).join(", "));
        return `https://www.google.com/maps/search/?api=1&query=${q}`;
    };

    return (
        <main className="min-h-screen bg-background text-foreground overflow-hidden">
            {/* 1. Hero Section - Impressive Header */}
            <section className="relative h-[500px] w-full flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0 z-0">
                    <div className="absolute inset-0 bg-gradient-to-r from-black/80 to-black/40 z-10" />
                    {/* Placeholder for Hero Image - Replace src with actual image */}
                    <Image 
                        src="/images/showroom1.png"
                        alt="Showroom Xe Điện Đức Duy" 
                        fill 
                        className="object-cover"
                        priority
                    />
                </div>
                
                <div className="relative z-20 container mx-auto px-6 text-center">
                    <span className="inline-block py-1 px-3 rounded-full bg-primary/20 border border-primary/50 text-primary font-bold text-sm mb-4 backdrop-blur-md">
                        VỀ CHÚNG TÔI
                    </span>
                    <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold text-white mb-6 leading-tight">
                        Kiến Tạo Tương Lai <br/>
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-emerald-400">
                            Giao Thông Xanh
                        </span>
                    </h1>
                    <p className="text-lg md:text-xl text-gray-200 max-w-2xl mx-auto mb-8">
                        Xe Điện Đức Duy tự hào là đơn vị phân phối chính hãng các dòng xe điện TAILG uy tín hàng đầu, 
                        mang đến giải pháp di chuyển bền vững và tiết kiệm cho người Việt.
                    </p>
                </div>
            </section>

            {/* 2. Story & Introduction - Split Layout */}
            <section className="py-20 px-6 container mx-auto">
                <div className="grid md:grid-cols-2 gap-16 items-center">
                    <div className="relative">
                        <div className="relative aspect-[4/3] rounded-3xl overflow-hidden shadow-2xl border-4 border-white dark:border-white/10">
                             {/* Placeholder for Story Image */}
                             <Image 
                                src="/images/showroom1.png" 
                                alt="Đội ngũ Xe Điện Đức Duy" 
                                fill 
                                className="object-cover"
                            />
                        </div>
                        {/* Floating Badge */}
                        <div className="absolute -bottom-6 -right-6 bg-white dark:bg-card p-6 rounded-2xl shadow-xl border border-primary/20 max-w-[200px]">
                            <div className="text-4xl font-bold text-primary mb-1">5+</div>
                            <div className="text-sm text-muted-foreground font-medium">Năm kinh nghiệm trong lĩnh vực xe điện</div>
                        </div>
                    </div>
                    
                    <div className="space-y-6">
                        <h2 className="text-3xl md:text-4xl font-bold">
                            Hành Trình Mang <span className="text-primary">Xe Điện Chất Lượng</span> Đến Mọi Nhà
                        </h2>
                        <div className="space-y-4 text-muted-foreground leading-relaxed text-lg">
                            <p>
                                Thành lập với sứ mệnh tiên phong trong cuộc cách mạng giao thông xanh, 
                                <strong> Xe Điện Đức Duy</strong> không ngừng nỗ lực để trở thành cầu nối uy tín giữa các thương hiệu xe điện hàng đầu thế giới và người tiêu dùng Việt Nam.
                            </p>
                            <p>
                                Chúng tôi hiểu rằng, một chiếc xe không chỉ là phương tiện di chuyển, mà còn là người bạn đồng hành an toàn và tin cậy. 
                                Chính vì thế, Đức Duy lựa chọn hợp tác chiến lược với <strong>TAILG</strong> - Tập đoàn xe điện top đầu thế giới, để đảm bảo mỗi sản phẩm đến tay khách hàng đều đạt chuẩn chất lượng quốc tế.
                            </p>
                        </div>
                        
                        <div className="pt-4 grid grid-cols-2 gap-6">
                            <div className="flex items-start gap-3">
                                <div className="p-2 rounded-lg bg-primary/10 text-primary">
                                    <Target className="w-6 h-6" />
                                </div>
                                <div>
                                    <h4 className="font-bold text-foreground">Tầm Nhìn</h4>
                                    <p className="text-sm text-muted-foreground mt-1">Trở thành hệ thống bán lẻ xe điện số 1 Việt Nam về chất lượng dịch vụ.</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <div className="p-2 rounded-lg bg-primary/10 text-primary">
                                    <Leaf className="w-6 h-6" />
                                </div>
                                <div>
                                    <h4 className="font-bold text-foreground">Sứ Mệnh</h4>
                                    <p className="text-sm text-muted-foreground mt-1">Phổ cập giao thông xanh, giảm thiểu khí thải và bảo vệ môi trường.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* 3. Why Choose Us (USPs) - Grid */}
            <section className="py-20 bg-secondary/30">
                <div className="container mx-auto px-6">
                    <div className="text-center max-w-3xl mx-auto mb-16">
                        <span className="text-primary font-bold tracking-wider uppercase text-sm">Tại Sao Chọn Chúng Tôi</span>
                        <h2 className="text-3xl md:text-4xl font-bold mt-2 mb-4">Giá Trị Khác Biệt Tại Đức Duy</h2>
                        <p className="text-muted-foreground">
                            Chúng tôi cam kết mang lại những giá trị thực tế nhất cho khách hàng thông qua sản phẩm chất lượng và dịch vụ tận tâm.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {[
                            {
                                icon: <Award className="w-10 h-10" />,
                                title: "Cam Kết Chính Hãng 100%",
                                desc: "Là đối tác phân phối chính thức của TAILG và các thương hiệu lớn. Hoàn tiền 200% nếu phát hiện hàng giả."
                            },
                            {
                                icon: <ShieldCheck className="w-10 h-10" />,
                                title: "Bảo Hành Vượt Trội",
                                desc: "Chính sách bảo hành lên đến 3 năm cho động cơ và khung sườn. Bảo dưỡng định kỳ miễn phí trọn đời."
                            },
                            {
                                icon: <Truck className="w-10 h-10" />,
                                title: "Giao Hàng & Cứu Hộ",
                                desc: "Giao xe tận nhà miễn phí trong nội thành. Dịch vụ cứu hộ xe điện 24/7 sẵn sàng hỗ trợ mọi lúc mọi nơi."
                            },
                            {
                                icon: <Zap className="w-10 h-10" />,
                                title: "Công Nghệ Tiên Tiến",
                                desc: "Sản phẩm luôn được cập nhật các công nghệ pin, động cơ mới nhất, tiết kiệm năng lượng và bền bỉ."
                            },
                            {
                                icon: <Phone className="w-10 h-10" />,
                                title: "Tư Vấn Tận Tâm",
                                desc: "Đội ngũ nhân viên am hiểu kỹ thuật, tư vấn trung thực, giúp bạn chọn được chiếc xe phù hợp nhất."
                            },
                            {
                                icon: <Users className="w-10 h-10" />,
                                title: "Cộng Đồng Lớn Mạnh",
                                desc: "Gia nhập cộng đồng hàng nghìn khách hàng thân thiết với nhiều ưu đãi và hoạt động giao lưu bổ ích."
                            }
                        ].map((item, idx) => (
                            <div key={idx} className="bg-background p-8 rounded-2xl border border-border hover:border-primary/50 hover:shadow-lg transition-all group">
                                <div className="w-16 h-16 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                    {item.icon}
                                </div>
                                <h3 className="text-xl font-bold mb-3 group-hover:text-primary transition-colors">{item.title}</h3>
                                <p className="text-muted-foreground leading-relaxed">{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* 4. Stats Section - Dark Mode/Highlight */}
            <section className="py-16 bg-primary text-primary-foreground">
                <div className="container mx-auto px-6">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center divide-x divide-white/20">
                        {[
                            { number: "10,000+", label: "Khách Hàng Tin Dùng" },
                            { number: "50+", label: "Đại Lý & Showroom" },
                            { number: "100%", label: "Sản Phẩm Chính Hãng" },
                            { number: "24/7", label: "Hỗ Trợ Kỹ Thuật" }
                        ].map((stat, i) => (
                            <div key={i} className="px-4">
                                <div className="text-4xl md:text-5xl font-extrabold mb-2 text-white">{stat.number}</div>
                                <div className="text-white/80 font-medium">{stat.label}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* 5. Showrooms Section - Clean & Direct */}
            <section className="py-20 container mx-auto px-6">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
                    <div>
                        <span className="text-primary font-bold tracking-wider uppercase text-sm">Mạng Lưới Phân Phối</span>
                        <h2 className="text-3xl font-bold mt-2">Hệ Thống Showroom</h2>
                        <p className="text-muted-foreground mt-2 max-w-2xl">
                            Trải nghiệm thực tế sản phẩm tại hệ thống showroom hiện đại của chúng tôi.
                        </p>
                    </div>
                    <Link
                        href="/showrooms"
                        className="inline-flex items-center justify-center px-6 py-3 bg-foreground text-background font-bold rounded-full hover:bg-foreground/90 transition-all hover:scale-105"
                    >
                        <MapPin className="w-4 h-4 mr-2" />
                        Tìm Showroom Gần Bạn
                    </Link>
                </div>

                {topShowrooms.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {topShowrooms.map((s) => {
                             // Try to resolve image URL from various Strapi formats
                             const imageUrl = s.Images?.[0]?.url || s.Images?.url || (typeof s.Images === 'string' ? s.Images : null);
                             
                             return (
                            <div key={s.id} className="group bg-card rounded-2xl overflow-hidden border border-border hover:shadow-xl transition-all">
                                {/* Showroom Image / Placeholder */}
                                <div className="h-48 bg-secondary relative overflow-hidden">
                                    {imageUrl ? (
                                        <Image 
                                            src={imageUrl} 
                                            alt={s.Name} 
                                            fill 
                                            className="object-cover transition-transform duration-500 group-hover:scale-110"
                                        />
                                    ) : (
                                        <div className="absolute inset-0 bg-muted/50 flex flex-col items-center justify-center text-muted-foreground group-hover:bg-muted transition-colors">
                                            <Store className="w-12 h-12 opacity-20 mb-2" />
                                            <span className="text-xs font-medium opacity-40">Ảnh Showroom</span>
                                        </div>
                                    )}
                                </div>
                                
                                <div className="p-6">
                                    <div className="flex items-start justify-between mb-4">
                                        <h3 className="text-lg font-bold text-foreground line-clamp-1">{s.Name}</h3>
                                        <span className="flex-shrink-0 px-2.5 py-0.5 rounded-full text-xs font-bold bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">
                                            Mở cửa
                                        </span>
                                    </div>
                                    
                                    <div className="space-y-3 mb-6">
                                        <div className="flex items-start gap-3 text-sm text-muted-foreground">
                                            <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
                                            <span>{s.Address}{s.City ? `, ${s.City}` : ""}</span>
                                        </div>
                                        {s.Phone && (
                                            <div className="flex items-center gap-3 text-sm text-muted-foreground">
                                                <Phone className="w-4 h-4 flex-shrink-0" />
                                                <span>{s.Phone}</span>
                                            </div>
                                        )}
                                    </div>

                                    <div className="grid grid-cols-2 gap-3">
                                        <a
                                            href={`tel:${s.Phone}`}
                                            className="flex items-center justify-center px-4 py-2 rounded-lg bg-secondary text-foreground text-sm font-semibold hover:bg-secondary/80 transition-colors"
                                        >
                                            Gọi điện
                                        </a>
                                        <a
                                            href={mapsHref(s.Address, s.City, s.Latitude, s.Longitude)}
                                            target="_blank"
                                            rel="noreferrer"
                                            className="flex items-center justify-center px-4 py-2 rounded-lg bg-primary/10 text-primary text-sm font-semibold hover:bg-primary/20 transition-colors"
                                        >
                                            Chỉ đường
                                        </a>
                                    </div>
                                </div>
                            </div>
                        )})}
                    </div>
                ) : (
                    <div className="text-center py-12 bg-secondary/30 rounded-2xl border border-dashed border-border">
                        <MapPin className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                        <p className="text-muted-foreground">Đang cập nhật danh sách showroom...</p>
                    </div>
                )}
            </section>

            {/* 6. CTA Footer */}
            <section className="py-24 relative overflow-hidden">
                {/* Modern Background with Gradient & Blur */}
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-secondary/50 z-0"></div>
                
                {/* Abstract Shapes */}
                <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl -translate-y-1/2 pointer-events-none"></div>
                <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl translate-y-1/2 pointer-events-none"></div>

                <div className="container mx-auto px-6 relative z-10">
                    <div className="max-w-3xl mx-auto text-center">
                        <span className="inline-block py-1 px-3 rounded-full bg-primary/10 text-primary font-bold text-sm mb-6">
                            BẮT ĐẦU NGAY
                        </span>
                        <h2 className="text-4xl md:text-5xl font-bold mb-6 text-foreground tracking-tight">
                            Sẵn Sàng Cho <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-emerald-600">Hành Trình Xanh?</span>
                        </h2>
                        <p className="text-xl text-muted-foreground mb-10 leading-relaxed">
                            Đến ngay showroom gần nhất để trải nghiệm thực tế hoặc liên hệ với chúng tôi để được tư vấn miễn phí giải pháp di chuyển tiết kiệm nhất.
                        </p>
                        
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                            <Link
                                href="/cars?type=motorcycle"
                                className="w-full sm:w-auto px-8 py-4 bg-primary text-primary-foreground font-bold rounded-full hover:bg-primary/90 transition-all transform hover:scale-105 shadow-lg shadow-primary/25"
                            >
                                Xem Sản Phẩm
                            </Link>
                            <Link
                                href="/contact"
                                className="w-full sm:w-auto px-8 py-4 bg-background border border-input text-foreground font-bold rounded-full hover:bg-secondary hover:border-primary/50 transition-all shadow-sm"
                            >
                                Liên Hệ Ngay
                            </Link>
                        </div>
                    </div>
                </div>
            </section>
        </main>
    );
}
