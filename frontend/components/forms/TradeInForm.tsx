'use client';

import { useState } from 'react';
import { useAuth } from '@/lib/auth-context';
import { Upload, X, Calculator } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

interface TradeInFormData {
  VehicleBrand: string;
  VehicleModel: string;
  VehicleYear: number;
  VehicleType: 'bicycle' | 'motorcycle' | 'scooter';
  Condition: 'excellent' | 'good' | 'fair' | 'poor';
  Mileage: number;
  BatteryHealth: number;
  HasAccidents: boolean;
  HasModifications: boolean;
  AdditionalNotes: string;
  ContactPhone: string;
  ContactEmail: string;
  PreferredContactMethod: 'phone' | 'email' | 'both';
}

export default function TradeInForm() {
  const { user, token } = useAuth();
  const router = useRouter();
  
  const [formData, setFormData] = useState<TradeInFormData>({
    VehicleBrand: '',
    VehicleModel: '',
    VehicleYear: new Date().getFullYear(),
    VehicleType: 'bicycle',
    Condition: 'good',
    Mileage: 0,
    BatteryHealth: 80,
    HasAccidents: false,
    HasModifications: false,
    AdditionalNotes: '',
    ContactPhone: '',
    ContactEmail: user?.email || '',
    PreferredContactMethod: 'phone'
  });

  const [images, setImages] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [estimatedValue, setEstimatedValue] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? Number(value) : 
              type === 'checkbox' ? (e.target as HTMLInputElement).checked : 
              value
    }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length + images.length > 10) {
      setError('Tối đa 10 ảnh');
      return;
    }

    setImages(prev => [...prev, ...files]);
    
    files.forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreviews(prev => [...prev, reader.result as string]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
    setImagePreviews(prev => prev.filter((_, i) => i !== index));
  };

  const calculateEstimate = () => {
    const currentYear = new Date().getFullYear();
    const vehicleAge = currentYear - formData.VehicleYear;

    let baseValue = 10000000; // 10 triệu VND

    // Depreciation
    const ageDepreciation = Math.min(vehicleAge * 0.1, 0.5);
    baseValue *= (1 - ageDepreciation);

    // Condition
    const conditionMultipliers = {
      excellent: 1.0,
      good: 0.85,
      fair: 0.65,
      poor: 0.45
    };
    baseValue *= conditionMultipliers[formData.Condition];

    // Mileage
    if (formData.Mileage > 5000) {
      const excessMileage = formData.Mileage - 5000;
      const mileageDeduction = Math.min((excessMileage / 1000) * 0.01, 0.3);
      baseValue *= (1 - mileageDeduction);
    }

    // Battery health
    baseValue *= (formData.BatteryHealth / 100);

    // Accidents
    if (formData.HasAccidents) {
      baseValue *= 0.8;
    }

    // Modifications
    if (formData.HasModifications) {
      baseValue *= 0.9;
    }

    setEstimatedValue(Math.round(baseValue));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (!token) {
      setError('Vui lòng đăng nhập');
      setLoading(false);
      return;
    }

    try {
      // Upload images
      let uploadedImageIds: number[] = [];
      if (images.length > 0) {
        const imageFormData = new FormData();
        images.forEach(image => {
          imageFormData.append('files', image);
        });

        const uploadResponse = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/upload`,
          {
            method: 'POST',
            headers: {
              Authorization: `Bearer ${token}`,
            },
            body: imageFormData,
          }
        );

        if (!uploadResponse.ok) {
          throw new Error('Lỗi khi tải ảnh lên');
        }

        const uploadedFiles = await uploadResponse.json();
        uploadedImageIds = uploadedFiles.map((file: any) => file.id);
      }

      // Submit trade-in request
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/trade-ins`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            data: {
              ...formData,
              Photos: uploadedImageIds
            }
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error?.message || 'Lỗi khi gửi yêu cầu');
      }

      alert('Yêu cầu thu cũ đổi mới của bạn đã được gửi! Chúng tôi sẽ liên hệ sớm.');
      router.push('/account/trade-ins');
    } catch (err: any) {
      setError(err.message || 'Có lỗi xảy ra');
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-sm p-8 border border-gray-200 text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Thu cũ đổi mới</h2>
        <p className="text-gray-600 mb-6">
          Vui lòng đăng nhập để sử dụng dịch vụ thu cũ đổi mới
        </p>
        <a
          href="/login"
          className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold"
        >
          Đăng nhập
        </a>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-lg shadow-sm p-8 border border-gray-200">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Thu cũ đổi mới</h2>
        <p className="text-gray-600 mb-8">
          Đổi xe cũ lấy xe mới, nhận giá trị tốt nhất cho xe của bạn
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Vehicle Information */}
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-gray-900">Thông tin xe cũ</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="VehicleBrand" className="block text-sm font-medium text-gray-700 mb-2">
                  Hãng xe *
                </label>
                <input
                  type="text"
                  id="VehicleBrand"
                  name="VehicleBrand"
                  value={formData.VehicleBrand}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="VD: TAILG, Yadea, Pega..."
                />
              </div>

              <div>
                <label htmlFor="VehicleModel" className="block text-sm font-medium text-gray-700 mb-2">
                  Dòng xe *
                </label>
                <input
                  type="text"
                  id="VehicleModel"
                  name="VehicleModel"
                  value={formData.VehicleModel}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="VD: Flyer X, Nova..."
                />
              </div>

              <div>
                <label htmlFor="VehicleYear" className="block text-sm font-medium text-gray-700 mb-2">
                  Năm sản xuất *
                </label>
                <input
                  type="number"
                  id="VehicleYear"
                  name="VehicleYear"
                  value={formData.VehicleYear}
                  onChange={handleChange}
                  required
                  min="2010"
                  max={new Date().getFullYear()}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label htmlFor="VehicleType" className="block text-sm font-medium text-gray-700 mb-2">
                  Loại xe *
                </label>
                <select
                  id="VehicleType"
                  name="VehicleType"
                  value={formData.VehicleType}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="bicycle">Xe đạp điện</option>
                  <option value="motorcycle">Xe máy điện</option>
                  <option value="scooter">Xe scooter điện</option>
                </select>
              </div>

              <div>
                <label htmlFor="Mileage" className="block text-sm font-medium text-gray-700 mb-2">
                  Số km đã đi *
                </label>
                <input
                  type="number"
                  id="Mileage"
                  name="Mileage"
                  value={formData.Mileage}
                  onChange={handleChange}
                  required
                  min="0"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label htmlFor="BatteryHealth" className="block text-sm font-medium text-gray-700 mb-2">
                  Sức khỏe pin (%) *
                </label>
                <input
                  type="number"
                  id="BatteryHealth"
                  name="BatteryHealth"
                  value={formData.BatteryHealth}
                  onChange={handleChange}
                  required
                  min="0"
                  max="100"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Dung lượng pin còn lại so với ban đầu
                </p>
              </div>

              <div>
                <label htmlFor="Condition" className="block text-sm font-medium text-gray-700 mb-2">
                  Tình trạng xe *
                </label>
                <select
                  id="Condition"
                  name="Condition"
                  value={formData.Condition}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="excellent">Xuất sắc - Như mới</option>
                  <option value="good">Tốt - Hoạt động bình thường</option>
                  <option value="fair">Khá - Có vài vết xước nhỏ</option>
                  <option value="poor">Kém - Cần sửa chữa</option>
                </select>
              </div>
            </div>

            <div className="flex gap-6">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  name="HasAccidents"
                  checked={formData.HasAccidents}
                  onChange={handleChange}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">Đã từng tai nạn</span>
              </label>

              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  name="HasModifications"
                  checked={formData.HasModifications}
                  onChange={handleChange}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">Đã độ/thay đổi</span>
              </label>
            </div>

            <div>
              <label htmlFor="AdditionalNotes" className="block text-sm font-medium text-gray-700 mb-2">
                Ghi chú thêm
              </label>
              <textarea
                id="AdditionalNotes"
                name="AdditionalNotes"
                value={formData.AdditionalNotes}
                onChange={handleChange}
                rows={4}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                placeholder="Mô tả thêm về tình trạng xe, lịch sử bảo dưỡng..."
              />
            </div>
          </div>

          {/* Photos */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Hình ảnh xe (Tối đa 10 ảnh)
            </label>
            <div className="grid grid-cols-5 gap-2">
              {imagePreviews.map((preview, index) => (
                <div key={index} className="relative aspect-square">
                  <Image
                    src={preview}
                    alt={`Preview ${index + 1}`}
                    fill
                    className="object-cover rounded-lg"
                  />
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
              {images.length < 10 && (
                <label className="aspect-square border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition-colors">
                  <Upload className="w-6 h-6 text-gray-400" />
                  <span className="text-xs text-gray-500 mt-1">Tải ảnh</span>
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleImageChange}
                    className="hidden"
                  />
                </label>
              )}
            </div>
          </div>

          {/* Contact Information */}
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-gray-900">Thông tin liên hệ</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="ContactPhone" className="block text-sm font-medium text-gray-700 mb-2">
                  Số điện thoại *
                </label>
                <input
                  type="tel"
                  id="ContactPhone"
                  name="ContactPhone"
                  value={formData.ContactPhone}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="0987654321"
                />
              </div>

              <div>
                <label htmlFor="ContactEmail" className="block text-sm font-medium text-gray-700 mb-2">
                  Email *
                </label>
                <input
                  type="email"
                  id="ContactEmail"
                  name="ContactEmail"
                  value={formData.ContactEmail}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="email@example.com"
                />
              </div>

              <div className="md:col-span-2">
                <label htmlFor="PreferredContactMethod" className="block text-sm font-medium text-gray-700 mb-2">
                  Phương thức liên hệ ưu tiên
                </label>
                <select
                  id="PreferredContactMethod"
                  name="PreferredContactMethod"
                  value={formData.PreferredContactMethod}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="phone">Điện thoại</option>
                  <option value="email">Email</option>
                  <option value="both">Cả hai</option>
                </select>
              </div>
            </div>
          </div>

          {/* Estimate Calculator */}
          <div className="bg-blue-50 rounded-lg p-6 border border-blue-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Ước tính giá trị</h3>
              <button
                type="button"
                onClick={calculateEstimate}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Calculator className="w-5 h-5" />
                Tính toán
              </button>
            </div>
            {estimatedValue !== null && (
              <div className="text-center">
                <p className="text-sm text-gray-600 mb-2">Giá trị ước tính</p>
                <p className="text-3xl font-bold text-blue-600">
                  {estimatedValue.toLocaleString('vi-VN')} ₫
                </p>
                <p className="text-xs text-gray-500 mt-2">
                  *Đây chỉ là giá trị ước tính. Giá chính thức sẽ được định giá sau khi kiểm tra thực tế.
                </p>
              </div>
            )}
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          {/* Submit Button */}
          <div className="flex gap-4">
            <button
              type="button"
              onClick={() => router.back()}
              className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-semibold"
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Đang gửi...' : 'Gửi yêu cầu'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
