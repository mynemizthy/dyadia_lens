/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.tsx';
import { Mail, Lock, Eye, EyeOff, Sparkles, AlertCircle, ArrowRight } from 'lucide-react';

export const Login: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { signIn } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Return to intended page or /products
  const from = (location.state as { from?: { pathname: string; search?: string } })?.from;
  const redirectTarget = from ? `${from.pathname}${from.search || ''}` : '/products';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!email.trim() || !password) {
      setErrorMessage('Vui lòng nhập đầy đủ email và mật khẩu');
      return;
    }

    setLoading(true);
    try {
      const { error } = await signIn(email, password);
      if (error) {
        if (error.message.includes('Invalid login credentials')) {
          setErrorMessage('Email hoặc mật khẩu không chính xác. Vui lòng kiểm tra lại.');
        } else if (error.message.includes('Email not confirmed')) {
          setErrorMessage('Tài khoản chưa được xác minh email. Vui lòng kiểm tra hộp thư đến hoặc thư rác để kích hoạt tài khoản.');
        } else {
          setErrorMessage(error.message || 'Đăng nhập không thành công. Vui lòng thử lại.');
        }
      } else {
        navigate(redirectTarget, { replace: true });
      }
    } catch (err: unknown) {
      setErrorMessage('Đã xảy ra lỗi khi đăng nhập. Vui lòng thử lại.');
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
          <div className="mt-3 flex items-center justify-center gap-1.5 text-xs text-rose-800 font-medium bg-rose-50 border border-rose-100 rounded-full py-1 px-3.5 mx-auto w-fit">
            <Sparkles className="w-3.5 h-3.5 text-rose-400" />
            <span>Đăng nhập để xem bộ sưu tập lens & đặt hàng</span>
          </div>
          <h2 className="mt-4 text-2xl sm:text-3xl font-serif font-normal text-slate-900">
            Chào mừng trở lại
          </h2>
          <p className="mt-1 text-xs text-slate-500">
            Nhập tài khoản để tiếp tục trải nghiệm mua sắm kính áp tròng Hàn Quốc
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

          <form onSubmit={handleSubmit} className="space-y-4">
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
                  placeholder="name@example.com"
                  required
                  className="w-full pl-9 pr-3 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-400/10 focus:border-rose-400 focus:bg-white transition-all text-slate-900"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-semibold text-slate-700">
                  Mật khẩu <span className="text-rose-500">*</span>
                </label>
                <Link
                  to="/forgot-password"
                  className="text-[11px] font-medium text-slate-500 hover:text-slate-900 underline underline-offset-2 transition-colors"
                >
                  Quên mật khẩu?
                </Link>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Nhập mật khẩu của bạn"
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

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 py-3 px-4 bg-[#D96B8A] hover:bg-[#C24A6D] text-white text-xs font-semibold rounded-xl shadow-sm hover:shadow transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Đang đăng nhập...</span>
                </>
              ) : (
                <>
                  <span>Đăng nhập</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-slate-100 text-center">
            <p className="text-xs text-slate-500">
              Chưa có tài khoản khách hàng?{' '}
              <Link
                to="/register"
                state={{ from }}
                className="font-semibold text-slate-900 hover:underline underline-offset-2"
              >
                Đăng ký ngay
              </Link>
            </p>
          </div>
        </div>

        {/* Security assurance */}
        <p className="mt-4 text-[11px] text-center text-slate-400">
          Đăng nhập an toàn & bảo mật · Dữ liệu được mã hóa chuẩn quốc tế SSL
        </p>
      </div>
    </div>
  );
};
