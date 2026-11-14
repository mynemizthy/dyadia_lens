/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type BlogCategory =
  | 'Xu hướng K-Beauty'
  | 'Cẩm nang nhãn khoa'
  | 'Bí quyết chọn lens'
  | 'Phong cách & Make-up';

export interface BlogBlock {
  id: string;
  type: 'heading' | 'paragraph' | 'image' | 'tip' | 'quote' | 'product_card' | 'table';
  content: string;
  extra?: {
    caption?: string;
    author?: string;
    productId?: string;
    productSlug?: string;
    productName?: string;
    productPrice?: number;
    productImage?: string;
    tableHeaders?: string[];
    tableRows?: string[][];
  };
}

export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  cover_image: string;
  category: BlogCategory;
  author: {
    name: string;
    avatar?: string;
    role: string;
  };
  read_time_minutes: number;
  created_at: string;
  blocks: BlogBlock[];
  published: boolean;
}
