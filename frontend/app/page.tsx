import { Suspense } from "react";
import dynamic from "next/dynamic";
import HeroSlider from "@/components/hero/HeroSlider";
import QuickFinder from "@/components/hero/QuickFinder";
import CategoryExplorer from "@/components/sections/CategoryExplorer";
import LazySection from "@/components/common/LazySection";
import SectionGridSkeleton from "@/components/skeletons/SectionGridSkeleton";
import { getMergedHeroSlides } from "@/lib/hero-data";
import { getBrands } from "@/lib/api";

// Static imports for Server Components (Async)
import TailgProductGrid from "@/components/sections/TailgProductGrid";
import FeaturedProducts from "@/components/sections/FeaturedProducts";
import FeaturedAccessories from "@/components/sections/FeaturedAccessories";
import LatestNews from "@/components/sections/LatestNews";
import LiveChatWrapper from "@/components/ui/LiveChatWrapper";

export default async function Home() {
  const [initialSlides, brands] = await Promise.all([
    getMergedHeroSlides(),
    getBrands()
  ]);

  return (
    <main className="min-h-screen bg-background">
      {/* Hero Banner - Client Load for faster TTFB */}
      <HeroSlider initialSlides={initialSlides} />

      <div className="relative z-20 pb-12 pt-8">
        <div className="container mx-auto px-4">
          <QuickFinder initialBrands={brands} />
        </div>
      </div>

      <Suspense fallback={<div className="h-[500px] w-full bg-gray-100/5 dark:bg-gray-800/5 animate-pulse rounded-[2rem]" />}>
        <CategoryExplorer />
      </Suspense>



      {/* ========== TAILG ZONE START ========== */}
      {/* TailgProductGrid: Removed LazySection to fix LCP on reload. 
          Suspense allows it to stream in parallel without blocking initial HTML. */}
      <Suspense fallback={<SectionGridSkeleton count={8} titleWidth="w-96" />}>
        <TailgProductGrid />
      </Suspense>

      {/* ========== TAILG ZONE END ========== */}

      {/* ========== STANDARD E-COMMERCE BLOCKS ========== */}
      <LazySection className="min-h-[600px]">
        <Suspense fallback={<SectionGridSkeleton count={4} titleWidth="w-64" />}>
          <FeaturedProducts />
        </Suspense>
      </LazySection>

      <LazySection className="min-h-[500px]">
        <FeaturedAccessories />
      </LazySection>

      <LazySection className="min-h-[500px]">
        <LatestNews />
      </LazySection>

      <LiveChatWrapper />
    </main>
  );
}
