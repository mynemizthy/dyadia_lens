/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Trash2, Plus, Minus, ArrowRight, ShoppingBag, Tag, Sparkles, Check, AlertCircle, LogIn, Package } from 'lucide-react';
import { useCart } from '../context/CartContext.tsx';
import { useAuth } from '../context/AuthContext.tsx';
import { formatCurrency } from '../lib/utils.ts';
import { LensIrisGraphic } from '../components/common/LensIrisGraphic.tsx';

export const Cart: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const {
    items,
    coupon,
    subtotal,
    discountAmount,
    shippingFee,
    totalAmount,
    updateQuantity,
    removeItem,
    clearCart,
    applyCoupon,
    removeCoupon,
  } = useCart();

  const [couponInput, setCouponInput] = useState('');
  const [couponFeedback, setCouponFeedback] = useState<{ success: boolean; message: string } | null>(null);

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponInput.trim()) return;
    const res = applyCoupon(couponInput);
    setCouponFeedback(res);
    if (res.success) {
      setCouponInput('');
    }
  };

  const handleClearCart = () => {
    if (confirm('Bạn có chắc chắn muốn xóa tất cả sản phẩm khỏi giỏ hàng?')) {
      clearCart();
    }
  };

  if (items.length === 0) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-24 text-center">
        <div className="w-20 h-20 bg-[#F2EDE4] rounded-full flex items-center justify-center mx-auto mb-6 text-slate-500">
          <ShoppingBag className="w-10 h-10 stroke-[1.2]" />
        </div>
        <h1 className="text-2xl font-serif font-medium text-slate-900">
          Giỏ hàng của bạn đang trống
        </h1>
        <p className="text-xs text-slate-500 mt-2 max-w-sm mx-auto leading-relaxed">
          Hãy khám phá các dòng kính áp tròng Hàn Quốc cao cấp của Dyadia Lens và lựa chọn độ cận riêng cho từng mắt nhé!
        </p>
        <Link
          to="/products"
          className="mt-8 inline-flex items-center gap-2 px-6 py-3 bg-[#D96B8A] text-white text-xs font-semibold rounded-full hover:bg-[#C24A6D] transition-colors shadow-sm"
        >
          <span>Bắt đầu mua sắm</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-4 pb-6 border-b border-rose-100 mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-serif font-normal text-slate-900">
            Giỏ Hàng Mua Sắm
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Mỗi mục trong giỏ thể hiện độ cận và đơn giá riêng cho từng chiếc lens lẻ.
          </p>
        </div>

        <button
          type="button"
          onClick={handleClearCart}
          className="text-xs text-rose-600 hover:text-rose-800 font-medium self-start sm:self-auto transition-colors"
        >
          Xóa toàn bộ giỏ hàng
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Left: Item list (8 cols) */}
        <div className="lg:col-span-8 space-y-4">
          <div className="bg-white border border-rose-100 rounded-2xl divide-y divide-slate-100 overflow-hidden shadow-xs">
            {items.map((item) => {
              const lineTotal = item.quantity * item.unitPrice;
              const maxStock = item.product.stock_quantity ?? 99;

              return (
                <div key={item.id} className="p-4 sm:p-6 flex flex-col sm:flex-row gap-4 sm:gap-6 items-start sm:items-center">
                  {/* Thumbnail / Iris Graphic */}
                  <div className="w-20 h-20 rounded-xl bg-[#FFF9FA] border border-slate-200 overflow-hidden shrink-0 flex items-center justify-center">
                    {item.product.image_url ? (
                      <img
                        src={item.product.image_url}
                        alt={item.product.product_name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <LensIrisGraphic colorName={item.product.color || 'Brown'} size={64} />
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex-1 space-y-1">
                    <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                      {item.product.collection}
                    </span>
                    <h3 className="text-sm font-semibold text-slate-900">
                      <Link to={`/products/${item.product.slug}`} className="hover:underline">
                        {item.product.product_name}
                      </Link>
                    </h3>
                    <div className="flex flex-wrap items-center gap-3 text-xs text-slate-600 pt-0.5">
                      {item.product.color && <span>Màu: <strong>{item.product.color}</strong></span>}
                      {item.prescriptionPower && item.prescriptionPower !== 'Tiêu chuẩn' && (
                        <>
                          <span aria-hidden="true">·</span>
                          <span className="bg-slate-100 px-2 py-0.5 rounded font-medium text-slate-800">
                            Độ cận: <strong>{item.prescriptionPower}</strong>
                          </span>
                        </>
                      )}
                      <span aria-hidden="true">·</span>
                      <span className="font-mono text-[11px] text-slate-400">SKU: {item.product.sku}</span>
                    </div>

                    <div className="text-xs text-slate-500 pt-1 flex items-center gap-2">
                      <span className="tabular-nums font-medium text-slate-700">
                        {formatCurrency(item.unitPrice)}
                      </span>
                      <span className="text-[10px] text-slate-400 font-normal">
                        {item.product.product_type === 'lens_solution' || item.product.product_type === 'accessory'
                          ? '/ 1 sản phẩm'
                          : '/ 1 chiếc lens'}
                      </span>
                    </div>

                    {item.product.replacement_period_days === 1 && (
                      <div className="pt-1">
                        <span className="inline-flex items-center gap-1.5 px-2 py-0.5 bg-amber-50 border border-amber-200/70 rounded-md text-[11px] text-amber-900 font-medium">
                          <Package className="w-3 h-3 text-amber-600 shrink-0" />
                          <span>
                            {item.quantity >= 10
                              ? 'Quy cách: Nguyên hộp 10 chiếc'
                              : `Quy cách: ${item.quantity} vỉ lẻ vô trùng (Mua từ 10 chiếc cùng độ để có hộp)`}
                          </span>
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Quantity Stepper & Price */}
                  <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto pt-2 sm:pt-0 border-t sm:border-0 border-slate-100">
                    <div className="inline-flex items-center border border-slate-300 rounded-lg bg-white overflow-hidden shadow-2xs">
                      <button
                        type="button"
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="p-1.5 text-slate-600 hover:text-slate-950 hover:bg-slate-50 transition-colors"
                        aria-label="Giảm 1 chiếc"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="w-10 text-center text-xs font-bold text-slate-900 tabular-nums">
                        {item.quantity}
                      </span>
                      <button
                        type="button"
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        disabled={item.quantity >= maxStock}
                        className="p-1.5 text-slate-600 hover:text-slate-950 hover:bg-slate-50 disabled:opacity-30 transition-colors"
                        aria-label="Tăng 1 chiếc"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="text-right min-w-[90px]">
                      <span className="text-sm font-bold text-slate-900 tabular-nums">
                        {formatCurrency(lineTotal)}
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={() => removeItem(item.id)}
                      className="p-1.5 text-slate-400 hover:text-rose-600 rounded transition-colors"
                      title="Xóa chiếc lens này"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="pt-2">
            <Link
              to="/products"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-700 hover:text-slate-950"
            >
              <span>← Tiếp tục chọn thêm lens</span>
            </Link>
          </div>
        </div>

        {/* Right: Cart Summary (4 cols) */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white border border-rose-100 rounded-2xl p-6 shadow-xs space-y-6">
            <h2 className="text-base font-semibold text-slate-900 pb-3 border-b border-slate-100">
              Tổng quan đơn hàng
            </h2>

            {/* Calculations breakdown */}
            <div className="space-y-3 text-xs">
              <div className="flex justify-between text-slate-600">
                <span>Tạm tính ({items.reduce((s, i) => s + i.quantity, 0)} chiếc lens):</span>
                <span className="font-semibold text-slate-900 tabular-nums">{formatCurrency(subtotal)}</span>
              </div>

              {discountAmount > 0 && (
                <div className="flex justify-between text-emerald-700 font-medium">
                  <span>Giảm giá khuyến mãi ({coupon?.code}):</span>
                  <span className="tabular-nums">-{formatCurrency(discountAmount)}</span>
                </div>
              )}

              <div className="flex justify-between text-slate-600 items-baseline">
                <div>
                  <span>Phí vận chuyển:</span>
                  <p className="text-[10px] text-slate-400">
                    {subtotal >= 299000 ? 'Đã đạt miễn phí ship' : 'Miễn phí cho đơn từ 299.000đ'}
                  </p>
                </div>
                <span className="font-semibold text-slate-900 tabular-nums">
                  {shippingFee === 0 ? 'Miễn phí' : formatCurrency(shippingFee)}
                </span>
              </div>

              <div className="pt-4 border-t border-slate-100 flex justify-between items-baseline">
                <div>
                  <span className="text-sm font-bold text-slate-900">Tổng thanh toán:</span>
                  <p className="text-[10px] text-slate-400">(Đã bao gồm VAT nếu có)</p>
                </div>
                <span className="text-xl font-bold text-slate-950 tabular-nums">
                  {formatCurrency(totalAmount)}
                </span>
              </div>
            </div>

            {/* Coupon Code Section */}
            <div className="pt-4 border-t border-slate-100 space-y-3">
              <label className="text-xs font-semibold text-slate-800 flex items-center gap-1.5">
                <Tag className="w-3.5 h-3.5 text-slate-500" />
                Mã ưu đãi giảm giá
              </label>

              {coupon ? (
                <div className="flex items-center justify-between p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-900">
                  <div>
                    <span className="font-bold">{coupon.code}</span>
                    <p className="text-[11px] text-emerald-700">{coupon.description}</p>
                  </div>
                  <button
                    type="button"
                    onClick={removeCoupon}
                    className="text-xs text-rose-600 hover:underline font-medium ml-2"
                  >
                    Bỏ mã
                  </button>
                </div>
              ) : (
                <form onSubmit={handleApplyCoupon} className="flex gap-2">
                  <input
                    type="text"
                    value={couponInput}
                    onChange={(e) => setCouponInput(e.target.value)}
                    placeholder="Nhập mã (VD: WELCOME10)"
                    className="flex-1 px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-rose-400 uppercase"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2 bg-[#D96B8A] text-white text-xs font-semibold rounded-lg hover:bg-[#C24A6D] transition-colors"
                  >
                    Áp dụng
                  </button>
                </form>
              )}

              {couponFeedback && (
                <p
                  className={`text-xs flex items-center gap-1 ${
                    couponFeedback.success ? 'text-emerald-700' : 'text-rose-600'
                  }`}
                >
                  {couponFeedback.success ? (
                    <Check className="w-3.5 h-3.5" />
                  ) : (
                    <AlertCircle className="w-3.5 h-3.5" />
                  )}
                  {couponFeedback.message}
                </p>
              )}

              {/* Available coupon suggestions */}
              <div className="bg-[#FFF9FA] p-2.5 rounded-lg text-[11px] text-slate-600 space-y-1">
                <span className="font-semibold text-slate-800">Mã ưu đãi hiện có:</span>
                <p>• <strong>WELCOME10</strong>: Giảm 10%</p>
                <p>• <strong>FREESHIP</strong>: Miễn phí vận chuyển</p>
                <p>• <strong>LENS50K</strong>: Giảm 50k cho đơn từ 399k</p>
              </div>
            </div>

            {/* Checkout Button */}
            <div className="pt-2 space-y-2">
              <button
                type="button"
                onClick={() => {
                  if (!user) {
                    navigate('/login', { state: { from: { pathname: '/checkout' } } });
                  } else {
                    navigate('/checkout');
                  }
                }}
                className="w-full py-3.5 px-6 text-sm font-semibold text-white bg-[#D96B8A] hover:bg-[#C24A6D] rounded-xl transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>{user ? 'Tiến hành đặt hàng' : 'Đăng nhập để đặt hàng'}</span>
                {user ? <ArrowRight className="w-4 h-4" /> : <LogIn className="w-4 h-4" />}
              </button>
              {!user && (
                <p className="text-[11px] text-center text-slate-500">
                  Khách vãng lai vui lòng đăng nhập hoặc đăng ký để hoàn tất thanh toán.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
