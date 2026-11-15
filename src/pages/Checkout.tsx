/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  CreditCard,
  QrCode,
  Truck,
  ShieldCheck,
  CheckCircle,
  AlertCircle,
  Smartphone,
  Building,
} from 'lucide-react';
import { useCart } from '../context/CartContext.tsx';
import { orderService } from '../services/orderService.ts';
import { formatCurrency, generateOrderCode } from '../lib/utils.ts';
import { PaymentMethod } from '../types/order.ts';

import { useAuth } from '../context/AuthContext.tsx';

// Vietnamese Phone regex: starts with 0 and has 10 digits total
const phoneRegex = /^(03|05|07|08|09)\d{8}$/;

const checkoutSchema = z.object({
  fullName: z.string().min(2, 'Họ và tên phải có ít nhất 2 ký tự'),
  phone: z.string().regex(phoneRegex, 'Số điện thoại không hợp lệ (10 số, bắt đầu bằng 0)'),
  email: z.string().min(1, 'Vui lòng nhập địa chỉ email').email('Địa chỉ email không hợp lệ (ví dụ: name@gmail.com)'),
  province: z.string().min(2, 'Vui lòng chọn hoặc nhập Tỉnh/Thành phố'),
  district: z.string().min(2, 'Vui lòng chọn hoặc nhập Quận/Huyện'),
  address: z.string().min(5, 'Địa chỉ chi tiết phải có ít nhất 5 ký tự'),
  note: z.string().optional(),
});

type CheckoutFormData = z.infer<typeof checkoutSchema>;

export const Checkout: React.FC = () => {
  const navigate = useNavigate();
  const { user, profile, getAccessToken } = useAuth();
  const { items, subtotal, discountAmount, shippingFee, totalAmount, coupon, clearCart } = useCart();
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('cod');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [checkoutError, setCheckoutError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<CheckoutFormData>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      fullName: profile?.full_name || '',
      phone: profile?.phone || '',
      email: user?.email || '',
      province: '',
      district: '',
      address: '',
      note: '',
    },
  });

  React.useEffect(() => {
    if (profile?.full_name) setValue('fullName', profile.full_name);
    if (profile?.phone) setValue('phone', profile.phone);
    if (user?.email) setValue('email', user.email);
  }, [profile, user, setValue]);

  if (items.length === 0) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center">
        <h2 className="text-2xl font-serif font-medium text-slate-800">
          Chưa có sản phẩm nào trong giỏ hàng
        </h2>
        <p className="text-xs text-slate-500 mt-2">
          Vui lòng thêm lens vào giỏ hàng trước khi thanh toán.
        </p>
        <Link
          to="/products"
          className="mt-6 inline-block px-5 py-2.5 text-xs font-semibold text-white bg-[#D96B8A] rounded-lg"
        >
          Chọn sản phẩm ngay
        </Link>
      </div>
    );
  }

  const onSubmit = async (data: CheckoutFormData) => {
    setIsSubmitting(true);
    setCheckoutError(null);
    try {
      const token = getAccessToken();
      const newOrder = await orderService.createOrder({
        userId: user?.id || undefined,
        customer: {
          fullName: data.fullName,
          phone: data.phone,
          email: data.email,
          province: data.province,
          district: data.district,
          address: data.address,
          note: data.note || undefined,
          userId: user?.id || undefined,
        },
        items: [...items],
        paymentMethod,
        couponCode: coupon?.code,
        subtotal,
        discountAmount,
        shippingFee,
        totalAmount,
        token: token || undefined,
      });

      // Clear cart ONLY after successful order creation
      clearCart();

      // Redirect to confirmation page
      navigate(`/order-success/${newOrder.orderCode}`);
    } catch (err: unknown) {
      console.error('Lỗi khi tạo đơn hàng:', err);
      const msg = err instanceof Error ? err.message : 'Đã xảy ra lỗi khi tạo đơn hàng';
      setCheckoutError(msg);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      <div className="mb-8">
        <div className="flex items-center gap-2 text-xs text-slate-500 mb-2">
          <Link to="/cart" className="hover:text-slate-900">Giỏ hàng</Link>
          <span>/</span>
          <span className="text-slate-900 font-medium">Thanh toán & Đặt hàng</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-serif font-normal text-slate-900">
          Thông Tin Giao Hàng & Thanh Toán
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Vui lòng kiểm tra thông tin người nhận và lựa chọn phương thức thanh toán phù hợp.
        </p>
      </div>

      {checkoutError && (
        <div className="mb-8 p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-900 text-xs flex items-start gap-3 shadow-xs">
          <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
          <div className="flex-1 leading-relaxed">
            <p className="font-semibold text-rose-950 mb-0.5">Không thể hoàn tất đặt hàng</p>
            <p>{checkoutError}</p>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Left: Customer Information & Payment Methods (7 cols) */}
          <div className="lg:col-span-7 space-y-8">
            {/* Customer Info Card */}
            <div className="bg-white border border-rose-100 rounded-2xl p-6 shadow-xs space-y-4">
              <h2 className="text-base font-semibold text-slate-900 pb-3 border-b border-slate-100">
                1. Thông tin người nhận
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Full name */}
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">
                    Họ và tên <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    {...register('fullName')}
                    placeholder="Nguyễn Văn A"
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-rose-400"
                  />
                  {errors.fullName && (
                    <p className="text-[11px] text-rose-600 mt-1">{errors.fullName.message}</p>
                  )}
                </div>

                {/* Phone */}
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">
                    Số điện thoại <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="tel"
                    {...register('phone')}
                    placeholder="0912345678"
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-rose-400"
                  />
                  {errors.phone && (
                    <p className="text-[11px] text-rose-600 mt-1">{errors.phone.message}</p>
                  )}
                </div>
              </div>

              {/* Email */}
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  Email nhận thông tin đơn hàng & thông báo giao vận <span className="text-rose-500">*</span>
                </label>
                <input
                  type="email"
                  {...register('email')}
                  placeholder="name@example.com"
                  className={`w-full px-3 py-2 text-xs bg-slate-50 border rounded-lg focus:outline-none focus:ring-1 focus:ring-rose-400 ${
                    errors.email ? 'border-rose-400 bg-rose-50/20' : 'border-slate-200'
                  }`}
                />
                {errors.email ? (
                  <p className="text-[11px] text-rose-600 mt-1">{errors.email.message}</p>
                ) : (
                  <p className="text-[10px] text-slate-400 mt-1">
                    Dyadia sẽ gửi email xác nhận kèm mã đơn hàng và hướng dẫn giao nhận tới địa chỉ này.
                  </p>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Province */}
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">
                    Tỉnh / Thành phố <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    {...register('province')}
                    placeholder="TP. Hồ Chí Minh, Hà Nội, Đà Nẵng..."
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-rose-400"
                  />
                  {errors.province && (
                    <p className="text-[11px] text-rose-600 mt-1">{errors.province.message}</p>
                  )}
                </div>

                {/* District */}
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">
                    Quận / Huyện <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    {...register('district')}
                    placeholder="TP. Thủ Đức, Quận 1, Quận 3..."
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-rose-400"
                  />
                  {errors.district && (
                    <p className="text-[11px] text-rose-600 mt-1">{errors.district.message}</p>
                  )}
                </div>
              </div>

              {/* Street Address */}
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  Địa chỉ chi tiết (Số nhà, tên đường, tòa nhà) <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  {...register('address')}
                  placeholder="Số nhà, tên đường, phường/xã..."
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-rose-400"
                />
                {errors.address && (
                  <p className="text-[11px] text-rose-600 mt-1">{errors.address.message}</p>
                )}
              </div>

              {/* Order Notes */}
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  Ghi chú đơn hàng (Thời gian nhận, dặn dò giao hàng)
                </label>
                <textarea
                  {...register('note')}
                  rows={2}
                  placeholder="Ví dụ: Gọi trước khi giao, giao giờ hành chính..."
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-rose-400"
                />
              </div>
            </div>

            {/* Payment Method Selection */}
            <div className="bg-white border border-rose-100 rounded-2xl p-6 shadow-xs space-y-4">
              <h2 className="text-base font-semibold text-slate-900 pb-3 border-b border-slate-100">
                2. Phương thức thanh toán
              </h2>

              <div className="space-y-3">
                {/* 1. COD */}
                <label
                  className={`flex items-start gap-3.5 p-3.5 rounded-xl border cursor-pointer transition-all ${
                    paymentMethod === 'cod'
                      ? 'border-[#D96B8A] bg-slate-50/70 shadow-xs'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <input
                    type="radio"
                    name="payment"
                    value="cod"
                    checked={paymentMethod === 'cod'}
                    onChange={() => setPaymentMethod('cod')}
                    className="mt-0.5 accent-slate-900"
                  />
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <Truck className="w-4 h-4 text-slate-700" />
                      <span className="text-xs font-semibold text-slate-900">
                        Thanh toán khi nhận hàng (COD)
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      Bạn thanh toán bằng tiền mặt trực tiếp cho nhân viên giao hàng khi nhận kiện lens.
                    </p>
                  </div>
                </label>

                {/* 2. Bank Transfer (VietQR) */}
                <label
                  className={`flex items-start gap-3.5 p-3.5 rounded-xl border cursor-pointer transition-all ${
                    paymentMethod === 'bank_transfer'
                      ? 'border-[#D96B8A] bg-slate-50/70 shadow-xs'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <input
                    type="radio"
                    name="payment"
                    value="bank_transfer"
                    checked={paymentMethod === 'bank_transfer'}
                    onChange={() => setPaymentMethod('bank_transfer')}
                    className="mt-0.5 accent-slate-900"
                  />
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <Building className="w-4 h-4 text-slate-700" />
                      <span className="text-xs font-semibold text-slate-900">
                        Chuyển khoản ngân hàng (VietQR)
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      Quét mã QR chuyển khoản qua ứng dụng ngân hàng hoặc Internet Banking.
                    </p>

                    {paymentMethod === 'bank_transfer' && (
                      <div className="mt-3 p-3 bg-white border border-slate-200 rounded-lg text-xs space-y-1 text-slate-700">
                        <p>• Ngân hàng: <strong>ACB (Ngân hàng TMCP Á Châu)</strong></p>
                        <p>• Số tài khoản: <strong>00006222165</strong></p>
                        <p>• Chủ tài khoản: <strong>CỬA HÀNG DYADIA</strong></p>
                        <p>• Cú pháp: <strong>[Tên bạn] [Số điện thoại]</strong></p>
                      </div>
                    )}
                  </div>
                </label>

                {/* 3. MoMo */}
                <label
                  className={`flex items-start gap-3.5 p-3.5 rounded-xl border cursor-pointer transition-all ${
                    paymentMethod === 'momo'
                      ? 'border-[#D96B8A] bg-slate-50/70 shadow-xs'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <input
                    type="radio"
                    name="payment"
                    value="momo"
                    checked={paymentMethod === 'momo'}
                    onChange={() => setPaymentMethod('momo')}
                    className="mt-0.5 accent-slate-900"
                  />
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <Smartphone className="w-4 h-4 text-pink-600" />
                      <span className="text-xs font-semibold text-slate-900">Ví MoMo</span>
                    </div>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      Thanh toán nhanh chóng bằng quét mã qua ứng dụng MoMo.
                    </p>
                  </div>
                </label>

                {/* 4. ZaloPay */}
                <label
                  className={`flex items-start gap-3.5 p-3.5 rounded-xl border cursor-pointer transition-all ${
                    paymentMethod === 'zalopay'
                      ? 'border-[#D96B8A] bg-slate-50/70 shadow-xs'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <input
                    type="radio"
                    name="payment"
                    value="zalopay"
                    checked={paymentMethod === 'zalopay'}
                    onChange={() => setPaymentMethod('zalopay')}
                    className="mt-0.5 accent-slate-900"
                  />
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <Smartphone className="w-4 h-4 text-blue-600" />
                      <span className="text-xs font-semibold text-slate-900">Ví ZaloPay</span>
                    </div>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      Xác nhận thanh toán qua cổng ZaloPay liên kết.
                    </p>
                  </div>
                </label>

                {/* 5. ATM / Visa */}
                <label
                  className={`flex items-start gap-3.5 p-3.5 rounded-xl border cursor-pointer transition-all ${
                    paymentMethod === 'atm_card'
                      ? 'border-[#D96B8A] bg-slate-50/70 shadow-xs'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <input
                    type="radio"
                    name="payment"
                    value="atm_card"
                    checked={paymentMethod === 'atm_card'}
                    onChange={() => setPaymentMethod('atm_card')}
                    className="mt-0.5 accent-slate-900"
                  />
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <CreditCard className="w-4 h-4 text-slate-700" />
                      <span className="text-xs font-semibold text-slate-900">
                        Thẻ ATM Nội Địa / Thẻ Quốc Tế Visa/MasterCard
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      Cổng thanh toán bảo mật tiêu chuẩn OnePay / Napas.
                    </p>
                  </div>
                </label>
              </div>
            </div>
          </div>

          {/* Right: Order Summary (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white border border-rose-100 rounded-2xl p-6 shadow-xs space-y-6">
              <h2 className="text-base font-semibold text-slate-900 pb-3 border-b border-slate-100">
                Đơn hàng của bạn ({items.reduce((s, i) => s + i.quantity, 0)} chiếc lens)
              </h2>

              {/* Itemized lens lines */}
              <div className="space-y-3 max-h-80 overflow-y-auto pr-1 divide-y divide-slate-100">
                {items.map((item) => (
                  <div key={item.id} className="pt-3 first:pt-0 flex items-start justify-between gap-3 text-xs">
                    <div>
                      <h4 className="font-semibold text-slate-900">{item.product.product_name}</h4>
                      <p className="text-[11px] text-slate-500">
                        Màu: {item.product.color} · Độ: <strong>{item.prescriptionPower}</strong>
                      </p>
                      <p className="text-[11px] text-slate-400">
                        {formatCurrency(item.unitPrice)} × {item.quantity} chiếc
                      </p>
                    </div>
                    <span className="font-bold text-slate-900 tabular-nums shrink-0">
                      {formatCurrency(item.quantity * item.unitPrice)}
                    </span>
                  </div>
                ))}
              </div>

              {/* Breakdown */}
              <div className="pt-4 border-t border-slate-100 space-y-2 text-xs">
                <div className="flex justify-between text-slate-600">
                  <span>Tạm tính:</span>
                  <span className="font-semibold text-slate-900 tabular-nums">{formatCurrency(subtotal)}</span>
                </div>
                {discountAmount > 0 && (
                  <div className="flex justify-between text-emerald-700 font-medium">
                    <span>Giảm giá ({coupon?.code}):</span>
                    <span className="tabular-nums">-{formatCurrency(discountAmount)}</span>
                  </div>
                )}
                <div className="flex justify-between text-slate-600">
                  <span>Phí vận chuyển:</span>
                  <span className="font-semibold text-slate-900 tabular-nums">
                    {shippingFee === 0 ? 'Miễn phí' : formatCurrency(shippingFee)}
                  </span>
                </div>
                <div className="pt-3 border-t border-slate-100 flex justify-between items-baseline">
                  <span className="text-sm font-bold text-slate-900">Tổng thanh toán:</span>
                  <span className="text-xl font-bold text-slate-950 tabular-nums">
                    {formatCurrency(totalAmount)}
                  </span>
                </div>
              </div>

              {/* Submit CTA */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3.5 px-6 text-sm font-semibold text-white bg-[#D96B8A] hover:bg-[#C24A6D] disabled:opacity-50 rounded-xl transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer"
              >
                {isSubmitting ? (
                  <span>Đang xử lý đơn hàng...</span>
                ) : (
                  <>
                    <CheckCircle className="w-4 h-4" />
                    <span>Xác nhận đặt hàng ngay</span>
                  </>
                )}
              </button>

              <div className="flex items-center gap-2 text-[11px] text-slate-500 justify-center">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Bảo mật thông tin khách hàng tuyệt đối</span>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};
