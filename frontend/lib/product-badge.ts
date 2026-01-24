/**
 * Product Badge Logic - Dynamic Badge System
 * Tự động tính toán badge dựa trên dữ liệu thực tế
 */

export type BadgeType = 'HOT' | 'NEW' | 'SALE' | 'BESTSELLER' | 'TOP_RATED' | null;

export interface ProductBadgeData {
  type: BadgeType;
  label: string;
  color: string;
  bgColor: string;
  priority: number; // Càng cao càng ưu tiên hiển thị
}

export interface ProductMetrics {
  salesCount?: number; // Số lượng đã bán
  viewCount?: number; // Lượt xem
  rating?: number; // Đánh giá (0-5)
  reviewCount?: number; // Số lượt review
  createdAt?: string | Date; // Ngày tạo
  discount?: number; // % giảm giá
  isFeatured?: boolean; // Admin đánh dấu nổi bật
  originalPrice?: number; // Giá gốc
  currentPrice?: number; // Giá hiện tại
  forceNew?: boolean; // Ép buộc hiển thị badge NEW
  forceBestSeller?: boolean; // Ép buộc hiển thị badge BESTSELLER
}

/**
 * Tính toán badge cho sản phẩm dựa trên các tiêu chí thực tế
 * Priority: HOT > BESTSELLER > NEW > SALE > TOP_RATED
 */
export function calculateProductBadge(metrics: ProductMetrics): ProductBadgeData | null {
  const badges: ProductBadgeData[] = [];

  // 1. HOT - Sản phẩm được admin đánh dấu nổi bật (highest priority)
  if (metrics.isFeatured) {
    badges.push({
      type: 'HOT',
      label: 'HOT',
      color: '#FFFFFF',
      bgColor: '#EF4444', // Red-500 for HOT
      priority: 100,
    });
  }

  // 2. BESTSELLER - Bán chạy (>50 đơn hoặc top 20% sản phẩm)
  if (metrics.forceBestSeller || (metrics.salesCount && metrics.salesCount >= 50)) {
    badges.push({
      type: 'BESTSELLER',
      label: 'BÁN CHẠY',
      color: '#FFFFFF',
      bgColor: '#F59E0B', // amber-500
      priority: 90,
    });
  }

  // 3. NEW - Sản phẩm mới (trong 30 ngày)
  let isNew = false;
  if (metrics.forceNew) {
    isNew = true;
  } else if (metrics.createdAt) {
    const createdDate = new Date(metrics.createdAt);
    const now = new Date();
    const daysDiff = (now.getTime() - createdDate.getTime()) / (1000 * 60 * 60 * 24);
    if (daysDiff <= 30) isNew = true;
  }

  if (isNew) {
    badges.push({
      type: 'NEW',
      label: 'MỚI',
      color: '#FFFFFF',
      bgColor: '#3B82F6', // blue-500
      priority: 80,
    });
  }

  // 4. SALE - Đang giảm giá (>10%)
  const discountPercent = metrics.discount || 
    (metrics.originalPrice && metrics.currentPrice 
      ? ((metrics.originalPrice - metrics.currentPrice) / metrics.originalPrice * 100)
      : 0);

  if (discountPercent >= 10) {
    badges.push({
      type: 'SALE',
      label: `-${Math.round(discountPercent)}%`,
      color: '#FFFFFF',
      bgColor: '#EF4444', // red-500 - Đỏ cho giảm giá
      priority: 70,
    });
  }

  // 5. TOP_RATED - Đánh giá cao (>=4.5 sao và >=10 reviews)
  if (metrics.rating && metrics.rating >= 4.5 && metrics.reviewCount && metrics.reviewCount >= 10) {
    badges.push({
      type: 'TOP_RATED',
      label: '⭐ ' + metrics.rating.toFixed(1),
      color: '#FFFFFF',
      bgColor: '#8B5CF6', // purple-500
      priority: 60,
    });
  }

  // Trả về badge có priority cao nhất
  if (badges.length === 0) return null;
  
  badges.sort((a, b) => b.priority - a.priority);
  return badges[0];
}

/**
 * Get badge for display - Simplified version
 */
export function getProductBadge(product: any): ProductBadgeData | null {
  const metrics: ProductMetrics = {
    salesCount: product.salesCount || product.sold || 0,
    viewCount: product.viewCount || product.views || 0,
    rating: product.rating || product.averageRating || 0,
    reviewCount: product.reviewCount || product.reviews?.length || 0,
    createdAt: product.createdAt || product.publishedAt || product.created_at,
    discount: product.discount,
    isFeatured: product.isFeatured || product.featured || false,
    originalPrice: product.originalPrice || product.comparePrice,
    currentPrice: product.price || product.currentPrice,
    forceNew: product.forceNew || product.isNewArrival,
    forceBestSeller: product.forceBestSeller || product.isBestSeller,
  };

  return calculateProductBadge(metrics);
}

/**
 * Get multiple badges (for detailed product page)
 */
export function getAllProductBadges(metrics: ProductMetrics): ProductBadgeData[] {
  const badges: ProductBadgeData[] = [];

  if (metrics.isFeatured) {
    badges.push({
      type: 'HOT',
      label: 'HOT',
      color: '#FFFFFF',
      bgColor: '#EF4444',
      priority: 100,
    });
  }

  if (metrics.forceBestSeller || (metrics.salesCount && metrics.salesCount >= 50)) {
    badges.push({
      type: 'BESTSELLER',
      label: 'BÁN CHẠY',
      color: '#FFFFFF',
      bgColor: '#F59E0B',
      priority: 90,
    });
  }

  let isNew = false;
  if (metrics.forceNew) {
    isNew = true;
  } else if (metrics.createdAt) {
    const createdDate = new Date(metrics.createdAt);
    const now = new Date();
    const daysDiff = (now.getTime() - createdDate.getTime()) / (1000 * 60 * 60 * 24);
    if (daysDiff <= 30) isNew = true;
  }

  if (isNew) {
    badges.push({
      type: 'NEW',
      label: 'MỚI',
      color: '#FFFFFF',
      bgColor: '#3B82F6',
      priority: 80,
    });
  }

  const discountPercent = metrics.discount || 
    (metrics.originalPrice && metrics.currentPrice 
      ? ((metrics.originalPrice - metrics.currentPrice) / metrics.originalPrice * 100)
      : 0);

  if (discountPercent >= 10) {
    badges.push({
      type: 'SALE',
      label: `-${Math.round(discountPercent)}%`,
      color: '#FFFFFF',
      bgColor: '#10B981',
      priority: 70,
    });
  }

  if (metrics.rating && metrics.rating >= 4.5 && metrics.reviewCount && metrics.reviewCount >= 10) {
    badges.push({
      type: 'TOP_RATED',
      label: '⭐ ' + metrics.rating.toFixed(1),
      color: '#FFFFFF',
      bgColor: '#8B5CF6',
      priority: 60,
    });
  }

  return badges.sort((a, b) => b.priority - a.priority);
}

/**
 * Format badge thresholds for documentation
 */
export const BADGE_CRITERIA = {
  HOT: 'Admin đánh dấu nổi bật (isFeatured)',
  BESTSELLER: 'Đã bán ≥ 50 sản phẩm',
  NEW: 'Ra mắt trong vòng 30 ngày',
  SALE: 'Giảm giá ≥ 10%',
  TOP_RATED: 'Rating ≥ 4.5 sao và ≥ 10 đánh giá',
} as const;
