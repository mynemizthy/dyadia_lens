/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Image as ImageIcon, Sparkles } from 'lucide-react';
import { Product } from '../../types/product.ts';

interface APlusSectionProps {
  product?: Product;
  aplusImages?: (string | null)[];
}

const SLOT_DEFINITIONS = [
  {
    index: 0,
    title: 'A+ 01: Giới thiệu Thương hiệu & Cảm hứng Thiết kế',
    subtitle: 'Brand Story & Inspiration',
    description: 'Khắc họa triết lý thiết kế và nguồn cảm hứng sáng tạo đằng sau bộ sưu tập, mang lại cảm xúc cao cấp cho người đeo.',
  },
  {
    index: 1,
    title: 'A+ 02: Chi tiết Vân Lens, Sắc độ & Thiết kế Điểm ảnh',
    subtitle: 'Pattern & Color Pigment Details',
    description: 'Cận cảnh chi tiết vòng vân lens, độ chuyển màu đa tầng và hiệu ứng khúc xạ ánh sáng tự nhiên trên tròng mắt.',
  },
  {
    index: 2,
    title: 'A+ 03: Trải nghiệm Đeo Thực tế & Hướng dẫn Phong cách',
    subtitle: 'Real Look & Styling Guide',
    description: 'Hình ảnh người mẫu thực tế trong các điều kiện ánh sáng khác nhau kết hợp gợi ý layout trang điểm phù hợp.',
  },
];

export const APlusSection: React.FC<APlusSectionProps> = ({ product, aplusImages: propImages }) => {
  const isContactLens = !product?.product_type || product.product_type === 'contact_lens';
  const rawImages = propImages ?? product?.aplus_images ?? [];
  const validImages = rawImages
    .map((img) => (typeof img === 'string' ? img.trim() : ''))
    .filter(Boolean);

  return (
    <section className="mt-20 pt-16 border-t border-rose-100">
      <div className="max-w-4xl mx-auto text-center mb-10">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-rose-50 border border-rose-200/80 rounded-full text-xs font-semibold text-[#832B47] tracking-wide mb-3">
          <Sparkles className="w-3.5 h-3.5 text-[#D96B8A]" />
          <span>{isContactLens ? 'Chi tiết & Thông tin Bộ sưu tập' : 'Thông tin chi tiết sản phẩm'}</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-serif font-normal text-slate-900 tracking-tight">
          Khám phá sản phẩm
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 mt-2 max-w-xl mx-auto leading-relaxed">
          {isContactLens
            ? 'Trải nghiệm thị giác chi tiết về sắc độ, hiệu ứng lên mắt thực tế và bảng màu đầy đủ của bộ sưu tập từ Dyadia Lens.'
            : 'Hình ảnh hướng dẫn sử dụng, thành phần và chứng nhận an toàn y tế từ nhà sản xuất.'}
        </p>
      </div>

      {validImages.length > 0 ? (
        <div className="max-w-3xl mx-auto space-y-6">
          {validImages.map((imgUrl, idx) => {
            const customSlot = product?.aplus_content?.[idx];
            const hasCustomCaption = Boolean(
              customSlot?.title?.trim() || customSlot?.description?.trim()
            );

            return (
              <div
                key={`${imgUrl}-${idx}`}
                className="bg-white border border-rose-100 rounded-3xl overflow-hidden shadow-xs"
              >
                <div className="bg-white flex items-center justify-center">
                  <img
                    src={imgUrl}
                    alt={customSlot?.title || `${product?.product_name || 'Dyadia Lens'} - Chi tiết ${idx + 1}`}
                    loading="lazy"
                    referrerPolicy="no-referrer"
                    className="w-full h-auto block object-contain"
                  />
                </div>
                {hasCustomCaption && (
                  <div className="p-6 sm:p-7 bg-white border-t border-rose-100/70">
                    {customSlot?.subtitle && (
                      <span className="text-[11px] font-semibold text-rose-800 uppercase tracking-widest block mb-1">
                        {customSlot.subtitle}
                      </span>
                    )}
                    {customSlot?.title && (
                      <h3 className="text-base sm:text-lg font-serif font-medium text-slate-900">
                        {customSlot.title}
                      </h3>
                    )}
                    {customSlot?.description && (
                      <p className="text-xs sm:text-sm text-slate-600 mt-2 leading-relaxed">
                        {customSlot.description}
                      </p>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        <div className="space-y-12 max-w-4xl mx-auto">
          {SLOT_DEFINITIONS.map((slot) => {
            const customSlot = product?.aplus_content?.[slot.index];
            const slotTitle = customSlot?.title || slot.title;
            const slotSubtitle = customSlot?.subtitle || slot.subtitle;
            const slotDescription = customSlot?.description || slot.description;
            const currentImg = customSlot?.image || null;

            return (
              <div
                key={slot.index}
                className="bg-white border border-rose-100 rounded-3xl overflow-hidden shadow-xs hover:border-rose-200 transition-colors"
              >
                <div className="relative aspect-[16/9] bg-[#FFF9FA] overflow-hidden flex items-center justify-center">
                  {currentImg ? (
                    <img
                      src={currentImg}
                      alt={slotTitle}
                      className="w-full h-full object-contain object-center"
                      loading="lazy"
                    />
                  ) : (
                    <div className="p-8 text-center max-w-md">
                      <div className="w-12 h-12 rounded-2xl bg-rose-50 flex items-center justify-center mx-auto mb-3 text-rose-300">
                        <ImageIcon className="w-6 h-6 stroke-1" />
                      </div>
                      <span className="text-xs font-semibold text-slate-600 uppercase tracking-wider block">
                        {slotSubtitle}
                      </span>
                      <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                        Bộ ảnh thực tế A+ chất lượng cao đang được cập nhật
                      </p>
                    </div>
                  )}
                </div>

                <div className="p-6 sm:p-8 bg-white border-t border-slate-100">
                  <span className="text-[11px] font-semibold text-rose-800 uppercase tracking-widest block mb-1">
                    {slotSubtitle}
                  </span>
                  <h3 className="text-base sm:text-lg font-serif font-medium text-slate-900">
                    {slotTitle}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 mt-2 leading-relaxed">
                    {slotDescription}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
};
