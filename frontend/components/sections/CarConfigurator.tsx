"use client";

import { useState } from "react";
import { Car } from "@/lib/api";
import ProductHero from "../product/ProductHero";
import FeatureHighlights from "../product/FeatureHighlights";
import TechSpecs from "../product/TechSpecs";
import StickyActionBar from "../product/StickyActionBar";
import CostCalculator from "../product/CostCalculator";
import WarrantyInfo from "../product/WarrantyInfo";
import ProductFAQ from "../product/ProductFAQ";
import RelatedProductsSidebar from "../product/RelatedProductsSidebar";
import { SectionHeading } from '../product/ProductTextComponents';

interface CarConfiguratorProps {
    car: Car;
    discountPercent?: number;
}

export default function CarConfigurator({ car, discountPercent = 0 }: CarConfiguratorProps) {
    const [selectedColor, setSelectedColor] = useState(0);

    const selectedColorName = car.colors && car.colors[selectedColor]
        ? car.colors[selectedColor].name
        : 'Mặc định';

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
                <div className="flex gap-6 lg:gap-8">
                    {/* Left Sidebar - Sticky */}
                    <RelatedProductsSidebar
                        currentProductId={car.id}
                        brand={car.brand}
                        type={car.type}
                    />

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

                        {/* 4. Cost Calculator */}
                        <section className="py-20 bg-background">
                            <SectionHeading className="mb-12 text-center">
                                Dự Toán Chi Phí
                            </SectionHeading>
                            <div className="max-w-4xl mx-auto">
                                <CostCalculator />
                            </div>
                        </section>
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
