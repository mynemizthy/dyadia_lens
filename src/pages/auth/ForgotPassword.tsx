/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.tsx';
import { Mail, ArrowLeft, CheckCircle, AlertCircle, Lock, Eye, EyeOff, ShieldCheck } from 'lucide-react';

export const ForgotPassword: React.FC = () => {
  const navigate = useNavigate();
  const { resetPassword } = useAuth();

  const [step, setStep] = useState<1 | 2>(1);
  const [email, setEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // Step 1: Verify email exists
  const handleCheckEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    const trimmed = email.trim();
    if (!trimmed) {
      setErrorMessage('Vui lòng nhập địa chỉ email của bạn');
      return;
    }

    setLoading(true);
    try {
      const { error } = await resetPassword(trimmed);
      if (error) {
        setErrorMessage(error.message);
      } else {
        setStep(2);
      }
    } catch {
      setErrorMessage('Đã xảy ra lỗi khi kiểm tra email.');
    } finally {
      setLoading(false);
    }
  };

  // Step 2: Set new password
  const handleSetNewPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (newPassword.length < 6) {
      setErrorMessage('Mật khẩu mới phải có ít nhất 6 ký tự');
      return;
    }

    if (newPassword !== confirmPassword) {
      setErrorMessage('Mật khẩu xác nhận không khớp');
      return;
    }

    setLoading(true);
    try {
      const { error } = await resetPassword(email.trim(), newPassword);
      if (error) {
        setErrorMessage(error.message);
      } else {
        setSuccess(true);
        setTimeout(() => {
          navigate('/login');
        }, 2500);
      }
    } catch {
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
            {step === 1 ? 'Khôi phục mật khẩu' : 'Thiết lập mật khẩu mới'}
          </h2>
          <p className="mt-1 text-xs text-slate-500">
            {step === 1
              ? 'Nhập email tài khoản để xác minh và đặt lại mật khẩu'
              : `Nhập mật khẩu mới cho tài khoản ${email}`}
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
            <div className="text-center py-4 space-y-4">
              <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-200 flex items-center justify-center mx-auto">
                <CheckCircle className="w-6 h-6" />
              </div>
              <h3 className="text-base font-semibold text-slate-900 font-serif">
                Đặt lại mật khẩu thành công!
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Mật khẩu tài khoản <strong className="text-slate-800">{email}</strong> đã được cập nhật thành công. Đang tự động chuyển hướng về trang Đăng nhập...
              </p>
              <div className="pt-2">
                <Link
                  to="/login"
                  className="inline-flex items-center gap-2 text-xs font-semibold text-[#D96B8A] hover:underline"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Đăng nhập ngay</span>
                </Link>
              </div>
            </div>
          ) : step === 1 ? (
            <form onSubmit={handleCheckEmail} className="space-y-4">
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
                    <span>Đang kiểm tra tài khoản...</span>
                  </>
                ) : (
                  <span>Tiếp tục đặt lại mật khẩu</span>
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
          ) : (
            <form onSubmit={handleSetNewPassword} className="space-y-4">
              <div className="p-3 rounded-xl bg-rose-50/70 border border-rose-100 flex items-center gap-2.5 text-xs text-rose-900">
                <ShieldCheck className="w-4 h-4 text-rose-600 shrink-0" />
                <span>
                  Đã xác thực tài khoản: <strong>{email}</strong>
                </span>
              </div>

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
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
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
                    <span>Đang lưu mật khẩu mới...</span>
                  </>
                ) : (
                  <span>Lưu mật khẩu mới & Đăng nhập</span>
                )}
              </button>

              <div className="pt-2 text-center">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="text-xs text-slate-500 hover:text-slate-900 transition-colors cursor-pointer"
                >
                  ← Đổi email khác
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
