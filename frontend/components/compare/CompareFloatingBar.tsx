"use client";

import { useCompare } from "@/lib/compare-context";
import Image from "next/image";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";

export default function CompareFloatingBar() {
    const { selectedCars, removeCarFromCompare, clearCompare } = useCompare();
    const router = useRouter();
    const pathname = usePathname();

    if (selectedCars.length === 0 || pathname === '/compare') return null;

    const handleCompare = () => {
        const slugs = selectedCars.map(c => c.slug).join(",");
        router.push(`/compare?cars=${slugs}`);
    };

    return (
        <div className="fixed bottom-0 left-0 right-0 z-50 p-4 animate-in slide-in-from-bottom duration-300">
            <div className="container mx-auto max-w-4xl">
                <div className="bg-card/90 backdrop-blur-md border border-primary/20 rounded-2xl shadow-2xl p-4 flex items-center justify-between gap-4">

                    <div className="flex items-center gap-4 overflow-x-auto pb-2 sm:pb-0 scrollbar-hide">
                        <div className="text-sm font-bold text-white whitespace-nowrap hidden sm:block">
                            So sánh ({selectedCars.length}/3)
                        </div>

                        {selectedCars.map((car) => (
                            <div key={car.id} className="relative group shrink-0">
                                <button
                                    onClick={() => removeCarFromCompare(car.id)}
                                    className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 text-white rounded-full text-xs flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-10"
                                >
                                    ✕
                                </button>
                                <div className="w-12 h-12 sm:w-16 sm:h-16 relative rounded-lg overflow-hidden border border-white/10 bg-gray-900">
                                    <Image
                                        src={car.thumbnail}
                                        alt={car.name}
                                        fill
                                        className="object-cover"
                                    />
                                </div>
                            </div>
                        ))}

                        {selectedCars.length < 3 && (
                            <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-lg border border-dashed border-white/20 flex items-center justify-center text-muted-foreground text-xs shrink-0">
                                + Thêm
                            </div>
                        )}
                    </div>

                    <div className="flex items-center gap-3 shrink-0">
                        <button
                            onClick={clearCompare}
                            className="text-sm text-muted-foreground hover:text-white underline decoration-dotted hidden sm:block"
                        >
                            Xóa tất cả
                        </button>
                        <button
                            onClick={handleCompare}
                            className="px-6 py-3 bg-primary text-black font-bold rounded-xl hover:bg-white transition-all shadow-lg shadow-primary/20 whitespace-nowrap"
                        >
                            So Sánh Ngay →
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
