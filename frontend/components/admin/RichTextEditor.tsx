"use client";

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import ImageExtension from '@tiptap/extension-image';
import LinkExtension from '@tiptap/extension-link';
import Placeholder from '@tiptap/extension-placeholder';
import {
    Bold,
    Italic,
    Strikethrough,
    Heading2,
    Heading3,
    List,
    ListOrdered,
    Quote,
    Link as LinkIcon,
    Image as ImageIcon,
    Undo,
    Redo,
    Unlink
} from 'lucide-react';
import { uploadFile } from '@/lib/api';
import { useAuth } from '@/lib/auth-context';
import { useCallback } from 'react';

interface RichTextEditorProps {
    content: string;
    onChange: (html: string) => void;
    placeholder?: string;
}

const MenuBar = ({ editor, onImageUpload }: { editor: any, onImageUpload: () => void }) => {
    if (!editor) {
        return null;
    }

    const setLink = useCallback(() => {
        const previousUrl = editor.getAttributes('link').href;
        const url = window.prompt('URL', previousUrl);

        // cancelled
        if (url === null) {
            return;
        }

        // empty
        if (url === '') {
            editor.chain().focus().extendMarkRange('link').unsetLink().run();
            return;
        }

        // update
        editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
    }, [editor]);

    return (
        <div className="flex flex-wrap items-center gap-1 p-2 border-b border-white/10 bg-white/5 rounded-t-xl sticky top-0 z-10 backdrop-blur-md">
            <button
                onClick={() => editor.chain().focus().toggleBold().run()}
                disabled={!editor.can().chain().focus().toggleBold().run()}
                className={`p-2 rounded-lg transition-colors ${editor.isActive('bold') ? 'bg-primary text-black' : 'text-gray-400 hover:bg-white/10 hover:text-white'}`}
                title="Bold"
            >
                <Bold className="w-4 h-4" />
            </button>
            <button
                onClick={() => editor.chain().focus().toggleItalic().run()}
                disabled={!editor.can().chain().focus().toggleItalic().run()}
                className={`p-2 rounded-lg transition-colors ${editor.isActive('italic') ? 'bg-primary text-black' : 'text-gray-400 hover:bg-white/10 hover:text-white'}`}
                title="Italic"
            >
                <Italic className="w-4 h-4" />
            </button>
            <button
                onClick={() => editor.chain().focus().toggleStrike().run()}
                disabled={!editor.can().chain().focus().toggleStrike().run()}
                className={`p-2 rounded-lg transition-colors ${editor.isActive('strike') ? 'bg-primary text-black' : 'text-gray-400 hover:bg-white/10 hover:text-white'}`}
                title="Strikethrough"
            >
                <Strikethrough className="w-4 h-4" />
            </button>

            <div className="w-px h-6 bg-white/10 mx-1" />

            <button
                onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                className={`p-2 rounded-lg transition-colors ${editor.isActive('heading', { level: 2 }) ? 'bg-primary text-black' : 'text-gray-400 hover:bg-white/10 hover:text-white'}`}
                title="Heading 2"
            >
                <Heading2 className="w-4 h-4" />
            </button>
            <button
                onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
                className={`p-2 rounded-lg transition-colors ${editor.isActive('heading', { level: 3 }) ? 'bg-primary text-black' : 'text-gray-400 hover:bg-white/10 hover:text-white'}`}
                title="Heading 3"
            >
                <Heading3 className="w-4 h-4" />
            </button>

            <div className="w-px h-6 bg-white/10 mx-1" />

            <button
                onClick={() => editor.chain().focus().toggleBulletList().run()}
                className={`p-2 rounded-lg transition-colors ${editor.isActive('bulletList') ? 'bg-primary text-black' : 'text-gray-400 hover:bg-white/10 hover:text-white'}`}
                title="Bullet List"
            >
                <List className="w-4 h-4" />
            </button>
            <button
                onClick={() => editor.chain().focus().toggleOrderedList().run()}
                className={`p-2 rounded-lg transition-colors ${editor.isActive('orderedList') ? 'bg-primary text-black' : 'text-gray-400 hover:bg-white/10 hover:text-white'}`}
                title="Ordered List"
            >
                <ListOrdered className="w-4 h-4" />
            </button>
            <button
                onClick={() => editor.chain().focus().toggleBlockquote().run()}
                className={`p-2 rounded-lg transition-colors ${editor.isActive('blockquote') ? 'bg-primary text-black' : 'text-gray-400 hover:bg-white/10 hover:text-white'}`}
                title="Quote"
            >
                <Quote className="w-4 h-4" />
            </button>

            <div className="w-px h-6 bg-white/10 mx-1" />

            <button
                onClick={setLink}
                className={`p-2 rounded-lg transition-colors ${editor.isActive('link') ? 'bg-primary text-black' : 'text-gray-400 hover:bg-white/10 hover:text-white'}`}
                title="Link"
            >
                <LinkIcon className="w-4 h-4" />
            </button>
            {editor.isActive('link') && (
                <button
                    onClick={() => editor.chain().focus().unsetLink().run()}
                    className="p-2 rounded-lg transition-colors text-gray-400 hover:bg-white/10 hover:text-red-400"
                    title="Unlink"
                >
                    <Unlink className="w-4 h-4" />
                </button>
            )}
            <button
                onClick={onImageUpload}
                className="p-2 rounded-lg transition-colors text-gray-400 hover:bg-white/10 hover:text-white"
                title="Insert Image"
            >
                <ImageIcon className="w-4 h-4" />
            </button>

            <div className="w-px h-6 bg-white/10 mx-1" />

            <button
                onClick={() => editor.chain().focus().undo().run()}
                disabled={!editor.can().chain().focus().undo().run()}
                className="p-2 rounded-lg transition-colors text-gray-400 hover:bg-white/10 hover:text-white disabled:opacity-30"
                title="Undo"
            >
                <Undo className="w-4 h-4" />
            </button>
            <button
                onClick={() => editor.chain().focus().redo().run()}
                disabled={!editor.can().chain().focus().redo().run()}
                className="p-2 rounded-lg transition-colors text-gray-400 hover:bg-white/10 hover:text-white disabled:opacity-30"
                title="Redo"
            >
                <Redo className="w-4 h-4" />
            </button>
        </div>
    );
};

export default function RichTextEditor({ content, onChange, placeholder }: RichTextEditorProps) {
    const { token } = useAuth();
    // Fallback URL logic included in upload handle if needed, but api.ts handles absolute path
    const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || "http://localhost:1337";

    const editor = useEditor({
        immediatelyRender: false,
        extensions: [
            StarterKit,
            ImageExtension.configure({
                inline: true,
                allowBase64: true, // Optional fallback
            }),
            LinkExtension.configure({
                openOnClick: false,
                autolink: true, // Auto-link urls
            }),
            Placeholder.configure({
                placeholder: placeholder || 'Nhập nội dung bài viết...',
            }),
        ],
        content: content,
        editorProps: {
            attributes: {
                class: 'prose prose-invert max-w-none focus:outline-none min-h-[300px] px-6 py-4 text-gray-300',
            },
        },
        onUpdate: ({ editor }) => {
            onChange(editor.getHTML());
        },
    });

    const handleImageUpload = () => {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'image/*';
        input.onchange = async (e) => {
            const file = (e.target as HTMLInputElement).files?.[0];
            if (file && token) {
                const uploadedFiles = await uploadFile(token, file);
                if (uploadedFiles && uploadedFiles.length > 0) {
                    const fileData = uploadedFiles[0];
                    const fullUrl = fileData.url.startsWith('http') ? fileData.url : `${STRAPI_URL}${fileData.url}`;
                    editor?.chain().focus().setImage({ src: fullUrl }).run();
                } else {
                    alert("Upload ảnh thất bại.");
                }
            }
        };
        input.click();
    };

    return (
        <div className="border border-white/10 rounded-xl overflow-hidden bg-white/5 focus-within:border-primary/50 transition-colors">
            <MenuBar editor={editor} onImageUpload={handleImageUpload} />
            <EditorContent editor={editor} />
        </div>
    );
}

// Add CSS for Tiptap placeholder because it's not included in standard CSS
// We can add this to global CSS or inline style injection.
// For now, simple text-gray-500 class in attributes works if Placeholder extension supports it.
// Actually Tiptap placeholder requires CSS .is-editor-empty:before { ... }
// Let's add a style block here for simplicity or rely on 'prose' handling empty p
