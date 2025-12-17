"use client";

import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowLeft, Save, MapPin, Trash2, Plus } from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { createShowroom, updateShowroom, getShowroomsAdmin, uploadFile } from "@/lib/api";

function ShowroomForm() {
    const router = useRouter();
    const { token } = useAuth();
    const searchParams = useSearchParams();
    const documentId = searchParams.get("id"); // Using documentId for V5
    const isEditMode = !!documentId;

    const [loading, setLoading] = useState(false);

    // Form State
    const [name, setName] = useState("");
    const [address, setAddress] = useState("");
    const [city, setCity] = useState("Hà Nội");
    const [district, setDistrict] = useState("");
    const [phone, setPhone] = useState("");
    const [email, setEmail] = useState("");
    const [manager, setManager] = useState("");
    const [workingHours, setWorkingHours] = useState("8:00 - 20:00 (T2 - CN)");
    const [latitude, setLatitude] = useState("");
    const [longitude, setLongitude] = useState("");
    const [isActive, setIsActive] = useState(true);

    // Image State
    const [previewImages, setPreviewImages] = useState<string[]>([]);
    const [imageFiles, setImageFiles] = useState<File[]>([]);
    const [existingImageIds, setExistingImageIds] = useState<number[]>([]);

    // Load Data for Edit
    useEffect(() => {
        if (isEditMode && token) {
            async function fetchShowroom() {
                // Since we don't have a getShowroomById in API yet, we can filter from list or fetch single
                // For efficiency/time, we'll re-use the list fetch and find. 
                // Better approach would be adding getShowroomById(id) later.
                const list = await getShowroomsAdmin(token!);
                const found = list.find(s => s.documentId === documentId);

                if (found) {
                    setName(found.Name || "");
                    setAddress(found.Address || "");
                    setCity(found.City || "Hà Nội");
                    setDistrict(found.District || "");
                    setPhone(found.Phone || "");
                    setEmail(found.Email || "");
                    setManager(found.Manager || "");

                    // Simple working hours text handling
                    const wh = found.WorkingHours;
                    if (typeof wh === 'string') setWorkingHours(wh);
                    else if (wh?.monday) setWorkingHours(wh?.monday);

                    setLatitude(found.Latitude || "");
                    setLongitude(found.Longitude || "");
                    setIsActive(found.IsActive !== false);

                    // Load Images
                    if (found.Images && Array.isArray(found.Images)) {
                        setPreviewImages(found.Images.map((img: any) => img.url.startsWith('http') ? img.url : `${process.env.NEXT_PUBLIC_STRAPI_URL}${img.url}`));
                        setExistingImageIds(found.Images.map((img: any) => img.id));
                    }
                }
            }
            fetchShowroom();
        }
    }, [isEditMode, token, documentId]);

    const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            const files = Array.from(e.target.files);
            setImageFiles(prev => [...prev, ...files]);

            // Create Previews
            files.forEach(file => {
                const reader = new FileReader();
                reader.onload = (ev) => {
                    if (ev.target?.result) {
                        setPreviewImages(prev => [...prev, ev.target!.result as string]);
                    }
                };
                reader.readAsDataURL(file);
            });
        }
    };

    const handleRemoveImage = (index: number) => {
        setPreviewImages(prev => prev.filter((_, i) => i !== index));
        // Logic to remove from existing IDs or new Files is tricky with mixed array.
        // Simplification: We assume user removes from the visual list.
        // If index < existingImageIds.length -> It's an existing image
        if (index < existingImageIds.length) {
            setExistingImageIds(prev => prev.filter((_, i) => i !== index));
        } else {
            // It's a new file
            const newFileIndex = index - existingImageIds.length;
            setImageFiles(prev => prev.filter((_, i) => i !== newFileIndex));
        }
    };

    const handleSave = async () => {
        if (!name || !address) {
            alert("Vui lòng nhập Tên và Địa chỉ cửa hàng!");
            return;
        }

        setLoading(true);

        // Upload new images first
        let finalImageIds = [...existingImageIds];
        if (imageFiles.length > 0) {
            for (const file of imageFiles) {
                const uploadedId = await uploadFile(token!, file);
                if (uploadedId) {
                    finalImageIds.push(uploadedId);
                } else {
                    alert("Lỗi khi tải ảnh lên! Vui lòng thử lại.");
                    setLoading(false);
                    return;
                }
            }
        }

        const payload: any = {
            Name: name,
            Address: address,
            City: city,
            District: district.trim() || undefined,
            Phone: phone.trim() || undefined,
            Email: email.trim() || undefined,
            Manager: manager.trim() || undefined,
            Latitude: latitude ? parseFloat(latitude) : undefined,
            Longitude: longitude ? parseFloat(longitude) : undefined,
            WorkingHours: { monday: workingHours }, // Simplified structure match
            IsActive: isActive,
            Images: finalImageIds // Send IDs
        };

        let success = false;
        if (isEditMode && documentId) {
            success = await updateShowroom(token!, documentId, payload);
        } else {
            success = await createShowroom(token!, payload);
        }

        setLoading(false);
        if (success) {
            alert(isEditMode ? "Cập nhật thành công!" : "Thêm cửa hàng thành công!");
            router.push("/admin/showrooms");
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
                        href="/admin/showrooms"
                        className="p-2 bg-white/5 rounded-full hover:bg-white/10 transition-colors"
                    >
                        <ArrowLeft className="w-5 h-5 text-white" />
                    </Link>
                    <div>
                        <h1 className="text-2xl font-bold text-white">
                            {isEditMode ? "Chỉnh Sửa Cửa Hàng" : "Thêm Cửa Hàng Mới"}
                        </h1>
                        <p className="text-sm text-muted-foreground">
                            {isEditMode ? "Cập nhật thông tin chi nhánh." : "Mở rộng hệ thống phân phối."}
                        </p>
                    </div>
                </div >
                <button
                    onClick={handleSave}
                    disabled={loading}
                    className="px-6 py-2.5 bg-primary text-black font-bold rounded-xl hover:bg-white transition-colors flex items-center gap-2 shadow-lg shadow-primary/20 disabled:opacity-50"
                >
                    <Save className="w-4 h-4" />
                    {loading ? "Đang xử lý..." : "Lưu Thay Đổi"}
                </button>
            </div >

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Image Upload Section */}
                <div className="md:col-span-2 bg-card border border-white/10 rounded-2xl p-6">
                    <h2 className="font-bold text-white mb-4">Hình Ảnh Cửa Hàng</h2>
                    <div className="grid grid-cols-4 gap-4">
                        {previewImages.map((src, idx) => (
                            <div key={idx} className="relative aspect-square rounded-xl overflow-hidden border border-white/10 group">
                                <img src={src} alt="Showroom" className="w-full h-full object-cover" />
                                <button
                                    onClick={() => handleRemoveImage(idx)}
                                    className="absolute top-1 right-1 p-1 bg-red-500 rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity"
                                >
                                    <Trash2 className="w-3 h-3" />
                                </button>
                            </div>
                        ))}
                        <label className="aspect-square rounded-xl border-2 border-dashed border-white/10 flex flex-col items-center justify-center cursor-pointer hover:border-primary/50 hover:bg-white/5 transition-all">
                            <Plus className="w-8 h-8 text-muted-foreground mb-2" />
                            <span className="text-xs text-muted-foreground">Thêm ảnh</span>
                            <input type="file" multiple accept="image/*" onChange={handleImageSelect} className="hidden" />
                        </label>
                    </div>
                </div>

                {/* Main Info */}
                <div className="bg-card border border-white/10 rounded-2xl p-6 space-y-4">
                    <div className="flex justify-between items-center mb-2">
                        <h2 className="font-bold text-white">Thông Tin Chung</h2>
                        <label className="flex items-center gap-2 cursor-pointer">
                            <input
                                type="checkbox"
                                checked={isActive}
                                onChange={(e) => setIsActive(e.target.checked)}
                                className="w-5 h-5 accent-green-500"
                            />
                            <span className={`text-sm font-bold ${isActive ? 'text-green-400' : 'text-gray-500'}`}>
                                {isActive ? 'Đang hoạt động' : 'Tạm đóng'}
                            </span>
                        </label>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-bold text-gray-300">Tên Cửa Hàng <span className="text-red-500">*</span></label>
                        <input
                            type="text"
                            placeholder="Ví dụ: Showroom Cầu Giấy"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary transition-colors"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-bold text-gray-300">Quản Lý</label>
                        <input
                            type="text"
                            placeholder="Tên người quản lý"
                            value={manager}
                            onChange={(e) => setManager(e.target.value)}
                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary transition-colors"
                        />
                    </div>
                </div>

                {/* Contact & Location */}
                <div className="bg-card border border-white/10 rounded-2xl p-6 space-y-4">
                    <h2 className="font-bold text-white mb-2">Liên Hệ & Vị Trí</h2>

                    <div className="space-y-2">
                        <label className="text-sm font-bold text-gray-300">Địa Chỉ <span className="text-red-500">*</span></label>
                        <input
                            type="text"
                            placeholder="Số nhà, tên đường..."
                            value={address}
                            onChange={(e) => setAddress(e.target.value)}
                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary transition-colors"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-gray-300">Khu Vực</label>
                            <select
                                value={city}
                                onChange={(e) => setCity(e.target.value)}
                                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary transition-colors appearance-none"
                            >
                                <option value="Hà Nội">Hà Nội</option>
                                <option value="Hồ Chí Minh">TP. Hồ Chí Minh</option>
                                <option value="Đà Nẵng">Đà Nẵng</option>
                                <option value="Hải Phòng">Hải Phòng</option>
                                <option value="Cần Thơ">Cần Thơ</option>
                                <option value="Khác">Khác</option>
                            </select>
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-gray-300">Quận / Huyện</label>
                            <input
                                type="text"
                                placeholder="Cầu Giấy"
                                value={district}
                                onChange={(e) => setDistrict(e.target.value)}
                                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary transition-colors"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-gray-300">Số Điện Thoại</label>
                            <input
                                type="text"
                                placeholder="0987..."
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary transition-colors"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-gray-300">Giờ Làm Việc</label>
                            <input
                                type="text"
                                placeholder="8:00 - 17:30"
                                value={workingHours}
                                onChange={(e) => setWorkingHours(e.target.value)}
                                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary transition-colors"
                            />
                        </div>
                    </div>

                    <div className="pt-4 border-t border-white/10">
                        <div className="flex items-center justify-between mb-2">
                            <label className="text-sm font-bold text-gray-300 flex items-center gap-2">
                                <MapPin className="w-4 h-4 text-primary" />
                                Tọa Độ Bản Đồ
                            </label>
                            <a
                                href="https://www.google.com/maps"
                                target="_blank"
                                className="text-xs text-blue-400 hover:underline"
                            >
                                Lấy tọa độ từ Google Maps?
                            </a>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <input
                                type="text"
                                placeholder="Latitude (Vĩ độ)"
                                value={latitude}
                                onChange={(e) => setLatitude(e.target.value)}
                                className="bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-white text-sm"
                            />
                            <input
                                type="text"
                                placeholder="Longitude (Kinh độ)"
                                value={longitude}
                                onChange={(e) => setLongitude(e.target.value)}
                                className="bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-white text-sm"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function NewShowroomPage() {
    return (
        <Suspense fallback={<div className="text-white">Đang tải...</div>}>
            <ShowroomForm />
        </Suspense>
    );
}
