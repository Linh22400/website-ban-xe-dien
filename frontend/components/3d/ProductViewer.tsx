"use client";

import { useState, useRef } from "react";
import Image from "next/image";

interface ProductViewerProps {
    images?: string[];
    productName: string;
    thumbnail: string;
}

export default function ProductViewer({ images, productName, thumbnail }: ProductViewerProps) {
    const [currentAngle, setCurrentAngle] = useState(0);
    const [isDragging, setIsDragging] = useState(false);
    const [startX, setStartX] = useState(0);
    const containerRef = useRef<HTMLDivElement>(null);

    // If no 360 images provided, use single image with CSS 3D transform
    const viewerImages = images && images.length > 0 ? images : [thumbnail];
    const is360 = viewerImages.length > 1;

    const handleMouseDown = (e: React.MouseEvent) => {
        if (!is360) return;
        setIsDragging(true);
        setStartX(e.clientX);
    };

    const handleMouseMove = (e: React.MouseEvent) => {
        if (!isDragging || !is360) return;

        const delta = e.clientX - startX;
        const sensitivity = 0.5;
        const newAngle = (currentAngle + delta * sensitivity) % 360;

        setCurrentAngle(newAngle);
        setStartX(e.clientX);
    };

    const handleMouseUp = () => {
        setIsDragging(false);
    };

    const currentImageIndex = is360
        ? Math.floor((currentAngle / 360) * viewerImages.length) % viewerImages.length
        : 0;

    return (
        <div
            ref={containerRef}
            className="relative w-full h-full flex items-center justify-center cursor-grab active:cursor-grabbing select-none"
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
        >
            {/* Main Product Image */}
            <div
                className="relative w-full h-full transition-transform duration-200"
                style={{
                    transform: `perspective(1000px) rotateY(${currentAngle * 0.1}deg)`,
                }}
            >
                <Image
                    src={viewerImages[currentImageIndex]}
                    alt={productName}
                    fill
                    className="object-contain drop-shadow-2xl"
                    unoptimized
                    priority
                />
            </div>

            {/* Rotation Indicator */}
            {is360 && (
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/50 backdrop-blur-sm px-4 py-2 rounded-full">
                    <div className="flex items-center gap-2 text-white/80 text-sm">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                        </svg>
                        <span>Kéo để xoay 360°</span>
                    </div>
                </div>
            )}

            {/* Ambient Light Effect */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 bg-primary/20 blur-3xl rounded-full" />
                <div className="absolute bottom-0 right-0 w-64 h-64 bg-accent/10 blur-2xl rounded-full" />
            </div>
        </div>
    );
}
