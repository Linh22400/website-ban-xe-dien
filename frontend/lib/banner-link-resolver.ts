/**
 * Banner Link Resolver - Tự động hóa link cho banner
 * Xử lý các loại banner và tự động generate link phù hợp
 */

export type BannerLinkType = 
  | 'promotion'      // Link đến khuyến mãi (danh sách SP có KM)
  | 'product'        // Link đến trang chi tiết sản phẩm
  | 'blog'           // Link đến bài viết tin tức
  | 'category'       // Link đến danh mục sản phẩm
  | 'custom'         // Custom URL
  | 'form'           // Form đăng ký/liên hệ
  | 'collection';    // Bộ sưu tập (VD: xe mới, xe HOT)

export interface BannerLink {
  type: BannerLinkType;
  target: string; // ID, slug, hoặc URL tùy theo type
  label?: string; // Label hiển thị cho user
}

/**
 * Resolve banner link từ type + target
 */
export function resolveBannerLink(link: BannerLink): string {
  const { type, target } = link;

  switch (type) {
    case 'promotion':
      // Target = promotion ID hoặc slug
      // VD: target = "khuyen-mai-tet-2026"
      return `/promotions/${target}`;

    case 'product':
      // Target = product slug
      // VD: target = "tailg-xmen-plus"
      return `/cars/${target}`;

    case 'blog':
      // Target = blog slug
      // VD: target = "xe-dien-tailg-co-tot-khong"
      return `/blog/${target}`;

    case 'category':
      // Target = category filter
      // VD: target = "type=motorcycle&brand=TAILG"
      return `/cars?${target}`;

    case 'collection':
      // Target = collection slug
      // VD: target = "xe-moi-2026", "xe-ban-chay", "xe-gia-re"
      return `/cars?collection=${target}`;

    case 'form':
      // Target = form type
      // VD: target = "lai-thu", "tu-van", "lien-he"
      if (target === 'lai-thu') return '/lai-thu';
      if (target === 'tu-van') return '/contact?type=consultation';
      if (target === 'lien-he') return '/contact';
      return '/contact';

    case 'custom':
      // Target = full URL or path
      return target;

    default:
      return '/';
  }
}

/**
 * Get banner link label cho Admin UI
 */
export function getBannerLinkLabel(link: BannerLink): string {
  if (link.label) return link.label;

  const { type, target } = link;

  switch (type) {
    case 'promotion':
      return `Khuyến mãi: ${target}`;
    case 'product':
      return `Sản phẩm: ${target}`;
    case 'blog':
      return `Tin tức: ${target}`;
    case 'category':
      return `Danh mục: ${target}`;
    case 'collection':
      return `Bộ sưu tập: ${target}`;
    case 'form':
      return `Form: ${target}`;
    case 'custom':
      return `Link tùy chỉnh: ${target}`;
    default:
      return target;
  }
}

/**
 * Validate banner link
 */
export function validateBannerLink(link: BannerLink): boolean {
  if (!link.type || !link.target) return false;

  switch (link.type) {
    case 'promotion':
    case 'product':
    case 'blog':
      // Slug format: chữ thường, số, dấu gạch ngang
      return /^[a-z0-9-]+$/.test(link.target);

    case 'category':
      // Query string format
      return link.target.includes('=');

    case 'collection':
      return /^[a-z0-9-]+$/.test(link.target);

    case 'form':
      return ['lai-thu', 'tu-van', 'lien-he'].includes(link.target);

    case 'custom':
      // URL or path
      return link.target.startsWith('/') || link.target.startsWith('http');

    default:
      return false;
  }
}

/**
 * Get banner link type options cho Admin UI
 */
export const BANNER_LINK_TYPE_OPTIONS = [
  { value: 'promotion', label: 'Khuyến mãi', icon: '🏷️', description: 'Link đến trang khuyến mãi' },
  { value: 'product', label: 'Sản phẩm', icon: '🚗', description: 'Link đến chi tiết xe' },
  { value: 'blog', label: 'Tin tức', icon: '📰', description: 'Link đến bài viết' },
  { value: 'category', label: 'Danh mục', icon: '📁', description: 'Lọc theo loại xe/brand' },
  { value: 'collection', label: 'Bộ sưu tập', icon: '⭐', description: 'Xe mới, xe HOT, xe bán chạy' },
  { value: 'form', label: 'Form đăng ký', icon: '📝', description: 'Lái thử, tư vấn, liên hệ' },
  { value: 'custom', label: 'Tùy chỉnh', icon: '🔗', description: 'URL/path tùy ý' },
];

/**
 * Get target input placeholder
 */
export function getTargetPlaceholder(type: BannerLinkType): string {
  switch (type) {
    case 'promotion':
      return 'VD: khuyen-mai-tet-2026';
    case 'product':
      return 'VD: tailg-xmen-plus (slug sản phẩm)';
    case 'blog':
      return 'VD: xe-dien-tailg-co-tot-khong (slug bài viết)';
    case 'category':
      return 'VD: type=motorcycle&brand=TAILG';
    case 'collection':
      return 'VD: xe-moi-2026, xe-ban-chay, xe-gia-re';
    case 'form':
      return 'Chọn: lai-thu, tu-van, lien-he';
    case 'custom':
      return 'VD: /cars hoặc https://example.com';
    default:
      return '';
  }
}

/**
 * Get suggested targets for quick select
 */
export const BANNER_QUICK_TARGETS = {
  collection: [
    { value: 'xe-moi-2026', label: 'Xe mới 2026' },
    { value: 'xe-ban-chay', label: 'Xe bán chạy' },
    { value: 'xe-gia-re', label: 'Xe giá rẻ' },
    { value: 'xe-cao-cap', label: 'Xe cao cấp' },
  ],
  category: [
    { value: 'type=motorcycle', label: 'Tất cả xe máy điện' },
    { value: 'type=bicycle', label: 'Tất cả xe đạp điện' },
    { value: 'brand=TAILG', label: 'Thương hiệu TAILG' },
    { value: 'type=motorcycle&brand=TAILG', label: 'Xe máy TAILG' },
    { value: 'price_max=15000000', label: 'Xe dưới 15 triệu' },
  ],
  form: [
    { value: 'lai-thu', label: 'Đăng ký lái thử' },
    { value: 'tu-van', label: 'Tư vấn mua xe' },
    { value: 'lien-he', label: 'Liên hệ' },
  ],
};
