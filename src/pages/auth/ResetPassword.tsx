/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.tsx';
import { Lock, Eye, EyeOff, CheckCircle, AlertCircle } from 'lucide-react';

export const ResetPassword: React.FC = () => {
  const navigate = useNavigate();
  const { updatePassword } = useAuth();

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (password.length < 6) {
      setErrorMessage('Mật khẩu mới phải có ít nhất 6 ký tự');
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage('Mật khẩu xác nhận không khớp');
      return;
    }

    setLoading(true);
    try {
      const { error } = await updatePassword(password);
      if (error) {
        setErrorMessage(error.message || 'Không thể cập nhật mật khẩu. Vui lòng thử lại.');
      } else {
        setSuccess(true);
        setTimeout(() => {
          navigate('/login');
        }, 3000);
      }
    } catch (err: unknown) {
      setErrorMessage('Đã xảy ra lỗi khi đặt lại mật khẩu.');
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
            Đặt lại mật khẩu mới
          </h2>
          <p className="mt-1 text-xs text-slate-500">
            Nhập mật khẩu mới cho tài khoản của bạn
          </p>
        </div>

        <div className="bg-white/95 backdrop-blur-sm border border-[#EBE5DB] rounded-2xl shadow-sm p-6 sm:p-8">
          {errorMessage && (
            <div className="mb-6 p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-900 text-xs flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <div className="flex-1 leading-relaxed">{errorMessage}</div>
            </div>
          )}

          {success ? (
            <div className="text-center py-6 space-y-4">
              <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-200 flex items-center justify-center mx-auto">
                <CheckCircle className="w-6 h-6" />
              </div>
              <h3 className="text-base font-semibold text-slate-900 font-serif">
                Đổi mật khẩu thành công!
              </h3>
              <p className="text-xs text-slate-600">
                Mật khẩu của bạn đã được cập nhật thành công. Đang tự động chuyển về trang Đăng nhập...
              </p>
              <div className="pt-2">
                <Link
                  to="/login"
                  className="inline-block text-xs font-semibold text-slate-900 underline"
                >
                  Nhấp vào đây nếu không tự động chuyển trang
                </Link>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Mật khẩu mới <span className="text-rose-500">*</span>
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

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Xác nhận mật khẩu mới <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Nhập lại mật khẩu mới"
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
                    <span>Đang cập nhật...</span>
                  </>
                ) : (
                  <span>Lưu mật khẩu mới</span>
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
