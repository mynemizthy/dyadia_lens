/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.tsx';
import { Mail, Lock, User, Phone, Eye, EyeOff, AlertCircle, CheckCircle, ArrowRight } from 'lucide-react';

export const Register: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { signUp } = useAuth();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successNotice, setSuccessNotice] = useState<string | null>(null);

  const from = (location.state as { from?: { pathname: string; search?: string } })?.from;
  const redirectTarget = from ? `${from.pathname}${from.search || ''}` : '/products';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessNotice(null);

    // 1. Validation
    if (!fullName.trim()) {
      setErrorMessage('Vui lòng nhập họ và tên của bạn');
      return;
    }
    if (!email.trim()) {
      setErrorMessage('Vui lòng nhập địa chỉ email hợp lệ');
      return;
    }
    const phoneRegex = /^(03|05|07|08|09)\d{8}$/;
    if (!phoneRegex.test(phone.trim())) {
      setErrorMessage('Số điện thoại không hợp lệ (cần 10 chữ số, bắt đầu bằng 03, 05, 07, 08, 09)');
      return;
    }
    if (password.length < 6) {
      setErrorMessage('Mật khẩu phải có ít nhất 6 ký tự để đảm bảo an toàn');
      return;
    }
    if (password !== confirmPassword) {
      setErrorMessage('Mật khẩu xác nhận không khớp. Vui lòng kiểm tra lại');
      return;
    }

    setLoading(true);
    try {
      const { error, needsEmailConfirmation } = await signUp({
        email,
        password,
        fullName,
        phone,
      });

      if (error) {
        if (error.message.includes('User already registered') || error.message.includes('already exists')) {
          setErrorMessage('Địa chỉ email này đã được đăng ký. Bạn có thể đăng nhập hoặc dùng chức năng Quên mật khẩu.');
        } else if (error.message.includes('Password should be')) {
          setErrorMessage('Mật khẩu không đạt tiêu chuẩn bảo mật. Vui lòng thử mật khẩu khác.');
        } else {
          setErrorMessage(error.message || 'Đăng ký không thành công. Vui lòng thử lại.');
        }
      } else {
        if (needsEmailConfirmation) {
          setSuccessNotice(
            `Đăng ký tài khoản thành công! Chúng tôi đã gửi email xác minh tới ${email}. Vui lòng kiểm tra hộp thư đến (hoặc hòm thư rác/spam) và nhấp vào liên kết xác nhận để kích hoạt tài khoản.`
          );
        } else {
          // Direct login success
          navigate(redirectTarget, { replace: true });
        }
      }
    } catch (err: unknown) {
      setErrorMessage('Đã xảy ra lỗi trong quá trình đăng ký. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-160px)] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-[#FFF9FA] via-[#F6F2EC] to-[#FAF8F5]">
      <div className="max-w-md w-full">
        {/* Header brand badge */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-block text-2xl font-serif font-medium tracking-wider text-slate-900">
            DYADIA <span className="text-xs font-sans tracking-widest uppercase text-slate-500 font-normal">LENS</span>
          </Link>
          <h2 className="mt-4 text-2xl sm:text-3xl font-serif font-normal text-slate-900">
            Tạo tài khoản khách hàng
          </h2>
          <p className="mt-1 text-xs text-slate-500">
            Trở thành thành viên của Dyadia để mua lẻ kính áp tròng theo từng chiếc lens
          </p>
        </div>

        {/* Card */}
        <div className="bg-white/95 backdrop-blur-sm border border-[#EBE5DB] rounded-2xl shadow-sm p-6 sm:p-8">
          {errorMessage && (
            <div className="mb-6 p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-900 text-xs flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <div className="flex-1 leading-relaxed">{errorMessage}</div>
            </div>
          )}

          {successNotice ? (
            <div className="text-center py-6 space-y-4">
              <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-200 flex items-center justify-center mx-auto">
                <CheckCircle className="w-6 h-6" />
              </div>
              <h3 className="text-base font-semibold text-slate-900 font-serif">
                Kiểm tra email của bạn
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed px-2">
                {successNotice}
              </p>
              <div className="pt-4">
                <Link
                  to="/login"
                  state={{ from }}
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#D96B8A] text-white text-xs font-semibold rounded-xl hover:bg-[#C24A6D] transition-all"
                >
                  <span>Chuyển tới trang đăng nhập</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Họ tên */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Họ và tên <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <User className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Nguyễn Thị Minh Anh"
                    required
                    className="w-full pl-9 pr-3 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-400/10 focus:border-rose-400 focus:bg-white transition-all text-slate-900"
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Địa chỉ Email <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <Mail className="w-4 h-4" />
                  </div>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="minhanh@example.com"
                    required
                    className="w-full pl-9 pr-3 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-400/10 focus:border-rose-400 focus:bg-white transition-all text-slate-900"
                  />
                </div>
              </div>

              {/* Số điện thoại */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Số điện thoại <span className="text-rose-500">*</span>
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
                    className="w-full pl-9 pr-3 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-400/10 focus:border-rose-400 focus:bg-white transition-all text-slate-900"
                  />
                </div>
              </div>

              {/* Mật khẩu */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Mật khẩu <span className="text-rose-500">*</span>{' '}
                  <span className="text-[10px] text-slate-400 font-normal">(tối thiểu 6 ký tự)</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Tối thiểu 6 ký tự"
                    required
                    className="w-full pl-9 pr-10 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-400/10 focus:border-rose-400 focus:bg-white transition-all text-slate-900"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Xác nhận mật khẩu */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Xác nhận mật khẩu <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Nhập lại mật khẩu"
                    required
                    className="w-full pl-9 pr-3 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-400/10 focus:border-rose-400 focus:bg-white transition-all text-slate-900"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full mt-4 py-3 px-4 bg-[#D96B8A] hover:bg-[#C24A6D] text-white text-xs font-semibold rounded-xl shadow-sm hover:shadow transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Đang tạo tài khoản...</span>
                  </>
                ) : (
                  <>
                    <span>Đăng ký tài khoản</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          )}

          <div className="mt-6 pt-6 border-t border-slate-100 text-center">
            <p className="text-xs text-slate-500">
              Đã có tài khoản khách hàng?{' '}
              <Link
                to="/login"
                state={{ from }}
                className="font-semibold text-slate-900 hover:underline underline-offset-2"
              >
                Đăng nhập
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
