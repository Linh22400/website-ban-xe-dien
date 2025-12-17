"use client";

import { useState, useEffect } from "react";

export default function CostCalculator() {
    const [dailyDistance, setDailyDistance] = useState(30); // km
    const [gasPrice, setGasPrice] = useState(24000); // VND/liter
    const [kwhPrice, setKwhPrice] = useState(3000); // VND/kWh

    // Assumptions
    const gasConsumption = 2.5; // Liters per 100km (scooter average)
    const evConsumption = 3; // kWh per 100km (average e-scooter)

    const [savings, setSavings] = useState({
        monthly: 0,
        yearly: 0,
        fiveYear: 0
    });

    useEffect(() => {
        const calculateSavings = () => {
            const monthlyDistance = dailyDistance * 30;

            // Gas Cost
            const gasCostPer100km = gasConsumption * gasPrice;
            const monthlyGasCost = (monthlyDistance / 100) * gasCostPer100km;

            // EV Cost
            const evCostPer100km = evConsumption * kwhPrice;
            const monthlyEvCost = (monthlyDistance / 100) * evCostPer100km;

            const monthlySaving = monthlyGasCost - monthlyEvCost;

            setSavings({
                monthly: monthlySaving,
                yearly: monthlySaving * 12,
                fiveYear: monthlySaving * 12 * 5
            });
        };

        calculateSavings();
    }, [dailyDistance, gasPrice, kwhPrice]);

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
    };

    return (
        <div className="p-6 bg-gradient-to-br from-green-900/20 to-green-900/5 border border-green-500/30 rounded-2xl space-y-6">
            <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-green-500/20 rounded-lg text-green-500">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                </div>
                <div>
                    <h3 className="text-lg font-bold text-foreground">Tính Toán Tiết Kiệm</h3>
                    <p className="text-xs text-muted-foreground">So với xe xăng thông thường</p>
                </div>
            </div>

            {/* Input Slider */}
            <div className="space-y-3">
                <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Bạn đi bao nhiêu km mỗi ngày?</span>
                    <span className="font-bold text-foreground">{dailyDistance} km</span>
                </div>
                <input
                    type="range"
                    min="5"
                    max="100"
                    step="5"
                    value={dailyDistance}
                    onChange={(e) => setDailyDistance(Number(e.target.value))}
                    className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-green-500"
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                    <span>5km</span>
                    <span>100km</span>
                </div>
            </div>

            {/* Savings Display */}
            <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-black/20 rounded-xl border border-white/5">
                    <div className="text-xs text-muted-foreground mb-1">Tiết kiệm mỗi năm</div>
                    <div className="text-xl font-bold text-green-400">
                        {formatCurrency(savings.yearly)}
                    </div>
                </div>
                <div className="p-4 bg-black/20 rounded-xl border border-white/5">
                    <div className="text-xs text-muted-foreground mb-1">Trong 5 năm</div>
                    <div className="text-xl font-bold text-green-400">
                        {formatCurrency(savings.fiveYear)}
                    </div>
                </div>
            </div>

            <p className="text-[10px] text-muted-foreground text-center italic">
                *Ước tính dựa trên giá xăng {gasPrice.toLocaleString()}đ/lít và giá điện {kwhPrice.toLocaleString()}đ/kWh.
            </p>
        </div>
    );
}
