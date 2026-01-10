"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import { Car } from "@/lib/api";
import { motion, AnimatePresence } from "framer-motion";
import { X, Maximize2, ChevronLeft, ChevronRight, ZoomIn } from "lucide-react";

interface ProductGalleryProps {
    car: Car;
    selectedColor?: number;
    onColorChange?: (index: number) => void;
}

export default function ProductGallery({ car, selectedColor: externalSelectedColor, onColorChange }: ProductGalleryProps) {
    const [internalSelectedColor, setInternalSelectedColor] = useState(0);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [isFullScreen, setIsFullScreen] = useState(false);

    // Use either external or internal state
    const selectedColor = externalSelectedColor !== undefined ? externalSelectedColor : internalSelectedColor;

    // Reset image index when color changes
    useEffect(() => {
        setCurrentImageIndex(0);
    }, [selectedColor]);

    // Lock body scroll when full screen is open
    useEffect(() => {
        if (isFullScreen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => {
            document.body.style.overflow = '';
        };
    }, [isFullScreen]);

    // Get images for the current color
    const getCurrentColorImages = () => {
        const validColors = (car.colors || []).filter(c => c && c.name);
        const safeIndex = Math.min(selectedColor, Math.max(0, validColors.length - 1));
        const color = validColors[safeIndex];
        
        if (color?.images && color.images.length > 0) {
            return color.images;
        }
        return [car.thumbnail];
    };

    const images = getCurrentColorImages();
    const currentImage = images[currentImageIndex];

    // Handle color change
    const handleColorChange = (index: number) => {
        if (index === selectedColor) return;
        if (onColorChange) {
            onColorChange(index);
        } else {
            setInternalSelectedColor(index);
        }
    };

    // Navigation
    const nextImage = () => {
        setCurrentImageIndex((prev) => (prev + 1) % images.length);
    };

    const prevImage = () => {
        setCurrentImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
    };

    return (
        <div className="space-y-6">
            {/* Main Image Display */}
            <div className="relative aspect-square rounded-3xl overflow-hidden bg-gradient-to-br from-card/50 to-background/50 border border-border group">
                {/* Image Container */}
                <div
                    className="relative w-full h-full cursor-pointer"
                    onClick={() => setIsFullScreen(true)}
                >
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={`${selectedColor}-${currentImageIndex}`}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.3 }}
                            className="relative w-full h-full"
                        >
                            <Image
                                src={currentImage}
                                alt={`${car.name} - ${(() => {
                                    const validColors = (car.colors || []).filter(c => c && c.name);
                                    const safeIndex = Math.min(selectedColor, Math.max(0, validColors.length - 1));
                                    return validColors[safeIndex]?.name || 'Default';
                                })()} - View ${currentImageIndex + 1}`}
                                fill
                                className="object-contain z-10 p-4"
                                priority
                                sizes="(max-width: 768px) 100vw, (max-width: 1280px) 70vw, 50vw"
                            />
                        </motion.div>
                    </AnimatePresence>

                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-background/20 via-transparent to-transparent pointer-events-none z-20" />
                </div>

                {/* Navigation Arrows - Only show if there are multiple images */}
                {images.length > 1 && (
                    <>
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                prevImage();
                            }}
                            className="absolute left-4 top-1/2 -translate-y-1/2 z-30 bg-black/50 hover:bg-black/70 text-white p-3 rounded-full transition-opacity opacity-0 group-hover:opacity-100"
                        >
                            <ChevronLeft className="w-6 h-6" />
                        </button>
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                nextImage();
                            }}
                            className="absolute right-4 top-1/2 -translate-y-1/2 z-30 bg-black/50 hover:bg-black/70 text-white p-3 rounded-full transition-opacity opacity-0 group-hover:opacity-100"
                        >
                            <ChevronRight className="w-6 h-6" />
                        </button>
                    </>
                )}

                {/* Full Screen Indicator */}
                <div className="absolute bottom-4 right-4 bg-black/50 px-4 py-2 rounded-full text-white/80 text-sm flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20 pointer-events-none">
                    <Maximize2 className="w-4 h-4" />
                    Xem toàn màn hình
                </div>

                {/* Image Counter Badge */}
                {images.length > 1 && (
                    <div className="absolute top-4 right-4 bg-black/50 px-3 py-1 rounded-full text-white/90 text-xs font-medium z-20">
                        {currentImageIndex + 1} / {images.length}
                    </div>
                )}
            </div>

            {/* Thumbnails & Color Selector */}
            <div className="space-y-6">
                {/* Thumbnails List */}
                {images.length > 1 && (
                    <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
                        {images.map((img, idx) => (
                            <button
                                key={idx}
                                onClick={() => setCurrentImageIndex(idx)}
                                className={`relative w-20 h-20 rounded-xl overflow-hidden border-2 flex-shrink-0 transition-all ${currentImageIndex === idx
                                        ? 'border-primary shadow-lg shadow-primary/20'
                                        : 'border-transparent opacity-70 hover:opacity-100'
                                    }`}
                            >
                                <Image
                                    src={img}
                                    alt={`Thumbnail ${idx + 1}`}
                                    fill
                                    className="object-cover"
                                    unoptimized
                                />
                            </button>
                        ))}
                    </div>
                )}

                {/* Color Selector */}
                {car.colors && car.colors.length > 0 && (
                    <div className="space-y-3">
                        <div className="flex items-center justify-between">
                            <h3 className="text-sm font-medium text-muted-foreground">Màu Sắc</h3>
                            <span className="text-sm font-bold text-white">
                                {(() => {
                                    const validColors = (car.colors || []).filter(c => c && c.name);
                                    const safeIndex = Math.min(selectedColor, Math.max(0, validColors.length - 1));
                                    return validColors[safeIndex]?.name || 'Chọn màu';
                                })()}
                            </span>
                        </div>

                        <div className="flex flex-wrap gap-3">
                            {(car.colors || []).filter(c => c && c.name).map((color, index) => {
                                const hexColor = color?.hex || '#cccccc'; // Default color if hex is missing
                                return (
                                <button
                                    key={index}
                                    onClick={() => handleColorChange(index)}
                                    className={`group relative transition-all duration-300 ${selectedColor === index
                                        ? 'scale-110'
                                        : 'hover:scale-105'
                                        }`}
                                >
                                    {/* Color Circle */}
                                    <div
                                        className={`w-14 h-14 rounded-full border-4 transition-all duration-300 ${selectedColor === index
                                            ? 'border-primary shadow-lg shadow-primary/50'
                                            : 'border-border hover:border-primary/50'
                                            }`}
                                        style={{ backgroundColor: hexColor }}
                                    />

                                    {/* Selected Indicator */}
                                    {selectedColor === index && (
                                        <div className="absolute inset-0 flex items-center justify-center">
                                            <svg className="w-6 h-6 text-white drop-shadow-lg" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                            </svg>
                                        </div>
                                    )}

                                    {/* Tooltip */}
                                    <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 px-2 py-1 bg-black/80 rounded text-xs text-white whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-30">
                                        {color.name}
                                    </div>
                                </button>
                            )})}
                        </div>
                    </div>
                )}
            </div>

            {/* Full Screen Modal */}
            {typeof window !== 'undefined' && createPortal(
                <AnimatePresence>
                    {isFullScreen && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 z-[9999] bg-black flex flex-col"
                        >
                            {/* Header */}
                            <div className="flex items-center justify-between p-6 border-b border-white/10 shrink-0 bg-black/50 z-50">
                                <div>
                                    <h2 className="text-2xl font-bold text-white">{car.name}</h2>
                                    <p className="text-muted-foreground">
                                        {(() => {
                                            const validColors = (car.colors || []).filter(c => c && c.name);
                                            const safeIndex = Math.min(selectedColor, Math.max(0, validColors.length - 1));
                                            return validColors[safeIndex]?.name || 'Mặc định';
                                        })()} • Ảnh {currentImageIndex + 1}/{images.length}
                                    </p>
                                </div>
                                <button
                                    onClick={() => setIsFullScreen(false)}
                                    className="p-2 hover:bg-white/10 rounded-full transition-colors"
                                >
                                    <X className="w-8 h-8 text-white" />
                                </button>
                            </div>

                            {/* Main Image Area */}
                            <div className="flex-1 relative flex items-center justify-center overflow-hidden bg-black">
                                <AnimatePresence mode="wait">
                                    <motion.div
                                        key={currentImageIndex}
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 1.1 }}
                                        transition={{ duration: 0.3 }}
                                        className="relative w-full h-full max-w-7xl max-h-[80vh] p-4"
                                    >
                                        <Image
                                            src={currentImage}
                                            alt="Full screen view"
                                            fill
                                            className="object-contain"
                                            priority
                                            unoptimized
                                        />
                                    </motion.div>
                                </AnimatePresence>

                                {/* Navigation Arrows */}
                                {images.length > 1 && (
                                    <>
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                prevImage();
                                            }}
                                            className="absolute left-4 top-1/2 -translate-y-1/2 p-4 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors"
                                        >
                                            <ChevronLeft className="w-8 h-8" />
                                        </button>
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                nextImage();
                                            }}
                                            className="absolute right-4 top-1/2 -translate-y-1/2 p-4 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors"
                                        >
                                            <ChevronRight className="w-8 h-8" />
                                        </button>
                                    </>
                                )}
                            </div>

                            {/* Bottom Thumbnails */}
                            {images.length > 1 && (
                                <div className="p-6 border-t border-white/10 bg-black/50 shrink-0 overflow-x-auto">
                                    <div className="flex justify-center gap-4 min-w-max px-4">
                                        {images.map((img, idx) => (
                                            <button
                                                key={idx}
                                                onClick={() => setCurrentImageIndex(idx)}
                                                className={`relative w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${currentImageIndex === idx
                                                        ? 'border-primary opacity-100 scale-110'
                                                        : 'border-transparent opacity-50 hover:opacity-80'
                                                    }`}
                                            >
                                                <Image
                                                    src={img}
                                                    alt={`Thumbnail ${idx + 1}`}
                                                    fill
                                                    className="object-cover"
                                                    unoptimized
                                                />
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </motion.div>
                    )}
                </AnimatePresence>,
                document.body
            )}
        </div>
    );
}
