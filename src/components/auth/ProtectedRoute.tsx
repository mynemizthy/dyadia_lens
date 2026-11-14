/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Navigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.tsx';
import { Sparkles, ShieldAlert } from 'lucide-react';

interface ProtectedRouteProps {
  children?: React.ReactNode;
  requireAdmin?: boolean;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, requireAdmin = false }) => {
  const { user, isAdmin, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center p-6 text-center">
        <div className="w-12 h-12 rounded-full border-2 border-rose-300 border-t-transparent animate-spin mb-4" />
        <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
          <Sparkles className="w-4 h-4 text-rose-400 animate-pulse" />
          <span>Đang xác thực tài khoản Dyadia...</span>
        </div>
      </div>
    );
  }

  if (!user) {
    // Redirect to login page and remember target destination
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (requireAdmin && !isAdmin) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center p-6">
        <div className="max-w-md w-full bg-white border border-rose-100 rounded-3xl p-8 text-center shadow-sm">
          <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center mx-auto mb-4">
            <ShieldAlert className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-serif font-semibold text-slate-900 mb-2">
            Quyền Quản Trị Bị Từ Chối
          </h2>
          <p className="text-xs text-slate-500 mb-6 leading-relaxed">
            Tài khoản <span className="font-semibold text-slate-700">{user.email}</span> không có quyền Quản trị viên (Admin) trong hệ thống. Vui lòng đăng nhập bằng tài khoản Quản trị.
          </p>
          <div className="flex flex-col gap-2.5">
            <Link
              to="/login"
              className="w-full py-2.5 px-4 bg-[#D96B8A] text-white rounded-xl text-xs font-semibold hover:bg-[#C24A6D] transition-colors"
            >
              Đổi tài khoản đăng nhập
            </Link>
            <Link
              to="/"
              className="w-full py-2.5 px-4 bg-slate-100 text-slate-700 rounded-xl text-xs font-semibold hover:bg-slate-200 transition-colors"
            >
              Quay về trang chủ
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return children ? <>{children}</> : null;
};
