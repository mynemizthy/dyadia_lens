/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, Clock, User, ArrowRight, Search, BookOpen } from 'lucide-react';
import { blogService } from '../services/blogService.ts';
import { BlogPost, BlogCategory } from '../types/blog.ts';

const CATEGORIES: Array<{ id: string; label: string }> = [
  { id: '', label: 'Tất cả bài viết' },
  { id: 'Cẩm nang nhãn khoa', label: 'Cẩm nang nhãn khoa' },
  { id: 'Xu hướng K-Beauty', label: 'Xu hướng K-Beauty' },
  { id: 'Phong cách & Make-up', label: 'Phong cách & Make-up' },
  { id: 'Bí quyết chọn lens', label: 'Bí quyết chọn lens' },
];

export const Blog: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const allPosts = useMemo(() => {
    return blogService.getPosts().filter((p) => p.published);
  }, []);

  const filteredPosts = useMemo(() => {
    return allPosts.filter((p) => {
      const matchCat = !selectedCategory || p.category === selectedCategory;
      const matchSearch =
        !searchQuery.trim() ||
        p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
      return matchCat && matchSearch;
    });
  }, [allPosts, selectedCategory, searchQuery]);

  const featuredPost = allPosts[0];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-12">
      {/* Editorial Header */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-50 border border-amber-200/70 rounded-full text-xs font-semibold text-amber-900 tracking-wide">
          <BookOpen className="w-3.5 h-3.5 text-amber-700" />
          <span>Dyadia Journal & Eye Care Guide</span>
        </div>
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-normal text-slate-900 tracking-tight">
          Cẩm Nang Làm Đẹp & Nhãn Khoa
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
          Khám phá những xu hướng kính áp tròng Hàn Quốc mới nhất, mẹo chọn độ cận an toàn và bí quyết trang điểm tôn vinh thần thái đôi mắt.
        </p>
      </div>

      {/* Featured Article Hero (if available and no filter active) */}
      {!selectedCategory && !searchQuery && featuredPost && (
        <section className="bg-white border border-rose-100 rounded-3xl overflow-hidden shadow-xs grid grid-cols-1 lg:grid-cols-12 group">
          <div className="lg:col-span-7 aspect-[16/10] sm:aspect-[16/9] lg:aspect-auto overflow-hidden bg-slate-100">
            <img
              src={featuredPost.cover_image}
              alt={featuredPost.title}
              className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700"
            />
          </div>
          <div className="lg:col-span-5 p-6 sm:p-10 lg:p-12 flex flex-col justify-between space-y-6">
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-semibold uppercase tracking-wider text-amber-800 bg-amber-50 border border-amber-200 px-2.5 py-1 rounded-full">
                  {featuredPost.category}
                </span>
                <span className="text-xs text-slate-400 flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {featuredPost.read_time_minutes} phút đọc
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl lg:text-3xl font-serif font-normal text-slate-900 group-hover:text-amber-900 transition-colors">
                <Link to={`/blog/${featuredPost.slug}`}>{featuredPost.title}</Link>
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 leading-relaxed line-clamp-3">
                {featuredPost.excerpt}
              </p>
            </div>

            <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-2.5 text-xs text-slate-600">
                <div className="w-7 h-7 rounded-full bg-[#D96B8A] text-white flex items-center justify-center font-bold text-[10px]">
                  {featuredPost.author.name[0]}
                </div>
                <div>
                  <p className="font-semibold text-slate-900">{featuredPost.author.name}</p>
                  <p className="text-[10px] text-slate-400">{featuredPost.author.role}</p>
                </div>
              </div>
              <Link
                to={`/blog/${featuredPost.slug}`}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-900 hover:text-amber-800 transition-colors"
              >
                <span>Đọc bài</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 py-4 border-y border-rose-100">
        {/* Category Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 sm:pb-0">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3.5 py-1.5 text-xs font-semibold rounded-full whitespace-nowrap transition-colors cursor-pointer ${
                selectedCategory === cat.id
                  ? 'bg-[#D96B8A] text-white shadow-xs'
                  : 'bg-white text-slate-600 hover:bg-rose-50 border border-slate-200'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Tìm kiếm bài viết..."
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-white border border-slate-200 rounded-full focus:outline-none focus:ring-1 focus:ring-rose-400"
          />
        </div>
      </div>

      {/* Articles Grid */}
      {filteredPosts.length === 0 ? (
        <div className="py-20 text-center bg-white border border-rose-100 rounded-3xl">
          <BookOpen className="w-8 h-8 text-slate-300 mx-auto mb-2" />
          <h3 className="text-sm font-semibold text-slate-700">Không tìm thấy bài viết phù hợp</h3>
          <p className="text-xs text-slate-400 mt-1">Hãy thử tìm kiếm với từ khóa khác hoặc xóa bộ lọc.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredPosts.map((post) => (
            <article
              key={post.id}
              className="bg-white border border-rose-100 rounded-2xl overflow-hidden shadow-xs hover:shadow-md transition-all duration-300 flex flex-col group"
            >
              <Link to={`/blog/${post.slug}`} className="block aspect-[16/10] overflow-hidden bg-slate-100 relative">
                <img
                  src={post.cover_image}
                  alt={post.title}
                  className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                />
                <span className="absolute top-3 left-3 text-[10px] font-semibold uppercase tracking-wider text-slate-900 bg-white/95 backdrop-blur-xs px-2.5 py-1 rounded-full shadow-xs">
                  {post.category}
                </span>
              </Link>

              <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-[11px] text-slate-400">
                    <Clock className="w-3 h-3" />
                    <span>{post.read_time_minutes} phút đọc</span>
                    <span>•</span>
                    <span>{new Date(post.created_at).toLocaleDateString('vi-VN')}</span>
                  </div>
                  <h3 className="text-base font-serif font-medium text-slate-900 group-hover:text-amber-800 transition-colors line-clamp-2 leading-snug">
                    <Link to={`/blog/${post.slug}`}>{post.title}</Link>
                  </h3>
                  <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                    {post.excerpt}
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span className="text-[11px] font-medium text-slate-600 truncate max-w-[150px]">
                    {post.author.name}
                  </span>
                  <Link
                    to={`/blog/${post.slug}`}
                    className="inline-flex items-center gap-1 text-[11px] font-semibold text-slate-900 group-hover:text-amber-800 transition-colors"
                  >
                    <span>Xem tiếp</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
};
