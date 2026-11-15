/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Product, ProductFilter, ProductSort } from '../types/product.ts';
import { INITIAL_PRODUCTS } from '../lib/initialProducts.ts';
import { supabase } from '../lib/supabase.ts';

const PRODUCTS_STORAGE_KEY = 'dyadia_products_data_v5';

let lastSupabaseError: string | null = null;
let currentDataSource: 'supabase' | 'localStorage' = 'supabase';

function getStoredProducts(): Product[] {
  try {
    const raw = localStorage.getItem(PRODUCTS_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (err) {
    console.error('Error reading products from localStorage:', err);
  }
  return INITIAL_PRODUCTS;
}

function saveStoredProducts(products: Product[]): void {
  try {
    localStorage.setItem(PRODUCTS_STORAGE_KEY, JSON.stringify(products));
  } catch (err) {
    console.error('Error saving products to localStorage:', err);
  }
}

export const productService = {
  getLastError(): string | null {
    return lastSupabaseError;
  },

  getDataSource(): 'supabase' | 'localStorage' {
    return currentDataSource;
  },

  /**
   * Get all products with optional filters and sorting
   * Queries Supabase public.products directly for real-time prices & stock
   */
  async getProducts(filters?: ProductFilter, sort?: ProductSort): Promise<Product[]> {
    let products: Product[] = [];

    // 1. Query Supabase directly for 100% real-time data & exact prices
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('sku', { ascending: true });

      if (!error && data && data.length > 0) {
        products = data as Product[];
        currentDataSource = 'supabase';
        lastSupabaseError = null;
        saveStoredProducts(products);
      } else if (error) {
        lastSupabaseError = error.message;
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Lỗi kết nối Supabase';
      lastSupabaseError = msg;
    }

    // 2. Try API endpoint fallback if Supabase direct had no data
    if (products.length === 0) {
      try {
        const response = await fetch('/api/products');
        const contentType = response.headers.get('content-type') || '';
        if (response.ok && contentType.includes('application/json')) {
          const json = await response.json();
          if (json.success && Array.isArray(json.data) && json.data.length > 0) {
            products = json.data as Product[];
            currentDataSource = 'supabase';
            lastSupabaseError = null;
            saveStoredProducts(products);
          }
        }
      } catch {
        // ignore and fallback
      }
    }

    // 3. Fallback to localStorage / initial products if still empty
    if (products.length === 0) {
      products = getStoredProducts();
      currentDataSource = 'localStorage';
    }

    // Apply client filters
    if (filters) {
      if (filters.productType) {
        products = products.filter(
          (p) => (p.product_type || 'contact_lens') === filters.productType
        );
      }
      if (filters.collection) {
        products = products.filter(
          (p) => (p.collection || '').toLowerCase() === filters.collection!.toLowerCase()
        );
      }
      if (filters.category) {
        products = products.filter(
          (p) => (p.category || '').toLowerCase() === filters.category!.toLowerCase()
        );
      }
      if (filters.color) {
        products = products.filter(
          (p) => (p.color || '').toLowerCase() === filters.color!.toLowerCase()
        );
      }
      if (filters.minPrice !== undefined) {
        products = products.filter((p) => p.price !== null && p.price >= filters.minPrice!);
      }
      if (filters.maxPrice !== undefined) {
        products = products.filter((p) => p.price !== null && p.price <= filters.maxPrice!);
      }
      if (filters.inStockOnly) {
        products = products.filter((p) => (p.stock_quantity ?? 0) > 0);
      }
      if (filters.searchQuery) {
        const q = filters.searchQuery.toLowerCase().trim();
        products = products.filter(
          (p) =>
            p.product_name.toLowerCase().includes(q) ||
            p.sku.toLowerCase().includes(q) ||
            (p.collection && p.collection.toLowerCase().includes(q)) ||
            (p.color && p.color.toLowerCase().includes(q)) ||
            (p.brand && p.brand.toLowerCase().includes(q))
        );
      }
    }

    // Apply sorting
    if (sort) {
      switch (sort) {
        case 'price-asc':
          products = [...products].sort((a, b) => (a.price ?? 0) - (b.price ?? 0));
          break;
        case 'price-desc':
          products = [...products].sort((a, b) => (b.price ?? 0) - (a.price ?? 0));
          break;
        case 'name-asc':
          products = [...products].sort((a, b) => a.product_name.localeCompare(b.product_name));
          break;
        case 'newest':
        default:
          products = [...products].sort((a, b) => (b.is_new ? 1 : 0) - (a.is_new ? 1 : 0));
          break;
      }
    }

    return products;
  },

  /**
   * Get single product by slug or id (with variants from public.product_variants)
   */
  async getProductBySlug(slug: string): Promise<Product | null> {
    try {
      const res = await fetch(`/api/products/${encodeURIComponent(slug)}`);
      const contentType = res.headers.get('content-type') || '';
      if (res.ok && contentType.includes('application/json')) {
        const json = await res.json();
        if (json.success && json.data) {
          return json.data as Product;
        }
      }
    } catch {
      // Fallback
    }

    // Direct Supabase query fallback
    try {
      let { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('slug', slug)
        .maybeSingle();

      if (!data && !error) {
        const byId = await supabase
          .from('products')
          .select('*')
          .eq('id', slug)
          .maybeSingle();
        data = byId.data;
      }

      if (data) {
        // Query variants
        const { data: variants } = await supabase
          .from('product_variants')
          .select('*')
          .eq('product_id', data.id)
          .order('power', { ascending: false });

        return {
          ...data,
          prescription_power_options: variants || data.prescription_power_options || [],
        } as Product;
      }
    } catch {
      // ignore
    }

    const products = await this.getProducts();
    let found = products.find((p) => p.slug === slug || p.id === slug || p.sku === slug);
    if (!found && slug) {
      // Fuzzy fallback
      const normalizeSlug = (s: string) =>
        s.toLowerCase().replace(/(?:^|-)(?:1|30)-?day(?=-|$)/g, '').replace(/[^a-z0-9]/g, '');
      const cleanSlug = normalizeSlug(slug);
      found = products.find((p) => {
        const pSlug = normalizeSlug(p.slug || '');
        return pSlug.length > 0 && (pSlug === cleanSlug || pSlug.includes(cleanSlug) || cleanSlug.includes(pSlug));
      });
    }
    return found || null;
  },

  /**
   * Get single product by id
   */
  async getProductById(id: string): Promise<Product | null> {
    return this.getProductBySlug(id);
  },

  /**
   * Search products with query string
   */
  async searchProducts(query: string): Promise<Product[]> {
    if (!query.trim()) return [];
    return this.getProducts({ searchQuery: query });
  },

  /**
   * Get related products based on collection or category
   */
  async getRelatedProducts(productId: string, limit = 4): Promise<Product[]> {
    const all = await this.getProducts();
    const current = all.find((p) => p.id === productId);
    if (!current) return all.slice(0, limit);

    const related = all.filter(
      (p) =>
        p.id !== productId &&
        ((current.collection && p.collection === current.collection) ||
          p.category === current.category)
    );
    return related.slice(0, limit);
  },
};
