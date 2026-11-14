/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ShieldCheck,
  Package,
  ShoppingBag,
  Sliders,
  Plus,
  Edit2,
  Trash2,
  GripVertical,
  Check,
  X,
  Search,
  Sparkles,
  ArrowUpDown,
  RefreshCw,
  ExternalLink,
  DollarSign,
  AlertCircle,
  Eye,
  CheckCircle2,
  Clock,
  Truck,
  Tag,
  Save,
  LayoutTemplate,
  BookOpen,
  FileText,
  MoveUp,
  MoveDown,
  Image as ImageIcon,
  Quote,
  Type,
  Lightbulb,
  CheckCircle,
  Gift,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Product } from '../types/product.ts';
import { formatCurrency } from '../lib/utils.ts';
import { getOrderStatusLabel } from '../types/order.ts';
import { siteContentService, SiteSettings, HeroSlide } from '../services/siteContentService.ts';
import { blogService } from '../services/blogService.ts';
import { BlogPost, BlogBlock, BlogCategory } from '../types/blog.ts';
import { policyService } from '../services/policyService.ts';
import { faqService } from '../services/faqService.ts';
import { aboutService, BrandAboutData, DEFAULT_ABOUT_DATA } from '../services/aboutService.ts';
import { PolicyItem } from '../types/policy.ts';
import { FAQItem } from '../types/faq.ts';

type AdminTab = 'products' | 'orders' | 'variants' | 'aplus' | 'site_customizer' | 'blog' | 'policies' | 'faqs' | 'about' | 'coupons' | 'black_friday';

export const Admin: React.FC = () => {
  const navigate = useNavigate();
  const { user, profile, isAdmin, getAccessToken } = useAuth();

  const [activeTab, setActiveTab] = useState<AdminTab>('products');
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [toastMessage, setToastMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  // Policies state
  const [policies, setPolicies] = useState<PolicyItem[]>([]);
  const [editingPolicy, setEditingPolicy] = useState<Partial<PolicyItem> | null>(null);
  const [savingPolicy, setSavingPolicy] = useState<boolean>(false);

  // FAQ state
  const [faqs, setFaqs] = useState<FAQItem[]>([]);
  const [editingFAQ, setEditingFAQ] = useState<Partial<FAQItem> | null>(null);
  const [savingFAQ, setSavingFAQ] = useState<boolean>(false);

  // Brand About state
  const [aboutData, setAboutData] = useState<BrandAboutData>(DEFAULT_ABOUT_DATA);
  const [savingAbout, setSavingAbout] = useState<boolean>(false);

  // Black Friday Subscribers state
  const [bfSubscribers, setBfSubscribers] = useState<Array<{ email: string; created_at: string; source?: string }>>([]);
  const [loadingBf, setLoadingBf] = useState<boolean>(false);

  const fetchBfSubscribers = async () => {
    setLoadingBf(true);
    try {
      const res = await fetch('/api/admin/black-friday-subscribers');
      if (res.ok) {
        const data = await res.json();
        if (data.success && Array.isArray(data.subscribers)) {
          setBfSubscribers(data.subscribers);
        }
      }
    } catch (err) {
      console.warn('Error loading Black Friday subscribers:', err);
    } finally {
      setLoadingBf(false);
    }
  };

  // Drag and drop state for products
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [isOrderChanged, setIsOrderChanged] = useState<boolean>(false);

  // Edit/Create Product Modal state
  const [editingProduct, setEditingProduct] = useState<Partial<Product> | null>(null);
  const [isCreating, setIsCreating] = useState<boolean>(false);
  const [savingProduct, setSavingProduct] = useState<boolean>(false);

  // Variant editing state
  const [selectedProductForVariants, setSelectedProductForVariants] = useState<string>('');
  const [variantsList, setVariantsList] = useState<any[]>([]);
  const [loadingVariants, setLoadingVariants] = useState<boolean>(false);

  // A+ Content editing state
  const [selectedProductForAplus, setSelectedProductForAplus] = useState<string>('');
  const [aplusSlots, setAplusSlots] = useState<Array<{ image: string; title: string; subtitle: string; description: string }>>([
    {
      image: '',
      title: 'A+ 01: Giới thiệu Thương hiệu & Cảm hứng Thiết kế',
      subtitle: 'Brand Story & Inspiration',
      description: 'Khắc họa triết lý thiết kế và nguồn cảm hứng sáng tạo đằng sau bộ sưu tập, mang lại cảm xúc cao cấp cho người đeo.',
    },
    {
      image: '',
      title: 'A+ 02: Chi tiết Vân Lens, Sắc độ & Thiết kế đi m ảnh',
      subtitle: 'Pattern & Color Pigment Details',
      description: 'Cận cảnh chi tiết vòng vân lens, độ chuyển màu đa tầng và hiệu ứng khúc xạ ánh sáng tự nhiên trên tròng mắt.',
    },
    {
      image: '',
      title: 'A+ 03: Trải nghiệm Đeo Thực tế & Hướng dẫn Phong cách',
      subtitle: 'Real Look & Styling Guide',
      description: 'Hình ảnh người mẫu thực tế trong các điều kiện ánh sáng khác nhau kết hợp gợi ý layout trang điểm phù hợp.',
    },
  ]);
  const [savingAplus, setSavingAplus] = useState<boolean>(false);

  // Site Customizer (Hero & Announcement) state
  const [siteSettings, setSiteSettings] = useState<SiteSettings>(() => siteContentService.getSettings());
  const [draggedSlideIndex, setDraggedSlideIndex] = useState<number | null>(null);

  // Blog Management state
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>(() => blogService.getPosts());
  const [editingBlogPost, setEditingBlogPost] = useState<BlogPost | null>(null);
  const [draggedBlogIndex, setDraggedBlogIndex] = useState<number | null>(null);
  const [draggedBlockIndex, setDraggedBlockIndex] = useState<number | null>(null);

  // Toast auto-clear
  useEffect(() => {
    if (toastMessage) {
      const t = setTimeout(() => setToastMessage(null), 4000);
      return () => clearTimeout(t);
    }
  }, [toastMessage]);

  // Load products, orders, policies, faqs, about
  const loadData = async () => {
    setLoading(true);
    try {
      const [prodRes, orderRes, loadedPolicies, loadedFaqs, loadedAbout] = await Promise.all([
        fetch(`/api/products?t=${Date.now()}`, { cache: 'no-store' }),
        fetch(`/api/admin/orders?t=${Date.now()}`, {
          cache: 'no-store',
          headers: {
            'x-admin-key': 'dyadia2026',
            ...(getAccessToken() ? { Authorization: `Bearer ${getAccessToken()}` } : {}),
          },
        }),
        policyService.getPolicies(),
        faqService.getFAQs(),
        aboutService.getAboutData(),
      ]);

      setPolicies(loadedPolicies);
      setFaqs(loadedFaqs);
      setAboutData(loadedAbout);

      if (prodRes.ok) {
        const pJson = await prodRes.json();
        if (pJson.success && Array.isArray(pJson.data)) {
          setProducts(pJson.data);
          if (pJson.data.length > 0) {
            if (!selectedProductForVariants) setSelectedProductForVariants(pJson.data[0].id);
            if (!selectedProductForAplus) setSelectedProductForAplus(pJson.data[0].id);
          }
        }
      }

      if (orderRes.ok) {
        const oJson = await orderRes.json();
        if (oJson.success && Array.isArray(oJson.data)) {
          setOrders(oJson.data);
        }
      }
    } catch (err) {
      console.error('Lỗi khi tải dữ liệu admin:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
    fetchBfSubscribers();
  }, []);

  useEffect(() => {
    if (activeTab === 'black_friday') {
      fetchBfSubscribers();
    }
  }, [activeTab]);

  // Sync selected product for A+ content (supports 2-7+ dynamic slots)
  useEffect(() => {
    if (!selectedProductForAplus || products.length === 0) return;
    const prod = products.find((p) => p.id === selectedProductForAplus);
    if (!prod) return;
    const defaultTitles = [
      'A+ 01: Giới thiệu Thương hiệu & Cảm hứng Thiết kế',
      'A+ 02: Chi tiết Vân Lens, Sắc độ & Thiết kế Điểm ảnh',
      'A+ 03: Trải nghiệm Đeo Thực tế & Hướng dẫn Phong cách',
    ];
    const defaultSubtitles = [
      'Brand Story & Inspiration',
      'Pattern & Color Pigment Details',
      'Real Look & Styling Guide',
    ];
    const existingImages = Array.isArray(prod.aplus_images)
      ? prod.aplus_images.filter((img): img is string => typeof img === 'string' && img.trim().length > 0)
      : [];
    const slotCount = Math.max(existingImages.length, prod.aplus_content?.length || 0, 2);

    setAplusSlots(
      Array.from({ length: slotCount }, (_, i) => ({
        image: existingImages[i] || '',
        title: prod.aplus_content?.[i]?.title || defaultTitles[i] || `Ảnh mô tả #${i + 1}`,
        subtitle: prod.aplus_content?.[i]?.subtitle || defaultSubtitles[i] || `Gallery Slide 0${i + 1}`,
        description: prod.aplus_content?.[i]?.description || '',
      }))
    );
  }, [selectedProductForAplus, products]);

  // Handler: Save A+ Content to Supabase
  const handleSaveAplus = async () => {
    if (!selectedProductForAplus) return;
    setSavingAplus(true);
    try {
      const aplus_images = aplusSlots
        .map((slot) => slot.image.trim())
        .filter(Boolean);
      const aplus_content = aplusSlots
        .filter((slot) => slot.image.trim())
        .map((slot) => ({
          image: slot.image.trim() || null,
          title: slot.title.trim(),
          subtitle: slot.subtitle.trim(),
          description: slot.description.trim(),
        }));

      const res = await fetch(`/api/admin/products/${selectedProductForAplus}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-key': 'dyadia2026',
          ...(getAccessToken() ? { Authorization: `Bearer ${getAccessToken()}` } : {}),
        },
        body: JSON.stringify({
          aplus_images,
        }),
      });
      if (!res.ok) throw new Error('Không thể lưu A+ Content');

      setProducts((prev) =>
        prev.map((p) =>
          p.id === selectedProductForAplus
            ? {
                ...p,
                aplus_images,
                aplus_content,
              }
            : p
        )
      );
      setToastMessage({ text: `Đã lưu ${aplus_images.length} ảnh mô tả A+ thành công!`, type: 'success' });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Lỗi lưu A+';
      setToastMessage({ text: msg, type: 'error' });
    } finally {
      setSavingAplus(false);
    }
  };

  // Handler: Save Site Customizer Settings
  const handleSaveSiteSettings = () => {
    siteContentService.saveSettings(siteSettings);
    setToastMessage({ text: 'Đã cập nhật banner & giao diện trang web thành công!', type: 'success' });
  };

  // Handler: Save Blog Post
  const handleSaveBlogPost = (post: BlogPost) => {
    blogService.savePost(post);
    setBlogPosts(blogService.getPosts());
    setEditingBlogPost(null);
    setToastMessage({ text: 'Đã lưu bài viết blog thành công!', type: 'success' });
  };

  // Handler: Delete Blog Post
  const handleDeleteBlogPost = (id: string) => {
    if (!window.confirm('Bạn có chắc muốn xóa bài viết này khỏi blog?')) return;
    blogService.deletePost(id);
    setBlogPosts(blogService.getPosts());
    setToastMessage({ text: 'Đã xóa bài viết khỏi blog.', type: 'success' });
  };

  // Handler: Save Blog Posts Order
  const handleSaveBlogOrder = (newOrder: BlogPost[]) => {
    blogService.saveAllPosts(newOrder);
    setBlogPosts(newOrder);
    setToastMessage({ text: 'Đã lưu thứ tự hiển thị blog!', type: 'success' });
  };

  // Load variants when selected product changes
  useEffect(() => {
    if (!selectedProductForVariants) return;
    async function fetchVariants() {
      setLoadingVariants(true);
      try {
        const res = await fetch(`/api/admin/variants/${selectedProductForVariants}`, {
          headers: {
            'x-admin-key': 'dyadia2026',
          },
        });
        const contentType = res.headers.get('content-type') || '';
        if (res.ok && contentType.includes('application/json')) {
          const json = await res.json();
          if (json.success) {
            setVariantsList(json.data || []);
          }
        }
      } catch (err) {
        console.error('Lỗi tải biến thể:', err);
      } finally {
        setLoadingVariants(false);
      }
    }
    fetchVariants();
  }, [selectedProductForVariants]);

  // Policy Handlers
  const handleSavePolicy = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPolicy || !editingPolicy.title) return;
    setSavingPolicy(true);
    try {
      const saved = await policyService.savePolicy({
        id: editingPolicy.id || `cs-${Date.now()}`,
        title: editingPolicy.title,
        category: editingPolicy.category || 'Chính sách chung',
        icon: editingPolicy.icon || 'FileText',
        display_order: Number(editingPolicy.display_order) || policies.length + 1,
        content: editingPolicy.content || '',
      });
      setPolicies(await policyService.getPolicies());
      setEditingPolicy(null);
      setToastMessage({ text: `Đã lưu chính sách "${editingPolicy.title}" thành công!`, type: 'success' });
    } catch {
      setToastMessage({ text: 'Lỗi khi lưu chính sách', type: 'error' });
    } finally {
      setSavingPolicy(false);
    }
  };

  const handleDeletePolicy = async (item: PolicyItem) => {
    if (!window.confirm(`Bạn có chắc chắn muốn xóa chính sách "${item.title}"?`)) return;
    try {
      await policyService.deletePolicy(item.id);
      setPolicies(await policyService.getPolicies());
      setToastMessage({ text: `Đã xóa chính sách "${item.title}"`, type: 'success' });
    } catch {
      setToastMessage({ text: 'Lỗi khi xóa chính sách', type: 'error' });
    }
  };

  // FAQ Handlers
  const handleSaveFAQ = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingFAQ || !editingFAQ.question) return;
    setSavingFAQ(true);
    try {
      const saved = await faqService.saveFAQ({
        id: editingFAQ.id || `faq-${Date.now()}`,
        question: editingFAQ.question,
        category: editingFAQ.category || 'Chăm sóc và vệ sinh kính',
        display_order: Number(editingFAQ.display_order) || faqs.length + 1,
        answer: editingFAQ.answer || '',
      });
      setFaqs(await faqService.getFAQs());
      setEditingFAQ(null);
      setToastMessage({ text: `Đã lưu câu hỏi FAQ thành công!`, type: 'success' });
    } catch {
      setToastMessage({ text: 'Lỗi khi lưu FAQ', type: 'error' });
    } finally {
      setSavingFAQ(false);
    }
  };

  const handleDeleteFAQ = async (item: FAQItem) => {
    if (!window.confirm(`Bạn có chắc chắn muốn xóa câu hỏi "${item.question}"?`)) return;
    try {
      await faqService.deleteFAQ(item.id);
      setFaqs(await faqService.getFAQs());
      setToastMessage({ text: `Đã xóa câu hỏi FAQ`, type: 'success' });
    } catch {
      setToastMessage({ text: 'Lỗi khi xóa FAQ', type: 'error' });
    }
  };

  // About Handlers
  const handleSaveAbout = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingAbout(true);
    try {
      await aboutService.saveAboutData(aboutData);
      setToastMessage({ text: 'Đã lưu nội dung Giới thiệu Thương hiệu thành công!', type: 'success' });
    } catch {
      setToastMessage({ text: 'Lỗi khi lưu thông tin thương hiệu', type: 'error' });
    } finally {
      setSavingAbout(false);
    }
  };

  // Drag and Drop reorder handlers
  const handleDragStart = (e: React.DragEvent, index: number) => {
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === index) return;

    const updated = [...products];
    const draggedItem = updated[draggedIndex];
    updated.splice(draggedIndex, 1);
    updated.splice(index, 0, draggedItem);

    setDraggedIndex(index);
    setProducts(updated);
    setIsOrderChanged(true);
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
  };

  const saveProductOrder = () => {
    try {
      localStorage.setItem('dyadia_products_order', JSON.stringify(products.map((p) => p.id)));
      setIsOrderChanged(false);
      setToastMessage({ text: 'Đã lưu thứ tự hiển thị sản phẩm trên website thành công!', type: 'success' });
    } catch {
      setToastMessage({ text: 'Không thể lưu thứ tự hiển thị', type: 'error' });
    }
  };

  // Save product changes (Create or Update directly to Supabase)
  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct) return;
    if (!editingProduct.product_name || !editingProduct.product_name.trim()) {
      setToastMessage({ text: 'Vui lòng nhập Tên sản phẩm trước khi lưu!', type: 'error' });
      return;
    }

    setSavingProduct(true);
    try {
      const isNew = isCreating || !editingProduct.id;
      const url = isNew ? '/api/admin/products' : `/api/admin/products/${editingProduct.id}`;
      const method = isNew ? 'POST' : 'PUT';

      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'x-admin-key': 'dyadia2026',
        },
        body: JSON.stringify(editingProduct),
      });

      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.error || 'Lưu sản phẩm thất bại');
      }

      setToastMessage({
        text: isNew
          ? `Đã thêm sản phẩm "${editingProduct.product_name}" thành công!`
          : `Đã cập nhật sản phẩm "${editingProduct.product_name}" thành công!`,
        type: 'success',
      });

      setEditingProduct(null);
      setIsCreating(false);
      await loadData();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Lỗi khi lưu sản phẩm';
      setToastMessage({ text: msg, type: 'error' });
    } finally {
      setSavingProduct(false);
    }
  };

  // Delete product directly from Supabase
  const handleDeleteProduct = async (prod: Product) => {
    if (!window.confirm(`Bạn có chắc chắn muốn xóa sản phẩm "${prod.product_name}" khỏi hệ thống? Thao tác này không thể hoàn tác.`)) {
      return;
    }

    try {
      const res = await fetch(`/api/admin/products/${prod.id}`, {
        method: 'DELETE',
        headers: {
          'x-admin-key': 'dyadia2026',
        },
      });

      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.error || 'Xóa sản phẩm thất bại');
      }

      setToastMessage({ text: `Đã xóa sản phẩm "${prod.product_name}" thành công!`, type: 'success' });
      await loadData();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Lỗi khi xóa sản phẩm';
      setToastMessage({ text: msg, type: 'error' });
    }
  };

  // Quick update order status
  const handleUpdateOrderStatus = async (orderId: number | string, newStatus: string) => {
    try {
      const res = await fetch(`/api/admin/orders/${orderId}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-key': 'dyadia2026',
        },
        body: JSON.stringify({ status: newStatus }),
      });

      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.error || 'Cập nhật trạng thái thất bại');
      }

      setOrders((prev) =>
        prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o))
      );
      setToastMessage({ text: `Đã đổi trạng thái đơn hàng sang "${getOrderStatusLabel(newStatus)}"`, type: 'success' });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Lỗi đổi trạng thái';
      setToastMessage({ text: msg, type: 'error' });
    }
  };

  // Quick update variant stock
  const handleUpdateVariantStock = async (variantId: string, newStock: number) => {
    try {
      const res = await fetch(`/api/admin/variants/${variantId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-key': 'dyadia2026',
        },
        body: JSON.stringify({ stock_quantity: newStock }),
      });

      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.error || 'Lỗi cập nhật');
      }

      setVariantsList((prev) =>
        prev.map((v) => (v.id === variantId ? { ...v, stock_quantity: newStock } : v))
      );
      setToastMessage({ text: 'Đã cập nhật tồn kho độ cận thành công!', type: 'success' });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Lỗi cập nhật';
      setToastMessage({ text: msg, type: 'error' });
    }
  };

  // Filtered products list for search
  const filteredProducts = products.filter(
    (p) =>
      p.product_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.sku.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.color || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.category || '').toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Calculate quick metrics (Revenue is officially recorded only after buyer confirms receipt)
  const isOrderCompleted = (o: any) =>
    o.status === 'completed' || o.status === 'Đã hoàn tất' || o.status === 'Hoàn thành' || Boolean(o.received_at);
  const completedOrders = orders.filter(isOrderCompleted);
  const totalRevenue = completedOrders.reduce((sum, o) => sum + (Number(o.total_amount) || 0), 0);
  const awaitingConfirmationRevenue = orders
    .filter((o) => o.status === 'delivered' || o.status === 'Đã giao hàng')
    .reduce((sum, o) => sum + (Number(o.total_amount) || 0), 0);
  const pendingOrdersCount = orders.filter((o) => o.status === 'pending').length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      {/* Toast Notification */}
      {toastMessage && (
        <div
          className={`fixed bottom-6 right-6 z-50 px-4 py-3 rounded-2xl shadow-xl flex items-center gap-3 text-xs font-medium animate-in slide-in-from-bottom-5 duration-200 ${
            toastMessage.type === 'success'
              ? 'bg-[#D96B8A] text-white border border-rose-300'
              : 'bg-rose-600 text-white'
          }`}
        >
          {toastMessage.type === 'success' ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          ) : (
            <AlertCircle className="w-4 h-4 text-rose-200 shrink-0" />
          )}
          <span>{toastMessage.text}</span>
        </div>
      )}


      {/* Top Banner & Mode Toggle */}
      <div className="bg-gradient-to-r from-[#D96B8A] via-[#E48DA5] to-[#D96B8A] text-white rounded-3xl p-6 sm:p-8 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-1.5">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/20 border border-white/30 text-white rounded-full text-xs font-semibold">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Khu Vực Quản Trị Hệ Thống (Dyadia CMS)</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-serif font-normal">
            Bảng Điều Khiển & Chỉnh Sửa Trực Tiếp Website
          </h1>
          <p className="text-xs text-rose-50 max-w-2xl leading-relaxed">
            Chỉnh sửa giá, tồn kho, tên sản phẩm và phân loại trực tiếp trên website. Kéo thả để thay đổi vị trí xuất hiện của sản phẩm. Mọi cập nhật được đồng bộ tự động với cơ sở dữ liệu hệ thống.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="px-4 py-2.5 rounded-xl text-xs font-semibold bg-white/20 text-white border border-white/30 flex items-center gap-2">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Admin: {user?.email || 'Quản Trị Viên'}</span>
          </div>
          <button
            type="button"
            onClick={loadData}
            title="Làm mới dữ liệu từ hệ thống"
            className="p-2.5 bg-white/10 hover:bg-white/20 text-white rounded-xl transition-colors cursor-pointer"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
          <Link
            to="/products"
            className="px-4 py-2.5 bg-white text-[#B84A6A] text-xs font-semibold rounded-xl hover:bg-rose-50 transition-colors shadow-sm inline-flex items-center gap-1.5"
          >
            <span>Xem Cửa Hàng</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white border border-rose-100 rounded-2xl p-5 shadow-xs">
          <span className="text-[11px] uppercase tracking-wider text-slate-400 font-medium">Tổng Sản Phẩm</span>
          <p className="text-2xl font-bold font-serif text-slate-900 mt-1">{products.length}</p>
          <span className="text-[10px] text-emerald-600 font-medium">
            {products.length} sản phẩm
          </span>
        </div>
        <div className="bg-white border border-rose-100 rounded-2xl p-5 shadow-xs">
          <span className="text-[11px] uppercase tracking-wider text-slate-400 font-medium">Đơn Hàng Mới</span>
          <p className="text-2xl font-bold font-serif text-amber-600 mt-1">{pendingOrdersCount}</p>
          <span className="text-[10px] text-slate-500">Đang chờ xác nhận</span>
        </div>
        <div className="bg-white border border-rose-100 rounded-2xl p-5 shadow-xs">
          <span className="text-[11px] uppercase tracking-wider text-slate-400 font-medium">Tổng Đơn Hàng</span>
          <p className="text-2xl font-bold font-serif text-slate-900 mt-1">{orders.length}</p>
          <span className="text-[10px] text-slate-500">Đã tiếp nhận</span>
        </div>
        <div className="bg-white border border-rose-100 rounded-2xl p-5 shadow-xs">
          <span className="text-[11px] uppercase tracking-wider text-slate-400 font-medium">Doanh Thu Đã Ghi Nhận</span>
          <p className="text-xl sm:text-2xl font-bold font-serif text-slate-900 mt-1">{formatCurrency(totalRevenue)}</p>
          <span className="text-[10px] text-emerald-600 font-medium block">
            Từ {completedOrders.length} đơn khách đã xác nhận nhận
          </span>
          {awaitingConfirmationRevenue > 0 && (
            <span className="text-[10px] text-amber-600 block mt-0.5">
              Chờ khách xác nhận: {formatCurrency(awaitingConfirmationRevenue)}
            </span>
          )}
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="flex items-center gap-2 border-b border-rose-100 pb-px overflow-x-auto">
        {[
          { id: 'products', label: 'Quản Lý & Kéo Thả Sản Phẩm', icon: Package },
          { id: 'orders', label: `Quản Lý Đơn Hàng (${orders.length})`, icon: ShoppingBag },
          { id: 'variants', label: 'Tồn Kho Độ Cận (Variants)', icon: ArrowUpDown },
          { id: 'aplus', label: 'Chỉnh Sửa A+ Content', icon: Sparkles },
          { id: 'site_customizer', label: 'Banner & Giao Diện Website', icon: LayoutTemplate },
          { id: 'blog', label: `Quản Lý Blog & Viết Bài (${blogPosts.length})`, icon: BookOpen },
          { id: 'policies', label: `Chính Sách & Quy Định (${policies.length})`, icon: FileText },
          { id: 'faqs', label: `Hỏi Đáp FAQ (${faqs.length})`, icon: Lightbulb },
          { id: 'about', label: 'Về Thương Hiệu (About Us)', icon: Quote },
          { id: 'coupons', label: 'Mã Giảm Giá & Ưu Đãi', icon: Tag },
          { id: 'black_friday', label: `Black Friday Leads (${bfSubscribers.length})`, icon: Gift },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id as AdminTab)}
              className={`flex items-center gap-2 px-5 py-3 text-xs font-semibold rounded-t-xl transition-all cursor-pointer whitespace-nowrap ${
                isActive
                  ? 'bg-white text-slate-900 border-t border-x border-rose-100 shadow-xs -mb-px'
                  : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* TAB 1: PRODUCT LIST & DRAG-AND-DROP REORDER */}
      {activeTab === 'products' && (
        <div className="space-y-6">
          {/* Controls Bar */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Tìm theo tên lens, mã SKU, màu sắc..."
                className="w-full pl-9 pr-4 py-2.5 text-xs bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-rose-400 shadow-xs"
              />
            </div>

            <div className="flex items-center gap-3">
              {isOrderChanged && (
                <button
                  type="button"
                  onClick={saveProductOrder}
                  className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-xl transition-colors shadow-sm inline-flex items-center gap-2 animate-bounce cursor-pointer"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>Lưu thứ tự mới</span>
                </button>
              )}

              <button
                type="button"
                onClick={() => {
                  setEditingProduct({
                    sku: `DY-${Date.now().toString().slice(-5)}`,
                    product_name: '',
                    slug: '',
                    product_type: 'contact_lens',
                    price: 95000,
                    stock_quantity: 50,
                    category: 'Lens 1 ngày',
                    collection: 'Cat-titude Kristin',
                    color: 'Brown',
                    replacement_period_days: 1,
                    material: 'Silicone Hydrogel',
                    dia: 14.2,
                    graphic_dia: 13.0,
                    base_curve: 8.7,
                    water_content: 48,
                    origin: 'Hàn Quốc (Made in Korea)',
                    image_url: '/src/assets/images/dyadia_hero_natural_brown_1793544640456.jpg',
                    gallery_images: ['', ''],
                    description: '',
                    is_new: true,
                    is_best_seller: false,
                  });
                  setIsCreating(true);
                }}
                className="px-4 py-2.5 bg-[#D96B8A] hover:bg-[#C24A6D] text-white text-xs font-semibold rounded-xl transition-colors shadow-sm inline-flex items-center gap-2 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Thêm Mẫu Lens Mới</span>
              </button>
            </div>
          </div>

          <div className="p-3 bg-amber-50/70 border border-amber-200/60 rounded-xl text-xs text-amber-900 flex items-center justify-between">
            <span className="flex items-center gap-2">
              <GripVertical className="w-4 h-4 text-amber-700" />
              <strong>Tính năng kéo thả:</strong> Nhấp giữ biểu tượng tay nắm ở đầu thẻ và kéo thả để sắp xếp vị trí hiển thị ưu tiên của lens trên website.
            </span>
            <span className="text-[11px] text-amber-800 font-mono">
              Hiển thị: {filteredProducts.length} / {products.length} sản phẩm
            </span>
          </div>

          {/* Draggable Product Cards Grid */}
          <div className="space-y-3">
            {filteredProducts.map((prod, index) => (
              <div
                key={prod.id}
                draggable
                onDragStart={(e) => handleDragStart(e, index)}
                onDragOver={(e) => handleDragOver(e, index)}
                onDragEnd={handleDragEnd}
                className={`bg-white border rounded-2xl p-4 transition-all shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4 cursor-move hover:border-slate-400 ${
                  draggedIndex === index ? 'opacity-40 border-dashed border-rose-400 bg-rose-50/30' : 'border-rose-100'
                }`}
              >
                <div className="flex items-center gap-4 flex-1 min-w-0">
                  <div className="text-slate-300 hover:text-slate-600 transition-colors cursor-grab active:cursor-grabbing p-1">
                    <GripVertical className="w-5 h-5" />
                  </div>

                  <div className="w-16 h-16 rounded-xl bg-slate-50 border border-slate-200 overflow-hidden shrink-0 flex items-center justify-center">
                    <img
                      src={prod.image_url || '/src/assets/images/dyadia_hero_natural_brown_1793544640456.jpg'}
                      alt=""
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div className="space-y-1 min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-mono px-2 py-0.5 bg-slate-100 text-slate-600 rounded">
                        {prod.sku}
                      </span>
                      <span className="text-[10px] px-2 py-0.5 bg-rose-50 text-rose-700 font-medium rounded-full">
                        {prod.category}
                      </span>
                      {prod.color && (
                        <span className="text-[10px] px-2 py-0.5 bg-amber-50 text-amber-800 font-medium rounded-full">
                          Tone {prod.color}
                        </span>
                      )}
                      {prod.is_best_seller && (
                        <span className="text-[10px] px-2 py-0.5 bg-amber-100 text-amber-900 font-bold rounded-full">
                          Best Seller
                        </span>
                      )}
                    </div>
                    <h3 className="text-sm font-semibold text-slate-900 truncate font-serif">
                      {prod.product_name}
                    </h3>
                    <p className="text-[11px] text-slate-500 truncate max-w-xl">
                      {prod.collection} · DIA: {prod.dia || '14.2mm'} · Graphic DIA: {prod.graphic_dia || '13.0mm'} · Base Curve: {prod.base_curve || '8.7mm'}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-6 shrink-0 w-full md:w-auto justify-between md:justify-end pt-3 md:pt-0 border-t md:border-t-0 border-slate-100">
                  <div className="text-left md:text-right">
                    <span className="text-sm font-bold text-slate-900 block font-mono">
                      {prod.price !== null ? formatCurrency(prod.price) : 'Liên hệ'}
                    </span>
                    <span className="text-[10px] text-slate-400 block">
                      Kho: {prod.stock_quantity ?? 'Theo độ cận'} chiếc
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <Link
                      to={`/products/${prod.slug}`}
                      target="_blank"
                      title="Xem trang sản phẩm ngoài website"
                      className="p-2 text-slate-400 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors"
                    >
                      <Eye className="w-4 h-4" />
                    </Link>

                    <button
                      type="button"
                      onClick={() => {
                        setEditingProduct(prod);
                        setIsCreating(false);
                      }}
                      className="px-3 py-1.5 bg-[#D96B8A] hover:bg-[#C24A6D] text-white text-xs font-semibold rounded-lg transition-colors inline-flex items-center gap-1.5 cursor-pointer shadow-xs"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                      <span>Sửa</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleDeleteProduct(prod)}
                      className="p-2 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                      title="Xóa sản phẩm"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}


      {/* TAB 2: ORDERS MANAGEMENT */}
      {activeTab === 'orders' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-semibold text-slate-900 font-serif">
              Tất Cả Đơn Hàng Đã Đặt Trên Hệ Thống ({orders.length})
            </h2>
            <span className="text-xs text-slate-500">
              Quy trình: Chờ xác nhận ➔ Đã xác nhận ➔ Đang giao hàng ➔ Người bán bấm Đã giao ➔ Khách xác nhận nhận hàng (Ghi nhận doanh thu & mở đánh giá 15 ngày)
            </span>
          </div>

          {orders.length === 0 ? (
            <div className="bg-white border border-rose-100 rounded-2xl p-12 text-center text-slate-500 text-xs">
              Chưa có đơn hàng nào được ghi nhận.
            </div>
          ) : (
            <div className="space-y-4">
              {orders.map((ord) => {
                const customer = ord.customer || {};
                const items = ord.items || [];
                return (
                  <div
                    key={ord.id}
                    className="bg-white border border-rose-100 rounded-2xl p-6 shadow-xs space-y-4"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
                      <div>
                        <span className="text-[10px] uppercase tracking-wider text-slate-400">Mã đơn hàng</span>
                        <p className="text-base font-bold font-mono text-slate-900">{ord.order_code}</p>
                      </div>

                      <div className="flex flex-wrap items-center gap-2.5">
                        {ord.status === 'pending' && (
                          <button
                            type="button"
                            onClick={() => handleUpdateOrderStatus(ord.id, 'confirmed')}
                            className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-lg transition-colors cursor-pointer"
                          >
                            Xác nhận đơn
                          </button>
                        )}
                        {ord.status === 'confirmed' && (
                          <button
                            type="button"
                            onClick={() => handleUpdateOrderStatus(ord.id, 'shipping')}
                            className="px-3 py-1.5 bg-sky-600 hover:bg-sky-700 text-white text-xs font-semibold rounded-lg transition-colors cursor-pointer"
                          >
                            Giao ĐVVC
                          </button>
                        )}
                        {ord.status === 'shipping' && (
                          <button
                            type="button"
                            onClick={() => handleUpdateOrderStatus(ord.id, 'delivered')}
                            className="px-3 py-1.5 bg-rose-500 hover:bg-rose-600 text-white text-xs font-semibold rounded-lg transition-colors shadow-xs cursor-pointer inline-flex items-center gap-1"
                          >
                            <Truck className="w-3.5 h-3.5" />
                            <span>Bấm Đã Giao Hàng</span>
                          </button>
                        )}
                        {(ord.status === 'delivered' || ord.status === 'Đã giao hàng') && (
                          <span className="px-2.5 py-1 bg-amber-50 text-amber-800 border border-amber-200 rounded-full text-[11px] font-semibold inline-flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            Đã giao • Chờ khách xác nhận nhận hàng
                          </span>
                        )}
                        {isOrderCompleted(ord) && (
                          <span className="px-2.5 py-1 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-full text-[11px] font-semibold inline-flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                            Đã nhận hàng (Đã ghi nhận doanh thu)
                            {ord.received_at && ` • ${new Date(ord.received_at).toLocaleDateString('vi-VN')}`}
                          </span>
                        )}

                        <select
                          value={isOrderCompleted(ord) ? 'completed' : ord.status}
                          onChange={(e) => handleUpdateOrderStatus(ord.id, e.target.value)}
                          className="px-3 py-1.5 text-xs font-semibold rounded-lg border border-slate-300 bg-slate-50 text-slate-800 focus:outline-none focus:ring-1 focus:ring-rose-400"
                        >
                          <option value="pending">Chờ xác nhận</option>
                          <option value="confirmed">Đã xác nhận</option>
                          <option value="shipping">Đang giao hàng</option>
                          <option value="delivered">Đã giao (Chờ khách xác nhận)</option>
                          <option value="completed">Đã nhận hàng (Hoàn tất)</option>
                          <option value="cancelled">Đã hủy</option>
                        </select>
                      </div>

                      <div className="text-right">
                        <span className="text-[10px] uppercase tracking-wider text-slate-400">Tổng thanh toán</span>
                        <p className="text-base font-bold text-rose-600 font-mono">
                          {formatCurrency(Number(ord.total_amount) || 0)}
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-slate-700 bg-slate-50/70 p-4 rounded-xl">
                      <div className="space-y-1">
                        <p className="font-semibold text-slate-900">Người nhận: {customer.fullName}</p>
                        <p>SĐT: <strong>{customer.phone}</strong></p>
                        <p>Email: <strong className="text-slate-900">{customer.email || 'Chưa cung cấp'}</strong></p>
                      </div>
                      <div className="space-y-1">
                        <p>Địa chỉ: {customer.address}, {customer.district}, {customer.province}</p>
                        <p>Thanh toán: <span className="uppercase font-semibold">{ord.payment_method}</span></p>
                        {customer.note && <p className="italic text-slate-500">Ghi chú: &quot;{customer.note}&quot;</p>}
                      </div>
                    </div>

                    <div>
                      <h4 className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-2">
                        Lens đã đặt ({items.length} phân loại):
                      </h4>
                      <div className="divide-y divide-slate-100 border border-slate-100 rounded-xl overflow-hidden">
                        {items.map((it: any, idx: number) => (
                          <div key={idx} className="p-3 flex items-center justify-between text-xs bg-white">
                            <div>
                              <span className="font-semibold text-slate-900">
                                {it.product?.product_name || 'Kính áp tròng'}
                              </span>
                              <span className="text-slate-500 ml-2">
                                Độ cận: <strong>{it.prescriptionPower || '0.00'}</strong>
                              </span>
                            </div>
                            <div className="text-right font-mono">
                              <span>{it.quantity} chiếc × {formatCurrency(it.unitPrice)}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}


      {/* TAB 3: VARIANTS & STOCK PER DEGREE */}
      {activeTab === 'variants' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-base font-semibold text-slate-900 font-serif">
                Quản Lý Tồn Kho Theo Từng Mức Độ Cận
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Xem và chỉnh sửa số lượng chiếc lens có sẵn trong kho cho từng bên mắt (-0.50 đến -8.00).
              </p>
            </div>

            <div className="flex items-center gap-3">
              <label className="text-xs font-semibold text-slate-700 whitespace-nowrap">Chọn mẫu lens:</label>
              <select
                value={selectedProductForVariants}
                onChange={(e) => setSelectedProductForVariants(e.target.value)}
                className="px-3 py-2 text-xs font-medium bg-white border border-slate-300 rounded-xl focus:outline-none focus:ring-1 focus:ring-rose-400"
              >
                {products
                  .filter((p) => p.product_type === 'contact_lens')
                  .map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.product_name} ({p.sku})
                    </option>
                  ))}
              </select>
            </div>
          </div>

          {loadingVariants ? (
            <div className="py-16 text-center">
              <div className="w-8 h-8 border-2 border-[#D96B8A] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
              <p className="text-xs text-slate-500">Đang tải phân loại độ cận...</p>
            </div>
          ) : variantsList.length === 0 ? (
            <div className="bg-white border border-rose-100 rounded-2xl p-12 text-center text-xs text-slate-500">
              Chưa có phân loại độ cận nào được tạo cho mẫu lens này.
            </div>
          ) : (
            <div className="bg-white border border-rose-100 rounded-2xl overflow-hidden shadow-xs">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold uppercase text-[10px] tracking-wider">
                  <tr>
                    <th className="p-3.5">Mã SKU Phân Loại</th>
                    <th className="p-3.5">Độ Cận (Diopter)</th>
                    <th className="p-3.5">Tồn Kho Hiện Tại</th>
                    <th className="p-3.5 text-right">Hành động</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {variantsList.map((v) => (
                    <tr key={v.id} className="hover:bg-slate-50/60 transition-colors">
                      <td className="p-3.5 font-mono text-slate-600">{v.sku}</td>
                      <td className="p-3.5">
                        <span className="font-bold text-slate-900 px-2 py-0.5 bg-slate-100 rounded">
                          {v.prescription_power}
                        </span>
                      </td>
                      <td className="p-3.5">
                        <input
                          type="number"
                          defaultValue={v.stock_quantity ?? 50}
                          id={`stock-${v.id}`}
                          min={0}
                          className="w-24 px-2.5 py-1 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-rose-400"
                        />
                        <span className="text-[11px] text-slate-400 ml-2">chiếc lens</span>
                      </td>
                      <td className="p-3.5 text-right">
                        <button
                          type="button"
                          onClick={() => {
                            const input = document.getElementById(`stock-${v.id}`) as HTMLInputElement;
                            if (input) {
                              handleUpdateVariantStock(v.id, Number(input.value));
                            }
                          }}
                          className="px-3 py-1 bg-[#D96B8A] hover:bg-[#C24A6D] text-white text-[11px] font-semibold rounded-md transition-colors cursor-pointer"
                        >
                          Cập nhật
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}


      {/* TAB: A+ CONTENT EDITORIAL SHOWCASE */}
      {activeTab === 'aplus' && (
        <div className="space-y-6">
          <div className="bg-white border border-rose-100 rounded-3xl p-6 sm:p-8 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-1">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-50 text-amber-800 rounded-full text-xs font-semibold border border-amber-200">
                <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                <span>Trình Biên Tập A+ Premium Content</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-serif font-normal text-slate-900">
                Tùy Biến Bộ Ảnh Mô Tả A+ (2 - 7 Ảnh + Bảng Màu)
              </h2>
              <p className="text-xs text-slate-500 max-w-2xl leading-relaxed">
                Quản lý chuỗi ảnh mô tả chi tiết cho từng sản phẩm (từ 2 đến 7+ ảnh). Ảnh cuối cùng nên là bảng full màu bộ sưu tập. Dữ liệu được đồng bộ trực tiếp lên Supabase.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-2">
                <label className="text-xs font-semibold text-slate-700 whitespace-nowrap">Chọn Lens:</label>
                <select
                  value={selectedProductForAplus}
                  onChange={(e) => setSelectedProductForAplus(e.target.value)}
                  className="px-3 py-2 text-xs font-medium bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:ring-1 focus:ring-rose-400"
                >
                  {products
                    .filter((p) => p.product_type === 'contact_lens')
                    .map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.product_name} ({p.sku})
                      </option>
                    ))}
                </select>
              </div>

              {selectedProductForAplus && (
                <Link
                  to={`/products/${products.find((p) => p.id === selectedProductForAplus)?.slug || ''}`}
                  target="_blank"
                  className="px-3.5 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors inline-flex items-center gap-1.5"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>Xem Trên Web</span>
                  <ExternalLink className="w-3 h-3 text-slate-400" />
                </Link>
              )}

              <button
                type="button"
                onClick={() =>
                  setAplusSlots((prev) => [
                    ...prev,
                    {
                      image: '',
                      title: `Ảnh mô tả #${prev.length + 1}`,
                      subtitle: `Gallery Slide 0${prev.length + 1}`,
                      description: '',
                    },
                  ])
                }
                className="px-4 py-2 bg-rose-50 hover:bg-rose-100 text-[#832B47] border border-rose-200 text-xs font-semibold rounded-xl transition-colors inline-flex items-center gap-1.5 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Thêm ảnh mô tả</span>
              </button>

              <button
                type="button"
                onClick={handleSaveAplus}
                disabled={savingAplus}
                className="px-5 py-2 bg-[#D96B8A] hover:bg-[#C24A6D] text-white text-xs font-semibold rounded-xl transition-colors shadow-sm inline-flex items-center gap-2 cursor-pointer disabled:opacity-50"
              >
                <Save className="w-3.5 h-3.5" />
                <span>{savingAplus ? 'Đang lưu...' : 'Lưu A+ Content'}</span>
              </button>
            </div>
          </div>

          {/* Dynamic A+ Slots Cards (2-7+ images) */}
          <div className="grid grid-cols-1 gap-6">
            {aplusSlots.map((slot, index) => (
              <div
                key={index}
                className="bg-white border border-rose-100 rounded-3xl p-6 sm:p-8 shadow-xs hover:border-slate-300 transition-colors space-y-6"
              >
                <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                  <div className="flex items-center gap-3">
                    <span className="w-7 h-7 rounded-full bg-[#D96B8A] text-white font-mono text-xs font-bold flex items-center justify-center">
                      {String(index + 1).padStart(2, '0')}
                    </span>
                    <div>
                      <h3 className="text-sm font-semibold text-slate-900">
                        {index === aplusSlots.length - 1
                          ? `Khối ${String(index + 1).padStart(2, '0')} (Cuối cùng — nên đặt ảnh full màu bộ sưu tập)`
                          : `Khối ${String(index + 1).padStart(2, '0')}: Ảnh mô tả chi tiết sản phẩm`}
                      </h3>
                      <p className="text-[11px] text-slate-400">
                        Xuất hiện theo thứ tự từ trên xuống dưới trong phần Khám phá sản phẩm
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5">
                    {index > 0 && (
                      <button
                        type="button"
                        onClick={() => {
                          const updated = [...aplusSlots];
                          [updated[index - 1], updated[index]] = [updated[index], updated[index - 1]];
                          setAplusSlots(updated);
                        }}
                        className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 cursor-pointer"
                        title="Di chuyển lên"
                      >
                        <MoveUp className="w-3.5 h-3.5" />
                      </button>
                    )}
                    {index < aplusSlots.length - 1 && (
                      <button
                        type="button"
                        onClick={() => {
                          const updated = [...aplusSlots];
                          [updated[index], updated[index + 1]] = [updated[index + 1], updated[index]];
                          setAplusSlots(updated);
                        }}
                        className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 cursor-pointer"
                        title="Di chuyển xuống"
                      >
                        <MoveDown className="w-3.5 h-3.5" />
                      </button>
                    )}
                    {aplusSlots.length > 1 && (
                      <button
                        type="button"
                        onClick={() => setAplusSlots((prev) => prev.filter((_, i) => i !== index))}
                        className="p-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-600 cursor-pointer"
                        title="Xóa ảnh này"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                  {/* Left Column: Image Preview & URL */}
                  <div className="lg:col-span-5 space-y-3">
                    <label className="block text-xs font-semibold text-slate-700">
                      Hình ảnh mô tả A+ (Hiển thị nguyên tỉ lệ)
                    </label>
                    <div className="relative min-h-48 max-h-80 rounded-2xl bg-slate-50 border border-slate-200 overflow-hidden flex items-center justify-center p-2">
                      {slot.image ? (
                        <img
                          src={slot.image}
                          alt={slot.title}
                          className="max-w-full max-h-72 object-contain"
                        />
                      ) : (
                        <div className="text-center p-4">
                          <ImageIcon className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                          <span className="text-xs text-slate-400 block font-medium">Chưa có ảnh</span>
                        </div>
                      )}
                    </div>

                    <div>
                      <input
                        type="text"
                        value={slot.image}
                        onChange={(e) => {
                          const updated = [...aplusSlots];
                          updated[index] = { ...updated[index], image: e.target.value };
                          setAplusSlots(updated);
                        }}
                        placeholder="/src/assets/images/... hoặc URL ảnh thực tế"
                        className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-rose-400"
                      />
                      <span className="text-[10px] text-slate-400 mt-1 block">
                        Nhập đường dẫn ảnh từ thư mục assets hoặc URL công khai trên mạng
                      </span>
                    </div>
                  </div>

                  {/* Right Column: Text & Editorial Content */}
                  <div className="lg:col-span-7 space-y-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Tiêu đề phụ / Phân nhánh (Subtitle / Kicker)
                      </label>
                      <input
                        type="text"
                        value={slot.subtitle}
                        onChange={(e) => {
                          const updated = [...aplusSlots];
                          updated[index] = { ...updated[index], subtitle: e.target.value };
                          setAplusSlots(updated);
                        }}
                        className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-rose-400"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Tiêu đề chính của khối A+ (Title)
                      </label>
                      <input
                        type="text"
                        value={slot.title}
                        onChange={(e) => {
                          const updated = [...aplusSlots];
                          updated[index] = { ...updated[index], title: e.target.value };
                          setAplusSlots(updated);
                        }}
                        className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-rose-400 font-medium"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Mô tả chi tiết / Lời bình nghệ thuật (Description)
                      </label>
                      <textarea
                        rows={3}
                        value={slot.description}
                        onChange={(e) => {
                          const updated = [...aplusSlots];
                          updated[index] = { ...updated[index], description: e.target.value };
                          setAplusSlots(updated);
                        }}
                        className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-rose-400 leading-relaxed"
                      />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}


      {/* TAB: SITE CUSTOMIZER (HERO SLIDES & ANNOUNCEMENT BAR) */}
      {activeTab === 'site_customizer' && (
        <div className="space-y-8">
          <div className="bg-white border border-rose-100 rounded-3xl p-6 sm:p-8 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-1">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-sky-50 text-sky-800 rounded-full text-xs font-semibold border border-sky-200">
                <LayoutTemplate className="w-3.5 h-3.5 text-sky-600" />
                <span>Trình Quản Lý Giao Diện & Banner Website</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-serif font-normal text-slate-900">
                Tùy Biến Banner Trang Chủ & Thanh Thông Báo
              </h2>
              <p className="text-xs text-slate-500 max-w-2xl leading-relaxed">
                Tự do thay đổi banner quảng cáo Hero Carousel ở đầu trang chủ, thêm hoặc xóa slide, chỉnh sửa tiêu đề và thanh thông báo ưu đãi trên cùng của website.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={handleSaveSiteSettings}
                className="px-5 py-2.5 bg-[#D96B8A] hover:bg-[#C24A6D] text-white text-xs font-semibold rounded-xl transition-colors shadow-sm inline-flex items-center gap-2 cursor-pointer"
              >
                <Save className="w-3.5 h-3.5" />
                <span>Lưu Giao Diện Ngay</span>
              </button>
            </div>
          </div>

          {/* Section 1: Top Announcement Bar */}
          <div className="bg-white border border-rose-100 rounded-3xl p-6 sm:p-8 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-semibold text-slate-900">1. Thanh Thông Báo Trên Cùng (Top Announcement Bar)</h3>
                <p className="text-xs text-slate-500">Dòng chữ xuất hiện trên thanh Navbar x mọi trang</p>
              </div>

              <label className="flex items-center gap-2 text-xs font-semibold text-slate-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={siteSettings.announcementEnabled}
                  onChange={(e) => setSiteSettings({ ...siteSettings, announcementEnabled: e.target.checked })}
                  className="rounded text-slate-900 focus:ring-0"
                />
                <span>Hiển thị thanh thông báo</span>
              </label>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Nội dung thông báo:</label>
              <input
                type="text"
                value={siteSettings.announcementText}
                onChange={(e) => setSiteSettings({ ...siteSettings, announcementText: e.target.value })}
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-rose-400 font-medium"
              />
            </div>

            {/* Live Preview of Announcement Bar */}
            <div className="pt-2">
              <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 block mb-1">
                Xem trước thanh thông báo:
              </span>
              <div className="bg-[#D96B8A] text-white text-xs py-2 px-4 rounded-xl text-center flex items-center justify-center gap-2 shadow-xs">
                <Sparkles className="w-3.5 h-3.5 text-amber-300 shrink-0" />
                <span>{siteSettings.announcementText || 'Nội dung thông báo trống'}</span>
              </div>
            </div>
          </div>

          {/* Section 2: Hero Carousel Slides */}
          <div className="bg-white border border-rose-100 rounded-3xl p-6 sm:p-8 shadow-xs space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
              <div>
                <h3 className="text-sm font-semibold text-slate-900">
                  2. Danh Sách Banner Hero Carousel Trang Chủ ({siteSettings.heroSlides.length} slide)
                </h3>
                <p className="text-xs text-slate-500">
                  Kéo thả hoặc dùng nút Mũi tên để đổi thứ tự xuất hiện các slide banner trên trang chủ
                </p>
              </div>

              <button
                type="button"
                onClick={() => {
                  const newSlide: HeroSlide = {
                    id: `slide-${Date.now()}`,
                    title: 'Bộ Sưu Tập Mới Dyadia',
                    kicker: 'New Signature Collection',
                    description: 'Trải nghiệm dòng lens chuẩn K-Beauty với chất liệu cao cấp và màu sắc quyến rũ.',
                    image: '/src/assets/images/dyadia_hero_natural_brown_1793544640456.jpg',
                    ctaText: 'Khám phá ngay',
                    ctaLink: '/products',
                  };
                  setSiteSettings({
                    ...siteSettings,
                    heroSlides: [...siteSettings.heroSlides, newSlide],
                  });
                }}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold rounded-xl transition-colors inline-flex items-center gap-1.5 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Thêm Slide Banner Mới</span>
              </button>
            </div>

            <div className="space-y-6">
              {siteSettings.heroSlides.map((slide, index) => (
                <div
                  key={slide.id}
                  draggable
                  onDragStart={(e) => {
                    setDraggedSlideIndex(index);
                    e.dataTransfer.effectAllowed = 'move';
                  }}
                  onDragOver={(e) => {
                    e.preventDefault();
                    if (draggedSlideIndex === null || draggedSlideIndex === index) return;
                    const updated = [...siteSettings.heroSlides];
                    const item = updated[draggedSlideIndex];
                    updated.splice(draggedSlideIndex, 1);
                    updated.splice(index, 0, item);
                    setDraggedSlideIndex(index);
                    setSiteSettings({ ...siteSettings, heroSlides: updated });
                  }}
                  onDragEnd={() => setDraggedSlideIndex(null)}
                  className="bg-slate-50/70 border border-slate-200 rounded-2xl p-5 hover:border-slate-300 transition-colors space-y-4"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <GripVertical className="w-4 h-4 text-slate-400 cursor-grab" />
                      <span className="font-semibold text-xs text-slate-800">
                        Slide {index + 1}: {slide.title || 'Chưa đặt tiêu đề'}
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        disabled={index === 0}
                        onClick={() => {
                          const updated = [...siteSettings.heroSlides];
                          const temp = updated[index - 1];
                          updated[index - 1] = updated[index];
                          updated[index] = temp;
                          setSiteSettings({ ...siteSettings, heroSlides: updated });
                        }}
                        className="p-1.5 text-slate-500 hover:text-slate-800 hover:bg-slate-200 rounded-lg disabled:opacity-30 cursor-pointer"
                        title="Di chuyển lên"
                      >
                        <MoveUp className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        disabled={index === siteSettings.heroSlides.length - 1}
                        onClick={() => {
                          const updated = [...siteSettings.heroSlides];
                          const temp = updated[index + 1];
                          updated[index + 1] = updated[index];
                          updated[index] = temp;
                          setSiteSettings({ ...siteSettings, heroSlides: updated });
                        }}
                        className="p-1.5 text-slate-500 hover:text-slate-800 hover:bg-slate-200 rounded-lg disabled:opacity-30 cursor-pointer"
                        title="Di chuyển xuống"
                      >
                        <MoveDown className="w-3.5 h-3.5" />
                      </button>
                      {siteSettings.heroSlides.length > 1 && (
                        <button
                          type="button"
                          onClick={() => {
                            const updated = siteSettings.heroSlides.filter((_, i) => i !== index);
                            setSiteSettings({ ...siteSettings, heroSlides: updated });
                          }}
                          className="p-1.5 text-rose-500 hover:text-rose-700 hover:bg-rose-100 rounded-lg cursor-pointer"
                          title="Xóa slide này"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">Kicker / Huy hiệu nhỏ:</label>
                      <input
                        type="text"
                        value={slide.kicker}
                        onChange={(e) => {
                          const updated = [...siteSettings.heroSlides];
                          updated[index] = { ...updated[index], kicker: e.target.value };
                          setSiteSettings({ ...siteSettings, heroSlides: updated });
                        }}
                        className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl"
                      />
                    </div>

                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">Tiêu đề chính lớn:</label>
                      <input
                        type="text"
                        value={slide.title}
                        onChange={(e) => {
                          const updated = [...siteSettings.heroSlides];
                          updated[index] = { ...updated[index], title: e.target.value };
                          setSiteSettings({ ...siteSettings, heroSlides: updated });
                        }}
                        className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl font-medium"
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="block font-semibold text-slate-700 mb-1">Mô tả ngắn bên dưới tiêu đề:</label>
                      <textarea
                        rows={2}
                        value={slide.description}
                        onChange={(e) => {
                          const updated = [...siteSettings.heroSlides];
                          updated[index] = { ...updated[index], description: e.target.value };
                          setSiteSettings({ ...siteSettings, heroSlides: updated });
                        }}
                        className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl"
                      />
                    </div>

                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">Đường dẫn ảnh nền banner:</label>
                      <input
                        type="text"
                        value={slide.image}
                        onChange={(e) => {
                          const updated = [...siteSettings.heroSlides];
                          updated[index] = { ...updated[index], image: e.target.value };
                          setSiteSettings({ ...siteSettings, heroSlides: updated });
                        }}
                        className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block font-semibold text-slate-700 mb-1">Chữ nút bấm (CTA):</label>
                        <input
                          type="text"
                          value={slide.ctaText}
                          onChange={(e) => {
                            const updated = [...siteSettings.heroSlides];
                            updated[index] = { ...updated[index], ctaText: e.target.value };
                            setSiteSettings({ ...siteSettings, heroSlides: updated });
                          }}
                          className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl"
                        />
                      </div>
                      <div>
                        <label className="block font-semibold text-slate-700 mb-1">Liên kết nút bấm:</label>
                        <input
                          type="text"
                          value={slide.ctaLink}
                          onChange={(e) => {
                            const updated = [...siteSettings.heroSlides];
                            updated[index] = { ...updated[index], ctaLink: e.target.value };
                            setSiteSettings({ ...siteSettings, heroSlides: updated });
                          }}
                          className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}


      {/* TAB: BLOG & EDITORIAL MANAGEMENT (DRAG-AND-DROP) */}
      {activeTab === 'blog' && (
        <div className="space-y-6">
          <div className="bg-white border border-rose-100 rounded-3xl p-6 sm:p-8 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-1">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-800 rounded-full text-xs font-semibold border border-emerald-200">
                <BookOpen className="w-3.5 h-3.5 text-emerald-600" />
                <span>Trình Quản Lý & Viết Bài Blog Kéo Thả (Block Editor)</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-serif font-normal text-slate-900">
                Quản Lý Bài Viết Cẩm Nang Nhãn Khoa & Xu Hướng K-Beauty
              </h2>
              <p className="text-xs text-slate-500 max-w-2xl leading-relaxed">
                Biên tập bài viết chuyên sâu với công nghệ khối nội dung (Block Editor). Dễ dàng kéo thả đổi thứ tự tiêu đề, đoạn văn, lời khuyên khúc xạ và thẻ nhúng lens trực tiếp vào bài viết.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <Link
                to="/blog"
                target="_blank"
                className="px-4 py-2.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors inline-flex items-center gap-1.5"
              >
                <Eye className="w-3.5 h-3.5" />
                <span>Xem Trang Blog</span>
                <ExternalLink className="w-3 h-3 text-slate-400" />
              </Link>

              <button
                type="button"
                onClick={() => {
                  const newPost: BlogPost = {
                    id: `post-${Date.now()}`,
                    slug: `bai-viet-moi-${Math.floor(100 + Math.random() * 900)}`,
                    title: 'Tiêu đề bài viết mới về kính áp tròng',
                    excerpt: 'Mô tả ngắn gọn nội dung bài viết hiển thị ở trang danh sách...',
                    cover_image: '/src/assets/images/dyadia_hero_natural_brown_1793544640456.jpg',
                    category: 'Bí quyết chọn lens',
                    author: {
                      name: profile?.full_name || 'Biên Tập Viên Dyadia',
                      role: 'Chuyên viên Khúc xạ & Thẩm mỹ',
                    },
                    read_time_minutes: 5,
                    created_at: new Date().toISOString(),
                    published: true,
                    blocks: [
                      {
                        id: `b-${Date.now()}-1`,
                        type: 'heading',
                        content: '1. Khám phá phong cách kính áp tròng mới',
                      },
                      {
                        id: `b-${Date.now()}-2`,
                        type: 'paragraph',
                        content: 'Kính áp tròng không chỉ giúp cải thiện tầm nhìn mà còn là một phụ kiện thời trang tinh tế giúp định hình phong cách...',
                      },
                      {
                        id: `b-${Date.now()}-3`,
                        type: 'tip',
                        content: 'Luôn nhỏ mắt nhân tạo chuyên dụng trước khi đeo và sau mỗi 2-3 tiếng để duy trì độ ẩm tự nhiên cho mắt.',
                      },
                    ],
                  };
                  setEditingBlogPost(newPost);
                }}
                className="px-5 py-2.5 bg-[#D96B8A] hover:bg-[#C24A6D] text-white text-xs font-semibold rounded-xl transition-colors shadow-sm inline-flex items-center gap-2 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Viết Bài Mới (Block Editor)</span>
              </button>
            </div>
          </div>

          {/* Blog Posts List */}
          <div className="bg-white border border-rose-100 rounded-3xl p-6 sm:p-8 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <span className="text-xs font-semibold text-slate-900">
                Tất cả bài viết đang có ({blogPosts.length} bài) · Kéo thả để sắp xếp thứ tự hiển thị:
              </span>
            </div>

            <div className="space-y-4">
              {blogPosts.map((post, index) => (
                <div
                  key={post.id}
                  draggable
                  onDragStart={(e) => {
                    setDraggedBlogIndex(index);
                    e.dataTransfer.effectAllowed = 'move';
                  }}
                  onDragOver={(e) => {
                    e.preventDefault();
                    if (draggedBlogIndex === null || draggedBlogIndex === index) return;
                    const updated = [...blogPosts];
                    const item = updated[draggedBlogIndex];
                    updated.splice(draggedBlogIndex, 1);
                    updated.splice(index, 0, item);
                    setDraggedBlogIndex(index);
                    setBlogPosts(updated);
                  }}
                  onDragEnd={() => {
                    setDraggedBlogIndex(null);
                    handleSaveBlogOrder(blogPosts);
                  }}
                  className="p-4 bg-slate-50/70 border border-slate-200 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-slate-300 transition-colors"
                >
                  <div className="flex items-center gap-4 min-w-0">
                    <GripVertical className="w-4 h-4 text-slate-400 cursor-grab shrink-0" />
                    <div className="w-16 h-12 rounded-xl bg-slate-200 overflow-hidden shrink-0 border border-slate-200">
                      <img
                        src={post.cover_image}
                        alt={post.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 bg-rose-50 text-rose-800 text-[10px] font-semibold rounded-md border border-rose-200">
                          {post.category}
                        </span>
                        <span className="text-[11px] text-slate-400">
                          {post.read_time_minutes} phút đọc · {new Date(post.created_at).toLocaleDateString('vi-VN')}
                        </span>
                      </div>
                      <h4 className="text-sm font-semibold text-slate-900 truncate mt-0.5">
                        {post.title}
                      </h4>
                      <p className="text-xs text-slate-500 truncate max-w-xl">
                        {post.excerpt}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                    <button
                      type="button"
                      disabled={index === 0}
                      onClick={() => {
                        const updated = [...blogPosts];
                        const temp = updated[index - 1];
                        updated[index - 1] = updated[index];
                        updated[index] = temp;
                        handleSaveBlogOrder(updated);
                      }}
                      className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-200 rounded-lg disabled:opacity-30 cursor-pointer"
                      title="Chuyển lên đầu"
                    >
                      <MoveUp className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      disabled={index === blogPosts.length - 1}
                      onClick={() => {
                        const updated = [...blogPosts];
                        const temp = updated[index + 1];
                        updated[index + 1] = updated[index];
                        updated[index] = temp;
                        handleSaveBlogOrder(updated);
                      }}
                      className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-200 rounded-lg disabled:opacity-30 cursor-pointer"
                      title="Chuyển xuống"
                    >
                      <MoveDown className="w-4 h-4" />
                    </button>

                    <Link
                      to={`/blog/${post.slug}`}
                      target="_blank"
                      className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-200 rounded-lg transition-colors"
                      title="Xem bài viết"
                    >
                      <Eye className="w-4 h-4" />
                    </Link>

                    <button
                      type="button"
                      onClick={() => setEditingBlogPost(post)}
                      className="px-3 py-1.5 bg-[#D96B8A] text-white text-xs font-semibold rounded-xl hover:bg-[#C24A6D] transition-colors inline-flex items-center gap-1.5 cursor-pointer"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                      <span>Sửa Khối Nổi Dung</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleDeleteBlogPost(post.id)}
                      className="p-2 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                      title="Xóa bài viết"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}


      {/* DRAG-AND-DROP BLOG POST EDITOR MODAL */}
      {editingBlogPost && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-4xl w-full max-h-[92vh] overflow-y-auto shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-150">
            {/* Modal Header */}
            <div className="sticky top-0 bg-white/95 backdrop-blur-md px-6 py-4 border-b border-slate-100 flex items-center justify-between z-20">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center">
                  <FileText className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-serif font-semibold text-slate-900">
                    Trình Biên Tập Bài Viết Blog Bằng Kéo Thả Khối
                  </h3>
                  <span className="text-[11px] text-slate-500">
                    {editingBlogPost.title || 'Bài viết chưa đặt tên'}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setEditingBlogPost(null)}
                  className="p-2 text-slate-400 hover:text-slate-800 hover:bg-slate-100 rounded-full transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Modal Form */}
            <div className="p-6 sm:p-8 space-y-8">
              {/* General Metadata */}
              <div className="bg-slate-50/70 p-6 rounded-2xl border border-slate-200 space-y-4">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                  Thông Tin Cơ Bản Bài Viết
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  <div className="md:col-span-2">
                    <label className="block font-semibold text-slate-700 mb-1">Tiêu đề bài viết:</label>
                    <input
                      type="text"
                      value={editingBlogPost.title}
                      onChange={(e) => setEditingBlogPost({ ...editingBlogPost, title: e.target.value })}
                      className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl font-medium"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Đường dẫn tĩnh (Slug):</label>
                    <input
                      type="text"
                      value={editingBlogPost.slug}
                      onChange={(e) => setEditingBlogPost({ ...editingBlogPost, slug: e.target.value })}
                      className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl font-mono text-slate-700"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Chuyên mục:</label>
                    <select
                      value={editingBlogPost.category}
                      onChange={(e) =>
                        setEditingBlogPost({ ...editingBlogPost, category: e.target.value as BlogCategory })
                      }
                      className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl"
                    >
                      <option value="Xu hướng K-Beauty">Xu hướng K-Beauty</option>
                      <option value="Cẩm nang nhãn khoa">Cẩm nang nhãn khoa</option>
                      <option value="Bí quyết chọn lens">Bí quyết chọn lens</option>
                      <option value="Phong cách & Make-up">Phong cách & Make-up</option>
                    </select>
                  </div>

                  <div className="md:col-span-2">
                    <label className="block font-semibold text-slate-700 mb-1">Tóm tắt ngắn (Excerpt):</label>
                    <textarea
                      rows={2}
                      value={editingBlogPost.excerpt}
                      onChange={(e) => setEditingBlogPost({ ...editingBlogPost, excerpt: e.target.value })}
                      className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Đường dẫn ảnh bìa (Cover Image):</label>
                    <input
                      type="text"
                      value={editingBlogPost.cover_image}
                      onChange={(e) => setEditingBlogPost({ ...editingBlogPost, cover_image: e.target.value })}
                      className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">Tác giả:</label>
                      <input
                        type="text"
                        value={editingBlogPost.author.name}
                        onChange={(e) =>
                          setEditingBlogPost({
                            ...editingBlogPost,
                            author: { ...editingBlogPost.author, name: e.target.value },
                          })
                        }
                        className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">Thời gian đọc (phút):</label>
                      <input
                        type="number"
                        min={1}
                        value={editingBlogPost.read_time_minutes}
                        onChange={(e) =>
                          setEditingBlogPost({
                            ...editingBlogPost,
                            read_time_minutes: Number(e.target.value) || 3,
                          })
                        }
                        className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* BLOCK BUILDER WITH DRAG-AND-DROP */}
              <div className="space-y-4">
                <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                  <div>
                    <h4 className="text-sm font-semibold text-slate-900">
                      Nổi Dung Bài Viết Theo Khối ({editingBlogPost.blocks.length} khối)
                    </h4>
                    <p className="text-[11px] text-slate-400">
                      Kéo thả biểu tượng 6 chấm hoặc dùng nút mũi tên để đổi thứ tự các khối
                    </p>
                  </div>

                  {/* Add Block Quick Bar */}
                  <div className="flex flex-wrap items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => {
                        const newBlock: BlogBlock = {
                          id: `b-${Date.now()}`,
                          type: 'heading',
                          content: 'Tiêu đề mục mới',
                        };
                        setEditingBlogPost({
                          ...editingBlogPost,
                          blocks: [...editingBlogPost.blocks, newBlock],
                        });
                      }}
                      className="px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-[11px] font-semibold rounded-lg transition-colors inline-flex items-center gap-1 cursor-pointer"
                    >
                      <Type className="w-3 h-3" />
                      <span>+ Tiêu đề</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        const newBlock: BlogBlock = {
                          id: `b-${Date.now()}`,
                          type: 'paragraph',
                          content: 'Nhập nội dung đoạn văn chi tiết tại đây...',
                        };
                        setEditingBlogPost({
                          ...editingBlogPost,
                          blocks: [...editingBlogPost.blocks, newBlock],
                        });
                      }}
                      className="px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-[11px] font-semibold rounded-lg transition-colors inline-flex items-center gap-1 cursor-pointer"
                    >
                      <FileText className="w-3 h-3" />
                      <span>+ Đoạn văn</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        const newBlock: BlogBlock = {
                          id: `b-${Date.now()}`,
                          type: 'tip',
                          content: 'Lời khuyên chuyên môn: Lưu ý vệ sinh và độ ẩm của mắt...',
                        };
                        setEditingBlogPost({
                          ...editingBlogPost,
                          blocks: [...editingBlogPost.blocks, newBlock],
                        });
                      }}
                      className="px-2.5 py-1.5 bg-amber-50 hover:bg-amber-100 text-amber-800 text-[11px] font-semibold rounded-lg transition-colors inline-flex items-center gap-1 cursor-pointer"
                    >
                      <Lightbulb className="w-3 h-3 text-amber-600" />
                      <span>+ Lời khuyên (Tip)</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        const newBlock: BlogBlock = {
                          id: `b-${Date.now()}`,
                          type: 'quote',
                          content: 'Đôi mắt là tác phẩm nghệ thuật đẹp nhất của bạn.',
                          extra: { author: 'Dyadia Creative Director' },
                        };
                        setEditingBlogPost({
                          ...editingBlogPost,
                          blocks: [...editingBlogPost.blocks, newBlock],
                        });
                      }}
                      className="px-2.5 py-1.5 bg-purple-50 hover:bg-purple-100 text-purple-800 text-[11px] font-semibold rounded-lg transition-colors inline-flex items-center gap-1 cursor-pointer"
                    >
                      <Quote className="w-3 h-3 text-purple-600" />
                      <span>+ Trích dẫn</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        const newBlock: BlogBlock = {
                          id: `b-${Date.now()}`,
                          type: 'image',
                          content: '/src/assets/images/dyadia_hero_natural_brown_1793544640456.jpg',
                          extra: { caption: 'Hình ảnh minh họa sản phẩm kính áp tròng cao cấp' },
                        };
                        setEditingBlogPost({
                          ...editingBlogPost,
                          blocks: [...editingBlogPost.blocks, newBlock],
                        });
                      }}
                      className="px-2.5 py-1.5 bg-sky-50 hover:bg-sky-100 text-sky-800 text-[11px] font-semibold rounded-lg transition-colors inline-flex items-center gap-1 cursor-pointer"
                    >
                      <ImageIcon className="w-3 h-3 text-sky-600" />
                      <span>+ Hình ảnh</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        const sampleLens = products.find((p) => p.product_type === 'contact_lens') || products[0];
                        const newBlock: BlogBlock = {
                          id: `b-${Date.now()}`,
                          type: 'product_card',
                          content: 'Gợi ý dòng lens tự nhiên phù hợp cho bài viết này:',
                          extra: {
                            productId: sampleLens?.id,
                            productName: sampleLens?.product_name || 'Cat-titude Kristin - Tabby Brown',
                            productPrice: sampleLens?.price || 85000,
                            productImage: sampleLens?.image_url || '/src/assets/images/dyadia_hero_natural_brown_1793544640456.jpg',
                          },
                        };
                        setEditingBlogPost({
                          ...editingBlogPost,
                          blocks: [...editingBlogPost.blocks, newBlock],
                        });
                      }}
                      className="px-2.5 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-800 text-[11px] font-semibold rounded-lg transition-colors inline-flex items-center gap-1 cursor-pointer"
                    >
                      <Package className="w-3 h-3 text-rose-600" />
                      <span>+ Thẻ Lens</span>
                    </button>
                  </div>
                </div>

                {/* Blocks Drag and Drop Area */}
                <div className="space-y-4">
                  {editingBlogPost.blocks.map((block, bIdx) => (
                    <div
                      key={block.id}
                      draggable
                      onDragStart={(e) => {
                        setDraggedBlockIndex(bIdx);
                        e.dataTransfer.effectAllowed = 'move';
                      }}
                      onDragOver={(e) => {
                        e.preventDefault();
                        if (draggedBlockIndex === null || draggedBlockIndex === bIdx) return;
                        const updated = [...editingBlogPost.blocks];
                        const item = updated[draggedBlockIndex];
                        updated.splice(draggedBlockIndex, 1);
                        updated.splice(bIdx, 0, item);
                        setDraggedBlockIndex(bIdx);
                        setEditingBlogPost({ ...editingBlogPost, blocks: updated });
                      }}
                      onDragEnd={() => setDraggedBlockIndex(null)}
                      className="p-4 bg-white border border-slate-200 rounded-2xl shadow-xs space-y-3 hover:border-slate-300 transition-colors"
                    >
                      {/* Block Header */}
                      <div className="flex items-center justify-between text-xs pb-2 border-b border-slate-100">
                        <div className="flex items-center gap-2">
                          <GripVertical className="w-4 h-4 text-slate-400 cursor-grab" />
                          <span className="font-semibold text-slate-500 font-mono text-[10px]">
                            #{bIdx + 1}
                          </span>
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                              block.type === 'heading'
                                ? 'bg-slate-100 text-slate-800'
                                : block.type === 'paragraph'
                                ? 'bg-blue-50 text-blue-800'
                                : block.type === 'tip'
                                ? 'bg-amber-100 text-amber-900'
                                : block.type === 'quote'
                                ? 'bg-purple-100 text-purple-900'
                                : block.type === 'image'
                                ? 'bg-sky-100 text-sky-900'
                                : 'bg-rose-100 text-rose-900'
                            }`}
                          >
                            {block.type}
                          </span>
                        </div>

                        <div className="flex items-center gap-1">
                          <button
                            type="button"
                            disabled={bIdx === 0}
                            onClick={() => {
                              const updated = [...editingBlogPost.blocks];
                              const temp = updated[bIdx - 1];
                              updated[bIdx - 1] = updated[bIdx];
                              updated[bIdx] = temp;
                              setEditingBlogPost({ ...editingBlogPost, blocks: updated });
                            }}
                            className="p-1 text-slate-400 hover:text-slate-700 disabled:opacity-20 cursor-pointer"
                            title="Di chuyển lên"
                          >
                            <MoveUp className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            disabled={bIdx === editingBlogPost.blocks.length - 1}
                            onClick={() => {
                              const updated = [...editingBlogPost.blocks];
                              const temp = updated[bIdx + 1];
                              updated[bIdx + 1] = updated[bIdx];
                              updated[bIdx] = temp;
                              setEditingBlogPost({ ...editingBlogPost, blocks: updated });
                            }}
                            className="p-1 text-slate-400 hover:text-slate-700 disabled:opacity-20 cursor-pointer"
                            title="Di chuyển xuống"
                          >
                            <MoveDown className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              const updated = editingBlogPost.blocks.filter((_, i) => i !== bIdx);
                              setEditingBlogPost({ ...editingBlogPost, blocks: updated });
                            }}
                            className="p-1 text-rose-400 hover:text-rose-600 rounded cursor-pointer"
                            title="Xóa khối"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      {/* Block Specific Form Inputs */}
                      {block.type === 'heading' && (
                        <div>
                          <input
                            type="text"
                            value={block.content}
                            onChange={(e) => {
                              const updated = [...editingBlogPost.blocks];
                              updated[bIdx] = { ...updated[bIdx], content: e.target.value };
                              setEditingBlogPost({ ...editingBlogPost, blocks: updated });
                            }}
                            placeholder="Nhập tiêu đề mục lớn..."
                            className="w-full px-3 py-2 text-sm font-semibold bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-rose-400"
                          />
                        </div>
                      )}

                      {block.type === 'paragraph' && (
                        <div>
                          <textarea
                            rows={3}
                            value={block.content}
                            onChange={(e) => {
                              const updated = [...editingBlogPost.blocks];
                              updated[bIdx] = { ...updated[bIdx], content: e.target.value };
                              setEditingBlogPost({ ...editingBlogPost, blocks: updated });
                            }}
                            placeholder="Nhập nội dung đoạn văn..."
                            className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-rose-400 leading-relaxed"
                          />
                        </div>
                      )}

                      {block.type === 'tip' && (
                        <div className="bg-amber-50/60 p-3 rounded-xl border border-amber-200/80 space-y-2">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-amber-800 block">
                            Nội dung lời khuyên y khoa / Tip làm đẹp:
                          </span>
                          <textarea
                            rows={2}
                            value={block.content}
                            onChange={(e) => {
                              const updated = [...editingBlogPost.blocks];
                              updated[bIdx] = { ...updated[bIdx], content: e.target.value };
                              setEditingBlogPost({ ...editingBlogPost, blocks: updated });
                            }}
                            className="w-full px-3 py-2 text-xs bg-white border border-amber-200 rounded-lg focus:outline-none"
                          />
                        </div>
                      )}

                      {block.type === 'quote' && (
                        <div className="bg-purple-50/60 p-3 rounded-xl border border-purple-200/80 space-y-2 text-xs">
                          <textarea
                            rows={2}
                            value={block.content}
                            onChange={(e) => {
                              const updated = [...editingBlogPost.blocks];
                              updated[bIdx] = { ...updated[bIdx], content: e.target.value };
                              setEditingBlogPost({ ...editingBlogPost, blocks: updated });
                            }}
                            placeholder="Câu trích dẫn nổi bật..."
                            className="w-full px-3 py-2 text-xs bg-white border border-purple-200 rounded-lg focus:outline-none italic"
                          />
                          <input
                            type="text"
                            value={block.extra?.author || ''}
                            onChange={(e) => {
                              const updated = [...editingBlogPost.blocks];
                              updated[bIdx] = {
                                ...updated[bIdx],
                                extra: { ...updated[bIdx].extra, author: e.target.value },
                              };
                              setEditingBlogPost({ ...editingBlogPost, blocks: updated });
                            }}
                            placeholder="Tác giả câu nói (Author)..."
                            className="w-full px-3 py-1.5 text-xs bg-white border border-purple-200 rounded-lg focus:outline-none"
                          />
                        </div>
                      )}

                      {block.type === 'image' && (
                        <div className="space-y-2 text-xs">
                          <input
                            type="text"
                            value={block.content}
                            onChange={(e) => {
                              const updated = [...editingBlogPost.blocks];
                              updated[bIdx] = { ...updated[bIdx], content: e.target.value };
                              setEditingBlogPost({ ...editingBlogPost, blocks: updated });
                            }}
                            placeholder="Đường dẫn URL ảnh..."
                            className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl"
                          />
                          <input
                            type="text"
                            value={block.extra?.caption || ''}
                            onChange={(e) => {
                              const updated = [...editingBlogPost.blocks];
                              updated[bIdx] = {
                                ...updated[bIdx],
                                extra: { ...updated[bIdx].extra, caption: e.target.value },
                              };
                              setEditingBlogPost({ ...editingBlogPost, blocks: updated });
                            }}
                            placeholder="Chú thích ảnh (Caption)..."
                            className="w-full px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl italic text-slate-500"
                          />
                        </div>
                      )}

                      {block.type === 'product_card' && (
                        <div className="bg-rose-50/50 p-3 rounded-xl border border-rose-200/80 space-y-2 text-xs">
                          <label className="font-semibold text-rose-900 block">
                            Chọn mẫu lens giới thiệu trong bài:
                          </label>
                          <select
                            value={block.extra?.productId || ''}
                            onChange={(e) => {
                              const p = products.find((prod) => prod.id === e.target.value);
                              const updated = [...editingBlogPost.blocks];
                              updated[bIdx] = {
                                ...updated[bIdx],
                                extra: {
                                  productId: p?.id,
                                  productName: p?.product_name || '',
                                  productPrice: p?.price || 0,
                                  productImage: p?.image_url || '',
                                },
                              };
                              setEditingBlogPost({ ...editingBlogPost, blocks: updated });
                            }}
                            className="w-full px-3 py-2 bg-white border border-rose-200 rounded-lg"
                          >
                            {products
                              .filter((prod) => prod.product_type === 'contact_lens')
                              .map((prod) => (
                                <option key={prod.id} value={prod.id}>
                                  {prod.product_name} ({formatCurrency(prod.price || 0)})
                                </option>
                              ))}
                          </select>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Modal Actions */}
              <div className="pt-6 border-t border-slate-100 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setEditingBlogPost(null)}
                  className="px-4 py-2.5 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
                >
                  Hủy bỏ
                </button>
                <button
                  type="button"
                  onClick={() => handleSaveBlogPost(editingBlogPost)}
                  className="px-6 py-2.5 bg-[#D96B8A] hover:bg-[#C24A6D] text-white text-xs font-semibold rounded-xl transition-colors shadow-sm inline-flex items-center gap-2 cursor-pointer"
                >
                  <Save className="w-4 h-4" />
                  <span>Lưu Bài Viết Ngay</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}


      {/* TAB 4: COUPONS & DISCOUNTS */}
      {activeTab === 'coupons' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-semibold text-slate-900 font-serif">
                Mã Giảm Giá & Ưu Đãi Khách Hàng
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Các voucher khuyến mãi được áp dụng tự động ở bước thanh toán.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white border border-rose-100 rounded-2xl p-6 shadow-xs space-y-3">
              <span className="px-2.5 py-1 bg-amber-50 text-amber-800 text-xs font-mono font-bold rounded-lg border border-amber-200">
                WELCOME10
              </span>
              <h3 className="text-sm font-semibold text-slate-900">Giảm 10% Cho Đơn Hàng Đầu Tiên</h3>
              <p className="text-xs text-slate-500">Áp dụng cho mọi đơn hàng của khách hàng đăng ký mới.</p>
              <div className="pt-2 text-[11px] text-emerald-600 font-medium">Trạng thái: Đang hoạt động</div>
            </div>

            <div className="bg-white border border-rose-100 rounded-2xl p-6 shadow-xs space-y-3">
              <span className="px-2.5 py-1 bg-purple-50 text-purple-800 text-xs font-mono font-bold rounded-lg border border-purple-200">
                LENS50K
              </span>
              <h3 className="text-sm font-semibold text-slate-900">Giảm Trực Tiếp 50.000đ</h3>
              <p className="text-xs text-slate-500">Áp dụng cho đơn hàng từ 399.000đ trở lên.</p>
              <div className="pt-2 text-[11px] text-emerald-600 font-medium">Trạng thái: Đang hoạt động</div>
            </div>

            <div className="bg-white border border-rose-100 rounded-2xl p-6 shadow-xs space-y-3">
              <span className="px-2.5 py-1 bg-rose-50 text-rose-800 text-xs font-mono font-bold rounded-lg border border-rose-200">
                FREESHIP
              </span>
              <h3 className="text-sm font-semibold text-slate-900">Miễn Phí Vận Chuyển Toàn Quốc</h3>
              <p className="text-xs text-slate-500">Tự động áp dụng cho mọi đơn từ 299.000đ.</p>
              <div className="pt-2 text-[11px] text-emerald-600 font-medium">Trạng thái: Đang hoạt động</div>
            </div>
          </div>
        </div>
      )}

      {/* TAB: BLACK FRIDAY SUBSCRIBERS */}
      {activeTab === 'black_friday' && (
        <div className="space-y-6">
          <div className="bg-white border border-rose-100 rounded-3xl p-6 sm:p-8 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-1">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-pink-50 text-pink-800 rounded-full text-xs font-semibold border border-pink-200">
                <Gift className="w-3.5 h-3.5 text-pink-600" />
                <span>Chiến Dịch Black Friday 2026</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-serif font-normal text-slate-900">
                Danh Sách Khách Hàng Đăng Ký Nhận Thông Báo
              </h2>
              <p className="text-xs text-slate-500 max-w-xl">
                Dữ liệu khách hàng điền qua pop-up Black Friday trên trang web. Tự động đồng bộ và lưu trữ an toàn trên Supabase (bảng <code className="text-pink-600 font-mono">public.black_friday_subscribers</code>).
              </p>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              <button
                type="button"
                onClick={fetchBfSubscribers}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl transition-colors inline-flex items-center gap-1.5 cursor-pointer"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${loadingBf ? 'animate-spin' : ''}`} />
                <span>Làm mới</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  const emails = bfSubscribers.map((s) => s.email).join(', ');
                  if (!emails) {
                    alert('Chưa có email nào trong danh sách!');
                    return;
                  }
                  navigator.clipboard.writeText(emails);
                  alert(`Đã sao chép ${bfSubscribers.length} địa chỉ email vào bộ nhớ tạm!`);
                }}
                className="px-4 py-2 bg-[#FF6086] hover:bg-[#fa4b75] text-white text-xs font-semibold rounded-xl transition-all inline-flex items-center gap-1.5 cursor-pointer shadow-xs"
              >
                <span>Sao chép danh sách email ({bfSubscribers.length})</span>
              </button>
            </div>
          </div>

          {/* Table */}
          <div className="bg-white border border-rose-100 rounded-2xl overflow-hidden shadow-xs">
            <div className="p-4 border-b border-rose-50 flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-700">
                Tổng cộng: <span className="text-rose-600 font-bold">{bfSubscribers.length}</span> khách hàng tiềm năng
              </span>
              <span className="text-[11px] text-emerald-600 font-medium flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Đồng bộ Supabase Database
              </span>
            </div>

            {loadingBf ? (
              <div className="p-12 text-center text-xs text-slate-400">Đang tải danh sách email...</div>
            ) : bfSubscribers.length === 0 ? (
              <div className="p-12 text-center text-xs text-slate-400">
                Chưa có khách hàng nào đăng ký qua pop-up Black Friday.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 border-b border-slate-100 text-slate-500 uppercase tracking-wider font-semibold">
                    <tr>
                      <th className="px-4 py-3 w-12 text-center">STT</th>
                      <th className="px-4 py-3">Địa Chỉ Email</th>
                      <th className="px-4 py-3">Thời Gian Đăng Ký</th>
                      <th className="px-4 py-3">Nguồn</th>
                      <th className="px-4 py-3">Trạng Thái</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-700">
                    {bfSubscribers.map((item, idx) => (
                      <tr key={item.email + idx} className="hover:bg-rose-50/30 transition-colors">
                        <td className="px-4 py-3 text-center text-slate-400 font-mono">{idx + 1}</td>
                        <td className="px-4 py-3 font-semibold text-slate-900">{item.email}</td>
                        <td className="px-4 py-3 text-slate-500">
                          {new Date(item.created_at).toLocaleString('vi-VN', {
                            hour: '2-digit',
                            minute: '2-digit',
                            second: '2-digit',
                            day: '2-digit',
                            month: '2-digit',
                            year: 'numeric',
                          })}
                        </td>
                        <td className="px-4 py-3">
                          <span className="px-2 py-0.5 bg-rose-50 text-rose-700 text-[10px] font-semibold rounded-full border border-rose-200">
                            Pop-up Website
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 text-[10px] font-semibold rounded-full border border-emerald-200">
                            Đã lưu trữ an toàn
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}


      {/* IN-PLACE PRODUCT EDIT & CREATE MODAL */}
      {editingProduct && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-150">
            <div className="sticky top-0 bg-white/95 backdrop-blur-md px-6 py-4 border-b border-slate-100 flex items-center justify-between z-10">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-[#D96B8A] text-white flex items-center justify-center">
                  <Edit2 className="w-4 h-4" />
                </div>
                <h3 className="text-base font-serif font-semibold text-slate-900">
                  {isCreating ? 'Thêm Sản Phẩm Mới' : `Chỉnh Sửa: ${editingProduct.product_name}`}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setEditingProduct(null)}
                className="p-2 text-slate-400 hover:text-slate-800 hover:bg-slate-100 rounded-full transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="p-6 space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* 1. Thông tin cơ bản & Định danh (Đồng bộ 2 chiều với Database) */}
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Tên sản phẩm <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={editingProduct.product_name || ''}
                    onChange={(e) => setEditingProduct({ ...editingProduct, product_name: e.target.value })}
                    placeholder="VD: Cat-titude Kristin - Pastel Rose Brown"
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-rose-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Mã SKU <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={editingProduct.sku || ''}
                    onChange={(e) => setEditingProduct({ ...editingProduct, sku: e.target.value })}
                    placeholder="VD: DY-1D-CKR-01"
                    className="w-full px-3 py-2 text-xs font-mono bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-rose-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Đường dẫn URL (Slug - tự tạo nếu để trống)
                  </label>
                  <input
                    type="text"
                    value={editingProduct.slug || ''}
                    onChange={(e) => setEditingProduct({ ...editingProduct, slug: e.target.value })}
                    placeholder="VD: cat-titude-kristin-rose"
                    className="w-full px-3 py-2 text-xs font-mono bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-rose-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Loại sản phẩm
                  </label>
                  <select
                    value={editingProduct.product_type || 'contact_lens'}
                    onChange={(e) => setEditingProduct({ ...editingProduct, product_type: e.target.value })}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-rose-400"
                  >
                    <option value="contact_lens">Kính áp tròng (Contact Lens)</option>
                    <option value="lens_solution">Nước ngâm / Nhỏ mắt</option>
                    <option value="accessory">Phụ kiện lens</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Danh mục hiển thị
                  </label>
                  <input
                    type="text"
                    value={editingProduct.category || ''}
                    onChange={(e) => setEditingProduct({ ...editingProduct, category: e.target.value })}
                    placeholder="VD: Lens 1 ngày, Lens 1 tháng, Nước ngâm..."
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-rose-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Bộ sưu tập (Collection)
                  </label>
                  <input
                    type="text"
                    value={editingProduct.collection || ''}
                    onChange={(e) => setEditingProduct({ ...editingProduct, collection: e.target.value })}
                    placeholder="VD: Cat-titude Kristin, Secretive..."
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-rose-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Màu sắc (Color)
                  </label>
                  <input
                    type="text"
                    value={editingProduct.color || ''}
                    onChange={(e) => setEditingProduct({ ...editingProduct, color: e.target.value })}
                    placeholder="VD: Tabby Brown, Rose Pink, Gray..."
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-rose-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Giá bán lẻ (VNĐ / 1 chiếc hoặc sản phẩm) <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="number"
                    required
                    min={0}
                    step={1000}
                    value={editingProduct.price ?? ''}
                    onChange={(e) => setEditingProduct({ ...editingProduct, price: Number(e.target.value) })}
                    className="w-full px-3 py-2 text-xs font-mono bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-rose-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Số lượng tồn kho
                  </label>
                  <input
                    type="number"
                    min={0}
                    value={editingProduct.stock_quantity ?? 50}
                    onChange={(e) => setEditingProduct({ ...editingProduct, stock_quantity: Number(e.target.value) })}
                    className="w-full px-3 py-2 text-xs font-mono bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-rose-400"
                  />
                </div>

                {/* 2. Thông số kỹ thuật nhãn khoa */}
                <div className="sm:col-span-2 grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 bg-rose-50/40 border border-rose-100 rounded-2xl">
                  <div className="col-span-2 sm:col-span-4 text-[11px] font-semibold text-slate-800">
                    Thông số kỹ thuật nhãn khoa (Tùy chọn cho Kính áp tròng)
                  </div>
                  <div>
                    <label className="block text-[10px] font-medium text-slate-600 mb-1">Chu kỳ (ngày)</label>
                    <input
                      type="number"
                      min={1}
                      value={editingProduct.replacement_period_days ?? 1}
                      onChange={(e) => setEditingProduct({ ...editingProduct, replacement_period_days: Number(e.target.value) })}
                      className="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-200 rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-medium text-slate-600 mb-1">Đường kính DIA (mm)</label>
                    <input
                      type="number"
                      step="0.1"
                      value={editingProduct.dia ?? ''}
                      onChange={(e) => setEditingProduct({ ...editingProduct, dia: e.target.value })}
                      placeholder="14.2"
                      className="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-200 rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-medium text-slate-600 mb-1">Độ cong BC (mm)</label>
                    <input
                      type="number"
                      step="0.1"
                      value={editingProduct.base_curve ?? ''}
                      onChange={(e) => setEditingProduct({ ...editingProduct, base_curve: e.target.value })}
                      placeholder="8.7"
                      className="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-200 rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-medium text-slate-600 mb-1">Độ ẩm nước (%)</label>
                    <input
                      type="number"
                      value={editingProduct.water_content ?? ''}
                      onChange={(e) => setEditingProduct({ ...editingProduct, water_content: e.target.value })}
                      placeholder="48"
                      className="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-200 rounded-lg"
                    />
                  </div>
                  <div className="col-span-2">
                    <label className="block text-[10px] font-medium text-slate-600 mb-1">Chất liệu (Material)</label>
                    <input
                      type="text"
                      value={editingProduct.material || ''}
                      onChange={(e) => setEditingProduct({ ...editingProduct, material: e.target.value })}
                      placeholder="Silicone Hydrogel"
                      className="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-200 rounded-lg"
                    />
                  </div>
                  <div className="col-span-2">
                    <label className="block text-[10px] font-medium text-slate-600 mb-1">Xuất xứ (Origin)</label>
                    <input
                      type="text"
                      value={editingProduct.origin || ''}
                      onChange={(e) => setEditingProduct({ ...editingProduct, origin: e.target.value })}
                      placeholder="Hàn Quốc (Made in Korea)"
                      className="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-200 rounded-lg"
                    />
                  </div>
                </div>

                {/* 3. Bộ 3 Hình Ảnh */}
                <div className="sm:col-span-2 space-y-3 p-4 bg-slate-50 border border-slate-200 rounded-2xl">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-semibold text-slate-800 flex items-center gap-1.5">
                      <ImageIcon className="w-4 h-4 text-slate-600" />
                      <span>Bộ 3 Hình Ảnh Sản Phẩm (Hiển thị chi tiết trên website)</span>
                    </label>
                    <span className="text-[10px] text-slate-500">3 ảnh xem trước</span>
                  </div>

                  <div>
                    <label className="block text-[11px] font-medium text-slate-600 mb-1">
                      Ảnh 1: Ảnh đại diện chính (image_url)
                    </label>
                    <input
                      type="text"
                      value={editingProduct.image_url || ''}
                      onChange={(e) => setEditingProduct({ ...editingProduct, image_url: e.target.value })}
                      placeholder="https://... hoặc /src/assets/images/..."
                      className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-rose-400"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-medium text-slate-600 mb-1">
                      Ảnh 2: Ảnh góc nghiêng / chi tiết vân lens (gallery_images[0])
                    </label>
                    <input
                      type="text"
                      value={editingProduct.gallery_images?.[0] || ''}
                      onChange={(e) => {
                        const g = [...(editingProduct.gallery_images || [])];
                        g[0] = e.target.value;
                        setEditingProduct({ ...editingProduct, gallery_images: g });
                      }}
                      placeholder="https://... hoặc /src/assets/images/..."
                      className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-rose-400"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-medium text-slate-600 mb-1">
                      Ảnh 3: Ảnh trải nghiệm thực tế / bao bì đóng gói (gallery_images[1])
                    </label>
                    <input
                      type="text"
                      value={editingProduct.gallery_images?.[1] || ''}
                      onChange={(e) => {
                        const g = [...(editingProduct.gallery_images || [])];
                        g[1] = e.target.value;
                        setEditingProduct({ ...editingProduct, gallery_images: g });
                      }}
                      placeholder="https://... hoặc /src/assets/images/..."
                      className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-rose-400"
                    />
                  </div>
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Mô tả sản phẩm
                  </label>
                  <textarea
                    rows={3}
                    value={editingProduct.description || ''}
                    onChange={(e) => setEditingProduct({ ...editingProduct, description: e.target.value })}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-rose-400"
                  />
                </div>

                <div className="sm:col-span-2 flex items-center gap-6 pt-2">
                  <label className="flex items-center gap-2 text-xs text-slate-700 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={Boolean(editingProduct.is_best_seller)}
                      onChange={(e) => setEditingProduct({ ...editingProduct, is_best_seller: e.target.checked })}
                      className="rounded text-slate-900 focus:ring-0"
                    />
                    <span>Đánh dấu là <strong>Bán chạy (Best Seller)</strong></span>
                  </label>

                  <label className="flex items-center gap-2 text-xs text-slate-700 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={Boolean(editingProduct.is_new)}
                      onChange={(e) => setEditingProduct({ ...editingProduct, is_new: e.target.checked })}
                      className="rounded text-slate-900 focus:ring-0"
                    />
                    <span>Đánh dấu là <strong>Hàng mới về (New Arrival)</strong></span>
                  </label>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setEditingProduct(null)}
                  className="px-4 py-2.5 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
                >
                  Hủy bỏ
                </button>
                <button
                  type="submit"
                  disabled={savingProduct}
                  className="px-5 py-2.5 bg-[#D96B8A] hover:bg-[#C24A6D] text-white text-xs font-semibold rounded-xl transition-colors shadow-sm inline-flex items-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>{savingProduct ? 'Đang lưu...' : 'Lưu Thay Đổi Trực Tiếp'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* TAB 8: POLICIES MANAGEMENT */}
      {activeTab === 'policies' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-base font-semibold text-slate-900 font-serif">
                Quản Lý Chính Sách & Quy Định ({policies.length})
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Các chính sách dạng ô nhấp (accordion) hiển thị tại trang /policy.
              </p>
            </div>
            <button
              type="button"
              onClick={() =>
                setEditingPolicy({
                  id: '',
                  title: '',
                  category: 'Kiểm hàng & Giao nhận',
                  icon: 'FileText',
                  display_order: policies.length + 1,
                  content: '',
                })
              }
              className="px-4 py-2.5 bg-[#D96B8A] text-white rounded-xl text-xs font-semibold hover:bg-[#C24A6D] transition-colors inline-flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>Thêm Chính Sách Mới</span>
            </button>
          </div>

          <div className="space-y-3">
            {policies.map((p) => (
              <div
                key={p.id}
                className="bg-white border border-rose-100 rounded-2xl p-5 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
              >
                <div className="space-y-1 max-w-3xl">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 bg-slate-100 text-slate-700 text-[10px] font-semibold rounded-md">
                      {p.category}
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono">Thứ tự: {p.display_order}</span>
                  </div>
                  <h3 className="text-sm font-semibold text-slate-900">{p.title}</h3>
                  <p className="text-xs text-slate-500 line-clamp-2">{p.content}</p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={() => setEditingPolicy(p)}
                    className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
                    title="Chỉnh sửa chính sách"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDeletePolicy(p)}
                    className="p-2 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-lg transition-colors"
                    title="Xóa chính sách"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 9: FAQ MANAGEMENT */}
      {activeTab === 'faqs' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-base font-semibold text-slate-900 font-serif">
                Quản Lý Hỏi Đáp FAQ ({faqs.length})
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Các câu hỏi thường gặp về kính áp tròng tại trang /faq.
              </p>
            </div>
            <button
              type="button"
              onClick={() =>
                setEditingFAQ({
                  id: '',
                  question: '',
                  category: 'Chăm sóc và vệ sinh kính',
                  display_order: faqs.length + 1,
                  answer: '',
                })
              }
              className="px-4 py-2.5 bg-[#D96B8A] text-white rounded-xl text-xs font-semibold hover:bg-[#C24A6D] transition-colors inline-flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>Thêm Câu Hỏi FAQ</span>
            </button>
          </div>

          <div className="space-y-3">
            {faqs.map((f) => (
              <div
                key={f.id}
                className="bg-white border border-rose-100 rounded-2xl p-5 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
              >
                <div className="space-y-1 max-w-3xl">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 bg-rose-50 text-rose-700 text-[10px] font-semibold rounded-md border border-rose-200">
                      {f.category}
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono">Thứ tự: {f.display_order}</span>
                  </div>
                  <h3 className="text-sm font-semibold text-slate-900">{f.question}</h3>
                  <p className="text-xs text-slate-500 line-clamp-2">{f.answer}</p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={() => setEditingFAQ(f)}
                    className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
                    title="Chỉnh sửa câu hỏi"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDeleteFAQ(f)}
                    className="p-2 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-lg transition-colors"
                    title="Xóa câu hỏi"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 10: ABOUT US MANAGEMENT */}
      {activeTab === 'about' && (
        <form onSubmit={handleSaveAbout} className="bg-white border border-rose-100 rounded-2xl p-6 sm:p-8 space-y-6 shadow-xs">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div>
              <h2 className="text-base font-semibold text-slate-900 font-serif">
                Chỉnh Sửa Trang Giới Thiệu Thương Hiệu (/about)
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Cập nhật câu chuyện thương hiệu, triết lý thiết kế và cam kết chất lượng.
              </p>
            </div>
            <button
              type="submit"
              disabled={savingAbout}
              className="px-5 py-2.5 bg-[#D96B8A] hover:bg-[#C24A6D] text-white text-xs font-semibold rounded-xl transition-colors shadow-sm inline-flex items-center gap-2 cursor-pointer disabled:opacity-50"
            >
              <Save className="w-3.5 h-3.5" />
              <span>{savingAbout ? 'Đang lưu...' : 'Lưu Trang Giới Thiệu'}</span>
            </button>
          </div>

          <div className="space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Tiêu đề & Giới thiệu</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-slate-700 mb-1">Tiêu đề lớn</label>
                <input
                  type="text"
                  value={aboutData.title}
                  onChange={(e) => setAboutData({ ...aboutData, title: e.target.value })}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-slate-700 mb-1">Đoạn phụ giới thiệu sứ mệnh</label>
                <textarea
                  rows={2}
                  value={aboutData.subtitle}
                  onChange={(e) => setAboutData({ ...aboutData, subtitle: e.target.value })}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>
            </div>

            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 pt-4 border-t border-slate-100">Câu chuyện thương hiệu</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-slate-700 mb-1">Tiêu đề câu chuyện</label>
                <input
                  type="text"
                  value={aboutData.story_title}
                  onChange={(e) => setAboutData({ ...aboutData, story_title: e.target.value })}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Đoạn văn 1 (Thực trạng mua cả cặp)</label>
                <textarea
                  rows={4}
                  value={aboutData.story_content_1}
                  onChange={(e) => setAboutData({ ...aboutData, story_content_1: e.target.value })}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Đoạn văn 2 (Giải pháp bán lẻ theo chiếc)</label>
                <textarea
                  rows={4}
                  value={aboutData.story_content_2}
                  onChange={(e) => setAboutData({ ...aboutData, story_content_2: e.target.value })}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-slate-700 mb-1">Đường dẫn ảnh thương hiệu</label>
                <input
                  type="text"
                  value={aboutData.story_image}
                  onChange={(e) => setAboutData({ ...aboutData, story_image: e.target.value })}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>
            </div>

            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 pt-4 border-t border-slate-100">3 Triết lý cốt lõi</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 bg-slate-50 rounded-xl space-y-2 border border-slate-200">
                <label className="block text-[11px] font-semibold text-slate-700">Triết lý 1 - Tiêu đề</label>
                <input
                  type="text"
                  value={aboutData.philosophy_1_title}
                  onChange={(e) => setAboutData({ ...aboutData, philosophy_1_title: e.target.value })}
                  className="w-full px-3 py-1.5 text-xs bg-white border border-slate-200 rounded-lg"
                />
                <label className="block text-[11px] font-semibold text-slate-700">Mô tả</label>
                <textarea
                  rows={3}
                  value={aboutData.philosophy_1_desc}
                  onChange={(e) => setAboutData({ ...aboutData, philosophy_1_desc: e.target.value })}
                  className="w-full px-3 py-1.5 text-xs bg-white border border-slate-200 rounded-lg"
                />
              </div>

              <div className="p-4 bg-slate-50 rounded-xl space-y-2 border border-slate-200">
                <label className="block text-[11px] font-semibold text-slate-700">Triết lý 2 - Tiêu đề</label>
                <input
                  type="text"
                  value={aboutData.philosophy_2_title}
                  onChange={(e) => setAboutData({ ...aboutData, philosophy_2_title: e.target.value })}
                  className="w-full px-3 py-1.5 text-xs bg-white border border-slate-200 rounded-lg"
                />
                <label className="block text-[11px] font-semibold text-slate-700">Mô tả</label>
                <textarea
                  rows={3}
                  value={aboutData.philosophy_2_desc}
                  onChange={(e) => setAboutData({ ...aboutData, philosophy_2_desc: e.target.value })}
                  className="w-full px-3 py-1.5 text-xs bg-white border border-slate-200 rounded-lg"
                />
              </div>

              <div className="p-4 bg-slate-50 rounded-xl space-y-2 border border-slate-200">
                <label className="block text-[11px] font-semibold text-slate-700">Triết lý 3 - Tiêu đề</label>
                <input
                  type="text"
                  value={aboutData.philosophy_3_title}
                  onChange={(e) => setAboutData({ ...aboutData, philosophy_3_title: e.target.value })}
                  className="w-full px-3 py-1.5 text-xs bg-white border border-slate-200 rounded-lg"
                />
                <label className="block text-[11px] font-semibold text-slate-700">Mô tả</label>
                <textarea
                  rows={3}
                  value={aboutData.philosophy_3_desc}
                  onChange={(e) => setAboutData({ ...aboutData, philosophy_3_desc: e.target.value })}
                  className="w-full px-3 py-1.5 text-xs bg-white border border-slate-200 rounded-lg"
                />
              </div>
            </div>

            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 pt-4 border-t border-slate-100">Cam kết thương hiệu</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-slate-700 mb-1">Tiêu đề ghi chú</label>
                <input
                  type="text"
                  value={aboutData.note_title}
                  onChange={(e) => setAboutData({ ...aboutData, note_title: e.target.value })}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-slate-700 mb-1">Nội dung ghi chú</label>
                <textarea
                  rows={3}
                  value={aboutData.note_content}
                  onChange={(e) => setAboutData({ ...aboutData, note_content: e.target.value })}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>
            </div>
          </div>
        </form>
      )}
    </div>
  );
};
