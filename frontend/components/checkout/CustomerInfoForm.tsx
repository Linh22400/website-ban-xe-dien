'use client';

import { useCheckout } from '@/contexts/CheckoutContext';
import { useState } from 'react';
import { Check } from 'lucide-react';

export default function CustomerInfoForm() {
    const { customerInfo, setCustomerInfo, goToNextStep, goToPreviousStep } = useCheckout();
    const [errors, setErrors] = useState<Record<string, string>>({});

    const validateForm = () => {
        const newErrors: Record<string, string> = {};

        if (!customerInfo.FullName) {
            newErrors.FullName = 'Vui lòng nhập họ tên';
        }

        if (!customerInfo.Phone) {
            newErrors.Phone = 'Vui lòng nhập số điện thoại';
        } else if (!/^(84|0[3|5|7|8|9])+([0-9]{8})$/.test(customerInfo.Phone)) {
            newErrors.Phone = 'Số điện thoại không hợp lệ';
        }

        if (!customerInfo.Email) {
            newErrors.Email = 'Vui lòng nhập email';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customerInfo.Email)) {
            newErrors.Email = 'Email không hợp lệ';
        }

        if (!customerInfo.DeliveryAddress) {
            newErrors.DeliveryAddress = 'Vui lòng nhập địa chỉ nhận xe';
        }

        if (!customerInfo.City) {
            newErrors.City = 'Vui lòng chọn thành phố';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleContinue = () => {
        if (validateForm()) {
            goToNextStep();
        }
    };

    const cities = [
        'Hà Nội',
        'TP. Hồ Chí Minh',
        'Đà Nẵng',
        'Hải Phòng',
        'Cần Thơ',
        'Biên Hòa',
        'Vũng Tàu',
        'Nha Trang',
        'Huế',
        'Vinh',
    ];

    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold text-white mb-6">Thông tin khách hàng</h2>

            {/* Full Name */}
            <div>
                <label className="block text-sm font-medium text-white mb-2">
                    Họ và tên <span className="text-red-500">*</span>
                </label>
                <input
                    type="text"
                    value={customerInfo.FullName || ''}
                    onChange={(e) => setCustomerInfo({ ...customerInfo, FullName: e.target.value })}
                    className={`w-full bg-white/5 border-2 rounded-xl px-4 py-3 text-white
                     focus:outline-none focus:border-primary transition-all
                     ${errors.FullName ? 'border-red-500' : 'border-white/10'}`}
                    placeholder="Nguyễn Văn A"
                />
                {errors.FullName && (
                    <p className="text-red-500 text-sm mt-1">{errors.FullName}</p>
                )}
            </div>

            {/* Phone & Email Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Phone */}
                <div>
                    <label className="block text-sm font-medium text-white mb-2">
                        Số điện thoại <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="tel"
                        value={customerInfo.Phone || ''}
                        onChange={(e) => setCustomerInfo({ ...customerInfo, Phone: e.target.value })}
                        className={`w-full bg-white/5 border-2 rounded-xl px-4 py-3 text-white
                       focus:outline-none focus:border-primary transition-all
                       ${errors.Phone ? 'border-red-500' : 'border-white/10'}`}
                        placeholder="0901234567"
                    />
                    {errors.Phone && (
                        <p className="text-red-500 text-sm mt-1">{errors.Phone}</p>
                    )}
                </div>

                {/* Email */}
                <div>
                    <label className="block text-sm font-medium text-white mb-2">
                        Email <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="email"
                        value={customerInfo.Email || ''}
                        onChange={(e) => setCustomerInfo({ ...customerInfo, Email: e.target.value })}
                        className={`w-full bg-white/5 border-2 rounded-xl px-4 py-3 text-white
                       focus:outline-none focus:border-primary transition-all
                       ${errors.Email ? 'border-red-500' : 'border-white/10'}`}
                        placeholder="email@example.com"
                    />
                    {errors.Email && (
                        <p className="text-red-500 text-sm mt-1">{errors.Email}</p>
                    )}
                </div>
            </div>

            {/* ID Card (Optional) */}
            <div>
                <label className="block text-sm font-medium text-white mb-2">
                    CMND/CCCD <span className="text-muted-foreground text-xs">(Tùy chọn)</span>
                </label>
                <input
                    type="text"
                    value={customerInfo.IdCard || ''}
                    onChange={(e) => setCustomerInfo({ ...customerInfo, IdCard: e.target.value })}
                    className="w-full bg-white/5 border-2 border-white/10 rounded-xl px-4 py-3 text-white
                     focus:outline-none focus:border-primary transition-all"
                    placeholder="001234567890"
                />
            </div>

            {/* Delivery Address */}
            <div>
                <label className="block text-sm font-medium text-white mb-2">
                    Địa chỉ nhận xe <span className="text-red-500">*</span>
                </label>
                <textarea
                    value={customerInfo.DeliveryAddress || ''}
                    onChange={(e) => setCustomerInfo({ ...customerInfo, DeliveryAddress: e.target.value })}
                    rows={3}
                    className={`w-full bg-white/5 border-2 rounded-xl px-4 py-3 text-white
                     focus:outline-none focus:border-primary transition-all resize-none
                     ${errors.DeliveryAddress ? 'border-red-500' : 'border-white/10'}`}
                    placeholder="Số nhà, tên đường, phường/xã..."
                />
                {errors.DeliveryAddress && (
                    <p className="text-red-500 text-sm mt-1">{errors.DeliveryAddress}</p>
                )}
            </div>

            {/* City, District, Ward Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* City */}
                <div>
                    <label className="block text-sm font-medium text-white mb-2">
                        Thành phố <span className="text-red-500">*</span>
                    </label>
                    <select
                        value={customerInfo.City || ''}
                        onChange={(e) => setCustomerInfo({ ...customerInfo, City: e.target.value })}
                        className={`w-full bg-white/5 border-2 rounded-xl px-4 py-3 text-white
                       focus:outline-none focus:border-primary transition-all
                       ${errors.City ? 'border-red-500' : 'border-white/10'}`}
                    >
                        <option value="">Chọn thành phố</option>
                        {cities.map((city) => (
                            <option key={city} value={city} className="bg-background">
                                {city}
                            </option>
                        ))}
                    </select>
                    {errors.City && (
                        <p className="text-red-500 text-sm mt-1">{errors.City}</p>
                    )}
                </div>

                {/* District */}
                <div>
                    <label className="block text-sm font-medium text-white mb-2">
                        Quận/Huyện
                    </label>
                    <input
                        type="text"
                        value={customerInfo.District || ''}
                        onChange={(e) => setCustomerInfo({ ...customerInfo, District: e.target.value })}
                        className="w-full bg-white/5 border-2 border-white/10 rounded-xl px-4 py-3 text-white
                       focus:outline-none focus:border-primary transition-all"
                        placeholder="Quận/Huyện"
                    />
                </div>

                {/* Ward */}
                <div>
                    <label className="block text-sm font-medium text-white mb-2">
                        Phường/Xã
                    </label>
                    <input
                        type="text"
                        value={customerInfo.Ward || ''}
                        onChange={(e) => setCustomerInfo({ ...customerInfo, Ward: e.target.value })}
                        className="w-full bg-white/5 border-2 border-white/10 rounded-xl px-4 py-3 text-white
                       focus:outline-none focus:border-primary transition-all"
                        placeholder="Phường/Xã"
                    />
                </div>
            </div>

            {/* Privacy Notice */}
            <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                <p className="text-sm text-muted-foreground">
                    <Check className="w-4 h-4 inline text-primary mr-2" />
                    Thông tin của bạn được bảo mật theo{' '}
                    <span className="text-primary">Chính sách bảo mật</span> của chúng tôi.
                </p>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4">
                <button
                    onClick={goToPreviousStep}
                    className="flex-1 bg-white/5 text-white px-8 py-4 rounded-full font-bold 
                     border-2 border-white/10 hover:border-primary/50 transition-all"
                >
                    Quay lại
                </button>
                <button
                    onClick={handleContinue}
                    className="flex-1 bg-primary text-black px-8 py-4 rounded-full font-bold 
                     hover:bg-primary-dark transition-all hover:shadow-glow"
                >
                    Tiếp tục
                </button>
            </div>
        </div>
    );
}
