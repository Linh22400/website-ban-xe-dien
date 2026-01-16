"use client";

import { Car } from "@/lib/api";
import { SectionHeading, SpecValue } from './ProductTextComponents';
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface TechSpecsProps {
    car: Car;
}

export default function TechSpecs({ car }: TechSpecsProps) {
    // Use dynamic specs if available, otherwise fallback to mock data (for development/migration)
    const specs = (car.specifications && car.specifications.length > 0) ? car.specifications : [
        { label: "Kích thước", value: "1800 x 700 x 1100 mm" },
        { label: "Trọng lượng", value: "90 kg" },
        { label: "Tải trọng", value: "150 kg" },
        { label: "Động cơ", value: "1200W Brushless" },
        { label: "Loại pin", value: "Lithium-ion 60V 24Ah" },
        { label: "Thời gian sạc", value: "4 - 6 giờ" },
        { label: "Phanh trước/sau", value: "Đĩa / Cơ" },
        { label: "Lốp xe", value: "Không săm 90/90-12" },
        { label: "Giảm xóc", value: "Thủy lực" },
        { label: "Đèn chiếu sáng", value: "Full LED" },
    ];

    const [isZoomed, setIsZoomed] = useState(false);

    return (
        <section className="py-20 bg-card/20 border-y border-white/5">
            <div className="container mx-auto px-4">
                <div className="grid lg:grid-cols-2 gap-16 items-start">
                    <div>
                        <SectionHeading className="mb-6">
                            Thông Số Kỹ Thuật
                        </SectionHeading>
                        <p className="text-muted-foreground mb-8 text-lg">
                            Chi tiết cấu hình xe {car.name}. Mọi thông số đều được kiểm định nghiêm ngặt để đảm bảo hiệu suất tốt nhất.
                        </p>

                        <div
                            className="rounded-3xl overflow-hidden border border-white/10 cursor-zoom-in group relative"
                            onClick={() => car.technicalImage && setIsZoomed(true)}
                        >
                            {car.technicalImage ? (
                                <>
                                    <img
                                        src={car.technicalImage}
                                        alt={`${car.name} technical specs`}
                                        className="w-full h-auto object-contain transition-transform duration-500 group-hover:scale-105"
                                    />
                                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                                        <span className="bg-black/50 text-white px-4 py-2 rounded-full backdrop-blur-sm text-sm font-medium">
                                            Phóng to
                                        </span>
                                    </div>
                                </>
                            ) : (
                                <div className="relative aspect-video">
                                    <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-blue-600/20" />
                                    <div className="absolute inset-0 flex items-center justify-center text-white/20 font-bold text-6xl">
                                        SPECS
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-1 gap-3 md:gap-px md:bg-white/10 md:rounded-2xl md:overflow-hidden md:border md:border-white/10">
                        {specs.map((spec, index) => (
                            <div
                                key={index}
                                className="flex flex-col justify-center p-3 md:p-5 rounded-2xl md:rounded-none bg-card/30 md:bg-background/95 border border-white/5 md:border-none md:grid md:grid-cols-2 gap-1 sm:gap-0 hover:bg-white/5 transition-colors"
                            >
                                <span className="text-muted-foreground font-medium text-xs md:text-base mb-1 md:mb-0">{spec.label}</span>
                                <SpecValue className="text-sm md:text-base font-bold md:font-semibold">{spec.value}</SpecValue>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Full Screen Modal */}
            <AnimatePresence>
                {isZoomed && car.technicalImage && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setIsZoomed(false)}
                        className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-md flex items-center justify-center p-4 cursor-zoom-out"
                    >
                        <motion.img
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            src={car.technicalImage}
                            alt="Technical Specs Full Screen"
                            className="max-w-full max-h-[90vh] object-contain rounded-lg shadow-2xl"
                        />
                        <button
                            onClick={() => setIsZoomed(false)}
                            className="absolute top-4 right-4 text-white/70 hover:text-white p-2"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>
        </section>
    );
}
