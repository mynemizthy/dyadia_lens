/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin, Instagram, Facebook } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-gradient-to-b from-white via-[#FFF7F9] to-[#FFEFF4] text-slate-600 pt-16 pb-12 border-t border-rose-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 pb-12 border-b border-rose-100">
          {/* Column 1: Brand Info */}
          <div className="space-y-4 md:col-span-1">
            <Link to="/" className="text-2xl font-serif font-semibold text-[#3A232B] tracking-wider block">
              DYADIA <span className="text-xs font-sans text-[#D96B8A] font-medium tracking-widest uppercase">LENS</span>
            </Link>
            <p className="text-xs leading-relaxed text-slate-500">
              Thương hiệu kính áp tròng phong cách Hàn Quốc mang đến vẻ đẹp trong trẻo, tự nhiên cho đôi mắt Á Đông. Tiên phong giải pháp định giá và mua lẻ theo từng chiếc lens cho khách hàng có độ cận khác nhau.
            </p>
            <div className="flex items-center gap-3 pt-2">
              <a
                href="https://www.instagram.com/hapakristin.global/"
                target="_blank"
                rel="noreferrer"
                aria-label="Instagram"
                className="w-8 h-8 rounded-full bg-rose-50 border border-rose-100 flex items-center justify-center text-[#D96B8A] hover:text-white hover:bg-[#D96B8A] transition-colors"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a
                href="https://www.facebook.com/profile.php?id=61594989420923"
                target="_blank"
                rel="noreferrer"
                aria-label="Facebook"
                className="w-8 h-8 rounded-full bg-rose-50 border border-rose-100 flex items-center justify-center text-[#D96B8A] hover:text-white hover:bg-[#D96B8A] transition-colors"
              >
                <Facebook className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-[#3A232B] uppercase tracking-wider">Khám phá</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link to="/products" className="hover:text-[#B84A6A] transition-colors">Tất cả sản phẩm</Link>
              </li>
              <li>
                <Link to="/products?category=Lens+1+ng%C3%A0y" className="hover:text-[#B84A6A] transition-colors">Lens 1 ngày (Daily)</Link>
              </li>
              <li>
                <Link to="/products?category=Lens+1+th%C3%A1ng" className="hover:text-[#B84A6A] transition-colors">Lens 1 tháng (Monthly)</Link>
              </li>
              <li>
                <Link to="/products?category=Lens+kho%C3%A1+tr%E1%BB%A5c" className="hover:text-[#B84A6A] transition-colors">Lens khoá trục</Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-[#B84A6A] transition-colors">Câu chuyện thương hiệu</Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Customer Care & Policies */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-[#3A232B] uppercase tracking-wider">Chính sách & Hỗ trợ</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link to="/account?tab=orders" className="hover:text-[#B84A6A] transition-colors">Tra cứu đơn hàng</Link>
              </li>
              <li>
                <Link to="/account?tab=profile" className="hover:text-[#B84A6A] transition-colors">Tài khoản của tôi</Link>
              </li>
              <li>
                <Link to="/policy#shipping" className="hover:text-[#B84A6A] transition-colors">Chính sách giao hàng</Link>
              </li>
              <li>
                <Link to="/policy#return" className="hover:text-[#B84A6A] transition-colors">Chính sách đổi trả & bảo hành</Link>
              </li>
              <li>
                <Link to="/policy#payment" className="hover:text-[#B84A6A] transition-colors">Phương thức thanh toán</Link>
              </li>
              <li>
                <Link to="/policy#privacy" className="hover:text-[#B84A6A] transition-colors">Bảo mật thông tin</Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Contact info */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-[#3A232B] uppercase tracking-wider">Liên hệ</h4>
            <div className="space-y-2.5 text-xs text-slate-500">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-[#D96B8A] shrink-0 mt-0.5" />
                <span>56 Hoàng Diệu 2, TP. Thủ Đức, TP.HCM</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-[#D96B8A] shrink-0" />
                <a href="tel:0783465079" className="hover:text-[#B84A6A] transition-colors">0783465079</a>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-[#D96B8A] shrink-0" />
                <span>support@dyadialens.vn</span>
              </div>
              <div className="pt-2">
                <span className="inline-block text-[11px] text-[#832B47] bg-rose-100/70 border border-rose-200/70 px-2.5 py-1 rounded-lg">
                  Giờ làm việc: 08:00 – 17:30 (Thứ 2 – Thứ 7)
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Storefront Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row sm:items-center justify-between gap-3 md:pr-56 text-xs text-slate-500">
          <p className="text-[11px] text-slate-500">
            © {new Date().getFullYear()} Dyadia Lens. Thương hiệu kính áp tròng thẩm mỹ Hàn Quốc chính hãng.
          </p>
          <p className="text-[11px] text-[#832B47] font-medium">
            Chính hãng 100% · Hỗ trợ bảo hành đổi trả · Giao hàng toàn quốc
          </p>
        </div>
      </div>
    </footer>
  );
};
