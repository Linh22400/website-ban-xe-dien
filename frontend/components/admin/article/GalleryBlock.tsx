"use client";

import { useState } from 'react';
import { Upload, X, Image as ImageIcon } from 'lucide-react';
import { uploadFile } from '@/lib/api';
import { useAuth } from '@/lib/auth-context';

interface GalleryBlockProps {
    data: {
        images: any[]; // Array of image objects or IDs
    };
    onChange: (data: any) => void;
}

export default function GalleryBlock({ data, onChange }: GalleryBlockProps) {
    const { token } = useAuth();
    const [uploading, setUploading] = useState(false);

    const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || "http://localhost:1337";

    const handleFilesUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files?.length) return;

        setUploading(true);
        const files = Array.from(e.target.files);
        const newImages = [...(data.images || [])];

        for (const file of files) {
            const uploadedId = await uploadFile(token!, file);
            if (uploadedId) {
                // Create preview + ID object
                // Using FileReader for immediate preview
                await new Promise<void>((resolve) => {
                    const reader = new FileReader();
                    reader.onload = (ev) => {
                        newImages.push({
                            id: uploadedId,
                            url: ev.target?.result as string
                        });
                        resolve();
                    };
                    reader.readAsDataURL(file);
                });
            }
        }

        onChange({ ...data, images: newImages });
        setUploading(false);
    };

    const removeImage = (index: number) => {
        const newImages = [...(data.images || [])];
        newImages.splice(index, 1);
        onChange({ ...data, images: newImages });
    };

    return (
        <div className="space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {(data.images || []).map((img, index) => {
                    const src = img.url?.startsWith('data:') || img.url?.startsWith('http')
                        ? img.url
                        : `${STRAPI_URL}${img.url}`;

                    return (
                        <div key={index} className="aspect-square relative rounded-xl overflow-hidden border border-white/10 group">
                            <img src={src} alt="Gallery" className="w-full h-full object-cover" />
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                <button
                                    onClick={() => removeImage(index)}
                                    className="p-2 bg-red-500/80 hover:bg-red-500 text-white rounded-lg transition-colors"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>
                        </div>
                    );
                })}

                {/* Upload Button */}
                <label className="aspect-square bg-white/5 border border-dashed border-white/20 rounded-xl flex flex-col items-center justify-center cursor-pointer hover:bg-white/10 hover:border-primary/50 transition-all">
                    <Upload className="w-6 h-6 text-muted-foreground mb-2" />
                    <span className="text-xs text-muted-foreground text-center px-2">
                        {uploading ? 'Đang tải...' : 'Thêm ảnh'}
                    </span>
                    <input
                        type="file"
                        accept="image/*"
                        multiple
                        className="hidden"
                        onChange={handleFilesUpload}
                        disabled={uploading}
                    />
                </label>
            </div>
            <p className="text-xs text-muted-foreground">
                Hỗ trợ tải lên nhiều ảnh cùng lúc.
            </p>
        </div>
    );
}
