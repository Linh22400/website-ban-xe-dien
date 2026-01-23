import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import "./responsive.css";
import Navbar from "@/components/ui/Navbar";
import Footer from "@/components/ui/Footer";
import { AuthProvider } from "@/lib/auth-context";
import { CompareProvider } from "@/lib/compare-context";
import { CartProvider } from "@/lib/cart-context";
import { WishlistProvider } from "@/lib/wishlist-context";
import { ThemeProvider } from "@/contexts/ThemeContext";
import CompareFloatingBar from "@/components/compare/CompareFloatingBar";
import KeepAliveManager from "@/components/common/KeepAliveManager";

import JsonLd from "@/components/seo/JsonLd";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  // metadataBase giúp Next resolve OG/Twitter image URL chính xác khi dùng đường dẫn tương đối.
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"),
  title: {
    template: "%s | Xe Điện Đức Duy Cà Mau",
    default: "Xe Điện Đức Duy Cà Mau | Đại Lý Xe Máy & Xe Đạp Điện TAILG Chính Hãng",
  },
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 5,
    userScalable: true,
  },
  description: "Hệ thống showroom Xe Điện Đức Duy uy tín số 1 tại Cà Mau. Chuyên phân phối xe máy điện, xe đạp điện TAILG chính hãng. Mẫu mới 2025, Pin bền bỉ, Giá tốt nhất, Bảo hành & Cứu hộ tận nơi.",
  keywords: [
    "xe điện đức duy", 
    "xe máy điện cà mau", 
    "xe đạp điện cà mau", 
    "xe máy điện tailg", 
    "xe đạp điện tailg", 
    "tailg việt nam",
    "cửa hàng xe điện cà mau", 
    "mua xe điện trả góp cà mau",
    "giá xe máy điện tailg",
    "xe điện học sinh cấp 2",
    "sửa xe điện cà mau"
  ],
  authors: [{ name: "Xe Điện Đức Duy Team" }],
  openGraph: {
    type: "website",
    locale: "vi_VN",
    // Dùng biến môi trường để tránh hardcode URL khi deploy.
    url: process.env.NEXT_PUBLIC_SITE_URL || "https://website-xe-dien.vercel.app",
    siteName: "Xe Điện Đức Duy Cà Mau",
    title: "Xe Điện Đức Duy Cà Mau | Tổng Kho Xe Điện TAILG Chính Hãng",
    description: "Khám phá các dòng xe máy điện, xe đạp điện TAILG thời thượng tại Cà Mau. Bền bỉ - Tiết kiệm - Giá cực tốt. Nhận ưu đãi ngay!",
    images: [
      {
        url: "/og-image.jpg", // Ensure this file exists or use a remote URL
        width: 1200,
        height: 630,
        alt: "Showroom Xe Điện Đức Duy Cà Mau",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Xe Điện Đức Duy Cà Mau - Đại Lý TAILG Chính Hãng",
    description: "Chuyên xe máy điện, xe đạp điện TAILG tại Cà Mau. Uy tín - Chất lượng - Giá tốt.",
    images: ["/og-image.jpg"],
  },
  icons: {
    icon: "/logo(Ducduy).jpg",
    apple: "/logo(Ducduy).jpg",
  },
  verification: {
    google: "IpXDTlD_KPAEX8MQOuQ0-6c5B2phQ5AUQJFJgk-qG7I",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    // Website tiếng Việt
    <html lang="vi">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider>
          <AuthProvider>
            <CartProvider>
              <WishlistProvider>
                <CompareProvider>
                  <JsonLd />
                  <KeepAliveManager />
                  <Navbar />
                  <main className="pt-[140px] sm:pt-[130px] md:pt-[120px] lg:pt-[110px] min-h-screen">
                    {children}
                  </main>
                  <CompareFloatingBar />
                  <Footer />
                </CompareProvider>
              </WishlistProvider>
            </CartProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
