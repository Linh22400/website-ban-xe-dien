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
  title: {
    template: "%s | Xe Điện Xanh",
    default: "Xe Điện Xanh | Xe Đạp & Xe Máy Điện Cao Cấp Chính Hãng",
  },
  description: "Showroom xe điện 3D tương tác đầu tiên. Phân phối chính hãng xe máy điện, xe đạp điện TAILG. Trải nghiệm mua sắm hiện đại, bảo hành uy tín.",
  keywords: ["xe điện", "xe máy điện", "xe đạp điện", "TAILG", "xe điện xanh", "mua xe điện"],
  authors: [{ name: "Xe Điện Xanh Team" }],
  openGraph: {
    type: "website",
    locale: "vi_VN",
    url: "https://website-xe-dien.vercel.app",
    siteName: "Xe Điện Xanh",
    title: "Xe Điện Xanh | Công Nghệ Tương Lai",
    description: "Khám phá các dòng xe điện cao cấp với công nghệ pin vượt trội và thiết kế thời thượng.",
    images: [
      {
        url: "/og-image.jpg", // Ensure this file exists or use a remote URL
        width: 1200,
        height: 630,
        alt: "Xe Điện Xanh Showroom",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Xe Điện Xanh",
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
    <html lang="en">
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
                  {children}
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
