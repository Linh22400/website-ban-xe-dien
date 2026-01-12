import React from 'react';

/**
 * Highlight matching text in search results
 */
export function highlightText(text: string, query: string): React.ReactNode {
    if (!query.trim()) return text;

    const parts = text.split(new RegExp(`(${query})`, 'gi'));
    
    return parts.map((part, index) => 
        part.toLowerCase() === query.toLowerCase() ? (
            <mark key={index} className="bg-yellow-200 dark:bg-yellow-500/30 text-foreground font-semibold px-0.5 rounded">
                {part}
            </mark>
        ) : (
            part
        )
    );
}
