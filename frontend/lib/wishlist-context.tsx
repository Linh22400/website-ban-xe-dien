"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";

interface WishlistItem {
    id: string | number;
    name: string;
    price: number;
    image: string;
    slug: string;
    type?: 'vehicle' | 'accessory';
}

interface WishlistContextType {
    items: WishlistItem[];
    addToWishlist: (item: WishlistItem) => void;
    removeFromWishlist: (id: string | number) => void;
    isInWishlist: (id: string | number) => boolean;
    clearWishlist: () => void;
    itemCount: number;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export function WishlistProvider({ children }: { children: ReactNode }) {
    const [items, setItems] = useState<WishlistItem[]>([]);

    // Load wishlist from localStorage on mount
    useEffect(() => {
        const saved = localStorage.getItem("wishlist");
        if (saved) {
            setItems(JSON.parse(saved));
        }
    }, []);

    // Save wishlist to localStorage whenever it changes
    useEffect(() => {
        localStorage.setItem("wishlist", JSON.stringify(items));
    }, [items]);

    const addToWishlist = (item: WishlistItem) => {
        setItems((prev) => {
            const existing = prev.find((i) => i.id === item.id);
            if (existing) {
                return prev; // Already in wishlist
            }
            return [...prev, item];
        });
    };

    const removeFromWishlist = (id: string | number) => {
        setItems((prev) => prev.filter((i) => i.id !== id));
    };

    const isInWishlist = (id: string | number) => {
        return items.some((i) => i.id === id);
    };

    const clearWishlist = () => {
        setItems([]);
    };

    const itemCount = items.length;

    return (
        <WishlistContext.Provider
            value={{
                items,
                addToWishlist,
                removeFromWishlist,
                isInWishlist,
                clearWishlist,
                itemCount,
            }}
        >
            {children}
        </WishlistContext.Provider>
    );
}

export function useWishlist() {
    const context = useContext(WishlistContext);
    if (!context) {
        throw new Error("useWishlist must be used within WishlistProvider");
    }
    return context;
}
