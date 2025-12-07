"use client";

import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationProps {
    currentPage: number;
    totalPages: number;
    searchParams: Record<string, string | undefined>;
}

export default function Pagination({ currentPage, totalPages, searchParams }: PaginationProps) {
    if (totalPages <= 1) return null;

    const buildPageUrl = (page: number) => {
        const params = new URLSearchParams(searchParams as Record<string, string>);
        params.set("page", page.toString());
        return `/cars?${params.toString()}`;
    };

    // Generate page numbers with ellipsis
    const getPageNumbers = (): (number | string)[] => {
        const pages: (number | string)[] = [];
        const showEllipsisStart = currentPage > 3;
        const showEllipsisEnd = currentPage < totalPages - 2;

        // Always show first page
        pages.push(1);

        if (showEllipsisStart) {
            pages.push("...");
        }

        // Show pages around current page
        const start = Math.max(2, currentPage - 1);
        const end = Math.min(totalPages - 1, currentPage + 1);

        for (let i = start; i <= end; i++) {
            pages.push(i);
        }

        if (showEllipsisEnd) {
            pages.push("...");
        }

        // Always show last page (if not first page)
        if (totalPages > 1) {
            pages.push(totalPages);
        }

        return pages;
    };

    const pageNumbers = getPageNumbers();

    return (
        <div className="flex items-center justify-center gap-2 mt-12">
            {/* Previous Button */}
            {currentPage > 1 ? (
                <Link
                    href={buildPageUrl(currentPage - 1)}
                    className="flex items-center gap-1 px-4 py-2 border border-white/10 rounded-lg hover:bg-white hover:text-black transition-all text-sm font-medium"
                >
                    <ChevronLeft className="w-4 h-4" />
                    <span className="hidden sm:inline">Trước</span>
                </Link>
            ) : (
                <button
                    disabled
                    className="flex items-center gap-1 px-4 py-2 border border-white/5 rounded-lg text-muted-foreground cursor-not-allowed text-sm"
                >
                    <ChevronLeft className="w-4 h-4" />
                    <span className="hidden sm:inline">Trước</span>
                </button>
            )}

            {/* Page Numbers */}
            <div className="flex items-center gap-1">
                {pageNumbers.map((page, index) => {
                    if (page === "...") {
                        return (
                            <span key={`ellipsis-${index}`} className="px-3 py-2 text-muted-foreground">
                                ...
                            </span>
                        );
                    }

                    const pageNum = page as number;
                    const isActive = pageNum === currentPage;

                    return (
                        <Link
                            key={pageNum}
                            href={buildPageUrl(pageNum)}
                            className={`min-w-[40px] h-10 flex items-center justify-center rounded-lg font-medium transition-all text-sm ${isActive
                                    ? "bg-primary text-black hover:bg-primary/90 shadow-lg shadow-primary/20"
                                    : "border border-white/10 hover:bg-white hover:text-black"
                                }`}
                        >
                            {pageNum}
                        </Link>
                    );
                })}
            </div>

            {/* Next Button */}
            {currentPage < totalPages ? (
                <Link
                    href={buildPageUrl(currentPage + 1)}
                    className="flex items-center gap-1 px-4 py-2 bg-primary text-black font-semibold rounded-lg hover:bg-primary/90 transition-all text-sm"
                >
                    <span className="hidden sm:inline">Sau</span>
                    <ChevronRight className="w-4 h-4" />
                </Link>
            ) : (
                <button
                    disabled
                    className="flex items-center gap-1 px-4 py-2 border border-white/5 rounded-lg text-muted-foreground cursor-not-allowed text-sm"
                >
                    <span className="hidden sm:inline">Sau</span>
                    <ChevronRight className="w-4 h-4" />
                </button>
            )}
        </div>
    );
}
