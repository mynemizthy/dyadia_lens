/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  Clock,
  User,
  ArrowLeft,
  ArrowRight,
  Sparkles,
  Share2,
  Bookmark,
  ShoppingBag,
  Info,
  AlertCircle,
} from 'lucide-react';
import { blogService } from '../services/blogService.ts';
import { formatCurrency } from '../lib/utils.ts';

// Helper to parse markdown links [text](url) into React Router Links
function renderFormattedText(text: string): React.ReactNode {
  if (!text) return null;
  const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
  const parts: React.ReactNode[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = linkRegex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push(text.slice(lastIndex, match.index));
    }
    const label = match[1];
    const url = match[2];
    if (url.startsWith('/')) {
      parts.push(
        <Link
          key={`${match.index}-${url}`}
          to={url}
          className="text-[#D96B8A] font-semibold underline underline-offset-2 hover:text-[#B84E6D] transition-colors"
        >
          {label}
        </Link>
      );
    } else {
      parts.push(
        <a
          key={`${match.index}-${url}`}
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-[#D96B8A] font-semibold underline underline-offset-2 hover:text-[#B84E6D] transition-colors"
        >
          {label}
        </a>
      );
    }
    lastIndex = linkRegex.lastIndex;
  }

  if (lastIndex < text.length) {
    parts.push(text.slice(lastIndex));
  }

  return parts.length > 0 ? parts : text;
}

export const BlogDetail: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();

  const post = useMemo(() => {
    if (!slug) return null;
    return blogService.getPostBySlug(slug);
  }, [slug]);

  const relatedPosts = useMemo(() => {
    if (!post) return [];
    return blogService
      .getPosts()
      .filter((p) => p.id !== post.id && p.published)
      .slice(0, 3);
  }, [post]);

  if (!post) {
    return (
      <div className="max-w-xl mx-auto px-4 py-24 text-center">
        <h2 className="text-2xl font-serif font-medium text-slate-800">
          Bài viết không tồn tại
        </h2>
        <p className="text-xs text-slate-500 mt-2">
          Bài viết bạn đang tìm kiếm có thể đã bị xóa hoặc thay đổi đường dẫn.
        </p>
        <Link
          to="/blog"
          className="mt-6 inline-flex items-center gap-2 px-5 py-2.5 text-xs font-semibold text-white bg-[#D96B8A] rounded-xl"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Về trang Blog & Cẩm nang</span>
        </Link>
      </div>
    );
  }

  return (
    <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-10">
      {/* Breadcrumb & Navigation */}
      <div className="flex items-center justify-between text-xs text-slate-500">
        <Link
          to="/blog"
          className="inline-flex items-center gap-1.5 font-medium hover:text-slate-900 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Quay lại Blog</span>
        </Link>

        <span className="text-[11px] font-semibold uppercase tracking-wider text-amber-800 bg-amber-50 border border-amber-200 px-2.5 py-0.5 rounded-full">
          {post.category}
        </span>
      </div>

      {/* Header */}
      <header className="space-y-4 text-left">
        <h1 className="text-2xl sm:text-4xl lg:text-5xl font-serif font-normal text-slate-900 leading-tight">
          {post.title}
        </h1>
        <p className="text-sm sm:text-base text-slate-600 leading-relaxed max-w-3xl text-justify">
          {post.excerpt}
        </p>

        <div className="pt-4 flex flex-wrap items-center justify-between gap-4 border-t border-slate-100 text-xs text-slate-500">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-[#D96B8A] text-white flex items-center justify-center font-bold text-xs">
              A
            </div>
            <div>
              <p className="font-semibold text-slate-900">Admin</p>
              <p className="text-[11px] text-slate-400">Khuyến cáo</p>
            </div>
          </div>

          <div className="flex items-center gap-3 text-xs text-slate-400">
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" />
              {post.read_time_minutes} phút đọc
            </span>
            <span>•</span>
            <span>{new Date(post.created_at).toLocaleDateString('vi-VN')}</span>
          </div>
        </div>
      </header>

      {/* Featured Image */}
      <div className="rounded-3xl overflow-hidden aspect-[16/9] bg-slate-100 border border-rose-100 shadow-xs">
        <img
          src={post.cover_image}
          alt={post.title}
          className="w-full h-full object-cover object-center"
        />
      </div>

      {/* Dynamic Content Blocks */}
      <div className="space-y-6 text-slate-800 text-sm sm:text-base leading-relaxed pt-2">
        {post.blocks.map((block) => {
          switch (block.type) {
            case 'heading':
              return (
                <h2
                  key={block.id}
                  className="text-xl sm:text-2xl font-serif font-semibold text-slate-900 pt-6 pb-2 border-b border-slate-100"
                >
                  {block.content}
                </h2>
              );

            case 'paragraph':
              return (
                <p key={block.id} className="text-slate-700 leading-relaxed text-justify">
                  {renderFormattedText(block.content)}
                </p>
              );

            case 'table':
              return (
                <div
                  key={block.id}
                  className="my-6 overflow-hidden rounded-2xl border border-rose-100 bg-white shadow-xs"
                >
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs sm:text-sm">
                      {block.extra?.tableHeaders && (
                        <thead className="bg-rose-50/70 border-b border-rose-100 text-rose-950 font-semibold">
                          <tr>
                            {block.extra.tableHeaders.map((header, idx) => (
                              <th key={idx} className="px-4 py-3 font-semibold tracking-wide">
                                {header}
                              </th>
                            ))}
                          </tr>
                        </thead>
                      )}
                      <tbody className="divide-y divide-rose-50 text-slate-700">
                        {block.extra?.tableRows?.map((row, rowIdx) => (
                          <tr
                            key={rowIdx}
                            className={rowIdx % 2 === 0 ? 'bg-white' : 'bg-rose-50/20'}
                          >
                            {row.map((cell, cellIdx) => (
                              <td key={cellIdx} className="px-4 py-3 font-medium">
                                {renderFormattedText(cell)}
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              );

            case 'tip':
              return (
                <div
                  key={block.id}
                  className="p-5 sm:p-6 bg-amber-50/70 border border-amber-200/80 rounded-2xl flex items-start gap-3.5 text-xs sm:text-sm text-amber-950 my-6 shadow-xs"
                >
                  <AlertCircle className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
                  <div className="space-y-1 flex-1">
                    <strong className="block font-semibold uppercase tracking-wider text-[11px] text-amber-900">
                      Khuyến cáo
                    </strong>
                    <p className="leading-relaxed text-justify">{block.content}</p>
                  </div>
                </div>
              );

            case 'quote':
              return (
                <blockquote
                  key={block.id}
                  className="pl-5 border-l-4 border-[#D96B8A] my-6 italic text-slate-700 font-serif text-base sm:text-lg"
                >
                  &ldquo;{block.content}&rdquo;
                  {block.extra?.author && (
                    <footer className="text-xs not-italic font-sans text-slate-400 mt-2">
                      — {block.extra.author}
                    </footer>
                  )}
                </blockquote>
              );

            case 'image':
              return (
                <figure key={block.id} className="my-8 space-y-2">
                  <div className="rounded-2xl overflow-hidden border border-slate-200 bg-slate-50">
                    <img
                      src={block.content}
                      alt={block.extra?.caption || ''}
                      className="w-full max-h-[480px] object-cover"
                    />
                  </div>
                  {block.extra?.caption && (
                    <figcaption className="text-xs text-center text-slate-400 italic">
                      {block.extra.caption}
                    </figcaption>
                  )}
                </figure>
              );

            case 'product_card':
              const targetUrl = block.extra?.productSlug
                ? `/products/${block.extra.productSlug}`
                : '/products';
              return (
                <div
                  key={block.id}
                  className="my-8 p-5 bg-white border border-rose-100 rounded-2xl shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4 hover:border-rose-300 transition-colors"
                >
                  <Link to={targetUrl} className="flex items-center gap-4 group flex-1">
                    {block.extra?.productImage && (
                      <div className="w-16 h-16 rounded-xl bg-slate-50 border border-slate-200 overflow-hidden shrink-0 flex items-center justify-center group-hover:scale-105 transition-transform">
                        <img
                          src={block.extra.productImage}
                          alt={block.extra.productName || ''}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                    <div>
                      <span className="text-[10px] font-semibold uppercase tracking-wider text-rose-700">
                        Sản phẩm đề xuất
                      </span>
                      <h4 className="text-sm font-semibold text-slate-900 font-serif group-hover:text-[#D96B8A] transition-colors">
                        {block.extra?.productName || 'Kính áp tròng Dyadia'}
                      </h4>
                      {block.extra?.productPrice ? (
                        <p className="text-xs font-mono font-bold text-slate-700 mt-0.5">
                          {formatCurrency(block.extra.productPrice)}
                        </p>
                      ) : null}
                    </div>
                  </Link>

                  <Link
                    to={targetUrl}
                    className="px-4 py-2 bg-[#D96B8A] hover:bg-[#C24A6D] text-white text-xs font-semibold rounded-xl transition-colors shadow-xs inline-flex items-center gap-1.5 shrink-0"
                  >
                    <ShoppingBag className="w-3.5 h-3.5" />
                    <span>Xem chi tiết</span>
                  </Link>
                </div>
              );

            default:
              return null;
          }
        })}
      </div>

      {/* Share & Save bar */}
      <div className="pt-8 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
        <span className="italic">Cảm ơn bạn đã đọc bài viết tại Dyadia Journal</span>
        <Link
          to="/products"
          className="font-semibold text-slate-900 hover:text-amber-800 underline underline-offset-4"
        >
          Khám phá 31 mẫu lens mới nhất →
        </Link>
      </div>

      {/* Related Articles */}
      {relatedPosts.length > 0 && (
        <section className="pt-12 border-t border-rose-100 space-y-6">
          <h3 className="text-xl font-serif font-normal text-slate-900">
            Bài Viết Liên Quan Khác
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {relatedPosts.map((rel) => (
              <Link
                key={rel.id}
                to={`/blog/${rel.slug}`}
                className="group bg-white border border-rose-100 rounded-xl overflow-hidden hover:shadow-md transition-all flex flex-col"
              >
                <div className="aspect-[16/10] overflow-hidden bg-slate-100 relative">
                  <img
                    src={rel.cover_image}
                    alt={rel.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <span className="absolute top-2.5 left-2.5 text-[9px] font-semibold text-slate-800 bg-white/95 backdrop-blur-xs px-2.5 py-0.5 rounded-full shadow-xs">
                    {rel.category}
                  </span>
                </div>
                <div className="p-4 flex-1 flex flex-col justify-center">
                  <h4 className="text-xs font-serif font-medium text-slate-900 line-clamp-2 group-hover:text-[#D96B8A] transition-colors leading-snug">
                    {rel.title}
                  </h4>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}
    </article>
  );
};
