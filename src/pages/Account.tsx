/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { useSearchParams, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.tsx';
import { orderService } from '../services/orderService.ts';
import { Order, ProductReview, getOrderStatusLabel } from '../types/order.ts';
import { formatCurrency } from '../lib/utils.ts';
import {
  User,
  ShoppingBag,
  KeyRound,
  LogOut,
  Mail,
  Phone,
  Calendar,
  CheckCircle,
  AlertCircle,
  Clock,
  Package,
  Truck,
  ExternalLink,
  ShieldCheck,
  Star,
  X,
} from 'lucide-react';

export const Account: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { user, profile, updateProfile, updatePassword, signOut, getAccessToken, isAdmin } = useAuth();

  const initialTab = searchParams.get('tab') || 'orders';
  const [activeTab, setActiveTab] = useState<'orders' | 'profile' | 'password'>(
    initialTab as 'orders' | 'profile' | 'password'
  );

  // Admin order scope toggle: true = view all store orders, false = view only personal orders
  const [adminViewStoreOrders, setAdminViewStoreOrders] = useState<boolean>(true);

  // Profile edit states
  const [fullName, setFullName] = useState(profile?.full_name || '');
  const [phone, setPhone] = useState(profile?.phone || '');
  const [profileSaving, setProfileSaving] = useState(false);
  const [profileMessage, setProfileMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Password change states
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordSaving, setPasswordSaving] = useState(false);
  const [passwordMessage, setPasswordMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Orders & Reviews states
  const [orders, setOrders] = useState<Order[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const [confirmingOrderId, setConfirmingOrderId] = useState<string | number | null>(null);
  const [orderActionMessage, setOrderActionMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [reviews, setReviews] = useState<ProductReview[]>([]);
  const [reviewModal, setReviewModal] = useState<{
    orderId: string | number;
    orderCode: string;
    productId: string;
    productName: string;
    rating: number;
    comment: string;
  } | null>(null);
  const [submittingReview, setSubmittingReview] = useState(false);

  // Sync profile when auth profile loads
  useEffect(() => {
    if (profile) {
      setFullName(profile.full_name || '');
      setPhone(profile.phone || '');
    }
  }, [profile]);

  // Load orders and reviews
  const loadOrdersAndReviews = async () => {
    if (!user) return;
    setLoadingOrders(true);
    try {
      const token = getAccessToken();
      const [loadedReviews] = await Promise.all([orderService.getReviews()]);
      setReviews(loadedReviews);

      if (isAdmin && adminViewStoreOrders) {
        const res = await fetch('/api/admin/orders', {
          cache: 'no-store',
          headers: {
            'x-admin-key': 'dyadia2026',
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
        });
        const contentType = res.headers.get('content-type') || '';
        if (res.ok && contentType.includes('application/json')) {
          const json = await res.json();
          if (json.success && Array.isArray(json.data)) {
            setOrders(
              json.data.map((raw: any) => ({
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
                status: raw.status,
                receivedAt: raw.received_at || raw.customer?._confirmed_received_at || null,
                createdAt: raw.created_at,
                updatedAt: raw.updated_at,
              }))
            );
            setLoadingOrders(false);
            return;
          }
        }
      }

      const userOrders = await orderService.getUserOrders(user.id, token || undefined, user.email || undefined);
      setOrders(userOrders);
    } catch (err) {
      console.error('Lỗi khi tải lịch sử đơn hàng:', err);
    } finally {
      setLoadingOrders(false);
    }
  };

  useEffect(() => {
    loadOrdersAndReviews();
  }, [user, isAdmin, adminViewStoreOrders]);

  const handleConfirmReceived = async (order: Order) => {
    if (!window.confirm(`Bạn xác nhận đã nhận đủ kiện hàng của đơn #${order.orderCode} và sản phẩm nguyên vẹn? Sau khi xác nhận, đơn hàng sẽ được ghi nhận hoàn tất và mở đánh giá trong 15 ngày.`)) {
      return;
    }
    setConfirmingOrderId(order.id);
    setOrderActionMessage(null);
    try {
      const token = getAccessToken();
      const updated = await orderService.confirmReceived(order.id, token || undefined);
      setOrders((prev) =>
        prev.map((o) =>
          String(o.id) === String(order.id)
            ? { ...o, status: 'completed', receivedAt: updated.received_at }
            : o
        )
      );
      setOrderActionMessage({
        type: 'success',
        text: `Đã xác nhận nhận hàng đơn #${order.orderCode}! Bạn có thể đánh giá sản phẩm trong vòng 15 ngày.`,
      });
    } catch (err: any) {
      setOrderActionMessage({
        type: 'error',
        text: err?.message || 'Không thể xác nhận đã nhận hàng. Vui lòng thử lại.',
      });
    } finally {
      setConfirmingOrderId(null);
    }
  };

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewModal) return;
    setSubmittingReview(true);
    try {
      const token = getAccessToken();
      const created = await orderService.submitReview(
        {
          orderId: reviewModal.orderId,
          orderCode: reviewModal.orderCode,
          productId: reviewModal.productId,
          productName: reviewModal.productName,
          rating: reviewModal.rating,
          comment: reviewModal.comment,
        },
        token || undefined
      );
      setReviews((prev) => [
        created,
        ...prev.filter(
          (r) => !(String(r.order_id) === String(created.order_id) && String(r.product_id) === String(created.product_id))
        ),
      ]);
      setReviewModal(null);
      setOrderActionMessage({
        type: 'success',
        text: `Cảm ơn bạn đã đánh giá "${reviewModal.productName}"!`,
      });
    } catch (err: any) {
      setOrderActionMessage({
        type: 'error',
        text: err?.message || 'Không thể gửi đánh giá.',
      });
    } finally {
      setSubmittingReview(false);
    }
  };

  const handleTabChange = (tab: 'orders' | 'profile' | 'password') => {
    setActiveTab(tab);
    setSearchParams({ tab });
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setProfileMessage(null);

    if (!fullName.trim()) {
      setProfileMessage({ type: 'error', text: 'Họ và tên không được để trống' });
      return;
    }

    const phoneRegex = /^(03|05|07|08|09)\d{8}$/;
    if (!phoneRegex.test(phone.trim())) {
      setProfileMessage({ type: 'error', text: 'Số điện thoại không hợp lệ (10 số)' });
      return;
    }

    setProfileSaving(true);
    try {
      const { error } = await updateProfile({ fullName, phone });
      if (error) {
        setProfileMessage({ type: 'error', text: error.message });
      } else {
        setProfileMessage({ type: 'success', text: 'Cập nhật thông tin hồ sơ thành công!' });
      }
    } catch (err: unknown) {
      setProfileMessage({ type: 'error', text: 'Đã xảy ra lỗi khi cập nhật hồ sơ' });
    } finally {
      setProfileSaving(false);
    }
  };

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordMessage(null);

    if (newPassword.length < 6) {
      setPasswordMessage({ type: 'error', text: 'Mật khẩu mới phải có ít nhất 6 ký tự' });
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordMessage({ type: 'error', text: 'Mật khẩu xác nhận không khớp' });
      return;
    }

    setPasswordSaving(true);
    try {
      const { error } = await updatePassword(newPassword);
      if (error) {
        setPasswordMessage({ type: 'error', text: error.message });
      } else {
        setPasswordMessage({ type: 'success', text: 'Đổi mật khẩu thành công!' });
        setNewPassword('');
        setConfirmPassword('');
      }
    } catch (err: unknown) {
      setPasswordMessage({ type: 'error', text: 'Không thể cập nhật mật khẩu' });
    } finally {
      setPasswordSaving(false);
    }
  };

  const handleLogout = async () => {
    await signOut();
    navigate('/');
  };

  const getStatusBadge = (status: string) => {
    const label = getOrderStatusLabel(status);
    switch (status) {
      case 'completed':
      case 'Đã hoàn tất':
      case 'Hoàn thành':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 text-[11px] font-semibold text-emerald-800 bg-emerald-50 border border-emerald-200 rounded-full">
            <CheckCircle className="w-3 h-3 text-emerald-600" />
            {label}
          </span>
        );
      case 'delivered':
      case 'Đã giao hàng':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 text-[11px] font-semibold text-rose-800 bg-rose-50 border border-rose-200 rounded-full">
            <Package className="w-3 h-3 text-rose-500" />
            {label}
          </span>
        );
      case 'shipping':
      case 'Đang giao hàng':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 text-[11px] font-semibold text-sky-800 bg-sky-50 border border-sky-200 rounded-full">
            <Truck className="w-3 h-3 text-sky-600" />
            {label}
          </span>
        );
      case 'confirmed':
      case 'processing':
      case 'Đã xác nhận':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 text-[11px] font-semibold text-indigo-800 bg-indigo-50 border border-indigo-200 rounded-full">
            <Package className="w-3 h-3 text-indigo-600" />
            {label}
          </span>
        );
      case 'cancelled':
      case 'Đã hủy':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 text-[11px] font-semibold text-rose-800 bg-rose-50 border border-rose-200 rounded-full">
            <AlertCircle className="w-3 h-3 text-rose-600" />
            {label}
          </span>
        );
      case 'pending':
      case 'Chờ xác nhận':
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 text-[11px] font-semibold text-amber-800 bg-amber-50 border border-amber-200 rounded-full">
            <Clock className="w-3 h-3 text-amber-600" />
            {label}
          </span>
        );
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-serif font-normal text-slate-900">
          Tài Khoản Của Tôi
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Quản lý thông tin cá nhân và theo dõi lịch sử các đơn hàng đặt mua kính áp tròng
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Navigation Sidebar */}
        <div className="lg:col-span-4 bg-white border border-rose-100 rounded-2xl p-6 shadow-sm">
          {/* User Brief */}
          <div className="flex items-center gap-4 pb-6 border-b border-slate-100">
            <div className="w-14 h-14 rounded-full bg-[#D96B8A] text-white font-serif font-medium text-xl flex items-center justify-center shrink-0">
              {(profile?.full_name || user?.email || 'D')[0].toUpperCase()}
            </div>
            <div className="min-w-0 flex-1">
              <h2 className="text-sm font-semibold text-slate-900 truncate">
                {profile?.full_name || 'Khách hàng Dyadia'}
              </h2>
              <p className="text-xs text-slate-500 truncate mt-0.5">{user?.email}</p>
              {profile?.phone && (
                <p className="text-[11px] text-slate-400 mt-0.5">{profile.phone}</p>
              )}
            </div>
          </div>

          {/* Menu Items */}
          <nav className="mt-4 space-y-1">
            <button
              type="button"
              onClick={() => handleTabChange('orders')}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-medium transition-colors ${
                activeTab === 'orders'
                  ? 'bg-[#D96B8A] text-white font-semibold'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <ShoppingBag className="w-4 h-4" />
                <span>Lịch sử đơn hàng</span>
              </div>
              <span className={`text-[10px] px-2 py-0.5 rounded-full ${activeTab === 'orders' ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-600'}`}>
                {orders.length}
              </span>
            </button>

            <button
              type="button"
              onClick={() => handleTabChange('profile')}
              className={`w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs font-medium transition-colors ${
                activeTab === 'profile'
                  ? 'bg-[#D96B8A] text-white font-semibold'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <User className="w-4 h-4" />
              <span>Thông tin cá nhân</span>
            </button>

            <button
              type="button"
              onClick={() => handleTabChange('password')}
              className={`w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs font-medium transition-colors ${
                activeTab === 'password'
                  ? 'bg-[#D96B8A] text-white font-semibold'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <KeyRound className="w-4 h-4" />
              <span>Đổi mật khẩu</span>
            </button>

            <div className="pt-4 mt-4 border-t border-slate-100">
              <button
                type="button"
                onClick={handleLogout}
                className="w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs font-medium text-rose-600 hover:bg-rose-50 transition-colors"
              >
                <LogOut className="w-4 h-4" />
                <span>Đăng xuất tài khoản</span>
              </button>
            </div>
          </nav>
        </div>

        {/* Right Column: Active Tab Content */}
        <div className="lg:col-span-8">
          {/* TAB 1: ORDER HISTORY */}
          {activeTab === 'orders' && (
            <div className="bg-white border border-rose-100 rounded-2xl p-6 sm:p-8 shadow-sm">
              <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-100">
                <div>
                  <h3 className="text-base font-semibold text-slate-900 font-serif">
                    Đơn Hàng Của Bạn
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Tất cả các đơn hàng được liên kết với tài khoản của bạn
                  </p>
                </div>
                <Link
                  to="/products"
                  className="text-xs font-semibold text-slate-900 hover:underline inline-flex items-center gap-1"
                >
                  <span>Mua thêm</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </Link>
              </div>

              {/* Admin Mode Store Orders Scope */}
              {isAdmin && (
                <div className="mb-6 p-4 bg-amber-50/80 border border-amber-200/80 rounded-xl flex flex-wrap items-center justify-between gap-3 text-xs">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-amber-700 shrink-0" />
                    <div>
                      <span className="font-semibold text-amber-900 block">Quyền Quản Trị Hệ Thống (Admin Store View)</span>
                      <span className="text-[11px] text-amber-800">
                        {adminViewStoreOrders
                          ? `Đang hiển thị toàn bộ ${orders.length} đơn hàng của khách hàng trên toàn website.`
                          : 'Đang hiển thị đơn hàng cá nhân của tài khoản này.'}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setAdminViewStoreOrders(true)}
                      className={`px-3 py-1.5 rounded-lg font-medium transition-all cursor-pointer ${
                        adminViewStoreOrders
                          ? 'bg-amber-700 text-white shadow-xs'
                          : 'bg-white text-slate-700 border border-amber-200 hover:bg-amber-100/50'
                      }`}
                    >
                      Tất cả đơn toàn sàn
                    </button>
                    <button
                      type="button"
                      onClick={() => setAdminViewStoreOrders(false)}
                      className={`px-3 py-1.5 rounded-lg font-medium transition-all cursor-pointer ${
                        !adminViewStoreOrders
                          ? 'bg-amber-700 text-white shadow-xs'
                          : 'bg-white text-slate-700 border border-amber-200 hover:bg-amber-100/50'
                      }`}
                    >
                      Chỉ đơn của tôi
                    </button>
                    <Link
                      to="/admin"
                      className="px-3 py-1.5 bg-[#D96B8A] text-white rounded-lg font-medium hover:bg-[#C24A6D] transition-colors inline-flex items-center gap-1.5"
                    >
                      <span>Vào CMS Quản trị</span>
                      <ExternalLink className="w-3 h-3" />
                    </Link>
                  </div>
                </div>
              )}

              {orderActionMessage && (
                <div
                  className={`mb-5 p-3.5 rounded-xl text-xs flex items-center gap-2.5 ${
                    orderActionMessage.type === 'success'
                      ? 'bg-emerald-50 border border-emerald-200 text-emerald-800'
                      : 'bg-rose-50 border border-rose-200 text-rose-800'
                  }`}
                >
                  {orderActionMessage.type === 'success' ? (
                    <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                  ) : (
                    <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                  )}
                  <span>{orderActionMessage.text}</span>
                </div>
              )}

              {loadingOrders ? (
                <div className="py-16 text-center">
                  <div className="w-8 h-8 border-2 border-rose-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
                  <p className="text-xs text-slate-500">Đang tải lịch sử đơn hàng...</p>
                </div>
              ) : orders.length === 0 ? (
                <div className="py-16 text-center">
                  <div className="w-12 h-12 rounded-full bg-rose-50 text-rose-400 flex items-center justify-center mx-auto mb-3">
                    <ShoppingBag className="w-6 h-6" />
                  </div>
                  <h4 className="text-sm font-semibold text-slate-800">Bạn chưa có đơn hàng nào</h4>
                  <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                    Khám phá bộ sưu tập kính áp tròng Hàn Quốc và thêm sản phẩm yêu thích vào giỏ hàng.
                  </p>
                  <Link
                    to="/products"
                    className="mt-5 inline-block px-5 py-2.5 text-xs font-semibold text-white bg-rose-500 hover:bg-rose-600 rounded-xl transition-colors shadow-sm"
                  >
                    Xem sản phẩm ngay
                  </Link>
                </div>
              ) : (
                <div className="space-y-6">
                  {orders.map((order) => {
                    const isCompleted =
                      order.status === 'completed' ||
                      order.status === 'Đã hoàn tất' ||
                      order.status === 'Hoàn thành' ||
                      Boolean(order.receivedAt);

                    const canConfirmReceived =
                      !isCompleted &&
                      (order.status === 'delivered' ||
                        order.status === 'Đã giao hàng' ||
                        order.status === 'shipping' ||
                        order.status === 'Đang giao hàng');

                    let daysRemaining = 0;
                    let canReviewWithin15Days = false;
                    if (isCompleted) {
                      const recDateStr = order.receivedAt || order.updatedAt || order.createdAt;
                      const elapsedDays = recDateStr
                        ? (Date.now() - new Date(recDateStr).getTime()) / (1000 * 60 * 60 * 24)
                        : 0;
                      canReviewWithin15Days = elapsedDays <= 15;
                      daysRemaining = Math.max(0, Math.ceil(15 - elapsedDays));
                    }

                    return (
                      <div
                        key={order.id}
                        className="border border-rose-100 rounded-xl overflow-hidden hover:border-rose-200 transition-colors bg-white"
                      >
                        {/* Order Header */}
                        <div className="bg-rose-50/40 p-4 border-b border-rose-100 flex flex-wrap items-center justify-between gap-3 text-xs">
                          <div className="space-y-1">
                            <div className="flex flex-wrap items-center gap-2">
                              <span className="font-semibold text-slate-900 font-mono">
                                #{order.orderCode}
                              </span>
                              {getStatusBadge(order.status)}
                            </div>
                            <div className="flex items-center gap-1.5 text-slate-500 text-[11px]">
                              <Calendar className="w-3.5 h-3.5 text-slate-400" />
                              <span>
                                {order.createdAt
                                  ? new Date(order.createdAt).toLocaleDateString('vi-VN', {
                                      year: 'numeric',
                                      month: 'long',
                                      day: 'numeric',
                                      hour: '2-digit',
                                      minute: '2-digit',
                                    })
                                  : 'Vừa xong'}
                              </span>
                            </div>
                          </div>

                          <div className="text-right">
                            <span className="text-[11px] text-slate-500 block">Tổng tiền đơn</span>
                            <span className="text-sm font-bold text-slate-900 tabular-nums">
                              {formatCurrency(order.totalAmount)}
                            </span>
                          </div>
                        </div>

                        {/* Order Items */}
                        <div className="p-4 divide-y divide-rose-50">
                          {order.items.map((item, idx) => {
                            const prodId = item.product?.id || String(idx);
                            const existingReview = reviews.find(
                              (r) =>
                                (String(r.order_id) === String(order.id) ||
                                  (order.orderCode && String(r.order_code) === String(order.orderCode))) &&
                                String(r.product_id) === String(prodId)
                            );

                            return (
                              <div key={idx} className="py-3 first:pt-0 last:pb-0 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                                <div className="flex items-center gap-3 min-w-0">
                                  <div className="w-12 h-12 rounded-lg bg-rose-50/60 flex items-center justify-center shrink-0 overflow-hidden border border-rose-100">
                                    {item.product?.image_url ? (
                                      <img
                                        src={item.product.image_url}
                                        alt={item.product.product_name}
                                        className="w-full h-full object-cover"
                                      />
                                    ) : (
                                      <span className="text-[10px] font-semibold text-rose-400">LENS</span>
                                    )}
                                  </div>
                                  <div className="min-w-0">
                                    <h5 className="text-xs font-semibold text-slate-900 truncate">
                                      {item.product?.product_name || 'Kính áp tròng'}
                                    </h5>
                                    <div className="flex flex-wrap items-center gap-2 text-[11px] text-slate-500 mt-0.5">
                                      {item.product?.color && <span>Màu: {item.product.color}</span>}
                                      {item.prescriptionPower && (
                                        <span className="bg-rose-50 px-1.5 py-0.2 rounded font-mono text-rose-900 font-medium">
                                          Độ cận: {item.prescriptionPower}
                                        </span>
                                      )}
                                      <span>· Số lượng: <strong className="text-slate-800">{item.quantity} chiếc</strong></span>
                                    </div>
                                    {existingReview && (
                                      <div className="mt-1.5 flex items-center gap-1.5 text-[11px] text-amber-600 bg-amber-50/80 px-2 py-0.5 rounded-md w-fit">
                                        <span className="flex items-center">
                                          {Array.from({ length: existingReview.rating }).map((_, s) => (
                                            <Star key={s} className="w-3 h-3 fill-amber-400 text-amber-400" />
                                          ))}
                                        </span>
                                        <span className="text-slate-600 italic truncate max-w-[200px]">
                                          &quot;{existingReview.comment || 'Đã đánh giá'}&quot;
                                        </span>
                                      </div>
                                    )}
                                  </div>
                                </div>

                                <div className="flex sm:flex-col items-center sm:items-end justify-between gap-2 shrink-0">
                                  <div className="text-right">
                                    <span className="text-xs font-semibold text-slate-900 block tabular-nums">
                                      {formatCurrency(item.unitPrice * item.quantity)}
                                    </span>
                                    <span className="text-[10px] text-slate-400">
                                      {formatCurrency(item.unitPrice)} / 1 chiếc
                                    </span>
                                  </div>

                                  {isCompleted && canReviewWithin15Days && !existingReview && (
                                    <button
                                      type="button"
                                      onClick={() =>
                                        setReviewModal({
                                          orderId: order.id,
                                          orderCode: order.orderCode,
                                          productId: prodId,
                                          productName: item.product?.product_name || 'Kính áp tròng Dyadia',
                                          rating: 5,
                                          comment: '',
                                        })
                                      }
                                      className="px-3 py-1 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded-lg text-[11px] font-semibold transition-colors inline-flex items-center gap-1 cursor-pointer"
                                    >
                                      <Star className="w-3 h-3 text-rose-500" />
                                      <span>Đánh giá</span>
                                    </button>
                                  )}
                                  {isCompleted && existingReview && (
                                    <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                                      ✓ Đã đánh giá
                                    </span>
                                  )}
                                </div>
                              </div>
                            );
                          })}
                        </div>

                        {/* Buyer Actions & 15-Day Review Status Bar */}
                        {(canConfirmReceived || isCompleted) && (
                          <div className="px-4 py-3 bg-rose-50/30 border-t border-rose-100 flex flex-wrap items-center justify-between gap-3">
                            {canConfirmReceived ? (
                              <>
                                <span className="text-[11px] text-slate-600">
                                  {(order.status === 'delivered' || order.status === 'Đã giao hàng')
                                    ? '📦 Người bán đã xác nhận giao hàng. Vui lòng kiểm tra và bấm xác nhận nếu bạn đã nhận đủ hàng:'
                                    : '🚚 Đơn hàng đang được vận chuyển. Nếu bạn đã nhận được hàng, hãy xác nhận tại đây:'}
                                </span>
                                <button
                                  type="button"
                                  disabled={confirmingOrderId === order.id}
                                  onClick={() => handleConfirmReceived(order)}
                                  className="px-4 py-2 bg-rose-500 hover:bg-rose-600 text-white text-xs font-semibold rounded-xl shadow-xs transition-all inline-flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                                >
                                  <CheckCircle className="w-3.5 h-3.5" />
                                  <span>
                                    {confirmingOrderId === order.id
                                      ? 'Đang xác nhận...'
                                      : 'Xác nhận đã nhận hàng'}
                                  </span>
                                </button>
                              </>
                            ) : (
                              <div className="w-full flex flex-wrap items-center justify-between gap-2 text-[11px]">
                                <span className="text-emerald-700 font-medium flex items-center gap-1">
                                  <CheckCircle className="w-3.5 h-3.5" />
                                  Đã xác nhận nhận hàng
                                  {order.receivedAt && ` vào ${new Date(order.receivedAt).toLocaleDateString('vi-VN')}`}
                                </span>
                                {canReviewWithin15Days ? (
                                  <span className="text-rose-700 font-semibold bg-rose-50 px-2.5 py-0.5 rounded-full border border-rose-200">
                                    ✨ Còn {daysRemaining} ngày để đánh giá sản phẩm
                                  </span>
                                ) : (
                                  <span className="text-slate-400">
                                    Đã hết thời hạn 15 ngày đánh giá
                                  </span>
                                )}
                              </div>
                            )}
                          </div>
                        )}

                        {/* Order Destination & Payment */}
                        <div className="bg-[#FFF9FA] px-4 py-3 border-t border-rose-100 flex flex-wrap items-center justify-between gap-3 text-[11px] text-slate-600">
                          <div className="flex items-center gap-1.5">
                            <Truck className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                            <span>
                              Giao tới: <strong>{order.customer.fullName}</strong> ({order.customer.phone}) - {order.customer.address}, {order.customer.district}, {order.customer.province}
                            </span>
                          </div>
                          <div className="font-medium text-slate-700">
                            Thanh toán: <span className="uppercase">{order.paymentMethod}</span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* TAB 2: PROFILE SETTINGS */}
          {activeTab === 'profile' && (
            <div className="bg-white border border-rose-100 rounded-2xl p-6 sm:p-8 shadow-sm">
              <div className="mb-6 pb-4 border-b border-slate-100">
                <h3 className="text-base font-semibold text-slate-900 font-serif">
                  Thông Tin Cá Nhân
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Thông tin được bảo mật và chỉ sử dụng cho mục đích giao hàng
                </p>
              </div>

              {profileMessage && (
                <div
                  className={`mb-6 p-3.5 rounded-xl text-xs flex items-center gap-2.5 ${
                    profileMessage.type === 'success'
                      ? 'bg-emerald-50 border border-emerald-200 text-emerald-800'
                      : 'bg-rose-50 border border-rose-200 text-rose-800'
                  }`}
                >
                  {profileMessage.type === 'success' ? (
                    <CheckCircle className="w-4 h-4 shrink-0 text-emerald-600" />
                  ) : (
                    <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
                  )}
                  <span>{profileMessage.text}</span>
                </div>
              )}

              <form onSubmit={handleSaveProfile} className="space-y-4 max-w-lg">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Họ và tên
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                      <User className="w-4 h-4" />
                    </div>
                    <input
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      required
                      className="w-full pl-9 pr-3 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-400/10 focus:border-rose-400 focus:bg-white text-slate-900"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Địa chỉ Email
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                      <Mail className="w-4 h-4" />
                    </div>
                    <input
                      type="email"
                      value={user?.email || ''}
                      disabled
                      className="w-full pl-9 pr-3 py-2.5 text-xs bg-slate-100 border border-slate-200 rounded-xl text-slate-500 cursor-not-allowed"
                    />
                  </div>
                  <p className="text-[11px] text-slate-400 mt-1">
                    Email tài khoản dùng để đăng nhập và nhận thông báo đơn hàng
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Số điện thoại
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                      <Phone className="w-4 h-4" />
                    </div>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="0912345678"
                      required
                      className="w-full pl-9 pr-3 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-400/10 focus:border-rose-400 focus:bg-white text-slate-900"
                    />
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={profileSaving}
                    className="px-6 py-2.5 bg-[#D96B8A] hover:bg-[#C24A6D] text-white text-xs font-semibold rounded-xl shadow-sm transition-all disabled:opacity-50 cursor-pointer"
                  >
                    {profileSaving ? 'Đang lưu...' : 'Lưu thay đổi'}
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* TAB 3: PASSWORD SETTINGS */}
          {activeTab === 'password' && (
            <div className="bg-white border border-rose-100 rounded-2xl p-6 sm:p-8 shadow-sm">
              <div className="mb-6 pb-4 border-b border-slate-100">
                <h3 className="text-base font-semibold text-slate-900 font-serif">
                  Đổi Mật Khẩu
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Cập nhật mật khẩu bảo mật mới cho tài khoản đăng nhập của bạn
                </p>
              </div>

              {passwordMessage && (
                <div
                  className={`mb-6 p-3.5 rounded-xl text-xs flex items-center gap-2.5 ${
                    passwordMessage.type === 'success'
                      ? 'bg-emerald-50 border border-emerald-200 text-emerald-800'
                      : 'bg-rose-50 border border-rose-200 text-rose-800'
                  }`}
                >
                  {passwordMessage.type === 'success' ? (
                    <CheckCircle className="w-4 h-4 shrink-0 text-emerald-600" />
                  ) : (
                    <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
                  )}
                  <span>{passwordMessage.text}</span>
                </div>
              )}

              <form onSubmit={handleUpdatePassword} className="space-y-4 max-w-lg">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Mật khẩu mới <span className="text-[10px] text-slate-400 font-normal">(tối thiểu 6 ký tự)</span>
                  </label>
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Nhập mật khẩu mới"
                    required
                    className="w-full px-3 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-400/10 focus:border-rose-400 focus:bg-white text-slate-900"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Xác nhận mật khẩu mới
                  </label>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Nhập lại mật khẩu mới"
                    required
                    className="w-full px-3 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-400/10 focus:border-rose-400 focus:bg-white text-slate-900"
                  />
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={passwordSaving}
                    className="px-6 py-2.5 bg-[#D96B8A] hover:bg-[#C24A6D] text-white text-xs font-semibold rounded-xl shadow-sm transition-all disabled:opacity-50 cursor-pointer"
                  >
                    {passwordSaving ? 'Đang cập nhật...' : 'Cập nhật mật khẩu'}
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      </div>

      {/* Product Review Modal (15-Day Review Window) */}
      {reviewModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-rose-100 rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-5 animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-rose-100">
              <div>
                <h3 className="text-base font-serif font-semibold text-slate-900">Đánh Giá Sản Phẩm</h3>
                <p className="text-xs text-slate-500 mt-0.5 truncate max-w-[280px]">{reviewModal.productName}</p>
              </div>
              <button
                type="button"
                onClick={() => setReviewModal(null)}
                className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-full transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSubmitReview} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-2">
                  Mức độ hài lòng của bạn
                </label>
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setReviewModal({ ...reviewModal, rating: star })}
                      className="p-1.5 rounded-lg hover:bg-rose-50 transition-transform hover:scale-110 cursor-pointer"
                    >
                      <Star
                        className={`w-7 h-7 ${
                          star <= reviewModal.rating
                            ? 'fill-amber-400 text-amber-400'
                            : 'text-slate-300'
                        }`}
                      />
                    </button>
                  ))}
                  <span className="ml-2 text-xs font-semibold text-rose-600">
                    {reviewModal.rating === 5 && 'Tuyệt vời'}
                    {reviewModal.rating === 4 && 'Hài lòng'}
                    {reviewModal.rating === 3 && 'Bình thường'}
                    {reviewModal.rating === 2 && 'Chưa tốt'}
                    {reviewModal.rating === 1 && 'Rất tệ'}
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Chia sẻ cảm nhận khi đeo (độ êm, màu sắc, giữ ẩm...)
                </label>
                <textarea
                  rows={4}
                  required
                  value={reviewModal.comment}
                  onChange={(e) => setReviewModal({ ...reviewModal, comment: e.target.value })}
                  placeholder="Ví dụ: Lens màu rất tự nhiên, đeo cả ngày không bị cộm hay khô mắt..."
                  className="w-full px-3.5 py-2.5 text-xs bg-rose-50/30 border border-rose-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-200 focus:border-rose-400 focus:bg-white text-slate-900"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setReviewModal(null)}
                  className="px-4 py-2 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
                >
                  Đóng
                </button>
                <button
                  type="submit"
                  disabled={submittingReview}
                  className="px-5 py-2 bg-rose-500 hover:bg-rose-600 text-white text-xs font-semibold rounded-xl shadow-sm transition-colors cursor-pointer disabled:opacity-50"
                >
                  {submittingReview ? 'Đang gửi...' : 'Gửi Đánh Giá'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
