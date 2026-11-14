/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Product } from './product.ts';

export interface CartItem {
  id: string; // Composite key: `${productId}_${prescriptionPower}`
  productId: string;
  product: Product;
  prescriptionPower: string;
  quantity: number; // Number of individual lenses
  unitPrice: number; // Price per single lens in VND
}

export interface AppliedCoupon {
  code: string;
  discountType: 'percentage' | 'fixed' | 'free_shipping';
  value: number; // e.g. 10 for 10%, 50000 for 50k
  minOrderValue?: number;
  description: string;
}

export interface CartState {
  items: CartItem[];
  coupon: AppliedCoupon | null;
}
