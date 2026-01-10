"use client";

import { Shield, Truck, CreditCard, RefreshCw } from "lucide-react";
import { motion } from "framer-motion";

const uspItems = [
    {
        icon: Shield,
        title: "Bảo hành 2 năm",
        description: "Toàn diện & chính hãng",
        color: "from-emerald-500 to-green-500",
    },
    {
        icon: Truck,
        title: "Giao hàng miễn phí",
        description: "Nội thành Hà Nội & HCM",
        color: "from-green-500 to-emerald-500",
    },
    {
        icon: CreditCard,
        title: "Trả góp 0%",
        description: "Lãi suất 6 tháng đầu",
        color: "from-rose-500 to-pink-500",
    },
    {
        icon: RefreshCw,
        title: "Đổi trả 7 ngày",
        description: "Không hài lòng hoàn tiền",
        color: "from-orange-500 to-red-500",
    },
];

export default function USPBanner() {
    return (
        <section className="py-12 bg-background">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {uspItems.map((item, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                            className="group"
                        >
                            <div className="relative overflow-hidden rounded-xl bg-card p-4 shadow-md hover:shadow-lg transition-all duration-300 border border-gray-800">
                                {/* Gradient overlay on hover */}
                                <div className={`absolute inset-0 bg-gradient-to-br ${item.color} opacity-0 group-hover:opacity-5 transition-opacity duration-300`} />

                                <div className="relative z-10">
                                    {/* Icon */}
                                    <div className={`inline-flex p-3 rounded-xl bg-gradient-to-br ${item.color} mb-4`}>
                                        <item.icon className="w-6 h-6 text-white" />
                                    </div>

                                    {/* Content */}
                                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">
                                        {item.title}
                                    </h3>
                                    <p className="text-sm text-gray-400">
                                        {item.description}
                                    </p>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
