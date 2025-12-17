"use client";

import dynamic from 'next/dynamic';

const RichTextEditor = dynamic(() => import('@/components/admin/RichTextEditor'), { ssr: false });

interface SectionBlockProps {
    data: {
        title: string;
        description: string;
    };
    onChange: (data: { title: string; description: string }) => void;
}

export default function SectionBlock({ data, onChange }: SectionBlockProps) {
    return (
        <div className="space-y-4">
            <div className="space-y-2">
                <label className="text-sm font-bold text-gray-400">Tiêu Đề Mục</label>
                <input
                    type="text"
                    value={data.title || ''}
                    onChange={(e) => onChange({ ...data, title: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary transition-colors font-bold text-lg"
                    placeholder="Nhập tiêu đề cho phần này..."
                />
            </div>

            <div className="space-y-2">
                <label className="text-sm font-bold text-gray-400">Nội Dung</label>
                <RichTextEditor
                    content={data.description || ''}
                    onChange={(html) => onChange({ ...data, description: html })}
                    placeholder="Nhập nội dung chi tiết..."
                />
            </div>
        </div>
    );
}
