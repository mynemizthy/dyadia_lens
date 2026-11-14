/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type ProductType = 'contact_lens' | 'lens_solution' | 'accessory';

export interface ProductVariant {
  id: string;
  product_id: string;
  sku: string;
  prescription_power: string;
  stock_quantity: number;
  created_at?: string;
  updated_at?: string;
}

export interface APlusSlot {
  image?: string | null;
  title?: string;
  subtitle?: string;
  description?: string;
}

export interface Product {
  id: string;
  sku: string;
  product_name: string;
  slug: string;
  product_type?: ProductType | string;
  category: string;
  description: string;
  price: number | null; // Calculated PER SINGLE LENS for contact lenses, per bottle/unit for solutions
  stock_quantity: number | null;
  image_url: string | null;
  gallery_images: string[];
  aplus_images?: (string | null)[]; // 2-7+ description / A+ images
  aplus_content?: APlusSlot[];
  rating: number;
  review_count: number;
  created_at?: string;
  updated_at?: string;

  // Contact Lens specific properties (NULL for solution & accessory)
  collection?: string | null;
  color?: string | null;
  replacement_period_days?: number | null;
  material?: string | null;
  dia?: number | string | null;
  graphic_dia?: number | string | null;
  base_curve?: number | string | null;
  water_content?: number | string | null;
  uv_protection?: boolean | null;
  origin?: string | null;
  quantity_lenses?: number | null;
  prescription_power_options?: string[];
  is_best_seller?: boolean;
  is_new?: boolean;

  // Lens Solution specific properties (NULL for contact lens & accessory)
  volume_ml?: number | null;
  ingredients?: string | null;
  usage_instructions?: string | null;
  brand?: string | null;

  // Variants loaded from public.product_variants
  variants?: ProductVariant[];
}

export type ProductFilter = {
  productType?: string;
  collection?: string;
  category?: string;
  replacementPeriod?: number;
  color?: string;
  minPrice?: number;
  maxPrice?: number;
  inStockOnly?: boolean;
  searchQuery?: string;
};

export type ProductSort = 'newest' | 'price-asc' | 'price-desc' | 'name-asc';
