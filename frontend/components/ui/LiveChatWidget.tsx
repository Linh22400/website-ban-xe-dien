"use client";

import { MessageCircle } from "lucide-react";

export default function LiveChatWidget() {
    const messengerUrl =
        process.env.NEXT_PUBLIC_MESSENGER_URL ||
        (process.env.NEXT_PUBLIC_MESSENGER_PAGE_ID
            ? `https://m.me/${process.env.NEXT_PUBLIC_MESSENGER_PAGE_ID}`
            : null);

    const openMessenger = () => {
        if (!messengerUrl) return;
        window.open(messengerUrl, "_blank", "noopener,noreferrer");
    };

    // If not configured, don't show a distracting/broken widget.
    if (!messengerUrl) return null;

    return (
        <button
            onClick={openMessenger}
            className="fixed bottom-6 right-6 z-50 p-4 bg-primary text-black rounded-full shadow-2xl hover:shadow-primary/30 transition-shadow"
            aria-label="Chat với chúng tôi"
        >
            <MessageCircle className="w-6 h-6" />
        </button>
    );
}
