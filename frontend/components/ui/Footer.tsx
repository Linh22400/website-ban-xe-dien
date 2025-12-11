import Link from "next/link";
import { Mail, Phone, MapPin, Clock, Facebook, Instagram, Youtube, Send } from "lucide-react";

export default function Footer() {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="bg-card border-t border-white/10">
            {/* Newsletter Section */}
            <div className="border-b border-white/10 bg-gradient-to-r from-primary/5 to-accent/5">
                <div className="container mx-auto px-6 py-8">
                    <div className="max-w-2xl mx-auto text-center">
                        <h3 className="text-2xl font-bold text-foreground mb-2">
                            Đăng Ký Nhận Tin Khuyến Mãi
                        </h3>
                        <p className="text-muted-foreground mb-4 text-sm">
                            Nhận thông tin sản phẩm mới, ưu đãi độc quyền ngay vào email của bạn
                        </p>
                        <form className="flex gap-2 max-w-md mx-auto">
                            <input
                                type="email"
                                placeholder="Nhập email của bạn..."
                                className="flex-1 px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors"
                            />
                            <button
                                type="submit"
                                className="px-6 py-3 bg-gradient-to-r from-primary to-accent text-black font-bold rounded-xl hover:shadow-lg hover:shadow-primary/30 transition-all flex items-center gap-2"
                            >
                                <Send className="w-4 h-4" />
                                Đăng Ký
                            </button>
                        </form>
                    </div>
                </div>
            </div>

            {/* Main Footer Content */}
            <div className="container mx-auto px-6 py-12">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-8">
                    {/* Column 1: Brand & Social */}
                    <div className="lg:col-span-1">
                        <h3 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent mb-4">
                            XE ĐIỆN XANH
                        </h3>
                        <p className="text-muted-foreground text-sm mb-4">
                            Cung cấp xe điện chính hãng từ các thương hiệu hàng đầu. Chất lượng - Uy tín - Giá tốt.
                        </p>
                        <div className="flex gap-3">
                            <a
                                href="https://facebook.com"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-10 h-10 bg-white/5 hover:bg-primary/10 border border-white/10 hover:border-primary rounded-lg flex items-center justify-center text-muted-foreground hover:text-primary transition-all"
                            >
                                <Facebook className="w-5 h-5" />
                            </a>
                            <a
                                href="https://instagram.com"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-10 h-10 bg-white/5 hover:bg-primary/10 border border-white/10 hover:border-primary rounded-lg flex items-center justify-center text-muted-foreground hover:text-primary transition-all"
                            >
                                <Instagram className="w-5 h-5" />
                            </a>
                            <a
                                href="https://youtube.com"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-10 h-10 bg-white/5 hover:bg-primary/10 border border-white/10 hover:border-primary rounded-lg flex items-center justify-center text-muted-foreground hover:text-primary transition-all"
                            >
                                <Youtube className="w-5 h-5" />
                            </a>
                        </div>
                    </div>

                    {/* Column 2: Products */}
                    <div>
                        <h4 className="font-bold text-foreground mb-4 text-sm uppercase tracking-wider">Sản Phẩm</h4>
                        <ul className="space-y-3 text-sm">
                            <li>
                                <Link href="/cars?type=motorcycle" className="text-muted-foreground hover:text-primary transition-colors">
                                    Xe Máy Điện
                                </Link>
                            </li>
                            <li>
                                <Link href="/cars?type=bicycle" className="text-muted-foreground hover:text-primary transition-colors">
                                    Xe Đạp Điện
                                </Link>
                            </li>
                            <li>
                                <Link href="/accessories" className="text-muted-foreground hover:text-primary transition-colors">
                                    Phụ Kiện & Đồ Bảo Hộ
                                </Link>
                            </li>
                            <li>
                                <Link href="/promotions" className="text-muted-foreground hover:text-primary transition-colors">
                                    Khuyến Mãi Hot
                                </Link>
                            </li>
                            <li>
                                <Link href="/compare" className="text-muted-foreground hover:text-primary transition-colors">
                                    So Sánh Sản Phẩm
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Column 3: Support */}
                    <div>
                        <h4 className="font-bold text-foreground mb-4 text-sm uppercase tracking-wider">Hỗ Trợ</h4>
                        <ul className="space-y-3 text-sm">
                            <li>
                                <Link href="/faq" className="text-muted-foreground hover:text-primary transition-colors">
                                    Câu Hỏi Thường Gặp
                                </Link>
                            </li>
                            <li>
                                <Link href="/warranty" className="text-muted-foreground hover:text-primary transition-colors">
                                    Chính Sách Bảo Hành
                                </Link>
                            </li>
                            <li>
                                <Link href="/tracking" className="text-muted-foreground hover:text-primary transition-colors">
                                    Tra Cứu Đơn Hàng
                                </Link>
                            </li>
                            <li>
                                <Link href="/service-centers" className="text-muted-foreground hover:text-primary transition-colors">
                                    Trung Tâm Bảo Dưỡng
                                </Link>
                            </li>
                            <li>
                                <Link href="/contact" className="text-muted-foreground hover:text-primary transition-colors">
                                    Liên Hệ & Hỗ Trợ
                                </Link>
                            </li>
                            <li>
                                <Link href="/blog" className="text-muted-foreground hover:text-primary transition-colors">
                                    Blog & Tin Tức
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Column 4: Legal */}
                    <div>
                        <h4 className="font-bold text-foreground mb-4 text-sm uppercase tracking-wider">Chính Sách</h4>
                        <ul className="space-y-3 text-sm">
                            <li>
                                <Link href="/privacy-policy" className="text-muted-foreground hover:text-primary transition-colors">
                                    Chính Sách Bảo Mật
                                </Link>
                            </li>
                            <li>
                                <Link href="/terms-of-service" className="text-muted-foreground hover:text-primary transition-colors">
                                    Điều Khoản Sử Dụng
                                </Link>
                            </li>
                            <li>
                                <Link href="/return-policy" className="text-muted-foreground hover:text-primary transition-colors">
                                    Chính Sách Đổi Trả
                                </Link>
                            </li>
                            <li>
                                <Link href="/shipping-policy" className="text-muted-foreground hover:text-primary transition-colors">
                                    Chính Sách Vận Chuyển
                                </Link>
                            </li>
                            <li>
                                <Link href="/payment-guide" className="text-muted-foreground hover:text-primary transition-colors">
                                    Hướng Dẫn Thanh Toán
                                </Link>
                            </li>
                            <li>
                                <Link href="/about" className="text-muted-foreground hover:text-primary transition-colors">
                                    Về Chúng Tôi
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Column 5: Contact */}
                    <div>
                        <h4 className="font-bold text-foreground mb-4 text-sm uppercase tracking-wider">Liên Hệ</h4>
                        <ul className="space-y-3 text-sm text-muted-foreground">
                            <li className="flex items-start gap-2">
                                <Phone className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                                <div>
                                    <div className="font-semibold text-foreground">Hotline</div>
                                    <a href="tel:1900xxxx" className="hover:text-primary transition-colors">
                                        1900 XXXX (Miễn phí)
                                    </a>
                                </div>
                            </li>
                            <li className="flex items-start gap-2">
                                <Mail className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                                <div>
                                    <div className="font-semibold text-foreground">Email</div>
                                    <a href="mailto:support@xedienviet.com" className="hover:text-primary transition-colors">
                                        support@xedienviet.com
                                    </a>
                                </div>
                            </li>
                            <li className="flex items-start gap-2">
                                <MapPin className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                                <div>
                                    <div className="font-semibold text-foreground">Địa Chỉ</div>
                                    <span>123 Đường ABC, Quận 1<br />TP. Hồ Chí Minh</span>
                                </div>
                            </li>
                            <li className="flex items-start gap-2">
                                <Clock className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                                <div>
                                    <div className="font-semibold text-foreground">Giờ Làm Việc</div>
                                    <span>T2-T6: 8:00 - 18:00<br />T7-CN: 8:00 - 17:00</span>
                                </div>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Payment Methods & Shipping Partners */}
                <div className="border-t border-white/10 pt-8 mb-8">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {/* Payment Methods */}
                        <div>
                            <h4 className="text-foreground font-bold text-sm mb-4 uppercase tracking-wider flex items-center gap-2">
                                <div className="w-1 h-5 bg-gradient-to-b from-primary to-accent rounded-full"></div>
                                Phương Thức Thanh Toán
                            </h4>
                            <div className="grid grid-cols-3 gap-2">
                                <div className="bg-white/5 hover:bg-white/10 border border-white/10 hover:border-primary/30 rounded-lg p-3 transition-all text-center">
                                    <div className="text-foreground font-bold text-xs">VISA</div>
                                </div>
                                <div className="bg-white/5 hover:bg-white/10 border border-white/10 hover:border-primary/30 rounded-lg p-3 transition-all text-center">
                                    <div className="text-foreground font-bold text-xs">MasterCard</div>
                                </div>
                                <div className="bg-white/5 hover:bg-white/10 border border-white/10 hover:border-primary/30 rounded-lg p-3 transition-all text-center">
                                    <div className="text-foreground font-bold text-xs">MoMo</div>
                                </div>
                                <div className="bg-white/5 hover:bg-white/10 border border-white/10 hover:border-primary/30 rounded-lg p-3 transition-all text-center">
                                    <div className="text-foreground font-bold text-xs">ZaloPay</div>
                                </div>
                                <div className="bg-white/5 hover:bg-white/10 border border-white/10 hover:border-primary/30 rounded-lg p-3 transition-all text-center">
                                    <div className="text-foreground font-bold text-xs">Ngân Hàng</div>
                                </div>
                                <div className="bg-white/5 hover:bg-white/10 border border-white/10 hover:border-primary/30 rounded-lg p-3 transition-all text-center">
                                    <div className="text-foreground font-bold text-xs">Tiền Mặt</div>
                                </div>
                            </div>
                        </div>

                        {/* Shipping Partners */}
                        <div>
                            <h4 className="text-foreground font-bold text-sm mb-4 uppercase tracking-wider flex items-center gap-2">
                                <div className="w-1 h-5 bg-gradient-to-b from-accent to-primary rounded-full"></div>
                                Đơn Vị Vận Chuyển
                            </h4>
                            <div className="grid grid-cols-2 gap-2">
                                <div className="bg-white/5 hover:bg-white/10 border border-white/10 hover:border-accent/30 rounded-lg p-3 transition-all text-center">
                                    <div className="text-foreground font-bold text-xs">Giao Hàng Nhanh</div>
                                </div>
                                <div className="bg-white/5 hover:bg-white/10 border border-white/10 hover:border-accent/30 rounded-lg p-3 transition-all text-center">
                                    <div className="text-foreground font-bold text-xs">Grab Express</div>
                                </div>
                                <div className="bg-white/5 hover:bg-white/10 border border-white/10 hover:border-accent/30 rounded-lg p-3 transition-all text-center">
                                    <div className="text-foreground font-bold text-xs">GHTK</div>
                                </div>
                                <div className="bg-white/5 hover:bg-white/10 border border-white/10 hover:border-accent/30 rounded-lg p-3 transition-all text-center">
                                    <div className="text-foreground font-bold text-xs">Viettel Post</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Brand Partners */}
                <div className="border-t border-white/10 pt-8 pb-4">
                    <div className="text-center mb-6">
                        <h4 className="text-foreground font-bold text-sm uppercase tracking-wider mb-1 inline-flex items-center gap-2">
                            <div className="w-8 h-px bg-gradient-to-r from-transparent via-primary to-transparent"></div>
                            Thương Hiệu Chính Hãng
                            <div className="w-8 h-px bg-gradient-to-r from-transparent via-accent to-transparent"></div>
                        </h4>
                        <p className="text-xs text-muted-foreground mt-1">Đại lý ủy quyền chính thức</p>
                    </div>
                    <div className="flex flex-wrap justify-center gap-3">
                        <div className="px-6 py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-primary/30 rounded-lg transition-all">
                            <span className="text-foreground font-bold text-sm">VinFast</span>
                        </div>
                        <div className="px-6 py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-primary/30 rounded-lg transition-all">
                            <span className="text-foreground font-bold text-sm">Yadea</span>
                        </div>
                        <div className="px-6 py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-primary/30 rounded-lg transition-all">
                            <span className="text-foreground font-bold text-sm">Giant</span>
                        </div>
                        <div className="px-6 py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-primary/30 rounded-lg transition-all">
                            <span className="text-foreground font-bold text-sm">Pega</span>
                        </div>
                        <div className="px-6 py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-primary/30 rounded-lg transition-all">
                            <span className="text-foreground font-bold text-sm">Dibao</span>
                        </div>
                        <div className="px-6 py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-primary/30 rounded-lg transition-all">
                            <span className="text-foreground font-bold text-sm">Dat Bike</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom Bar */}
            <div className="border-t border-white/10 bg-secondary">
                <div className="container mx-auto px-6 py-6">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-muted-foreground">
                        <p>
                            © {currentYear} Xe Điện Xanh. Bảo lưu mọi quyền.
                        </p>
                        <div className="flex items-center gap-4">
                            <span className="text-xs">
                                🔒 Giao dịch an toàn & bảo mật
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
}
