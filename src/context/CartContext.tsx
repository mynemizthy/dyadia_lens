/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import { Product } from '../types/product.ts';
import { CartItem, AppliedCoupon, CartState } from '../types/cart.ts';

const CART_STORAGE_KEY = 'dyadia_cart_items_v1';
const FREE_SHIPPING_THRESHOLD = 299000;
const STANDARD_SHIPPING_FEE = 30000;

const VALID_COUPONS: Record<string, AppliedCoupon> = {
  WELCOME10: {
    code: 'WELCOME10',
    discountType: 'percentage',
    value: 10,
    description: 'Giảm 10% tổng tiền sản phẩm',
  },
  FREESHIP: {
    code: 'FREESHIP',
    discountType: 'free_shipping',
    value: 30000,
    description: 'Miễn phí vận chuyển toàn quốc',
  },
  LENS50K: {
    code: 'LENS50K',
    discountType: 'fixed',
    value: 50000,
    minOrderValue: 399000,
    description: 'Giảm 50.000đ cho đơn hàng từ 399.000đ',
  },
};

type CartAction =
  | { type: 'ADD_ITEM'; payload: { product: Product; prescriptionPower: string; quantity: number } }
  | { type: 'REMOVE_ITEM'; payload: { itemId: string } }
  | { type: 'UPDATE_QUANTITY'; payload: { itemId: string; quantity: number } }
  | { type: 'CLEAR_CART' }
  | { type: 'APPLY_COUPON'; payload: { coupon: AppliedCoupon } }
  | { type: 'REMOVE_COUPON' }
  | { type: 'LOAD_CART'; payload: CartItem[] };

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case 'LOAD_CART':
      return {
        ...state,
        items: action.payload,
      };

    case 'ADD_ITEM': {
      const { product, prescriptionPower, quantity } = action.payload;
      const itemId = `${product.id}_${prescriptionPower}`;
      const existingIndex = state.items.findIndex((item) => item.id === itemId);

      // Price per single lens
      const unitPrice = product.price ?? 95000;

      if (existingIndex > -1) {
        // Merge identical product + power: increase quantity
        const updatedItems = [...state.items];
        const newQty = updatedItems[existingIndex].quantity + quantity;
        const maxStock = product.stock_quantity ?? 999;
        updatedItems[existingIndex] = {
          ...updatedItems[existingIndex],
          quantity: Math.min(newQty, maxStock),
          unitPrice,
        };
        return { ...state, items: updatedItems };
      }

      // Add new separate line
      const newItem: CartItem = {
        id: itemId,
        productId: product.id,
        product,
        prescriptionPower,
        quantity,
        unitPrice,
      };

      return {
        ...state,
        items: [...state.items, newItem],
      };
    }

    case 'UPDATE_QUANTITY': {
      const { itemId, quantity } = action.payload;
      if (quantity <= 0) {
        return {
          ...state,
          items: state.items.filter((item) => item.id !== itemId),
        };
      }
      return {
        ...state,
        items: state.items.map((item) =>
          item.id === itemId ? { ...item, quantity } : item
        ),
      };
    }

    case 'REMOVE_ITEM':
      return {
        ...state,
        items: state.items.filter((item) => item.id !== action.payload.itemId),
      };

    case 'CLEAR_CART':
      return {
        ...state,
        items: [],
        coupon: null,
      };

    case 'APPLY_COUPON':
      return {
        ...state,
        coupon: action.payload.coupon,
      };

    case 'REMOVE_COUPON':
      return {
        ...state,
        coupon: null,
      };

    default:
      return state;
  }
}

interface CartContextValue {
  items: CartItem[];
  coupon: AppliedCoupon | null;
  totalQuantity: number;
  subtotal: number;
  discountAmount: number;
  shippingFee: number;
  totalAmount: number;
  addItem: (product: Product, prescriptionPower: string, quantity?: number) => void;
  removeItem: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;
  applyCoupon: (code: string) => { success: boolean; message: string };
  removeCoupon: () => void;
}

const CartContext = createContext<CartContextValue | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, {
    items: [],
    coupon: null,
  });

  // Load cart from localStorage once on mount
  useEffect(() => {
    try {
      const raw = localStorage.getItem(CART_STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) {
          dispatch({ type: 'LOAD_CART', payload: parsed });
        }
      }
    } catch (err) {
      console.error('Error reading cart from localStorage:', err);
    }
  }, []);

  // Save cart to localStorage on item change
  useEffect(() => {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(state.items));
    } catch (err) {
      console.error('Error saving cart to localStorage:', err);
    }
  }, [state.items]);

  // Calculations
  const totalQuantity = state.items.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = state.items.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0);

  // Shipping calculation
  let shippingFee = subtotal >= FREE_SHIPPING_THRESHOLD || subtotal === 0 ? 0 : STANDARD_SHIPPING_FEE;
  if (state.coupon?.discountType === 'free_shipping') {
    shippingFee = 0;
  }

  // Discount calculation
  let discountAmount = 0;
  if (state.coupon) {
    if (state.coupon.discountType === 'percentage') {
      discountAmount = Math.round((subtotal * state.coupon.value) / 100);
    } else if (state.coupon.discountType === 'fixed') {
      if (!state.coupon.minOrderValue || subtotal >= state.coupon.minOrderValue) {
        discountAmount = state.coupon.value;
      }
    }
  }

  const totalAmount = Math.max(0, subtotal - discountAmount + shippingFee);

  const addItem = (product: Product, prescriptionPower: string, quantity = 1) => {
    dispatch({
      type: 'ADD_ITEM',
      payload: { product, prescriptionPower, quantity },
    });
  };

  const removeItem = (itemId: string) => {
    dispatch({ type: 'REMOVE_ITEM', payload: { itemId } });
  };

  const updateQuantity = (itemId: string, quantity: number) => {
    dispatch({ type: 'UPDATE_QUANTITY', payload: { itemId, quantity } });
  };

  const clearCart = () => {
    dispatch({ type: 'CLEAR_CART' });
  };

  const applyCoupon = (code: string) => {
    const cleanCode = code.trim().toUpperCase();
    const found = VALID_COUPONS[cleanCode];
    if (!found) {
      return { success: false, message: 'Mã giảm giá không hợp lệ hoặc đã hết hạn.' };
    }
    if (found.minOrderValue && subtotal < found.minOrderValue) {
      return {
        success: false,
        message: `Mã ${cleanCode} chỉ áp dụng cho đơn hàng từ ${new Intl.NumberFormat('vi-VN').format(found.minOrderValue)}đ.`,
      };
    }
    dispatch({ type: 'APPLY_COUPON', payload: { coupon: found } });
    return { success: true, message: `Áp dụng mã ${cleanCode} thành công!` };
  };

  const removeCoupon = () => {
    dispatch({ type: 'REMOVE_COUPON' });
  };

  return (
    <CartContext.Provider
      value={{
        items: state.items,
        coupon: state.coupon,
        totalQuantity,
        subtotal,
        discountAmount,
        shippingFee,
        totalAmount,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        applyCoupon,
        removeCoupon,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
