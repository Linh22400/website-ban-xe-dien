'use client';

import { useState, useEffect } from 'react';
import { 
  BannerLinkType, 
  BANNER_LINK_TYPE_OPTIONS, 
  BANNER_QUICK_TARGETS,
  getTargetPlaceholder,
  resolveBannerLink,
  validateBannerLink
} from '@/lib/banner-link-resolver';
import { ExternalLink, Check, AlertCircle } from 'lucide-react';
import { useTheme } from '@/components/common/ThemeText';

interface SmartBannerLinkInputProps {
  value: string; // Current link value
  onChange: (link: string) => void;
  className?: string;
}

export default function SmartBannerLinkInput({ value, onChange, className }: SmartBannerLinkInputProps) {
  const isDark = useTheme();
  const [linkType, setLinkType] = useState<BannerLinkType>('custom');
  const [linkTarget, setLinkTarget] = useState('');
  const [resolvedLink, setResolvedLink] = useState('');
  const [isValid, setIsValid] = useState(true);

  // Parse existing link value on mount
  useEffect(() => {
    if (value) {
      // Try to detect type from URL
      if (value.includes('/promotions/')) {
        setLinkType('promotion');
        setLinkTarget(value.split('/promotions/')[1].split('?')[0]);
      } else if (value.includes('/cars/') && !value.includes('?')) {
        setLinkType('product');
        setLinkTarget(value.split('/cars/')[1].split('?')[0]);
      } else if (value.includes('/blog/')) {
        setLinkType('blog');
        setLinkTarget(value.split('/blog/')[1].split('?')[0]);
      } else if (value.includes('/cars?collection=')) {
        setLinkType('collection');
        setLinkTarget(value.split('collection=')[1].split('&')[0]);
      } else if (value.includes('/cars?')) {
        setLinkType('category');
        setLinkTarget(value.split('/cars?')[1]);
      } else if (['/lai-thu', '/contact'].includes(value) || value.includes('/contact?type=')) {
        setLinkType('form');
        if (value === '/lai-thu') setLinkTarget('lai-thu');
        else if (value.includes('consultation')) setLinkTarget('tu-van');
        else setLinkTarget('lien-he');
      } else {
        setLinkType('custom');
        setLinkTarget(value);
      }
    }
  }, []);

  // Update resolved link when type or target changes
  useEffect(() => {
    if (linkTarget.trim()) {
      const link = resolveBannerLink({ type: linkType, target: linkTarget });
      setResolvedLink(link);
      setIsValid(validateBannerLink({ type: linkType, target: linkTarget }));
      onChange(link);
    } else {
      setResolvedLink('');
      setIsValid(false);
      onChange('');
    }
  }, [linkType, linkTarget]);

  const selectedType = BANNER_LINK_TYPE_OPTIONS.find(opt => opt.value === linkType);
  const quickTargets = BANNER_QUICK_TARGETS[linkType as keyof typeof BANNER_QUICK_TARGETS];

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Link Type Selector */}
      <div>
        <label className="text-sm font-bold mb-3 block" style={{ color: isDark ? '#d1d5db' : '#374151' }}>
          Loại Link <span className="text-red-500">*</span>
        </label>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          {BANNER_LINK_TYPE_OPTIONS.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => {
                setLinkType(option.value as BannerLinkType);
                setLinkTarget('');
              }}
              className={`p-3 rounded-xl border-2 transition-all text-left`}
              style={{
                borderColor: linkType === option.value ? 'var(--primary)' : (isDark ? 'rgba(255,255,255,0.1)' : '#d1d5db'),
                backgroundColor: linkType === option.value ? 'rgba(var(--primary-rgb), 0.1)' : (isDark ? 'rgba(255,255,255,0.05)' : '#f3f4f6'),
                color: linkType === option.value ? (isDark ? '#ffffff' : '#111827') : (isDark ? '#9ca3af' : '#6b7280')
              }}
            >
              <div className="text-2xl mb-1">{option.icon}</div>
              <div className="text-xs font-bold">{option.label}</div>
            </button>
          ))}
        </div>
        {selectedType && (
          <p className="text-xs mt-2" style={{ color: isDark ? '#9ca3af' : '#6b7280' }}>
            💡 {selectedType.description}
          </p>
        )}
      </div>

      {/* Target Input */}
      <div>
        <label className="text-sm font-bold mb-2 block" style={{ color: isDark ? '#d1d5db' : '#374151' }}>
          Đích đến <span className="text-red-500">*</span>
        </label>
        
        {/* Quick Select (if available) */}
        {quickTargets && quickTargets.length > 0 && (
          <div className="mb-3">
            <div className="text-xs mb-2" style={{ color: isDark ? '#9ca3af' : '#6b7280' }}>Chọn nhanh:</div>
            <div className="flex flex-wrap gap-2">
              {quickTargets.map((quick) => (
                <button
                  key={quick.value}
                  type="button"
                  onClick={() => setLinkTarget(quick.value)}
                  className="px-3 py-1.5 rounded-lg text-xs font-medium transition-all border"
                  style={{
                    backgroundColor: linkTarget === quick.value ? 'var(--primary)' : (isDark ? 'rgba(255,255,255,0.05)' : '#e5e7eb'),
                    color: linkTarget === quick.value ? '#000000' : (isDark ? '#d1d5db' : '#374151'),
                    borderColor: isDark ? 'rgba(255,255,255,0.1)' : '#d1d5db'
                  }}
                >
                  {quick.label}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Manual Input */}
        <input
          type="text"
          value={linkTarget}
          onChange={(e) => setLinkTarget(e.target.value)}
          placeholder={getTargetPlaceholder(linkType)}
          className="w-full border-2 rounded-xl px-4 py-3 focus:outline-none transition-colors"
          style={{
            backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : '#ffffff',
            color: isDark ? '#ffffff' : '#111827',
            borderColor: (linkTarget && !isValid) ? '#ef4444' : (isDark ? 'rgba(255,255,255,0.1)' : '#d1d5db')
          }}
        />
        
        {linkTarget && !isValid && (
          <div className="flex items-center gap-2 mt-2 text-xs" style={{ color: isDark ? '#fca5a5' : '#dc2626' }}>
            <AlertCircle className="w-4 h-4" />
            <span>Format không hợp lệ. Vui lòng kiểm tra lại.</span>
          </div>
        )}
      </div>

      {/* Resolved Link Preview */}
      {resolvedLink && isValid && (
        <div className="border rounded-xl p-4" style={{ backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : '#f3f4f6', borderColor: isDark ? 'rgba(255,255,255,0.1)' : '#d1d5db' }}>
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-lg" style={{ backgroundColor: isDark ? 'rgba(var(--primary-rgb), 0.1)' : 'rgba(var(--primary-rgb), 0.2)' }}>
              <ExternalLink className="w-5 h-5 text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-xs mb-1" style={{ color: isDark ? '#9ca3af' : '#6b7280' }}>Link đã tạo:</div>
              <div className="text-sm font-mono break-all" style={{ color: isDark ? '#ffffff' : '#111827' }}>{resolvedLink}</div>
              {linkType !== 'custom' && (
                <div className="flex items-center gap-2 mt-2 text-xs" style={{ color: isDark ? '#86efac' : '#16a34a' }}>
                  <Check className="w-4 h-4" />
                  <span>Tự động generate link thành công</span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Help Text */}
      <div className="border rounded-xl p-3 text-xs" style={{ backgroundColor: isDark ? 'rgba(59,130,246,0.1)' : '#dbeafe', borderColor: isDark ? 'rgba(59,130,246,0.2)' : '#93c5fd', color: isDark ? '#93c5fd' : '#1e40af' }}>
        <div className="font-bold mb-1">📝 Hướng dẫn nhanh:</div>
        <ul className="space-y-1 list-disc list-inside" style={{ color: isDark ? 'rgba(191,219,254,0.8)' : '#2563eb' }}>
          {linkType === 'promotion' && (
            <>
              <li>Nhập slug khuyến mãi (VD: khuyen-mai-tet-2026)</li>
              <li>Link sẽ tự động: /promotions/khuyen-mai-tet-2026</li>
            </>
          )}
          {linkType === 'product' && (
            <>
              <li>Nhập slug sản phẩm (VD: tailg-xmen-plus)</li>
              <li>Tìm slug tại: /admin/cars → Copy slug sản phẩm</li>
            </>
          )}
          {linkType === 'blog' && (
            <>
              <li>Nhập slug bài viết (VD: xe-dien-tailg-tot-khong)</li>
              <li>Tìm slug tại: /admin/blog → Copy slug bài viết</li>
            </>
          )}
          {linkType === 'category' && (
            <>
              <li>Nhập filter query (VD: type=motorcycle&brand=TAILG)</li>
              <li>Hoặc chọn nhanh từ các option có sẵn</li>
            </>
          )}
          {linkType === 'collection' && (
            <>
              <li>Chọn bộ sưu tập: xe-moi-2026, xe-ban-chay, xe-gia-re...</li>
              <li>Hoặc tự tạo slug collection mới</li>
            </>
          )}
          {linkType === 'form' && (
            <>
              <li>Chọn loại form: lai-thu, tu-van, lien-he</li>
              <li>Link tự động đến trang form tương ứng</li>
            </>
          )}
          {linkType === 'custom' && (
            <>
              <li>Nhập URL đầy đủ (https://...) hoặc path (/cars)</li>
              <li>Dùng khi cần link đặc biệt không thuộc các loại trên</li>
            </>
          )}
        </ul>
      </div>
    </div>
  );
}
