"use client";

import { useState } from "react";
import { Car } from "@/lib/api";
import ProductHero from "../product/ProductHero";
import FeatureHighlights from "../product/FeatureHighlights";
import TechSpecs from "../product/TechSpecs";
import StickyActionBar from "../product/StickyActionBar";
import WarrantyInfo from "../product/WarrantyInfo";
import ProductFAQ from "../product/ProductFAQ";
import { SectionHeading } from '../product/ProductTextComponents';
import ReviewList from "../product/ReviewList";
import ReviewForm from "../product/ReviewForm";
import RelatedProductsSidebar from "../product/RelatedProductsSidebar";

interface CarConfiguratorProps {
    car: Car;
    discountPercent?: number;
}

export default function CarConfigurator({ car, discountPercent = 0 }: CarConfiguratorProps) {
    const [selectedColor, setSelectedColor] = useState(0);

    // Filter valid colors and ensure safe access
    const validColors = (car.colors || []).filter(c => c && c.name);
    const safeColorIndex = Math.min(selectedColor, Math.max(0, validColors.length - 1));
    const selectedColorName = validColors[safeColorIndex]?.name || 'Mặc định';

    return (
        <div className="min-h-screen bg-background" id="configurator">
            {/* 1. Hero Section (Full Width) */}
            <ProductHero
                car={car}
                selectedColor={selectedColor}
                onColorChange={setSelectedColor}
                discountPercent={discountPercent}
            />

            {/* 2-Column Layout: Sidebar + Main Content */}
            <div className="container mx-auto px-4">
                <div className="flex gap-4 lg:gap-8">
                    {/* Left Sidebar - Sticky (Desktop Only) */}
                    <div className="hidden lg:block">
                        <RelatedProductsSidebar
                            currentProductId={car.id}
                            brand={car.brand}
                            type={car.type}
                        />
                    </div>

                    {/* Main Content Column */}
                    <div className="flex-1 min-w-0">
                        {/* 2. Feature Highlights (Cards) */}
                        <FeatureHighlights car={car} />

                        {/* 3. Detailed Specs (Grid) */}
                        <TechSpecs car={car} />

                        {/* 3.5. Warranty Information */}
                        <WarrantyInfo warranty={car.warranty} />

                        {/* 3.75. FAQ Section */}
                        <ProductFAQ />

                        {/* 3.8. Reviews & Ratings */}
                        <section className="py-20 bg-background">
                            <SectionHeading className="mb-8 text-center">
                                Đánh Giá Từ Khách Hàng
                            </SectionHeading>
                            <div className="space-y-6">
                                <ReviewForm carModelId={car.id} onSubmitSuccess={() => window.location.reload()} />
                                <ReviewList carModelId={car.id} />
                            </div>
                        </section>

                        {/* 4. Related Products (Mobile Only - Replaces Sidebar) */}
                        <div className="pb-24 lg:hidden">
                             <RelatedProductsSidebar
                                 currentProductId={car.id}
                                 brand={car.brand}
                                 type={car.type}
                                 mode="horizontal"
                             />
                        </div>
                    </div>
                </div>
            </div>

            {/* 5. Sticky Action Bar (Full Width) */}
            <StickyActionBar
                car={car}
                selectedColorName={selectedColorName}
                selectedColorIndex={selectedColor}
                discountPercent={discountPercent}
            />
        </div>
    );
}
