'use client';

import { QRCodeSVG } from 'qrcode.react';

interface QRCodeDisplayProps {
    value: string;
    size?: number;
}

export default function QRCodeDisplay({ value, size = 200 }: QRCodeDisplayProps) {
    if (!value) {
        return (
            <div className="bg-white p-4 rounded-xl inline-block shadow-lg w-[240px] h-[240px] flex items-center justify-center">
                <p className="text-gray-500 text-sm">Đang tạo mã QR...</p>
            </div>
        );
    }

    return (
        <div className="bg-white p-4 rounded-xl inline-block shadow-lg">
            <QRCodeSVG
                value={value}
                size={size}
                level="H"
                includeMargin={true}
                fgColor="#000000"
                bgColor="#FFFFFF"
            />
        </div>
    );
}
