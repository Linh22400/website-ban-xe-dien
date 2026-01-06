'use client';

import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface TCOChartProps {
  electricPrice: number;
  gasolinePrice: number;
  electricityRate: number;
  gasolineRate: number;
  dailyKm: number;
  years: number;
}

export default function TCOChart({ electricPrice, gasolinePrice, electricityRate, gasolineRate, dailyKm, years }: TCOChartProps) {
  // Generate cumulative cost data over time
  const generateCostData = () => {
    const data = [];
    const monthlyKm = dailyKm * 30;

    // Electric costs
    const evConsumption = 0.015; // kWh per km
    const evMonthlyEnergy = monthlyKm * evConsumption * electricityRate;
    const evMonthlyMaintenance = 500000 / 12;
    const evMonthlyInsurance = 1000000 / 12;
    const evMonthlyTotal = evMonthlyEnergy + evMonthlyMaintenance + evMonthlyInsurance;

    // Gasoline costs
    const gasolineConsumption = 2.5; // liters per 100km
    const gasolineMonthlyFuel = (monthlyKm / 100) * gasolineConsumption * gasolineRate;
    const gasolineMonthlyMaintenance = 2000000 / 12;
    const gasolineMonthlyInsurance = 1500000 / 12;
    const gasolineMonthlyTotal = gasolineMonthlyFuel + gasolineMonthlyMaintenance + gasolineMonthlyInsurance;

    let evCumulative = electricPrice;
    let gasolineCumulative = gasolinePrice;

    for (let month = 0; month <= years * 12; month++) {
      if (month > 0) {
        evCumulative += evMonthlyTotal;
        gasolineCumulative += gasolineMonthlyTotal;
      }

      data.push({
        month: month,
        label: month === 0 ? 'Mua xe' : `${month} tháng`,
        evCost: Math.round(evCumulative),
        gasolineCost: Math.round(gasolineCumulative),
        savings: Math.round(gasolineCumulative - evCumulative)
      });
    }

    return data;
  };

  const costData = generateCostData();
  const breakEvenPoint = costData.find(d => d.savings >= 0);

  // Generate cost breakdown data
  const breakdownData = [
    {
      category: 'Mua xe',
      electric: electricPrice,
      gasoline: gasolinePrice
    },
    {
      category: 'Năng lượng',
      electric: costData[costData.length - 1].evCost - electricPrice - (500000 + 1000000) * years,
      gasoline: costData[costData.length - 1].gasolineCost - gasolinePrice - (2000000 + 1500000) * years
    },
    {
      category: 'Bảo dưỡng',
      electric: 500000 * years,
      gasoline: 2000000 * years
    },
    {
      category: 'Bảo hiểm',
      electric: 1000000 * years,
      gasoline: 1500000 * years
    }
  ];

  const formatCurrency = (value: number) => {
    return `${(value / 1000000).toFixed(1)}M`;
  };

  return (
    <div className="space-y-8">
      {/* Cumulative Cost Over Time */}
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <h3 className="text-xl font-bold text-gray-900 mb-4">Chi Phí Tích Lũy Theo Thời Gian</h3>
        <ResponsiveContainer width="100%" height={400}>
          <LineChart data={costData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              dataKey="month" 
              label={{ value: 'Thời gian (tháng)', position: 'insideBottom', offset: -5 }}
            />
            <YAxis 
              tickFormatter={formatCurrency}
              label={{ value: 'Chi phí (triệu VNĐ)', angle: -90, position: 'insideLeft' }}
            />
            <Tooltip 
              formatter={(value: number | undefined) => value ? `${value.toLocaleString('vi-VN')} ₫` : ''}
              labelFormatter={(label) => `Tháng ${label}`}
            />
            <Legend />
            <Line 
              type="monotone" 
              dataKey="evCost" 
              stroke="#10b981" 
              strokeWidth={3}
              name="Xe điện"
              dot={false}
            />
            <Line 
              type="monotone" 
              dataKey="gasolineCost" 
              stroke="#f97316" 
              strokeWidth={3}
              name="Xe xăng"
              dot={false}
            />
            {breakEvenPoint && (
              <Line
                type="monotone"
                dataKey="month"
                stroke="transparent"
                dot={(props: any) => {
                  if (props.payload.month === breakEvenPoint.month) {
                    return (
                      <g>
                        <circle cx={props.cx} cy={props.cy} r={8} fill="#3b82f6" />
                        <text x={props.cx} y={props.cy - 15} textAnchor="middle" fill="#3b82f6" fontSize={12} fontWeight="bold">
                          Hòa vốn
                        </text>
                      </g>
                    );
                  }
                  return null;
                }}
              />
            )}
          </LineChart>
        </ResponsiveContainer>
        {breakEvenPoint && (
          <p className="text-center text-blue-600 font-semibold mt-4">
            🎯 Điểm hòa vốn: Tháng {breakEvenPoint.month} - Bắt đầu tiết kiệm từ đây!
          </p>
        )}
      </div>

      {/* Cost Breakdown Comparison */}
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <h3 className="text-xl font-bold text-gray-900 mb-4">So Sánh Chi Phí Từng Hạng Mục</h3>
        <ResponsiveContainer width="100%" height={350}>
          <BarChart data={breakdownData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="category" />
            <YAxis 
              tickFormatter={formatCurrency}
              label={{ value: 'Chi phí (triệu VNĐ)', angle: -90, position: 'insideLeft' }}
            />
            <Tooltip 
              formatter={(value: number | undefined) => value ? `${value.toLocaleString('vi-VN')} ₫` : ''}
            />
            <Legend />
            <Bar dataKey="electric" fill="#10b981" name="Xe điện" />
            <Bar dataKey="gasoline" fill="#f97316" name="Xe xăng" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Savings Over Time */}
      <div className="bg-gradient-to-r from-blue-50 to-green-50 p-6 rounded-lg">
        <h3 className="text-xl font-bold text-gray-900 mb-4">Tiết Kiệm Tích Lũy</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={costData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              dataKey="month" 
              label={{ value: 'Thời gian (tháng)', position: 'insideBottom', offset: -5 }}
            />
            <YAxis 
              tickFormatter={formatCurrency}
              label={{ value: 'Tiết kiệm (triệu VNĐ)', angle: -90, position: 'insideLeft' }}
            />
            <Tooltip 
              formatter={(value: number | undefined) => value ? `${value.toLocaleString('vi-VN')} ₫` : ''}
              labelFormatter={(label) => `Tháng ${label}`}
            />
            <Legend />
            <Line 
              type="monotone" 
              dataKey="savings" 
              stroke="#3b82f6" 
              strokeWidth={3}
              name="Tiết kiệm được"
              dot={false}
              fill="url(#colorSavings)"
            />
            <defs>
              <linearGradient id="colorSavings" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
              </linearGradient>
            </defs>
          </LineChart>
        </ResponsiveContainer>
        <div className="mt-4 text-center">
          <p className="text-2xl font-bold text-blue-600">
            {costData[costData.length - 1].savings.toLocaleString('vi-VN')} ₫
          </p>
          <p className="text-gray-600">Tổng tiết kiệm sau {years} năm</p>
        </div>
      </div>
    </div>
  );
}
