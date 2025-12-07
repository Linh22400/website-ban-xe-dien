"use client";

import { useState } from "react";
import { MessageCircle, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function LiveChatWidget() {
    const [isOpen, setIsOpen] = useState(false);

    const openMessenger = () => {
        // Facebook Messenger link
        // Replace PAGE_ID with actual Facebook Page ID
        window.open("https://m.me/YOUR_PAGE_ID", "_blank");
    };

    return (
        <>
            {/* Chat button */}
            <motion.button
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={openMessenger}
                className="fixed bottom-6 right-6 z-50 p-4 bg-gradient-to-r from-primary to-accent rounded-full shadow-2xl hover:shadow-primary/50 transition-all duration-300 group"
                aria-label="Chat with us"
            >
                <MessageCircle className="w-6 h-6 text-white" />

                {/* Notification badge */}
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full animate-pulse" />

                {/* Ripple effect */}
                <span className="absolute inset-0 rounded-full bg-primary/30 animate-ping" />
            </motion.button>

            {/* Tooltip on hover */}
            <AnimatePresence>
                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    className="fixed bottom-6 right-24 z-50 hidden lg:block"
                >
                    <div className="bg-white px-4 py-2 rounded-lg shadow-lg text-sm font-medium text-gray-800 whitespace-nowrap">
                        Cần hỗ trợ? Chat với chúng tôi!
                        <div className="text-xs text-gray-500 mt-1">
                            ⚡ Phản hồi trong 1 phút
                        </div>
                    </div>
                </motion.div>
            </AnimatePresence>
        </>
    );
}
