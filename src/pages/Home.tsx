/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Sparkles, Check, ArrowRight, Eye, Shield, Award, Lock, LogIn, Instagram, ExternalLink } from 'lucide-react';
import { useAuth } from '../context/AuthContext.tsx';
import { productService } from '../services/productService.ts';
import { Product } from '../types/product.ts';
import { ProductCard } from '../components/product/ProductCard.tsx';
import { siteContentService, HeroSlide } from '../services/siteContentService.ts';

export const Home: React.FC = () => {
  const { user } = useAuth();
  const [heroSlides, setHeroSlides] = useState<HeroSlide[]>(() => siteContentService.getSettings().heroSlides);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [bestSellers, setBestSellers] = useState<Product[]>([]);
  const [newArrivals, setNewArrivals] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterSubscribed, setNewsletterSubscribed] = useState(false);

  useEffect(() => {
    async function loadData() {
      try {
        const all = await productService.getProducts();
        const bs = all.filter((p) => p.is_best_seller);
        setBestSellers(bs.length > 0 ? bs.slice(0, 4) : all.slice(0, 4));
        const na = all.filter((p) => p.is_new);
        setNewArrivals(na.length > 0 ? na.slice(0, 4) : all.slice(4, 8));
      } catch (err) {
        console.error('Error loading products for home:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  // Listen for site settings update
  useEffect(() => {
    const handleUpdate = () => {
      const updated = siteContentService.getSettings().heroSlides;
      if (updated && updated.length > 0) {
        setHeroSlides(updated);
      }
    };
    window.addEventListener('dyadia_site_settings_updated', handleUpdate);
    return () => window.removeEventListener('dyadia_site_settings_updated', handleUpdate);
  }, []);

  // Autoplay hero slider
  useEffect(() => {
    if (heroSlides.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [heroSlides.length]);

  const handlePrevSlide = () => {
    if (heroSlides.length === 0) return;
    setCurrentSlide((prev) => (prev - 1 + heroSlides.length) % heroSlides.length);
  };

  const handleNextSlide = () => {
    if (heroSlides.length === 0) return;
    setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
  };

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newsletterEmail) {
      setNewsletterSubscribed(true);
      setTimeout(() => setNewsletterSubscribed(false), 5000);
      setNewsletterEmail('');
    }
  };

  return (
    <div className="space-y-20 pb-20">
      {/* 1. Hero Carousel */}
      <section className="relative w-full overflow-hidden bg-[#FFF9FA]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
          <div className="relative rounded-3xl overflow-hidden aspect-[16/9] sm:aspect-[21/9] min-h-[380px] bg-rose-950 shadow-lg shadow-rose-100/60 border border-rose-100">
            {heroSlides.map((slide, index) => (
              <div
                key={slide.id}
                className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
                  index === currentSlide ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'
                }`}
              >
                <img
                  src={slide.image}
                  alt={slide.title}
                  className="w-full h-full object-cover object-center"
                />
                {/* Measured Scrim for legibility & Flexible Alignment */}
                {(() => {
                  const isRight =
                    slide.align === 'right' ||
                    slide.id === 'slide-cattitude' ||
                    slide.id === 'slide-dolly' ||
                    (Boolean(slide.kicker) && (slide.kicker.includes('Cat-titude') || slide.kicker.includes('Dolly')));
                  return (
                    <div
                      className={`absolute inset-0 flex items-center ${
                        isRight
                          ? 'bg-gradient-to-l from-[#2D1A21]/85 via-[#2D1A21]/50 to-transparent justify-end'
                          : 'bg-gradient-to-r from-[#2D1A21]/85 via-[#2D1A21]/50 to-transparent justify-start'
                      }`}
                    >
                      <div className={`p-6 sm:p-12 lg:p-16 max-w-xl text-white space-y-3 sm:space-y-4 ${isRight ? 'text-left sm:text-left mr-0 sm:mr-6' : 'text-left'}`}>
                        <span className="inline-flex items-center gap-1.5 text-xs font-semibold tracking-wider uppercase text-rose-200">
                          <Sparkles className="w-3.5 h-3.5" />
                          {slide.kicker}
                        </span>
                        <h1 className="text-2xl sm:text-4xl lg:text-5xl font-serif font-normal leading-tight">
                          {slide.title}
                        </h1>
                        <p className="text-xs sm:text-sm text-rose-50/90 line-clamp-2 sm:line-clamp-none max-w-md">
                          {slide.description}
                        </p>
                        <div className="pt-2">
                          <Link
                            to={slide.ctaLink}
                            className="inline-flex items-center gap-2 px-5 py-2.5 bg-white text-[#832B47] text-xs sm:text-sm font-semibold rounded-full hover:bg-rose-50 transition-all shadow-md"
                          >
                            <span>{slide.ctaText}</span>
                            <ArrowRight className="w-4 h-4" />
                          </Link>
                        </div>
                      </div>
                    </div>
                  );
                })()}
              </div>
            ))}

            {/* Navigation Arrows */}
            <button
              type="button"
              onClick={handlePrevSlide}
              aria-label="Slide trước"
              className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-white/20 hover:bg-white/40 text-white backdrop-blur-sm flex items-center justify-center transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              type="button"
              onClick={handleNextSlide}
              aria-label="Slide tiếp theo"
              className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-white/20 hover:bg-white/40 text-white backdrop-blur-sm flex items-center justify-center transition-colors"
            >
              <ChevronRight className="w-5 h-5" />
            </button>

            {/* Pagination Dots */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2">
              {heroSlides.map((_, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setCurrentSlide(idx)}
                  aria-label={`Tới slide ${idx + 1}`}
                  className={`h-2 rounded-full transition-all ${
                    idx === currentSlide ? 'w-6 bg-white' : 'w-2 bg-white/40 hover:bg-white/70'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Welcoming Perks Banner */}
      {!user && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-r from-[#FFE8EE] via-[#FFF4F6] to-[#FFE8EE] text-[#3A232B] border border-rose-200/80 p-6 sm:p-8 rounded-3xl shadow-xs flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="space-y-1.5 text-center md:text-left">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-white border border-rose-100 rounded-full text-xs text-[#B84A6A] font-medium shadow-2xs">
                <Sparkles className="w-3.5 h-3.5 text-[#D96B8A]" />
                <span>Đặc quyền thành viên mới Dyadia Lens</span>
              </div>
              <h3 className="text-lg sm:text-xl font-serif font-medium text-[#3A232B]">
                Đăng ký thành viên nhận ngay mã ưu đãi 10% cho đơn hàng đầu tiên
              </h3>
              <p className="text-xs text-slate-600 max-w-2xl leading-relaxed">
                Khám phá trọn bộ các mẫu lens thời thượng nhập khẩu Hàn Quốc. Mua lẻ từng chiếc tự do theo độ cận từng bên mắt. Đăng nhập để lưu đơn hàng và quản lý sổ địa chỉ dễ dàng.
              </p>
            </div>
            <div className="flex items-center gap-3 shrink-0">
              <Link
                to="/register"
                className="px-5 py-2.5 bg-[#D96B8A] hover:bg-[#C24A6D] text-white text-xs font-semibold rounded-xl transition-colors shadow-sm"
              >
                Đăng ký nhận quà
              </Link>
              <Link
                to="/login"
                className="px-5 py-2.5 bg-white hover:bg-rose-50 text-[#832B47] border border-rose-200 text-xs font-semibold rounded-xl transition-colors"
              >
                Đăng nhập
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* 2. Value Pillars Strip */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6 sm:p-8 bg-white border border-rose-100 rounded-2xl shadow-xs shadow-rose-100/40">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-xl bg-rose-50 border border-rose-100 flex items-center justify-center text-[#D96B8A] shrink-0">
              <Eye className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-[#3A232B]">Mua Lẻ Từng Chiếc Lens</h3>
              <p className="text-xs text-slate-500 mt-1">
                Linh hoạt lựa chọn độ cận riêng biệt cho mắt trái và mắt phải. Không lãng phí khi hai mắt lệch độ.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-xl bg-pink-50 border border-pink-100 flex items-center justify-center text-[#C24A6D] shrink-0">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-[#3A232B]">Chất Liệu Silicone Hydrogel</h3>
              <p className="text-xs text-slate-500 mt-1">
                Khả năng thẩm thấu oxy cao gấp 5 lần so với chất liệu thông thường, ngăn ngừa khô mỏi mắt.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-xl bg-rose-50 border border-rose-100 flex items-center justify-center text-[#D96B8A] shrink-0">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-[#3A232B]">Chuẩn Thẩm Mỹ K-Beauty</h3>
              <p className="text-xs text-slate-500 mt-1">
                Vân lens tinh xảo mô phỏng mống mắt tự nhiên, đa dạng từ tone trong trẻo đến sắc sảo cuốn hút.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Featured Categories: Based strictly on database categories */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-8">
          <div>
            <span className="text-xs uppercase tracking-widest text-[#D96B8A] font-medium">Bộ Sưu Tập</span>
            <h2 className="text-2xl sm:text-3xl font-serif font-normal text-[#3A232B] mt-1">
              Phân loại theo chu kỳ sử dụng
            </h2>
          </div>
          <Link
            to="/products"
            className="text-xs font-semibold text-[#B84A6A] hover:text-[#832B47] flex items-center gap-1"
          >
            <span>Xem tất cả</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <Link
            to="/products?category=Lens+1+ng%C3%A0y"
            className="group relative rounded-2xl overflow-hidden aspect-[4/3] bg-rose-950 shadow-sm border border-rose-100"
          >
            <img
              src="/images/models/model_daily_1day.jpg"
              alt="Lens 1 ngày"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-85"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#2D1A21]/80 via-[#2D1A21]/20 to-transparent flex flex-col justify-end p-6 text-white">
              <span className="text-[11px] uppercase tracking-wider text-rose-200">Daily Disposable</span>
              <h3 className="text-xl font-serif font-medium mt-0.5">Lens 1 ngày</h3>
              <p className="text-xs text-rose-50/90 mt-1">Tiện lợi, vệ sinh tối đa, không cần ngâm rửa</p>
            </div>
          </Link>

          <Link
            to="/products?category=Lens+1+th%C3%A1ng"
            className="group relative rounded-2xl overflow-hidden aspect-[4/3] bg-rose-950 shadow-sm border border-rose-100"
          >
            <img
              src="/images/models/model_monthly_1month.jpg"
              alt="Lens 1 tháng"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-85"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#2D1A21]/80 via-[#2D1A21]/20 to-transparent flex flex-col justify-end p-6 text-white">
              <span className="text-[11px] uppercase tracking-wider text-rose-200">Monthly Wear</span>
              <h3 className="text-xl font-serif font-medium mt-0.5">Lens 1 tháng</h3>
              <p className="text-xs text-rose-50/90 mt-1">Kinh tế, bền màu, chất liệu PC+Silicone Hydrogel</p>
            </div>
          </Link>

          <Link
            to="/products?category=Lens+kho%C3%A1+tr%E1%BB%A5c"
            className="group relative rounded-2xl overflow-hidden aspect-[4/3] bg-rose-950 shadow-sm border border-rose-100"
          >
            <img
              src="/images/models/model_toric.jpg"
              alt="Lens khoá trục"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-85"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#2D1A21]/80 via-[#2D1A21]/20 to-transparent flex flex-col justify-end p-6 text-white">
              <span className="text-[11px] uppercase tracking-wider text-rose-200">Toric Technology</span>
              <h3 className="text-xl font-serif font-medium mt-0.5">Lens khoá trục</h3>
              <p className="text-xs text-rose-50/90 mt-1">Ổn định trục nhìn, đường vân sắc nét tinh vi</p>
            </div>
          </Link>
        </div>
      </section>

      {/* 4. Best Sellers Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-8">
          <div>
            <span className="text-xs uppercase tracking-widest text-[#D96B8A] font-medium">Bán chạy nhất</span>
            <h2 className="text-2xl sm:text-3xl font-serif font-normal text-[#3A232B] mt-1">
              Sản phẩm được yêu thích
            </h2>
          </div>
          <Link
            to="/products"
            className="text-xs font-semibold text-[#B84A6A] hover:text-[#832B47] flex items-center gap-1"
          >
            <span>Xem thêm</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-72 bg-rose-50 rounded-xl animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {bestSellers.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </section>

      {/* 5. Brand Story Spotlight */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-br from-white via-[#FFF5F7] to-[#FFE8EE] border border-rose-100 rounded-3xl overflow-hidden grid grid-cols-1 lg:grid-cols-2 items-center shadow-xs">
          <div className="p-8 sm:p-12 lg:p-16 space-y-5">
            <span className="text-xs uppercase tracking-widest text-[#D96B8A] font-medium">
              Triết lý Dyadia
            </span>
            <h2 className="text-3xl sm:text-4xl font-serif font-normal text-[#3A232B] leading-snug">
              Tôn vinh vẻ đẹp chân thực của đôi mắt Á Đông
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Dyadia Lens ra đời từ mong muốn thấu hiểu sâu sắc người dùng kính áp tròng tại Việt Nam. Không phải ai cũng có độ cận hai mắt bằng nhau, và không phải ai cũng muốn bị ràng buộc bởi quy cách bán cả đôi cố định.
            </p>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Chúng tôi tiên phong mô hình đặt mua lẻ theo từng chiếc lens với thông số độ cận độc lập, giúp bạn tự do phối ghép độ cận chuẩn xác và tiết kiệm chi phí tối đa.
            </p>
            <div className="pt-2">
              <Link
                to="/about"
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#D96B8A] text-white text-xs font-semibold rounded-full hover:bg-[#C24A6D] transition-colors shadow-xs"
              >
                <span>Đọc thêm về Dyadia</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
          <div className="aspect-[4/3] lg:aspect-auto lg:h-full overflow-hidden bg-rose-50">
            <img
              src="/images/models/model_brand_story.jpg"
              alt="Dyadia Brand Story"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </section>

      {/* 6. New Arrivals */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-8">
          <div>
            <span className="text-xs uppercase tracking-widest text-[#D96B8A] font-medium">Mới ra mắt</span>
            <h2 className="text-2xl sm:text-3xl font-serif font-normal text-[#3A232B] mt-1">
              Bộ sưu tập xu hướng mới
            </h2>
          </div>
          <Link
            to="/products"
            className="text-xs font-semibold text-[#B84A6A] hover:text-[#832B47] flex items-center gap-1"
          >
            <span>Tất cả sản phẩm</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {newArrivals.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* 7. Instagram-style Visual Gallery */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <a
            href="https://www.instagram.com/hapakristin.global/"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 text-xs uppercase tracking-widest text-[#D96B8A] font-semibold hover:text-[#B84A6A] transition-colors"
          >
            <Instagram className="w-3.5 h-3.5" />
            <span>@hapakristin.global</span>
            <ExternalLink className="w-3 h-3 opacity-70" />
          </a>
          <h2 className="text-2xl sm:text-3xl font-serif font-normal text-[#3A232B] mt-1">
            Cảm hứng làm đẹp trên Instagram
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Khám phá xu hướng K-Beauty thời thượng và các lookbook mới nhất cùng Hapa Kristin
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <a
            href="https://www.instagram.com/hapakristin.global/"
            target="_blank"
            rel="noreferrer"
            className="aspect-square rounded-2xl overflow-hidden bg-rose-50 border border-rose-100 group relative block"
          >
            <img
              src="/images/lookbook/ins-001.jpg"
              alt="Insta look 1"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-[#3A232B]/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-xs font-medium">
              #CatTitudeKristin
            </div>
          </a>
          <a
            href="https://www.instagram.com/hapakristin.global/"
            target="_blank"
            rel="noreferrer"
            className="aspect-square rounded-2xl overflow-hidden bg-rose-50 border border-rose-100 group relative block"
          >
            <img
              src="/images/lookbook/ins-002.jpg"
              alt="Insta look 2"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-[#3A232B]/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-xs font-medium">
              #OneAndOnlyCrystal
            </div>
          </a>
          <a
            href="https://www.instagram.com/hapakristin.global/"
            target="_blank"
            rel="noreferrer"
            className="aspect-square rounded-2xl overflow-hidden bg-rose-50 border border-rose-100 group relative block"
          >
            <img
              src="/images/lookbook/ins-003.jpg"
              alt="Insta look 3"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-[#3A232B]/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-xs font-medium">
              #DollyChoco
            </div>
          </a>
          <a
            href="https://www.instagram.com/hapakristin.global/"
            target="_blank"
            rel="noreferrer"
            className="aspect-square rounded-2xl overflow-hidden bg-rose-50 border border-rose-100 group relative block"
          >
            <img
              src="/images/lookbook/ins-004.jpg"
              alt="Insta look 4"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-[#3A232B]/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-xs font-medium">
              #DyadiaDailyCare
            </div>
          </a>
        </div>
      </section>

      {/* 8. Newsletter Subscription (Demo Only) */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="bg-gradient-to-b from-[#FFF0F4] to-white border border-rose-100 rounded-3xl p-8 sm:p-12 shadow-xs">
          <span className="text-xs uppercase tracking-widest text-[#D96B8A] font-medium">Bản tin làm đẹp</span>
          <h2 className="text-2xl sm:text-3xl font-serif font-normal text-[#3A232B] mt-1">
            Đăng ký nhận ưu đãi & bí quyết chăm sóc mắt
          </h2>
          <p className="text-xs text-slate-500 mt-2 max-w-md mx-auto">
            Nhận mã giảm giá 10% cho đơn hàng đầu tiên (Mã: <strong className="text-[#B84A6A]">WELCOME10</strong>) cùng cẩm nang lựa chọn lens an toàn chuẩn y khoa.
          </p>

          <form onSubmit={handleNewsletterSubmit} className="mt-6 flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <input
              type="email"
              value={newsletterEmail}
              onChange={(e) => setNewsletterEmail(e.target.value)}
              placeholder="Nhập địa chỉ email của bạn..."
              required
              className="flex-1 px-4 py-2.5 text-xs bg-white border border-rose-200 rounded-full focus:outline-none focus:ring-1 focus:ring-rose-400"
            />
            <button
              type="submit"
              className="px-6 py-2.5 bg-[#D96B8A] text-white text-xs font-semibold rounded-full hover:bg-[#C24A6D] transition-colors whitespace-nowrap cursor-pointer shadow-xs"
            >
              Đăng ký
            </button>
          </form>

          {newsletterSubscribed && (
            <div className="mt-4 inline-flex items-center gap-1.5 text-xs text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-full">
              <Check className="w-4 h-4" />
              <span>Cảm ơn bạn đã đăng ký nhận bản tin ưu đãi từ Dyadia Lens!</span>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};
