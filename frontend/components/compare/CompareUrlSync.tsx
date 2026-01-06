"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useCompare } from "@/lib/compare-context";

export default function CompareUrlSync() {
    const { selectedCars } = useCompare();
    const router = useRouter();
    const searchParams = useSearchParams();

    useEffect(() => {
        const carsParam = searchParams.get("cars");
        if (carsParam) return;

        if (selectedCars.length === 0) return;

        const slugs = selectedCars
            .map((c) => c.slug)
            .filter(Boolean)
            .slice(0, 3)
            .join(",");

        if (!slugs) return;

        router.replace(`/compare?cars=${encodeURIComponent(slugs)}`);
    }, [router, searchParams, selectedCars]);

    return null;
}
