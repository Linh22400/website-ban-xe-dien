"use client";

import { useMemo } from 'react';
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
    Legend
} from 'recharts';

interface DashboardChartsProps {
    orders: any[];
}

// Modern Palette: Emerald (Success), Blue (Info), Amber (Warning), Rose (Error), Violet, Pink
const COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#f43f5e', '#8b5cf6', '#ec4899'];

// Custom Tooltip with Glassmorphism and Smart Context
const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
        const data = payload[0];
        const isRevenue = data.dataKey === 'revenue';

        // Title Logic
        const title = isRevenue ? `Ngày ${label}` : data.name;

        // Value Logic
        const formattedValue = isRevenue
            ? new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(Number(data.value))
            : data.value;

        return (
            <div className="bg-zinc-950/90 backdrop-blur-xl border border-white/10 p-4 rounded-2xl shadow-2xl min-w-[200px] animate-in fade-in zoom-in-95 duration-200">
                <p className="text-muted-foreground mb-3 text-[10px] uppercase tracking-widest font-bold">{title}</p>
                <div className="flex items-center gap-4">
                    <div
                        className="w-1 h-10 rounded-full shadow-[0_0_15px_currentColor]"
                        style={{ backgroundColor: isRevenue ? '#10b981' : (data.payload?.fill || data.color) }}
                    ></div>
                    <div>
                        <span className="text-white font-mono font-bold text-2xl block leading-none mb-1 tracking-tight">
                            {formattedValue}
                            {!isRevenue && <span className="text-sm text-muted-foreground font-sans font-normal ml-1">đơn</span>}
                        </span>
                        {isRevenue && <span className="text-[11px] text-emerald-400 font-sans font-medium uppercase tracking-wider block">Doanh thu ước tính</span>}
                        {!isRevenue && <span className="text-[11px] text-muted-foreground font-sans font-medium block">
                            Chiếm {data.payload?.value ? ((data.payload.value / (data.payload.cx || 100)) * 100).toFixed(0) : 0}% tổng số
                        </span>}
                    </div>
                </div>
            </div>
        );
    }
    return null;
};

export default function DashboardCharts({ orders }: DashboardChartsProps) {

    // 1. Process Revenue Data
    const revenueData = useMemo(() => {
        const dailyMap = new Map();
        // Sort and filter valid
        const validOrders = orders
            .filter(o => o.createdAt)
            .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());

        validOrders.forEach(order => {
            const date = new Date(order.createdAt).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' });
            const amount = order.TotalAmount || 0;
            dailyMap.set(date, (dailyMap.get(date) || 0) + amount);
        });

        return Array.from(dailyMap.entries()).map(([date, revenue]) => ({
            date,
            revenue
        }));
    }, [orders]);

    // 2. Process Status Data
    const statusData = useMemo(() => {
        const statsMap = new Map();
        orders.forEach(order => {
            const status = order.Statuses || 'unknown';
            statsMap.set(status, (statsMap.get(status) || 0) + 1);
        });

        return Array.from(statsMap.entries()).map(([name, value]) => ({
            name: formatStatus(name),
            value
        }));
    }, [orders]);

    function formatStatus(status: string) {
        const map: Record<string, string> = {
            'pending_payment': 'Chờ thanh toán',
            'deposit_paid': 'Đã cọc',
            'processing': 'Đang xử lý',
            'ready_for_pickup': 'Sẵn sàng giao',
            'completed': 'Hoàn thành',
            'cancelled': 'Đã hủy'
        };
        return map[status] || status;
    }

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Revenue Chart */}
            <div className="bg-card/50 border border-white/5 rounded-3xl p-6 lg:p-8 backdrop-blur-sm hover:border-white/10 transition-colors group">
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h3 className="text-xl font-bold text-white">Doanh Thu</h3>
                        <p className="text-sm text-muted-foreground mt-1">Biểu đồ tăng trưởng theo ngày</p>
                    </div>
                    <div className="w-10 h-10 rounded-full bg-emerald-500/10 flex items-center justify-center group-hover:bg-emerald-500/20 transition-colors">
                        <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_10px_#10b981]"></div>
                    </div>
                </div>

                <div className="h-[320px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={revenueData} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
                            <defs>
                                <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                                    <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" vertical={false} />
                            <XAxis
                                dataKey="date"
                                stroke="#52525b"
                                fontSize={11}
                                tickLine={false}
                                axisLine={false}
                                dy={10}
                            />
                            <YAxis
                                stroke="#52525b"
                                fontSize={11}
                                tickLine={false}
                                axisLine={false}
                                tickFormatter={(value) => `${(value / 1000000).toFixed(0)}M`}
                            />
                            <Tooltip
                                content={<CustomTooltip />}
                                cursor={{ stroke: '#10b981', strokeWidth: 1, strokeDasharray: '4 4', opacity: 0.5 }}
                                isAnimationActive={false}
                            />
                            <Area
                                type="natural" // Smoother curve than monotone
                                dataKey="revenue"
                                name="Doanh thu"
                                stroke="#10b981"
                                strokeWidth={3}
                                fillOpacity={1}
                                fill="url(#colorRevenue)"
                                activeDot={{ r: 6, strokeWidth: 0, fill: '#fff' }}
                                animationDuration={1000}
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Status Chart */}
            <div className="bg-card/50 border border-white/5 rounded-3xl p-6 lg:p-8 backdrop-blur-sm hover:border-white/10 transition-colors group">
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h3 className="text-xl font-bold text-white">Trạng Thái Đơn</h3>
                        <p className="text-sm text-muted-foreground mt-1">Phân bố tình trạng đơn hàng</p>
                    </div>
                    <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center group-hover:bg-blue-500/20 transition-colors">
                        <div className="w-2 h-2 rounded-full bg-blue-500 shadow-[0_0_10px_#3b82f6]"></div>
                    </div>
                </div>

                <div className="h-[320px] w-full relative">
                    {/* Inner Label (Total Orders) - Moved to background */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-[60%] text-center pointer-events-none z-0">
                        <div className="text-3xl font-bold text-white">{orders.length}</div>
                        <div className="text-xs text-muted-foreground font-medium uppercase tracking-wider mt-1">Tổng đơn</div>
                    </div>

                    {/* Chart - Foreground */}
                    <div className="relative z-10 w-full h-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={statusData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={85}
                                    outerRadius={110}
                                    paddingAngle={4}
                                    dataKey="value"
                                    cornerRadius={6}
                                    stroke="none"
                                >
                                    {statusData.map((entry, index) => (
                                        <Cell
                                            key={`cell-${index}`}
                                            fill={COLORS[index % COLORS.length]}
                                            className="hover:opacity-80 transition-opacity cursor-pointer"
                                        />
                                    ))}
                                </Pie>
                                <Tooltip
                                    content={<CustomTooltip />}
                                    isAnimationActive={false}
                                />
                                <Legend
                                    layout="horizontal"
                                    verticalAlign="bottom"
                                    align="center"
                                    iconType="circle"
                                    wrapperStyle={{ paddingBottom: '0px' }}
                                    formatter={(value, entry: any) => (
                                        <span className="text-gray-400 text-xs font-medium ml-1 mr-3 relative top-[1px]">{value}</span>
                                    )}
                                />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>
        </div>
    );
}
