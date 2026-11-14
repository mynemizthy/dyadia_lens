/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import {
  Search,
  ChevronDown,
  HelpCircle,
  Sparkles,
  Phone,
  MessageCircle,
  Eye,
  ShieldAlert,
  BookOpen,
  ArrowRight,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { faqService } from '../services/faqService.ts';
import { FAQItem } from '../types/faq.ts';

export const FAQ: React.FC = () => {
  const [faqs, setFaqs] = useState<FAQItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [expandedIds, setExpandedIds] = useState<Record<string, boolean>>({});

  useEffect(() => {
    async function loadFAQs() {
      setLoading(true);
      try {
        const data = await faqService.getFAQs();
        setFaqs(data);
      } catch (err) {
        console.error('Lỗi tải câu hỏi thường gặp:', err);
      } finally {
        setLoading(false);
      }
    }
    loadFAQs();

    const handleUpdate = () => {
      faqService.getFAQs().then(setFaqs);
    };
    window.addEventListener('dyadia_faqs_updated', handleUpdate);
    return () => window.removeEventListener('dyadia_faqs_updated', handleUpdate);
  }, []);

  const toggleFAQ = (id: string) => {
    setExpandedIds((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const handleExpandAll = () => {
    const allExpanded: Record<string, boolean> = {};
    faqs.forEach((f) => {
      allExpanded[f.id] = true;
    });
    setExpandedIds(allExpanded);
  };

  const handleCollapseAll = () => {
    setExpandedIds({});
  };

  const categories = ['all', 'Chăm sóc và vệ sinh kính', 'Đeo kính', 'Tháo kính', 'Các loại kính', 'Chọn kính'];

  const filteredFaqs = faqs.filter((item) => {
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    const matchesSearch =
      item.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.answer.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-12">
      {/* Page Header */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-50 text-amber-900 rounded-full text-xs font-semibold border border-amber-200">
          <HelpCircle className="w-3.5 h-3.5 text-amber-600" />
          <span>Hỏi Đáp Chuyên Sâu & Cẩm Nang Nhãn Khoa</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-serif font-normal text-slate-900 tracking-tight">
          Câu Hỏi Thường Gặp (FAQ)
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 max-w-2xl mx-auto leading-relaxed">
          Tất cả giải đáp chuyên môn từ chuyên viên nhãn khoa Dyadia về cách chọn độ cận, đường kính G.DIA,
          bán kính cong BC, hướng dẫn đeo/tháo lens an toàn và mẹo xử lý móng tay dài.
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
              placeholder="Tìm câu hỏi (đeo lens, móng tay dài, G.DIA, hạn sử dụng...)"
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
              {cat === 'all' ? `Tất cả câu hỏi (${faqs.length})` : cat}
            </button>
          ))}
        </div>
      </div>

      {/* FAQs Accordion List */}
      {loading ? (
        <div className="py-20 text-center space-y-3">
          <div className="w-8 h-8 border-2 border-[#D96B8A] border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs text-slate-500">Đang tải danh sách câu hỏi...</p>
        </div>
      ) : filteredFaqs.length === 0 ? (
        <div className="bg-white border border-rose-100 rounded-3xl p-12 text-center text-xs text-slate-500 space-y-2">
          <p>Không tìm thấy câu hỏi phù hợp với từ khóa &quot;{searchQuery}&quot;</p>
          <button
            type="button"
            onClick={() => {
              setSearchQuery('');
              setSelectedCategory('all');
            }}
            className="text-xs font-semibold text-slate-900 underline"
          >
            Xem lại tất cả câu hỏi
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredFaqs.map((faq, index) => {
            const isExpanded = Boolean(expandedIds[faq.id]);

            return (
              <div
                key={faq.id}
                className="bg-white border border-rose-100 rounded-2xl overflow-hidden shadow-xs hover:border-slate-300 transition-all duration-200"
              >
                {/* Clickable Header Button */}
                <button
                  type="button"
                  onClick={() => toggleFAQ(faq.id)}
                  aria-expanded={isExpanded}
                  className="w-full p-5 sm:p-6 text-left flex items-center justify-between gap-4 cursor-pointer hover:bg-slate-50/50 transition-colors"
                >
                  <div className="flex items-center gap-3.5 min-w-0">
                    <span className="w-8 h-8 rounded-full bg-slate-100 text-slate-700 font-mono text-xs font-bold flex items-center justify-center shrink-0">
                      {index + 1}
                    </span>
                    <div className="min-w-0">
                      <span className="px-2 py-0.5 bg-amber-50 text-amber-800 text-[10px] font-semibold rounded-md border border-amber-200 inline-block mb-1">
                        {faq.category}
                      </span>
                      <h3 className="text-base sm:text-lg font-serif font-medium text-slate-900 leading-snug">
                        {faq.question}
                      </h3>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <span className="text-xs text-slate-400 hidden sm:inline">
                      {isExpanded ? 'Thu gọn' : 'Xem câu trả lời'}
                    </span>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-transform duration-200 ${
                      isExpanded ? 'bg-[#D96B8A] text-white rotate-180' : 'bg-slate-100 text-slate-600'
                    }`}>
                      <ChevronDown className="w-4 h-4" />
                    </div>
                  </div>
                </button>

                {/* Expanded Answer Content */}
                {isExpanded && (
                  <div className="px-5 pb-6 sm:px-6 sm:pb-8 pt-3 border-t border-slate-100 text-xs sm:text-sm text-slate-700 leading-relaxed space-y-3 bg-[#FFF9FA]/60 animate-in fade-in duration-150">
                    {faq.answer.split('\n\n').map((paragraph, pIdx) => (
                      <p key={pIdx} className="whitespace-pre-line">
                        {paragraph}
                      </p>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Support Consultation Banner */}
      <div className="bg-white border border-rose-100 rounded-3xl p-6 sm:p-10 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-2 text-center md:text-left">
          <span className="text-[11px] uppercase tracking-wider text-amber-700 font-semibold block">
            Tư vấn khúc xạ & thẩm mỹ mắt miễn phí
          </span>
          <h3 className="text-xl sm:text-2xl font-serif font-normal text-slate-900">
            Bạn chưa tìm thấy câu trả lời mong muốn?
          </h3>
          <p className="text-xs text-slate-500 max-w-lg leading-relaxed">
            Hãy liên hệ trực tiếp với chuyên viên tư vấn của Dyadia để được đo khám, gợi ý độ cận chuẩn xác và chọn mẫu lens tôn da nhất.
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-3">
          <Link
            to="/products"
            className="px-5 py-2.5 bg-[#D96B8A] text-white text-xs font-semibold rounded-full hover:bg-[#C24A6D] transition-colors shadow-xs inline-flex items-center gap-2"
          >
            <span>Khám phá sản phẩm</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
          <a
            href="tel:0783465079"
            className="px-5 py-2.5 bg-amber-50 border border-amber-200 text-amber-900 text-xs font-semibold rounded-full hover:bg-amber-100 transition-colors inline-flex items-center gap-2"
          >
            <Phone className="w-3.5 h-3.5 text-amber-700" />
            <span>Hotline: 0783465079</span>
          </a>
        </div>
      </div>
    </div>
  );
};
