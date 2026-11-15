/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  Star,
  ShieldCheck,
  Truck,
  Plus,
  Minus,
  CheckCircle,
  AlertCircle,
  Info,
  Sparkles,
  ShoppingBag,
  ZoomIn,
  Droplet,
  Package,
  ChevronLeft,
  ChevronRight,
  X,
} from 'lucide-react';
import { productService } from '../services/productService.ts';
import { orderService } from '../services/orderService.ts';
import { Product, ProductVariant } from '../types/product.ts';
import { ProductReview } from '../types/order.ts';
import { formatCurrency } from '../lib/utils.ts';
import { useCart } from '../context/CartContext.tsx';
import { useAuth } from '../context/AuthContext.tsx';
import { LensIrisGraphic } from '../components/common/LensIrisGraphic.tsx';
import { APlusSection } from '../components/product/APlusSection.tsx';
import { ProductCard } from '../components/product/ProductCard.tsx';

const FormattedProductDescription: React.FC<{ text: string }> = ({ text }) => {
  if (!text) return null;

  // Split by double line breaks or major section headers
  const rawSections = text
    .split(/\n{2,}/)
    .map((s) => s.trim())
    .filter(Boolean);

  return (
    <div className="space-y-6 text-sm text-slate-700 leading-relaxed max-w-3xl mx-auto">
      {rawSections.map((section, sIdx) => {
        // Heading detection
        const isPackaging = /^(Quy cách đóng gói|Lưu ý về quy cách đóng gói|Lưu ý quy cách đóng gói|Lưu ý đóng gói)/i.test(section);
        const isIngredients = /^Thành phần/i.test(section);
        const isUsage = /^Cách sử dụng/i.test(section);
        const isBenefits = /^Công dụng/i.test(section);
        const isWarning = !isPackaging && /^(Lưu ý|Thận trọng)/i.test(section);
        const isContraindication = /^Chống chỉ định/i.test(section);

        if (isPackaging) {
          const lines = section.split('\n').filter(Boolean);
          const title = lines[0].replace(/:$/, '').trim();
          const bullets = lines.slice(1).filter((l) => l.trim().length > 0);
          return (
            <div key={sIdx} className="p-5 bg-gradient-to-r from-amber-50/80 via-[#FFF9FA] to-rose-50/60 border border-amber-200/80 rounded-2xl space-y-3 shadow-2xs">
              <h4 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-amber-900 flex items-center gap-2">
                <Package className="w-4 h-4 text-amber-600 shrink-0" />
                {title}
              </h4>
              <div className="space-y-2">
                {bullets.map((b, i) => (
                  <div key={i} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-800">
                    <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0" />
                    <span className="leading-relaxed text-justify">{b.replace(/^[•\-\*]\s*/, '')}</span>
                  </div>
                ))}
              </div>
            </div>
          );
        }

        if (isIngredients) {
          const lines = section.split('\n').filter(Boolean);
          const title = lines[0].replace(/:$/, '').trim();
          const body = lines.slice(1).join(' ').trim();
          return (
            <div key={sIdx} className="p-5 bg-sky-50/50 border border-sky-100 rounded-2xl shadow-2xs">
              <h4 className="text-xs font-bold uppercase tracking-wider text-sky-900 mb-2 flex items-center gap-2">
                <Droplet className="w-4 h-4 text-sky-600" />
                {title}
              </h4>
              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed text-justify">{body}</p>
            </div>
          );
        }

        if (isBenefits) {
          const lines = section.split('\n').filter(Boolean);
          const title = lines[0].replace(/:$/, '').trim();
          const body = lines.slice(1).join(' ').trim();
          return (
            <div key={sIdx} className="p-5 bg-rose-50/50 border border-rose-100 rounded-2xl shadow-2xs">
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#832B47] mb-2 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#D96B8A]" />
                {title}
              </h4>
              <p className="text-xs sm:text-sm text-slate-800 leading-relaxed text-justify">{body}</p>
            </div>
          );
        }

        if (isUsage) {
          const lines = section.split('\n').filter(Boolean);
          const title = lines[0].replace(/:$/, '').trim();
          const steps = lines.slice(1).filter((l) => l.trim().length > 0);
          return (
            <div key={sIdx} className="p-5 bg-white border border-slate-200 rounded-2xl space-y-3 shadow-xs">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-600" />
                {title}
              </h4>
              <div className="space-y-2.5">
                {steps.map((st, i) => (
                  <div key={i} className="flex items-start gap-3 text-xs sm:text-sm text-slate-700">
                    <span className="mt-0.5 inline-flex items-center justify-center w-5 h-5 rounded-full bg-rose-100 text-[#832B47] font-semibold text-[11px] shrink-0">
                      {i + 1}
                    </span>
                    <span className="leading-relaxed text-justify">{st.replace(/^(•|Bước\s*\d+:?|-)\s*/i, '')}</span>
                  </div>
                ))}
              </div>
            </div>
          );
        }

        if (isWarning) {
          const lines = section.split('\n').filter(Boolean);
          const title = lines[0].replace(/:$/, '').trim();
          const bullets = lines.slice(1).filter((l) => l.trim().length > 0);
          return (
            <div key={sIdx} className="p-5 bg-amber-50/60 border border-amber-200/80 rounded-2xl space-y-3 shadow-2xs">
              <h4 className="text-xs font-bold uppercase tracking-wider text-amber-900 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-amber-600" />
                {title}
              </h4>
              <div className="space-y-2">
                {bullets.map((b, i) => (
                  <div key={i} className="flex items-start gap-2.5 text-xs sm:text-sm text-amber-950">
                    <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0" />
                    <span className="leading-relaxed text-justify">{b.replace(/^[•\-\*]\s*/, '')}</span>
                  </div>
                ))}
              </div>
            </div>
          );
        }

        if (isContraindication) {
          const lines = section.split('\n').filter(Boolean);
          const title = lines[0].replace(/:$/, '').trim();
          const body = lines.slice(1).join(' ').trim();
          return (
            <div key={sIdx} className="p-4 bg-rose-50/80 border border-rose-200/80 rounded-xl">
              <h4 className="text-xs font-bold uppercase tracking-wider text-rose-800 mb-1 flex items-center gap-1.5">
                <X className="w-3.5 h-3.5 text-rose-600" />
                {title}
              </h4>
              <p className="text-xs text-rose-900 leading-relaxed text-justify">{body}</p>
            </div>
          );
        }

        // Bullet list section (like Opti-free or Khay)
        if (section.includes('\n•') || section.includes('\n-') || section.startsWith('•') || section.startsWith('-')) {
          const lines = section.split('\n').filter(Boolean);
          const intro = lines.filter((l) => !l.startsWith('•') && !l.startsWith('-')).join(' ');
          const items = lines.filter((l) => l.startsWith('•') || l.startsWith('-'));

          return (
            <div key={sIdx} className="space-y-3">
              {intro && (
                <p className="text-slate-800 font-medium text-sm sm:text-base leading-relaxed text-justify">
                  {intro}
                </p>
              )}
              <div className="space-y-2.5">
                {items.map((item, idx) => {
                  const cleaned = item.replace(/^[•\-\*]\s*/, '');
                  const colonIdx = cleaned.indexOf(':');
                  const heading = colonIdx > -1 ? cleaned.slice(0, colonIdx) : '';
                  const rest = colonIdx > -1 ? cleaned.slice(colonIdx + 1) : cleaned;

                  return (
                    <div key={idx} className="p-3.5 bg-white border border-rose-100 rounded-xl shadow-2xs flex items-start gap-3">
                      <span className="w-2 h-2 rounded-full bg-[#D96B8A] mt-1.5 shrink-0" />
                      <div className="text-xs sm:text-sm text-slate-700 leading-relaxed text-justify">
                        {heading && <strong className="text-slate-900 font-semibold">{heading}: </strong>}
                        <span>{rest}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        }

        // Standard prose paragraph (Contact lenses, etc.)
        return (
          <p key={sIdx} className="text-slate-700 leading-relaxed text-justify text-xs sm:text-sm">
            {section}
          </p>
        );
      })}
    </div>
  );
};

export const ProductDetail: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { addItem } = useCart();
  const { user } = useAuth();

  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [reviews, setReviews] = useState<ProductReview[]>([]);
  const [loading, setLoading] = useState(true);

  // Gallery state (up to 3 images per requirement)
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [isZoomOpen, setIsZoomOpen] = useState(false);

  // Selection states
  const [selectedPower, setSelectedPower] = useState<string>('');
  const [quantity, setQuantity] = useState<number>(1);
  const [activeTab, setActiveTab] = useState<'desc' | 'specs' | 'guide'>('desc');
  const [addedToast, setAddedToast] = useState(false);
  const [powerError, setPowerError] = useState(false);

  useEffect(() => {
    async function loadProduct() {
      if (!slug) return;
      setLoading(true);
      setActiveImageIndex(0);
      setIsZoomOpen(false);
      try {
        const found = await productService.getProductBySlug(slug);
        if (found) {
          setProduct(found);

          // If variants are loaded from public.product_variants, set default
          if (found.variants && found.variants.length > 0) {
            const availableVariant = found.variants.find((v) => v.stock_quantity > 0) || found.variants[0];
            setSelectedPower(availableVariant.prescription_power);
          } else if (found.prescription_power_options && found.prescription_power_options.length > 0) {
            setSelectedPower(found.prescription_power_options[0]);
          }

          const [related, prodReviews] = await Promise.all([
            productService.getRelatedProducts(found.id || found.sku || (slug as string), 4),
            orderService.getReviews(found.id),
          ]);
          setRelatedProducts(related);
          setReviews(prodReviews);
        }
      } catch (err) {
        console.error('Error loading product detail:', err);
      } finally {
        setLoading(false);
      }
    }
    loadProduct();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [slug]);

  const defaultDetailImages = [
    '/images/models/model_daily_1day.jpg',
    '/images/models/model_monthly_1month.jpg',
    '/images/models/model_toric.jpg',
    '/images/models/model_brand_story.jpg',
  ];

  const rawImages = product
    ? Array.from(
        new Set(
          [
            product.image_url,
            ...(Array.isArray(product.gallery_images) ? product.gallery_images : []),
          ]
            .map((img) => (typeof img === 'string' ? img.trim() : ''))
            .filter(Boolean)
        )
      )
    : [];

  const allImages = [...rawImages];
  if (product) {
    for (let i = 0; allImages.length < 3 && i < defaultDetailImages.length; i++) {
      if (!allImages.includes(defaultDetailImages[i])) {
        allImages.push(defaultDetailImages[i]);
      }
    }
  }
  const gallerySlides = allImages.slice(0, 3);
  const currentDisplayImage = gallerySlides[activeImageIndex] || gallerySlides[0] || null;

  const handlePrevImage = () => {
    if (gallerySlides.length <= 1) return;
    setActiveImageIndex((prev) => (prev - 1 + gallerySlides.length) % gallerySlides.length);
  };

  const handleNextImage = () => {
    if (gallerySlides.length <= 1) return;
    setActiveImageIndex((prev) => (prev + 1) % gallerySlides.length);
  };

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      if (e.key === 'ArrowLeft') handlePrevImage();
      else if (e.key === 'ArrowRight') handleNextImage();
      else if (e.key === 'Escape' && isZoomOpen) setIsZoomOpen(false);
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [gallerySlides.length, isZoomOpen]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <div className="aspect-[2/3] max-w-[460px] w-full mx-auto bg-slate-100 rounded-3xl animate-pulse" />
          <div className="space-y-4">
            <div className="h-6 bg-slate-100 rounded w-1/3 animate-pulse" />
            <div className="h-10 bg-slate-100 rounded w-3/4 animate-pulse" />
            <div className="h-8 bg-slate-100 rounded w-1/4 animate-pulse" />
            <div className="h-32 bg-slate-100 rounded animate-pulse" />
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center">
        <h2 className="text-2xl font-serif font-medium text-slate-800">
          Không tìm thấy thông tin sản phẩm
        </h2>
        <p className="text-xs text-slate-500 mt-2">
          Sản phẩm có thể đã được gỡ hoặc đường dẫn không chính xác.
        </p>
        <Link
          to="/products"
          className="mt-6 inline-block px-5 py-2.5 text-xs font-semibold text-white bg-[#D96B8A] rounded-lg"
        >
          Quay lại danh mục sản phẩm
        </Link>
      </div>
    );
  }

  const isContactLens = !product.product_type || product.product_type === 'contact_lens';
  const isSolution = product.product_type === 'lens_solution';
  const isAccessory = product.product_type === 'accessory';
  const is1DayLens = Boolean(
    isContactLens &&
      (product.replacement_period_days === 1 ||
        product.category?.toLowerCase().includes('1 ngày') ||
        product.product_name?.toLowerCase().includes('1 ngày') ||
        product.product_name?.toLowerCase().includes('1 day') ||
        product.slug?.includes('1-day'))
  );

  const isPriceMissing = product.price === null || product.price === undefined;

  // Variant checking
  const variants: ProductVariant[] = product.variants || [];
  const selectedVariant = variants.find((v) => v.prescription_power === selectedPower);
  const variantStock = selectedVariant ? selectedVariant.stock_quantity : (product.stock_quantity ?? 99);
  const isOutOfStock = !isPriceMissing && (isContactLens && variants.length > 0 ? variantStock <= 0 : (product.stock_quantity !== null && (product.stock_quantity ?? 0) <= 0));
  const maxStock = isContactLens && selectedVariant ? selectedVariant.stock_quantity : (product.stock_quantity ?? 99);

  const handleAddToCart = () => {
    if (isPriceMissing) {
      alert('Sản phẩm hiện đang được cập nhật giá niêm yết từ hệ thống. Quý khách vui lòng liên hệ tư vấn để được hỗ trợ báo giá và đặt trước!');
      return;
    }
    if (isOutOfStock) return;

    if (isContactLens && (variants.length > 0 || (product.prescription_power_options && product.prescription_power_options.length > 0))) {
      if (!selectedPower) {
        setPowerError(true);
        return;
      }
    }
    setPowerError(false);

    addItem(product, isContactLens ? (selectedPower || '0.00') : 'Tiêu chuẩn', quantity);
    setAddedToast(true);
    setTimeout(() => setAddedToast(false), 4000);
  };

  const handleBuyNow = () => {
    if (isPriceMissing) {
      alert('Sản phẩm hiện đang được cập nhật giá niêm yết từ hệ thống. Quý khách vui lòng liên hệ tư vấn để được hỗ trợ báo giá và đặt trước!');
      return;
    }
    if (isOutOfStock) return;

    if (isContactLens && (variants.length > 0 || (product.prescription_power_options && product.prescription_power_options.length > 0))) {
      if (!selectedPower) {
        setPowerError(true);
        return;
      }
    }
    setPowerError(false);

    addItem(product, isContactLens ? (selectedPower || '0.00') : 'Tiêu chuẩn', quantity);
    if (!user) {
      navigate('/login', { state: { from: { pathname: '/checkout' } } });
    } else {
      navigate('/checkout');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Toast notification */}
      {addedToast && (
        <div className="fixed top-20 right-4 sm:right-8 z-50 bg-[#D96B8A] text-white px-5 py-3.5 rounded-2xl shadow-xl flex items-center gap-3 animate-in slide-in-from-top-4 duration-300">
          <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0" />
          <div className="text-xs">
            <p className="font-semibold">Đã thêm vào giỏ hàng thành công!</p>
            <p className="text-slate-300">
              {product.product_name} {isContactLens && selectedPower ? `· Độ ${selectedPower}` : ''} · {quantity} {isContactLens ? 'chiếc' : 'sản phẩm'}
            </p>
          </div>
          <Link
            to="/cart"
            className="ml-3 px-3 py-1 bg-white text-slate-900 text-xs font-semibold rounded-lg hover:bg-slate-100"
          >
            Xem giỏ
          </Link>
        </div>
      )}

      {/* Breadcrumbs */}
      <nav className="flex items-center gap-2 text-xs text-slate-500 mb-6">
        <Link to="/" className="hover:text-slate-900">Trang chủ</Link>
        <span>/</span>
        <Link to="/products" className="hover:text-slate-900">Sản phẩm</Link>
        <span>/</span>
        {product.collection && (
          <>
            <Link to={`/products?collection=${encodeURIComponent(product.collection)}`} className="hover:text-slate-900">
              {product.collection}
            </Link>
            <span>/</span>
          </>
        )}
        <span className="text-slate-900 font-medium truncate max-w-[200px]">
          {product.product_name}
        </span>
      </nav>

      {/* Main PDP Grid: Left Gallery + Right Purchase Module */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* LEFT COLUMN: Gallery & Thumbnails (Max 3 Images, uncropped 2:3 framing + Prev/Next navigation) */}
        <div className="lg:col-span-6 space-y-4">
          <div className="max-w-[460px] w-full mx-auto space-y-4">
            <div className="relative aspect-[2/3] rounded-3xl bg-white border border-rose-100 overflow-hidden group shadow-xs flex items-center justify-center">
              {currentDisplayImage ? (
                <img
                  src={currentDisplayImage}
                  alt={product.product_name}
                  className="w-full h-full object-contain object-center transition-all duration-300 cursor-zoom-in"
                  onClick={() => setIsZoomOpen(true)}
                />
              ) : isContactLens ? (
                <div className="w-full h-full flex flex-col items-center justify-center p-8 bg-gradient-to-b from-[#FFF9FA] to-[#FFEFF4]">
                  <LensIrisGraphic colorName={product.color || 'Brown'} size={220} />
                  <span className="text-xs text-slate-500 mt-4 font-medium tracking-wide">
                    Màu: {product.color || 'Tự nhiên'}
                  </span>
                </div>
              ) : isSolution ? (
                <div className="w-full h-full flex flex-col items-center justify-center p-8 bg-gradient-to-b from-sky-50 to-indigo-50">
                  <Droplet className="w-20 h-20 text-sky-400 stroke-1 mb-2" />
                  <span className="text-sm font-semibold text-slate-700">{product.brand || 'Nước ngâm chuyên dụng'}</span>
                  {product.volume_ml && (
                    <span className="text-xs text-slate-500 mt-1">{product.volume_ml}ml</span>
                  )}
                </div>
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center p-8 bg-slate-50">
                  <Package className="w-16 h-16 text-slate-400 stroke-1" />
                  <span className="text-xs text-slate-500 mt-2 font-medium">Phụ kiện kính áp tròng</span>
                </div>
              )}

              {/* Previous / Next Navigation Arrows */}
              {gallerySlides.length > 1 && (
                <>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handlePrevImage();
                    }}
                    aria-label="Ảnh trước"
                    title="Ảnh trước (←)"
                    className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/85 hover:bg-white text-slate-800 border border-rose-200/80 shadow-md backdrop-blur-xs flex items-center justify-center transition-all hover:scale-105 cursor-pointer"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleNextImage();
                    }}
                    aria-label="Ảnh tiếp theo"
                    title="Ảnh tiếp theo (→)"
                    className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/85 hover:bg-white text-slate-800 border border-rose-200/80 shadow-md backdrop-blur-xs flex items-center justify-center transition-all hover:scale-105 cursor-pointer"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </>
              )}

              {/* Slide Counter Pill */}
              {gallerySlides.length > 1 && (
                <div className="absolute bottom-4 left-4 px-3 py-1 bg-white/85 backdrop-blur-xs text-slate-800 text-xs font-semibold rounded-full shadow-xs border border-rose-100">
                  {activeImageIndex + 1} / {gallerySlides.length}
                </div>
              )}

              {currentDisplayImage && (
                <button
                  type="button"
                  onClick={() => setIsZoomOpen(true)}
                  className="absolute bottom-4 right-4 p-2.5 bg-white/85 hover:bg-white text-slate-800 rounded-full shadow-sm border border-rose-100 backdrop-blur-xs transition-colors cursor-pointer"
                  title="Phóng to hình ảnh"
                >
                  <ZoomIn className="w-4 h-4" />
                </button>
              )}

              {isOutOfStock && (
                <div className="absolute inset-0 bg-white/70 backdrop-blur-[2px] flex items-center justify-center">
                  <span className="px-4 py-2 bg-[#D96B8A] text-white text-xs font-semibold rounded-lg shadow-md">
                    Tạm hết hàng
                  </span>
                </div>
              )}
            </div>

            {/* Thumbnail strip (Portrait 2:3 thumbnails so no faces/eyes get cropped) */}
            {gallerySlides.length > 1 && (
              <div className="flex items-center gap-3 overflow-x-auto pb-1">
                {gallerySlides.map((img, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setActiveImageIndex(idx)}
                    className={`relative w-16 h-24 rounded-xl overflow-hidden border-2 bg-white transition-all shrink-0 cursor-pointer ${
                      activeImageIndex === idx
                        ? 'border-[#D96B8A] shadow-sm scale-[1.03]'
                        : 'border-rose-100 opacity-65 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt={`Thumb ${idx + 1}`} className="w-full h-full object-contain" />
                  </button>
                ))}
              </div>
            )}

            {/* Contact lens safety banner */}
            {isContactLens && (
              <div className="p-4 bg-amber-50/70 border border-amber-200/60 rounded-2xl flex items-start gap-3 text-xs text-amber-900 leading-relaxed">
                <Info className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold">Khuyến cáo an toàn sử dụng kính áp tròng</p>
                  <p className="text-[11px] text-amber-800/90 mt-0.5">
                    Vui lòng đo khám thị lực định kỳ và tuân thủ đúng chu kỳ sử dụng ({product.replacement_period_days || 1} ngày). Không đeo lens khi ngủ. Nếu cảm thấy cộm ngứa bất thường, hãy tháo lens ngay.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* RIGHT COLUMN: Purchase Module */}
        <div className="lg:col-span-6 space-y-6">
          <div>
            <div className="flex items-center gap-2 text-xs text-slate-500 mb-1.5">
              {product.collection && (
                <>
                  <span className="font-semibold tracking-wider uppercase text-slate-700">
                    {product.collection}
                  </span>
                  <span aria-hidden="true">·</span>
                </>
              )}
              {product.category && (
                <>
                  <span className="text-slate-600">{product.category}</span>
                  <span aria-hidden="true">·</span>
                </>
              )}
              <span className="text-slate-600 font-mono text-[11px]">SKU: {product.sku}</span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-serif font-normal text-slate-900 leading-tight">
              {product.product_name}
            </h1>

            {/* Rating */}
            <div className="flex items-center gap-3 mt-2 text-xs">
              <div className="flex items-center gap-1 text-amber-500">
                <Star className="w-4 h-4 fill-amber-400 stroke-amber-400" />
                <span className="font-bold text-slate-900">{product.rating.toFixed(1)}</span>
              </div>
              <span className="text-slate-400">·</span>
              <span className="text-slate-600">{product.review_count} đánh giá</span>
              <span className="text-slate-400">·</span>
              <span className="text-emerald-700 font-medium">Chính hãng 100%</span>
            </div>
          </div>

          {/* Price Box */}
          <div className="p-4 bg-[#FFF9FA] border border-rose-100 rounded-2xl flex items-center justify-between">
            <div>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl sm:text-3xl font-bold text-slate-900 tabular-nums">
                  {formatCurrency(product.price)}
                </span>
                <span className="text-xs font-semibold text-slate-700 bg-white border border-slate-300 px-2.5 py-0.5 rounded-full shadow-2xs">
                  {isContactLens ? 'Giá / 1 chiếc' : 'Giá / 1 sản phẩm'}
                </span>
              </div>
              <p className="text-[11px] text-slate-500 mt-1">
                {isContactLens
                  ? 'Định giá theo từng chiếc đơn lẻ để bạn tự do chọn độ cận riêng cho từng mắt.'
                  : 'Sản phẩm bổ trợ chăm sóc lens đạt tiêu chuẩn y tế an toàn.'}
              </p>
            </div>

            <div className="text-right">
              <span
                className={`text-xs font-semibold px-2.5 py-1 rounded-md ${
                  isOutOfStock
                    ? 'text-rose-700 bg-rose-50 border border-rose-200'
                    : 'text-emerald-800 bg-emerald-50 border border-emerald-200'
                }`}
              >
                {isOutOfStock ? 'Hết hàng' : `Còn hàng (${maxStock} ${isContactLens ? 'chiếc' : 'sản phẩm'})`}
              </span>
            </div>
          </div>

          {/* Packaging Note for 1-Day Lenses */}
          {is1DayLens && (
            <div className="p-4 bg-gradient-to-r from-amber-50/90 via-[#FFF9FA] to-rose-50/60 border border-amber-200/80 rounded-2xl text-xs space-y-2 shadow-2xs">
              <div className="flex items-center gap-2 text-amber-900 font-semibold text-xs sm:text-sm">
                <Package className="w-4 h-4 text-amber-600 shrink-0" />
                <span>Lưu ý về quy cách đóng gói (Lens 1 ngày):</span>
              </div>
              <div className="space-y-1.5 text-slate-700 text-xs leading-relaxed pl-6">
                <p className="flex items-start gap-2">
                  <span className="text-amber-600 font-bold shrink-0">•</span>
                  <span>
                    <strong className="text-slate-900 font-semibold">Khi mua từ 10 chiếc cùng độ cận:</strong> Sản phẩm được đóng gói <strong className="text-[#832B47]">nguyên hộp chính hãng</strong> như hình ảnh mô tả.
                  </span>
                </p>
                <p className="flex items-start gap-2">
                  <span className="text-amber-600 font-bold shrink-0">•</span>
                  <span>
                    <strong className="text-slate-900 font-semibold">Khi mua lẻ (dưới 10 chiếc hoặc mua khác độ cận cho 2 mắt):</strong> Sản phẩm sẽ được đóng gói theo từng <strong className="text-slate-900">vỉ lens lẻ vô trùng</strong> tiện dụng, bảo đảm an toàn chuẩn y tế.
                  </span>
                </p>
              </div>
            </div>
          )}

          {/* Contact Lens Specific: Color & Variant Powers */}
          {isContactLens && (
            <>
              {product.color && (
                <div className="space-y-2">
                  <span className="text-xs font-medium text-slate-700">
                    Phân loại màu: <strong className="text-slate-900">{product.color}</strong>
                  </span>
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full border-2 border-[#D96B8A] p-0.5 flex items-center justify-center bg-white shadow-xs">
                      <div className="w-full h-full rounded-full overflow-hidden flex items-center justify-center">
                        <LensIrisGraphic colorName={product.color} size={30} />
                      </div>
                    </div>
                    <span className="text-xs text-slate-600 font-medium">{product.color}</span>
                  </div>
                </div>
              )}

              {/* Real Variants from product_variants table */}
              <div className="space-y-3 pt-2 border-t border-slate-100">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold uppercase tracking-wider text-slate-800">
                    Chọn độ cận (Diopter)
                  </label>
                  <span className="text-[11px] text-slate-500">
                    Đang chọn: <strong>{selectedPower || 'Chưa chọn'}</strong>
                  </span>
                </div>

                {powerError && (
                  <p className="text-xs text-rose-600 flex items-center gap-1 font-medium">
                    <AlertCircle className="w-3.5 h-3.5" />
                    Vui lòng chọn độ cận trước khi thêm vào giỏ hàng.
                  </p>
                )}

                {variants.length > 0 ? (
                  <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 max-h-56 overflow-y-auto p-1.5 border border-slate-200 rounded-xl bg-white">
                    {variants.map((v) => {
                      const isVariantOut = v.stock_quantity <= 0;
                      return (
                        <button
                          key={v.id || v.prescription_power}
                          type="button"
                          disabled={isVariantOut}
                          onClick={() => {
                            setSelectedPower(v.prescription_power);
                            setPowerError(false);
                          }}
                          className={`p-2 text-xs font-semibold rounded-lg border transition-all text-left flex flex-col justify-between cursor-pointer ${
                            selectedPower === v.prescription_power
                              ? 'bg-[#D96B8A] text-white border-[#D96B8A] shadow-xs'
                              : isVariantOut
                              ? 'bg-slate-100 text-slate-400 border-slate-200 opacity-60 cursor-not-allowed'
                              : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
                          }`}
                        >
                          <span className="font-mono text-sm">{v.prescription_power}</span>
                          <span className={`text-[10px] mt-1 font-normal ${selectedPower === v.prescription_power ? 'text-slate-300' : isVariantOut ? 'text-rose-500' : 'text-slate-500'}`}>
                            {isVariantOut ? 'Hết hàng' : `Còn ${v.stock_quantity} chiếc`}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                ) : product.prescription_power_options && product.prescription_power_options.length > 0 ? (
                  <div className="grid grid-cols-4 sm:grid-cols-6 gap-2 max-h-48 overflow-y-auto p-1 border border-slate-200 rounded-xl bg-white">
                    {product.prescription_power_options.map((power) => (
                      <button
                        key={power}
                        type="button"
                        onClick={() => {
                          setSelectedPower(power);
                          setPowerError(false);
                        }}
                        className={`py-2 text-xs font-semibold rounded-lg border transition-all cursor-pointer ${
                          selectedPower === power
                            ? 'bg-[#D96B8A] text-white border-[#D96B8A] shadow-xs'
                            : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
                        }`}
                      >
                        {power}
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-500">
                    Hiện đang cập nhật danh sách độ cận cho dòng lens này.
                  </div>
                )}
                <p className="text-[11px] text-slate-500 italic">
                  * Mẹo: Nếu 2 mắt lệch độ cận, bạn hãy chọn độ cho mắt thứ nhất và nhấn Thêm vào giỏ, sau đó chọn độ cho mắt thứ hai.
                </p>
              </div>
            </>
          )}

          {/* Lens Solution Specific: Volume & Brand highlights */}
          {isSolution && (
            <div className="space-y-3">
              <div className="p-3.5 bg-rose-50/40 border border-rose-100 rounded-2xl space-y-1.5 text-xs text-slate-700">
                {product.brand && (
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">Thương hiệu:</span>
                    <span className="font-semibold text-slate-900">{product.brand}</span>
                  </div>
                )}
                {product.volume_ml && (
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">Dung tích:</span>
                    <span className="font-semibold text-slate-900">{product.volume_ml} ml</span>
                  </div>
                )}
              </div>

              {/* Volume variant switcher for Renu */}
              {product.sku.startsWith('DY-SOL-RENU') && (
                <div className="space-y-2 pt-2 border-t border-slate-100">
                  <label className="text-xs font-semibold uppercase tracking-wider text-slate-800 block">
                    Dung tích
                  </label>
                  <div className="flex items-center gap-2">
                    <Link
                      to="/products/nuoc-ngam-lens-renu-fresh-120ml"
                      className={`px-4 py-2 text-xs font-semibold rounded-xl border transition-all ${
                        product.volume_ml === 120
                          ? 'bg-[#D96B8A] text-white border-[#D96B8A] shadow-xs'
                          : 'bg-white text-slate-700 hover:bg-rose-50 border-slate-200'
                      }`}
                    >
                      120ml
                    </Link>
                    <Link
                      to="/products/nuoc-ngam-lens-renu-fresh-355ml"
                      className={`px-4 py-2 text-xs font-semibold rounded-xl border transition-all ${
                        product.volume_ml === 355
                          ? 'bg-[#D96B8A] text-white border-[#D96B8A] shadow-xs'
                          : 'bg-white text-slate-700 hover:bg-rose-50 border-slate-200'
                      }`}
                    >
                      355ml
                    </Link>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Quantity Selector */}
          <div className="space-y-2 pt-2 border-t border-slate-100">
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-800 block">
              {isContactLens ? 'Số chiếc lens' : 'Số lượng'}
            </label>
            <div className="flex items-center gap-4">
              <div className="inline-flex items-center border border-slate-300 rounded-xl bg-white overflow-hidden shadow-2xs">
                <button
                  type="button"
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  disabled={quantity <= 1 || isOutOfStock}
                  className="p-2.5 text-slate-600 hover:text-slate-900 hover:bg-slate-50 disabled:opacity-30 transition-colors"
                  aria-label="Giảm số lượng"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="w-12 text-center text-xs font-bold text-slate-900 tabular-nums">
                  {quantity}
                </span>
                <button
                  type="button"
                  onClick={() => setQuantity((q) => Math.min(maxStock, q + 1))}
                  disabled={quantity >= maxStock || isOutOfStock}
                  className="p-2.5 text-slate-600 hover:text-slate-900 hover:bg-slate-50 disabled:opacity-30 transition-colors"
                  aria-label="Tăng số lượng"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>

              <span className="text-xs text-slate-500">
                Thành tiền:{' '}
                <strong className="text-slate-900">
                  {formatCurrency(product.price ? product.price * quantity : null)}
                </strong>
              </span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3 pt-2">
            <button
              type="button"
              onClick={handleAddToCart}
              disabled={isOutOfStock || isPriceMissing}
              className="w-full py-3.5 px-6 text-sm font-semibold text-white bg-[#D96B8A] hover:bg-[#C24A6D] disabled:bg-slate-300 rounded-xl transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>
                {isPriceMissing
                  ? 'Sản phẩm đang cập nhật giá'
                  : isOutOfStock
                  ? 'Tạm hết hàng'
                  : 'Thêm vào giỏ hàng'}
              </span>
            </button>

            <button
              type="button"
              onClick={handleBuyNow}
              disabled={isOutOfStock || isPriceMissing}
              className="w-full py-3 px-6 text-xs font-semibold text-slate-800 bg-rose-50 hover:bg-[#E4DFD5] disabled:opacity-40 rounded-xl transition-colors cursor-pointer"
            >
              {isPriceMissing ? 'Liên hệ báo giá' : 'Mua ngay'}
            </button>
          </div>

          {/* Trust markers */}
          <div className="grid grid-cols-2 gap-3 pt-4 border-t border-slate-200 text-xs text-slate-600">
            <div className="flex items-center gap-2">
              <Truck className="w-4 h-4 text-slate-500" />
              <span>Miễn phí ship đơn từ 299k</span>
            </div>
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-slate-500" />
              <span>Đổi trả trong 7 ngày</span>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs Section - Centered and Beautifully Structured */}
      <div className="mt-16 pt-12 border-t border-rose-100 max-w-4xl mx-auto">
        <div className="flex items-center justify-center gap-6 sm:gap-10 border-b border-rose-100 text-sm sm:text-base font-medium">
          <button
            type="button"
            onClick={() => setActiveTab('desc')}
            className={`pb-3.5 relative transition-colors cursor-pointer ${
              activeTab === 'desc'
                ? 'text-[#832B47] font-semibold after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-[#D96B8A]'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            Mô tả sản phẩm
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('specs')}
            className={`pb-3.5 relative transition-colors cursor-pointer ${
              activeTab === 'specs'
                ? 'text-[#832B47] font-semibold after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-[#D96B8A]'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            {isSolution ? 'Thông tin & Thành phần' : isAccessory ? 'Chi tiết phụ kiện' : 'Thông số kỹ thuật'}
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('guide')}
            className={`pb-3.5 relative transition-colors cursor-pointer ${
              activeTab === 'guide'
                ? 'text-[#832B47] font-semibold after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-[#D96B8A]'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            Hướng dẫn sử dụng
          </button>
        </div>

        <div className="py-8 max-w-3xl mx-auto text-slate-700 leading-relaxed">
          {activeTab === 'desc' && (
            <div className="space-y-6">
              <FormattedProductDescription text={product.description} />
              {!product.description?.includes('quy cách đóng gói') && is1DayLens && (
                <div className="p-5 bg-gradient-to-r from-amber-50/80 via-[#FFF9FA] to-rose-50/60 border border-amber-200/80 rounded-2xl space-y-3 shadow-2xs">
                  <h4 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-amber-900 flex items-center gap-2">
                    <Package className="w-4 h-4 text-amber-600 shrink-0" />
                    Lưu ý về quy cách đóng gói
                  </h4>
                  <div className="space-y-2">
                    <div className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-800">
                      <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0" />
                      <span className="leading-relaxed text-justify">
                        <strong className="text-slate-900 font-semibold">Mua từ 10 chiếc cùng độ cận:</strong> Sản phẩm sẽ được đóng trong hộp nguyên seal chính hãng như hình ảnh mô tả.
                      </span>
                    </div>
                    <div className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-800">
                      <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0" />
                      <span className="leading-relaxed text-justify">
                        <strong className="text-slate-900 font-semibold">Mua lẻ (dưới 10 chiếc hoặc lẻ độ cho 2 mắt):</strong> Sản phẩm sẽ được đóng gói theo từng vỉ lens lẻ vô trùng, tiện lợi bảo quản và bảo đảm an toàn y tế tuyệt đối.
                      </span>
                    </div>
                  </div>
                </div>
              )}
              {isContactLens && (
                <div className="p-4 bg-[#FFF9FA] border border-rose-100 rounded-2xl text-xs sm:text-sm text-slate-700 leading-relaxed text-justify">
                  <p className="font-semibold text-[#832B47] mb-1">Công nghệ đúc kép Sandwiched Pigment Layer</p>
                  <p className="text-slate-600">
                    Sản phẩm được hoàn thiện bằng công nghệ khóa hạt màu Sandwiched Pigment Layer độc quyền, ngăn chặn hạt màu tiếp xúc trực tiếp với giác mạc, giúp giữ mắt luôn an toàn và êm ái khi sử dụng.
                  </p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'specs' && (
            <div className="bg-white border border-rose-100 rounded-2xl overflow-hidden divide-y divide-rose-50 shadow-xs">
              <div className="grid grid-cols-2 p-3.5 text-xs sm:text-sm">
                <span className="text-slate-500">Mã sản phẩm (SKU)</span>
                <span className="font-semibold text-slate-900 font-mono">{product.sku}</span>
              </div>
              <div className="grid grid-cols-2 p-3.5 text-xs sm:text-sm">
                <span className="text-slate-500">Loại sản phẩm</span>
                <span className="font-semibold text-slate-900">
                  {isSolution ? 'Dung dịch chăm sóc lens' : isAccessory ? 'Phụ kiện kính áp tròng' : 'Kính áp tròng'}
                </span>
              </div>

              {/* Contact Lens Specs */}
              {isContactLens && (
                <>
                  <div className="grid grid-cols-2 p-3.5 text-xs sm:text-sm">
                    <span className="text-slate-500">Đường kính (DIA)</span>
                    <span className="font-semibold text-slate-900">
                      {product.dia ? `${product.dia} mm` : 'Đang cập nhật'}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 p-3.5 text-xs sm:text-sm">
                    <span className="text-slate-500">Đường kính đồ họa (G.DIA)</span>
                    <span className="font-semibold text-slate-900">
                      {product.graphic_dia ? `${product.graphic_dia} mm` : 'Đang cập nhật'}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 p-3.5 text-xs sm:text-sm">
                    <span className="text-slate-500">Độ cong cơ bản (Base Curve)</span>
                    <span className="font-semibold text-slate-900">
                      {product.base_curve ? `${product.base_curve} mm` : 'Đang cập nhật'}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 p-3.5 text-xs sm:text-sm">
                    <span className="text-slate-500">Độ ẩm (Water Content)</span>
                    <span className="font-semibold text-slate-900">
                      {product.water_content ? `${product.water_content}%` : 'Đang cập nhật'}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 p-3.5 text-xs sm:text-sm">
                    <span className="text-slate-500">Chất liệu</span>
                    <span className="font-semibold text-slate-900">{product.material || 'Đang cập nhật'}</span>
                  </div>
                  <div className="grid grid-cols-2 p-3.5 text-xs sm:text-sm">
                    <span className="text-slate-500">Chu kỳ sử dụng</span>
                    <span className="font-semibold text-slate-900">
                      {product.replacement_period_days ? `${product.replacement_period_days} ngày` : 'Đang cập nhật'}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 p-3.5 text-xs sm:text-sm">
                    <span className="text-slate-500">Quy cách đóng gói</span>
                    <span className="font-semibold text-slate-900">
                      {is1DayLens
                        ? 'Hộp 10 chiếc (khi mua 10 chiếc cùng độ) / Vỉ lẻ vô trùng (khi mua lẻ)'
                        : 'Hộp 2 chiếc (1 cặp) / Vỉ lẻ'}
                    </span>
                  </div>
                </>
              )}

              {/* Solution Specs */}
              {isSolution && (
                <>
                  {product.brand && (
                    <div className="grid grid-cols-2 p-3.5 text-xs sm:text-sm">
                      <span className="text-slate-500">Thương hiệu</span>
                      <span className="font-semibold text-slate-900">{product.brand}</span>
                    </div>
                  )}
                  {product.volume_ml && (
                    <div className="grid grid-cols-2 p-3.5 text-xs sm:text-sm">
                      <span className="text-slate-500">Dung tích</span>
                      <span className="font-semibold text-slate-900">{product.volume_ml} ml</span>
                    </div>
                  )}
                  {product.ingredients && (
                    <div className="grid grid-cols-2 p-3.5 text-xs sm:text-sm">
                      <span className="text-slate-500">Thành phần</span>
                      <span className="text-slate-900 text-justify">{product.ingredients}</span>
                    </div>
                  )}
                </>
              )}
            </div>
          )}

          {activeTab === 'guide' && (
            <div className="max-w-3xl mx-auto space-y-4 text-xs sm:text-sm">
              {product.sku.startsWith('DY-SOL-RENU') ? (
                <div className="bg-white border border-rose-100 p-6 rounded-2xl shadow-xs space-y-4">
                  <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                    <Droplet className="w-4 h-4 text-[#D96B8A]" />
                    Quy trình vệ sinh &amp; ngâm lens chuẩn y tế với Renu Fresh:
                  </h4>
                  <div className="space-y-3">
                    <div className="flex items-start gap-3 p-3.5 bg-rose-50/40 rounded-xl">
                      <span className="w-6 h-6 rounded-full bg-[#D96B8A] text-white font-bold text-xs flex items-center justify-center shrink-0">1</span>
                      <div>
                        <strong className="text-slate-900 block text-xs">Bước 1: Làm sạch mặt kính</strong>
                        <p className="text-slate-600 text-xs mt-0.5 leading-relaxed text-justify">
                          Nhỏ 3 giọt dung dịch đa năng Renu Fresh vào mỗi bên mặt kính áp tròng và nhẹ nhàng chà đều trong 20 giây để loại bỏ hoàn toàn cặn protein và bụi bẩn.
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3 p-3.5 bg-rose-50/40 rounded-xl">
                      <span className="w-6 h-6 rounded-full bg-[#D96B8A] text-white font-bold text-xs flex items-center justify-center shrink-0">2</span>
                      <div>
                        <strong className="text-slate-900 block text-xs">Bước 2: Tráng rửa</strong>
                        <p className="text-slate-600 text-xs mt-0.5 leading-relaxed text-justify">
                          Rửa kỹ mỗi bên của kính áp tròng trong 5 giây bằng dung dịch ngâm rửa Renu Fresh mới.
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3 p-3.5 bg-rose-50/40 rounded-xl">
                      <span className="w-6 h-6 rounded-full bg-[#D96B8A] text-white font-bold text-xs flex items-center justify-center shrink-0">3</span>
                      <div>
                        <strong className="text-slate-900 block text-xs">Bước 3: Khử trùng &amp; Bảo quản</strong>
                        <p className="text-slate-600 text-xs mt-0.5 leading-relaxed text-justify">
                          Đặt kính vào khay ngâm và rót đầy dung dịch Renu Fresh mới. Ngâm kính áp tròng ít nhất 4 giờ để dung dịch khử trùng và tái tạo độ ẩm hoàn hảo.
                        </p>
                      </div>
                    </div>
                    <div className="p-3.5 bg-amber-50 border border-amber-200/80 rounded-xl text-xs text-amber-900 flex items-start gap-2">
                      <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                      <span><strong>Lưu ý quan trọng:</strong> Luôn dùng dung dịch mới cho mỗi lần ngâm — tuyệt đối không tái sử dụng dung dịch đã ngâm. Đóng chặt nắp và sử dụng trong vòng 90 ngày sau khi mở nắp.</span>
                    </div>
                  </div>
                </div>
              ) : product.sku === 'DY-SOL-OPTI-12' || product.category === 'Nước nhỏ mắt' ? (
                <div className="bg-white border border-rose-100 p-6 rounded-2xl shadow-xs space-y-4">
                  <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                    <Droplet className="w-4 h-4 text-[#D96B8A]" />
                    Hướng dẫn sử dụng nước nhỏ mắt nhân tạo Opti-Free:
                  </h4>
                  <div className="space-y-3">
                    <div className="flex items-start gap-3 p-3.5 bg-rose-50/40 rounded-xl">
                      <span className="w-6 h-6 rounded-full bg-[#D96B8A] text-white font-bold text-xs flex items-center justify-center shrink-0">1</span>
                      <p className="text-slate-700 text-xs leading-relaxed text-justify">
                        Rửa sạch tay bằng xà phòng dịu nhẹ trước khi nhỏ mắt.
                      </p>
                    </div>
                    <div className="flex items-start gap-3 p-3.5 bg-rose-50/40 rounded-xl">
                      <span className="w-6 h-6 rounded-full bg-[#D96B8A] text-white font-bold text-xs flex items-center justify-center shrink-0">2</span>
                      <p className="text-slate-700 text-xs leading-relaxed text-justify">
                        Nhỏ trực tiếp 2 – 3 giọt vào mỗi bên mắt (kể cả khi đang đeo kính áp tròng).
                      </p>
                    </div>
                    <div className="flex items-start gap-3 p-3.5 bg-rose-50/40 rounded-xl">
                      <span className="w-6 h-6 rounded-full bg-[#D96B8A] text-white font-bold text-xs flex items-center justify-center shrink-0">3</span>
                      <p className="text-slate-700 text-xs leading-relaxed text-justify">
                        Chớp mắt nhẹ nhàng 2 – 3 lần để dung dịch lan tỏa, tạo màng bọc bôi trơn và xoa dịu tức thì cảm giác khô cộm.
                      </p>
                    </div>
                    <div className="flex items-start gap-3 p-3.5 bg-rose-50/40 rounded-xl">
                      <span className="w-6 h-6 rounded-full bg-[#D96B8A] text-white font-bold text-xs flex items-center justify-center shrink-0">4</span>
                      <p className="text-slate-700 text-xs leading-relaxed text-justify">
                        Sử dụng 3 – 4 lần mỗi ngày hoặc bất cứ khi nào mắt thấy khô rát khi làm việc với máy tính, điện thoại hay phòng máy lạnh. Đậy kín nắp lọ sau khi dùng.
                      </p>
                    </div>
                  </div>
                </div>
              ) : isAccessory ? (
                <div className="bg-white border border-rose-100 p-6 rounded-2xl shadow-xs space-y-4">
                  <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                    <Package className="w-4 h-4 text-[#D96B8A]" />
                    Hướng dẫn sử dụng &amp; bảo quản khay đựng lens:
                  </h4>
                  <div className="space-y-3">
                    <div className="flex items-start gap-3 p-3.5 bg-rose-50/40 rounded-xl">
                      <span className="w-6 h-6 rounded-full bg-[#D96B8A] text-white font-bold text-xs flex items-center justify-center shrink-0">1</span>
                      <p className="text-slate-700 text-xs leading-relaxed text-justify">
                        Tráng rửa sạch sẽ khay ngâm và các dụng cụ (nhíp gắp, que đeo) bằng nước ngâm lens chuyên dụng trước lần đầu sử dụng.
                      </p>
                    </div>
                    <div className="flex items-start gap-3 p-3.5 bg-rose-50/40 rounded-xl">
                      <span className="w-6 h-6 rounded-full bg-[#D96B8A] text-white font-bold text-xs flex items-center justify-center shrink-0">2</span>
                      <p className="text-slate-700 text-xs leading-relaxed text-justify">
                        Rót dung dịch ngâm mới vào ngập khoảng 2/3 mỗi ngăn chứa.
                      </p>
                    </div>
                    <div className="flex items-start gap-3 p-3.5 bg-rose-50/40 rounded-xl">
                      <span className="w-6 h-6 rounded-full bg-[#D96B8A] text-white font-bold text-xs flex items-center justify-center shrink-0">3</span>
                      <p className="text-slate-700 text-xs leading-relaxed text-justify">
                        Đặt kính áp tròng vào đúng ngăn ký hiệu L (mắt trái) và R (mắt phải), sau đó vặn chặt nắp khay để ngăn bụi bẩn và vi khuẩn.
                      </p>
                    </div>
                    <div className="flex items-start gap-3 p-3.5 bg-rose-50/40 rounded-xl">
                      <span className="w-6 h-6 rounded-full bg-[#D96B8A] text-white font-bold text-xs flex items-center justify-center shrink-0">4</span>
                      <p className="text-slate-700 text-xs leading-relaxed text-justify">
                        Rửa sạch và để khô ráo khay sau mỗi lần lấy lens ra đeo. Thay khay ngâm mới định kỳ từ 1 – 3 tháng một lần để bảo vệ an toàn tối đa cho mắt.
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="bg-white border border-rose-100 p-6 rounded-2xl shadow-xs space-y-4">
                  <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-[#D96B8A]" />
                    Quy trình đeo &amp; tháo kính áp tròng chuẩn y khoa:
                  </h4>
                  <ol className="list-decimal pl-5 space-y-2 text-slate-600 text-xs sm:text-sm">
                    <li className="leading-relaxed text-justify">Rửa sạch tay bằng xà phòng dịu nhẹ và lau khô hoàn toàn bằng khăn sạch không xơ trước khi chạm vào lens.</li>
                    <li className="leading-relaxed text-justify">Đặt lens lên đầu ngón trỏ, kiểm tra chiều cong đúng của lens (hình chiếc bát tròn đều, mép không bị loe ra ngoài).</li>
                    <li className="leading-relaxed text-justify">Dùng ngón giữa của cùng bàn tay kéo nhẹ mi dưới xuống, dùng ngón tay của bàn tay còn lại kéo mi trên lên, nhìn thẳng vào gương và nhẹ nhàng áp lens vào lòng đen.</li>
                    <li className="leading-relaxed text-justify">Nhắm mắt nhẹ nhàng và chớp mắt vài lần để lens tự động định vị đúng tâm giác mạc. Lặp lại tương tự cho mắt còn lại.</li>
                  </ol>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* A+ Content Section */}
      {(isContactLens || (product.aplus_images && product.aplus_images.length > 0)) && (
        <APlusSection product={product} aplusImages={product.aplus_images} />
      )}

      {/* Customer Verified Reviews */}
      <div className="mt-16 pt-12 border-t border-rose-100">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <div>
            <h2 className="text-xl sm:text-2xl font-serif font-normal text-slate-900">
              Đánh Giá Từ Khách Hàng Đã Mua ({reviews.length})
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Đánh giá xác thực từ khách hàng đã xác nhận nhận hàng trong vòng 15 ngày
            </p>
          </div>
          {reviews.length > 0 && (
            <div className="flex items-center gap-2 px-3.5 py-2 bg-rose-50/70 border border-rose-100 rounded-xl">
              <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
              <span className="text-sm font-bold text-slate-900">
                {(reviews.reduce((s, r) => s + Number(r.rating || 5), 0) / reviews.length).toFixed(1)}
              </span>
              <span className="text-xs text-slate-500">/ 5.0</span>
            </div>
          )}
        </div>

        {reviews.length === 0 ? (
          <div className="p-8 bg-rose-50/30 border border-rose-100 rounded-2xl text-center text-xs text-slate-500">
            Chưa có đánh giá nào cho sản phẩm này. Hãy đặt mua và xác nhận nhận hàng để chia sẻ trải nghiệm của bạn nhé!
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {reviews.map((rev) => (
              <div key={rev.id} className="p-5 bg-white border border-rose-100 rounded-2xl shadow-xs space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-slate-900">{rev.reviewer_name}</span>
                    <span className="text-[10px] px-2 py-0.5 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-full font-medium">
                      ✓ Đã mua hàng
                    </span>
                  </div>
                  <span className="text-[10px] text-slate-400">
                    {rev.created_at ? new Date(rev.created_at).toLocaleDateString('vi-VN') : ''}
                  </span>
                </div>
                <div className="flex items-center gap-0.5">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`w-3.5 h-3.5 ${
                        i < rev.rating ? 'fill-amber-400 text-amber-400' : 'text-slate-200'
                      }`}
                    />
                  ))}
                </div>
                <p className="text-xs text-slate-700 leading-relaxed">{rev.comment}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <div className="mt-20 pt-12 border-t border-slate-200">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-xl sm:text-2xl font-serif font-normal text-slate-900">
              Có thể bạn cũng thích
            </h2>
            <Link
              to="/products"
              className="text-xs font-semibold text-slate-700 hover:text-slate-950 underline underline-offset-4"
            >
              Xem tất cả
            </Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
            {relatedProducts.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      )}

      {/* Image Lightbox Modal */}
      {isZoomOpen && currentDisplayImage && (
        <div
          className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-xs flex items-center justify-center p-4"
          onClick={() => setIsZoomOpen(false)}
        >
          <div className="relative max-w-2xl w-full bg-white rounded-3xl overflow-hidden shadow-2xl p-3" onClick={(e) => e.stopPropagation()}>
            <button
              type="button"
              onClick={() => setIsZoomOpen(false)}
              aria-label="Đóng"
              className="absolute top-4 right-4 z-10 w-9 h-9 bg-white/90 hover:bg-white text-slate-800 rounded-full shadow-md border border-rose-100 flex items-center justify-center cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            {gallerySlides.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={handlePrevImage}
                  aria-label="Ảnh trước"
                  className="absolute left-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-white/90 hover:bg-white text-slate-800 border border-rose-200 shadow-md flex items-center justify-center cursor-pointer"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  type="button"
                  onClick={handleNextImage}
                  aria-label="Ảnh tiếp theo"
                  className="absolute right-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-white/90 hover:bg-white text-slate-800 border border-rose-200 shadow-md flex items-center justify-center cursor-pointer"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
                <div className="absolute bottom-5 left-1/2 -translate-x-1/2 z-10 px-3 py-1 bg-slate-900/75 text-white text-xs font-semibold rounded-full">
                  {activeImageIndex + 1} / {gallerySlides.length}
                </div>
              </>
            )}

            <img
              src={currentDisplayImage}
              alt={product.product_name}
              className="w-full max-h-[82vh] object-contain rounded-2xl mx-auto"
            />
          </div>
        </div>
      )}
    </div>
  );
};
