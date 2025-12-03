import { getAccessoryBySlug } from "@/lib/api";
import Link from "next/link";
import Image from "next/image";
import { ShoppingCart, Check, ArrowLeft } from "lucide-react";
import { notFound } from "next/navigation";

export const dynamic = 'force-dynamic';

interface PageProps {
    params: Promise<{
        slug: string;
    }>
}

export default async function AccessoryDetailPage({ params }: PageProps) {
    const { slug } = await params;
    const accessory = await getAccessoryBySlug(slug);

    if (!accessory) {
        notFound();
    }

    return (
        <main className="min-h-screen bg-background pt-24 pb-20">
            {/* Breadcrumb */}
            <div className="container mx-auto px-6 mb-8">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Link href="/" className="hover:text-primary transition-colors">Trang Chủ</Link>
                    <span>/</span>
                    <Link href="/accessories" className="hover:text-primary transition-colors">Phụ Kiện</Link>
                    <span>/</span>
                    <span className="text-white line-clamp-1">{accessory.name}</span>
                </div>
            </div>

            <div className="container mx-auto px-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                    {/* Image Section */}
                    <div className="relative aspect-square bg-card/30 rounded-3xl overflow-hidden border border-white/5">
                        <Image
                            src={accessory.image}
                            alt={accessory.name}
                            fill
                            className="object-cover"
                            priority
                        />
                        {accessory.isFeatured && (
                            <div className="absolute top-4 left-4 px-4 py-1.5 bg-red-500 text-white text-sm font-bold rounded-full shadow-lg">
                                Hot
                            </div>
                        )}
                    </div>

                    {/* Info Section */}
                    <div>
                        <div className="mb-6">
                            <div className="text-sm text-primary font-bold mb-2 uppercase tracking-wider">
                                {accessory.category === 'battery' ? 'Pin & Sạc' :
                                    accessory.category === 'helmet' ? 'Mũ Bảo Hiểm' : 'Phụ Kiện'}
                            </div>
                            <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
                                {accessory.name}
                            </h1>
                            <div className="text-3xl font-bold text-primary">
                                {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(accessory.price)}
                            </div>
                        </div>

                        <div className="prose prose-invert max-w-none mb-8">
                            <p>{accessory.description}</p>
                        </div>

                        {/* Actions */}
                        <div className="flex flex-col sm:flex-row gap-4 mb-8">
                            <button className="flex-1 bg-primary text-black font-bold py-4 rounded-xl hover:bg-white transition-all flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(0,255,148,0.3)]">
                                <ShoppingCart className="w-5 h-5" />
                                Thêm Vào Giỏ
                            </button>
                            <button className="flex-1 bg-white/10 text-white font-bold py-4 rounded-xl hover:bg-white/20 transition-all border border-white/10">
                                Mua Ngay
                            </button>
                        </div>

                        {/* Features/Policy */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="flex items-center gap-3 p-4 bg-card/30 rounded-xl border border-white/5">
                                <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary">
                                    <Check className="w-5 h-5" />
                                </div>
                                <div className="text-sm">
                                    <div className="font-bold text-white">Chính Hãng 100%</div>
                                    <div className="text-muted-foreground">Bảo hành đầy đủ</div>
                                </div>
                            </div>
                            <div className="flex items-center gap-3 p-4 bg-card/30 rounded-xl border border-white/5">
                                <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary">
                                    <Check className="w-5 h-5" />
                                </div>
                                <div className="text-sm">
                                    <div className="font-bold text-white">Giao Hàng Nhanh</div>
                                    <div className="text-muted-foreground">Toàn quốc 2-4 ngày</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}
