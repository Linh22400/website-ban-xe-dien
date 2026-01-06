"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";

interface CartItem {
    id: string | number;
    name: string;
    price: number;           // Discounted price (if applicable)
    originalPrice?: number;   // Original price before discount
    image: string;           // Main image (for backward compat)
    gallery: string[];       // All images for selected color
    colorName: string;       // Selected color name
    quantity: number;
    slug: string;
}

interface CartContextType {
    items: CartItem[];
    addToCart: (item: Omit<CartItem, "quantity">) => void;
    removeFromCart: (id: string | number, colorName?: string) => void;
    updateQuantity: (id: string | number, quantity: number, colorName?: string) => void;
    clearCart: () => void;
    total: number;
    itemCount: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
    const [items, setItems] = useState<CartItem[]>([]);

    // Load cart from localStorage on mount
    useEffect(() => {
        const saved = localStorage.getItem("cart");
        if (saved) {
            try {
                const items = JSON.parse(saved);
                // Migrate old cart items to new schema
                const migrated = items.map((item: any) => ({
                    ...item,
                    gallery: item.gallery || [item.image], // Fallback to main image
                    colorName: item.colorName || "Mặc định"
                }));
                setItems(migrated);
            } catch (e) {
                console.error("Failed to load cart:", e);
                setItems([]);
            }
        }
    }, []);

    // Save cart to localStorage whenever it changes
    useEffect(() => {
        localStorage.setItem("cart", JSON.stringify(items));
    }, [items]);

    const addToCart = (item: Omit<CartItem, "quantity">) => {
        setItems((prev) => {
            // Lưu ý thực tế: quy trình đặt cọc/mua xe thường áp dụng cho 1 xe mỗi đơn.
            // Backend hiện cũng chỉ hỗ trợ 1 VehicleModel / order.

            // Nếu đã có đúng xe + đúng màu trong giỏ thì giữ nguyên (xe không mua theo "số lượng").
            const existing = prev.find((i) => i.id === item.id && i.colorName === item.colorName);
            if (existing) {
                return prev;
            }

            // Nếu giỏ đã có xe khác, hỏi người dùng có muốn thay thế không.
            if (prev.length > 0) {
                const ok = typeof window !== 'undefined'
                    ? window.confirm('Giỏ hàng hiện chỉ hỗ trợ đặt/mua 1 xe mỗi đơn. Bạn có muốn thay thế xe đang có trong giỏ bằng xe mới không?')
                    : true;

                if (!ok) {
                    return prev;
                }

                return [{ ...item, quantity: 1 }];
            }

            return [{ ...item, quantity: 1 }];
        });
    };

    const removeFromCart = (id: string | number, colorName?: string) => {
        setItems((prev) => prev.filter((i) => {
            // If colorName provided, match both id and color
            if (colorName) {
                return !(i.id === id && i.colorName === colorName);
            }
            // Otherwise just match id (backward compatible)
            return i.id !== id;
        }));
    };

    const updateQuantity = (id: string | number, quantity: number, colorName?: string) => {
        // Xe không mua theo số lượng trong một đơn ở flow hiện tại.
        // Giữ quantity = 1, nếu người dùng muốn bỏ thì dùng nút xóa.
        if (quantity <= 0) {
            removeFromCart(id, colorName);
            return;
        }
        if (quantity > 1) {
            quantity = 1;
        }
        setItems((prev) =>
            prev.map((i) => {
                // Match by both id and colorName if provided
                if (colorName) {
                    return i.id === id && i.colorName === colorName ? { ...i, quantity } : i;
                }
                // Otherwise just match id
                return i.id === id ? { ...i, quantity } : i;
            })
        );
    };

    const clearCart = () => {
        setItems([]);
    };

    const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

    return (
        <CartContext.Provider
            value={{
                items,
                addToCart,
                removeFromCart,
                updateQuantity,
                clearCart,
                total,
                itemCount,
            }}
        >
            {children}
        </CartContext.Provider>
    );
}

export function useCart() {
    const context = useContext(CartContext);
    if (!context) {
        throw new Error("useCart must be used within CartProvider");
    }
    return context;
}
