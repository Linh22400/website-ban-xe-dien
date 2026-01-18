"use client";

import { useEffect } from "react";

const KEEP_ALIVE_INTERVAL = 14 * 60 * 1000; // 14 phút (Render sleep sau 15 phút)

export default function KeepAliveManager() {
    useEffect(() => {
        // Chỉ chạy ở môi trường production (hoặc khi test kết nối render)
        if (process.env.NODE_ENV === 'development') return;

        const pingBackend = async () => {
            try {
                // Kiểm tra tab có đang active không để tiết kiệm tài nguyên client
                if (document.visibilityState === 'visible') {
                    // Gọi qua API Route của Next.js (Proxy) để giấu IP client và xử lý CORS tốt hơn
                    await fetch('/api/keep-alive', {
                        method: 'GET',
                        cache: 'no-store',
                        headers: {
                            'x-keep-alive': 'client-heartbeat'
                        }
                    });
                    // console.log("Heartbeat sent to backend."); // Uncomment for debug
                }
            } catch (error) {
                // Silent fail - không làm phiền user
            }
        };

        // Ping ngay khi mount component (người dùng vừa vào trang)
        pingBackend();

        // Thiết lập interval
        const intervalId = setInterval(pingBackend, KEEP_ALIVE_INTERVAL);

        return () => clearInterval(intervalId);
    }, []);

    return null; // Component không render giao diện
}
