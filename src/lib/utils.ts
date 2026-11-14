/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export function formatCurrency(amount: number | null | undefined): string {
  if (amount === null || amount === undefined) {
    return 'Đang cập nhật';
  }
  return new Intl.NumberFormat('vi-VN').format(amount) + 'đ';
}

export function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[đĐ]/g, 'd')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export function generateOrderCode(): string {
  const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, '');
  const randomPart = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `DYA-${dateStr}-${randomPart}`;
}

export function cn(...classes: (string | boolean | undefined | null)[]): string {
  return classes.filter(Boolean).join(' ');
}
