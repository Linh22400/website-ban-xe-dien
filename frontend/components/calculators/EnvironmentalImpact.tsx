'use client';

import { Leaf, Wind, Droplets, Trees } from 'lucide-react';

interface EnvironmentalImpactProps {
  dailyKm: number;
  years: number;
}

export default function EnvironmentalImpact({ dailyKm, years }: EnvironmentalImpactProps) {
  const totalKm = dailyKm * 365 * years;
  
  // Gasoline scooter emissions: ~120g CO2 per km
  // Electric scooter: 0g direct emissions (indirect from power generation: ~50g/km in Vietnam)
  const gasolineCO2PerKm = 0.12; // kg
  const electricCO2PerKm = 0.05; // kg (from power generation)
  
  const gasolineTotalCO2 = totalKm * gasolineCO2PerKm;
  const electricTotalCO2 = totalKm * electricCO2PerKm;
  const co2Saved = gasolineTotalCO2 - electricTotalCO2;
  
  // 1 tree absorbs ~20kg CO2 per year
  const treesEquivalent = Math.round((co2Saved / 20) * 10) / 10;
  
  // Fuel consumption saved
  const gasolineConsumption = 2.5; // liters per 100km
  const fuelSaved = (totalKm / 100) * gasolineConsumption;
  
  // Air pollutants avoided (gasoline vehicles emit)
  const noxSaved = totalKm * 0.0002; // kg
  const pmSaved = totalKm * 0.00005; // kg
  const coSaved = totalKm * 0.001; // kg

  return (
    <div className="bg-gradient-to-br from-green-50 to-blue-50 rounded-lg shadow-lg p-8 space-y-8">
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-green-500 rounded-full mb-4">
          <Leaf className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-3xl font-bold text-gray-900 mb-2">
          Tác Động Môi Trường
        </h2>
        <p className="text-gray-600">
          Bảo vệ hành tinh với xe điện - Đóng góp cụ thể của bạn trong {years} năm
        </p>
      </div>

      {/* Main Impact Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* CO2 Reduction */}
        <div className="bg-white rounded-xl p-6 shadow-md border-2 border-green-200">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
              <Wind className="w-6 h-6 text-green-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900">Giảm CO₂</h3>
          </div>
          <div className="space-y-3">
            <div>
              <p className="text-4xl font-bold text-green-600">{co2Saved.toFixed(0)} kg</p>
              <p className="text-sm text-gray-600">CO₂ tiết kiệm được</p>
            </div>
            <div className="pt-3 border-t">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Xe xăng phát thải:</span>
                <span className="font-semibold text-orange-600">{gasolineTotalCO2.toFixed(0)} kg</span>
              </div>
              <div className="flex justify-between text-sm mt-1">
                <span className="text-gray-600">Xe điện phát thải:</span>
                <span className="font-semibold text-green-600">{electricTotalCO2.toFixed(0)} kg</span>
              </div>
            </div>
          </div>
        </div>

        {/* Trees Equivalent */}
        <div className="bg-white rounded-xl p-6 shadow-md border-2 border-blue-200">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
              <Trees className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900">Trồng Cây</h3>
          </div>
          <div className="space-y-3">
            <div>
              <p className="text-4xl font-bold text-blue-600">{treesEquivalent}</p>
              <p className="text-sm text-gray-600">Tương đương số cây trồng</p>
            </div>
            <div className="pt-3 border-t">
              <p className="text-sm text-gray-600">
                Việc chuyển sang xe điện giúp bạn đóng góp tương đương việc trồng {treesEquivalent} cây xanh trong {years} năm
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Fuel Saved */}
      <div className="bg-white rounded-xl p-6 shadow-md">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
            <Droplets className="w-6 h-6 text-orange-600" />
          </div>
          <h3 className="text-xl font-bold text-gray-900">Tiết Kiệm Nhiên Liệu</h3>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center p-4 bg-orange-50 rounded-lg">
            <p className="text-2xl font-bold text-orange-600">{fuelSaved.toFixed(0)}</p>
            <p className="text-sm text-gray-600">Lít xăng tiết kiệm</p>
          </div>
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <p className="text-2xl font-bold text-blue-600">0%</p>
            <p className="text-sm text-gray-600">Nhiên liệu hóa thạch</p>
          </div>
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <p className="text-2xl font-bold text-green-600">100%</p>
            <p className="text-sm text-gray-600">Năng lượng sạch</p>
          </div>
          <div className="text-center p-4 bg-purple-50 rounded-lg">
            <p className="text-2xl font-bold text-purple-600">
              {((fuelSaved * 25000) / 1000000).toFixed(1)}M
            </p>
            <p className="text-sm text-gray-600">VNĐ tiết kiệm nhiên liệu</p>
          </div>
        </div>
      </div>

      {/* Air Pollutants Avoided */}
      <div className="bg-white rounded-xl p-6 shadow-md">
        <h3 className="text-xl font-bold text-gray-900 mb-4">Chất Gây Ô Nhiễm Tránh Được</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 bg-red-50 rounded-lg">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-semibold text-gray-700">NOx (Oxit Nitơ)</span>
              <span className="text-xs bg-red-200 text-red-800 px-2 py-1 rounded">Độc hại</span>
            </div>
            <p className="text-2xl font-bold text-red-600">{(noxSaved * 1000).toFixed(0)}g</p>
            <p className="text-xs text-gray-600 mt-1">Gây bệnh hô hấp</p>
          </div>
          <div className="p-4 bg-yellow-50 rounded-lg">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-semibold text-gray-700">PM (Bụi mịn)</span>
              <span className="text-xs bg-yellow-200 text-yellow-800 px-2 py-1 rounded">Nguy hiểm</span>
            </div>
            <p className="text-2xl font-bold text-yellow-600">{(pmSaved * 1000).toFixed(0)}g</p>
            <p className="text-xs text-gray-600 mt-1">Gây ung thư phổi</p>
          </div>
          <div className="p-4 bg-orange-50 rounded-lg">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-semibold text-gray-700">CO (Carbon monoxide)</span>
              <span className="text-xs bg-orange-200 text-orange-800 px-2 py-1 rounded">Độc</span>
            </div>
            <p className="text-2xl font-bold text-orange-600">{(coSaved * 1000).toFixed(0)}g</p>
            <p className="text-xs text-gray-600 mt-1">Gây ngộ độc</p>
          </div>
        </div>
      </div>

      {/* Benefits Summary */}
      <div className="bg-gradient-to-r from-green-600 to-blue-600 text-white rounded-xl p-6">
        <h3 className="text-xl font-bold mb-4">🌍 Lợi Ích Tổng Thể</h3>
        <ul className="space-y-2 text-sm">
          <li className="flex items-start gap-2">
            <span className="text-green-300">✓</span>
            <span>Không phát thải trực tiếp - xe điện không tạo khí thải tại chỗ, giúp không khí sạch hơn</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-green-300">✓</span>
            <span>Giảm ô nhiễm tiếng ồn - động cơ điện hoạt động êm ái hơn 70% so với động cơ xăng</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-green-300">✓</span>
            <span>Hiệu suất năng lượng cao - xe điện chuyển đổi 77% năng lượng điện thành chuyển động (xe xăng chỉ ~20%)</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-green-300">✓</span>
            <span>Đóng góp vào mục tiêu Net Zero 2050 của Việt Nam</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-green-300">✓</span>
            <span>Bảo vệ sức khỏe cộng đồng bằng cách giảm bệnh đường hô hấp và tim mạch</span>
          </li>
        </ul>
      </div>

      {/* Call to Action */}
      <div className="text-center bg-white rounded-xl p-6 shadow-md">
        <p className="text-gray-700 text-lg mb-2">
          Mỗi km bạn đi bằng xe điện là một đóng góp cho môi trường sạch hơn
        </p>
        <p className="text-sm text-gray-500">
          Cùng chung tay xây dựng tương lai xanh, bền vững cho thế hệ sau
        </p>
      </div>
    </div>
  );
}
