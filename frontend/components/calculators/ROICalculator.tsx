'use client';

import { useState } from 'react';
import { Calculator, TrendingDown, Zap, Fuel, Wrench, DollarSign } from 'lucide-react';

interface CalculatorResult {
  electricTotal: number;
  gasolineTotal: number;
  savings: number;
  breakEvenMonths: number;
  electricBreakdown: {
    purchase: number;
    electricity: number;
    maintenance: number;
    insurance: number;
  };
  gasolineBreakdown: {
    purchase: number;
    fuel: number;
    maintenance: number;
    insurance: number;
  };
}

export default function ROICalculator() {
  // Electric vehicle inputs
  const [electricPrice, setElectricPrice] = useState(15000000); // 15M VND
  const [dailyKm, setDailyKm] = useState(30);
  const [years, setYears] = useState(5);

  // Cost parameters
  const [electricityRate, setElectricityRate] = useState(2500); // VND per kWh
  const [gasolinePrice, setGasolinePrice] = useState(25000); // VND per liter
  const [gasolineVehiclePrice, setGasolineVehiclePrice] = useState(30000000); // 30M VND

  const [result, setResult] = useState<CalculatorResult | null>(null);
  const [showChart, setShowChart] = useState(false);

  const calculateROI = () => {
    const totalDays = years * 365;
    const totalKm = dailyKm * totalDays;

    // Electric vehicle costs
    const evConsumption = 0.015; // kWh per km (average)
    const evTotalElectricity = totalKm * evConsumption * electricityRate;
    const evMaintenancePerYear = 500000; // 500k VND/year
    const evInsurancePerYear = 1000000; // 1M VND/year
    const evTotalMaintenance = evMaintenancePerYear * years;
    const evTotalInsurance = evInsurancePerYear * years;
    const evTotal = electricPrice + evTotalElectricity + evTotalMaintenance + evTotalInsurance;

    // Gasoline vehicle costs
    const gasolineConsumption = 2.5; // liters per 100km (average scooter)
    const gasolineTotalFuel = (totalKm / 100) * gasolineConsumption * gasolinePrice;
    const gasolineMaintenancePerYear = 2000000; // 2M VND/year
    const gasolineInsurancePerYear = 1500000; // 1.5M VND/year
    const gasolineTotalMaintenance = gasolineMaintenancePerYear * years;
    const gasolineTotalInsurance = gasolineInsurancePerYear * years;
    const gasolineTotal = gasolineVehiclePrice + gasolineTotalFuel + gasolineTotalMaintenance + gasolineTotalInsurance;

    // Calculate savings and break-even
    const savings = gasolineTotal - evTotal;
    const monthlySavings = (gasolineTotalFuel - evTotalElectricity + gasolineTotalMaintenance - evTotalMaintenance) / (years * 12);
    const priceDifference = electricPrice - gasolineVehiclePrice;
    const breakEvenMonths = priceDifference < 0 ? 0 : Math.ceil(Math.abs(priceDifference) / monthlySavings);

    setResult({
      electricTotal: evTotal,
      gasolineTotal: gasolineTotal,
      savings: savings,
      breakEvenMonths: breakEvenMonths,
      electricBreakdown: {
        purchase: electricPrice,
        electricity: evTotalElectricity,
        maintenance: evTotalMaintenance,
        insurance: evTotalInsurance
      },
      gasolineBreakdown: {
        purchase: gasolineVehiclePrice,
        fuel: gasolineTotalFuel,
        maintenance: gasolineTotalMaintenance,
        insurance: gasolineTotalInsurance
      }
    });

    setShowChart(true);
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-8 space-y-8">
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
          <Calculator className="w-8 h-8 text-green-600" />
        </div>
        <h2 className="text-3xl font-bold text-gray-900 mb-2">
          So Sánh Chi Phí Tổng Thể (TCO)
        </h2>
        <p className="text-gray-600">
          Xe điện vs Xe xăng - Tính toán chi tiết trong {years} năm
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Electric Vehicle Section */}
        <div className="space-y-4 p-6 bg-green-50 rounded-lg">
          <h3 className="text-xl font-bold text-green-900 flex items-center gap-2">
            <Zap className="w-5 h-5" />
            Xe Điện
          </h3>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Giá xe điện (VNĐ)
            </label>
            <input
              type="number"
              value={electricPrice}
              onChange={(e) => setElectricPrice(Number(e.target.value))}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
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
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
            />
          </div>
        </div>

        {/* Gasoline Vehicle Section */}
        <div className="space-y-4 p-6 bg-orange-50 rounded-lg">
          <h3 className="text-xl font-bold text-orange-900 flex items-center gap-2">
            <Fuel className="w-5 h-5" />
            Xe Xăng
          </h3>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Giá xe xăng (VNĐ)
            </label>
            <input
              type="number"
              value={gasolineVehiclePrice}
              onChange={(e) => setGasolineVehiclePrice(Number(e.target.value))}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
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
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
            />
          </div>
        </div>
      </div>

      {/* Common Parameters */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
      </div>

      {/* Calculate Button */}
      <button
        onClick={calculateROI}
        className="w-full px-8 py-4 bg-gradient-to-r from-green-600 to-blue-600 text-white font-bold rounded-lg hover:from-green-700 hover:to-blue-700 transition-all transform hover:scale-105 flex items-center justify-center gap-2"
      >
        <Calculator className="w-5 h-5" />
        Tính Toán
      </button>

      {/* Results */}
      {result && showChart && (
        <div className="space-y-6 pt-6 border-t-2 border-gray-200">
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-gradient-to-br from-green-500 to-green-600 text-white p-6 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Zap className="w-5 h-5" />
                <span className="text-sm opacity-90">Tổng chi phí xe điện</span>
              </div>
              <div className="text-3xl font-bold">
                {result.electricTotal.toLocaleString('vi-VN')} ₫
              </div>
            </div>

            <div className="bg-gradient-to-br from-orange-500 to-orange-600 text-white p-6 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Fuel className="w-5 h-5" />
                <span className="text-sm opacity-90">Tổng chi phí xe xăng</span>
              </div>
              <div className="text-3xl font-bold">
                {result.gasolineTotal.toLocaleString('vi-VN')} ₫
              </div>
            </div>

            <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white p-6 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <TrendingDown className="w-5 h-5" />
                <span className="text-sm opacity-90">Tiết kiệm được</span>
              </div>
              <div className="text-3xl font-bold">
                {result.savings.toLocaleString('vi-VN')} ₫
              </div>
            </div>
          </div>

          {/* Break-even Point */}
          <div className="bg-blue-50 border-l-4 border-blue-500 p-6 rounded-r-lg">
            <div className="flex items-center gap-3">
              <DollarSign className="w-8 h-8 text-blue-600" />
              <div>
                <h4 className="font-bold text-blue-900 text-lg">Điểm Hòa Vốn</h4>
                <p className="text-blue-700">
                  {result.breakEvenMonths <= 0 
                    ? 'Xe điện rẻ hơn ngay từ đầu!' 
                    : `Sau ${result.breakEvenMonths} tháng sử dụng, bạn sẽ bắt đầu tiết kiệm tiền với xe điện`}
                </p>
              </div>
            </div>
          </div>

          {/* Detailed Breakdown */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Electric Breakdown */}
            <div>
              <h4 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Zap className="w-5 h-5 text-green-600" />
                Chi tiết xe điện
              </h4>
              <div className="space-y-3">
                <div className="flex justify-between items-center pb-2 border-b">
                  <span className="text-gray-600">Giá mua xe</span>
                  <span className="font-semibold">{result.electricBreakdown.purchase.toLocaleString('vi-VN')} ₫</span>
                </div>
                <div className="flex justify-between items-center pb-2 border-b">
                  <span className="text-gray-600">Điện năng</span>
                  <span className="font-semibold">{result.electricBreakdown.electricity.toLocaleString('vi-VN')} ₫</span>
                </div>
                <div className="flex justify-between items-center pb-2 border-b">
                  <span className="text-gray-600">Bảo dưỡng</span>
                  <span className="font-semibold">{result.electricBreakdown.maintenance.toLocaleString('vi-VN')} ₫</span>
                </div>
                <div className="flex justify-between items-center pb-2 border-b">
                  <span className="text-gray-600">Bảo hiểm</span>
                  <span className="font-semibold">{result.electricBreakdown.insurance.toLocaleString('vi-VN')} ₫</span>
                </div>
              </div>
            </div>

            {/* Gasoline Breakdown */}
            <div>
              <h4 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Fuel className="w-5 h-5 text-orange-600" />
                Chi tiết xe xăng
              </h4>
              <div className="space-y-3">
                <div className="flex justify-between items-center pb-2 border-b">
                  <span className="text-gray-600">Giá mua xe</span>
                  <span className="font-semibold">{result.gasolineBreakdown.purchase.toLocaleString('vi-VN')} ₫</span>
                </div>
                <div className="flex justify-between items-center pb-2 border-b">
                  <span className="text-gray-600">Nhiên liệu</span>
                  <span className="font-semibold">{result.gasolineBreakdown.fuel.toLocaleString('vi-VN')} ₫</span>
                </div>
                <div className="flex justify-between items-center pb-2 border-b">
                  <span className="text-gray-600">Bảo dưỡng</span>
                  <span className="font-semibold">{result.gasolineBreakdown.maintenance.toLocaleString('vi-VN')} ₫</span>
                </div>
                <div className="flex justify-between items-center pb-2 border-b">
                  <span className="text-gray-600">Bảo hiểm</span>
                  <span className="font-semibold">{result.gasolineBreakdown.insurance.toLocaleString('vi-VN')} ₫</span>
                </div>
              </div>
            </div>
          </div>

          {/* Environmental Impact */}
          <div className="bg-green-50 p-6 rounded-lg">
            <h4 className="font-bold text-green-900 mb-3">🌱 Tác động môi trường</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-green-600">
                  {((dailyKm * 365 * years / 100) * 2.5 * 2.3).toFixed(0)} kg
                </div>
                <div className="text-sm text-gray-600">CO₂ tiết kiệm được</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-green-600">0%</div>
                <div className="text-sm text-gray-600">Khí thải độc hại</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-green-600">100%</div>
                <div className="text-sm text-gray-600">Năng lượng sạch</div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
