/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import {
  MessageSquare,
  X,
  Send,
  Sparkles,
  RotateCcw,
  Settings,
  ExternalLink,
  ShoppingBag,
  CheckCircle2,
  AlertCircle,
  ChevronRight,
} from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { chatService, ChatMessage } from '../../services/chatService.ts';

export const ChatbotWidget: React.FC = () => {
  const location = useLocation();
  const isAdminPath = location.pathname.startsWith('/admin');
  const [isOpen, setIsOpen] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [conversationId] = useState(() => {
    const existing = sessionStorage.getItem('dyadia_chat_session');
    if (existing) return existing;
    const newId = `dyadia-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
    sessionStorage.setItem('dyadia_chat_session', newId);
    return newId;
  });

  const defaultWelcomeMessage: ChatMessage = {
    id: 'msg-welcome',
    sender: 'bot',
    text: `Chào bạn! Mình là **Dyadia Concierge** — Trợ lý tư vấn kính áp tròng & chọn màu chuẩn Hàn 🌸.\n\nTại Dyadia, lens được **định giá theo từng chiếc độc lập**, bạn có thể tự do chọn độ cận riêng cho từng bên mắt!\n\nBạn đang cần tìm mẫu lens đi học/đi làm, lens dự tiệc hay muốn mình hướng dẫn cách chọn độ cận phù hợp nha?`,
    timestamp: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
  };

  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    const persisted = chatService.loadPersistedMessages();
    return persisted.length > 0 ? persisted : [defaultWelcomeMessage];
  });

  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [webhookUrlInput, setWebhookUrlInput] = useState(chatService.getWebhookUrl());
  const [webhookStatus, setWebhookStatus] = useState<string>('');

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
      setTimeout(() => inputRef.current?.focus(), 150);
    }
  }, [messages, isOpen]);

  useEffect(() => {
    chatService.savePersistedMessages(messages);
  }, [messages]);

  const handleSend = async (textToSend?: string) => {
    const text = textToSend || inputValue;
    if (!text.trim() || isLoading) return;

    const userMsg: ChatMessage = {
      id: `usr-${Date.now()}`,
      sender: 'user',
      text: text.trim(),
      timestamp: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInputValue('');
    setIsLoading(true);

    try {
      const reply = await chatService.sendMessage(userMsg.text, conversationId);
      const botMsg: ChatMessage = {
        id: `bot-${Date.now()}`,
        sender: 'bot',
        text: reply,
        timestamp: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, botMsg]);
    } catch (err) {
      console.error('[ChatWidget] Error sending message:', err);
      const errorMsg: ChatMessage = {
        id: `bot-err-${Date.now()}`,
        sender: 'bot',
        text: 'Rất tiếc, đã có gián đoạn kết nối tạm thời. Bạn vui lòng thử lại hoặc liên hệ Hotline **0783 465 079** để được tư vấn viên hỗ trợ ngay nhé!',
        timestamp: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, botMsgOrErr(errorMsg)]);
    } finally {
      setIsLoading(false);
    }
  };

  const botMsgOrErr = (m: ChatMessage) => m;

  const handleClearHistory = () => {
    if (window.confirm('Bạn có muốn làm mới cuộc trò chuyện này không?')) {
      chatService.clearHistory();
      setMessages([defaultWelcomeMessage]);
    }
  };

  const handleSaveWebhook = (e: React.FormEvent) => {
    e.preventDefault();
    chatService.setWebhookUrl(webhookUrlInput);
    setWebhookStatus('Đã cập nhật cấu hình Webhook thành công!');
    setTimeout(() => {
      setWebhookStatus('');
      setShowSettings(false);
    }, 1500);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSend();
    }
  };

  const quickPrompts = [
    { label: '🌸 Chọn độ cận 2 mắt', prompt: 'Hướng dẫn mình cách chọn độ cận cho mắt trái và mắt phải từ kính gọng sang lens' },
    { label: '✨ Mẫu lens tự nhiên', prompt: 'Gợi ý các mẫu lens nâu tự nhiên trong trẻo để đi học hoặc đi làm hàng ngày' },
    { label: '🎁 Nhận mã giảm 10%', prompt: 'Mình có thể lấy mã giảm giá 10% và ưu đãi miễn phí vận chuyển không?' },
    { label: '🛡️ Chính sách 1 đổi 1', prompt: 'Chính sách bảo hành nếu đeo lens bị cộm rát mắt được quy định như thế nào?' },
  ];

  // Helper to render basic markdown formatting: **bold**, bullet points, images ![alt](url), and [Link](url)
  const renderFormattedText = (rawText: string) => {
    const lines = rawText.split('\n');
    return lines.map((line, lineIdx) => {
      // 1. Check for markdown images ![alt](url)
      const imageRegex = /!\[([^\]]*)\]\(([^)]+)\)/g;
      const imgMatch = imageRegex.exec(line);
      if (imgMatch) {
        const textBefore = line.substring(0, imgMatch.index).trim();
        const textAfter = line.substring(imgMatch.index + imgMatch[0].length).trim();
        const altText = imgMatch[1] || 'Kính áp tròng Dyadia Lens';
        const imgUrl = imgMatch[2];
        return (
          <div key={lineIdx} className="my-1.5">
            {textBefore && <p className="mb-1.5">{renderBoldText(textBefore)}</p>}
            <div className="overflow-hidden rounded-xl border border-rose-100 bg-white shadow-xs">
              <img
                src={imgUrl}
                alt={altText}
                loading="lazy"
                onError={(e) => {
                  (e.target as HTMLElement).style.display = 'none';
                }}
                className="w-full max-h-48 object-cover hover:scale-105 transition-transform duration-300"
              />
              {altText && (
                <div className="p-1.5 text-[10px] text-slate-500 font-medium text-center bg-[#FFF9FA]">
                  {altText}
                </div>
              )}
            </div>
            {textAfter && <p className="mt-1.5">{renderBoldText(textAfter)}</p>}
          </div>
        );
      }

      // 2. Regex for Markdown links [text](url)
      const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
      const parts: React.ReactNode[] = [];
      let lastIndex = 0;
      let match;

      while ((match = linkRegex.exec(line)) !== null) {
        if (match.index > lastIndex) {
          parts.push(renderBoldText(line.substring(lastIndex, match.index)));
        }
        const linkText = match[1];
        const linkUrl = match[2];

        if (linkUrl.startsWith('/')) {
          parts.push(
            <Link
              key={`${lineIdx}-${match.index}`}
              to={linkUrl}
              onClick={() => setIsOpen(false)}
              className="inline-flex items-center gap-1 font-semibold text-[#B84A6A] underline underline-offset-2 hover:text-[#832B47] bg-rose-50 px-1.5 py-0.5 rounded transition-colors"
            >
              <span>{linkText}</span>
              <ChevronRight className="w-3 h-3" />
            </Link>
          );
        } else {
          parts.push(
            <a
              key={`${lineIdx}-${match.index}`}
              href={linkUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 font-semibold text-[#B84A6A] underline underline-offset-2 hover:text-[#832B47]"
            >
              <span>{linkText}</span>
              <ExternalLink className="w-2.5 h-2.5" />
            </a>
          );
        }
        lastIndex = match.index + match[0].length;
      }

      if (lastIndex < line.length) {
        parts.push(renderBoldText(line.substring(lastIndex)));
      }

      const isBullet = line.trim().startsWith('•') || line.trim().startsWith('-');

      return (
        <p key={lineIdx} className={`${isBullet ? 'pl-2 text-slate-800' : ''} ${lineIdx > 0 ? 'mt-1' : ''}`}>
          {parts.length > 0 ? parts : renderBoldText(line)}
        </p>
      );
    });
  };

  const renderBoldText = (text: string) => {
    const parts = text.split(/(\*\*[^*]+\*\*)/g);
    return parts.map((part, i) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return <strong key={i} className="font-semibold text-slate-900">{part.slice(2, -2)}</strong>;
      }
      return part;
    });
  };

  const isConnectedToN8N = chatService.hasWebhookConfigured();

  return (
    <div className="fixed bottom-5 right-5 z-50 font-sans">
      {/* FLOATING TOGGLE BUTTON */}
      {!isOpen && (
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className="group flex items-center gap-3 px-4 py-3 bg-gradient-to-r from-[#D96B8A] to-[#E48DA5] hover:from-[#C24A6D] hover:to-[#D96B8A] text-white rounded-full shadow-2xl shadow-rose-200/80 hover:scale-[1.03] transition-all duration-300 border border-rose-200 cursor-pointer"
          aria-label="Mở tư vấn AI Dyadia Lens"
        >
          <div className="relative flex items-center justify-center w-8 h-8 rounded-full bg-white/20 border border-white/40">
            <Sparkles className="w-4 h-4 text-white group-hover:rotate-12 transition-transform" />
            <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-400 rounded-full ring-2 ring-[#D96B8A] animate-pulse" />
          </div>
          <div className="text-left">
            <span className="block text-xs font-semibold tracking-wide text-white">Tư vấn Lens AI</span>
            <span className="block text-[10px] text-rose-50">Chọn độ cận & phối màu</span>
          </div>
        </button>
      )}

      {/* CHAT WINDOW PANEL */}
      {isOpen && (
        <div className="w-[360px] sm:w-[380px] h-[540px] max-h-[85vh] bg-white rounded-3xl shadow-2xl shadow-rose-100/70 border border-rose-100 flex flex-col overflow-hidden animate-in zoom-in-95 fade-in duration-200">
          
          {/* HEADER */}
          <div className="bg-gradient-to-r from-[#D96B8A] to-[#E17997] text-white px-4 py-3.5 flex items-center justify-between shrink-0 border-b border-rose-200/40">
            <div className="flex items-center gap-2.5">
              <div className="relative">
                <div className="w-9 h-9 rounded-full bg-white/20 border border-white/40 flex items-center justify-center">
                  <Sparkles className="w-4 h-4 text-white" />
                </div>
                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-400 rounded-full ring-2 ring-[#D96B8A]" />
              </div>
              <div>
                <h4 className="text-xs font-serif font-bold tracking-wide text-white">Dyadia Concierge</h4>
                <p className="text-[10px] text-rose-50">
                  {isAdminPath
                    ? (isConnectedToN8N ? '🟢 n8n Webhook Connected' : '✨ AI Engine cục bộ')
                    : 'Tư vấn chọn độ & bảng màu'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1 text-rose-100">
              {isAdminPath && (
                <button
                  type="button"
                  onClick={() => setShowSettings(!showSettings)}
                  className={`p-1.5 hover:text-white hover:bg-white/20 rounded-lg transition-colors cursor-pointer ${showSettings ? 'text-white bg-white/20' : ''}`}
                  title="Cài đặt n8n Webhook (Chỉ Quản trị viên nhìn thấy)"
                >
                  <Settings className="w-3.5 h-3.5" />
                </button>
              )}
              <button
                type="button"
                onClick={handleClearHistory}
                className="p-1.5 hover:text-white hover:bg-white/20 rounded-lg transition-colors cursor-pointer"
                title="Làm mới cuộc trò chuyện"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="p-1.5 hover:text-white hover:bg-white/20 rounded-lg transition-colors cursor-pointer"
                aria-label="Đóng chat"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* SETTINGS PANEL (POPUP DROPDOWN) */}
          {showSettings && (
            <div className="p-4 bg-[#FFF5F7] text-[#3A232B] border-b border-rose-100 text-xs space-y-3 animate-in slide-in-from-top duration-150">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-[#B84A6A] flex items-center gap-1.5">
                  <Settings className="w-3.5 h-3.5" />
                  Cấu hình n8n Webhook
                </span>
                <button
                  type="button"
                  onClick={() => setShowSettings(false)}
                  className="text-slate-400 hover:text-rose-600"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
              <p className="text-[11px] text-slate-600 leading-relaxed">
                Dán URL Webhook từ workflow n8n của bạn (Test hoặc Production URL) để kết nối trực tiếp với mô hình Google Gemini.
              </p>
              <form onSubmit={handleSaveWebhook} className="space-y-2">
                <input
                  type="url"
                  value={webhookUrlInput}
                  onChange={(e) => setWebhookUrlInput(e.target.value)}
                  placeholder="https://your-n8n.com/webhook/dyadia-chat"
                  className="w-full px-3 py-1.5 bg-white border border-rose-200 rounded-lg text-slate-900 text-xs placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-rose-400"
                />
                {webhookStatus && (
                  <p className="text-[11px] text-emerald-600 font-medium flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" />
                    {webhookStatus}
                  </p>
                )}
                <div className="flex items-center justify-between pt-1">
                  <button
                    type="button"
                    onClick={() => {
                      chatService.setWebhookUrl('');
                      setWebhookUrlInput('');
                      setWebhookStatus('Đã chuyển về AI Engine cục bộ');
                      setTimeout(() => setWebhookStatus(''), 1500);
                    }}
                    className="text-[10px] text-rose-600 hover:underline cursor-pointer"
                  >
                    Xóa kết nối
                  </button>
                  <button
                    type="submit"
                    className="px-3 py-1 bg-[#D96B8A] text-white font-semibold text-[11px] rounded-md hover:bg-[#C24A6D] transition-colors cursor-pointer"
                  >
                    Lưu kết nối
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* MESSAGES AREA */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3.5 bg-[#FFF9FA]">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
              >
                <div
                  className={`max-w-[88%] px-3.5 py-2.5 rounded-2xl text-xs leading-relaxed shadow-xs ${
                    msg.sender === 'user'
                      ? 'bg-[#D96B8A] text-white rounded-tr-xs'
                      : 'bg-white text-slate-800 border border-rose-100 rounded-tl-xs'
                  }`}
                >
                  {renderFormattedText(msg.text)}
                </div>
                <span className="text-[9px] text-slate-400 mt-1 px-1">{msg.timestamp}</span>
              </div>
            ))}

            {isLoading && (
              <div className="flex items-center gap-2 px-3.5 py-2.5 bg-white border border-rose-100 rounded-2xl rounded-tl-xs w-28 shadow-xs">
                <Sparkles className="w-3.5 h-3.5 text-[#D96B8A] animate-spin" />
                <span className="text-[10px] text-slate-500 font-medium">Dyadia đang gõ...</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* QUICK PROMPT CHIPS */}
          <div className="px-3 py-2 bg-white border-t border-rose-100/70 flex items-center gap-1.5 overflow-x-auto no-scrollbar shrink-0">
            {quickPrompts.map((q) => (
              <button
                key={q.label}
                type="button"
                onClick={() => handleSend(q.prompt)}
                className="text-[10px] text-[#832B47] bg-[#FFF5F7] hover:bg-rose-100 border border-rose-100 px-2.5 py-1 rounded-full whitespace-nowrap transition-all shrink-0 cursor-pointer"
              >
                {q.label}
              </button>
            ))}
          </div>

          {/* INPUT FORM */}
          <div className="p-3 bg-white border-t border-rose-100 flex items-center gap-2 shrink-0">
            <input
              ref={inputRef}
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Nhập câu hỏi về màu lens, độ cận..."
              className="flex-1 px-3.5 py-2 text-xs bg-[#FFF9FA] border border-rose-200/80 rounded-xl focus:outline-none focus:ring-1 focus:ring-rose-400 transition-all placeholder:text-slate-400 text-slate-900"
            />
            <button
              type="button"
              onClick={() => handleSend()}
              disabled={!inputValue.trim() || isLoading}
              className="p-2.5 bg-[#D96B8A] text-white rounded-xl hover:bg-[#C24A6D] disabled:opacity-40 transition-colors cursor-pointer shrink-0"
              aria-label="Gửi tin nhắn"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
