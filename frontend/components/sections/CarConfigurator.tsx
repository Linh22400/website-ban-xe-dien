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
        <div className="min-h-screen bg-background text-white" id="configurator">
            {/* 1. Hero Section (Immersive) */}
            <ProductHero
                car={car}
                selectedColor={selectedColor}
                onColorChange={setSelectedColor}
                discountPercent={discountPercent}
            />

            {/* 2. Feature Highlights (Cards) */}
            <FeatureHighlights car={car} />

            {/* 3. Detailed Specs (Grid) */}
            <TechSpecs car={car} />

            {/* 3.5. Warranty Information */}
            <WarrantyInfo warranty={car.warranty} />

            {/* 3.75. FAQ Section */}
            <ProductFAQ />

            {/* 4. Cost Calculator (Existing) */}
            <section className="py-20 bg-background">
                <div className="container mx-auto px-4">
                    <h2 className="text-3xl md:text-4xl font-bold text-white mb-12 text-center">
                        Dự Toán Chi Phí
                    </h2>
                    <div className="max-w-4xl mx-auto">
                        <CostCalculator />
                    </div>
                </div>
            </section>

            {/* 5. Sticky Action Bar (Conversion) */}
            <StickyActionBar
                car={car}
                selectedColorName={selectedColorName}
                selectedColorIndex={selectedColor}
                discountPercent={discountPercent}
            />
        </div>
    );
}
