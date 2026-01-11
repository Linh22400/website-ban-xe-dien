"use client";

import { useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, Maximize2 } from "lucide-react";

interface CartImageGalleryProps {
    images: string[];
    productName: string;
    size?: "small" | "large"; // small for cart, large for checkout
    onImageClick?: () => void;
}

export default function CartImageGallery({
    images,
    productName,
    size = "small",
    onImageClick
}: CartImageGalleryProps) {
    // Ensure images is an array and filter out empty/invalid URLs
    const safeImages = Array.isArray(images) ? images : [];
    const validImages = safeImages.filter(img => 
        img && 
        typeof img === 'string' && 
        img.trim() !== '' && 
        img !== 'undefined' &&
        !img.includes('undefined')
    );
    
    // Use placeholder if no valid images
    const imageList = validImages.length > 0 ? validImages : ['/placeholder.png'];
    
    const [currentIndex, setCurrentIndex] = useState(0);

    const mainSize = size === "small" ? "w-32 h-32" : "w-64 h-64 md:w-80 md:h-80";
    const thumbSize = size === "small" ? "w-12 h-12" : "w-16 h-16";

    const nextImage = () => {
        setCurrentIndex((prev) => (prev + 1) % imageList.length);
    };

    const prevImage = () => {
        setCurrentIndex((prev) => (prev - 1 + imageList.length) % imageList.length);
    };

    // If only one image, show simple display
    if (imageList.length <= 1) {
        return (
            <div className={`relative ${mainSize} bg-white/5 rounded-xl overflow-hidden flex-shrink-0`}>
                <Image
                    src={imageList[0]}
                    alt={productName}
                    fill
                    className="object-contain p-2"
                />
            </div>
        );
    }

    return (
        <div className="flex-shrink-0">
            {/* Main Image */}
            <div className="relative group">
                <div className={`relative ${mainSize} bg-white/5 rounded-xl overflow-hidden`}>
                    <Image
                        src={imageList[currentIndex]}
                        alt={`${productName} - Ảnh ${currentIndex + 1}`}
                        fill
                        className="object-contain p-2"
                    />

                    {/* Expand Button (for cart size only) */}
                    {size === "small" && onImageClick && (
                        <button
                            onClick={onImageClick}
                            className="absolute top-2 right-2 p-1.5 bg-black/60 hover:bg-black/80 rounded-lg transition-opacity opacity-0 group-hover:opacity-100"
                            title="Xem ảnh lớn"
                        >
                            <Maximize2 className="w-4 h-4 text-white" />
                        </button>
                    )}

                    {/* Navigation Arrows (only if multiple images) */}
                    {imageList.length > 1 && (
                        <>
                            <button
                                onClick={prevImage}
                                className="absolute left-2 top-1/2 -translate-y-1/2 p-1.5 bg-black/60 hover:bg-black/80 rounded-full transition-opacity opacity-0 group-hover:opacity-100"
                                aria-label="Ảnh trước"
                            >
                                <ChevronLeft className="w-4 h-4 text-white" />
                            </button>
                            <button
                                onClick={nextImage}
                                className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 bg-black/60 hover:bg-black/80 rounded-full transition-opacity opacity-0 group-hover:opacity-100"
                                aria-label="Ảnh sau"
                            >
                                <ChevronRight className="w-4 h-4 text-white" />
                            </button>
                        </>
                    )}
                </div>

                {/* Image Counter */}
                {imageList.length > 1 && (
                    <div className="absolute bottom-2 left-1/2 -translate-x-1/2 px-2 py-1 bg-black/70 rounded-full text-xs text-white">
                        {currentIndex + 1} / {imageList.length}
                    </div>
                )}
            </div>

            {/* Thumbnail Strip */}
            {imageList.length > 1 && (
                <div className="mt-3 flex gap-2 overflow-x-auto scrollbar-hide">
                    {imageList.slice(0, size === "small" ? 4 : 6).map((img, idx) => (
                        <button
                            key={idx}
                            onClick={() => setCurrentIndex(idx)}
                            className={`relative ${thumbSize} flex-shrink-0 rounded-lg overflow-hidden border-2 transition-all ${idx === currentIndex
                                    ? "border-primary shadow-lg shadow-primary/30"
                                    : "border-white/10 hover:border-white/30"
                                }`}
                        >
                            <Image
                                src={img}
                                alt={`Thumbnail ${idx + 1}`}
                                fill
                                className="object-contain p-1"
                            />
                        </button>
                    ))}

                    {/* More indicator */}
                    {imageList.length > (size === "small" ? 4 : 6) && (
                        <div className={`${thumbSize} flex-shrink-0 rounded-lg border-2 border-white/10 bg-white/5 flex items-center justify-center text-xs text-white font-bold`}>
                            +{imageList.length - (size === "small" ? 4 : 6)}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
