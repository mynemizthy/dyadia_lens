/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Filter, X, SlidersHorizontal, ArrowUpDown } from 'lucide-react';
import { productService } from '../services/productService.ts';
import { Product, ProductSort } from '../types/product.ts';
import { ProductCard } from '../components/product/ProductCard.tsx';

const ITEMS_PER_PAGE = 12;

export const Products: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  // Filter states
  const typeParam = searchParams.get('type') || '';
  const collectionParam = searchParams.get('collection') || '';
  const categoryParam = searchParams.get('category') || '';
  const colorParam = searchParams.get('color') || '';
  const sortParam = (searchParams.get('sort') as ProductSort) || 'newest';
  const priceRangeParam = searchParams.get('priceRange') || '';
  const [inStockOnly, setInStockOnly] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const [supabaseError, setSupabaseError] = useState<string | null>(null);
  const [dataSource, setDataSource] = useState<'supabase' | 'localStorage'>('localStorage');

  useEffect(() => {
    async function fetchProducts() {
      setLoading(true);
      try {
        const data = await productService.getProducts();
        setProducts(data);
        setSupabaseError(productService.getLastError());
        setDataSource(productService.getDataSource());
      } catch (err) {
        console.error('Error loading products:', err);
        setSupabaseError('Đã xảy ra lỗi khi tải danh sách sản phẩm.');
      } finally {
        setLoading(false);
      }
    }
    fetchProducts();
  }, []);

  // Compute available collections and colors dynamically from actual dataset (excluding system content records)
  const availableCollections = useMemo(() => {
    return Array.from(new Set(products.filter((p) => p.category !== 'System' && p.id !== 'DY-SYSTEM-STORE-CONTENT').map((p) => p.collection))).filter((c): c is string => Boolean(c));
  }, [products]);

  const availableCategories = useMemo(() => {
    return Array.from(
      new Set(
        products
          .filter(
            (p) =>
              (!p.product_type || p.product_type === 'contact_lens') &&
              p.category !== 'System' &&
              p.id !== 'DY-SYSTEM-STORE-CONTENT'
          )
          .map((p) => p.category)
      )
    ).filter((c): c is string => Boolean(c));
  }, [products]);

  const availableColors = useMemo(() => {
    return Array.from(new Set(products.filter((p) => p.category !== 'System' && p.id !== 'DY-SYSTEM-STORE-CONTENT').map((p) => p.color))).filter((c): c is string => Boolean(c));
  }, [products]);

  // Filter & sort logic
  const filteredProducts = useMemo(() => {
    // Only customer-facing products
    let result = products.filter((p) => p.category !== 'System' && p.id !== 'DY-SYSTEM-STORE-CONTENT');

    if (typeParam) {
      if (typeParam === 'contact_lens') {
        result = result.filter((p) => !p.product_type || p.product_type === 'contact_lens');
      } else {
        result = result.filter((p) => p.product_type === typeParam);
      }
    }

    if (collectionParam) {
      result = result.filter((p) => (p.collection || '').toLowerCase() === collectionParam.toLowerCase());
    }

    if (categoryParam) {
      result = result.filter((p) => (p.category || '').toLowerCase() === categoryParam.toLowerCase());
    }

    if (colorParam) {
      result = result.filter((p) => (p.color || '').toLowerCase() === colorParam.toLowerCase());
    }

    if (inStockOnly) {
      result = result.filter((p) => (p.stock_quantity ?? 0) > 0);
    }

    if (priceRangeParam) {
      if (priceRangeParam === 'under100') {
        result = result.filter((p) => p.price !== null && p.price < 100000);
      } else if (priceRangeParam === '100to150') {
        result = result.filter((p) => p.price !== null && p.price >= 100000 && p.price <= 150000);
      } else if (priceRangeParam === 'over150') {
        result = result.filter((p) => p.price !== null && p.price > 150000);
      }
    }

    // Sort
    switch (sortParam) {
      case 'price-asc':
        result.sort((a, b) => (a.price ?? 0) - (b.price ?? 0));
        break;
      case 'price-desc':
        result.sort((a, b) => (b.price ?? 0) - (a.price ?? 0));
        break;
      case 'name-asc':
        result.sort((a, b) => a.product_name.localeCompare(b.product_name));
        break;
      case 'newest':
      default:
        result.sort((a, b) => (b.is_new ? 1 : 0) - (a.is_new ? 1 : 0));
        break;
    }

    return result;
  }, [products, typeParam, collectionParam, categoryParam, colorParam, inStockOnly, priceRangeParam, sortParam]);

  // Reset page when filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [typeParam, collectionParam, categoryParam, colorParam, inStockOnly, priceRangeParam, sortParam]);

  // Pagination calculation
  const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE);
  const paginatedProducts = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredProducts.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredProducts, currentPage]);

  const updateFilter = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams);
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    setSearchParams(params);
  };

  const clearAllFilters = () => {
    setSearchParams(new URLSearchParams());
    setInStockOnly(false);
  };

  const hasActiveFilters = Boolean(
    collectionParam || categoryParam || colorParam || priceRangeParam || inStockOnly
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Page Title & Breadcrumbs */}
      <div className="mb-8">
        <div className="flex items-center gap-2 text-xs text-slate-500 mb-2">
          <span>Trang chủ</span>
          <span>/</span>
          <span className="text-slate-900 font-medium">Tất cả sản phẩm kính áp tròng</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-serif font-normal text-slate-900">
          Danh Mục Kính Áp Tròng Dyadia
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 mt-1">
          Bộ sưu tập kính áp tròng nội địa Hàn Quốc cao cấp, nhập khẩu chính ngạch, thiết kế tự nhiên và êm dịu cho đôi mắt.
        </p>
      </div>

      {/* Product Type Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-3 mb-4">
        {[
          { id: '', label: 'Tất cả sản phẩm' },
          { id: 'contact_lens', label: 'Kính áp tròng' },
          { id: 'lens_solution', label: 'Nước ngâm lens' },
          { id: 'accessory', label: 'Phụ kiện lens' },
        ].map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => updateFilter('type', tab.id)}
            className={`px-4 py-2 text-xs font-semibold rounded-xl whitespace-nowrap transition-colors cursor-pointer ${
              typeParam === tab.id
                ? 'bg-[#D96B8A] text-white shadow-xs'
                : 'bg-white text-slate-700 hover:bg-rose-50 border border-slate-200'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Control Strip: Mobile filter trigger + Active Filter Chips + Sort */}
      <div className="flex flex-wrap items-center justify-between gap-4 py-3 border-y border-rose-100 mb-8">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setMobileFilterOpen(true)}
            className="lg:hidden inline-flex items-center gap-2 px-3.5 py-2 bg-white border border-slate-300 rounded-lg text-xs font-medium text-slate-700"
          >
            <Filter className="w-3.5 h-3.5" />
            <span>Bộ lọc {hasActiveFilters && '(Đang lọc)'}</span>
          </button>

          {/* Active Filter Chips */}
          <div className="hidden sm:flex flex-wrap items-center gap-2">
            {collectionParam && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 text-xs bg-slate-100 text-slate-700 rounded-md">
                Bộ sưu tập: {collectionParam}
                <button type="button" onClick={() => updateFilter('collection', '')}>
                  <X className="w-3 h-3 hover:text-slate-950" />
                </button>
              </span>
            )}
            {categoryParam && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 text-xs bg-slate-100 text-slate-700 rounded-md">
                Loại: {categoryParam}
                <button type="button" onClick={() => updateFilter('category', '')}>
                  <X className="w-3 h-3 hover:text-slate-950" />
                </button>
              </span>
            )}
            {colorParam && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 text-xs bg-slate-100 text-slate-700 rounded-md">
                Màu: {colorParam}
                <button type="button" onClick={() => updateFilter('color', '')}>
                  <X className="w-3 h-3 hover:text-slate-950" />
                </button>
              </span>
            )}
            {priceRangeParam && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 text-xs bg-slate-100 text-slate-700 rounded-md">
                Mức giá
                <button type="button" onClick={() => updateFilter('priceRange', '')}>
                  <X className="w-3 h-3 hover:text-slate-950" />
                </button>
              </span>
            )}
            {hasActiveFilters && (
              <button
                type="button"
                onClick={clearAllFilters}
                className="text-xs text-rose-600 hover:text-rose-800 font-medium underline underline-offset-2 ml-1"
              >
                Xóa tất cả bộ lọc
              </button>
            )}
          </div>
        </div>

        {/* Sort selector */}
        <div className="flex items-center gap-2 ml-auto">
          <ArrowUpDown className="w-3.5 h-3.5 text-slate-500" />
          <span className="text-xs text-slate-500 hidden sm:inline">Sắp xếp:</span>
          <select
            value={sortParam}
            onChange={(e) => updateFilter('sort', e.target.value)}
            className="text-xs font-medium text-slate-800 bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-rose-400"
          >
            <option value="newest">Mới nhất</option>
            <option value="price-asc">Giá thấp đến cao</option>
            <option value="price-desc">Giá cao đến thấp</option>
            <option value="name-asc">Tên sản phẩm A-Z</option>
          </select>
        </div>
      </div>

      {/* Main Grid with Sidebar Filter */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Desktop Sidebar Filters */}
        <aside className="hidden lg:block space-y-6">
          <div className="bg-white p-5 rounded-2xl border border-rose-100 shadow-xs space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <span className="text-sm font-semibold text-slate-900 flex items-center gap-1.5">
                <SlidersHorizontal className="w-4 h-4 text-slate-500" />
                Bộ lọc tìm kiếm
              </span>
              {hasActiveFilters && (
                <button
                  type="button"
                  onClick={clearAllFilters}
                  className="text-xs text-rose-600 hover:underline"
                >
                  Xóa lọc
                </button>
              )}
            </div>

            {/* Contact lens specific filters: Collection, Usage Period, Color */}
            {(!typeParam || typeParam === 'contact_lens') && (
              <>
                {/* Collection Filter */}
                <div>
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-600 mb-2.5">
                    Bộ sưu tập
                  </h4>
                  <div className="space-y-1.5 text-xs">
                    <button
                      type="button"
                      onClick={() => updateFilter('collection', '')}
                      className={`block w-full text-left py-1 px-2 rounded-md ${
                        !collectionParam ? 'bg-slate-100 font-semibold text-slate-900' : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      Tất cả bộ sưu tập
                    </button>
                    {availableCollections.map((col) => (
                      <button
                        key={col}
                        type="button"
                        onClick={() => updateFilter('collection', col)}
                        className={`block w-full text-left py-1 px-2 rounded-md ${
                          collectionParam === col
                            ? 'bg-slate-100 font-semibold text-slate-900'
                            : 'text-slate-600 hover:text-slate-900'
                        }`}
                      >
                        {col}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Category / Usage Period */}
                <div>
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-600 mb-2.5">
                    Chu kỳ sử dụng
                  </h4>
                  <div className="space-y-1.5 text-xs">
                    <button
                      type="button"
                      onClick={() => updateFilter('category', '')}
                      className={`block w-full text-left py-1 px-2 rounded-md ${
                        !categoryParam ? 'bg-slate-100 font-semibold text-slate-900' : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      Tất cả chu kỳ
                    </button>
                    {availableCategories.map((cat) => (
                      <button
                        key={cat}
                        type="button"
                        onClick={() => updateFilter('category', cat)}
                        className={`block w-full text-left py-1 px-2 rounded-md ${
                          categoryParam === cat
                            ? 'bg-slate-100 font-semibold text-slate-900'
                            : 'text-slate-600 hover:text-slate-900'
                        }`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Color Filter */}
                <div>
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-600 mb-2.5">
                    Tone màu tròng
                  </h4>
                  <div className="flex flex-wrap gap-1.5">
                    {availableColors.map((clr) => (
                      <button
                        key={clr}
                        type="button"
                        onClick={() => updateFilter('color', colorParam === clr ? '' : clr)}
                        className={`px-2.5 py-1 text-xs rounded-lg border transition-all cursor-pointer ${
                          colorParam === clr
                            ? 'bg-[#D96B8A] text-white border-[#D96B8A] shadow-2xs'
                            : 'bg-white text-slate-700 hover:bg-rose-50 border-slate-200'
                        }`}
                      >
                        {clr}
                      </button>
                    ))}
                  </div>
                </div>
              </>
            )}

            {/* Price Filter */}
            <div>
              <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-600 mb-2.5">
                Mức giá / 1 chiếc
              </h4>
              <div className="space-y-1.5 text-xs text-slate-700">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="price"
                    checked={!priceRangeParam}
                    onChange={() => updateFilter('priceRange', '')}
                    className="accent-slate-900"
                  />
                  <span>Tất cả mức giá</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="price"
                    checked={priceRangeParam === 'under100'}
                    onChange={() => updateFilter('priceRange', 'under100')}
                    className="accent-slate-900"
                  />
                  <span>Dưới 100.000đ</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="price"
                    checked={priceRangeParam === '100to150'}
                    onChange={() => updateFilter('priceRange', '100to150')}
                    className="accent-slate-900"
                  />
                  <span>100.000đ – 150.000đ</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="price"
                    checked={priceRangeParam === 'over150'}
                    onChange={() => updateFilter('priceRange', 'over150')}
                    className="accent-slate-900"
                  />
                  <span>Trên 150.000đ</span>
                </label>
              </div>
            </div>

            {/* Availability */}
            <div className="pt-2 border-t border-slate-100">
              <label className="flex items-center gap-2 cursor-pointer text-xs font-medium text-slate-700">
                <input
                  type="checkbox"
                  checked={inStockOnly}
                  onChange={(e) => setInStockOnly(e.target.checked)}
                  className="rounded accent-slate-900"
                />
                <span>Chỉ hiển thị sản phẩm còn hàng</span>
              </label>
            </div>
          </div>
        </aside>

        {/* Product Grid (3 columns on desktop when sidebar active, total 4 col layout) */}
        <main className="lg:col-span-3">
          {loading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 sm:gap-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="h-80 bg-slate-100 rounded-xl animate-pulse" />
              ))}
            </div>
          ) : paginatedProducts.length === 0 ? (
            <div className="text-center py-16 bg-white border border-rose-100 rounded-2xl p-8">
              <p className="text-base font-semibold text-slate-800">
                {typeParam === 'lens_solution'
                  ? 'Hiện tại các dòng nước ngâm và dung dịch dưỡng ẩm lens đang được cập nhật thêm từ Hàn Quốc.'
                  : typeParam === 'accessory'
                  ? 'Các dòng khay đựng lens và phụ kiện chuyên dụng đang được chuẩn bị cập nhật.'
                  : 'Không tìm thấy sản phẩm nào phù hợp với bộ lọc hiện tại.'}
              </p>
              <p className="text-xs text-slate-500 mt-1">
                {typeParam
                  ? 'Bạn có thể xem trước các bộ sưu tập kính áp tròng cận thị cao cấp đang có sẵn.'
                  : 'Hãy thử xóa bớt tiêu chí lọc hoặc tìm kiếm với từ khóa khác.'}
              </p>
              <button
                type="button"
                onClick={clearAllFilters}
                className="mt-4 px-4 py-2 text-xs font-semibold text-white bg-[#D96B8A] rounded-lg hover:bg-[#C24A6D] transition-colors"
              >
                Xem tất cả kính áp tròng
              </button>
            </div>
          ) : (
            <div className="space-y-8">
              <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
                {paginatedProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>

              {/* Pagination (12 products per page) */}
              {totalPages > 1 && (
                <div className="pt-6 border-t border-slate-200 flex items-center justify-center gap-2">
                  <button
                    type="button"
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    className="px-3 py-1.5 text-xs font-medium border border-slate-300 rounded-lg disabled:opacity-30 hover:bg-slate-50 transition-colors"
                  >
                    Trang trước
                  </button>

                  {Array.from({ length: totalPages }).map((_, idx) => {
                    const pageNum = idx + 1;
                    return (
                      <button
                        key={pageNum}
                        type="button"
                        onClick={() => setCurrentPage(pageNum)}
                        className={`w-8 h-8 text-xs font-medium rounded-lg transition-colors ${
                          currentPage === pageNum
                            ? 'bg-[#D96B8A] text-white'
                            : 'border border-slate-300 text-slate-700 hover:bg-slate-50'
                        }`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}

                  <button
                    type="button"
                    disabled={currentPage === totalPages}
                    onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                    className="px-3 py-1.5 text-xs font-medium border border-slate-300 rounded-lg disabled:opacity-30 hover:bg-slate-50 transition-colors"
                  >
                    Trang sau
                  </button>
                </div>
              )}
            </div>
          )}
        </main>
      </div>

      {/* Mobile Filter Drawer */}
      {mobileFilterOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 flex justify-end">
          <div className="w-[300px] h-full bg-white p-6 overflow-y-auto space-y-6 animate-in slide-in-from-right duration-200">
            <div className="flex items-center justify-between pb-4 border-b border-slate-200">
              <span className="text-sm font-semibold text-slate-900">Bộ lọc sản phẩm</span>
              <button
                type="button"
                onClick={() => setMobileFilterOpen(false)}
                className="p-1 text-slate-500 hover:text-slate-900"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Mobile Filters Body */}
            <div>
              <h4 className="text-xs font-semibold uppercase text-slate-600 mb-2">Bộ sưu tập</h4>
              <div className="space-y-1 text-xs">
                {availableCollections.map((col) => (
                  <button
                    key={col}
                    type="button"
                    onClick={() => {
                      updateFilter('collection', collectionParam === col ? '' : col);
                    }}
                    className={`block w-full text-left py-1.5 px-2 rounded ${
                      collectionParam === col ? 'bg-[#D96B8A] text-white' : 'text-slate-700'
                    }`}
                  >
                    {col}
                  </button>
                ))}
              </div>
            </div>

            <div className="pt-4 border-t border-slate-200">
              <button
                type="button"
                onClick={() => {
                  clearAllFilters();
                  setMobileFilterOpen(false);
                }}
                className="w-full py-2 text-xs font-semibold text-rose-600 border border-rose-200 rounded-lg mb-2"
              >
                Xóa tất cả bộ lọc
              </button>
              <button
                type="button"
                onClick={() => setMobileFilterOpen(false)}
                className="w-full py-2.5 text-xs font-semibold text-white bg-[#D96B8A] rounded-lg"
              >
                Xem {filteredProducts.length} sản phẩm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
