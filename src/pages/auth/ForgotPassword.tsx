/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.tsx';
import { Mail, ArrowLeft, CheckCircle, AlertCircle, Sparkles } from 'lucide-react';

export const ForgotPassword: React.FC = () => {
  const { resetPassword } = useAuth();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [sentSuccess, setSentSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!email.trim()) {
      setErrorMessage('Vui lòng nhập địa chỉ email của bạn');
      return;
    }

    setLoading(true);
    try {
      const { error } = await resetPassword(email);
      if (error) {
        setErrorMessage(error.message || 'Không thể gửi email đặt lại mật khẩu. Vui lòng thử lại.');
      } else {
        setSentSuccess(true);
      }
    } catch (err: unknown) {
      setErrorMessage('Đã xảy ra lỗi. Vui lòng thử lại sau.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-160px)] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-[#FFF9FA] via-[#F6F2EC] to-[#FAF8F5]">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <Link to="/" className="inline-block text-2xl font-serif font-medium tracking-wider text-slate-900">
            DYADIA <span className="text-xs font-sans tracking-widest uppercase text-slate-500 font-normal">LENS</span>
          </Link>
          <h2 className="mt-4 text-2xl sm:text-3xl font-serif font-normal text-slate-900">
            Khôi phục mật khẩu
          </h2>
          <p className="mt-1 text-xs text-slate-500">
            Nhập email tài khoản để nhận đường dẫn đặt lại mật khẩu mới
          </p>
        </div>

        <div className="bg-white/95 backdrop-blur-sm border border-[#EBE5DB] rounded-2xl shadow-sm p-6 sm:p-8">
          {errorMessage && (
            <div className="mb-6 p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-900 text-xs flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <div className="flex-1 leading-relaxed">{errorMessage}</div>
            </div>
          )}

          {sentSuccess ? (
            <div className="text-center py-4 space-y-4">
              <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-200 flex items-center justify-center mx-auto">
                <CheckCircle className="w-6 h-6" />
              </div>
              <h3 className="text-base font-semibold text-slate-900 font-serif">
                Đã gửi liên kết khôi phục
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Chúng tôi đã gửi email hướng dẫn tới <strong className="text-slate-800">{email}</strong>. Vui lòng kiểm tra hộp thư đến (hoặc hòm thư rác/spam) và nhấp vào liên kết để tạo mật khẩu mới.
              </p>
              <div className="pt-4">
                <Link
                  to="/login"
                  className="inline-flex items-center gap-2 text-xs font-semibold text-slate-900 hover:underline"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Quay lại trang Đăng nhập</span>
                </Link>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Địa chỉ Email tài khoản <span className="text-rose-500">*</span>
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

              <button
                type="submit"
                disabled={loading}
                className="w-full mt-2 py-3 px-4 bg-[#D96B8A] hover:bg-[#C24A6D] text-white text-xs font-semibold rounded-xl shadow-sm hover:shadow transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Đang gửi email...</span>
                  </>
                ) : (
                  <span>Gửi liên kết khôi phục</span>
                )}
              </button>

              <div className="pt-4 text-center">
                <Link
                  to="/login"
                  className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-900 transition-colors"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Quay lại đăng nhập</span>
                </Link>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
