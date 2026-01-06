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
                <h3 className="text-xl font-bold text-foreground mb-2">Chưa có xe nào để so sánh</h3>
                <p className="text-muted-foreground mb-6">
                    Hãy thêm xe vào danh sách để bắt đầu so sánh.
                </p>
                <Link
                    href="/cars"
                    className="px-6 py-3 bg-primary text-black font-bold rounded-full hover:bg-white transition-colors"
                >
                    Chọn Xe Ngay
                </Link>
            </div>
        );
    }

    const formatPrice = (price: number) => {
        if (!Number.isFinite(price) || price <= 0) return "Liên hệ";
        return `${price.toLocaleString('vi-VN')}₫`;
    };

    const getWarrantyText = (car: Car) => {
        const w: any = car.warranty;
        if (!w) return "-";
        if (typeof w === "string") return w;
        return String(w?.duration || w?.name || "-");
    };

    const getSpecValue = (car: Car, labels: string[]) => {
        const specs: any[] = Array.isArray((car as any).specifications) ? (car as any).specifications : [];
        if (specs.length === 0) return "-";

        const norm = (s: unknown) => String(s ?? "").trim().toLowerCase();
        const wanted = labels.map(norm).filter(Boolean);

        for (const spec of specs) {
            const label = norm(spec?.label ?? spec?.name ?? spec?.key);
            if (!label) continue;
            const match = wanted.some((w) => label === w || label.includes(w) || w.includes(label));
            if (!match) continue;
            const value = spec?.value ?? spec?.val ?? spec?.content;
            const text = String(value ?? "").trim();
            if (text) return text;
        }
        return "-";
    };

    const parseNumber = (value: unknown) => {
        const s = String(value ?? "").replace(/,/g, ".").trim();
        // Grab the first number; handles "6-8 giờ" (returns 6), "1200W" (1200), "60V 24Ah" (60)
        const match = s.match(/-?\d+(?:\.\d+)?/);
        if (!match) return null;
        const n = Number(match[0]);
        return Number.isFinite(n) ? n : null;
    };

    const bestIndex = (values: Array<number | null>, mode: 'max' | 'min') => {
        let best: number | null = null;
        let bestI = -1;
        for (let i = 0; i < values.length; i++) {
            const v = values[i];
            if (v === null) continue;
            if (best === null) {
                best = v;
                bestI = i;
                continue;
            }
            const better = mode === 'max' ? v > best : v < best;
            if (better) {
                best = v;
                bestI = i;
            }
        }
        return bestI;
    };

    const highlightClass = (on: boolean) =>
        on ? "bg-primary/5 border-l-2 border-primary/40" : "";

    const getFeaturesText = (car: Car) => {
        const features: any = (car as any).features;
        if (!features) return "-";
        if (Array.isArray(features)) {
            const items = features
                .map((f) => {
                    if (typeof f === 'string') return f.trim();
                    if (!f || typeof f !== 'object') return "";
                    return String(f.title || f.name || f.label || f.value || "").trim();
                })
                .filter(Boolean);
            if (items.length === 0) return "-";
            return items.slice(0, 8).join(", ");
        }
        if (typeof features === 'object') {
            const keys = Object.keys(features);
            if (keys.length === 0) return "-";
            return keys.slice(0, 8).map((k) => `${k}: ${String((features as any)[k])}`).join(", ");
        }
        return "-";
    };

    return (
        <div className="overflow-x-auto pb-4">
            <table className="w-full min-w-[1060px] border-separate border-spacing-0 table-fixed">
                <thead>
                    <tr>
                        <th className="p-4 text-left w-[220px] sticky left-0 z-30 bg-background border-r border-white/10"></th>
                        {cars.map((car) => (
                            <th key={car.id} className="p-4 w-[280px] align-top relative">
                                <button
                                    onClick={() => removeCar(car.slug)}
                                    className="absolute top-2 right-2 w-8 h-8 rounded-full bg-white/10 hover:bg-red-500 hover:text-white flex items-center justify-center transition-colors z-10"
                                >
                                    ✕
                                </button>
                                <div className="relative aspect-[16/9] rounded-xl overflow-hidden mb-4 bg-card/30 border border-white/10">
                                    <Image
                                        src={car.thumbnail}
                                        alt={car.name}
                                        fill
                                        sizes="250px"
                                        className="object-cover object-center"
                                    />
                                </div>
                                <h3 className="text-xl font-bold text-foreground mb-1">{car.name}</h3>
                                <div className="text-primary font-bold text-lg">{formatPrice(car.price)}</div>
                                <div className="mt-2 flex flex-wrap items-center gap-2">
                                    <span
                                        className={`px-2.5 py-1 rounded-full text-xs font-semibold border ${
                                            car.stock > 0
                                                ? "bg-primary/10 border-primary/20 text-primary"
                                                : "bg-red-500/10 border-red-500/20 text-red-400"
                                        }`}
                                    >
                                        {car.stock > 0 ? "Còn hàng" : "Hết hàng"}
                                    </span>
                                    <span className="px-2.5 py-1 rounded-full text-xs font-semibold border bg-card/30 border-white/10 text-muted-foreground">
                                        BH: {getWarrantyText(car)}
                                    </span>
                                </div>
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody className="divide-y divide-white/10">
                    {/* Brand */}
                    <tr>
                        <td className="p-4 font-bold text-muted-foreground sticky left-0 z-20 bg-background border-r border-white/10">Thương Hiệu</td>
                        {cars.map((car) => (
                            <td key={car.id} className="p-4 text-foreground font-medium">{car.brand}</td>
                        ))}
                    </tr>
                    {/* Type */}
                    <tr>
                        <td className="p-4 font-bold text-muted-foreground sticky left-0 z-20 bg-background border-r border-white/10">Loại Xe</td>
                        {cars.map((car) => (
                            <td key={car.id} className="p-4 text-foreground">
                                {car.type === 'bicycle' ? 'Xe Đạp Điện' : 'Xe Máy Điện'}
                            </td>
                        ))}
                    </tr>
                    {/* Range */}
                    {(() => {
                        const vals = cars.map((c) => parseNumber(c.range));
                        const win = bestIndex(vals, 'max');
                        return (
                    <tr>
                        <td className="p-4 font-bold text-muted-foreground sticky left-0 z-20 bg-background border-r border-white/10">Quãng Đường</td>
                        {cars.map((car) => (
                            <td key={car.id} className={`p-4 text-foreground font-bold ${highlightClass(cars.indexOf(car) === win)}`}>{car.range} km</td>
                        ))}
                    </tr>
                        );
                    })()}
                    {/* Top Speed */}
                    {(() => {
                        const vals = cars.map((c) => parseNumber(c.topSpeed));
                        const win = bestIndex(vals, 'max');
                        return (
                    <tr>
                        <td className="p-4 font-bold text-muted-foreground sticky left-0 z-20 bg-background border-r border-white/10">Tốc Độ Tối Đa</td>
                        {cars.map((car) => (
                            <td key={car.id} className={`p-4 text-foreground font-bold ${highlightClass(cars.indexOf(car) === win)}`}>{car.topSpeed} km/h</td>
                        ))}
                    </tr>
                        );
                    })()}
                    {/* Acceleration */}
                    {(() => {
                        const vals = cars.map((c) => (c.acceleration > 0 ? parseNumber(c.acceleration) : null));
                        const win = bestIndex(vals, 'min');
                        return (
                    <tr>
                        <td className="p-4 font-bold text-muted-foreground sticky left-0 z-20 bg-background border-r border-white/10">Gia Tốc (0-50km/h)</td>
                        {cars.map((car) => (
                            <td key={car.id} className={`p-4 text-foreground ${highlightClass(cars.indexOf(car) === win)}`}>
                                {car.acceleration > 0 ? `${car.acceleration}s` : '-'}
                            </td>
                        ))}
                    </tr>
                        );
                    })()}

                    {/* Charge Time */}
                    {(() => {
                        const vals = cars.map((c) => parseNumber(getSpecValue(c, ["thời gian sạc", "thoi gian sac", "charge time"])));
                        const win = bestIndex(vals, 'min');
                        return (
                    <tr>
                        <td className="p-4 font-bold text-muted-foreground sticky left-0 z-20 bg-background border-r border-white/10">Thời Gian Sạc</td>
                        {cars.map((car) => (
                            <td key={car.id} className={`p-4 text-foreground font-medium ${highlightClass(cars.indexOf(car) === win)}`}>
                                {getSpecValue(car, ["thời gian sạc", "thoi gian sac", "charge time"])}
                            </td>
                        ))}
                    </tr>
                        );
                    })()}

                    {/* Battery */}
                    {(() => {
                        const vals = cars.map((c) => parseNumber(getSpecValue(c, ["dung lượng", "dung luong", "ah", "wh", "capacity"])));
                        const win = bestIndex(vals, 'max');
                        return (
                    <tr>
                        <td className="p-4 font-bold text-muted-foreground sticky left-0 z-20 bg-background border-r border-white/10">Pin / Ắc Quy</td>
                        {cars.map((car) => (
                            <td key={car.id} className={`p-4 text-foreground font-medium ${highlightClass(cars.indexOf(car) === win)}`}>
                                {getSpecValue(car, ["loại pin", "pin", "ắc quy", "ac quy", "battery"])}
                            </td>
                        ))}
                    </tr>
                        );
                    })()}

                    {/* Motor */}
                    {(() => {
                        const vals = cars.map((c) => parseNumber(getSpecValue(c, ["công suất", "cong suat", "w", "kw", "power"])));
                        const win = bestIndex(vals, 'max');
                        return (
                    <tr>
                        <td className="p-4 font-bold text-muted-foreground sticky left-0 z-20 bg-background border-r border-white/10">Động Cơ</td>
                        {cars.map((car) => (
                            <td key={car.id} className={`p-4 text-foreground font-medium ${highlightClass(cars.indexOf(car) === win)}`}>
                                {getSpecValue(car, ["động cơ", "dong co", "motor"])}
                            </td>
                        ))}
                    </tr>
                        );
                    })()}

                    {/* Weight */}
                    {(() => {
                        const vals = cars.map((c) => parseNumber(getSpecValue(c, ["trọng lượng", "trong luong", "weight"])));
                        const win = bestIndex(vals, 'min');
                        return (
                    <tr>
                        <td className="p-4 font-bold text-muted-foreground sticky left-0 z-20 bg-background border-r border-white/10">Trọng Lượng</td>
                        {cars.map((car) => (
                            <td key={car.id} className={`p-4 text-foreground font-medium ${highlightClass(cars.indexOf(car) === win)}`}>
                                {getSpecValue(car, ["trọng lượng", "trong luong", "weight"]) || "-"}
                            </td>
                        ))}
                    </tr>
                        );
                    })()}

                    {/* Max Load */}
                    {(() => {
                        const vals = cars.map((c) => parseNumber(getSpecValue(c, ["tải trọng", "tai trong", "max load", "payload"])));
                        const win = bestIndex(vals, 'max');
                        return (
                    <tr>
                        <td className="p-4 font-bold text-muted-foreground sticky left-0 z-20 bg-background border-r border-white/10">Tải Trọng</td>
                        {cars.map((car) => (
                            <td key={car.id} className={`p-4 text-foreground font-medium ${highlightClass(cars.indexOf(car) === win)}`}>
                                {getSpecValue(car, ["tải trọng", "tai trong", "max load", "payload"])}
                            </td>
                        ))}
                    </tr>
                        );
                    })()}

                    {/* Dimensions */}
                    <tr>
                        <td className="p-4 font-bold text-muted-foreground sticky left-0 z-20 bg-background border-r border-white/10">Kích Thước</td>
                        {cars.map((car) => (
                            <td key={car.id} className="p-4 text-foreground font-medium">
                                {getSpecValue(car, ["kích thước", "kich thuoc", "dimensions"]) }
                            </td>
                        ))}
                    </tr>

                    {/* Battery Capacity */}
                    {(() => {
                        const vals = cars.map((c) => parseNumber(getSpecValue(c, ["ah", "wh", "dung lượng", "dung luong", "capacity"])));
                        const win = bestIndex(vals, 'max');
                        return (
                            <tr>
                                <td className="p-4 font-bold text-muted-foreground sticky left-0 z-20 bg-background border-r border-white/10">Dung Lượng Pin</td>
                                {cars.map((car) => (
                                    <td key={car.id} className={`p-4 text-foreground font-medium ${highlightClass(cars.indexOf(car) === win)}`}>
                                        {getSpecValue(car, ["dung lượng", "dung luong", "ah", "wh", "capacity"]) }
                                    </td>
                                ))}
                            </tr>
                        );
                    })()}

                    {/* Motor Power */}
                    {(() => {
                        const vals = cars.map((c) => parseNumber(getSpecValue(c, ["công suất", "cong suat", "w", "kw", "power"])));
                        const win = bestIndex(vals, 'max');
                        return (
                            <tr>
                                <td className="p-4 font-bold text-muted-foreground sticky left-0 z-20 bg-background border-r border-white/10">Công Suất</td>
                                {cars.map((car) => (
                                    <td key={car.id} className={`p-4 text-foreground font-medium ${highlightClass(cars.indexOf(car) === win)}`}>
                                        {getSpecValue(car, ["công suất", "cong suat", "power", "w", "kw"]) }
                                    </td>
                                ))}
                            </tr>
                        );
                    })()}

                    {/* Wheel / Tire size */}
                    <tr>
                        <td className="p-4 font-bold text-muted-foreground sticky left-0 z-20 bg-background border-r border-white/10">Kích Thước Bánh</td>
                        {cars.map((car) => (
                            <td key={car.id} className="p-4 text-foreground font-medium">
                                {getSpecValue(car, ["bánh", "banh", "vành", "vanh", "wheel", "rim"]) }
                            </td>
                        ))}
                    </tr>

                    {/* Brakes */}
                    <tr>
                        <td className="p-4 font-bold text-muted-foreground sticky left-0 z-20 bg-background border-r border-white/10">Phanh Trước/Sau</td>
                        {cars.map((car) => (
                            <td key={car.id} className="p-4 text-foreground font-medium">
                                {getSpecValue(car, ["phanh", "phanh trước", "phanh sau", "phanh trước/sau", "brake"]) }
                            </td>
                        ))}
                    </tr>

                    {/* Tires */}
                    <tr>
                        <td className="p-4 font-bold text-muted-foreground sticky left-0 z-20 bg-background border-r border-white/10">Lốp Xe</td>
                        {cars.map((car) => (
                            <td key={car.id} className="p-4 text-foreground font-medium">
                                {getSpecValue(car, ["lốp", "lop", "lốp xe", "lop xe", "tires", "tyre"]) }
                            </td>
                        ))}
                    </tr>

                    {/* Suspension */}
                    <tr>
                        <td className="p-4 font-bold text-muted-foreground sticky left-0 z-20 bg-background border-r border-white/10">Giảm Xóc</td>
                        {cars.map((car) => (
                            <td key={car.id} className="p-4 text-foreground font-medium">
                                {getSpecValue(car, ["giảm xóc", "giam xoc", "suspension"]) }
                            </td>
                        ))}
                    </tr>

                    {/* Lights */}
                    <tr>
                        <td className="p-4 font-bold text-muted-foreground sticky left-0 z-20 bg-background border-r border-white/10">Đèn Chiếu Sáng</td>
                        {cars.map((car) => (
                            <td key={car.id} className="p-4 text-foreground font-medium">
                                {getSpecValue(car, ["đèn", "den", "đèn chiếu sáng", "lighting", "lights"]) }
                            </td>
                        ))}
                    </tr>

                    {/* Stock */}
                    <tr>
                        <td className="p-4 font-bold text-muted-foreground sticky left-0 z-20 bg-background border-r border-white/10">Tình Trạng</td>
                        {cars.map((car) => (
                            <td key={car.id} className="p-4 text-foreground font-medium">
                                {car.stock > 0 ? "Còn hàng" : "Hết hàng"}
                            </td>
                        ))}
                    </tr>

                    {/* Warranty */}
                    <tr>
                        <td className="p-4 font-bold text-muted-foreground sticky left-0 z-20 bg-background border-r border-white/10">Bảo Hành</td>
                        {cars.map((car) => (
                            <td key={car.id} className="p-4 text-foreground font-medium">
                                {getWarrantyText(car)}
                            </td>
                        ))}
                    </tr>

                    {/* Sold */}
                    {cars.some((c) => Number.isFinite(c.sold) && (c.sold as number) > 0) && (
                        <tr>
                            <td className="p-4 font-bold text-muted-foreground sticky left-0 z-20 bg-background border-r border-white/10">Đã Bán</td>
                            {cars.map((car) => (
                                <td key={car.id} className="p-4 text-foreground font-medium">
                                    {Number.isFinite(car.sold) && (car.sold as number) > 0 ? `${car.sold} xe` : "-"}
                                </td>
                            ))}
                        </tr>
                    )}

                    {/* Safety / Features */}
                    <tr>
                        <td className="p-4 font-bold text-muted-foreground sticky left-0 z-20 bg-background border-r border-white/10">Tính Năng</td>
                        {cars.map((car) => (
                            <td key={car.id} className="p-4 text-foreground font-medium">
                                {getFeaturesText(car)}
                            </td>
                        ))}
                    </tr>
                    {/* Stock */}
                    <tr>
                        <td className="p-4 font-bold text-muted-foreground">Tình Trạng</td>
                        {cars.map((car) => (
                            <td key={car.id} className="p-4 text-foreground font-medium">
                                {car.stock > 0 ? "Còn hàng" : "Hết hàng"}
                            </td>
                        ))}
                    </tr>
                    {/* Warranty */}
                    <tr>
                        <td className="p-4 font-bold text-muted-foreground">Bảo Hành</td>
                        {cars.map((car) => (
                            <td key={car.id} className="p-4 text-foreground font-medium">
                                {getWarrantyText(car)}
                            </td>
                        ))}
                    </tr>

                    {/* Sold */}
                    {cars.some((c) => Number.isFinite(c.sold) && (c.sold as number) > 0) && (
                        <tr>
                            <td className="p-4 font-bold text-muted-foreground">Đã Bán</td>
                            {cars.map((car) => (
                                <td key={car.id} className="p-4 text-foreground font-medium">
                                    {Number.isFinite(car.sold) && (car.sold as number) > 0 ? `${car.sold} xe` : "-"}
                                </td>
                            ))}
                        </tr>
                    )}
                    {/* Action */}
                    <tr>
                        <td className="p-4 sticky left-0 z-20 bg-background border-r border-white/10"></td>
                        {cars.map((car) => (
                            <td key={car.id} className="p-4">
                                <Link
                                    href={`/cars/${car.slug}`}
                                    className="block w-full py-3 bg-card/40 text-foreground font-bold rounded-xl hover:bg-primary hover:text-black transition-colors text-center border border-white/10"
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
