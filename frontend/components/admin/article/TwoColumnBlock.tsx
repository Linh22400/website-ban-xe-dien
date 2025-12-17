"use client";

import { useState } from 'react';
import { Upload, X, ArrowLeftRight, Image as ImageIcon } from 'lucide-react';
import dynamic from 'next/dynamic';
import { uploadFile } from '@/lib/api';
import { useAuth } from '@/lib/auth-context';

const RichTextEditor = dynamic(() => import('@/components/admin/RichTextEditor'), { ssr: false });

interface TwoColumnBlockProps {
    data: {
        content: string;
        image?: any; // ID or object
        layout: 'left-image' | 'right-image';
    };
    onChange: (data: any) => void;
}

export default function TwoColumnBlock({ data, onChange }: TwoColumnBlockProps) {
    const { token } = useAuth();
    const [uploading, setUploading] = useState(false);

    // Fallback URL logic
    const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || "http://localhost:1337";

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files || !e.target.files[0]) return;

        setUploading(true);
        const file = e.target.files[0];
        const uploadedId = await uploadFile(token!, file);

        if (uploadedId) {
            // Need to fetch or construct partial object preview. 
            // Ideally we should fetch full object, but for now we create a preview URL
            // and store the ID. Strapi Dynamic Zone needs the ID usually, 
            // but populating it back requires the object.

            // We'll trust the parent to save just the ID or object structure Strapi expects.
            // For preview, we use local FileReader or assume success.
            const reader = new FileReader();
            reader.onload = (ev) => {
                // We update data to include both ID (for save) and url (for preview)
                onChange({
                    ...data,
                    image: {
                        id: uploadedId,
                        url: ev.target?.result as string, // Local preview
                        // If we wanted real URL, we'd need to fetch from API as done in RichTextEditor
                    }
                });
            };
            reader.readAsDataURL(file);
        } else {
            alert("Upload ảnh thất bại");
        }
        setUploading(false);
    };

    const toggleLayout = () => {
        onChange({
            ...data,
            layout: data.layout === 'left-image' ? 'right-image' : 'left-image'
        });
    };

    const imageUrl = data.image?.url
        ? (data.image.url.startsWith('data:') || data.image.url.startsWith('http')
            ? data.image.url
            : `${STRAPI_URL}${data.image.url}`)
        : null;

    return (
        <div className="space-y-4">
            {/* Toolbar */}
            <div className="flex items-center gap-2 mb-2">
                <button
                    onClick={toggleLayout}
                    className="flex items-center gap-2 px-3 py-1.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-xs text-gray-300 transition-colors"
                >
                    <ArrowLeftRight className="w-3 h-3" />
                    Đổi Vị Trí Ảnh ({data.layout === 'left-image' ? 'Trái' : 'Phải'})
                </button>
            </div>

            <div className={`grid grid-cols-1 md:grid-cols-2 gap-6 ${data.layout === 'right-image' ? 'direction-rtl' : ''}`}>

                {/* Image Column */}
                <div className={`${data.layout === 'right-image' ? 'md:order-2' : 'md:order-1'}`}>
                    <div className="w-full aspect-[4/3] bg-white/5 border border-white/10 rounded-xl overflow-hidden relative">
                        {imageUrl ? (
                            <div className="relative w-full h-full group">
                                <img src={imageUrl} alt="Block Image" className="w-full h-full object-cover" />
                                <button
                                    onClick={() => onChange({ ...data, image: null })}
                                    className="absolute top-2 right-2 p-1.5 bg-black/50 hover:bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                >
                                    <X className="w-4 h-4" />
                                </button>
                            </div>
                        ) : (
                            <label className="flex flex-col items-center justify-center w-full h-full cursor-pointer hover:bg-white/10 transition-colors">
                                <Upload className="w-8 h-8 text-muted-foreground mb-2" />
                                <span className="text-xs text-muted-foreground">Tải ảnh lên</span>
                                <input
                                    type="file"
                                    accept="image/*"
                                    className="hidden"
                                    onChange={handleImageUpload}
                                    disabled={uploading}
                                />
                            </label>
                        )}
                        {uploading && (
                            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                                <span className="text-xs text-white">Đang tải...</span>
                            </div>
                        )}
                    </div>
                </div>

                {/* Content Column */}
                <div className={`${data.layout === 'right-image' ? 'md:order-1' : 'md:order-2'}`}>
                    <RichTextEditor
                        content={data.content || ''}
                        onChange={(html) => onChange({ ...data, content: html })}
                        placeholder="Nhập nội dung mô tả..."
                    />
                </div>
            </div>
        </div>
    );
}
