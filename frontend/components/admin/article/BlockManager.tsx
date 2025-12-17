"use client";

import { useState } from 'react';
import {
    Plus,
    Trash2,
    ArrowUp,
    ArrowDown,
    Type,
    Columns,
    Images,
    GripVertical
} from 'lucide-react';
import TextBlock from './TextBlock';
import TwoColumnBlock from './TwoColumnBlock';
import GalleryBlock from './GalleryBlock';

import SectionBlock from './SectionBlock';

type BlockType = 'product.article-text' | 'product.article-two-column' | 'product.article-gallery' | 'product.article-section';

interface Block {
    __component: BlockType;
    id?: number; // Internal ID if from DB
    tempId?: number; // Frontend temp ID
    [key: string]: any;
}

interface BlockManagerProps {
    blocks: Block[];
    onChange: (blocks: Block[]) => void;
}

export default function BlockManager({ blocks, onChange }: BlockManagerProps) {
    const [openMenu, setOpenMenu] = useState(false);

    const addBlock = (type: BlockType) => {
        const newBlock: Block = {
            __component: type,
            tempId: Date.now(),
            // Default initial data based on type
            ...(type === 'product.article-text' ? { content: '' } : {}),
            ...(type === 'product.article-two-column' ? { content: '', layout: 'left-image' } : {}),
            ...(type === 'product.article-gallery' ? { images: [] } : {}),
            ...(type === 'product.article-section' ? { title: '', description: '' } : {}),
        };
        onChange([...blocks, newBlock]);
        setOpenMenu(false);
    };

    const removeBlock = (index: number) => {
        if (!confirm("Bạn có chắc muốn xóa khối này?")) return;
        const newBlocks = [...blocks];
        newBlocks.splice(index, 1);
        onChange(newBlocks);
    };

    const moveBlock = (index: number, direction: 'up' | 'down') => {
        if (
            (direction === 'up' && index === 0) ||
            (direction === 'down' && index === blocks.length - 1)
        ) return;

        const newBlocks = [...blocks];
        const targetIndex = direction === 'up' ? index - 1 : index + 1;
        [newBlocks[index], newBlocks[targetIndex]] = [newBlocks[targetIndex], newBlocks[index]];
        onChange(newBlocks);
    };

    const updateBlock = (index: number, data: any) => {
        const newBlocks = [...blocks];
        newBlocks[index] = { ...newBlocks[index], ...data };
        onChange(newBlocks);
    };

    const renderBlockContent = (block: Block, index: number) => {
        switch (block.__component) {
            case 'product.article-text':
                return <TextBlock data={block as any} onChange={(data) => updateBlock(index, data)} />;
            case 'product.article-two-column':
                return <TwoColumnBlock data={block as any} onChange={(data) => updateBlock(index, data)} />;
            case 'product.article-gallery':
                return <GalleryBlock data={block as any} onChange={(data) => updateBlock(index, data)} />;
            case 'product.article-section':
                return <SectionBlock data={block as any} onChange={(data) => updateBlock(index, data)} />;
            default:
                return <div className="p-4 text-red-400">Unknown block type: {block.__component}</div>;
        }
    };

    const getBlockLabel = (type: string) => {
        switch (type) {
            case 'product.article-text': return 'Văn Bản';
            case 'product.article-two-column': return '2 Cột (Ảnh + Chữ)';
            case 'product.article-gallery': return 'Bộ Sưu Tập Ảnh';
            case 'product.article-section': return 'Section (Tiêu đề + Nội dung)';
            default: return 'Khối Nội Dung';
        }
    };

    return (
        <div className="space-y-6">
            {blocks.map((block, index) => (
                <div key={block.id || block.tempId} className="group relative bg-white/5 border border-white/10 rounded-2xl overflow-hidden hover:border-white/20 transition-all">
                    {/* Block Header / Controls */}
                    <div className="flex items-center justify-between px-4 py-2 bg-white/5 border-b border-white/10">
                        <div className="flex items-center gap-2 text-sm font-medium text-gray-400">
                            <GripVertical className="w-4 h-4" />
                            {getBlockLabel(block.__component)}
                        </div>
                        <div className="flex items-center gap-1 opacity-50 group-hover:opacity-100 transition-opacity">
                            <button
                                onClick={() => moveBlock(index, 'up')}
                                disabled={index === 0}
                                className="p-1.5 hover:bg-white/10 rounded-lg text-gray-400 hover:text-white disabled:opacity-30"
                                title="Di chuyển lên"
                            >
                                <ArrowUp className="w-4 h-4" />
                            </button>
                            <button
                                onClick={() => moveBlock(index, 'down')}
                                disabled={index === blocks.length - 1}
                                className="p-1.5 hover:bg-white/10 rounded-lg text-gray-400 hover:text-white disabled:opacity-30"
                                title="Di chuyển xuống"
                            >
                                <ArrowDown className="w-4 h-4" />
                            </button>
                            <div className="w-px h-4 bg-white/10 mx-1" />
                            <button
                                onClick={() => removeBlock(index)}
                                className="p-1.5 hover:bg-red-500/10 rounded-lg text-gray-400 hover:text-red-500"
                                title="Xóa khối"
                            >
                                <Trash2 className="w-4 h-4" />
                            </button>
                        </div>
                    </div>

                    {/* Block Content */}
                    <div className="p-4">
                        {renderBlockContent(block, index)}
                    </div>
                </div>
            ))}

            {/* Add Block Button */}
            <div className="relative">
                {openMenu ? (
                    <div className="p-4 bg-card border border-white/10 rounded-2xl shadow-xl animate-in fade-in zoom-in-95 duration-200">
                        <div className="text-sm font-bold text-gray-400 mb-3 uppercase tracking-wider">Chọn loại nội dung</div>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                            <button
                                onClick={() => addBlock('product.article-text')}
                                className="flex flex-col items-center gap-3 p-4 bg-white/5 hover:bg-primary/10 border border-white/10 hover:border-primary/50 rounded-xl transition-all group"
                            >
                                <div className="p-3 bg-white/5 rounded-full group-hover:bg-primary group-hover:text-black transition-colors">
                                    <Type className="w-6 h-6" />
                                </div>
                                <span className="font-medium text-white">Văn Bản</span>
                            </button>
                            <button
                                onClick={() => addBlock('product.article-two-column')}
                                className="flex flex-col items-center gap-3 p-4 bg-white/5 hover:bg-primary/10 border border-white/10 hover:border-primary/50 rounded-xl transition-all group"
                            >
                                <div className="p-3 bg-white/5 rounded-full group-hover:bg-primary group-hover:text-black transition-colors">
                                    <Columns className="w-6 h-6" />
                                </div>
                                <span className="font-medium text-white">2 Cột</span>
                            </button>
                            <button
                                onClick={() => addBlock('product.article-gallery')}
                                className="flex flex-col items-center gap-3 p-4 bg-white/5 hover:bg-primary/10 border border-white/10 hover:border-primary/50 rounded-xl transition-all group"
                            >
                                <div className="p-3 bg-white/5 rounded-full group-hover:bg-primary group-hover:text-black transition-colors">
                                    <Images className="w-6 h-6" />
                                </div>
                                <span className="font-medium text-white">Bộ Sưu Tập</span>
                            </button>
                            <button
                                onClick={() => addBlock('product.article-section')}
                                className="flex flex-col items-center gap-3 p-4 bg-white/5 hover:bg-primary/10 border border-white/10 hover:border-primary/50 rounded-xl transition-all group"
                            >
                                <div className="p-3 bg-white/5 rounded-full group-hover:bg-primary group-hover:text-black transition-colors">
                                    <Type className="w-6 h-6" />
                                </div>
                                <span className="font-medium text-white">Section</span>
                            </button>
                        </div>
                        <button
                            onClick={() => setOpenMenu(false)}
                            className="w-full mt-3 py-2 text-sm text-gray-500 hover:text-white transition-colors"
                        >
                            Hủy bỏ
                        </button>
                    </div>
                ) : (
                    <button
                        onClick={() => setOpenMenu(true)}
                        className="w-full py-4 border-2 border-dashed border-white/10 rounded-2xl flex items-center justify-center gap-2 text-muted-foreground hover:text-white hover:border-primary/50 hover:bg-white/5 transition-all group"
                    >
                        <Plus className="w-5 h-5 group-hover:scale-110 transition-transform" />
                        <span className="font-bold">Thêm Nội Dung Mới</span>
                    </button>
                )}
            </div>
        </div>
    );
}
