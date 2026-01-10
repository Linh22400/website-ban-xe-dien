import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/ui/Navbar";
import Footer from "@/components/ui/Footer";
import { AuthProvider } from "@/lib/auth-context";
import { CompareProvider } from "@/lib/compare-context";
import { CartProvider } from "@/lib/cart-context";
import { WishlistProvider } from "@/lib/wishlist-context";
import { ThemeProvider } from "@/contexts/ThemeContext";
import CompareFloatingBar from "@/components/compare/CompareFloatingBar";

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
    template: "%s | Xe Điện Đức Duy",
    default: "Xe Điện Đức Duy | Xe Đạp & Xe Máy Điện Cao Cấp Chính Hãng",
  },
  description: "Showroom xe điện 3D tương tác đầu tiên. Phân phối chính hãng xe máy điện, xe đạp điện TAILG. Trải nghiệm mua sắm hiện đại, bảo hành uy tín.",
  keywords: ["xe điện", "xe máy điện", "xe đạp điện", "TAILG", "xe điện đức duy", "mua xe điện"],
  authors: [{ name: "Xe Điện Đức Duy Team" }],
  openGraph: {
    type: "website",
    locale: "vi_VN",
    // Dùng biến môi trường để tránh hardcode URL khi deploy.
    url: process.env.NEXT_PUBLIC_SITE_URL || "https://website-xe-dien.vercel.app",
    siteName: "Xe Điện Đức Duy",
    title: "Xe Điện Đức Duy | Công Nghệ Tương Lai",
    description: "Khám phá các dòng xe điện cao cấp với công nghệ pin vượt trội và thiết kế thời thượng.",
    images: [
      {
        url: "/og-image.jpg", // Ensure this file exists or use a remote URL
        width: 1200,
        height: 630,
        alt: "Xe Điện Đức Duy Showroom",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Xe Điện Đức Duy",
    description: "Trải nghiệm mua sắm xe điện 3D đẳng cấp.",
    images: ["/og-image.jpg"],
  },
  icons: {
    icon: "/favicon.ico",
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
                  <Navbar />
                  <main className="pt-[72px] md:pt-[96px]">
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
