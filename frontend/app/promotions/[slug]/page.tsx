import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getCars, getPromotions, Car } from '@/lib/api';
import ProductCard from '@/components/product/ProductCard';
import { Clock, Tag, Percent } from 'lucide-react';

interface PromotionPageProps {
  params: { slug: string };
}

export async function generateMetadata({ params }: PromotionPageProps): Promise<Metadata> {
  const promotions = await getPromotions();
  const promotion = promotions.find(p => 
    p.link.includes(params.slug) || 
    p.title.toLowerCase().replace(/\s+/g, '-').includes(params.slug)
  );

  if (!promotion) {
    return {
      title: 'Khuyến mãi không tồn tại',
    };
  }

  return {
    title: `${promotion.title} | Xe Điện Đức Duy`,
    description: promotion.description || `Khuyến mãi ${promotion.discountTag}`,
  };
}

export default async function PromotionPage({ params }: PromotionPageProps) {
  const promotions = await getPromotions();
  const promotion = promotions.find(p => 
    p.link.includes(params.slug) || 
    p.title.toLowerCase().replace(/\s+/g, '-').includes(params.slug)
  );

  if (!promotion) {
    notFound();
  }

  // Get products with this promotion
  const allCars = await getCars({ pageSize: 100 });
  
  // Filter products that have this promotion
  // If promotion has car_models, use that, otherwise show featured cars
  const promotionProducts = promotion.car_models && promotion.car_models.length > 0
    ? allCars.filter((car: Car) => 
        promotion.car_models!.some((pm: any) => 
          pm.id === car.id || pm.slug === car.slug || pm.documentId === car.documentId
        )
      )
    : allCars.filter((car: Car) => car.isFeatured).slice(0, 8);

  const expiryDate = promotion.expiryDate ? new Date(promotion.expiryDate) : null;
  const isExpired = expiryDate ? expiryDate < new Date() : false;

  return (
    <main className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-12">
        {/* Promotion Header */}
        <div className="max-w-4xl mx-auto mb-12">
          <div className="bg-card border border-white/10 rounded-3xl overflow-hidden">
            {/* Banner Image */}
            {promotion.image && (
              <div className="relative h-64 md:h-96">
                <img
                  src={promotion.image}
                  alt={promotion.title}
                  className="w-full h-full object-cover"
                />
                {isExpired && (
                  <div className="absolute inset-0 bg-black/70 flex items-center justify-center">
                    <div className="text-center">
                      <div className="text-4xl font-bold text-red-500 mb-2">HẾT HẠN</div>
                      <div className="text-white">Chương trình đã kết thúc</div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Promotion Info */}
            <div className="p-8">
              <div className="flex flex-wrap items-center gap-3 mb-4">
                {promotion.discountTag && (
                  <div className="px-4 py-2 bg-primary rounded-full text-black font-bold flex items-center gap-2">
                    <Percent className="w-5 h-5" />
                    {promotion.discountTag}
                  </div>
                )}
              </div>

              <h1 className="text-4xl font-bold text-white mb-4">{promotion.title}</h1>
              
              {promotion.description && (
                <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
                  {promotion.description}
                </p>
              )}

              {/* Expiry Info */}
              {expiryDate && !isExpired && (
                <div className="flex items-center gap-3 p-4 bg-orange-500/10 border border-orange-500/20 rounded-xl">
                  <Clock className="w-5 h-5 text-orange-400" />
                  <div>
                    <div className="text-sm text-orange-300 font-semibold">Thời gian còn lại</div>
                    <div className="text-orange-100">
                      Đến {expiryDate.toLocaleDateString('vi-VN', {
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Products with Promotion */}
        <div>
          <h2 className="text-2xl font-bold text-white mb-6">
            {promotionProducts.length > 0
              ? `Sản phẩm áp dụng (${promotionProducts.length})`
              : 'Sản phẩm áp dụng'}
          </h2>

          {promotionProducts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {promotionProducts.map((car: Car) => (
                <ProductCard key={car.id} car={car} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-card border border-white/10 rounded-2xl">
              <p className="text-muted-foreground">
                Chưa có sản phẩm áp dụng khuyến mãi này
              </p>
            </div>
          )}
        </div>

        {/* Additional Info */}
        <div className="mt-12 bg-blue-500/10 border border-blue-500/20 rounded-2xl p-6">
          <h3 className="text-lg font-bold text-blue-300 mb-3">📝 Điều kiện áp dụng:</h3>
          <ul className="space-y-2 text-blue-200 text-sm">
            <li>• Chương trình áp dụng cho tất cả sản phẩm có gắn mã khuyến mãi</li>
            <li>• Không áp dụng đồng thời với các chương trình khuyến mãi khác</li>
            <li>• Liên hệ hotline 1900 XXXX để được tư vấn chi tiết</li>
            {promotion.discountTag && <li>• Ưu đãi: <strong>{promotion.discountTag}</strong></li>}
          </ul>
        </div>
      </div>
    </main>
  );
}
