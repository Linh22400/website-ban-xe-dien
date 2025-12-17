"use client";

import dynamic from 'next/dynamic';

const RichTextEditor = dynamic(() => import('@/components/admin/RichTextEditor'), { ssr: false });

interface TextBlockProps {
    data: { content: string };
    onChange: (data: { content: string }) => void;
}

export default function TextBlock({ data, onChange }: TextBlockProps) {
    return (
        <div className="space-y-2">
            <RichTextEditor
                content={data.content || ''}
                onChange={(html) => onChange({ ...data, content: html })}
                placeholder="Nhập nội dung văn bản..."
            />
        </div>
    );
}
