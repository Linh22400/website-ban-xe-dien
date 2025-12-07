"use client";

import HeroSlider from "@/components/hero/HeroSlider";
import QuickFinder from "@/components/hero/QuickFinder";
import MonthlyOffers from "@/components/sections/MonthlyOffers";
import CategoryExplorer from "@/components/sections/CategoryExplorer";
import FeaturedProducts from "@/components/sections/FeaturedProducts";
import ElectricMotorcycles from "@/components/sections/ElectricMotorcycles";
import ElectricBicycles from "@/components/sections/ElectricBicycles";
import FeaturedAccessories from "@/components/sections/FeaturedAccessories";
import LiveChatWidget from "@/components/ui/LiveChatWidget";

export default function Home() {
  return (
    <main className="min-h-screen bg-background">
      <HeroSlider />

      <div className="relative z-10 -mt-20 md:-mt-32 pb-12">
        <div className="container mx-auto px-4">
          <QuickFinder />
        </div>
      </div>

      <MonthlyOffers />

      <CategoryExplorer />

      <FeaturedProducts />

      <ElectricMotorcycles />

      <ElectricBicycles />

      <FeaturedAccessories />

      <LiveChatWidget />
    </main>
  );
}
