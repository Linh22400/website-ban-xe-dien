"use client";

import { X } from "lucide-react";
import { useEffect } from "react";
import ProductFilter from "./ProductFilter";

interface FilterDrawerProps {
    isOpen: boolean;
    onClose: () => void;
    activeFilterCount: number;
}

export default function FilterDrawer({ isOpen, onClose, activeFilterCount }: FilterDrawerProps) {
    // Prevent body scroll when drawer is open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "";
        }
        return () => {
            document.body.style.overflow = "";
        };
    }, [isOpen]);

    // Close on escape key
    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === "Escape" && isOpen) {
                onClose();
            }
        };
        window.addEventListener("keydown", handleEscape);
        return () => window.removeEventListener("keydown", handleEscape);
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    return (
        <>
            {/* Backdrop */}
            <div
                className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 transition-opacity duration-300"
                onClick={onClose}
                aria-hidden="true"
            />

            {/* Drawer */}
            <div
                className={`fixed top-0 left-0 bottom-0 w-[85vw] max-w-sm bg-background border-r border-white/10 z-50 overflow-y-auto transition-transform duration-300 ${isOpen ? "translate-x-0" : "-translate-x-full"
                    }`}
            >
                {/* Header */}
                <div className="sticky top-0 bg-background/95 backdrop-blur-lg border-b border-white/10 p-4 flex items-center justify-between z-10">
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                        Bộ Lọc
                        {activeFilterCount > 0 && (
                            <span className="px-2 py-0.5 bg-primary text-black text-xs font-bold rounded-full">
                                {activeFilterCount}
                            </span>
                        )}
                    </h2>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                        aria-label="Close filter"
                    >
                        <X className="w-6 h-6 text-gray-900 dark:text-white" />
                    </button>
                </div>

                {/* Filter Content */}
                <div className="p-6">
                    <ProductFilter />
                </div>

                {/* Bottom Action Bar */}
                <div className="sticky bottom-0 bg-background/95 backdrop-blur-lg border-t border-white/10 p-4">
                    <button
                        onClick={onClose}
                        className="w-full px-6 py-3 bg-primary text-black font-bold rounded-full hover:bg-primary/90 transition-all"
                    >
                        Xem Kết Quả
                    </button>
                </div>
            </div>
        </>
    );
}
