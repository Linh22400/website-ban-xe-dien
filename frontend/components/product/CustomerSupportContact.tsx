"use client";

import { Phone, MessageCircle } from "lucide-react";

export default function CustomerSupportContact() {
    const handleCallHotline = () => {
        window.location.href = 'tel:1900xxxx';
    };

    const handleZaloChat = () => {
        // Replace with actual Zalo OA link
        window.open('https://zalo.me/1900xxxx', '_blank');
    };

    return (
        <div className="flex flex-col sm:flex-row gap-3 p-4 rounded-xl border-2 border-primary/20 bg-gradient-to-r from-primary/5 to-accent/5">
            <div className="flex-1 min-w-0">
                <div className="text-sm font-semibold text-foreground mb-1">Cần tư vấn?</div>
                <div className="text-xs text-muted-foreground">Gọi ngay hoặc chat Zalo để được hỗ trợ</div>
            </div>
            <div className="flex gap-2">
                <button
                    onClick={handleCallHotline}
                    className="flex items-center gap-2 px-4 py-2 bg-primary text-black rounded-lg hover:bg-primary/90 transition-all font-semibold text-sm"
                >
                    <Phone className="w-4 h-4" />
                    <span className="whitespace-nowrap">1900 XXXX</span>
                </button>
                <button
                    onClick={handleZaloChat}
                    className="flex items-center gap-2 px-4 py-2 border-2 border-primary text-primary rounded-lg hover:bg-primary/10 transition-all font-semibold text-sm"
                >
                    <MessageCircle className="w-4 h-4" />
                    <span className="whitespace-nowrap">Chat Zalo</span>
                </button>
            </div>
        </div>
    );
}
