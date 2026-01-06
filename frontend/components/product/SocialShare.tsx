"use client";

import { useState } from "react";
import { Facebook, Share2, Check } from "lucide-react";

interface SocialShareProps {
    url: string;
    title: string;
}

export default function SocialShare({ url, title }: SocialShareProps) {
    const [copied, setCopied] = useState(false);

    const handleCopyLink = async () => {
        try {
            await navigator.clipboard.writeText(url);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error('Failed to copy:', err);
        }
    };

    const handleFacebookShare = () => {
        const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
        window.open(facebookUrl, '_blank', 'width=600,height=400');
    };

    const handleZaloShare = () => {
        const zaloUrl = `https://social.zalo.me/share?url=${encodeURIComponent(url)}`;
        window.open(zaloUrl, '_blank', 'width=600,height=400');
    };

    return (
        <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground font-medium">Chia sẻ:</span>
            
            <button
                onClick={handleFacebookShare}
                className="p-2 rounded-lg border border-white/10 bg-card/30 hover:bg-blue-500/10 hover:border-blue-500/50 transition-colors group"
                aria-label="Share on Facebook"
            >
                <Facebook className="w-4 h-4 text-muted-foreground group-hover:text-blue-500 transition-colors" />
            </button>

            <button
                onClick={handleZaloShare}
                className="p-2 rounded-lg border border-white/10 bg-card/30 hover:bg-blue-400/10 hover:border-blue-400/50 transition-colors group"
                aria-label="Share on Zalo"
            >
                <svg className="w-4 h-4 text-muted-foreground group-hover:text-blue-400 transition-colors" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2C6.48 2 2 6.48 2 12c0 3.53 1.83 6.63 4.59 8.39L4.5 24l4.09-2.09C9.68 21.96 10.83 22 12 22c5.52 0 10-4.48 10-10S17.52 2 12 2zm3.5 13.5h-7c-.28 0-.5-.22-.5-.5s.22-.5.5-.5h7c.28 0 .5.22.5.5s-.22.5-.5.5zm0-3h-7c-.28 0-.5-.22-.5-.5s.22-.5.5-.5h7c.28 0 .5.22.5.5s-.22.5-.5.5zm0-3h-7c-.28 0-.5-.22-.5-.5s.22-.5.5-.5h7c.28 0 .5.22.5.5s-.22.5-.5.5z"/>
                </svg>
            </button>

            <button
                onClick={handleCopyLink}
                className="p-2 rounded-lg border border-white/10 bg-card/30 hover:bg-primary/10 hover:border-primary/50 transition-colors group"
                aria-label="Copy link"
            >
                {copied ? (
                    <Check className="w-4 h-4 text-primary" />
                ) : (
                    <Share2 className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                )}
            </button>
        </div>
    );
}
