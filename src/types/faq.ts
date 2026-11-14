/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: string;
  display_order: number;
  created_at?: string;
  updated_at?: string;
}
