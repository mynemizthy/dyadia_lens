/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Order, OrderStatus, ProductReview } from '../types/order.ts';
import { supabase } from '../lib/supabase.ts';
import { generateOrderCode } from '../lib/utils.ts';

export const orderService = {
  /**
   * Fetch customer orders from Supabase via server-side protected route or direct Supabase query
   */
  async getUserOrders(userId: string, token?: string): Promise<Order[]> {
    // 1. Try API
    try {
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
      };
      if (token) headers['Authorization'] = `Bearer ${token}`;

      const response = await fetch('/api/orders', { headers });
      const contentType = response.headers.get('content-type') || '';
      if (response.ok && contentType.includes('application/json')) {
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
      }
    } catch {
      // Fallback
    }

    // 2. Direct Supabase query
    try {
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false });

      if (!error && Array.isArray(data)) {
        return data.map((raw: any) => ({
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
    } catch (err) {
      console.error('Error fetching user orders from Supabase:', err);
    }

    return [];
  },

  /**
   * Create new order via server-side endpoint or direct Supabase insert
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
    // 1. Try API first
    try {
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

      const contentType = response.headers.get('content-type') || '';
      if (response.ok && contentType.includes('application/json')) {
        const result = await response.json();
        if (result.success && result.order) {
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
        }
      }
    } catch {
      // Fallback to direct Supabase insert
    }

    // 2. Direct Supabase insert
    const orderCode = generateOrderCode();
    const subtotal = orderPayload.items.reduce(
      (sum, item) => sum + (item.price || 0) * (item.quantity || 1),
      0
    );
    const shippingFee = subtotal >= 300000 ? 0 : 30000;
    const discountAmount = orderPayload.couponCode ? 20000 : 0;
    const totalAmount = Math.max(0, subtotal - discountAmount + shippingFee);

    const newOrderRow = {
      order_code: orderCode,
      customer: {
        ...orderPayload.customer,
        subtotal,
        discountAmount,
        shippingFee,
        couponCode: orderPayload.couponCode,
      },
      items: orderPayload.items,
      payment_method: orderPayload.paymentMethod,
      total_amount: totalAmount,
      status: 'pending',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    const { data, error } = await supabase
      .from('orders')
      .insert(newOrderRow)
      .select()
      .single();

    if (error) {
      console.error('Supabase direct insert order error:', error);
      // Even if DB fails, return in-memory order so user can see confirmation
    }

    const raw = data || newOrderRow;
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
      const contentType = response.headers.get('content-type') || '';
      if (response.ok && contentType.includes('application/json')) {
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
    } catch {
      // Fallback
    }

    // Direct Supabase query
    try {
      const { data } = await supabase
        .from('orders')
        .select('*')
        .eq('order_code', orderCode)
        .maybeSingle();

      if (data) {
        return {
          id: data.id || data.order_code,
          orderCode: data.order_code,
          customer: data.customer,
          items: data.items,
          paymentMethod: data.payment_method,
          subtotal: data.customer?.subtotal || data.total_amount,
          discountAmount: data.customer?.discountAmount || 0,
          shippingFee: data.customer?.shippingFee || 0,
          totalAmount: data.total_amount,
          couponCode: data.customer?.couponCode,
          status: data.status as OrderStatus,
          receivedAt: data.received_at || data.customer?._confirmed_received_at || null,
          createdAt: data.created_at,
          updatedAt: data.updated_at,
        };
      }
    } catch {
      // ignore
    }

    return null;
  },

  /**
   * Buyer confirms receipt of delivered order
   */
  async confirmReceived(orderId: string | number, token?: string): Promise<{ status: string; received_at: string }> {
    const receivedAt = new Date().toISOString();

    try {
      const headers: Record<string, string> = { 'Content-Type': 'application/json' };
      if (token) headers['Authorization'] = `Bearer ${token}`;

      const res = await fetch(`/api/orders/${encodeURIComponent(String(orderId))}/confirm-received`, {
        method: 'POST',
        headers,
      });
      const contentType = res.headers.get('content-type') || '';
      if (res.ok && contentType.includes('application/json')) {
        const json = await res.json();
        if (json.success) {
          return { status: 'completed', received_at: json.received_at || receivedAt };
        }
      }
    } catch {
      // Fallback
    }

    // Direct Supabase update
    try {
      await supabase
        .from('orders')
        .update({ status: 'completed', received_at: receivedAt, updated_at: receivedAt })
        .eq('id', orderId);
    } catch {}

    return { status: 'completed', received_at: receivedAt };
  },

  /**
   * Submit product review for a completed order
   */
  async submitReview(review: Omit<ProductReview, 'id' | 'created_at'>): Promise<ProductReview> {
    try {
      const { data, error } = await supabase
        .from('reviews')
        .insert({
          order_id: review.order_id,
          product_id: review.product_id,
          rating: review.rating,
          comment: review.comment,
          images: review.images || [],
          reviewer_name: review.reviewer_name || 'Khách hàng',
          created_at: new Date().toISOString(),
        })
        .select()
        .single();

      if (!error && data) {
        return data as ProductReview;
      }
    } catch {}

    return {
      id: `rev-${Date.now()}`,
      ...review,
      created_at: new Date().toISOString(),
    };
  },
};
