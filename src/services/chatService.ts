/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface ChatMessage {
  id: string;
  sender: 'user' | 'bot';
  text: string;
  timestamp: string;
}

const STORAGE_KEY_WEBHOOK = 'dyadia_n8n_webhook_url';
const STORAGE_KEY_HISTORY = 'dyadia_chat_messages';

export const chatService = {
  /**
   * Get configured n8n Webhook URL from localStorage or environment
   */
  getWebhookUrl(): string {
    const fromStorage = localStorage.getItem(STORAGE_KEY_WEBHOOK);
    if (fromStorage && fromStorage.trim().startsWith('http')) {
      return fromStorage.trim();
    }
    const envUrl = import.meta.env.VITE_N8N_CHAT_WEBHOOK_URL as string | undefined;
    if (envUrl && envUrl.trim().startsWith('http')) {
      return envUrl.trim();
    }
    return '';
  },

  /**
   * Save or update n8n Webhook URL directly from the Chatbot UI
   */
  setWebhookUrl(url: string): void {
    if (!url.trim()) {
      localStorage.removeItem(STORAGE_KEY_WEBHOOK);
    } else {
      localStorage.setItem(STORAGE_KEY_WEBHOOK, url.trim());
    }
  },

  /**
   * Check if active n8n Webhook connection is configured
   */
  hasWebhookConfigured(): boolean {
    return Boolean(this.getWebhookUrl());
  },

  /**
   * Load persisted chat messages from localStorage
   */
  loadPersistedMessages(): ChatMessage[] {
    try {
      const raw = localStorage.getItem(STORAGE_KEY_HISTORY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {
      // Ignore JSON error
    }
    return [];
  },

  /**
   * Save chat messages to localStorage
   */
  savePersistedMessages(messages: ChatMessage[]): void {
    try {
      localStorage.setItem(STORAGE_KEY_HISTORY, JSON.stringify(messages.slice(-50)));
    } catch {
      // Ignore quota error
    }
  },

  /**
   * Clear chat history
   */
  clearHistory(): void {
    localStorage.removeItem(STORAGE_KEY_HISTORY);
  },

  /**
   * Centralized message sender.
   * Sends to n8n Webhook with Google Gemini Agent if configured,
   * otherwise uses intelligent local K-beauty lens consultant engine.
   */
  async sendMessage(message: string, conversationId: string): Promise<string> {
    // 1. Try secure backend proxy /api/chat first (keeps n8n URL 100% hidden from client)
    try {
      const serverProxyRes = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: message.trim(),
          sessionId: conversationId,
          conversationId,
        }),
      });

      if (serverProxyRes.ok) {
        const proxyJson = await serverProxyRes.json().catch(() => null);
        if (proxyJson && proxyJson.success && proxyJson.reply) {
          let finalReply = String(proxyJson.reply).trim();
          if (Array.isArray(proxyJson.images) && proxyJson.images.length > 0) {
            for (const img of proxyJson.images) {
              if (typeof img === 'string' && img && !finalReply.includes(img)) {
                finalReply += `\n\n![Ảnh sản phẩm](${img})`;
              }
            }
          }
          return finalReply;
        }
      }
    } catch {
      // Proceed to client direct webhook or fallback
    }

    // 2. Client-configured n8n Webhook URL (for dev testing)
    const webhookUrl = this.getWebhookUrl();

    if (webhookUrl) {
      try {
        const response = await fetch(webhookUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            message: message.trim(),
            chatInput: message.trim(),
            sessionId: conversationId,
            conversationId,
            timestamp: new Date().toISOString(),
          }),
        });

        if (response.ok) {
          const data = await response.json().catch(() => null);
          if (data) {
            const botReply =
              data.reply ||
              data.output ||
              data.text ||
              data.message ||
              (typeof data === 'string' ? data : null);
            if (botReply) {
              let finalReply = String(botReply).trim();
              if (Array.isArray(data.images) && data.images.length > 0) {
                for (const img of data.images) {
                  if (typeof img === 'string' && img && !finalReply.includes(img)) {
                    finalReply += `\n\n![Ảnh sản phẩm](${img})`;
                  }
                }
              }
              return finalReply;
            }
          }
        } else {
          console.warn(`[chatService] n8n Webhook responded with HTTP ${response.status}`);
        }
      } catch (err) {
        console.warn('[chatService] n8n Webhook network error, falling back to local lens consultant:', err);
      }
    }

    // Realistic beauty & optical consultant response engine (Fallback & Demo Mode)
    await new Promise((resolve) => setTimeout(resolve, 600)); // Natural typing latency
    const lower = message.toLowerCase();

    if (lower.includes('độ cận') || lower.includes('chọn độ') || lower.includes('diopter') || lower.includes('độ kính')) {
      return `Dạ đối với kính áp tròng, do lens áp sát giác mạc (không có khoảng cách đỉnh 12mm như kính gọng), cách chọn chuẩn như sau:\n\n• **Dưới -3.00 độ:** Chọn đúng độ cận như kính gọng.\n• **Từ -3.00 đến -5.00 độ:** Hạ từ -0.25 độ (Ví dụ: Cận -4.00 nên chọn lens -3.75).\n• **Từ -5.25 độ trở lên:** Hạ từ -0.50 độ.\n\n✨ Đặc biệt tại Dyadia, toàn bộ lens được **định giá theo từng chiếc lẻ**, bạn có thể thoải mái chọn độ cận riêng biệt cho mắt trái và mắt phải mà không sợ lãng phí nha!`;
    }

    if (lower.includes('1 chiếc') || lower.includes('1 đôi') || lower.includes('chiếc lens') || lower.includes('giá') || lower.includes('lẻ')) {
      return `Tại Dyadia Lens, toàn bộ giá hiển thị là **GIÁ CHO 1 CHIẾC LENS LẺ**.\n\nĐiều này giúp bạn tự do tùy biến:\n• Mắt trái -1.50, mắt phải -3.00 ➔ Chỉ cần nhặt 2 chiếc đúng độ cận của từng mắt!\n• Tiết kiệm tối đa chi phí so với việc phải mua 2 hộp cùng lúc ở nơi khác.\n\n👉 Bạn hãy ghé xem ngay [Danh sách Sản phẩm Kính áp tròng](/products) để chọn mẫu ưng ý nhé!`;
    }

    if (lower.includes('màu') || lower.includes('tự nhiên') || lower.includes('đi học') || lower.includes('tone da') || lower.includes('da ngăm') || lower.includes('gợi ý')) {
      return `Dạ nếu bạn đang tìm kiếm màu lens hợp phong cách:\n\n1. **Tự nhiên, trong trẻo đi học/đi làm:**\n• [Cat-titude Kristin Choco Paw](/products/cat-titude-kristin-choco-1-day-paw) - Tone nâu chocolate ngọt ngào, G.DIA 13.0mm tôn mắt tự nhiên.\n• [Dolly Choco](/products/dolly-1-day-choco) - Nâu hạt dẻ baby cho đôi mắt long lanh.\n\n2. **Cuốn hút, dự tiệc, chụp ảnh:**\n• [Secretive Gray](/products/secretive-30-day-gray) - Xám ánh trăng khuyết cực kỳ bắt sáng và sang trọng!\n\nBạn đang muốn chọn lens cho dịp nào để mình tư vấn chi tiết hơn nhé? 🌸`;
    }

    if (lower.includes('mã giảm') || lower.includes('voucher') || lower.includes('khuyến mại') || lower.includes('ưu đãi') || lower.includes('freeship')) {
      return `🎁 **Ưu đãi độc quyền dành cho bạn hôm nay:**\n\n• Nhập mã **\`WELCOME10\`** ở bước thanh toán để được **giảm ngay 10%** cho đơn hàng đầu tiên!\n• Tự động **MIỄN PHÍ VẬN CHUYỂN TOÀN QUỐC** cho mọi đơn hàng từ 299.000đ trở lên.\n\nBạn đã chọn được mẫu lens nào chưa để mình hướng dẫn chốt đơn luôn nha? 🛍️`;
    }

    if (lower.includes('đơn hàng') || lower.includes('mã đơn') || lower.includes('giao hàng') || lower.includes('ship')) {
      return `Đơn hàng của bạn sẽ được đóng gói chuẩn quy trình và gửi đi trong vòng 24h. Dyadia miễn phí vận chuyển cho đơn từ 299.000đ trên toàn quốc!\n\nBạn có thể kiểm tra trạng thái đơn bất cứ lúc nào trong trang [Lịch sử Đơn hàng](/account) hoặc liên hệ Hotline 0783 465 079 để được hỗ trợ nhanh nhất nhé!`;
    }

    if (lower.includes('bảo quản') || lower.includes('ngâm') || lower.includes('nhỏ mắt') || lower.includes('bảo hành') || lower.includes('cộm')) {
      return `🛡️ **Chính sách & An tâm sử dụng tại Dyadia:**\n\n• **Bảo hành 1 đổi 1 trong 7 ngày:** Nếu lens có lỗi cộm rát mắt, Dyadia hỗ trợ đổi mới và chịu 100% phí vận chuyển.\n• **Chất liệu Silicone Hydrogel:** Ngậm nước cao, êm ái suốt 12 tiếng liên tục.\n• Nhớ rửa tay thật sạch và ngâm kính trong dung dịch chuyên dụng trước khi đeo bạn nhé! Xem thêm tại [Cẩm nang Hướng dẫn sử dụng](/policy).`;
    }

    return `Chào bạn! Mình là Trợ lý Tư vấn Kính Áp Tròng Dyadia Lens 🌸.\n\nBạn đang cần tìm mẫu lens tự nhiên đi học/đi làm, lens dự tiệc cuốn hút hay cần mình hướng dẫn cách chọn độ cận riêng cho từng mắt vậy ạ?`;
  },
};
