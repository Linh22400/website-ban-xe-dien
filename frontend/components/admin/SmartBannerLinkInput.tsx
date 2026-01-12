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

interface SmartBannerLinkInputProps {
  value: string; // Current link value
  onChange: (link: string) => void;
  className?: string;
}

export default function SmartBannerLinkInput({ value, onChange, className }: SmartBannerLinkInputProps) {
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
        <label className="text-sm font-bold text-gray-300 mb-3 block">
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
              className={`p-3 rounded-xl border-2 transition-all text-left ${
                linkType === option.value
                  ? 'border-primary bg-primary/10 text-white'
                  : 'border-white/10 bg-white/5 text-gray-400 hover:border-white/30'
              }`}
            >
              <div className="text-2xl mb-1">{option.icon}</div>
              <div className="text-xs font-bold">{option.label}</div>
            </button>
          ))}
        </div>
        {selectedType && (
          <p className="text-xs text-muted-foreground mt-2">
            💡 {selectedType.description}
          </p>
        )}
      </div>

      {/* Target Input */}
      <div>
        <label className="text-sm font-bold text-gray-300 mb-2 block">
          Đích đến <span className="text-red-500">*</span>
        </label>
        
        {/* Quick Select (if available) */}
        {quickTargets && quickTargets.length > 0 && (
          <div className="mb-3">
            <div className="text-xs text-gray-400 mb-2">Chọn nhanh:</div>
            <div className="flex flex-wrap gap-2">
              {quickTargets.map((quick) => (
                <button
                  key={quick.value}
                  type="button"
                  onClick={() => setLinkTarget(quick.value)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    linkTarget === quick.value
                      ? 'bg-primary text-black'
                      : 'bg-white/5 text-gray-300 hover:bg-white/10 border border-white/10'
                  }`}
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
          className={`w-full bg-white/5 border-2 rounded-xl px-4 py-3 text-white focus:outline-none transition-colors ${
            linkTarget && !isValid
              ? 'border-red-500 focus:border-red-500'
              : 'border-white/10 focus:border-primary'
          }`}
        />
        
        {linkTarget && !isValid && (
          <div className="flex items-center gap-2 mt-2 text-red-400 text-xs">
            <AlertCircle className="w-4 h-4" />
            <span>Format không hợp lệ. Vui lòng kiểm tra lại.</span>
          </div>
        )}
      </div>

      {/* Resolved Link Preview */}
      {resolvedLink && isValid && (
        <div className="bg-white/5 border border-white/10 rounded-xl p-4">
          <div className="flex items-start gap-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <ExternalLink className="w-5 h-5 text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-xs text-gray-400 mb-1">Link đã tạo:</div>
              <div className="text-sm font-mono text-white break-all">{resolvedLink}</div>
              {linkType !== 'custom' && (
                <div className="flex items-center gap-2 mt-2 text-green-400 text-xs">
                  <Check className="w-4 h-4" />
                  <span>Tự động generate link thành công</span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Help Text */}
      <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-3 text-xs text-blue-300">
        <div className="font-bold mb-1">📝 Hướng dẫn nhanh:</div>
        <ul className="space-y-1 list-disc list-inside text-blue-200/80">
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
