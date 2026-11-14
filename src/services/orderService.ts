/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Order, OrderStatus, ProductReview } from '../types/order.ts';

export const orderService = {
  /**
   * Fetch customer orders from Supabase via server-side protected route
   */
  async getUserOrders(userId: string, token?: string): Promise<Order[]> {
    try {
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
      };
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const response = await fetch('/api/orders', {
        headers,
      });

      if (!response.ok) {
        throw new Error(`Mã lỗi HTTP ${response.status}`);
      }

      const json = await response.json();
      if (json.success && Array.isArray(json.data)) {
        return json.data.map((raw: any) => ({
          id: raw.id || raw.order_code,
          orderCode: raw.order_code,
          customer: raw.customer || {},
          items: raw.items || [],
          paymentMethod: raw.payment_method || 'cod',
          subtotal: raw.customer?.subtotal || raw.total_amount || 0,
          discountAmount: raw.customer?.discountAmount || 0,
          shippingFee: raw.customer?.shippingFee || 0,
          totalAmount: raw.total_amount || 0,
          couponCode: raw.customer?.couponCode,
          status: raw.status as OrderStatus,
          receivedAt: raw.received_at || raw.customer?._confirmed_received_at || null,
          createdAt: raw.created_at,
          updatedAt: raw.updated_at,
        }));
      }
      return [];
    } catch (err) {
      console.error('Error fetching user orders from server:', err);
      return [];
    }
  },

  /**
   * Create new order via server-side authoritative endpoint
   */
  async createOrder(orderPayload: {
    customer: {
      fullName: string;
      phone: string;
      email?: string;
      province: string;
      district: string;
      address: string;
      note?: string;
    };
    items: any[];
    paymentMethod: string;
    couponCode?: string;
    token?: string;
  }): Promise<Order> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };
    if (orderPayload.token) {
      headers['Authorization'] = `Bearer ${orderPayload.token}`;
    }

    const response = await fetch('/api/orders', {
      method: 'POST',
      headers,
      body: JSON.stringify({
        customer: orderPayload.customer,
        items: orderPayload.items,
        paymentMethod: orderPayload.paymentMethod,
        couponCode: orderPayload.couponCode,
      }),
    });

    const result = await response.json();
    if (!response.ok || !result.success) {
      throw new Error(result.error || 'Đặt hàng không thành công');
    }

    const raw = result.order;
    return {
      id: raw.id || raw.order_code,
      orderCode: raw.order_code,
      customer: raw.customer,
      items: raw.items,
      paymentMethod: raw.payment_method,
      subtotal: raw.customer?.subtotal || raw.total_amount,
      discountAmount: raw.customer?.discountAmount || 0,
      shippingFee: raw.customer?.shippingFee || 0,
      totalAmount: raw.total_amount,
      couponCode: raw.customer?.couponCode,
      status: raw.status as OrderStatus,
      createdAt: raw.created_at,
      updatedAt: raw.updated_at,
    };
  },

  /**
   * Fetch a single order by its order code
   */
  async getOrderByCode(orderCode: string): Promise<Order | null> {
    try {
      const response = await fetch(`/api/orders/${encodeURIComponent(orderCode)}`);
      if (response.ok) {
        const json = await response.json();
        if (json.success && json.data) {
          const raw = json.data;
          return {
            id: raw.id || raw.order_code,
            orderCode: raw.order_code,
            customer: raw.customer,
            items: raw.items,
            paymentMethod: raw.payment_method,
            subtotal: raw.customer?.subtotal || raw.total_amount,
            discountAmount: raw.customer?.discountAmount || 0,
            shippingFee: raw.customer?.shippingFee || 0,
            totalAmount: raw.total_amount,
            couponCode: raw.customer?.couponCode,
            status: raw.status as OrderStatus,
            receivedAt: raw.received_at || raw.customer?._confirmed_received_at || null,
            createdAt: raw.created_at,
            updatedAt: raw.updated_at,
          };
        }
      }
      return null;
    } catch {
      return null;
    }
  },

  /**
   * Buyer confirms receipt of delivered order
   */
  async confirmReceived(orderId: string | number, token?: string): Promise<{ status: string; received_at: string }> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };
    if (token) headers['Authorization'] = `Bearer ${token}`;

    const res = await fetch(`/api/orders/${encodeURIComponent(String(orderId))}/confirm-received`, {
      method: 'POST',
      headers,
    });
    const json = await res.json();
    if (!res.ok || !json.success) {
      throw new Error(json.error || 'Không thể xác nhận đã nhận hàng');
    }
    return json.order;
  },

  /**
   * Fetch product reviews (or all reviews if productId omitted)
   */
  async getReviews(productId?: string): Promise<ProductReview[]> {
    try {
      const url = productId ? `/api/reviews?productId=${encodeURIComponent(productId)}` : '/api/reviews';
      const res = await fetch(url);
      if (!res.ok) return [];
      const json = await res.json();
      return json.success && Array.isArray(json.data) ? json.data : [];
    } catch {
      return [];
    }
  },

  /**
   * Submit a product review (within 15 days of receipt)
   */
  async submitReview(
    payload: {
      orderId: string | number;
      orderCode?: string;
      productId: string;
      productName?: string;
      rating: number;
      comment: string;
    },
    token?: string
  ): Promise<ProductReview> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };
    if (token) headers['Authorization'] = `Bearer ${token}`;

    const res = await fetch('/api/reviews', {
      method: 'POST',
      headers,
      body: JSON.stringify(payload),
    });
    const json = await res.json();
    if (!res.ok || !json.success) {
      throw new Error(json.error || 'Không thể gửi đánh giá sản phẩm');
    }
    return json.data;
  },
};
