import Link from "next/link";
import Image from "next/image";

const PROMOTIONS = [
    {
        id: 1,
        title: "Giảm 20% Cho Khách Hàng Mới",
        description: "Áp dụng cho tất cả sản phẩm xe đạp điện khi mua lần đầu",
        discount: "20%",
        validUntil: "31/12/2024",
        code: "NEW20",
        image: "https://images.unsplash.com/photo-1571333250630-f0230c320b6d?auto=format&fit=crop&q=80&w=1000",
    },
    {
        id: 2,
        title: "Mua 1 Tặng 1 Phụ Kiện",
        description: "Tặng kèm mũ bảo hiểm cao cấp khi mua xe máy điện",
        discount: "Quà Tặng",
        validUntil: "15/01/2025",
        code: "GIFT2024",
        image: "https://images.unsplash.com/photo-1558981806-ec527fa84c39?auto=format&fit=crop&q=80&w=1000",
    },
    {
        id: 3,
        title: "Trả Góp 0% Lãi Suất",
        description: "Trả góp 12 tháng không lãi suất cho tất cả sản phẩm",
        discount: "0% LS",
        validUntil: "30/11/2024",
        code: "INSTALLMENT",
        image: "https://images.unsplash.com/photo-1532298229144-0ec0c57515c7?auto=format&fit=crop&q=80&w=1000",
    },
];

export const metadata = {
    title: "Khuyến Mãi | Xe Điện Xanh",
    description: "Khám phá các chương trình khuyến mãi và ưu đãi đặc biệt cho xe điện.",
};

export default function PromotionsPage() {
    return (
        <main className="min-h-screen pt-24 pb-12 px-6 bg-background">
            <div className="container mx-auto">
                <div className="text-center mb-16">
                    <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">
                        Khuyến Mãi Đặc Biệt
                    </h1>
                    <p className="text-muted-foreground max-w-2xl mx-auto">
                        Đừng bỏ lỡ các ưu đãi hấp dẫn dành riêng cho bạn
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {PROMOTIONS.map((promo) => (
                        <div
                            key={promo.id}
                            className="group bg-card rounded-2xl overflow-hidden border border-border hover:border-primary/50 transition-all duration-300 hover:shadow-[0_0_30px_rgba(0,240,255,0.1)]"
                        >
                            <div className="aspect-video relative overflow-hidden">
                                <Image
                                    src={promo.image}
                                    alt={promo.title}
                                    fill
                                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                                />
                                <div className="absolute top-4 right-4 bg-accent px-4 py-2 rounded-full font-bold text-white text-lg shadow-lg">
                                    {promo.discount}
                                </div>
                            </div>

                            <div className="p-6">
                                <h2 className="text-2xl font-bold text-foreground mb-3 group-hover:text-primary transition-colors">
                                    {promo.title}
                                </h2>
                                <p className="text-muted-foreground mb-6">
                                    {promo.description}
                                </p>

                                <div className="space-y-3 mb-6">
                                    <div className="flex items-center gap-2 text-sm">
                                        <span className="text-muted-foreground">Mã:</span>
                                        <code className="px-3 py-1 bg-secondary rounded font-mono text-primary font-bold">
                                            {promo.code}
                                        </code>
                                    </div>
                                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                        <span>⏰</span>
                                        <span>Có hiệu lực đến: {promo.validUntil}</span>
                                    </div>
                                </div>

                                <Link
                                    href="/cars"
                                    className="block w-full py-3 bg-primary text-black font-bold rounded-xl hover:bg-white transition-colors text-center"
                                >
                                    Áp Dụng Ngay
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Terms */}
                <div className="mt-16 p-8 bg-secondary rounded-2xl border border-border">
                    <h3 className="text-xl font-bold text-foreground mb-4">Điều Khoản & Điều Kiện</h3>
                    <ul className="space-y-2 text-muted-foreground text-sm">
                        <li>• Mỗi khách hàng chỉ được sử dụng 1 mã khuyến mãi cho mỗi đơn hàng</li>
                        <li>• Không áp dụng đồng thời với các chương trình khuyến mãi khác</li>
                        <li>• Khuyến mãi có thể kết thúc sớm nếu hết số lượng</li>
                        <li>• Vui lòng xuất trình mã khuyến mãi khi thanh toán</li>
                    </ul>
                </div>
            </div>
        </main>
    );
}
