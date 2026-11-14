/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { CartItem } from './cart.ts';

export type OrderStatus =
  | 'pending'
  | 'confirmed'
  | 'processing'
  | 'shipping'
  | 'delivered'
  | 'completed'
  | 'cancelled'
  | 'refunded'
  | 'Chờ xác nhận'
  | 'Đã xác nhận'
  | 'Đang giao hàng'
  | 'Đã giao hàng'
  | 'Đã hoàn tất'
  | 'Hoàn thành'
  | 'Đã hủy';

export function getOrderStatusLabel(status: string): string {
  switch (status) {
    case 'pending':
      return 'Chờ xác nhận';
    case 'confirmed':
      return 'Đã xác nhận';
    case 'processing':
      return 'Đang xử lý';
    case 'shipping':
      return 'Đang giao hàng';
    case 'delivered':
    case 'Đã giao hàng':
      return 'Đã giao hàng (Chờ xác nhận)';
    case 'completed':
    case 'Đã hoàn tất':
    case 'Hoàn thành':
      return 'Đã nhận hàng (Hoàn tất)';
    case 'cancelled':
      return 'Đã hủy';
    case 'refunded':
      return 'Đã hoàn tiền';
    default:
      return status || 'Chờ xác nhận';
  }
}

export type PaymentMethod =
  | 'cod'
  | 'bank_transfer'
  | 'momo'
  | 'zalopay'
  | 'atm_card';

export interface OrderCustomerInfo {
  fullName: string;
  phone: string;
  email: string;
  province: string;
  district: string;
  address: string;
  note?: string;
  subtotal?: number;
  discountAmount?: number;
  shippingFee?: number;
  couponCode?: string | null;
}

export interface Order {
  id: string | number;
  orderCode: string;
  customer: OrderCustomerInfo;
  items: CartItem[];
  paymentMethod: PaymentMethod;
  subtotal: number;
  discountAmount: number;
  shippingFee: number;
  totalAmount: number;
  couponCode?: string;
  status: OrderStatus;
  receivedAt?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface ProductReview {
  id: string;
  order_id: string;
  order_code?: string;
  product_id: string;
  product_name?: string;
  user_id?: string;
  reviewer_name: string;
  rating: number;
  comment: string;
  created_at: string;
}
