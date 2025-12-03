'use client';

import { QRCodeSVG } from 'qrcode.react';

interface QRCodeDisplayProps {
    value: string;
    size?: number;
}

export default function QRCodeDisplay({ value, size = 200 }: QRCodeDisplayProps) {
    return (
        <div className="bg-white p-4 rounded-xl inline-block">
            <QRCodeSVG
                value={value}
                size={size}
                level="H"
                includeMargin={true}
            />
        </div>
    );
}
