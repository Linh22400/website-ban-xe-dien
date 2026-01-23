'use client';

import { useCheckout } from '@/contexts/CheckoutContext';
import { useState, useEffect } from 'react';
import { Check, Truck, Store } from 'lucide-react';
import { ThemeText, ThemeInput, ThemeTextarea, ThemeButton } from '@/components/common/ThemeText';
import CustomSelect from '../ui/CustomSelect';
import ShowroomSelector from './ShowroomSelector';

interface Province {
    code: number;
    name: string;
    districts: District[];
}

interface District {
    code: number;
    name: string;
    wards: Ward[];
}

interface Ward {
    code: number;
    name: string;
}

export default function CustomerInfoForm({ showButton = true }: { showButton?: boolean }) {
    const { 
        customerInfo, 
        setCustomerInfo, 
        goToNextStep, 
        goToPreviousStep, 
        shippingMethod, 
        setShippingMethod, 
        setCurrentStep,
        selectedShowroom 
    } = useCheckout();
    const [errors, setErrors] = useState<Record<string, string>>({});

    // Location Data State
    const [provinces, setProvinces] = useState<Province[]>([]);
    const [districts, setDistricts] = useState<District[]>([]);
    const [wards, setWards] = useState<Ward[]>([]);

    // Selected Codes (to manage dependencies)
    const [selectedCityCode, setSelectedCityCode] = useState<string>('');
    const [selectedDistrictCode, setSelectedDistrictCode] = useState<string>('');
    const [selectedWardCode, setSelectedWardCode] = useState<string>('');

    // Fetch Provinces on Mount
    useEffect(() => {
        const fetchProvinces = async () => {
            try {
                const response = await fetch('https://provinces.open-api.vn/api/?depth=1');
                const data = await response.json();
                setProvinces(data);
            } catch (error) {
                console.error('Failed to fetch provinces:', error);
            }
        };
        fetchProvinces();
    }, []);

    // Handle City Change
    const handleCityChange = async (code: string) => {
        setSelectedCityCode(code);
        setSelectedDistrictCode('');
        setSelectedWardCode('');
        setDistricts([]);
        setWards([]);
        
        const city = provinces.find(p => p.code.toString() === code);
        setCustomerInfo({ 
            ...customerInfo, 
            City: city?.name, 
            District: undefined, 
            Ward: undefined 
        });

        if (code) {
            try {
                const response = await fetch(`https://provinces.open-api.vn/api/p/${code}?depth=2`);
                const data = await response.json();
                setDistricts(data.districts);
            } catch (error) {
                console.error('Failed to fetch districts:', error);
            }
        }
    };

    // Handle District Change
    const handleDistrictChange = async (code: string) => {
        setSelectedDistrictCode(code);
        setSelectedWardCode('');
        setWards([]);

        const district = districts.find(d => d.code.toString() === code);
        setCustomerInfo({ 
            ...customerInfo, 
            District: district?.name, 
            Ward: undefined 
        });

        if (code) {
            try {
                const response = await fetch(`https://provinces.open-api.vn/api/d/${code}?depth=2`);
                const data = await response.json();
                setWards(data.wards);
            } catch (error) {
                console.error('Failed to fetch wards:', error);
            }
        }
    };

    // Handle Ward Change
    const handleWardChange = (code: string) => {
        setSelectedWardCode(code);
        const ward = wards.find(w => w.code.toString() === code);
        setCustomerInfo({ ...customerInfo, Ward: ward?.name });
    };

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

        // Validate address only if shipping method is delivery
        if (shippingMethod === 'delivery') {
            if (!customerInfo.DeliveryAddress) {
                newErrors.DeliveryAddress = 'Vui lòng nhập địa chỉ nhận xe';
            }

            if (!customerInfo.City) {
                newErrors.City = 'Vui lòng chọn thành phố';
            }
            if (!customerInfo.District) {
                newErrors.District = 'Vui lòng chọn Quận/Huyện';
            }
            if (!customerInfo.Ward) {
                newErrors.Ward = 'Vui lòng chọn Phường/Xã';
            }
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleContinue = () => {
        if (validateForm()) {
            if (shippingMethod === 'pickup' && !selectedShowroom) {
                // You might want to add a visible error state here
                alert("Vui lòng chọn đại lý nhận xe");
                return;
            }
            goToNextStep();
        }
    };

    // Remove the hardcoded cities array
    /* const cities = [ ... ] */

    return (
        <div className="space-y-6">
            <ThemeText className="text-2xl font-bold text-white mb-6">Thông tin khách hàng</ThemeText>

            {/* Shipping Method Selection */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                <div
                    onClick={() => setShippingMethod('delivery')}
                    className={`
                        relative p-4 rounded-xl border-2 cursor-pointer transition-all flex items-center gap-4
                        ${shippingMethod === 'delivery' 
                            ? 'border-primary bg-primary/10 shadow-[0_0_15px_rgba(0,255,148,0.2)]' 
                            : 'border-border bg-card hover:border-primary/50'}
                    `}
                >
                    <div className={`p-3 rounded-full ${shippingMethod === 'delivery' ? 'bg-primary text-black' : 'bg-muted text-foreground'}`}>
                        <Truck className="w-6 h-6" />
                    </div>
                    <div>
                        <ThemeText className="font-bold text-lg">Giao hàng tận nơi</ThemeText>
                        <p className="text-sm text-primary font-medium">Miễn phí vận chuyển</p>
                    </div>
                    {shippingMethod === 'delivery' && (
                        <div className="absolute top-4 right-4 text-primary">
                            <Check className="w-5 h-5" />
                        </div>
                    )}
                </div>

                <div
                    onClick={() => setShippingMethod('pickup')}
                    className={`
                        relative p-4 rounded-xl border-2 cursor-pointer transition-all flex items-center gap-4
                        ${shippingMethod === 'pickup' 
                            ? 'border-primary bg-primary/10 shadow-[0_0_15px_rgba(0,255,148,0.2)]' 
                            : 'border-border bg-card hover:border-primary/50'}
                    `}
                >
                    <div className={`p-3 rounded-full ${shippingMethod === 'pickup' ? 'bg-primary text-black' : 'bg-muted text-foreground'}`}>
                        <Store className="w-6 h-6" />
                    </div>
                    <div>
                        <ThemeText className="font-bold text-lg">Nhận tại cửa hàng</ThemeText>
                        <p className="text-sm text-muted-foreground">Đến đại lý gần nhất</p>
                    </div>
                    {shippingMethod === 'pickup' && (
                        <div className="absolute top-4 right-4 text-primary">
                            <Check className="w-5 h-5" />
                        </div>
                    )}
                </div>
            </div>

            {/* Full Name */}
            <div>
                <ThemeText className="block text-sm font-medium text-white mb-2">
                    Họ và tên <span className="text-red-500">*</span>
                </ThemeText>
                <ThemeInput
                    type="text"
                    value={customerInfo.FullName || ''}
                    onChange={(e) => setCustomerInfo({ ...customerInfo, FullName: e.target.value })}
                    hasError={!!errors.FullName}
                    className="w-full bg-white/5 border-2 rounded-xl px-4 py-3 focus:outline-none focus:border-primary transition-all placeholder:text-gray-500 dark:placeholder:text-gray-400"
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
                    <ThemeText className="block text-sm font-medium text-white mb-2">
                        Số điện thoại <span className="text-red-500">*</span>
                    </ThemeText>
                    <ThemeInput
                        type="tel"
                        value={customerInfo.Phone || ''}
                        onChange={(e) => setCustomerInfo({ ...customerInfo, Phone: e.target.value })}
                        hasError={!!errors.Phone}
                        className="w-full bg-white/5 border-2 rounded-xl px-4 py-3 focus:outline-none focus:border-primary transition-all placeholder:text-gray-500 dark:placeholder:text-gray-400"
                        placeholder="0901234567"
                    />
                    {errors.Phone && (
                        <p className="text-red-500 text-sm mt-1">{errors.Phone}</p>
                    )}
                </div>

                {/* Email */}
                <div>
                    <ThemeText className="block text-sm font-medium text-white mb-2">
                        Email <span className="text-red-500">*</span>
                    </ThemeText>
                    <ThemeInput
                        type="email"
                        value={customerInfo.Email || ''}
                        onChange={(e) => setCustomerInfo({ ...customerInfo, Email: e.target.value })}
                        hasError={!!errors.Email}
                        className="w-full bg-white/5 border-2 rounded-xl px-4 py-3 focus:outline-none focus:border-primary transition-all placeholder:text-gray-500 dark:placeholder:text-gray-400"
                        placeholder="email@example.com"
                    />
                    {errors.Email && (
                        <p className="text-red-500 text-sm mt-1">{errors.Email}</p>
                    )}
                </div>
            </div>

            {/* ID Card (Optional) */}
            <div>
                <ThemeText className="block text-sm font-medium text-white mb-2">
                    CMND/CCCD <span className="text-muted-foreground text-xs">(Tùy chọn)</span>
                </ThemeText>
                <ThemeInput
                    type="text"
                    value={customerInfo.IdCard || ''}
                    onChange={(e) => setCustomerInfo({ ...customerInfo, IdCard: e.target.value })}
                    className="w-full bg-white/5 border-2 rounded-xl px-4 py-3 focus:outline-none focus:border-primary transition-all placeholder:text-gray-500 dark:placeholder:text-gray-400"
                    placeholder="001234567890"
                />
            </div>

            {/* Address Fields - Only for Delivery */}
            {shippingMethod === 'delivery' && (
                <div className="space-y-6 animate-in fade-in slide-in-from-top-4 duration-300">
                    {/* Delivery Address */}
                    <div>
                        <ThemeText className="block text-sm font-medium text-white mb-2">
                            Địa chỉ nhận xe <span className="text-red-500">*</span>
                        </ThemeText>
                        <ThemeTextarea
                            value={customerInfo.DeliveryAddress || ''}
                            onChange={(e) => setCustomerInfo({ ...customerInfo, DeliveryAddress: e.target.value })}
                            rows={3}
                            hasError={!!errors.DeliveryAddress}
                            className="w-full bg-white/5 border-2 rounded-xl px-4 py-3 focus:outline-none focus:border-primary transition-all resize-none placeholder:text-gray-500 dark:placeholder:text-gray-400"
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
                            <ThemeText className="block text-sm font-medium text-white mb-2">
                                Thành phố <span className="text-red-500">*</span>
                            </ThemeText>
                            <CustomSelect
                                value={selectedCityCode}
                                onChange={handleCityChange}
                                options={provinces.map(p => ({ value: p.code.toString(), label: p.name }))}
                                placeholder="Chọn thành phố"
                            />
                            {errors.City && (
                                <p className="text-red-500 text-sm mt-1">{errors.City}</p>
                            )}
                        </div>

                        {/* District */}
                        <div>
                            <ThemeText className="block text-sm font-medium text-white mb-2">
                                Quận/Huyện <span className="text-red-500">*</span>
                            </ThemeText>
                            <CustomSelect
                                value={selectedDistrictCode}
                                onChange={handleDistrictChange}
                                options={districts.map(d => ({ value: d.code.toString(), label: d.name }))}
                                placeholder="Chọn Quận/Huyện"
                            />
                            {errors.District && (
                                <p className="text-red-500 text-sm mt-1">{errors.District}</p>
                            )}
                        </div>

                        {/* Ward */}
                        <div>
                            <ThemeText className="block text-sm font-medium text-white mb-2">
                                Phường/Xã <span className="text-red-500">*</span>
                            </ThemeText>
                            <CustomSelect
                                value={selectedWardCode}
                                onChange={handleWardChange}
                                options={wards.map(w => ({ value: w.code.toString(), label: w.name }))}
                                placeholder="Chọn Phường/Xã"
                            />
                            {errors.Ward && (
                                <p className="text-red-500 text-sm mt-1">{errors.Ward}</p>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* Showroom Selector for Pickup */}
            {shippingMethod === 'pickup' && (
                <div className="animate-in fade-in slide-in-from-top-4 duration-300">
                    <ShowroomSelector showButton={false} />
                </div>
            )}

            {/* Privacy Notice */}
            <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                <p className="text-sm text-muted-foreground">
                    <Check className="w-4 h-4 inline text-primary mr-2" />
                    Thông tin của bạn được bảo mật theo{' '}
                    <span className="text-primary">Chính sách bảo mật</span> của chúng tôi.
                </p>
            </div>

            {/* Action Buttons */}
            {showButton && (
                <div className="flex gap-4">
                    <ThemeButton
                        onClick={goToPreviousStep}
                        className="flex-1 bg-white/5 text-white px-8 py-4 rounded-full font-bold 
                     border-2 border-white/10 hover:border-primary/50 transition-all"
                    >
                        Quay lại
                    </ThemeButton>
                    <button
                        onClick={handleContinue}
                        className="flex-1 bg-primary text-black px-8 py-4 rounded-full font-bold 
                     hover:bg-primary-dark transition-all hover:shadow-glow"
                    >
                        Tiếp tục
                    </button>
                </div>
            )}
        </div>
    );
}
