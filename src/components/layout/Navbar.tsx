/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ShoppingBag, Search, Menu, X, Sparkles, User, LogOut, Package, ShieldCheck, Sliders } from 'lucide-react';
import { useCart } from '../../context/CartContext.tsx';
import { useAuth } from '../../context/AuthContext.tsx';
import { siteContentService } from '../../services/siteContentService.ts';

export const Navbar: React.FC = () => {
  const { totalQuantity } = useCart();
  const { user, profile, signOut, isAdmin, toggleAdminMode } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [accountDropdownOpen, setAccountDropdownOpen] = useState(false);
  const [siteSettings, setSiteSettings] = useState(() => siteContentService.getSettings());
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleUpdate = () => {
      setSiteSettings(siteContentService.getSettings());
    };
    window.addEventListener('dyadia_site_settings_updated', handleUpdate);
    return () => window.removeEventListener('dyadia_site_settings_updated', handleUpdate);
  }, []);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setAccountDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const navLinks = [
    { label: 'Trang chủ', path: '/' },
    { label: 'Sản phẩm', path: '/products' },
    { label: 'Hỏi đáp (FAQ)', path: '/faq' },
    { label: 'Blog & Cẩm nang', path: '/blog' },
    { label: 'Về Dyadia', path: '/about' },
    { label: 'Chính sách', path: '/policy' },
  ];

  const isActive = (path: string) => {
    if (path === '/' && location.pathname === '/') return true;
    if (path !== '/' && location.pathname.startsWith(path.split('?')[0])) return true;
    return false;
  };

  const handleLogout = async () => {
    setAccountDropdownOpen(false);
    setMobileMenuOpen(false);
    await signOut();
    navigate('/');
  };

  const displayName = profile?.full_name || user?.email?.split('@')[0] || 'Khách hàng';

  return (
    <header className="sticky top-0 z-40 w-full bg-white/95 backdrop-blur-md border-b border-rose-100 transition-colors shadow-2xs">
      {/* 1. Announcement Bar */}
      {siteSettings.announcementEnabled && (
        <div className="bg-gradient-to-r from-[#FCE7F3] via-[#FFE4EA] to-[#FCE7F3] text-[#832B47] text-xs py-1.5 px-4 text-center font-medium tracking-wide flex items-center justify-center border-b border-rose-100/70">
          <span>{siteSettings.announcementText.replace(/^✨\s*/, '')}</span>
        </div>
      )}

      {/* 2. Top Bar Contract: 3 Zones */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-8">
        {/* Zone 1: Brand Wordmark */}
        <Link
          to="/"
          className="text-2xl font-serif font-semibold tracking-wider text-[#3A232B] hover:text-[#B84A6A] whitespace-nowrap shrink-0 transition-colors"
        >
          DYADIA <span className="text-xs font-sans tracking-widest uppercase text-[#D96B8A] font-medium">LENS</span>
        </Link>

        {/* Zone 2: Clean Single-Line Nav Links */}
        <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-slate-600">
          {navLinks.map((item) => (
            <Link
              key={item.label}
              to={item.path}
              className={`whitespace-nowrap shrink-0 transition-colors py-1 relative ${
                isActive(item.path)
                  ? 'text-[#B84A6A] font-semibold after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-[#E17997]'
                  : 'hover:text-[#B84A6A]'
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Zone 3: Actions (Search, Cart, Customer Account) */}
        <div className="flex items-center gap-3 shrink-0">
          <Link
            to="/search"
            aria-label="Tìm kiếm sản phẩm"
            className="p-2 text-slate-600 hover:text-[#B84A6A] transition-colors"
          >
            <Search className="w-5 h-5" />
          </Link>

          <Link
            to="/cart"
            aria-label="Giỏ hàng"
            className="relative p-2 text-slate-700 hover:text-[#B84A6A] transition-colors flex items-center"
          >
            <ShoppingBag className="w-5 h-5" />
            {totalQuantity > 0 && (
              <span className="absolute top-1 right-0 min-w-[18px] h-[18px] px-1 bg-[#D96B8A] text-white text-[10px] font-bold rounded-full flex items-center justify-center tabular-nums shadow-sm animate-in zoom-in-50 duration-200">
                {totalQuantity}
              </span>
            )}
          </Link>

          {/* Admin Access Quick Badge - Only shown if logged in as Admin */}
          {user && isAdmin && (
            <Link
              to="/admin"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-[#832B47] bg-[#FFE4EA] hover:bg-[#F9CFD9] border border-rose-200 rounded-full transition-all shadow-xs"
              title="Truy cập Bảng điều khiển Quản trị viên"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-[#C24A6D]" />
              <span>Quản Trị</span>
            </Link>
          )}

          {/* Customer Auth / Account Zone */}
          {user ? (
            <div className="relative" ref={dropdownRef}>
              <button
                type="button"
                onClick={() => setAccountDropdownOpen(!accountDropdownOpen)}
                className="hidden sm:inline-flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-[#3A232B] bg-rose-50 hover:bg-rose-100 border border-rose-100 rounded-full transition-colors whitespace-nowrap cursor-pointer"
              >
                <div className="w-5 h-5 rounded-full bg-[#D96B8A] text-white text-[10px] flex items-center justify-center font-bold">
                  {displayName[0]?.toUpperCase()}
                </div>
                <span className="max-w-[110px] truncate">{displayName}</span>
              </button>

              {/* Dropdown Menu */}
              {accountDropdownOpen && (
                <div className="absolute right-0 mt-2 w-52 bg-white rounded-2xl shadow-lg border border-rose-100 py-2 z-50 text-xs animate-in fade-in-50 slide-in-from-top-2 duration-150">
                  <div className="px-4 py-2 border-b border-rose-50">
                    <p className="font-semibold text-slate-900 truncate">{displayName}</p>
                    <p className="text-[11px] text-slate-400 truncate">{user.email}</p>
                  </div>

                  {isAdmin && (
                    <Link
                      to="/admin"
                      onClick={() => setAccountDropdownOpen(false)}
                      className="flex items-center gap-2.5 px-4 py-2 text-[#832B47] bg-rose-50/70 hover:bg-rose-100 font-medium transition-colors"
                    >
                      <ShieldCheck className="w-4 h-4 text-[#D96B8A]" />
                      <span>Bảng Quản Trị Website</span>
                    </Link>
                  )}

                  <Link
                    to="/account?tab=orders"
                    onClick={() => setAccountDropdownOpen(false)}
                    className="flex items-center gap-2.5 px-4 py-2 text-slate-700 hover:bg-rose-50/50 transition-colors"
                  >
                    <Package className="w-4 h-4 text-rose-400" />
                    <span>Lịch sử đơn hàng</span>
                  </Link>

                  <Link
                    to="/account?tab=profile"
                    onClick={() => setAccountDropdownOpen(false)}
                    className="flex items-center gap-2.5 px-4 py-2 text-slate-700 hover:bg-rose-50/50 transition-colors"
                  >
                    <User className="w-4 h-4 text-rose-400" />
                    <span>Thông tin cá nhân</span>
                  </Link>

                  <div className="pt-1 mt-1 border-t border-rose-50">
                    <button
                      type="button"
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2.5 px-4 py-2 text-rose-600 hover:bg-rose-50 transition-colors text-left cursor-pointer"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Đăng xuất</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="hidden sm:flex items-center gap-2">
              <Link
                to="/login"
                className="px-3.5 py-1.5 text-xs font-semibold text-slate-700 hover:text-[#B84A6A] transition-colors"
              >
                Đăng nhập
              </Link>
              <Link
                to="/register"
                className="px-4 py-1.5 text-xs font-semibold text-white bg-[#D96B8A] hover:bg-[#C24A6D] rounded-full transition-colors shadow-xs"
              >
                Đăng ký
              </Link>
            </div>
          )}

          {/* Mobile menu trigger */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-slate-700 hover:text-[#B84A6A]"
            aria-label="Mở menu điều hướng"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#FFF9FA] border-b border-rose-100 px-4 pt-2 pb-6 space-y-2 animate-in slide-in-from-top duration-200">
          {navLinks.map((item) => (
            <Link
              key={item.label}
              to={item.path}
              onClick={() => setMobileMenuOpen(false)}
              className={`block px-3 py-2 rounded-lg text-sm ${
                isActive(item.path)
                  ? 'bg-rose-100/80 text-[#832B47] font-semibold'
                  : 'text-slate-700 hover:bg-rose-50'
              }`}
            >
              {item.label}
            </Link>
          ))}

          <div className="pt-3 border-t border-rose-100 space-y-2">
            {user ? (
              <>
                <Link
                  to="/account?tab=orders"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-2 px-3 py-2 text-sm text-slate-800 hover:bg-rose-50 rounded-lg"
                >
                  <Package className="w-4 h-4 text-rose-400" />
                  <span>Lịch sử đơn hàng</span>
                </Link>
                <Link
                  to="/account?tab=profile"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-2 px-3 py-2 text-sm text-slate-800 hover:bg-rose-50 rounded-lg"
                >
                  <User className="w-4 h-4 text-rose-400" />
                  <span>Thông tin cá nhân</span>
                </Link>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="w-full flex items-center gap-2 px-3 py-2 text-sm text-rose-600 hover:bg-rose-50 rounded-lg text-left"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Đăng xuất ({displayName})</span>
                </button>
              </>
            ) : (
              <div className="grid grid-cols-2 gap-2 pt-1">
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-center py-2 text-xs font-semibold text-[#832B47] bg-rose-100 rounded-xl"
                >
                  Đăng nhập
                </Link>
                <Link
                  to="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-center py-2 text-xs font-semibold text-white bg-[#D96B8A] rounded-xl"
                >
                  Đăng ký
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
