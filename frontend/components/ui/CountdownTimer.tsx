'use client';

import { useState, useEffect } from 'react';

interface CountdownTimerProps {
    expiryDate: string;
    compact?: boolean;
}

export default function CountdownTimer({ expiryDate, compact = false }: CountdownTimerProps) {
    const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

    useEffect(() => {
        const timer = setInterval(() => {
            const now = new Date().getTime();
            const expiry = new Date(expiryDate).getTime();
            const distance = expiry - now;

            if (distance < 0) {
                clearInterval(timer);
                setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
            } else {
                setTimeLeft({
                    days: Math.floor(distance / (1000 * 60 * 60 * 24)),
                    hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
                    minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
                    seconds: Math.floor((distance % (1000 * 60)) / 1000)
                });
            }
        }, 1000);

        return () => clearInterval(timer);
    }, [expiryDate]);

    if (compact) {
        return (
            <div className="inline-flex gap-1 text-sm font-bold">
                <span>{String(timeLeft.days).padStart(2, '0')}d</span>
                <span>:</span>
                <span>{String(timeLeft.hours).padStart(2, '0')}h</span>
                <span>:</span>
                <span>{String(timeLeft.minutes).padStart(2, '0')}m</span>
                <span>:</span>
                <span>{String(timeLeft.seconds).padStart(2, '0')}s</span>
            </div>
        );
    }

    return (
        <div className="flex gap-2">
            <div className="bg-white/10 backdrop-blur-md rounded-lg p-2 min-w-[50px] text-center">
                <div className="text-2xl font-bold">{String(timeLeft.days).padStart(2, '0')}</div>
                <div className="text-[10px] opacity-70">Ngày</div>
            </div>
            <div className="bg-white/10 backdrop-blur-md rounded-lg p-2 min-w-[50px] text-center">
                <div className="text-2xl font-bold">{String(timeLeft.hours).padStart(2, '0')}</div>
                <div className="text-[10px] opacity-70">Giờ</div>
            </div>
            <div className="bg-white/10 backdrop-blur-md rounded-lg p-2 min-w-[50px] text-center">
                <div className="text-2xl font-bold">{String(timeLeft.minutes).padStart(2, '0')}</div>
                <div className="text-[10px] opacity-70">Phút</div>
            </div>
            <div className="bg-white/10 backdrop-blur-md rounded-lg p-2 min-w-[50px] text-center">
                <div className="text-2xl font-bold">{String(timeLeft.seconds).padStart(2, '0')}</div>
                <div className="text-[10px] opacity-70">Giây</div>
            </div>
        </div>
    );
}
