/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface PolicyItem {
  id: string;
  title: string;
  category: string;
  content: string;
  icon?: string;
  display_order: number;
  created_at?: string;
  updated_at?: string;
}
