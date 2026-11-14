/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { CheckCircle2, PackageCheck, Truck, ArrowRight, Printer, Sparkles } from 'lucide-react';
import { orderService } from '../services/orderService.ts';
import { Order, getOrderStatusLabel } from '../types/order.ts';
import { formatCurrency } from '../lib/utils.ts';
import { LensIrisGraphic } from '../components/common/LensIrisGraphic.tsx';

export const OrderSuccess: React.FC = () => {
  const { code } = useParams<{ code: string }>();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadOrder() {
      if (!code) return;
      try {
        const found = await orderService.getOrderByCode(code);
        setOrder(found);
      } catch (err) {
        console.error('Error loading order success:', err);
      } finally {
        setLoading(false);
      }
    }
    loadOrder();
  }, [code]);

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center">
        <div className="w-12 h-12 border-2 border-[#D96B8A] border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-xs text-slate-500 mt-4">Đang tra cứu thông tin đơn hàng...</p>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center">
        <h2 className="text-2xl font-serif text-slate-800">Không tìm thấy mã đơn hàng</h2>
        <p className="text-xs text-slate-500 mt-2">
          Mã đơn hàng &quot;{code}&quot; không tồn tại hoặc đã hết hạn phiên làm việc.
        </p>
        <Link
          to="/"
          className="mt-6 inline-block px-5 py-2.5 text-xs font-semibold text-white bg-[#D96B8A] rounded-lg"
        >
          Trở về trang chủ
        </Link>
      </div>
    );
  }

  const paymentMethodLabel = {
    cod: 'Thanh toán khi nhận hàng (COD)',
    bank_transfer: 'Chuyển khoản ngân hàng (VietQR)',
    momo: 'Ví MoMo',
    zalopay: 'Ví ZaloPay',
    atm_card: 'Thẻ ATM / Thẻ Quốc tế',
  }[order.paymentMethod];

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
      {/* Success Badge Banner */}
      <div className="text-center space-y-3 pb-8 border-b border-rose-100">
        <div className="w-16 h-16 bg-emerald-50 border border-emerald-200 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-xs">
          <CheckCircle2 className="w-9 h-9 stroke-[1.7]" />
        </div>
        <span className="inline-block text-xs uppercase tracking-widest font-semibold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full">
          Đặt Hàng Thành Công
        </span>
        <h1 className="text-3xl font-serif font-normal text-slate-900">
          Cảm ơn bạn đã lựa chọn Dyadia Lens!
        </h1>
        <p className="text-xs text-slate-500 max-w-md mx-auto">
          Mã đơn hàng của bạn là <strong className="font-mono text-slate-900">{order.orderCode}</strong>. Nhân viên chăm sóc khách hàng của Dyadia sẽ sớm liên hệ xác nhận và giao hàng đến bạn.
        </p>
      </div>

      {/* Order Details Summary Card */}
      <div className="mt-8 bg-white border border-rose-100 rounded-2xl p-6 sm:p-8 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
          <div>
            <span className="text-[11px] text-slate-400">Mã đơn hàng</span>
            <p className="text-base font-bold font-mono text-slate-900">{order.orderCode}</p>
          </div>
          <div>
            <span className="text-[11px] text-slate-400">Trạng thái</span>
            <p className="text-xs font-semibold text-amber-700 bg-amber-50 px-2.5 py-1 rounded-md mt-0.5 inline-block">
              {getOrderStatusLabel(order.status)}
            </p>
          </div>
          <div>
            <span className="text-[11px] text-slate-400">Thời gian đặt</span>
            <p className="text-xs font-medium text-slate-700 mt-0.5">
              {new Date(order.createdAt).toLocaleString('vi-VN')}
            </p>
          </div>
        </div>

        {/* Customer & Shipping Information */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs text-slate-700">
          <div className="space-y-1.5">
            <h4 className="font-semibold text-slate-900 uppercase tracking-wider text-[11px]">
              Thông tin người nhận
            </h4>
            <p>• Họ và tên: <strong>{order.customer.fullName}</strong></p>
            <p>• Số điện thoại: <strong>{order.customer.phone}</strong></p>
            {order.customer.email && <p>• Email: {order.customer.email}</p>}
          </div>

          <div className="space-y-1.5">
            <h4 className="font-semibold text-slate-900 uppercase tracking-wider text-[11px]">
              Địa chỉ nhận hàng & Ghi chú
            </h4>
            <p>• Địa chỉ: {order.customer.address}, {order.customer.district}, {order.customer.province}</p>
            {order.customer.note && <p className="italic text-slate-500">• Ghi chú: &quot;{order.customer.note}&quot;</p>}
            <p>• Hình thức: <strong>{paymentMethodLabel}</strong></p>
          </div>
        </div>

        {/* Purchased Items List */}
        <div className="pt-4 border-t border-slate-100 space-y-3">
          <h4 className="font-semibold text-slate-900 uppercase tracking-wider text-[11px]">
            Danh sách lens đã đặt ({order.items.reduce((s, i) => s + i.quantity, 0)} chiếc lens)
          </h4>

          <div className="divide-y divide-slate-100 border border-slate-100 rounded-xl overflow-hidden">
            {order.items.map((item) => (
              <div key={item.id} className="p-3.5 flex items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-lg bg-[#FFF9FA] border border-slate-200 overflow-hidden shrink-0 flex items-center justify-center">
                    {item.product.image_url ? (
                      <img src={item.product.image_url} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <LensIrisGraphic colorName={item.product.color || 'Brown'} size={40} />
                    )}
                  </div>
                  <div>
                    <h5 className="font-semibold text-slate-900">{item.product.product_name}</h5>
                    <p className="text-[11px] text-slate-500">
                      Màu: {item.product.color} · Độ cận: <strong>{item.prescriptionPower}</strong>
                    </p>
                    <p className="text-[10px] text-slate-400">
                      Đơn giá: {formatCurrency(item.unitPrice)} / 1 chiếc
                    </p>
                  </div>
                </div>

                <div className="text-right">
                  <span className="font-medium text-slate-600 block">Số lượng: {item.quantity} chiếc</span>
                  <span className="font-bold text-slate-900 tabular-nums">
                    {formatCurrency(item.quantity * item.unitPrice)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Financial Breakdown */}
        <div className="pt-4 border-t border-slate-100 space-y-2 text-xs">
          <div className="flex justify-between text-slate-600">
            <span>Tạm tính:</span>
            <span className="tabular-nums font-medium text-slate-900">{formatCurrency(order.subtotal)}</span>
          </div>
          {order.discountAmount > 0 && (
            <div className="flex justify-between text-emerald-700 font-medium">
              <span>Giảm giá ({order.couponCode || 'Voucher'}):</span>
              <span className="tabular-nums">-{formatCurrency(order.discountAmount)}</span>
            </div>
          )}
          <div className="flex justify-between text-slate-600">
            <span>Phí giao hàng:</span>
            <span className="tabular-nums font-medium text-slate-900">
              {order.shippingFee === 0 ? 'Miễn phí' : formatCurrency(order.shippingFee)}
            </span>
          </div>
          <div className="pt-3 border-t border-slate-100 flex justify-between items-baseline">
            <span className="text-sm font-bold text-slate-900">Tổng thanh toán:</span>
            <span className="text-xl font-bold text-slate-950 tabular-nums">
              {formatCurrency(order.totalAmount)}
            </span>
          </div>
        </div>
      </div>

      {/* Navigation Buttons */}
      <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
        <Link
          to="/"
          className="w-full sm:w-auto px-6 py-3 text-xs font-semibold text-white bg-[#D96B8A] rounded-full hover:bg-[#C24A6D] transition-colors text-center shadow-xs"
        >
          Trở về Trang chủ Dyadia
        </Link>
        <Link
          to="/products"
          className="w-full sm:w-auto px-6 py-3 text-xs font-semibold text-slate-700 bg-white border border-slate-300 rounded-full hover:bg-slate-50 transition-colors text-center"
        >
          Tiếp tục xem sản phẩm khác
        </Link>
      </div>
    </div>
  );
};
