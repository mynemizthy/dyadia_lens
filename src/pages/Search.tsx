/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from 'react';
import { Search as SearchIcon, X, SlidersHorizontal } from 'lucide-react';
import { productService } from '../services/productService.ts';
import { Product } from '../types/product.ts';
import { ProductCard } from '../components/product/ProductCard.tsx';

export const Search: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCollection, setSelectedCollection] = useState('');

  useEffect(() => {
    async function loadData() {
      try {
        const list = await productService.getProducts();
        setAllProducts(list);
      } catch (err) {
        console.error('Error fetching products for search:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const availableCollections = useMemo(() => {
    return Array.from(new Set(allProducts.map((p) => p.collection))).filter((c): c is string => Boolean(c));
  }, [allProducts]);

  const searchResults = useMemo(() => {
    if (!searchTerm.trim() && !selectedCollection) return allProducts;

    const q = searchTerm.toLowerCase().trim();
    return allProducts.filter((product) => {
      const matchText =
        !q ||
        product.product_name.toLowerCase().includes(q) ||
        product.sku.toLowerCase().includes(q) ||
        (product.collection && product.collection.toLowerCase().includes(q)) ||
        (product.color && product.color.toLowerCase().includes(q)) ||
        (product.category && product.category.toLowerCase().includes(q));

      const matchCollection =
        !selectedCollection || (product.collection && product.collection.toLowerCase() === selectedCollection.toLowerCase());

      return matchText && matchCollection;
    });
  }, [searchTerm, selectedCollection, allProducts]);

  const quickKeywords = ['Cat-titude', 'Brown', 'Gray', 'Silicone Hydrogel', '1 ngày', '1 tháng', 'Dolly'];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      {/* Header */}
      <div className="max-w-2xl mx-auto text-center space-y-3 mb-8">
        <h1 className="text-3xl font-serif font-normal text-slate-900">
          Tìm Kiếm Kính Áp Tròng
        </h1>
        <p className="text-xs text-slate-500">
          Tìm theo tên sản phẩm, bộ sưu tập, màu sắc (Brown, Gray, Choco...), chất liệu hoặc mã SKU.
        </p>

        {/* Search Input Box */}
        <div className="relative mt-4">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Nhập tên lens, màu sắc hoặc mã SKU (VD: Tabby Brown, DY-1D...)"
            className="w-full px-5 py-3.5 pl-12 pr-10 text-sm bg-white border border-slate-300 rounded-full focus:outline-none focus:ring-2 focus:ring-rose-400 shadow-xs"
            autoFocus
          />
          <SearchIcon className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
          {searchTerm && (
            <button
              type="button"
              onClick={() => setSearchTerm('')}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Quick Suggestion Chips */}
        <div className="flex flex-wrap items-center justify-center gap-1.5 pt-2">
          <span className="text-[11px] text-slate-400 mr-1">Gợi ý nhanh:</span>
          {quickKeywords.map((kw) => (
            <button
              key={kw}
              type="button"
              onClick={() => setSearchTerm(kw)}
              className="text-xs text-slate-600 bg-white border border-slate-200 hover:border-slate-300 px-3 py-1 rounded-full transition-colors"
            >
              {kw}
            </button>
          ))}
        </div>
      </div>

      {/* Collection filter strip */}
      <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-6 border-b border-slate-200">
        <SlidersHorizontal className="w-4 h-4 text-slate-500 shrink-0 ml-1 mr-1" />
        <button
          type="button"
          onClick={() => setSelectedCollection('')}
          className={`px-3 py-1.5 text-xs rounded-full whitespace-nowrap transition-colors shrink-0 ${
            !selectedCollection
              ? 'bg-[#D96B8A] text-white'
              : 'bg-white border border-slate-200 text-slate-600 hover:border-slate-300'
          }`}
        >
          Tất cả bộ sưu tập
        </button>
        {availableCollections.map((col) => (
          <button
            key={col}
            type="button"
            onClick={() => setSelectedCollection(selectedCollection === col ? '' : col)}
            className={`px-3 py-1.5 text-xs rounded-full whitespace-nowrap transition-colors shrink-0 ${
              selectedCollection === col
                ? 'bg-[#D96B8A] text-white'
                : 'bg-white border border-slate-200 text-slate-600 hover:border-slate-300'
            }`}
          >
            {col}
          </button>
        ))}
      </div>

      {/* Results Count */}
      <div className="mb-6 flex items-center justify-between text-xs text-slate-500">
        <span>
          Tìm thấy <strong>{searchResults.length}</strong> sản phẩm phù hợp
        </span>
        {(searchTerm || selectedCollection) && (
          <button
            type="button"
            onClick={() => {
              setSearchTerm('');
              setSelectedCollection('');
            }}
            className="text-rose-600 hover:underline"
          >
            Xóa tìm kiếm
          </button>
        )}
      </div>

      {/* Results Grid */}
      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-72 bg-slate-100 rounded-xl animate-pulse" />
          ))}
        </div>
      ) : searchResults.length === 0 ? (
        <div className="text-center py-20 bg-white border border-slate-200 rounded-2xl p-8">
          <p className="text-base font-semibold text-slate-800">
            Không tìm thấy sản phẩm nào khớp với &quot;{searchTerm}&quot;
          </p>
          <p className="text-xs text-slate-500 mt-1">
            Vui lòng kiểm tra lại chính tả hoặc thử tìm kiếm với từ khóa ngắn gọn hơn như &quot;Brown&quot;, &quot;Gray&quot;, &quot;1 ngày&quot;.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {searchResults.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
};
