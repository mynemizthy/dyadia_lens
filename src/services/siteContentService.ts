/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface HeroSlide {
  id: string | number;
  title: string;
  kicker: string;
  description: string;
  image: string;
  ctaText: string;
  ctaLink: string;
  align?: 'left' | 'right';
}

export interface SiteSettings {
  announcementText: string;
  announcementEnabled: boolean;
  announcementLink?: string;
  heroSlides: HeroSlide[];
}

const SITE_SETTINGS_KEY = 'dyadia_site_settings_v8';

export const DEFAULT_HERO_SLIDES: HeroSlide[] = [
  {
    id: 'slide-cattitude',
    title: 'Mắt Mèo Tinh Nghịch Sắc Sảo',
    kicker: 'Cat-titude Kristin Series',
    description: 'Đường vân viền mèo mở tròng độc đáo, chất liệu Silicone Hydrogel êm dịu suốt ngày dài năng động.',
    image: '/images/banners/catitude-banner.webp',
    ctaText: 'Khám phá ngay',
    ctaLink: '/products/cat-titude-kristin-tabby-1-day-brown',
    align: 'right',
  },
  {
    id: 'slide-one-and-only',
    title: 'Ánh Nhìn Trong Trẻo Toả Sáng',
    kicker: 'One&Only Kristin Series',
    description: 'Dòng lens bán chạy số 1 Hàn Quốc với công nghệ khóa ẩm PC Hydrogel giúp mắt long lanh tự nhiên.',
    image: '/images/banners/one-and-only-banner.png',
    ctaText: 'Xem bộ sưu tập',
    ctaLink: '/products?category=Lens+1+ng%C3%A0y',
    align: 'left',
  },
  {
    id: 'slide-dolly',
    title: 'Ngọt Ngào Như Búp Bê Hàn Quốc',
    kicker: 'Dolly Kristin Series',
    description: 'Tone Nâu mật ong và Choco tôn da người Châu Á, hoàn hảo cho đi học, đi làm và dự tiệc hàng ngày.',
    image: '/images/banners/dolly-banner.png',
    ctaText: 'Mua sắm ngay',
    ctaLink: '/products',
    align: 'right',
  },
];

export const DEFAULT_SITE_SETTINGS: SiteSettings = {
  announcementText: 'Ưu đãi tháng này: Miễn phí vận chuyển toàn quốc cho đơn hàng từ 299.000đ | Tặng kèm khay đựng lens cao cấp',
  announcementEnabled: true,
  announcementLink: '/products',
  heroSlides: DEFAULT_HERO_SLIDES,
};

export const siteContentService = {
  getSettings(): SiteSettings {
    try {
      const raw = localStorage.getItem(SITE_SETTINGS_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed && Array.isArray(parsed.heroSlides) && parsed.heroSlides.length > 0) {
          return {
            ...DEFAULT_SITE_SETTINGS,
            ...parsed,
          };
        }
      }
    } catch (err) {
      console.warn('Error reading site settings from storage:', err);
    }
    return DEFAULT_SITE_SETTINGS;
  },

  saveSettings(settings: SiteSettings): void {
    try {
      localStorage.setItem(SITE_SETTINGS_KEY, JSON.stringify(settings));
      window.dispatchEvent(new Event('dyadia_site_settings_updated'));
    } catch (err) {
      console.error('Error saving site settings:', err);
    }
  },

  resetDefaults(): SiteSettings {
    try {
      localStorage.removeItem(SITE_SETTINGS_KEY);
      window.dispatchEvent(new Event('dyadia_site_settings_updated'));
    } catch (err) {
      console.error('Error resetting site settings:', err);
    }
    return DEFAULT_SITE_SETTINGS;
  },
};
