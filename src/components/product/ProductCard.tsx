/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Link } from 'react-router-dom';
import { Product } from '../../types/product.ts';
import { formatCurrency } from '../../lib/utils.ts';
import { LensIrisGraphic } from '../common/LensIrisGraphic.tsx';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const isContactLens = !product.product_type || product.product_type === 'contact_lens';
  const isOutOfStock = isContactLens
    ? (product.stock_quantity !== null && product.stock_quantity !== undefined && product.stock_quantity < 0)
    : (product.stock_quantity !== null && product.stock_quantity !== undefined && product.stock_quantity <= 0);

  return (
    <div className="group relative bg-white border border-rose-100 rounded-2xl overflow-hidden hover:border-rose-300 hover:shadow-lg hover:shadow-rose-100/50 hover:-translate-y-0.5 transition-all duration-200 flex flex-col">
      {/* Product Image Area */}
      <Link
        to={`/products/${product.slug}`}
        className="relative block aspect-[3/4] bg-[#FFF5F7] overflow-hidden"
      >
        {product.image_url ? (
          <img
            src={product.image_url}
            alt={product.product_name}
            loading="lazy"
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
          />
        ) : isContactLens ? (
          <div className="w-full h-full flex flex-col items-center justify-center p-4 bg-gradient-to-b from-[#FFF9FA] to-[#FFEFF4]">
            <LensIrisGraphic colorName={product.color || 'Brown'} size={130} />
            <span className="text-[11px] text-rose-400 mt-2 font-medium">Tone {product.color || 'Tự nhiên'}</span>
          </div>
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center p-4 bg-rose-50/50 text-rose-400">
            <span className="text-xs font-semibold uppercase tracking-wider">{product.brand || 'Dyadia Care'}</span>
          </div>
        )}

        {/* Subtle Status Tag */}
        <div className="absolute top-2.5 left-2.5 flex flex-col gap-1">
          {product.is_best_seller && (
            <span className="text-[10px] font-semibold uppercase tracking-wider text-white bg-[#D96B8A]/90 border border-rose-300/60 px-2 py-0.5 rounded-full shadow-2xs">
              Bán chạy
            </span>
          )}
          {product.is_new && (
            <span className="text-[10px] font-semibold uppercase tracking-wider text-[#832B47] bg-[#FFE4EA]/95 border border-rose-200 px-2 py-0.5 rounded-full shadow-2xs">
              Mới ra mắt
            </span>
          )}
        </div>

        {/* Stock tag if out of stock */}
        {isOutOfStock && (
          <div className="absolute inset-0 bg-white/70 backdrop-blur-[1px] flex items-center justify-center">
            <span className="text-xs font-semibold text-slate-700 bg-white/90 px-3 py-1 rounded shadow-sm border border-slate-200">
              Tạm hết hàng
            </span>
          </div>
        )}
      </Link>

      {/* Product Information */}
      <div className="p-4 flex flex-col flex-1 justify-between gap-3">
        <div>
          {/* Collection & Category inline metadata */}
          <div className="flex items-center gap-1.5 text-xs text-slate-500 mb-1">
            {product.collection && <span className="font-medium text-slate-600">{product.collection}</span>}
            {product.collection && product.category && <span aria-hidden="true">·</span>}
            <span>{product.category || (isContactLens ? 'Lens' : 'Phụ kiện')}</span>
          </div>

          {/* Product Name */}
          <Link
            to={`/products/${product.slug}`}
            className="text-sm font-semibold text-slate-900 hover:text-slate-700 transition-colors line-clamp-1 block"
            title={product.product_name}
          >
            {product.product_name}
          </Link>

          {/* Details */}
          {isContactLens && product.color ? (
            <p className="text-xs text-slate-500 mt-0.5">
              Màu: <span className="font-medium text-slate-700">{product.color}</span>
            </p>
          ) : product.volume_ml ? (
            <p className="text-xs text-slate-500 mt-0.5">
              Dung tích: <span className="font-medium text-slate-700">{product.volume_ml} ml</span>
            </p>
          ) : null}
        </div>

        {/* Price Module */}
        <div className="pt-2 border-t border-rose-50 flex items-baseline justify-between">
          <div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-base font-bold text-[#B84A6A] tabular-nums">
                {formatCurrency(product.price)}
              </span>
              <span className="text-[11px] font-medium text-[#832B47] bg-rose-50 px-1.5 py-0.5 rounded">
                {isContactLens ? 'Giá / 1 chiếc' : 'Giá / 1 sản phẩm'}
              </span>
            </div>
          </div>

          <Link
            to={`/products/${product.slug}`}
            className="text-xs font-medium text-[#B84A6A] hover:text-[#832B47] underline underline-offset-4"
          >
            {isContactLens ? 'Chọn độ' : 'Chi tiết'}
          </Link>
        </div>
      </div>
    </div>
  );
};
