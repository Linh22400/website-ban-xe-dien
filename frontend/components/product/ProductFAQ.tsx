"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";

interface FAQItem {
    question: string;
    answer: string;
}

export default function ProductFAQ() {
    const [openIndex, setOpenIndex] = useState<number | null>(0);

    const faqs: FAQItem[] = [
        {
            question: "Thời gian sạc đầy pin là bao lâu?",
            answer: "Thời gian sạc đầy pin thông thường từ 4-6 giờ với bộ sạc tiêu chuẩn. Nếu sử dụng bộ sạc nhanh, thời gian sạc có thể rút ngắn còn 2-3 giờ tùy theo dung lượng pin."
        },
        {
            question: "Quãng đường di chuyển tối đa là bao nhiêu?",
            answer: "Quãng đường di chuyển phụ thuộc vào dung lượng pin, tốc độ, địa hình và cân nặng người lái. Thông thường dao động từ 60-150km cho một lần sạc đầy."
        },
        {
            question: "Tôi có thể thay pin tại nhà không?",
            answer: "Có, một số mẫu xe có thiết kế pin rời, bạn có thể dễ dàng tháo pin ra để sạc tại nhà hoặc văn phòng. Pin được thiết kế nhẹ và có tay cầm tiện lợi."
        },
        {
            question: "Chi phí bảo dưỡng định kỳ như thế nào?",
            answer: "Xe điện có chi phí bảo dưỡng thấp hơn rất nhiều so với xe xăng vì không cần thay dầu máy, lọc gió, bugi... Bảo dưỡng định kỳ chủ yếu kiểm tra phanh, lốp, hệ thống điện và chỉ tốn khoảng 200.000-500.000đ/lần."
        },
        {
            question: "Xe có chống nước được không?",
            answer: "Xe được thiết kế với tiêu chuẩn chống nước IP67, có thể di chuyển qua vũng nước sâu 30-50cm trong thời gian ngắn. Tuy nhiên, không nên ngâm xe trong nước quá lâu hoặc rửa xe áp lực cao vào các khu vực nhạy cảm."
        },
        {
            question: "Có cần đăng ký và mua bảo hiểm không?",
            answer: "Có, xe máy điện cần đăng ký biển số và mua bảo hiểm TNDS bắt buộc giống như xe máy xăng thông thường. Xe đạp điện có công suất dưới 300W thì không cần đăng ký."
        }
    ];

    const toggleFAQ = (index: number) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    return (
        <section className="py-20 px-6 bg-secondary/10">
            <div className="container mx-auto">
                <div className="max-w-3xl mx-auto">
                    {/* Header */}
                    <div className="text-center mb-12">
                        <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-3">
                            Câu Hỏi Thường Gặp
                        </h2>
                        <p className="text-muted-foreground">
                            Giải đáp những thắc mắc phổ biến về sản phẩm
                        </p>
                    </div>

                    {/* FAQ List */}
                    <div className="space-y-4">
                        {faqs.map((faq, index) => (
                            <div
                                key={index}
                                className="bg-card/30 backdrop-blur-sm border border-white/10 rounded-xl overflow-hidden hover:border-primary/30 transition-all"
                            >
                                <button
                                    onClick={() => toggleFAQ(index)}
                                    className="w-full px-6 py-5 flex items-center justify-between text-left group"
                                >
                                    <span className="font-semibold text-foreground text-lg pr-4 group-hover:text-primary transition-colors">
                                        {faq.question}
                                    </span>
                                    <ChevronDown
                                        className={`w-5 h-5 text-primary flex-shrink-0 transition-transform duration-300 ${openIndex === index ? 'rotate-180' : ''
                                            }`}
                                    />
                                </button>

                                <div
                                    className={`overflow-hidden transition-all duration-300 ${openIndex === index ? 'max-h-96' : 'max-h-0'
                                        }`}
                                >
                                    <div className="px-6 pb-5 text-muted-foreground leading-relaxed">
                                        {faq.answer}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Contact CTA */}
                    <div className="mt-12 text-center">
                        <p className="text-muted-foreground mb-4">
                            Vẫn còn thắc mắc? Chúng tôi sẵn sàng tư vấn!
                        </p>
                        <a
                            href="/contact"
                            className="inline-block px-8 py-3 bg-primary text-black font-bold rounded-full hover:bg-white transition-all shadow-lg hover:shadow-primary/50"
                        >
                            Liên Hệ Tư Vấn
                        </a>
                    </div>
                </div>
            </div>
        </section>
    );
}
