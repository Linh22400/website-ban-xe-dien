'use client';

import { useState } from 'react';
import { calculateInstallment, createLead } from '@/lib/order-api';
import { Calculator, CreditCard, Building2, Info, Loader2, CheckCircle2 } from 'lucide-react';

interface InstallmentCalculatorProps {
    price: number;
    productName?: string; // Optional product name for lead context
}

type TabType = 'finance' | 'credit';

export default function InstallmentCalculator({ price, productName = 'Sản phẩm' }: InstallmentCalculatorProps) {
    const [activeTab, setActiveTab] = useState<TabType>('finance');
    const [downPaymentPercent, setDownPaymentPercent] = useState(30); // 30%
    const [term, setTerm] = useState(12);
    
    // Consultation Form State
    const [showForm, setShowForm] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        email: '',
        note: ''
    });

    // Format currency
    const formatCurrency = (val: number) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(val);

    // Finance Company Calculation (Default logic)
    const financePlan = calculateInstallment(price, term, downPaymentPercent / 100);

    // Credit Card Calculation
    const creditPlan = calculateInstallment(price, term, 0, 0); // 0 down payment, 0 interest

    const handleRegisterConsultation = () => {
        setShowForm(true);
        setIsSuccess(false);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            const message = `Yêu cầu tư vấn trả góp (${activeTab === 'finance' ? 'Công ty tài chính' : 'Thẻ tín dụng'}).
            Sản phẩm: ${productName}.
            Giá: ${formatCurrency(price)}.
            Kỳ hạn: ${term} tháng.
            Trả trước: ${activeTab === 'finance' ? `${downPaymentPercent}% (${formatCurrency(financePlan.downPayment)})` : '0%'}.
            Góp mỗi tháng dự kiến: ${formatCurrency(activeTab === 'finance' ? financePlan.monthlyPayment : Math.round(price / term))}.
            Ghi chú: ${formData.note}`;

            await createLead({
                name: formData.name,
                phone: formData.phone,
                email: formData.email || 'no-email@provided.com', // Optional email fallback
                type: 'consultation',
                model: productName,
                message: message,
                statuses: 'new'
            });

            setIsSuccess(true);
            setTimeout(() => {
                setShowForm(false);
                setFormData({ name: '', phone: '', email: '', note: '' });
            }, 3000);
        } catch (error: any) {
            console.error('Lỗi gửi yêu cầu:', error);
            alert(error.message || 'Có lỗi xảy ra, vui lòng thử lại sau.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="bg-card text-card-foreground rounded-2xl shadow-lg border border-border overflow-hidden my-8 relative">
            <div className="p-6 bg-gradient-to-r from-blue-600 to-blue-800 text-white">
                <div className="flex items-center gap-3">
                    <Calculator className="w-6 h-6" />
                    <h3 className="text-xl font-bold">Dự Toán Trả Góp</h3>
                </div>
                <p className="text-blue-100 text-sm mt-1">Công cụ tính toán chi phí trả góp ước tính</p>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-border">
                <button
                    onClick={() => setActiveTab('finance')}
                    className={`flex-1 py-4 px-2 text-sm font-medium flex items-center justify-center gap-2 transition-colors
            ${activeTab === 'finance' ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50/50 dark:bg-blue-900/10' : 'text-muted-foreground hover:text-foreground'}
          `}
                >
                    <Building2 className="w-4 h-4" />
                    Công Ty Tài Chính
                </button>
                <button
                    onClick={() => setActiveTab('credit')}
                    className={`flex-1 py-4 px-2 text-sm font-medium flex items-center justify-center gap-2 transition-colors
            ${activeTab === 'credit' ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50/50 dark:bg-blue-900/10' : 'text-muted-foreground hover:text-foreground'}
          `}
                >
                    <CreditCard className="w-4 h-4" />
                    Thẻ Tín Dụng
                </button>
            </div>

            <div className="p-6">
                {activeTab === 'finance' && (
                    <div className="space-y-6">
                        {/* Sliders */}
                        <div>
                            <div className="flex justify-between mb-2">
                                <label className="text-sm font-medium text-foreground">Trả trước ({downPaymentPercent}%)</label>
                                <span className="font-bold text-blue-600">{formatCurrency(financePlan.downPayment)}</span>
                            </div>
                            <input
                                type="range"
                                min="0"
                                max="70"
                                step="10"
                                value={downPaymentPercent}
                                onChange={(e) => setDownPaymentPercent(Number(e.target.value))}
                                className="w-full h-2 bg-secondary rounded-lg appearance-none cursor-pointer accent-blue-600"
                            />
                        </div>

                        <div>
                            <label className="text-sm font-medium text-foreground mb-2 block">Kỳ hạn vay</label>
                            <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                                {[6, 9, 12, 18, 24].map((m) => (
                                    <button
                                        key={m}
                                        onClick={() => setTerm(m)}
                                        className={`py-2 px-1 rounded-lg text-sm font-medium border transition-all
                      ${term === m
                                                ? 'bg-blue-600 text-white border-blue-600 shadow-md'
                                                : 'bg-card text-foreground border-border hover:border-blue-400'}
                    `}
                                    >
                                        {m} tháng
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Result */}
                        <div className="bg-muted/50 rounded-xl p-4 border border-border">
                            <div className="flex justify-between items-center mb-2">
                                <span className="text-muted-foreground">Góp mỗi tháng</span>
                                <span className="text-2xl font-bold text-blue-600">{formatCurrency(financePlan.monthlyPayment)}</span>
                            </div>
                            <div className="flex justify-between items-center text-sm">
                                <span className="text-muted-foreground">Lãi suất phẳng tham khảo</span>
                                <span className="text-foreground font-medium">
                                    {term <= 12 ? '0% (Ưu đãi)' : '1.8% - 2.5%'}
                                </span>
                            </div>
                            <div className="flex justify-between items-center text-sm mt-1">
                                <span className="text-muted-foreground">Tổng tiền phải trả</span>
                                <span className="text-foreground font-medium">{formatCurrency(financePlan.totalPayable + financePlan.downPayment)}</span>
                            </div>
                        </div>
                        <p className="text-xs text-muted-foreground text-center italic">
                            * Số liệu chỉ mang tính chất tham khảo. Duyệt hồ sơ qua ACS, HD Saison, FE Credit.
                        </p>
                    </div>
                )}

                {activeTab === 'credit' && (
                    <div className="space-y-6">
                        <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg flex items-start gap-3">
                            <Info className="w-5 h-5 text-green-600 mt-0.5" />
                            <div className="text-sm text-green-800 dark:text-green-600">
                                Trả góp qua thẻ tín dụng (Visa/Mastercard/JCB) của 26 ngân hàng liên kết. 
                                <span className="font-bold block mt-1">Lãi suất 0% - Không cần duyệt hồ sơ.</span>
                            </div>
                        </div>

                        <div>
                            <label className="text-sm font-medium text-foreground mb-2 block">Kỳ hạn</label>
                            <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                                {[3, 6, 9, 12].map((m) => (
                                    <button
                                        key={m}
                                        onClick={() => setTerm(m)}
                                        className={`py-2 px-1 rounded-lg text-sm font-medium border transition-all
                      ${term === m
                                                ? 'bg-blue-600 text-white border-blue-600 shadow-md'
                                                : 'bg-card text-foreground border-border hover:border-blue-400'}
                    `}
                                    >
                                        {m} tháng
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="bg-muted/50 rounded-xl p-4 border border-border">
                             <div className="flex justify-between items-center mb-2">
                                <span className="text-muted-foreground">Góp mỗi tháng</span>
                                <span className="text-2xl font-bold text-blue-600">
                                    {formatCurrency(Math.round(price / term))}
                                </span>
                            </div>
                             <div className="flex justify-between items-center text-sm">
                                <span className="text-muted-foreground">Trả trước</span>
                                <span className="text-foreground font-medium">0 ₫</span>
                            </div>
                             <div className="flex justify-between items-center text-sm mt-1">
                                <span className="text-muted-foreground">Phí chuyển đổi (ước tính)</span>
                                <span className="text-foreground font-medium">~ {formatCurrency(price * 0.02)}</span>
                            </div>
                        </div>
                    </div>
                )}

                {/* Call To Action */}
                <div className="mt-6 pt-6 border-t border-border">
                    <button
                        onClick={handleRegisterConsultation}
                        className="w-full py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-xl font-bold shadow-lg shadow-blue-500/30 transition-all transform hover:scale-[1.02] active:scale-[0.98]"
                    >
                        Đăng Ký Tư Vấn Trả Góp
                    </button>
                    <p className="text-xs text-center text-muted-foreground mt-2">
                        Chúng tôi sẽ liên hệ lại trong vòng 15 phút để hỗ trợ làm hồ sơ.
                    </p>
                </div>
            </div>

            {/* Consultation Form Modal/Overlay */}
            {showForm && (
                <div className="absolute inset-0 z-50 bg-background/95 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
                    <div className="w-full max-w-sm bg-card text-card-foreground rounded-2xl shadow-2xl border border-border p-6 relative">
                        <button 
                            onClick={() => setShowForm(false)}
                            className="absolute top-4 right-4 text-muted-foreground hover:text-foreground"
                        >
                            ✕
                        </button>
                        
                        {isSuccess ? (
                            <div className="text-center py-8">
                                <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <CheckCircle2 className="w-8 h-8 text-green-600 dark:text-green-400" />
                                </div>
                                <h4 className="text-xl font-bold text-foreground mb-2">Gửi thành công!</h4>
                                <p className="text-muted-foreground text-sm">
                                    Cảm ơn bạn đã đăng ký. Nhân viên tư vấn sẽ liên hệ với bạn sớm nhất.
                                </p>
                            </div>
                        ) : (
                            <>
                                <h4 className="text-lg font-bold text-foreground mb-1">Thông Tin Liên Hệ</h4>
                                <p className="text-sm text-muted-foreground mb-4">Để lại thông tin để được tư vấn hồ sơ trả góp tốt nhất.</p>
                                
                                <form onSubmit={handleSubmit} className="space-y-4">
                                    <div>
                                        <label className="block text-xs font-medium text-foreground mb-1">Họ tên *</label>
                                        <input 
                                            required
                                            type="text" 
                                            className="w-full px-3 py-2 rounded-lg border border-border bg-secondary text-foreground focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                                            placeholder="Nguyễn Văn A"
                                            value={formData.name}
                                            onChange={e => setFormData({...formData, name: e.target.value})}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-medium text-foreground mb-1">Số điện thoại *</label>
                                        <input 
                                            required
                                            type="tel" 
                                            className="w-full px-3 py-2 rounded-lg border border-border bg-secondary text-foreground focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                                            placeholder="0912 xxx xxx"
                                            value={formData.phone}
                                            onChange={e => setFormData({...formData, phone: e.target.value})}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-medium text-foreground mb-1">Email (Nhận bảng tính chi tiết)</label>
                                        <input 
                                            type="email" 
                                            className="w-full px-3 py-2 rounded-lg border border-border bg-secondary text-foreground focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                                            placeholder="email@example.com"
                                            value={formData.email}
                                            onChange={e => setFormData({...formData, email: e.target.value})}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-medium text-foreground mb-1">Ghi chú (Tuỳ chọn)</label>
                                        <textarea 
                                            className="w-full px-3 py-2 rounded-lg border border-border bg-secondary text-foreground focus:ring-2 focus:ring-blue-500 outline-none transition-all h-20 resize-none"
                                            placeholder="Ví dụ: Gọi cho tôi sau 5h chiều..."
                                            value={formData.note}
                                            onChange={e => setFormData({...formData, note: e.target.value})}
                                        />
                                    </div>
                                    
                                    <button 
                                        type="submit" 
                                        disabled={isSubmitting}
                                        className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-bold shadow-lg shadow-blue-500/20 transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                                    >
                                        {isSubmitting ? (
                                            <>
                                                <Loader2 className="w-4 h-4 animate-spin" />
                                                Đang gửi...
                                            </>
                                        ) : (
                                            'Gửi Yêu Cầu'
                                        )}
                                    </button>
                                </form>
                            </>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
