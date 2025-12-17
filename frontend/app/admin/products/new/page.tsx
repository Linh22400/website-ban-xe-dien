"use client";

import Link from "next/link";
import { ArrowLeft, Save, Upload, X, Plus } from "lucide-react";
import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { createCar, updateCar, getCarById, uploadFile } from "@/lib/api";
import { useAuth } from "@/lib/auth-context";

function ProductForm() {
    const router = useRouter();
    const { token: authToken } = useAuth();
    const searchParams = useSearchParams();
    const productId = searchParams.get("id");
    const isEditMode = !!productId;

    // Form State
    const [name, setName] = useState("");
    const [price, setPrice] = useState("");
    const [category, setCategory] = useState("");
    const [stock, setStock] = useState("");
    const [images, setImages] = useState<string[]>([]); // Preview URLs
    const [thumbnailFile, setThumbnailFile] = useState<File | null>(null); // Actual file for upload
    const [thumbnailId, setThumbnailId] = useState<number | undefined>(undefined);
    const [isFeatured, setIsFeatured] = useState(false);
    const [colors, setColors] = useState<{ name: string; hex: string; images: string[]; imageIds?: number[]; imageFiles?: File[] }[]>([]);

    // Additional fields
    const [brand, setBrand] = useState("");
    const [description, setDescription] = useState("");
    const [salePrice, setSalePrice] = useState("");

    // Specs
    const [speed, setSpeed] = useState("");
    const [range, setRange] = useState("");
    const [chargeTime, setChargeTime] = useState("");
    const [weight, setWeight] = useState("");

    // Loading State
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (isEditMode && productId) {
            async function fetchProduct() {
                try {
                    const product = await getCarById(productId as string);
                    if (product) {
                        setName(product.name);
                        setPrice(product.price.toString());
                        // Map backend type to frontend category label if needed
                        setCategory(product.type === 'bicycle' ? 'Xe Đạp Điện' : product.type === 'motorcycle' ? 'Xe Máy Điện' : 'Phụ Kiện');

                        setStock(product.stock ? product.stock.toString() : "0");
                        if (product.thumbnail) setImages([product.thumbnail]);
                        if (product.thumbnailId) setThumbnailId(product.thumbnailId);

                        setBrand(product.brand || "");
                        // description...

                        // Parse specifications if it exists
                        if (product.specifications && Array.isArray(product.specifications)) {
                            setSpeed(product.specifications.find((s: any) => s.label === "Vận tốc tối đa")?.value || "");
                            setRange(product.specifications.find((s: any) => s.label === "Quãng đường / lần sạc")?.value || "");
                            setChargeTime(product.specifications.find((s: any) => s.label === "Thời gian sạc")?.value || "");
                            setWeight(product.specifications.find((s: any) => s.label === "Trọng lượng")?.value || "");
                        }

                        if (product.isFeatured) setIsFeatured(product.isFeatured);
                        if (product.colors && Array.isArray(product.colors)) {
                            // Extract imageIds if available from api
                            setColors(product.colors.map((c: any) => ({
                                ...c,
                                imageIds: c.imageIds || [],
                                imageFiles: [] // Initialize empty
                            })));
                        }
                    }
                } catch (error) {
                    console.error("Failed to fetch product for edit", error);
                }
            }
            fetchProduct();
        }
    }, [isEditMode, productId]);

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setThumbnailFile(file); // Store file for upload

            const reader = new FileReader();
            reader.onload = (ev) => {
                if (ev.target?.result) {
                    setImages([ev.target.result as string]); // Replace existing image logic for single thumbnail
                }
            };
            reader.readAsDataURL(file);
        }
    };

    const removeImage = (index: number) => {
        setImages([]);
        setThumbnailFile(null);
        setThumbnailId(undefined);
    };

    // Color Management Functions
    const addColor = () => {
        setColors([...colors, { name: "", hex: "#000000", images: [], imageFiles: [] }]);
    };

    const removeColor = (index: number) => {
        setColors(colors.filter((_, i) => i !== index));
    };

    const updateColor = (index: number, field: 'name' | 'hex', value: string) => {
        const newColors = [...colors];
        newColors[index] = { ...newColors[index], [field]: value };
        setColors(newColors);
    };

    const handleColorImageUpload = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            const files = Array.from(e.target.files);
            const newFiles = [...(colors[index].imageFiles || []), ...files];

            const newImages: string[] = [];
            let processed = 0;

            files.forEach(file => {
                const reader = new FileReader();
                reader.onload = (ev) => {
                    if (ev.target?.result) {
                        newImages.push(ev.target.result as string);
                    }
                    processed++;
                    if (processed === files.length) {
                        const newColors = [...colors];
                        newColors[index].images = [...newColors[index].images, ...newImages];
                        newColors[index].imageFiles = newFiles;
                        setColors(newColors);
                    }
                };
                reader.readAsDataURL(file);
            });
        }
    };

    const removeColorImage = (colorIndex: number, imageIndex: number) => {
        const newColors = [...colors];
        // We only remove the visual reference for now. 
        // Complex sync with imageFiles (which file corresponds to which index) is skipped for MVP.
        // User is advised to clear all and re-upload if needed, or we accept that unused files might be uploaded.

        // Update: Try to sync if possible. 
        // Logic: Valid IDs come first, then new files.
        const existingCount = newColors[colorIndex].imageIds?.length || 0;

        if (imageIndex < existingCount) {
            // Removing an existing image
            if (newColors[colorIndex].imageIds) {
                newColors[colorIndex].imageIds = newColors[colorIndex].imageIds!.filter((_, i) => i !== imageIndex);
            }
        } else {
            // Removing a new file
            const fileIndex = imageIndex - existingCount;
            if (newColors[colorIndex].imageFiles) {
                newColors[colorIndex].imageFiles = newColors[colorIndex].imageFiles!.filter((_, i) => i !== fileIndex);
            }
        }

        newColors[colorIndex].images = newColors[colorIndex].images.filter((_, i) => i !== imageIndex);
        setColors(newColors);
    };

    const handleSave = async () => {
        if (!name || !price) {
            alert("Vui lòng nhập tên và giá sản phẩm!");
            return;
        }

        setLoading(true);
        const token = authToken || ""; // Use real token or empty for public

        // Map Category to Backend Type
        let type = 'motorcycle';
        if (category === 'Xe Đạp Điện') type = 'bicycle';
        if (category === 'Phụ Kiện') type = 'accessory';

        // 1. Handle Thumbnail Upload
        let finalThumbnailId = thumbnailId;
        if (thumbnailFile) {
            const uploadedId = await uploadFile(token, thumbnailFile);
            if (uploadedId) {
                finalThumbnailId = uploadedId;
            } else {
                alert("Lỗi khi tải ảnh đại diện lên!");
                setLoading(false);
                return;
            }
        }

        // 2. Handle Color Images Upload
        const processColors = async () => {
            return await Promise.all(colors.map(async (c) => {
                let currentImageIds = c.imageIds ? [...c.imageIds] : [];

                // Upload new files if any
                if (c.imageFiles && c.imageFiles.length > 0) {
                    for (const file of c.imageFiles) {
                        const uploadedId = await uploadFile(token, file);
                        if (uploadedId) {
                            currentImageIds.push(uploadedId);
                        }
                    }
                }

                return {
                    name: c.name,
                    hex: c.hex,
                    images: currentImageIds.length > 0 ? currentImageIds : undefined // Send array of IDs
                };
            }));
        };

        const processedColors = await processColors();

        const payload: any = {
            name,
            price: Number(price),
            type,
            brand,
            stock: Number(stock),
            isFeatured,
            specifications: [
                { label: "Vận tốc tối đa", value: speed },
                { label: "Quãng đường / lần sạc", value: range },
                { label: "Thời gian sạc", value: chargeTime },
                { label: "Trọng lượng", value: weight }
            ]
        };

        if (finalThumbnailId) {
            payload.thumbnail = finalThumbnailId;
        }

        if (processedColors.length > 0) {
            payload.color = processedColors;
        }

        let success = false;
        if (isEditMode && productId) {
            success = await updateCar(token, productId, payload);
        } else {
            success = await createCar(token, payload);
        }

        setLoading(false);

        if (success) {
            const message = isEditMode
                ? `Đã cập nhật sản phẩm "${name}" thành công!`
                : `Đã thêm sản phẩm "${name}" mới thành công!`;
            alert(message);
            router.push("/admin/products");
        } else {
            alert("Có lỗi xảy ra. Vui lòng thử lại.");
        }
    };

    return (
        <div className="max-w-4xl mx-auto space-y-6 pb-20">
            {/* Header */}
            <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                    <Link
                        href="/admin/products"
                        className="p-2 bg-white/5 rounded-full hover:bg-white/10 transition-colors"
                    >
                        <ArrowLeft className="w-5 h-5 text-white" />
                    </Link>
                    <div>
                        <h1 className="text-2xl font-bold text-white">
                            {isEditMode ? "Chỉnh Sửa Sản Phẩm" : "Thêm Sản Phẩm Mới"}
                        </h1>
                        <p className="text-sm text-muted-foreground">
                            {isEditMode ? `Cập nhật thông tin cho sản phẩm #${productId}` : "Nhập thông tin chi tiết cho xe điện mới."}
                        </p>
                    </div>
                </div>
                <button
                    onClick={handleSave}
                    disabled={loading}
                    className="px-6 py-2.5 bg-primary text-black font-bold rounded-xl hover:bg-white transition-colors flex items-center gap-2 shadow-lg shadow-primary/20 disabled:opacity-50"
                >
                    <Save className="w-4 h-4" />
                    {loading ? "Đang xử lý..." : (isEditMode ? "Cập Nhật" : "Lưu Sản Phẩm")}
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Info */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Basic Details */}
                    <div className="bg-card border border-white/10 rounded-2xl p-6 space-y-4">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="font-bold text-white">Thông Tin Cơ Bản</h2>
                            <div className="flex items-center gap-2">
                                <label className="text-sm font-bold text-gray-300">Nổi bật</label>
                                <input
                                    type="checkbox"
                                    checked={isFeatured}
                                    onChange={(e) => setIsFeatured(e.target.checked)}
                                    className="w-5 h-5 accent-primary"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-bold text-gray-300">Tên sản phẩm</label>
                            <input
                                type="text"
                                placeholder="Ví dụ: Xe Máy Điện Yadea G5"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary transition-colors"
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-gray-300">Giá Bán (VNĐ)</label>
                                <input
                                    type="number"
                                    placeholder="0"
                                    value={price}
                                    onChange={(e) => setPrice(e.target.value)}
                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary transition-colors"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-gray-300">Giá Khuyến Mãi (Nếu có)</label>
                                <input
                                    type="number"
                                    placeholder="0"
                                    value={salePrice}
                                    onChange={(e) => setSalePrice(e.target.value)}
                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary transition-colors"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-bold text-gray-300">Mô Tả Ngắn</label>
                            <textarea
                                rows={3}
                                placeholder="Mô tả các tính năng nổi bật..."
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary transition-colors resize-none"
                            />
                        </div>
                    </div>

                    {/* Color Management */}
                    <div className="bg-card border border-white/10 rounded-2xl p-6 space-y-4">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="font-bold text-white">Quản Lý Màu Sắc</h2>
                            <button
                                onClick={addColor}
                                className="px-3 py-1 bg-white/5 hover:bg-white/10 text-xs rounded-lg border border-white/10 flex items-center gap-1 transition-colors"
                            >
                                <Plus className="w-3 h-3" /> Thêm Màu
                            </button>
                        </div>

                        <div className="space-y-6">
                            {colors.map((color, index) => (
                                <div key={index} className="p-4 bg-white/5 rounded-xl border border-white/5 space-y-4 relative group">
                                    <button
                                        onClick={() => removeColor(index)}
                                        className="absolute top-2 right-2 p-1 text-red-400 hover:text-red-300 opacity-0 group-hover:opacity-100 transition-opacity"
                                        title="Xóa màu này"
                                    >
                                        <X className="w-4 h-4" />
                                    </button>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <label className="text-xs text-gray-400">Tên Màu</label>
                                            <input
                                                type="text"
                                                placeholder="Ví dụ: Đỏ Đô"
                                                value={color.name}
                                                onChange={(e) => updateColor(index, 'name', e.target.value)}
                                                className="w-full bg-black/20 border border-white/10 rounded-lg px-3 py-2 text-white text-sm"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-xs text-gray-400">Mã Màu (Hex)</label>
                                            <div className="flex gap-2">
                                                <input
                                                    type="color"
                                                    value={color.hex}
                                                    onChange={(e) => updateColor(index, 'hex', e.target.value)}
                                                    className="w-10 h-9 p-0 bg-transparent border-0 rounded cursor-pointer"
                                                />
                                                <input
                                                    type="text"
                                                    placeholder="#FF0000"
                                                    value={color.hex}
                                                    onChange={(e) => updateColor(index, 'hex', e.target.value)}
                                                    className="flex-1 bg-black/20 border border-white/10 rounded-lg px-3 py-2 text-white text-sm uppercase"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-xs text-gray-400">Hình Ảnh ({color.images.length})</label>
                                        <div className="flex gap-2 overflow-x-auto pb-2">
                                            {color.images.map((img, imgIdx) => (
                                                <div key={imgIdx} className="w-16 h-16 flex-shrink-0 relative rounded-lg overflow-hidden group/img">
                                                    <img src={img} alt="" className="w-full h-full object-cover" />
                                                    <button
                                                        onClick={() => removeColorImage(index, imgIdx)}
                                                        className="absolute top-0 right-0 p-0.5 bg-red-500 text-white opacity-0 group-hover/img:opacity-100 transition-opacity"
                                                    >
                                                        <X className="w-3 h-3" />
                                                    </button>
                                                </div>
                                            ))}
                                            <label className="w-16 h-16 flex-shrink-0 flex items-center justify-center border border-dashed border-white/20 rounded-lg cursor-pointer hover:border-primary hover:text-primary transition-colors">
                                                <Upload className="w-4 h-4" />
                                                <input
                                                    type="file"
                                                    className="hidden"
                                                    accept="image/*"
                                                    multiple
                                                    onChange={(e) => handleColorImageUpload(index, e)}
                                                />
                                            </label>
                                        </div>
                                    </div>
                                </div>
                            ))}
                            {colors.length === 0 && (
                                <div className="text-center text-muted-foreground text-sm py-4 border border-dashed border-white/10 rounded-xl">
                                    Chưa có màu sắc nào. Nhấn "Thêm Màu" để bắt đầu.
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Specifications */}
                    <div className="bg-card border border-white/10 rounded-2xl p-6 space-y-4">
                        <h2 className="font-bold text-white mb-4">Thông Số Kỹ Thuật</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-sm text-gray-400">Vận tốc tối đa</label>
                                <input
                                    type="text"
                                    placeholder="50 km/h"
                                    value={speed}
                                    onChange={(e) => setSpeed(e.target.value)}
                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-white focus:outline-none focus:border-primary transition-colors text-sm"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm text-gray-400">Quãng đường / lần sạc</label>
                                <input
                                    type="text"
                                    placeholder="80 km"
                                    value={range}
                                    onChange={(e) => setRange(e.target.value)}
                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-white focus:outline-none focus:border-primary transition-colors text-sm"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm text-gray-400">Thời gian sạc</label>
                                <input
                                    type="text"
                                    placeholder="6-8 giờ"
                                    value={chargeTime}
                                    onChange={(e) => setChargeTime(e.target.value)}
                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-white focus:outline-none focus:border-primary transition-colors text-sm"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm text-gray-400">Trọng lượng</label>
                                <input
                                    type="text"
                                    placeholder="90 kg"
                                    value={weight}
                                    onChange={(e) => setWeight(e.target.value)}
                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-white focus:outline-none focus:border-primary transition-colors text-sm"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Sidebar: Images & Status */}
                <div className="lg:col-span-1 space-y-6">
                    <div className="bg-card border border-white/10 rounded-2xl p-6 space-y-4">
                        <h2 className="font-bold text-white">Hình Ảnh</h2>
                        <p className="text-xs text-muted-foreground">Chỉ chọn 1 ảnh đại diện cho danh sách.</p>

                        {/* Image Preview Grid */}
                        <div className="grid grid-cols-2 gap-2">
                            {images.map((img, idx) => (
                                <div key={idx} className="relative aspect-square rounded-lg overflow-hidden group">
                                    <img src={img} alt="Preview" className="w-full h-full object-cover" />
                                    <button
                                        onClick={() => removeImage(idx)}
                                        className="absolute top-1 right-1 p-1 bg-red-500 rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity"
                                    >
                                        <X className="w-3 h-3" />
                                    </button>
                                </div>
                            ))}
                        </div>

                        {/* Upload Button */}
                        <label className="flex flex-col items-center justify-center w-full aspect-square border-2 border-dashed border-white/20 rounded-xl cursor-pointer hover:border-primary hover:bg-primary/5 transition-all group gap-2">
                            <div className="p-3 bg-white/5 rounded-full group-hover:scale-110 transition-transform">
                                <Upload className="w-6 h-6 text-gray-400 group-hover:text-primary" />
                            </div>
                            <span className="text-xs text-muted-foreground group-hover:text-white">Tải ảnh đại diện</span>
                            <input type="file" className="hidden" onChange={handleImageUpload} accept="image/*" />
                        </label>
                    </div>

                    <div className="bg-card border border-white/10 rounded-2xl p-6 space-y-4">
                        <h2 className="font-bold text-white">Phân Loại</h2>

                        <div className="space-y-2">
                            <label className="text-sm font-bold text-gray-300">Danh Mục</label>
                            <select
                                value={category}
                                onChange={(e) => setCategory(e.target.value)}
                                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary transition-colors appearance-none"
                            >
                                <option value="">-- Chọn Danh Mục --</option>
                                <option value="Xe Máy Điện">Xe Máy Điện</option>
                                <option value="Xe Đạp Điện">Xe Đạp Điện</option>
                                <option value="Phụ Kiện">Phụ Kiện</option>
                            </select>
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-gray-300">Thương Hiệu</label>
                            <select
                                value={brand}
                                onChange={(e) => setBrand(e.target.value)}
                                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary transition-colors appearance-none"
                            >
                                <option value="">-- Chọn Thương Hiệu --</option>
                                <option value="Yadea">Yadea</option>
                                <option value="VinFast">VinFast</option>
                                <option value="DK Bike">DK Bike</option>
                                <option value="Pega">Pega</option>
                            </select>
                        </div>

                        <div className="space-y-2 pt-2 border-t border-white/10">
                            <label className="text-sm font-bold text-gray-300">Tồn Kho</label>
                            <input
                                type="number"
                                placeholder="100"
                                value={stock}
                                onChange={(e) => setStock(e.target.value)}
                                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary transition-colors"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function NewProductPage() {
    return (
        <Suspense fallback={<div className="text-white">Đang tải...</div>}>
            <ProductForm />
        </Suspense>
    );
}
