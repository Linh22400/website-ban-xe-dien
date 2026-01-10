import dynamic from "next/dynamic";
import HeroSlider from "@/components/hero/HeroSlider";
import QuickFinder from "@/components/hero/QuickFinder";
import CategoryExplorer from "@/components/sections/CategoryExplorer";
import TailgProductGrid from "@/components/sections/TailgProductGrid";
import WhyChooseTailg from "@/components/sections/WhyChooseTailg";
import FeaturedProducts from "@/components/sections/FeaturedProducts";
import ElectricMotorcycles from "@/components/sections/ElectricMotorcycles";
import ElectricBicycles from "@/components/sections/ElectricBicycles";
import LiveChatWidget from "@/components/ui/LiveChatWidget";

// Lazy load below-the-fold sections (SSR enabled for SEO)
const FeaturedAccessories = dynamic(() => import("@/components/sections/FeaturedAccessories"));
const LatestNews = dynamic(() => import("@/components/sections/LatestNews"));

export default function Home() {
  return (
    <main className="min-h-screen bg-background">
      {/* Hero Banner (ưu tiên TAILG + khuyến mãi) */}
      <HeroSlider />

      <div className="relative z-10 pb-12 pt-8">
        <div className="container mx-auto px-4">
          <QuickFinder />
        </div>
      </div>

      <CategoryExplorer />

      {/* ========== TAILG ZONE START ========== */}
      {/* TAILG Product Grid - Enhanced with Exclusive Dealer branding */}
      <TailgProductGrid />

      {/* Why Choose TAILG - Trust building (moved up for better conversion) */}
      <WhyChooseTailg />
      {/* ========== TAILG ZONE END ========== */}

      {/* ========== STANDARD E-COMMERCE BLOCKS (MULTI-BRAND FRIENDLY) ========== */}
      <FeaturedProducts />
      <ElectricMotorcycles />
      <ElectricBicycles />

      <FeaturedAccessories />

      <LatestNews />

      <LiveChatWidget />
    </main>
  );
}
