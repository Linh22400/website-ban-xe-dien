'use client';

import { useCheckout } from '@/contexts/CheckoutContext';
import { useEffect, useState } from 'react';
import { MapPin, Phone, Clock, Navigation } from 'lucide-react';
import { getShowrooms } from '@/lib/order-api';
import type { Showroom } from '@/types/order';
import { SubHeading, SectionHeading, FormLabel, ThemeSelect, ThemeInput, ThemeText, ThemeButton } from '@/components/common/ThemeText';

export default function ShowroomSelector({ showButton = true }: { showButton?: boolean }) {
    const {
        selectedShowroom,
        setSelectedShowroom,
        appointmentDate,
        setAppointmentDate,
        customerInfo,
        goToNextStep,
        goToPreviousStep
    } = useCheckout();

    const [showrooms, setShowrooms] = useState<Showroom[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedCity, setSelectedCity] = useState(customerInfo.City || '');

    useEffect(() => {
        async function fetchShowrooms() {
            setLoading(true);
            const data = await getShowrooms(selectedCity || undefined);
            setShowrooms(data);
            setLoading(false);
        }
        fetchShowrooms();
    }, [selectedCity]);

    const handleContinue = () => {
        if (selectedShowroom) {
            goToNextStep();
        }
    };

    return (
        <div className="space-y-6">
            <SubHeading className="mb-6">Chọn đại lý nhận xe</SubHeading>

            {/* City Filter */}
            {customerInfo.City && (
                <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                    <FormLabel>
                        Lọc theo thành phố
                    </FormLabel>
                    <ThemeSelect
                        value={selectedCity}
                        onChange={(e) => setSelectedCity(e.target.value)}
                        className="w-full bg-background border-2 rounded-lg px-4 py-3 focus:outline-none focus:border-primary transition-all"
                    >
                        <option value="">Tất cả showroom</option>
                        <option value={customerInfo.City}>{customerInfo.City}</option>
                    </ThemeSelect>
                </div>
            )}

            {/* Showroom List */}
            {loading ? (
                <div className="text-center py-12">
                    <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
                    <p className="text-muted-foreground mt-4">Đang tải danh sách showroom...</p>
                </div>
            ) : showrooms.length === 0 ? (
                <div className="text-center py-12 bg-white/5 border border-white/10 rounded-xl">
                    <MapPin className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <ThemeText className="font-semibold mb-2">Không tìm thấy showroom</ThemeText>
                    <p className="text-muted-foreground text-sm">
                        Vui lòng liên hệ hotline để được hỗ trợ
                    </p>
                </div>
            ) : (
                <div className="space-y-4">
                    {showrooms.map((showroom) => (
                        <div
                            key={showroom.id}
                            onClick={() => setSelectedShowroom(showroom.id)}
                            className={`
                p-6 rounded-2xl border-2 cursor-pointer transition-all
                ${selectedShowroom === showroom.id
                                    ? 'border-primary bg-primary/10 shadow-[0_0_20px_rgba(0,255,148,0.3)]'
                                    : 'border-white/10 bg-card/30 hover:border-primary/50'
                                }
              `}
                        >
                            <div className="flex items-start justify-between gap-4">
                                <div className="flex-1">
                                    <SectionHeading className="mb-2">{showroom.Name}</SectionHeading>

                                    <div className="space-y-2">
                                        <div className="flex items-start gap-2 text-sm text-muted-foreground">
                                            <MapPin className="w-4 h-4 shrink-0 mt-0.5 text-primary" />
                                            <span>{showroom.Address}, {showroom.City}</span>
                                        </div>

                                        {showroom.Phone && (
                                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                                <Phone className="w-4 h-4 text-primary" />
                                                <a href={`tel:${showroom.Phone}`} className="hover:text-primary transition-colors">
                                                    {showroom.Phone}
                                                </a>
                                            </div>
                                        )}

                                        {showroom.WorkingHours && (
                                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                                <Clock className="w-4 h-4 text-primary" />
                                                <span>
                                                    {showroom.WorkingHours.monday || 'Thứ 2-7: 8:00 - 18:00'}
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {selectedShowroom === showroom.id && (
                                    <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center shrink-0">
                                        <svg className="w-4 h-4 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                        </svg>
                                    </div>
                                )}
                            </div>

                            {showroom.Latitude && showroom.Longitude && (
                                <a
                                    href={`https://www.google.com/maps/dir/?api=1&destination=${showroom.Latitude},${showroom.Longitude}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    onClick={(e) => e.stopPropagation()}
                                    className="mt-4 inline-flex items-center gap-2 text-sm text-primary hover:underline"
                                >
                                    <Navigation className="w-4 h-4" />
                                    Chỉ đường
                                </a>
                            )}
                        </div>
                    ))}
                </div>
            )}

            {/* Appointment Date (Optional) */}
            {selectedShowroom && (
                <div className="bg-white/5 border border-white/10 rounded-xl p-6">
                    <FormLabel>
                        Đặt lịch nhận xe <span className="text-muted-foreground text-xs">(Tùy chọn)</span>
                    </FormLabel>
                    <ThemeInput
                        type="datetime-local"
                        value={appointmentDate ? new Date(appointmentDate.getTime() - appointmentDate.getTimezoneOffset() * 60000).toISOString().slice(0, 16) : ''}
                        onChange={(e) => setAppointmentDate(e.target.value ? new Date(e.target.value) : null)}
                        className="w-full bg-background border-2 rounded-lg px-4 py-3 focus:outline-none focus:border-primary transition-all"
                    />
                </div>
            )}

            {/* Continue Button */}
            {showButton && (
                <button
                    onClick={handleContinue}
                    disabled={!selectedShowroom}
                    className="w-full bg-primary text-black px-8 py-4 rounded-full font-bold 
                   hover:bg-primary-dark transition-all hover:shadow-glow
                   disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-none"
                >
                    Tiếp tục
                </button>
            )}
        </div>
    );
}
