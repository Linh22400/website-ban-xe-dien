"use client";

import Link from "next/link";
import { ChevronRight, Home } from "lucide-react";

interface BreadcrumbItem {
    label: string;
    href?: string;
}

interface BreadcrumbProps {
    items: BreadcrumbItem[];
}

export default function Breadcrumb({ items }: BreadcrumbProps) {
    return (
        <nav className="flex items-center gap-2 text-sm mb-6" aria-label="Breadcrumb">
            <Link
                href="/"
                className="flex items-center gap-1 text-muted-foreground hover:text-primary transition-colors"
            >
                <Home className="w-4 h-4" />
                <span>Trang chủ</span>
            </Link>

            {items.map((item, index) => (
                <div key={index} className="flex items-center gap-2">
                    <ChevronRight className="w-4 h-4 text-muted-foreground/50" />
                    {item.href && index < items.length - 1 ? (
                        <Link
                            href={item.href}
                            className="text-muted-foreground hover:text-primary transition-colors"
                        >
                            {item.label}
                        </Link>
                    ) : (
                        <span className={index === items.length - 1 ? "text-foreground font-semibold" : "text-muted-foreground"}>
                            {item.label}
                        </span>
                    )}
                </div>
            ))}
        </nav>
    );
}
