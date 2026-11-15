/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface BrandAboutData {
  title: string;
  subtitle: string;
  story_title: string;
  story_content_1: string;
  story_content_2: string;
  story_image: string;
  philosophy_1_title: string;
  philosophy_1_desc: string;
  philosophy_2_title: string;
  philosophy_2_desc: string;
  philosophy_3_title: string;
  philosophy_3_desc: string;
  note_title: string;
  note_content: string;
}

export const DEFAULT_ABOUT_DATA: BrandAboutData = {
  title: 'Nghệ Thuật Ánh Nhìn Trong Trẻo Chuẩn Hàn',
  subtitle: 'Dyadia Lens được thành lập với sứ mệnh mang đến giải pháp kính áp tròng thẩm mỹ cao cấp, an toàn và cá nhân hóa tối đa cho người đeo tại Việt Nam.',
  story_title: 'Thấu hiểu nỗi băn khoăn khi hai mắt lệch độ cận',
  story_content_1: 'Hầu hết người đeo kính áp tròng cận thị đều gặp tình trạng mắt trái và mắt phải có độ cận chênh lệch nhau (ví dụ: mắt trái -2.00, mắt phải -3.00). Tại các cửa hàng truyền thống, việc phải mua cả hộp 2 chiếc cùng độ khiến khách hàng buộc phải mua gấp đôi số lượng, gây lãng phí lớn.',
  story_content_2: 'Tại Dyadia Lens, chúng tôi xây dựng quy trình đóng gói và thương mại điện tử chuyên nghiệp hỗ trợ định giá và đặt mua lẻ theo từng chiếc lens. Khách hàng hoàn toàn chủ động kết hợp độ cận chuẩn xác cho từng bên mắt với chi phí tiết kiệm nhất.',
  story_image: '/images/models/model_brand_story.jpg',
  philosophy_1_title: '1. Êm ái & Dưỡng ẩm',
  philosophy_1_desc: 'Ưu tiên các chất liệu thế hệ mới như Silicone Hydrogel và PC Hydrogel với khả năng thẩm thấu oxy cao, giữ mắt luôn sáng khỏe và ngậm ẩm suốt ngày dài làm việc.',
  philosophy_2_title: '2. Vân lens K-Beauty',
  philosophy_2_desc: 'Lấy cảm hứng từ nét đẹp tự nhiên, trong trẻo của các thần tượng Hàn Quốc. Hạt màu nano được in chìm nhiều tầng tạo hiệu ứng ánh nhìn long lanh, không lộ vân giả.',
  philosophy_3_title: '3. Minh bạch & Tận tâm',
  philosophy_3_desc: 'Thông số kỹ thuật (DIA, Base Curve, Water Content) được công khai minh bạch. Đội ngũ tư vấn viên nhãn khoa luôn sẵn sàng hỗ trợ giải đáp từ 08:00 – 17:30 (Thứ 2 – Thứ 7).',
  note_title: 'Cam kết Chính hãng & An toàn Nhãn khoa',
  note_content: 'Tất cả sản phẩm kính áp tròng tại Dyadia Lens đều đảm bảo nguồn gốc chính hãng Hàn Quốc, công khai đầy đủ thông số kỹ thuật (DIA, G.DIA, Base Curve, độ ẩm) và áp dụng chính sách kiểm hàng, hỗ trợ đổi trả bảo hành 1 đổi 1 nếu có lỗi từ nhà sản xuất.',
};

const ABOUT_STORAGE_KEY = 'dyadia_about_data_v1';

export const aboutService = {
  async getAboutData(): Promise<BrandAboutData> {
    try {
      const res = await fetch('/api/about');
      if (res.ok) {
        const json = await res.json();
        if (json.success && json.data) {
          localStorage.setItem(ABOUT_STORAGE_KEY, JSON.stringify(json.data));
          return json.data;
        }
      }
    } catch {
      // fallback
    }

    try {
      const raw = localStorage.getItem(ABOUT_STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed && parsed.title) return parsed;
      }
    } catch {
      // ignore
    }

    return DEFAULT_ABOUT_DATA;
  },

  async saveAboutData(data: BrandAboutData, token?: string): Promise<boolean> {
    try {
      const res = await fetch('/api/admin/about', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-key': 'dyadia2026',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(data),
      });
      if (res.ok) {
        localStorage.setItem(ABOUT_STORAGE_KEY, JSON.stringify(data));
        window.dispatchEvent(new Event('dyadia_about_updated'));
        return true;
      }
    } catch {
      // ignore
    }

    localStorage.setItem(ABOUT_STORAGE_KEY, JSON.stringify(data));
    window.dispatchEvent(new Event('dyadia_about_updated'));
    return true;
  },
};
