"use client";

import Image from "next/image";
import Link from "next/link";
import { Car } from "@/lib/api";
import { useRouter, useSearchParams } from "next/navigation";
import { useCompare } from "@/lib/compare-context";
import { useEffect } from "react";

interface ComparisonTableProps {
    cars: Car[];
}

export default function ComparisonTable({ cars }: ComparisonTableProps) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { setCars } = useCompare();

    // Sync context with URL params on mount/update
    useEffect(() => {
        setCars(cars);
    }, [cars, setCars]);

    const removeCar = (slugToRemove: string) => {
        const currentSlugs = searchParams.get("cars")?.split(",") || [];
        const newSlugs = currentSlugs.filter(slug => slug !== slugToRemove);

        const params = new URLSearchParams(searchParams.toString());
        if (newSlugs.length > 0) {
            params.set("cars", newSlugs.join(","));
        } else {
            params.delete("cars");
        }

        router.push(`/compare?${params.toString()}`);
    };

    if (cars.length === 0) {
        return (
            <div className="text-center py-20 bg-card/30 rounded-2xl border border-white/5">
                <div className="text-4xl mb-4">⚖️</div>
                <h3 className="text-xl font-bold text-gray mb-2">Chưa có xe nào để so sánh</h3>
                <p className="text-muted-foreground mb-6">
                    Hãy thêm xe vào danh sách để bắt đầu so sánh.
                </p>
                <Link
                    href="/cars"
                    className="px-6 py-3 bg-primary text-black font-bold rounded-full hover:bg-white transition-all"
                >
                    Chọn Xe Ngay
                </Link>
            </div>
        );
    }

    return (
        <div className="overflow-x-auto pb-4">
            <table className="w-full min-w-[800px] border-collapse">
                <thead>
                    <tr>
                        <th className="p-4 text-left min-w-[200px]"></th>
                        {cars.map((car) => (
                            <th key={car.id} className="p-4 min-w-[250px] align-top relative">
                                <button
                                    onClick={() => removeCar(car.slug)}
                                    className="absolute top-2 right-2 w-8 h-8 rounded-full bg-white/10 hover:bg-red-500 hover:text-white flex items-center justify-center transition-colors z-10"
                                >
                                    ✕
                                </button>
                                <div className="relative aspect-[4/3] rounded-xl overflow-hidden mb-4 bg-gray-900">
                                    <Image
                                        src={car.thumbnail}
                                        alt={car.name}
                                        fill
                                        className="object-cover"
                                    />
                                </div>
                                <h3 className="text-xl font-bold text-white mb-1">{car.name}</h3>
                                <div className="text-primary font-bold text-lg">
                                    {car.price.toLocaleString('vi-VN')}₫
                                </div>
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody className="divide-y divide-white/10">
                    {/* Brand */}
                    <tr>
                        <td className="p-4 font-bold text-muted-foreground">Thương Hiệu</td>
                        {cars.map((car) => (
                            <td key={car.id} className="p-4 text-white font-medium">{car.brand}</td>
                        ))}
                    </tr>
                    {/* Type */}
                    <tr>
                        <td className="p-4 font-bold text-muted-foreground">Loại Xe</td>
                        {cars.map((car) => (
                            <td key={car.id} className="p-4 text-white">
                                {car.type === 'bicycle' ? 'Xe Đạp Điện' : 'Xe Máy Điện'}
                            </td>
                        ))}
                    </tr>
                    {/* Range */}
                    <tr>
                        <td className="p-4 font-bold text-muted-foreground">Quãng Đường</td>
                        {cars.map((car) => (
                            <td key={car.id} className="p-4 text-white font-bold">{car.range} km</td>
                        ))}
                    </tr>
                    {/* Top Speed */}
                    <tr>
                        <td className="p-4 font-bold text-muted-foreground">Tốc Độ Tối Đa</td>
                        {cars.map((car) => (
                            <td key={car.id} className="p-4 text-white font-bold">{car.topSpeed} km/h</td>
                        ))}
                    </tr>
                    {/* Acceleration */}
                    <tr>
                        <td className="p-4 font-bold text-muted-foreground">Gia Tốc (0-50km/h)</td>
                        {cars.map((car) => (
                            <td key={car.id} className="p-4 text-white">
                                {car.acceleration > 0 ? `${car.acceleration}s` : '-'}
                            </td>
                        ))}
                    </tr>
                    {/* Action */}
                    <tr>
                        <td className="p-4"></td>
                        {cars.map((car) => (
                            <td key={car.id} className="p-4">
                                <Link
                                    href={`/cars/${car.slug}`}
                                    className="block w-full py-3 bg-white/10 text-white font-bold rounded-xl hover:bg-primary hover:text-black transition-all text-center"
                                >
                                    Xem Chi Tiết
                                </Link>
                            </td>
                        ))}
                    </tr>
                </tbody>
            </table>
        </div>
    );
}
