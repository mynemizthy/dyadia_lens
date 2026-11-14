/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import {
  Search,
  ChevronDown,
  PackageCheck,
  RotateCcw,
  Truck,
  MessageSquareWarning,
  Store,
  ShieldCheck,
  CreditCard,
  Lock,
  BookOpen,
  Phone,
  MapPin,
  Copy,
  Check,
} from 'lucide-react';
import { policyService } from '../services/policyService.ts';
import { PolicyItem } from '../types/policy.ts';
import { Link, useLocation } from 'react-router-dom';

const HASH_TO_POLICY_ID: Record<string, string> = {
  inspection: 'cs-kiem-hang',
  return: 'cs-doi-tra-hoan-tien',
  shipping: 'cs-van-chuyen',
  complaint: 'cs-khieu-nai',
  sales: 'cs-ban-hang',
  warranty: 'cs-bao-hanh',
  payment: 'cs-thanh-toan',
  privacy: 'cs-bao-mat',
  guide: 'cs-huong-dan-su-dung',
};

const getPolicyIcon = (iconName?: string) => {
  switch (iconName) {
    case 'PackageCheck':
      return PackageCheck;
    case 'RotateCcw':
      return RotateCcw;
    case 'Truck':
      return Truck;
    case 'MessageSquareWarning':
      return MessageSquareWarning;
    case 'Store':
      return Store;
    case 'ShieldCheck':
      return ShieldCheck;
    case 'CreditCard':
      return CreditCard;
    case 'Lock':
      return Lock;
    case 'BookOpen':
    default:
      return BookOpen;
  }
};

export const Policy: React.FC = () => {
  const location = useLocation();
  const [policies, setPolicies] = useState<PolicyItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [expandedIds, setExpandedIds] = useState<Record<string, boolean>>({});
  const [copiedBank, setCopiedBank] = useState<boolean>(false);

  useEffect(() => {
    if (!location.hash || policies.length === 0) return;
    const rawHash = location.hash.replace('#', '').toLowerCase();
    const targetId = HASH_TO_POLICY_ID[rawHash] || rawHash;
    const matched = policies.find((p) => p.id === targetId);
    if (!matched) return;

    setSelectedCategory('all');
    setSearchQuery('');
    setExpandedIds((prev) => ({ ...prev, [matched.id]: true }));

    const timer = setTimeout(() => {
      document.getElementById(matched.id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 80);
    return () => clearTimeout(timer);
  }, [location.hash, policies]);

  useEffect(() => {
    async function loadPolicies() {
      setLoading(true);
      try {
        const data = await policyService.getPolicies();
        setPolicies(data);
      } catch (err) {
        console.error('Lỗi tải chính sách:', err);
      } finally {
        setLoading(false);
      }
    }
    loadPolicies();

    const handleUpdate = () => {
      policyService.getPolicies().then(setPolicies);
    };
    window.addEventListener('dyadia_policies_updated', handleUpdate);
    return () => window.removeEventListener('dyadia_policies_updated', handleUpdate);
  }, []);

  const togglePolicy = (id: string) => {
    setExpandedIds((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const handleExpandAll = () => {
    const allExpanded: Record<string, boolean> = {};
    policies.forEach((p) => {
      allExpanded[p.id] = true;
    });
    setExpandedIds(allExpanded);
  };

  const handleCollapseAll = () => {
    setExpandedIds({});
  };

  const categories = ['all', ...Array.from(new Set(policies.map((p) => p.category)))];

  const filteredPolicies = policies.filter((p) => {
    const matchesCategory = selectedCategory === 'all' || p.category === selectedCategory;
    const matchesSearch =
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.content.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleCopyBank = () => {
    navigator.clipboard.writeText('00006222165');
    setCopiedBank(true);
    setTimeout(() => setCopiedBank(false), 3000);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-12">
      {/* Header */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-50 text-amber-900 rounded-full text-xs font-semibold border border-amber-200">
          <ShieldCheck className="w-3.5 h-3.5 text-amber-600" />
          <span>Quy Chuẩn Hoạt Động & Quyền Lợi Khách Hàng</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-serif font-normal text-slate-900 tracking-tight">
          Chính Sách Bán Hàng & Dịch Vụ
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 max-w-2xl mx-auto leading-relaxed">
          Dyadia Lens cam kết minh bạch 100% quy trình kiểm hàng, đổi trả, bảo hành và bảo mật thông tin.
          Nhấp vào từng ô chính sách bên dưới để xem nội dung chi tiết.
        </p>
      </div>

      {/* Controls Bar: Search & Category Filter */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Tìm kiếm nội dung chính sách (đổi trả, bảo hành, phí ship...)"
              className="w-full pl-9 pr-4 py-2.5 text-xs bg-white border border-slate-200 rounded-2xl focus:outline-none focus:ring-1 focus:ring-rose-400 shadow-xs"
            />
          </div>

          <div className="flex items-center gap-2 self-end sm:self-center text-xs">
            <button
              type="button"
              onClick={handleExpandAll}
              className="px-3 py-1.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-xl transition-colors cursor-pointer"
            >
              Mở tất cả
            </button>
            <button
              type="button"
              onClick={handleCollapseAll}
              className="px-3 py-1.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-xl transition-colors cursor-pointer"
            >
              Thu gọn
            </button>
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-1.5 rounded-full font-medium whitespace-nowrap transition-all cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-[#D96B8A] text-white shadow-xs'
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
              }`}
            >
              {cat === 'all' ? `Tất cả chính sách (${policies.length})` : cat}
            </button>
          ))}
        </div>
      </div>

      {/* Policies Accordion List */}
      {loading ? (
        <div className="py-20 text-center space-y-3">
          <div className="w-8 h-8 border-2 border-[#D96B8A] border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs text-slate-500">Đang tải danh sách chính sách...</p>
        </div>
      ) : filteredPolicies.length === 0 ? (
        <div className="bg-white border border-rose-100 rounded-3xl p-12 text-center text-xs text-slate-500 space-y-2">
          <p>Không tìm thấy chính sách phù hợp với từ khóa &quot;{searchQuery}&quot;</p>
          <button
            type="button"
            onClick={() => {
              setSearchQuery('');
              setSelectedCategory('all');
            }}
            className="text-xs font-semibold text-slate-900 underline"
          >
            Xem lại tất cả chính sách
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredPolicies.map((item, index) => {
            const Icon = getPolicyIcon(item.icon);
            const isExpanded = Boolean(expandedIds[item.id]);

            return (
              <div
                key={item.id}
                id={item.id}
                className="scroll-mt-24 bg-white border border-rose-100 rounded-2xl overflow-hidden shadow-xs hover:border-slate-300 transition-all duration-200"
              >
                {/* Clickable Header Button */}
                <button
                  type="button"
                  onClick={() => togglePolicy(item.id)}
                  aria-expanded={isExpanded}
                  className="w-full p-5 sm:p-6 text-left flex items-center justify-between gap-4 cursor-pointer hover:bg-slate-50/50 transition-colors"
                >
                  <div className="flex items-center gap-3.5 min-w-0">
                    <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center shrink-0 text-slate-700">
                      <Icon className="w-5 h-5 stroke-[1.75]" />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <span className="px-2 py-0.5 bg-rose-50 text-rose-800 text-[10px] font-semibold rounded-md border border-rose-200">
                          {item.category}
                        </span>
                      </div>
                      <h3 className="text-base sm:text-lg font-serif font-medium text-slate-900 truncate">
                        {item.title}
                      </h3>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <span className="text-xs text-slate-400 hidden sm:inline">
                      {isExpanded ? 'Đóng lại' : 'Xem chi tiết'}
                    </span>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-transform duration-200 ${
                      isExpanded ? 'bg-[#D96B8A] text-white rotate-180' : 'bg-slate-100 text-slate-600'
                    }`}>
                      <ChevronDown className="w-4 h-4" />
                    </div>
                  </div>
                </button>

                {/* Expanded Content with Formatted Text */}
                {isExpanded && (
                  <div className="px-5 pb-6 sm:px-6 sm:pb-8 pt-2 border-t border-slate-100 text-xs sm:text-sm text-slate-700 leading-relaxed space-y-3 bg-[#FFF9FA]/60 animate-in fade-in duration-150">
                    {item.content.split('\n\n').map((paragraph, pIdx) => (
                      <p key={pIdx} className="whitespace-pre-line">
                        {paragraph}
                      </p>
                    ))}

                    {/* Quick helper box for Payment policy */}
                    {item.id === 'cs-thanh-toan' && (
                      <div className="mt-4 p-4 bg-white border border-slate-200 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
                        <div>
                          <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block">
                            Tài Khoản Ngân Hàng ACB Dyadia
                          </span>
                          <span className="text-sm font-bold font-mono text-slate-900">
                            00006222165 · CỬA HÀNG DYADIA
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={handleCopyBank}
                          className="px-3 py-1.5 bg-[#D96B8A] text-white text-xs font-semibold rounded-lg hover:bg-[#C24A6D] transition-colors inline-flex items-center gap-1.5 self-start sm:self-auto cursor-pointer"
                        >
                          {copiedBank ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                          <span>{copiedBank ? 'Đã sao chép STK' : 'Sao chép số tài khoản'}</span>
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Support Contact Footer Card */}
      <div className="relative overflow-hidden bg-gradient-to-br from-[#FFF9FA] via-[#FFF0F4] to-[#FFE4EC] border border-rose-200/80 text-[#3A232B] rounded-3xl p-6 sm:p-10 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-white text-[#B84A6A] rounded-full text-xs font-semibold border border-rose-200/80 shadow-2xs">
            <Phone className="w-3.5 h-3.5 text-[#D96B8A]" />
            <span>Hỗ trợ: 08:00 – 17:30 (Thứ 2 – Thứ 7)</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-serif font-normal text-[#3A232B]">
            Cần Giải Đáp Thêm Về Đơn Hàng Hoặc Chính Sách?
          </h3>
          <p className="text-xs text-slate-600 max-w-xl leading-relaxed">
            Đội ngũ tư vấn viên nhãn khoa của Dyadia Lens luôn sẵn sàng hỗ trợ bạn kiểm tra đơn hàng, bảo hành sản phẩm hoặc hướng dẫn cách đeo lens chuẩn y tế.
          </p>
          <div className="pt-1 flex flex-wrap items-center gap-3 text-xs text-[#3A232B]">
            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white/85 border border-rose-100 rounded-xl shadow-2xs">
              <Phone className="w-3.5 h-3.5 text-[#D96B8A]" />
              <span>Hotline / Zalo: <strong className="font-semibold text-[#832B47]">0783465079</strong></span>
            </div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white/85 border border-rose-100 rounded-xl shadow-2xs">
              <MapPin className="w-3.5 h-3.5 text-[#D96B8A]" />
              <span>Cửa hàng: <strong className="font-semibold text-[#832B47]">56 Hoàng Diệu 2, TP. Thủ Đức, TP.HCM</strong></span>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto shrink-0">
          <Link
            to="/faq"
            className="w-full sm:w-auto px-5 py-3 text-xs font-semibold text-[#832B47] bg-white hover:bg-rose-50 border border-rose-200 rounded-full transition-colors text-center shadow-2xs whitespace-nowrap"
          >
            Xem Hỏi Đáp (FAQ)
          </Link>
          <a
            href="tel:0783465079"
            className="w-full sm:w-auto px-6 py-3 text-xs font-semibold text-white bg-[#D96B8A] hover:bg-[#C24A6D] rounded-full transition-colors text-center shadow-xs whitespace-nowrap"
          >
            Gọi Ngay: 0783465079
          </a>
        </div>
      </div>
    </div>
  );
};
