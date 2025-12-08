"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { X, ChevronLeft, ChevronRight } from "lucide-react";

interface ImageModalProps {
    images: string[];
    initialIndex: number;
    isOpen: boolean;
    onClose: () => void;
    productName: string;
}

export default function ImageModal({
    images,
    initialIndex,
    isOpen,
    onClose,
    productName
}: ImageModalProps) {
    const [currentIndex, setCurrentIndex] = useState(initialIndex);

    useEffect(() => {
        setCurrentIndex(initialIndex);
    }, [initialIndex]);

    useEffect(() => {
        if (!isOpen) return;

        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape") onClose();
            if (e.key === "ArrowLeft") prevImage();
            if (e.key === "ArrowRight") nextImage();
        };

        // Prevent body scroll when modal is open
        document.body.style.overflow = "hidden";
        window.addEventListener("keydown", handleKeyDown);

        return () => {
            document.body.style.overflow = "unset";
            window.removeEventListener("keydown", handleKeyDown);
        };
    }, [isOpen, currentIndex]);

    const nextImage = () => {
        setCurrentIndex((prev) => (prev + 1) % images.length);
    };

    const prevImage = () => {
        setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
    };

    if (!isOpen) return null;

    return (
        <div
            className="fixed inset-0 z-[999] flex items-center justify-center bg-black/95 backdrop-blur-sm"
            onClick={onClose}
        >
            {/* Close Button */}
            <button
                onClick={onClose}
                className="absolute top-4 right-4 p-3 bg-white/10 hover:bg-white/20 rounded-full transition-colors z-10"
                aria-label="Đóng"
            >
                <X className="w-6 h-6 text-white" />
            </button>

            {/* Main Content */}
            <div
                className="relative w-full h-full flex flex-col items-center justify-center p-4 md:p-8"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Image Container */}
                <div className="relative w-full max-w-5xl aspect-square flex items-center justify-center">
                    <div className="relative w-full h-full">
                        <Image
                            src={images[currentIndex]}
                            alt={`${productName} - Ảnh ${currentIndex + 1}`}
                            fill
                            className="object-contain"
                            priority
                        />
                    </div>

                    {/* Navigation Arrows */}
                    {images.length > 1 && (
                        <>
                            <button
                                onClick={prevImage}
                                className="absolute left-4 top-1/2 -translate-y-1/2 p-4 bg-white/10 hover:bg-white/20 rounded-full backdrop-blur-sm transition-all"
                                aria-label="Ảnh trước"
                            >
                                <ChevronLeft className="w-6 h-6 text-white" />
                            </button>
                            <button
                                onClick={nextImage}
                                className="absolute right-4 top-1/2 -translate-y-1/2 p-4 bg-white/10 hover:bg-white/20 rounded-full backdrop-blur-sm transition-all"
                                aria-label="Ảnh sau"
                            >
                                <ChevronRight className="w-6 h-6 text-white" />
                            </button>
                        </>
                    )}
                </div>

                {/* Image Counter */}
                <div className="mt-4 px-4 py-2 bg-white/10 rounded-full text-white backdrop-blur-sm">
                    {currentIndex + 1} / {images.length}
                </div>

                {/* Thumbnail Strip */}
                {images.length > 1 && (
                    <div className="mt-6 flex gap-3 overflow-x-auto max-w-full px-4 scrollbar-hide">
                        {images.map((img, idx) => (
                            <button
                                key={idx}
                                onClick={() => setCurrentIndex(idx)}
                                className={`relative w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden border-2 transition-all ${idx === currentIndex
                                        ? "border-primary shadow-lg shadow-primary/30 scale-110"
                                        : "border-white/20 hover:border-white/40"
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
                    </div>
                )}

                {/* Instructions */}
                <div className="mt-6 text-sm text-white/60 text-center">
                    <p className="hidden md:block">Dùng ← → hoặc click để chuyển ảnh • ESC để đóng</p>
                    <p className="md:hidden">Vuốt để chuyển ảnh • Chạm để đóng</p>
                </div>
            </div>
        </div>
    );
}
