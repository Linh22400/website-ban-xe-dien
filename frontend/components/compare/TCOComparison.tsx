'use client';

import { useState } from 'react';
import { Car } from '@/lib/api';
import { Calculator, TrendingDown, Zap, Fuel } from 'lucide-react';

interface TCOComparisonProps {
  cars: Car[];
}

interface TCOResult {
  carId: string;
  carName: string;
  carPrice: number;
  totalCost: number;
  breakdown: {
    purchase: number;
    energy: number;
    maintenance: number;
    insurance: number;
  };
  monthlyCost: number;
  isElectric: boolean;
}

export default function TCOComparison({ cars }: TCOComparisonProps) {
  const [dailyKm, setDailyKm] = useState(30);
  const [years, setYears] = useState(5);
  const [electricityRate, setElectricityRate] = useState(2500);
  const [gasolinePrice, setGasolinePrice] = useState(25000);
  const [showResults, setShowResults] = useState(false);

  const calculateTCO = () => {
    const totalDays = years * 365;
    const totalKm = dailyKm * totalDays;

    const results: TCOResult[] = cars.map((car) => {
      const isElectric = true; // Assuming all TAILG vehicles are electric
      
      if (isElectric) {
        // Electric vehicle costs
        const evConsumption = 0.015; // kWh per km
        const energyCost = totalKm * evConsumption * electricityRate;
        const maintenanceCost = 500000 * years;
        const insuranceCost = 1000000 * years;
        const totalCost = car.price + energyCost + maintenanceCost + insuranceCost;

        return {
          carId: String(car.id),
          carName: car.name,
          carPrice: car.price,
          totalCost,
          breakdown: {
            purchase: car.price,
            energy: energyCost,
            maintenance: maintenanceCost,
            insurance: insuranceCost,
          },
          monthlyCost: totalCost / (years * 12),
          isElectric: true,
        };
      } else {
        // Gasoline vehicle costs (for comparison if needed)
        const gasolineConsumption = 2.5; // liters per 100km
        const fuelCost = (totalKm / 100) * gasolineConsumption * gasolinePrice;
        const maintenanceCost = 2000000 * years;
        const insuranceCost = 1500000 * years;
        const totalCost = car.price + fuelCost + maintenanceCost + insuranceCost;

        return {
          carId: String(car.id),
          carName: car.name,
          carPrice: car.price,
          totalCost,
          breakdown: {
            purchase: car.price,
            energy: fuelCost,
            maintenance: maintenanceCost,
            insurance: insuranceCost,
          },
          monthlyCost: totalCost / (years * 12),
          isElectric: false,
        };
      }
    });

    return results.sort((a, b) => a.totalCost - b.totalCost);
  };

  const results = showResults ? calculateTCO() : [];
  const bestValue = results.length > 0 ? results[0] : null;

  // Calculate comparison with gasoline equivalent
  const gasolineEquivalentPrice = 30000000; // Average gasoline scooter price
  const gasolineComparison = results.map((result) => {
    const totalDays = years * 365;
    const totalKm = dailyKm * totalDays;
    
    const gasolineConsumption = 2.5;
    const gasolineFuelCost = (totalKm / 100) * gasolineConsumption * gasolinePrice;
    const gasolineMaintenanceCost = 2000000 * years;
    const gasolineInsuranceCost = 1500000 * years;
    const gasolineTotalCost = gasolineEquivalentPrice + gasolineFuelCost + gasolineMaintenanceCost + gasolineInsuranceCost;

    return {
      ...result,
      savings: gasolineTotalCost - result.totalCost,
      savingsPercent: ((gasolineTotalCost - result.totalCost) / gasolineTotalCost) * 100,
    };
  });

  return (
    <div className="bg-white rounded-lg shadow-lg p-8 space-y-8">
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
          <Calculator className="w-8 h-8 text-blue-600" />
        </div>
        <h2 className="text-3xl font-bold text-gray-900 mb-2">
          So Sánh Chi Phí Tổng Thể (TCO)
        </h2>
        <p className="text-gray-600">
          Tính toán và so sánh chi phí sử dụng trong {years} năm
        </p>
      </div>

      {/* Input Parameters */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 bg-gray-50 rounded-lg">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Quãng đường mỗi ngày (km)
          </label>
          <input
            type="number"
            value={dailyKm}
            onChange={(e) => setDailyKm(Number(e.target.value))}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Thời gian sử dụng (năm)
          </label>
          <input
            type="number"
            value={years}
            onChange={(e) => setYears(Number(e.target.value))}
            min="1"
            max="10"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Giá điện (VNĐ/kWh)
          </label>
          <input
            type="number"
            value={electricityRate}
            onChange={(e) => setElectricityRate(Number(e.target.value))}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Giá xăng (VNĐ/lít)
          </label>
          <input
            type="number"
            value={gasolinePrice}
            onChange={(e) => setGasolinePrice(Number(e.target.value))}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Calculate Button */}
      <button
        onClick={() => setShowResults(true)}
        className="w-full px-8 py-4 bg-gradient-to-r from-blue-600 to-green-600 text-white font-bold rounded-lg hover:from-blue-700 hover:to-green-700 transition-all transform hover:scale-105 flex items-center justify-center gap-2"
      >
        <Calculator className="w-5 h-5" />
        So Sánh Chi Phí
      </button>

      {/* Results */}
      {showResults && results.length > 0 && (
        <div className="space-y-6 pt-6 border-t-2 border-gray-200">
          {/* Best Value Banner */}
          {bestValue && (
            <div className="bg-gradient-to-r from-green-500 to-blue-500 text-white p-6 rounded-lg">
              <div className="flex items-center gap-3 mb-2">
                <TrendingDown className="w-6 h-6" />
                <h3 className="text-xl font-bold">Giá Trị Tốt Nhất</h3>
              </div>
              <p className="text-lg">{bestValue.carName}</p>
              <p className="text-sm opacity-90">
                Tổng chi phí thấp nhất: {bestValue.totalCost.toLocaleString('vi-VN')} ₫
              </p>
            </div>
          )}

          {/* Comparison Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {gasolineComparison.map((result, index) => (
              <div
                key={result.carId}
                className={`bg-white border-2 rounded-xl p-6 shadow-md ${
                  result.carId === bestValue?.carId
                    ? 'border-green-500 ring-4 ring-green-100'
                    : 'border-gray-200'
                }`}
              >
                {result.carId === bestValue?.carId && (
                  <div className="bg-green-500 text-white text-xs font-bold px-3 py-1 rounded-full inline-block mb-3">
                    🏆 TỐT NHẤT
                  </div>
                )}
                
                <h4 className="text-lg font-bold text-gray-900 mb-4">{result.carName}</h4>

                {/* Total Cost */}
                <div className="mb-4 pb-4 border-b">
                  <p className="text-sm text-gray-600 mb-1">Tổng chi phí {years} năm</p>
                  <p className="text-2xl font-bold text-blue-600">
                    {result.totalCost.toLocaleString('vi-VN')} ₫
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    ~{result.monthlyCost.toLocaleString('vi-VN')} ₫/tháng
                  </p>
                </div>

                {/* Breakdown */}
                <div className="space-y-2 text-sm mb-4">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Giá mua xe</span>
                    <span className="font-semibold">{(result.breakdown.purchase / 1000000).toFixed(1)}M</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">
                      {result.isElectric ? 'Điện năng' : 'Nhiên liệu'}
                    </span>
                    <span className="font-semibold">{(result.breakdown.energy / 1000000).toFixed(1)}M</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Bảo dưỡng</span>
                    <span className="font-semibold">{(result.breakdown.maintenance / 1000000).toFixed(1)}M</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Bảo hiểm</span>
                    <span className="font-semibold">{(result.breakdown.insurance / 1000000).toFixed(1)}M</span>
                  </div>
                </div>

                {/* Savings vs Gasoline */}
                <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                  <p className="text-xs text-green-800 font-semibold mb-1">
                    So với xe xăng tương đương
                  </p>
                  <p className="text-lg font-bold text-green-600">
                    {result.savings > 0 ? 'Tiết kiệm' : 'Chi phí thêm'}{' '}
                    {Math.abs(result.savings).toLocaleString('vi-VN')} ₫
                  </p>
                  <p className="text-xs text-green-700">
                    ({result.savingsPercent > 0 ? '-' : '+'}{Math.abs(result.savingsPercent).toFixed(1)}%)
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Comparison Table */}
          <div className="bg-white rounded-lg overflow-hidden border border-gray-200">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Xe</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Giá mua</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Năng lượng</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Bảo dưỡng</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Tổng cộng</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Tiết kiệm</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {gasolineComparison.map((result) => (
                  <tr key={result.carId} className={result.carId === bestValue?.carId ? 'bg-green-50' : ''}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        {result.isElectric ? (
                          <Zap className="w-4 h-4 text-green-600" />
                        ) : (
                          <Fuel className="w-4 h-4 text-orange-600" />
                        )}
                        <span className="font-medium text-gray-900">{result.carName}</span>
                        {result.carId === bestValue?.carId && (
                          <span className="text-xs bg-green-500 text-white px-2 py-0.5 rounded-full">TỐT NHẤT</span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right text-sm text-gray-900">
                      {(result.breakdown.purchase / 1000000).toFixed(1)}M
                    </td>
                    <td className="px-6 py-4 text-right text-sm text-gray-900">
                      {(result.breakdown.energy / 1000000).toFixed(1)}M
                    </td>
                    <td className="px-6 py-4 text-right text-sm text-gray-900">
                      {(result.breakdown.maintenance / 1000000).toFixed(1)}M
                    </td>
                    <td className="px-6 py-4 text-right text-sm font-semibold text-gray-900">
                      {(result.totalCost / 1000000).toFixed(1)}M
                    </td>
                    <td className="px-6 py-4 text-right text-sm font-semibold">
                      <span className={result.savings > 0 ? 'text-green-600' : 'text-red-600'}>
                        {result.savings > 0 ? '-' : '+'}
                        {(Math.abs(result.savings) / 1000000).toFixed(1)}M
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Summary */}
          <div className="bg-blue-50 border-l-4 border-blue-500 p-6 rounded-r-lg">
            <h4 className="font-bold text-blue-900 text-lg mb-2">📊 Kết Luận</h4>
            <ul className="text-blue-800 space-y-2 text-sm">
              <li>• Với quãng đường {dailyKm}km/ngày trong {years} năm, tổng quãng đường: {(dailyKm * 365 * years).toLocaleString('vi-VN')} km</li>
              <li>• Tất cả các xe điện đều tiết kiệm hơn xe xăng về lâu dài</li>
              <li>• Chi phí năng lượng xe điện thấp hơn ~70% so với xe xăng</li>
              <li>• Chi phí bảo dưỡng xe điện thấp hơn ~75% so với xe xăng</li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}
